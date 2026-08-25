import React from 'react';
import { useApp } from '../../context/AppContext';
import { QueueForecastAreaChart, WeeklyProcurementBarChart } from '../../components/common/SimpleCharts';
import { queueForecastData, weeklyProcurementTrend } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  Clock,
  Scale,
  Users,
  AlertTriangle,
  Building,
  Calendar,
  Landmark,
  FileCheck
} from 'lucide-react';

export const GovernmentAIAnalytics: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Landmark className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            State Mandi Capacity & Arrival Queue Analytics
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Directorate oversight: centre capacity telemetry, arrival velocity, peak intake windows, and processing efficiency
        </p>
      </div>

      {/* Hero Forecast Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Crowd Level */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Centre Capacity Status
            </span>
            <Badge label="HIGH INTAKE" variant="warning" size="sm" dot />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
            Centre A – Thanjavur
          </div>
          <p className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-400">
            {t.crowdLevelTomorrow}
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Operational Advisory: Deploy 2 auxiliary weighbridge operators to streamline intake.
          </p>
        </div>

        {/* Waiting Prediction */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Peak Turnaround Window
            </span>
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            35 mins
          </div>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            Centre A Peak Operating Window
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Turnaround time stabilized via scheduled 1-hour farmer slot allocation.
          </p>
        </div>

        {/* Expected Volume */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t.expectedProcurementTons}
            </span>
            <Scale className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-800 dark:text-emerald-300">
            95 Tons
          </div>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            Expected Daily Intake
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Calculated from registered farmer crop declarations and booked arrival slots.
          </p>
        </div>
      </div>

      {/* Queue Simulation Curve Chart */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              State-wide Multi-Hour Arrival & Weighment Throughput Curve
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live Servicing vs Scheduled Hourly Inflow (Dashed curve denotes scheduled slot capacity)
            </p>
          </div>
          <Badge label="SYSTEM RELIABILITY: 99.4%" variant="available" size="sm" />
        </div>

        <QueueForecastAreaChart data={queueForecastData} />
      </div>
    </div>
  );
};
