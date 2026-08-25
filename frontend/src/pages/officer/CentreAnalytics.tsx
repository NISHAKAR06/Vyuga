import React from 'react';
import { useApp } from '../../context/AppContext';
import { WeeklyProcurementBarChart } from '../../components/common/SimpleCharts';
import { weeklyProcurementTrend } from '../../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Scale,
  Users,
  Building,
  CheckCircle2
} from 'lucide-react';

export const CentreAnalytics: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.navCentreAnalytics}
        </h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Centre A – Thanjavur Mandi throughput metrics, average wait velocity and counter performance
        </p>
      </div>

      {/* Weekly Intake Chart */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Weekly Procurement Intake Volume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Actual Tonnage vs Mandi Daily Intake Capacity</p>
          </div>
          <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            2,800 Tons Total (Week)
          </span>
        </div>

        <WeeklyProcurementBarChart data={weeklyProcurementTrend} />
      </div>

      {/* Counter Efficiency & Wait Time Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Clock className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
            <span>Avg Weighment Time</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            3.8 min
          </div>
          <p className="mt-1 text-xs text-slate-500">Per vehicle gross & tare cycle</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Scale className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            <span>Daily Intake Pace</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            18.5 Tons / hr
          </div>
          <p className="mt-1 text-xs text-slate-500">Peak hour throughput</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <span>No-Show Rate</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            2.1%
          </div>
          <p className="mt-1 text-xs text-slate-500">Farmers missing assigned slot</p>
        </div>
      </div>
    </div>
  );
};
