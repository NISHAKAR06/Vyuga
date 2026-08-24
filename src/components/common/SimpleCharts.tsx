import React from 'react';

// 1. Actual vs Predicted Queue Area Chart
interface ForecastPoint {
  time: string;
  actual: number | null;
  predicted: number;
  isFuture: boolean;
}

export const QueueForecastAreaChart: React.FC<{ data: ForecastPoint[] }> = ({ data }) => {
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 40 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => Math.max(d.actual || 0, d.predicted)), 60);

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxVal) * innerHeight;

  // Build SVG path for predicted (dotted/smooth)
  const predictedPoints = data.map((d, i) => `${getX(i)},${getY(d.predicted)}`).join(' L ');
  const predictedArea = `M ${getX(0)},${getY(0)} L ${predictedPoints} L ${getX(data.length - 1)},${getY(0)} Z`;

  // Build SVG path for actual (solid)
  const actualData = data.filter(d => d.actual !== null);
  const actualPoints = actualData.map((d, i) => `${getX(i)},${getY(d.actual!)}`).join(' L ');
  const actualArea = actualData.length > 0 
    ? `M ${getX(0)},${getY(0)} L ${actualPoints} L ${getX(actualData.length - 1)},${getY(0)} Z` 
    : '';

  // Find index where future starts
  const futureStartIndex = data.findIndex(d => d.isFuture);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Legend */}
        <div className="mb-3 flex items-center justify-end gap-5 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300">Actual Queue (Serving)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-dashed border-purple-500 bg-purple-500/20" />
            <span className="text-purple-700 dark:text-purple-300 font-bold">AI Predicted Queue</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible font-sans text-xs">
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={i} className="text-slate-400 dark:text-slate-600">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeOpacity="0.3"
                />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-current">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Future separator divider */}
          {futureStartIndex > 0 && (
            <g>
              <line
                x1={getX(futureStartIndex)}
                y1={padding.top}
                x2={getX(futureStartIndex)}
                y2={padding.top + innerHeight}
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <rect
                x={getX(futureStartIndex) + 4}
                y={padding.top}
                width="96"
                height="20"
                rx="4"
                className="fill-purple-500/20 stroke-purple-500/40"
              />
              <text
                x={getX(futureStartIndex) + 8}
                y={padding.top + 14}
                className="text-[10px] font-bold fill-purple-700 dark:fill-purple-300"
              >
                FUTURE PREDICTION
              </text>
            </g>
          )}

          {/* Predicted Area & Line */}
          <path d={predictedArea} fill="url(#predGrad)" />
          <path
            d={`M ${predictedPoints}`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Actual Area & Line */}
          {actualData.length > 0 && (
            <>
              <path d={actualArea} fill="url(#actualGrad)" />
              <path
                d={`M ${actualPoints}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />
            </>
          )}

          {/* Data Points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cyPred = getY(d.predicted);
            const cyAct = d.actual !== null ? getY(d.actual) : null;

            return (
              <g key={i}>
                {/* Predicted point */}
                <circle
                  cx={cx}
                  cy={cyPred}
                  r="3.5"
                  className="fill-white stroke-purple-500 stroke-2"
                />
                {/* Actual point */}
                {cyAct !== null && (
                  <circle
                    cx={cx}
                    cy={cyAct}
                    r="4.5"
                    className="fill-emerald-500 stroke-white stroke-2"
                  />
                )}
                {/* X axis labels */}
                <text
                  x={cx}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-500 dark:fill-slate-400"
                >
                  {d.time}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// 2. Risk Score Gauge (e.g. 87/100)
export const RiskGaugeChart: React.FC<{ score: number; statusText: string }> = ({ score, statusText }) => {
  const radius = 64;
  const circumference = Math.PI * radius; // Semi circle
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return '#f43f5e'; // red / rose
    if (s >= 40) return '#f59e0b'; // amber
    return '#10b981'; // emerald
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg className="h-32 w-52 overflow-visible" viewBox="0 0 160 90">
          {/* Background Semi-Circle Track */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Active Risk Gauge Arc */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute top-10 flex flex-col items-center text-center">
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white" style={{ color }}>
            {score}<span className="text-base text-slate-400 font-semibold">/100</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Risk Score
          </span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
};

// 3. Weekly Bar Chart
interface WeeklyPoint {
  day: string;
  tonnage: number;
  target: number;
}

export const WeeklyProcurementBarChart: React.FC<{ data: WeeklyPoint[] }> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.tonnage, d.target)), 600);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-400">Daily Intake (Tons)</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Procured</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-400">Target</span>
          </div>
        </div>
      </div>

      <div className="flex h-44 items-end justify-between gap-2 sm:gap-4 pt-2">
        {data.map((item, idx) => {
          const heightTonnage = (item.tonnage / maxVal) * 100;
          const heightTarget = (item.target / maxVal) * 100;

          return (
            <div key={idx} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-32 w-full items-end justify-center gap-1">
                {/* Target bar */}
                <div
                  className="w-1/2 max-w-[12px] rounded-t bg-slate-200 dark:bg-slate-800 transition-all duration-500"
                  style={{ height: `${heightTarget}%` }}
                />
                {/* Actual bar */}
                <div
                  className="w-1/2 max-w-[12px] rounded-t bg-emerald-500 hover:bg-emerald-400 transition-all duration-500 shadow-sm"
                  style={{ height: `${heightTonnage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
