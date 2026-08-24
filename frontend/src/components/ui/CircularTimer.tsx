import React from 'react';
import { Sparkles, Users, Clock, ArrowRight } from 'lucide-react';
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
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(5, (waitMinutes / maxWaitMinutes) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-slate-900/80 p-6 text-white shadow-xl backdrop-blur-md dark:border-emerald-500/20">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-emerald-700/20 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            AI Waiting-Time Prediction
          </span>
        </div>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <span className="cursor-help rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300 backdrop-blur-sm">
              Live AI Model
            </span>
          </Tooltip>
        )}
      </div>

      {/* Dial & Time Display */}
      <div className="relative my-6 flex flex-col items-center justify-center sm:flex-row sm:gap-8">
        <div className="relative flex items-center justify-center">
          <svg className="h-36 w-36 -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              {waitMinutes}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Minutes
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="mt-4 flex w-full flex-col gap-2.5 sm:mt-0 sm:w-auto">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-2 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Now Serving</span>
            </div>
            <span className="text-sm font-bold text-white">
              #{nowServingNumber}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-500/10 px-4 py-2 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Clock className="h-3.5 w-3.5" />
              <span>Your Token</span>
            </div>
            <span className="text-sm font-black text-emerald-400">
              #{tokenNumber}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-2 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Users className="h-3.5 w-3.5" />
              <span>Farmers Ahead</span>
            </div>
            <span className="text-sm font-bold text-amber-400">
              {farmersAhead} Farmers
            </span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-300">
        <p className="flex items-center gap-1.5 text-center sm:text-left text-[11px] text-slate-400">
          <span>Updates automatically as queue progresses.</span>
        </p>
        {onViewQueue && (
          <button
            onClick={onViewQueue}
            className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View Live Queue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
