import React from 'react';
import { Users, Clock, ArrowRight, Activity } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface CircularTimerProps {
  waitMinutes: number;
  tokenNumber: number;
  nowServingNumber: number;
  farmersAhead: number;
  maxWaitMinutes?: number;
  tooltipText?: string;
  onViewQueue?: () => void;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  waitMinutes,
  tokenNumber,
  nowServingNumber,
  farmersAhead,
  maxWaitMinutes = 60,
  tooltipText,
  onViewQueue
}) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(5, (waitMinutes / maxWaitMinutes) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Estimated Mandi Turnaround Time
          </span>
        </div>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <span className="cursor-help rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              Live Mandi Data
            </span>
          </Tooltip>
        )}
      </div>

      {/* Dial & Time Display */}
      <div className="my-5 flex flex-col items-center justify-center sm:flex-row sm:gap-8">
        <div className="relative flex items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#166534"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out text-emerald-700"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {waitMinutes}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Minutes
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="mt-4 flex w-full flex-1 flex-col gap-2 sm:mt-0">
          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              <span>Now Serving</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              #{nowServingNumber}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-2 border border-emerald-300 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
              <Clock className="h-3.5 w-3.5" />
              <span>Your Token</span>
            </div>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              #{tokenNumber}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <Users className="h-3.5 w-3.5" />
              <span>Farmers Ahead</span>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {farmersAhead} Farmers
            </span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3.5 text-xs text-slate-500 dark:text-slate-400">
        <p className="text-[11px]">
          Live tracking synchronized with centre weighbridge.
        </p>
        {onViewQueue && (
          <button
            onClick={onViewQueue}
            className="inline-flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
          >
            <span>Track Mandi Queue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
