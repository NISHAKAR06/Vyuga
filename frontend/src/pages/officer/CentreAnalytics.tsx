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
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.navCentreAnalytics}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Centre A – Thanjavur Mandi throughput metrics, average wait velocity and counter performance
        </p>
      </div>

      {/* Weekly Intake Chart */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Weekly Procurement Intake Volume
            </h3>
            <p className="text-xs text-slate-400">Actual Tonnage vs Mandi Daily Intake Capacity</p>
          </div>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
            2,800 Tons Total (Week)
          </span>
        </div>

        <WeeklyProcurementBarChart data={weeklyProcurementTrend} />
      </div>

      {/* Counter Efficiency & Wait Time Metrics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Avg Weighment Time</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            3.8 min
          </div>
          <p className="mt-1 text-xs text-slate-500">Per vehicle gross & tare cycle</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Scale className="h-4 w-4 text-blue-500" />
            <span>Daily Intake Pace</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            18.5 Tons / hr
          </div>
          <p className="mt-1 text-xs text-slate-500">Peak hour throughput</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
            <span>No-Show Rate</span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            2.1%
          </div>
          <p className="mt-1 text-xs text-slate-500">Farmers missing assigned slot</p>
        </div>
      </div>
    </div>
  );
};
