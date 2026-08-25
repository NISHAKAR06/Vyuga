import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { Badge } from '../../components/common/Badge';
import { QueueForecastAreaChart } from '../../components/common/SimpleCharts';
import { queueForecastData } from '../../data/mockData';
import { CreateSlotModal } from '../../components/modals/CreateSlotModal';
import {
  Users,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Play,
  AlertTriangle,
  Building,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const {
    user,
    liveQueue,
    anomalyList,
    advanceQueue,
    setCurrentTab,
    t
  } = useApp();

  const [showCreateSlot, setShowCreateSlot] = useState(false);

  const waitingCount = liveQueue.filter(q => q.status === 'Booked' || q.status === 'Arrived').length;
  const servingToken = liveQueue.find(q => q.status === 'Now Serving');
  const unresolvedAnomalies = anomalyList.filter(
    a => a.anomaly.status === 'Verification Required' || a.anomaly.status === 'Anomaly Detected'
  );

  return (
    <div className="space-y-6">
      {/* Centre Header Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/15 via-teal-500/10 to-transparent p-6 dark:bg-blue-950/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                Official Desk
              </span>
              <span className="text-xs text-slate-400">ID: {user.id}</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.officerHeader}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Senior Agricultural Officer: <strong>{user.name}</strong> • Active Season: Kharif 2026
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowCreateSlot(true)}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-500 transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.createSlot}</span>
            </button>
            <button
              onClick={advanceQueue}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{t.callNext}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (6 KPIs) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title={t.todaysFarmers}
          value="125"
          subtitle="Total Registrations"
          icon={Users}
          iconColor="text-blue-500"
        />

        <KPICard
          title={t.servedFarmers}
          value="82"
          subtitle="Processed"
          badge={{ text: '65.6%', type: 'success' }}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
        />

        <KPICard
          title={t.waitingFarmers}
          value={waitingCount.toString()}
          subtitle="In Queue Now"
          badge={{ text: 'Active', type: 'warning' }}
          icon={Clock}
          iconColor="text-amber-500"
          onClick={() => setCurrentTab('live_queue')}
        />

        <KPICard
          title={t.totalTonnage}
          value="18.5 Tons"
          subtitle="Paddy & Cereals"
          icon={Scale}
          iconColor="text-teal-500"
        />

        <KPICard
          title={t.averageWaitTime}
          value="27 min"
          subtitle="Target: ≤ 25 min"
          icon={Clock}
          iconColor="text-emerald-800 dark:text-emerald-400"
          highlight={true}
        />

        <KPICard
          title={t.centreUtilization}
          value="78%"
          subtitle="Weighbridges 1-3"
          badge={{ text: 'Optimal', type: 'info' }}
          icon={TrendingUp}
          iconColor="text-blue-600"
        />
      </div>

      {/* Officer Hourly Queue & Throughput Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Queue Throughput Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Mandi Hourly Intake & Queue Throughput Analysis
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Hourly intake comparison: Current queue line vs scheduled slot capacity
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge label="PEAK INTAKE WINDOW" variant="warning" size="sm" />
            </div>
          </div>

          <div className="py-4">
            <QueueForecastAreaChart data={queueForecastData} />
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Avg</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">27 min</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-600 block">{t.officerForecastNextHour}</span>
              <span className="text-base font-black text-purple-600 dark:text-purple-400">34 min</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-600 block">{t.officerPredictedCrowd}</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">HIGH</span>
            </div>
          </div>
        </div>

        {/* Right Anomaly & Quick Action Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.anomalyAlertsTitle}
                </h3>
              </div>
              <Badge label={`${unresolvedAnomalies.length} {t.officerFlaggedCount}`} variant="anomaly" size="sm" />
            </div>

            <div className="mt-4 space-y-3">
              {unresolvedAnomalies.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentTab('anomaly_alerts')}
                  className="cursor-pointer rounded-2xl border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/30 p-3.5 hover:border-rose-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Farmer {item.farmerId}
                    </span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300">
                      Risk {item.anomaly.riskScore}/100
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.anomaly.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentTab('anomaly_alerts')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              <span>{t.officerReviewAllAnomalies}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={showCreateSlot}
        onClose={() => setShowCreateSlot(false)}
      />
    </div>
  );
};
