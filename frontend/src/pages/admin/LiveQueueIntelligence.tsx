import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  ArrowRight,
  Wifi,
  WifiOff,
  TrendingDown,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Brain,
  ShieldAlert,
  Send,
  ThumbsUp,
  ThumbsDown,
  Radio,
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────
interface CentreSnapshot {
  centreId: string;
  centreName: string;
  district: string;
  throughputHistory: number[];
  currentThroughput: number;
  baselineThroughput: number;
  lstmPredictions: number[];
  lstmConfidence: number;
  anomalyScore: number;
  anomalySeverity: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  isAnomalyActive: boolean;
  isFailed: boolean;
  predictedWaitMinutes: number;
  reroutingTriggered: boolean;
  reroutingTriggeredAt: string | null;
  notificationsSent: number;
  capacityRemaining: number;
}

interface NotificationCard {
  farmerId: string;
  farmerName: string;
  phone: string;
  message: string;
  status: string;
  sentAt: string;
  reply?: 'YES' | 'NO';
}

interface ReroutingEvent {
  eventId: string;
  centreId: string;
  centreName: string;
  anomalyScore: number;
  severity: string;
  delayMinutes: number;
  alternativeCentre: string;
  alternativeDistance: number;
  alternativeWaitMinutes: number;
  farmersNotified: number;
  notificationDetails: NotificationCard[];
  whatsappMessage: string;
  timestamp: string;
}

interface EventLogEntry {
  type: string;
  centreId: string;
  centreName: string;
  anomalyScore?: number;
  severity?: string;
  farmersNotified?: number;
  timestamp: string;
}

interface MonitorStatus {
  centres: CentreSnapshot[];
  eventLog: EventLogEntry[];
  reroutingEvents: ReroutingEvent[];
  totalEventsProcessed: number;
  totalFarmersRerouted: number;
  isRunning: boolean;
  timestamp: string;
}

// ────────────────────────────────────────────────────────────────
// Sparkline SVG Component
// ────────────────────────────────────────────────────────────────
const Sparkline: React.FC<{
  data: number[];
  predictions?: number[];
  width?: number;
  height?: number;
  color?: string;
  isAnomaly?: boolean;
}> = ({ data, predictions = [], width = 120, height = 40, color = '#10b981', isAnomaly = false }) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded" />;
  }

  const allValues = [...data, ...predictions];
  const min = Math.min(...allValues) * 0.9;
  const max = Math.max(...allValues) * 1.1 + 0.1;
  const range = max - min || 1;

  const toX = (i: number, total: number) => (i / (total - 1)) * width;
  const toY = (v: number) => height - ((v - min) / range) * height;

  const histPath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i, data.length)} ${toY(v)}`).join(' ');

  const predStartX = toX(data.length - 1, data.length);
  const predStartY = toY(data[data.length - 1]);
  const predPath = predictions.length > 0
    ? [
        `M ${predStartX} ${predStartY}`,
        ...predictions.map((v, i) => {
          const x = predStartX + ((i + 1) / predictions.length) * (width - predStartX) * 0.4;
          return `L ${x} ${toY(v)}`;
        })
      ].join(' ')
    : '';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d={`${histPath} L ${toX(data.length - 1, data.length)} ${height} L 0 ${height} Z`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      {/* History line */}
      <path
        d={histPath}
        fill="none"
        stroke={isAnomaly ? '#ef4444' : color}
        strokeWidth={isAnomaly ? 2.5 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Prediction dashed line */}
      {predPath && (
        <path
          d={predPath}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={1.5}
          strokeDasharray="4,3"
          strokeLinecap="round"
        />
      )}
      {/* Anomaly pulse on last point */}
      {isAnomaly && data.length > 0 && (
        <circle
          cx={toX(data.length - 1, data.length)}
          cy={toY(data[data.length - 1])}
          r={4}
          fill="#ef4444"
          opacity={0.9}
        >
          <animate attributeName="r" values="4;8;4" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
};

// ────────────────────────────────────────────────────────────────
// Anomaly Score Gauge
// ────────────────────────────────────────────────────────────────
const AnomalyGauge: React.FC<{ score: number; severity: string }> = ({ score, severity }) => {
  const pct = Math.round(score * 100);
  const colors: Record<string, string> = {
    NORMAL: '#10b981',
    MODERATE: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  };
  const color = colors[severity] || '#10b981';
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (1 - score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={48} height={48} viewBox="0 0 48 48">
          <circle cx={24} cy={24} r={radius} fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth={5} />
          <circle
            cx={24} cy={24} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeDasharray={circ}
            strokeDashoffset={dash}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
          />
          <text x={24} y={28} textAnchor="middle" fontSize={10} fontWeight="bold" fill={color}>
            {pct}
          </text>
        </svg>
      </div>
      <span
        className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full"
        style={{ backgroundColor: color + '20', color }}
      >
        {severity}
      </span>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Centre Card
// ────────────────────────────────────────────────────────────────
const CentreCard: React.FC<{
  centre: CentreSnapshot;
  onInjectFailure: (id: string) => void;
  onRecover: (id: string) => void;
}> = ({ centre, onInjectFailure, onRecover }) => {
  const isAnomaly = centre.isAnomalyActive;
  const isFailed = centre.isFailed;

  const statusColor = isFailed
    ? 'border-red-500/60 bg-red-950/10'
    : isAnomaly
    ? 'border-orange-500/50 bg-orange-950/10'
    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';

  const throughputDelta = centre.throughputHistory.length >= 2
    ? centre.currentThroughput - centre.throughputHistory[centre.throughputHistory.length - 2]
    : 0;

  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all duration-500 ${statusColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {isFailed ? (
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            ) : isAnomaly ? (
              <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
            ) : (
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            )}
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {centre.district}
            </p>
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
            {centre.centreName.split('–')[1]?.trim() || centre.centreName}
          </h3>
        </div>
        <AnomalyGauge score={centre.anomalyScore} severity={centre.anomalySeverity} />
      </div>

      {/* Sparkline */}
      <div className="mb-3">
        <Sparkline
          data={centre.throughputHistory}
          predictions={centre.lstmPredictions}
          width={200}
          height={44}
          color={isFailed ? '#ef4444' : isAnomaly ? '#f97316' : '#10b981'}
          isAnomaly={isAnomaly || isFailed}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5">
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {centre.currentThroughput.toFixed(1)}
            </span>
            {throughputDelta >= 0
              ? <TrendingUp className="h-3 w-3 text-emerald-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />
            }
          </div>
          <p className="text-[9px] font-semibold text-slate-400 uppercase">Throughput/hr</p>
        </div>
        <div className="text-center">
          <span className="text-sm font-black text-violet-500">
            {centre.lstmPredictions[0]?.toFixed(1) ?? '—'}
          </span>
          <p className="text-[9px] font-semibold text-slate-400 uppercase">LSTM Pred</p>
        </div>
        <div className="text-center">
          <span className={`text-sm font-black ${centre.predictedWaitMinutes > 60 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
            {centre.predictedWaitMinutes.toFixed(0)}m
          </span>
          <p className="text-[9px] font-semibold text-slate-400 uppercase">Est. Wait</p>
        </div>
      </div>

      {/* LSTM Confidence */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-3 w-3 text-violet-400 shrink-0" />
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-700"
            style={{ width: `${centre.lstmConfidence * 100}%` }}
          />
        </div>
        <span className="text-[9px] font-bold text-violet-400">
          {(centre.lstmConfidence * 100).toFixed(0)}% conf
        </span>
      </div>

      {/* Status Footer */}
      {(isFailed || isAnomaly) && (
        <div className={`rounded-xl px-3 py-2 mb-2 ${isFailed ? 'bg-red-500/10 border border-red-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
          <p className={`text-[10px] font-bold ${isFailed ? 'text-red-400' : 'text-orange-400'}`}>
            {isFailed ? '🔴 WEIGHBRIDGE FAILURE DETECTED' : '⚠️ ANOMALY — THROUGHPUT DROP'}
          </p>
          {centre.reroutingTriggered && (
            <p className="text-[9px] text-slate-400 mt-0.5">
              ✅ {centre.notificationsSent} farmers notified for rerouting
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!isFailed ? (
          <button
            id={`inject-failure-${centre.centreId}`}
            onClick={() => onInjectFailure(centre.centreId)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold py-1.5 transition-all"
          >
            <Zap className="h-3 w-3" />
            Inject Failure
          </button>
        ) : (
          <button
            id={`recover-${centre.centreId}`}
            onClick={() => onRecover(centre.centreId)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold py-1.5 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            Recover Centre
          </button>
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Farmer Notification Card (animated entry)
// ────────────────────────────────────────────────────────────────
const FarmerNotifCard: React.FC<{
  notif: NotificationCard;
  index: number;
}> = ({ notif, index }) => {
  const [visible, setVisible] = useState(false);
  const [replyStatus, setReplyStatus] = useState<string>(notif.status);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    setReplyStatus(notif.status);
  }, [notif.status]);

  const hasReplied = replyStatus.includes('replied');
  const repliedYes = replyStatus.includes('YES');

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${
        hasReplied && repliedYes
          ? 'border-emerald-500/30 bg-emerald-950/10'
          : hasReplied && !repliedYes
          ? 'border-rose-500/30 bg-rose-950/10'
          : 'border-amber-500/30 bg-amber-950/10 dark:border-slate-700 dark:bg-slate-800/50'
      }`}
    >
      <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">
          {notif.farmerName.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{notif.farmerName}</p>
        <p className="text-[9px] text-slate-400 font-mono">{notif.phone}</p>
      </div>
      <div className="shrink-0">
        {hasReplied ? (
          <div className="flex items-center gap-1">
            {repliedYes ? (
              <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <ThumbsDown className="h-3.5 w-3.5 text-rose-400" />
            )}
            <span className={`text-[9px] font-black ${repliedYes ? 'text-emerald-400' : 'text-rose-400'}`}>
              {repliedYes ? 'YES' : 'NO'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Send className="h-3 w-3 text-amber-400" />
            <span className="text-[9px] font-semibold text-amber-400">Sent</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:8000/api/v1';
const WS_URL = 'ws://localhost:8000/api/v1/ws/queue-intelligence';

export const LiveQueueIntelligence: React.FC = () => {
  const [status, setStatus] = useState<MonitorStatus | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeReroutingEvent, setActiveReroutingEvent] = useState<ReroutingEvent | null>(null);
  const [farmerReplies, setFarmerReplies] = useState<Record<string, string>>({});
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [injectingId, setInjectingId] = useState<string | null>(null);
  const [recoveringId, setRecoveringId] = useState<string | null>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch initial status via HTTP
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/queue-intelligence/status`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setStatus(json.data);
      }
    } catch {
      // Backend not up yet — ok
    }
  }, []);

  // Build simulated status if backend is offline
  const buildSimulatedStatus = useCallback((): MonitorStatus => {
    const tick = pulseCount;
    const centres: CentreSnapshot[] = [
      { centreId: 'cnt-a', centreName: 'Centre A – Thanjavur Mandi', district: 'Thanjavur',
        throughputHistory: Array.from({ length: 20 }, (_, i) => 14 + Math.sin(i * 0.6 + tick * 0.3) * 2 + (Math.random() - 0.5) * 1.5),
        currentThroughput: 14.2, baselineThroughput: 15, lstmPredictions: [14.5, 14.8, 15.0],
        lstmConfidence: 0.82, anomalyScore: 0.12, anomalySeverity: 'NORMAL', isAnomalyActive: false,
        isFailed: false, predictedWaitMinutes: 18, reroutingTriggered: false, reroutingTriggeredAt: null,
        notificationsSent: 0, capacityRemaining: 45 },
      { centreId: 'cnt-b', centreName: 'Centre B – Kumbakonam Mandi', district: 'Kumbakonam',
        throughputHistory: Array.from({ length: 20 }, (_, i) => 11 + Math.sin(i * 0.4 + tick * 0.2) * 1.5 + (Math.random() - 0.5) * 1.2),
        currentThroughput: 11.6, baselineThroughput: 12, lstmPredictions: [11.8, 12.1, 12.0],
        lstmConfidence: 0.76, anomalyScore: 0.08, anomalySeverity: 'NORMAL', isAnomalyActive: false,
        isFailed: false, predictedWaitMinutes: 22, reroutingTriggered: false, reroutingTriggeredAt: null,
        notificationsSent: 0, capacityRemaining: 38 },
      { centreId: 'cnt-c', centreName: 'Centre C – Papanasam Mandi', district: 'Papanasam',
        throughputHistory: Array.from({ length: 20 }, (_, i) => 9.5 + Math.cos(i * 0.5 + tick * 0.25) * 1.2 + (Math.random() - 0.5) * 1.0),
        currentThroughput: 9.8, baselineThroughput: 10, lstmPredictions: [10.0, 10.2, 10.1],
        lstmConfidence: 0.71, anomalyScore: 0.06, anomalySeverity: 'NORMAL', isAnomalyActive: false,
        isFailed: false, predictedWaitMinutes: 26, reroutingTriggered: false, reroutingTriggeredAt: null,
        notificationsSent: 0, capacityRemaining: 29 },
    ];
    return {
      centres,
      eventLog: [],
      reroutingEvents: [],
      totalEventsProcessed: tick * 3,
      totalFarmersRerouted: 0,
      isRunning: true,
      timestamp: new Date().toISOString(),
    };
  }, [pulseCount]);

  // WebSocket connection
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      };

      ws.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          const { event, data } = payload;

          if (event === 'THROUGHPUT_UPDATE') {
            setStatus(prev => ({
              ...(prev || {} as MonitorStatus),
              centres: data.centres,
              totalEventsProcessed: data.totalEventsProcessed,
              totalFarmersRerouted: data.totalFarmersRerouted,
              timestamp: data.timestamp,
            }));
          } else if (event === 'REROUTING_TRIGGERED') {
            setActiveReroutingEvent(data as ReroutingEvent);
            setEventLog(prev => [{ type: 'REROUTING_TRIGGERED', ...data, timestamp: data.timestamp }, ...prev.slice(0, 49)]);
          } else if (event === 'ANOMALY_DETECTED') {
            setEventLog(prev => [data as EventLogEntry, ...prev.slice(0, 49)]);
          } else if (event === 'FAILURE_INJECTED') {
            setEventLog(prev => [data as EventLogEntry, ...prev.slice(0, 49)]);
          } else if (event === 'FARMER_REPLY') {
            setFarmerReplies(prev => ({
              ...prev,
              [data.farmerId]: data.reply,
            }));
            // Update notification cards in rerouting event
            setActiveReroutingEvent(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                notificationDetails: prev.notificationDetails.map(n =>
                  n.farmerId === data.farmerId
                    ? { ...n, status: `replied_${data.reply}` }
                    : n
                ),
              };
            });
          }
        } catch {/* ignore parse errors */}
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectTimer.current = setTimeout(connectWS, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setWsConnected(false);
      reconnectTimer.current = setTimeout(connectWS, 3000);
    }
  }, []);

  // Initial load + polling fallback when WS disconnected
  useEffect(() => {
    fetchStatus();
    connectWS();
    const pollInterval = setInterval(() => {
      setPulseCount(p => p + 1);
      if (!wsConnected) fetchStatus();
    }, 2000);
    return () => {
      clearInterval(pollInterval);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  // Inject failure
  const handleInjectFailure = async (centreId: string) => {
    setInjectingId(centreId);
    try {
      const res = await fetch(`${API_BASE}/queue-intelligence/inject-failure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centre_id: centreId }),
      });
      if (!res.ok) throw new Error('Request failed');
      // Optimistic UI: mark centre as failed immediately
      setStatus(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          centres: prev.centres.map(c =>
            c.centreId === centreId
              ? { ...c, isFailed: true, isAnomalyActive: true, anomalyScore: 0.92, anomalySeverity: 'CRITICAL' as const }
              : c
          ),
        };
      });
      setEventLog(prev => [{
        type: 'FAILURE_INJECTED',
        centreId,
        centreName: status?.centres.find(c => c.centreId === centreId)?.centreName || centreId,
        timestamp: new Date().toISOString(),
      }, ...prev.slice(0, 49)]);
    } catch {
      // If backend not connected, simulate in-browser
      setStatus(prev => {
        if (!prev) {
          const sim = buildSimulatedStatus();
          return { ...sim, centres: sim.centres.map(c => c.centreId === centreId ? { ...c, isFailed: true, isAnomalyActive: true, anomalyScore: 0.92, anomalySeverity: 'CRITICAL' as const } : c) };
        }
        return {
          ...prev,
          centres: prev.centres.map(c =>
            c.centreId === centreId
              ? { ...c, isFailed: true, isAnomalyActive: true, anomalyScore: 0.92, anomalySeverity: 'CRITICAL' as const }
              : c
          ),
        };
      });
      simulateDemoRerouting(centreId);
    } finally {
      setTimeout(() => setInjectingId(null), 1000);
    }
  };

  // Recover centre
  const handleRecover = async (centreId: string) => {
    setRecoveringId(centreId);
    try {
      await fetch(`${API_BASE}/queue-intelligence/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centre_id: centreId }),
      });
    } catch {/* ok */}
    setStatus(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        centres: prev.centres.map(c =>
          c.centreId === centreId
            ? { ...c, isFailed: false, isAnomalyActive: false, anomalyScore: 0.05, anomalySeverity: 'NORMAL' as const, reroutingTriggered: false }
            : c
        ),
      };
    });
    setActiveReroutingEvent(null);
    setFarmerReplies({});
    setTimeout(() => setRecoveringId(null), 500);
  };

  // Full browser-side demo simulation (when backend is offline)
  const simulateDemoRerouting = useCallback((centreId: string) => {
    const farmerNames = [
      'C. Palanivel', 'M. Shanmugam', 'R. Venkatesan', 'S. Murugesan', 'K. Anbazhagan',
      'P. Ramasamy', 'T. Selvakumar', 'D. Arumugam', 'N. Krishnamurthy', 'A. Subbaiah',
      'G. Rajan', 'V. Natarajan', 'B. Ponnusamy', 'L. Thirumalai', 'J. Saravanan',
      'H. Ganesan', 'F. Chandrasekaran', 'E. Balakrishnan', 'I. Marimuthu', 'Q. Senthilkumar',
      'W. Periyasamy', 'X. Ayyasamy', 'Y. Duraiswamy', 'Z. Perumal', 'U. Rajagopal',
      'O. Manoharan', 'AA. Kandasamy', 'BB. Somasundaram', 'CC. Palaniswami', 'DD. Nataraj',
      'EE. Sureshkumar', 'FF. Gopalakrishnan', 'GG. Karuppasamy', 'HH. Muthuswami',
      'II. Rangasamy', 'JJ. Velayutham', 'KK. Dhanasekaran', 'LL. Pitchai',
      'MM. Ramachandran', 'NN. Thangavel',
    ];

    const notifications: NotificationCard[] = farmerNames.map((name, i) => ({
      farmerId: `F-TN-2026-${8800 + i}`,
      farmerName: name,
      phone: `+9198421${75000 + i}`,
      message: '🚨 Weighbridge delay at Centre A – Thanjavur Mandi. Centre B – Kumbakonam Mandi (12 km) has 18-min wait. Reply YES to reroute.',
      status: 'sent',
      sentAt: new Date().toISOString(),
    }));

    const event: ReroutingEvent = {
      eventId: `RE-${centreId}-demo`,
      centreId,
      centreName: 'Centre A – Thanjavur Mandi',
      anomalyScore: 0.92,
      severity: 'CRITICAL',
      delayMinutes: 80,
      alternativeCentre: 'Centre B – Kumbakonam Mandi',
      alternativeDistance: 12,
      alternativeWaitMinutes: 18,
      farmersNotified: notifications.length,
      notificationDetails: notifications,
      whatsappMessage: '🚨 Vyuga Alert: Weighbridge delay at Centre A – Thanjavur Mandi.\nExpected delay: 80 minutes.\n📍 Centre B – Kumbakonam Mandi (12 km away) has only 18 min wait. Reply YES to reroute.',
      timestamp: new Date().toISOString(),
    };

    // Delay to simulate the "15-second detection window"
    setTimeout(() => {
      setActiveReroutingEvent(event);
      setStatus(prev => ({ ...(prev || buildSimulatedStatus()), totalFarmersRerouted: notifications.length }));
      setEventLog(prev => [{ type: 'REROUTING_TRIGGERED', centreId, centreName: event.centreName, farmersNotified: notifications.length, timestamp: new Date().toISOString() }, ...prev]);

      // Progressive farmer reply simulation
      notifications.forEach((n, i) => {
        setTimeout(() => {
          const reply = Math.random() < 0.85 ? 'YES' : 'NO';
          setFarmerReplies(prev => ({ ...prev, [n.farmerId]: reply }));
          setActiveReroutingEvent(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              notificationDetails: prev.notificationDetails.map(nd =>
                nd.farmerId === n.farmerId ? { ...nd, status: `replied_${reply}` } : nd
              ),
            };
          });
        }, 3000 + i * 400);
      });
    }, 4000);
  }, [buildSimulatedStatus]);

  // Use simulated data when no backend
  const displayStatus: MonitorStatus = status || buildSimulatedStatus();
  const totalYesReplies = Object.values(farmerReplies).filter(r => r === 'YES').length;
  const totalNoReplies = Object.values(farmerReplies).filter(r => r === 'NO').length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Live Queue Intelligence
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                LSTM Throughput Prediction · IsolationForest Anomaly Detection · Auto-Rerouting
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold border ${wsConnected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'}`}>
            {wsConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {wsConnected ? 'LIVE WebSocket' : 'Polling Mode'}
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <Radio className="h-3 w-3 animate-pulse" />
            {displayStatus.isRunning ? 'MONITOR ACTIVE' : 'OFFLINE'}
          </div>
        </div>
      </div>

      {/* ── KPI Hero Bar ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Centres Monitored', value: displayStatus.centres.length, icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'IoT Events Processed', value: displayStatus.totalEventsProcessed.toLocaleString(), icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Farmers Rerouted', value: displayStatus.totalFarmersRerouted + (activeReroutingEvent?.farmersNotified || 0), icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Anomalies Active', value: displayStatus.centres.filter(c => c.isAnomalyActive || c.isFailed).length, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 shadow-sm ${bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className={`text-[9px] font-black uppercase tracking-wider ${color}`}>{label}</span>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Centres + Rerouting Panel ─────────── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Centre Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Procurement Centre Telemetry
            </h2>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              LSTM Prediction
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-2" />
              Live Throughput
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-1">
            {displayStatus.centres.map(centre => (
              <CentreCard
                key={centre.centreId}
                centre={centre}
                onInjectFailure={handleInjectFailure}
                onRecover={handleRecover}
              />
            ))}
          </div>

          {/* Master Demo Button */}
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/20 to-orange-950/10 p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-red-400" />
              <h3 className="text-sm font-black text-red-400 uppercase tracking-wide">Demo Mode — Instant Failure Injection</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Trigger a weighbridge failure at Centre A. Within 4–6 seconds: anomaly score spikes, LSTM predicts disruption,
              and <strong className="text-slate-300">40 farmers receive WhatsApp rerouting alerts</strong>.
            </p>
            <button
              id="master-inject-failure-btn"
              onClick={() => handleInjectFailure('cnt-a')}
              disabled={!!injectingId || displayStatus.centres.find(c => c.centreId === 'cnt-a')?.isFailed}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm py-3 shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {injectingId === 'cnt-a' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              ⚡ Simulate Weighbridge Failure — Centre A (Thanjavur)
            </button>
            <button
              id="recover-all-btn"
              onClick={() => displayStatus.centres.forEach(c => { if (c.isFailed || c.isAnomalyActive) handleRecover(c.centreId); })}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs py-2 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All Centres to Normal
            </button>
          </div>
        </div>

        {/* Right Panel: Rerouting + Event Log */}
        <div className="lg:col-span-2 space-y-4">

          {/* Rerouting Notification Panel */}
          {activeReroutingEvent ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                    Auto-Rerouting Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  <span className="line-through text-red-400">{activeReroutingEvent.centreName}</span>
                  <ArrowRight className="inline h-3 w-3 mx-1 text-slate-500" />
                  <span className="text-emerald-400">{activeReroutingEvent.alternativeCentre}</span>
                </p>
                <div className="flex gap-3 mt-2">
                  <div className="text-center">
                    <p className="text-lg font-black text-red-400">{activeReroutingEvent.delayMinutes}m</p>
                    <p className="text-[9px] text-slate-400 uppercase">Delay</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-emerald-400">{activeReroutingEvent.alternativeWaitMinutes}m</p>
                    <p className="text-[9px] text-slate-400 uppercase">Alt Wait</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-indigo-400">{activeReroutingEvent.alternativeDistance}km</p>
                    <p className="text-[9px] text-slate-400 uppercase">Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-400">{activeReroutingEvent.farmersNotified}</p>
                    <p className="text-[9px] text-slate-400 uppercase">Notified</p>
                  </div>
                </div>
              </div>

              {/* Reply Stats */}
              {Object.keys(farmerReplies).length > 0 && (
                <div className="px-4 py-2 flex items-center gap-4 border-b border-amber-500/10 bg-black/10">
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-black text-emerald-400">{totalYesReplies} Accepted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThumbsDown className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-xs font-black text-rose-400">{totalNoReplies} Declined</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <MessageSquare className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400">
                      {Object.keys(farmerReplies).length}/{activeReroutingEvent.farmersNotified} replied
                    </span>
                  </div>
                </div>
              )}

              {/* WhatsApp Message Preview */}
              <div className="px-4 py-3 border-b border-amber-500/10">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1.5">WhatsApp Message Sent</p>
                <div className="rounded-xl bg-slate-900/60 border border-slate-700 p-2.5">
                  <p className="text-[10px] text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                    {activeReroutingEvent.whatsappMessage}
                  </p>
                </div>
              </div>

              {/* Farmer Cards */}
              <div className="px-3 py-3 space-y-1.5 max-h-64 overflow-y-auto">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-2 px-1">
                  Farmer Notifications ({activeReroutingEvent.notificationDetails.length})
                </p>
                {activeReroutingEvent.notificationDetails.map((n, i) => (
                  <FarmerNotifCard
                    key={n.farmerId}
                    notif={{
                      ...n,
                      status: farmerReplies[n.farmerId]
                        ? `replied_${farmerReplies[n.farmerId]}`
                        : n.status,
                    }}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">All Centres Operating Normally</p>
              <p className="text-xs text-slate-400 mt-1">
                No rerouting events active. Inject a failure to see the demo.
              </p>
            </div>
          )}

          {/* Event Log */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Event Log</h3>
              <span className="ml-auto text-[9px] font-bold text-slate-400">{eventLog.length} events</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
              {eventLog.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  Waiting for events...
                </div>
              ) : (
                eventLog.map((evt, i) => {
                  const colors: Record<string, string> = {
                    FAILURE_INJECTED: 'text-red-400',
                    ANOMALY_DETECTED: 'text-orange-400',
                    REROUTING_TRIGGERED: 'text-amber-400',
                    THROUGHPUT_UPDATE: 'text-emerald-400',
                  };
                  const icons: Record<string, React.ReactNode> = {
                    FAILURE_INJECTED: <Zap className="h-3 w-3 text-red-400 shrink-0" />,
                    ANOMALY_DETECTED: <AlertTriangle className="h-3 w-3 text-orange-400 shrink-0" />,
                    REROUTING_TRIGGERED: <ArrowRight className="h-3 w-3 text-amber-400 shrink-0" />,
                    THROUGHPUT_UPDATE: <Activity className="h-3 w-3 text-emerald-400 shrink-0" />,
                  };
                  return (
                    <div key={i} className="px-4 py-2 flex items-start gap-2">
                      {icons[evt.type] || <Activity className="h-3 w-3 text-slate-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-bold ${colors[evt.type] || 'text-slate-400'}`}>
                          {evt.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[9px] text-slate-500 truncate">
                          {evt.centreName}
                          {evt.farmersNotified ? ` · ${evt.farmersNotified} notified` : ''}
                          {evt.anomalyScore ? ` · Score: ${(evt.anomalyScore * 100).toFixed(0)}` : ''}
                        </p>
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono shrink-0">
                        {new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* IsolationForest Legend */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                ML Engine Status
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">IsolationForest</span>
                <span className="text-[10px] font-black text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">LSTM (numpy)</span>
                <span className="text-[10px] font-black text-violet-400">PREDICTING</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">Rerouting Engine</span>
                <span className="text-[10px] font-black text-indigo-400">CAPACITY+DISTANCE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">WhatsApp Channel</span>
                <span className="text-[10px] font-black text-amber-400">MOCK (DEMO-SAFE)</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>Anomaly Threshold</span>
                  <span className="font-mono">≥ 0.65 score</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>Monitor Interval</span>
                  <span className="font-mono">2.0 seconds</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>Window Size</span>
                  <span className="font-mono">20 readings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
