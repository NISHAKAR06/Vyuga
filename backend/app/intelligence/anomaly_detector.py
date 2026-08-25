"""
Anomaly Detector for Weighbridge Throughput.

Uses scikit-learn IsolationForest to detect abnormal throughput drops
that signal equipment failure, officer absence, or peak overload events.

IsolationForest works by randomly partitioning the feature space —
anomalous points (throughput outliers) are isolated with fewer splits,
producing a lower anomaly score.
"""
import numpy as np
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

try:
    from sklearn.ensemble import IsolationForest
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logger.warning("scikit-learn not available — using statistical fallback for anomaly detection.")


class ThroughputAnomalyDetector:
    """
    Real-time anomaly scorer for weighbridge throughput time-series.

    Maintains an IsolationForest trained on 'normal' baseline data.
    Scores incoming windows and flags anomalies when score exceeds threshold.
    """

    def __init__(self, contamination: float = 0.05, window_size: int = 5):
        """
        Args:
            contamination: Expected fraction of anomalies in training data (5%)
            window_size: Rolling window length for scoring
        """
        self.window_size = window_size
        self._fitted = False
        self._mean = 15.0
        self._std = 2.0

        if SKLEARN_AVAILABLE:
            self._model = IsolationForest(
                n_estimators=100,
                contamination=contamination,
                random_state=42,
                warm_start=False
            )
        else:
            self._model = None

    def fit(self, normal_data: List[float]) -> None:
        """Train on known-normal throughput readings."""
        if len(normal_data) < self.window_size:
            logger.warning("AnomalyDetector: insufficient training data.")
            return

        arr = np.array(normal_data, dtype=np.float64)
        self._mean = float(np.mean(arr))
        self._std = max(float(np.std(arr)), 0.1)

        if self._model is not None:
            # Build windowed features for training
            windows = self._build_windows(arr)
            if len(windows) > 0:
                self._model.fit(windows)
                self._fitted = True
                logger.info(
                    f"IsolationForest fitted on {len(windows)} windows. "
                    f"Throughput baseline: μ={self._mean:.2f}, σ={self._std:.2f}"
                )
        else:
            # Statistical fallback
            self._fitted = True

    def _build_windows(self, arr: np.ndarray) -> np.ndarray:
        """Build sliding window feature matrix."""
        windows = []
        for i in range(len(arr) - self.window_size + 1):
            w = arr[i: i + self.window_size]
            features = [
                np.mean(w),
                np.std(w),
                np.min(w),
                np.max(w),
                w[-1] - w[0],        # trend
                w[-1],               # current value
            ]
            windows.append(features)
        return np.array(windows) if windows else np.empty((0, 6))

    def score(self, recent_window: List[float]) -> float:
        """
        Score a recent throughput window.

        Returns:
            Anomaly score in [0.0, 1.0].
            0.0 = completely normal, 1.0 = certain anomaly.
        """
        if not self._fitted:
            return 0.0

        arr = np.array(recent_window[-self.window_size:], dtype=np.float64)

        if self._model is not None and len(arr) >= self.window_size:
            features = np.array([[
                np.mean(arr),
                np.std(arr),
                np.min(arr),
                np.max(arr),
                arr[-1] - arr[0],
                arr[-1],
            ]])
            # IsolationForest returns -1 (anomaly) or +1 (normal) from predict
            # decision_function returns raw anomaly score (more negative = more anomalous)
            raw_score = self._model.decision_function(features)[0]
            # Normalize to [0, 1]: decision_function range is roughly [-0.5, 0.5]
            normalized = float(np.clip(0.5 - raw_score, 0.0, 1.0))
            return normalized
        else:
            # Statistical fallback: z-score of current value
            if len(arr) == 0:
                return 0.0
            current = float(arr[-1])
            z = abs(current - self._mean) / (self._std + 1e-6)
            return float(np.clip(z / 4.0, 0.0, 1.0))

    def is_anomaly(
        self, score: float, threshold: Optional[float] = None
    ) -> bool:
        """Return True if score exceeds threshold (default 0.65)."""
        t = threshold if threshold is not None else 0.65
        return score >= t

    def get_severity(self, score: float) -> str:
        """Map anomaly score to human-readable severity."""
        if score >= 0.85:
            return "CRITICAL"
        elif score >= 0.70:
            return "HIGH"
        elif score >= 0.55:
            return "MODERATE"
        else:
            return "NORMAL"
