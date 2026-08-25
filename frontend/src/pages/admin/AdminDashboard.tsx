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
  TrendingUp,
  FileText,
  ArrowRight,
  Landmark
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, setCurrentTab, t } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* State Command Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                STATE HEADQUARTERS
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t.adminFoodDept}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.adminTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              State Administrator: <strong>{user.name}</strong> • Live Oversight Across 38 Procurement Districts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentTab('ai_analytics')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t.adminStateCapacityBtn}</span>
            </button>
            <button
              onClick={() => setCurrentTab('reports')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span>{t.adminExportReportsBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* State-Level KPI Cards: Tier 1 - Primary Intake Volume (4 Cards) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <KPICard
            title={t.totalStateFarmers}
            value="12,450"
            subtitle="Enrolled Farmers"
            icon={Users}
            iconColor="text-blue-700 dark:text-blue-400"
          />

          <KPICard
            title={t.activeProcurements}
            value="3,280"
            subtitle="Today Active"
            badge={{ text: '+12%', type: 'success' }}
            icon={Scale}
            iconColor="text-emerald-800 dark:text-emerald-400"
          />

          <KPICard
            title={t.stateTonnage}
            value="2,450 MT"
            subtitle="All Procurement Crops"
            icon={TrendingUp}
            iconColor="text-teal-700 dark:text-teal-400"
          />

          <KPICard
            title={t.activeCentresCount}
            value="42"
            subtitle="Active DPC Mandis"
            icon={Building2}
            iconColor="text-slate-700 dark:text-slate-300"
            onClick={() => setCurrentTab('centres')}
          />
        </div>

        {/* Tier 2 - Operational & Audit Metrics (3 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <KPICard
            title={t.stateAvgWait}
            value="32 min"
            subtitle="Avg Mandi Turnaround"
            icon={Clock}
            iconColor="text-amber-700 dark:text-amber-400"
          />

          <KPICard
            title={t.pendingDisbursals}
            value="330"
            subtitle="PFMS DBT Batches"
            badge={{ text: '₹2.4 Cr', type: 'warning' }}
            icon={CreditCard}
            iconColor="text-blue-700 dark:text-blue-400"
          />

          <KPICard
            title={t.stateAnomalyCases}
            value="18"
            subtitle="Under Field Audit"
            badge={{ text: 'Action Required', type: 'error' }}
            icon={AlertTriangle}
            iconColor="text-rose-600 dark:text-rose-400"
            onClick={() => setCurrentTab('anomaly_monitoring')}
          />
        </div>
      </div>

      {/* District-wise Performance Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              District Procurement & Intake Index
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live Mandi intake throughput and average queue turnaround times across agricultural zones
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('centres')}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t.adminAllDpcCentres}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">{t.adminDistrict}</th>
                <th className="px-4 py-3">{t.thActiveMandis}</th>
                <th className="px-4 py-3">{t.todaysFarmers}</th>
                <th className="px-4 py-3">{t.thIntakeTonnage}</th>
                <th className="px-4 py-3">{t.averageWaitTime}</th>
                <th className="px-4 py-3">{t.thLoadStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {districtPerformanceData.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {d.district}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {d.centres} Direct Centres
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                    {d.farmers.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-800 dark:text-emerald-400">
                    {d.tonnage} MT
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{d.avgWaitMin} min</span>
                  </td>
                  <td className="px-4 py-3">
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
