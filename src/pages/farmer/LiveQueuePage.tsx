import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularTimer } from '../../components/common/CircularTimer';
import { QueueVisualizer } from '../../components/common/QueueVisualizer';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Play,
  Scale,
  Sparkles,
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Badge label="LIVE ●" variant="live" size="md" />
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.liveQueueTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t.liveQueueSub}
          </p>
        </div>

        {/* Demo Advance Simulation Button */}
        <button
          onClick={advanceQueue}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400 transition-all active:scale-95"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>{t.simulateNextFarmer}</span>
        </button>
      </div>

      {/* Main Grid: AI Dial + Live Queue Visualizer */}
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
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.countersTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Centre A – Thanjavur Mandi
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((c) => {
            const isServing = c.status === 'Serving';
            const isMaintenance = c.status === 'Maintenance';

            return (
              <div
                key={c.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isServing
                    ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : isMaintenance
                    ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {c.name}
                  </span>
                  <Badge
                    label={c.status}
                    variant={isServing ? 'serving' : isMaintenance ? 'maintenance' : 'available'}
                    size="sm"
                    dot={isServing}
                  />
                </div>

                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Current Token
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {c.currentTokenNumber ? `#${c.currentTokenNumber}` : '--'}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Officer: {c.officerName.split(' ')[1] || c.officerName}</span>
                  <span>Served: {c.servedTodayCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info helper */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-4 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">How is the waiting time estimated?</h4>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.aiWaitTooltip} The AI dynamic model adapts every time a farmer is weighed and certified at the weighbridge.
          </p>
        </div>
      </div>
    </div>
  );
};
