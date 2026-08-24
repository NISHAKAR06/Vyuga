import React from 'react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { Badge } from '../../components/common/Badge';
import { districtPerformanceData } from '../../data/mockData';
import {
  ShieldCheck,
  Building2,
  Users,
  Scale,
  Clock,
  CreditCard,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  FileText,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, setCurrentTab, t } = useApp();

  return (
    <div className="space-y-6">
      {/* State Command Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-600/15 via-indigo-500/10 to-transparent p-6 dark:bg-purple-950/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                State Agricultural Command Portal
              </span>
              <span className="text-xs text-slate-400">Directorate of Agri Marketing</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.adminTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              State Administrator: <strong>{user.name}</strong> • Real-time Monitoring Across All Districts
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentTab('ai_analytics')}
              className="flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 hover:bg-purple-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Crowd Forecasts</span>
            </button>
            <button
              onClick={() => setCurrentTab('reports')}
              className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
            >
              <FileText className="h-4 w-4 text-purple-500" />
              <span>Export State Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 State-Level KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
        <KPICard
          title={t.totalStateFarmers}
          value="12,450"
          subtitle="Enrolled"
          icon={Users}
          iconColor="text-blue-500"
        />

        <KPICard
          title={t.activeProcurements}
          value="3,280"
          subtitle="Today Active"
          badge={{ text: '+12%', type: 'success' }}
          icon={Scale}
          iconColor="text-emerald-500"
        />

        <KPICard
          title={t.stateTonnage}
          value="2,450 Tons"
          subtitle="All Crops"
          icon={TrendingUp}
          iconColor="text-teal-500"
        />

        <KPICard
          title={t.activeCentresCount}
          value="42"
          subtitle="Centres Active"
          icon={Building2}
          iconColor="text-indigo-500"
          onClick={() => setCurrentTab('centres')}
        />

        <KPICard
          title={t.stateAvgWait}
          value="32 min"
          subtitle="State Benchmark"
          icon={Clock}
          iconColor="text-amber-500"
        />

        <KPICard
          title={t.pendingDisbursals}
          value="330"
          subtitle="DBT Pending"
          badge={{ text: '₹2.4 Cr', type: 'warning' }}
          icon={CreditCard}
          iconColor="text-blue-500"
        />

        <KPICard
          title={t.stateAnomalyCases}
          value="18"
          subtitle="Audit Queue"
          badge={{ text: 'Review', type: 'error' }}
          icon={AlertTriangle}
          iconColor="text-rose-500"
          onClick={() => setCurrentTab('anomaly_monitoring')}
        />
      </div>

      {/* District-wise Performance Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              District Procurement & Load Index
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live mandi intake velocity and average queue waiting times across key agricultural zones
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('centres')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>All Centres</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">District</th>
                <th className="px-5 py-3.5">Active Mandis</th>
                <th className="px-5 py-3.5">Farmers Today</th>
                <th className="px-5 py-3.5">Procured Tonnage</th>
                <th className="px-5 py-3.5">Avg Wait Time</th>
                <th className="px-5 py-3.5">Load Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {districtPerformanceData.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {d.district}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {d.centres} APMC Mandis
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                    {d.farmers.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 font-black text-emerald-600 dark:text-emerald-400">
                    {d.tonnage} Tons
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">{d.avgWaitMin} min</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={d.status}
                      variant={d.status === 'High Load' ? 'high_load' : d.status === 'Moderate' ? 'moderate' : 'normal'}
                      size="sm"
                      dot
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
