import React from 'react';
import { TokenRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { Clock, UserCheck, Play, Sparkles } from 'lucide-react';

interface QueueVisualizerProps {
  queue: TokenRecord[];
  activeTokenNumber?: number;
  onAdvance?: () => void;
  showAdminControls?: boolean;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  queue,
  activeTokenNumber,
  onAdvance,
  showAdminControls = false
}) => {
  const servingToken = queue.find(q => q.status === 'Now Serving');
  const waitingTokens = queue.filter(q => q.status === 'Booked' || q.status === 'Arrived');
  const nextToken = waitingTokens[0];
  const userToken = queue.find(q => q.tokenNumber === activeTokenNumber);

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Badge label="LIVE ●" variant="live" size="md" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Procurement Centre Live Queue
          </h3>
        </div>

        {showAdminControls && onAdvance && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition-all active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Advance Next Token (Simulate)</span>
          </button>
        )}
      </div>

      {/* Main Focus Strip */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Now Serving */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Now Serving</span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            #{servingToken ? servingToken.tokenNumber : 'None'}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {servingToken ? servingToken.farmerName : 'Awaiting farmer'}
          </p>
        </div>

        {/* Next In Line */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Next Up
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-200">
            #{nextToken ? nextToken.tokenNumber : '--'}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {nextToken ? nextToken.farmerName : 'Queue Clear'}
          </p>
        </div>

        {/* Your Token */}
        <div className={`rounded-xl border p-4 ${
          userToken
            ? 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/40'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-300">
            <span>Your Token</span>
            {userToken && <Badge label="Confirmed" variant="completed" size="sm" />}
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            #{userToken ? userToken.tokenNumber : 'No Token'}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {userToken ? `${userToken.farmersAhead} ahead` : 'Book a slot'}
          </p>
        </div>

        {/* AI Estimated Wait */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/40 p-4">
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3 w-3" />
            <span>Estimated Wait</span>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {userToken ? `${userToken.estimatedWaitMinutes} min` : '27 min avg'}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            AI dynamic prediction
          </p>
        </div>
      </div>

      {/* Visual Sequence Queue */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Queue Sequence
          </span>
          <span className="text-xs text-slate-400">
            {waitingTokens.length + (servingToken ? 1 : 0)} Total in Queue
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {/* Serving Token */}
          {servingToken && (
            <div className="relative flex min-w-[110px] flex-col items-center rounded-xl border-2 border-emerald-500 bg-emerald-500/10 p-3 text-center dark:bg-emerald-950/60">
              <span className="absolute -top-2.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                SERVING
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                #{servingToken.tokenNumber}
              </span>
              <span className="mt-1 truncate max-w-[90px] text-xs font-semibold text-slate-700 dark:text-slate-200">
                {servingToken.farmerName.split(' ')[1] || servingToken.farmerName}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                Counter 1
              </span>
            </div>
          )}

          {/* Waiting Tokens */}
          {waitingTokens.map((item) => {
            const isUser = item.tokenNumber === activeTokenNumber;
            return (
              <div
                key={item.id}
                className={`relative flex min-w-[105px] flex-col items-center rounded-xl border p-3 text-center transition-all ${
                  isUser
                    ? 'border-2 border-blue-500 bg-blue-500/15 ring-4 ring-blue-500/10 dark:bg-blue-950/80 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                {isUser && (
                  <span className="absolute -top-2.5 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                    YOU
                  </span>
                )}
                <span className={`text-base font-extrabold ${isUser ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  #{item.tokenNumber}
                </span>
                <span className="mt-1 truncate max-w-[90px] text-xs font-medium text-slate-600 dark:text-slate-400">
                  {item.farmerName.split(' ')[1] || item.farmerName}
                </span>
                <span className="mt-0.5 flex items-center gap-0.5 text-[10px] text-slate-400">
                  <Clock className="h-2.5 w-2.5" />
                  {item.estimatedWaitMinutes}m
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
