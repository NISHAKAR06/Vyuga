import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularTimer } from '../../components/common/CircularTimer';
import { QueueVisualizer } from '../../components/common/QueueVisualizer';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Play,
  Scale,
  Building,
  CheckCircle2,
  Clock,
  MapPin,
  Info
} from 'lucide-react';

export const LiveQueuePage: React.FC = () => {
  const {
    activeFarmerToken,
    liveQueue,
    counters,
    advanceQueue,
    t
  } = useApp();

  const servingToken = liveQueue.find(q => q.status === 'Now Serving');

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              LIVE TELEMETRY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.liveQueueTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t.liveQueueSub}
          </p>
        </div>

        {/* Demo Advance Simulation Button */}
        <button
          onClick={advanceQueue}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{t.simulateNextFarmer}</span>
        </button>
      </div>

      {/* Main Grid: Dial + Live Queue Visualizer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Circular Dial (5 cols) */}
        <div className="lg:col-span-5">
          <CircularTimer
            waitMinutes={activeFarmerToken ? activeFarmerToken.estimatedWaitMinutes : 24}
            tokenNumber={activeFarmerToken ? activeFarmerToken.tokenNumber : 47}
            nowServingNumber={servingToken ? servingToken.tokenNumber : 41}
            farmersAhead={activeFarmerToken ? activeFarmerToken.farmersAhead : 6}
            tooltipText={t.aiWaitTooltip}
          />
        </div>

        {/* Right Active Queue Visualizer (7 cols) */}
        <div className="lg:col-span-7">
          <QueueVisualizer
            queue={liveQueue}
            activeTokenNumber={activeFarmerToken ? activeFarmerToken.tokenNumber : 47}
            onAdvance={advanceQueue}
            showAdminControls={false}
          />
        </div>
      </div>

      {/* Mandi Active Weighbridge Counters Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.countersTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Centre A – Thanjavur Mandi
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((c) => {
            const isServing = c.status === 'Serving';
            const isMaintenance = c.status === 'Maintenance';

            return (
              <div
                key={c.id}
                className={`rounded-lg border p-3.5 transition-all ${
                  isServing
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                    : isMaintenance
                    ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {c.name}
                  </span>
                  <Badge
                    label={c.status}
                    variant={isServing ? 'serving' : isMaintenance ? 'maintenance' : 'available'}
                    size="sm"
                    dot={isServing}
                  />
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                    Current Token
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {c.currentTokenNumber ? `#${c.currentTokenNumber}` : '--'}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Officer: {c.officerName.split(' ')[1] || c.officerName}</span>
                  <span>Served: {c.servedTodayCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info helper */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="h-4 w-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">How is the turnaround time calculated?</h4>
          <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.aiWaitTooltip} The dynamic queue telemetry adapts in real-time as weighbridge tokens are processed.
          </p>
        </div>
      </div>
    </div>
  );
};
