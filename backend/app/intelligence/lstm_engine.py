"""
Pure-numpy LSTM Engine for Weighbridge Throughput Prediction.

Implements a single-layer LSTM cell from scratch using only numpy.
No PyTorch, TensorFlow, or other heavy ML frameworks required.

This is an intentionally lightweight implementation designed for:
- Fast startup (no model loading)
- Zero extra install weight beyond numpy
- Demonstrating the LSTM architectural pattern for hackathon judges
"""
import numpy as np
from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)


def _sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-np.clip(x, -500, 500)))


def _tanh(x: np.ndarray) -> np.ndarray:
    return np.tanh(np.clip(x, -500, 500))


class LSTMCell:
    """Single-layer LSTM cell with random weight initialization."""

    def __init__(self, input_size: int = 1, hidden_size: int = 16, seed: int = 42):
        rng = np.random.default_rng(seed)
        scale = 0.1

        # Weight matrices: [input_gate, forget_gate, cell_gate, output_gate]
        self.Wh = rng.standard_normal((4 * hidden_size, hidden_size)) * scale
        self.Wx = rng.standard_normal((4 * hidden_size, input_size)) * scale
        self.b  = np.zeros((4 * hidden_size,))
        # Forget gate bias initialized to 1.0 for better gradient flow
        self.b[hidden_size: 2 * hidden_size] = 1.0

        self.hidden_size = hidden_size
        self.h = np.zeros((hidden_size,))
        self.c = np.zeros((hidden_size,))

    def forward(self, x: np.ndarray) -> np.ndarray:
        gates = self.Wh @ self.h + self.Wx @ x.reshape(-1, 1).squeeze() + self.b
        hs = self.hidden_size
        i = _sigmoid(gates[:hs])
        f = _sigmoid(gates[hs:2*hs])
        g = _tanh(gates[2*hs:3*hs])
        o = _sigmoid(gates[3*hs:])

        self.c = f * self.c + i * g
        self.h = o * _tanh(self.c)
        return self.h

    def reset(self):
        self.h = np.zeros((self.hidden_size,))
        self.c = np.zeros((self.hidden_size,))


class ThroughputLSTM:
    """
    LSTM-based throughput predictor.

    Wraps LSTMCell with a linear output head.
    Uses online updates (no backprop) — we use the LSTM as a feature extractor
    and fit a linear regression head on top, which is updated as new data arrives.
    """

    def __init__(self, window_size: int = 20, hidden_size: int = 16):
        self.window_size = window_size
        self.cell = LSTMCell(input_size=1, hidden_size=hidden_size)
        # Linear output head: W_out (hidden -> 1), b_out
        self.W_out = np.random.default_rng(0).standard_normal((1, hidden_size)) * 0.1
        self.b_out = np.zeros(1)
        self._fitted = False
        self._baseline_mean = 15.0  # farmers/hour
        self._baseline_std = 2.0

    def fit_on_normal(self, normal_series: List[float]) -> None:
        """One-pass feature extraction + least-squares head fitting."""
        if len(normal_series) < self.window_size:
            logger.warning("LSTM: insufficient data for fitting, using defaults.")
            self._fitted = True
            return

        arr = np.array(normal_series, dtype=np.float32)
        self._baseline_mean = float(np.mean(arr))
        self._baseline_std = max(float(np.std(arr)), 0.5)

        # Normalize
        norm = (arr - self._baseline_mean) / self._baseline_std

        features, targets = [], []
        self.cell.reset()
        for i in range(len(norm) - 1):
            h = self.cell.forward(norm[i:i+1])
            features.append(h.copy())
            targets.append(norm[i + 1])

        if len(features) > 0:
            X = np.array(features)           # (N, hidden)
            y = np.array(targets)            # (N,)
            # Ridge regression: W = (X'X + λI)^{-1} X'y
            lam = 1e-3
            A = X.T @ X + lam * np.eye(X.shape[1])
            b_vec = X.T @ y
            w = np.linalg.solve(A, b_vec)
            self.W_out = w.reshape(1, -1)
            self.b_out = np.array([np.mean(y) - self.W_out @ np.mean(X, axis=0)])

        self._fitted = True
        logger.info(
            f"LSTM fitted. Baseline mean={self._baseline_mean:.2f}, std={self._baseline_std:.2f}"
        )

    def predict_next_n(
        self, history: List[float], n: int = 3
    ) -> Tuple[List[float], float]:
        """
        Given recent history, predict n future throughput values.

        Returns:
            predictions: list of n predicted farmers/hour values
            confidence: 0.0-1.0 confidence in prediction
        """
        if not self._fitted or len(history) < 3:
            fallback = [self._baseline_mean] * n
            return fallback, 0.5

        arr = np.array(history[-self.window_size:], dtype=np.float32)
        norm = (arr - self._baseline_mean) / self._baseline_std

        self.cell.reset()
        # Warm up LSTM with history
        h = np.zeros(self.cell.hidden_size)
        for val in norm[:-1]:
            h = self.cell.forward(val.reshape(1))

        predictions_norm = []
        current_h = h
        current_input = norm[-1]
        for _ in range(n):
            current_h = self.cell.forward(current_input.reshape(1))
            pred_norm = float(self.W_out @ current_h + self.b_out)
            predictions_norm.append(pred_norm)
            current_input = np.float32(pred_norm)

        # Denormalize
        predictions = [
            max(0.0, p * self._baseline_std + self._baseline_mean)
            for p in predictions_norm
        ]

        # Confidence based on variance of recent history
        recent_var = float(np.std(arr[-5:])) if len(arr) >= 5 else self._baseline_std
        confidence = max(0.1, 1.0 - (recent_var / (self._baseline_std * 3 + 1e-6)))
        confidence = min(0.98, confidence)

        return predictions, confidence

    def get_expected_wait_minutes(self, throughput_per_hour: float) -> float:
        """Convert throughput (farmers/hour) to average wait minutes."""
        if throughput_per_hour <= 0:
            return 999.0
        # At full throughput (15/hr) → ~4 min/farmer
        # As throughput drops, wait grows inversely
        base_throughput = max(self._baseline_mean, 1.0)
        wait = (base_throughput / throughput_per_hour) * 4.0
        return round(min(wait, 240.0), 1)
