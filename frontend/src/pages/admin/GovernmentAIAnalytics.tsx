import React from 'react';
import { useApp } from '../../context/AppContext';
import { QueueForecastAreaChart } from '../../components/common/SimpleCharts';
import { queueForecastData } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import {
  Clock,
  Scale,
  Landmark
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
            {t.adminAnalyticsTitle}
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {t.adminAnalyticsSub}
        </p>
      </div>

      {/* Hero Forecast Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Crowd Level */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t.adminCentreCapacityStatus}
            </span>
            <Badge label={t.adminHighIntakeBadge} variant="warning" size="sm" dot />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
            {t.mandiCentreAThanjavur}
          </div>
          <p className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-400">
            {t.crowdLevelTomorrow}
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {t.adminAdvisory1}
          </p>
        </div>

        {/* Waiting Prediction */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t.adminPeakWindowCard}
            </span>
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            35 {t.timerMinutes}
          </div>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.adminPeakWindowSub}
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {t.adminPeakWindowDesc}
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
            95 {t.centreProcured}
          </div>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.adminExpectedDailyIntake}
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {t.adminExpectedDailySub}
          </p>
        </div>
      </div>

      {/* Queue Simulation Curve Chart */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.adminThroughputCurveTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.adminThroughputCurveSub}
            </p>
          </div>
          <Badge label={t.adminSystemReliability} variant="available" size="sm" />
        </div>

        <QueueForecastAreaChart data={queueForecastData} />
      </div>
    </div>
  );
};
