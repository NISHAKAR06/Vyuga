import React from 'react';
import { useApp } from '../../context/AppContext';
import { QueueForecastAreaChart, WeeklyProcurementBarChart } from '../../components/common/SimpleCharts';
import { queueForecastData, weeklyProcurementTrend } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Scale,
  Users,
  AlertTriangle,
  Building,
  Calendar
} from 'lucide-react';

export const GovernmentAIAnalytics: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.crowdPredictionTitle}
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          State-wide machine learning forecast engine: crowd congestion, peak arrival windows and wait time simulations
        </p>
      </div>

      {/* Hero Forecast Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Crowd Level */}
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-slate-900/5 to-slate-900/10 dark:from-purple-950/40 dark:via-slate-900/40 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Crowd Forecast
            </span>
            <Badge label="HIGH CROWD" variant="warning" size="sm" dot />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            Centre A – Thanjavur
          </div>
          <p className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            {t.crowdLevelTomorrow}
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Advisory: Deploy 2 auxiliary weighbridge operators to prevent entry gate backlog.
          </p>
        </div>

        {/* Waiting Prediction */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-slate-900/10 dark:from-amber-950/40 dark:via-slate-900/40 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Peak Waiting Prediction
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-400">
            48 min
          </div>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            Centre A Peak Window
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Predicted wait without dynamic slot regulation would exceed 120+ minutes.
          </p>
        </div>

        {/* Expected Volume */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-slate-900/10 dark:from-emerald-950/40 dark:via-slate-900/40 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t.expectedProcurementTons}
            </span>
            <Scale className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            95 Tons
          </div>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            Expected Daily Intake
          </p>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Based on registered farmer declarations and weather-driven harvest speed.
          </p>
        </div>
      </div>

      {/* AI Queue Simulation Curve Chart */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              State-wide Multi-Hour Queue Prediction Curve
            </h3>
            <p className="text-xs text-slate-400">
              Live Serving vs Next 6-Hour Predicted Arrivals (Dashed curve denotes machine learning forecast)
            </p>
          </div>
          <Badge label="AI MODEL CONFIDENCE: 94.2%" variant="available" size="sm" />
        </div>

        <QueueForecastAreaChart data={queueForecastData} />
      </div>
    </div>
  );
};
