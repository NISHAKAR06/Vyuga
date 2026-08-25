import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { ProcurementCentre } from '../../types';
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  Phone,
  MapPin,
  Clock,
  Scale,
  Users,
  AlertTriangle
} from 'lucide-react';

export const CentreMonitoring: React.FC = () => {
  const { centres, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'utilization' | 'wait' | 'farmers'>('utilization');

  const filteredCentres = centres
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'utilization') return b.utilizationRate - a.utilizationRate;
      if (sortBy === 'wait') return b.currentAvgWaitMinutes - a.currentAvgWaitMinutes;
      return b.totalFarmersToday - a.totalFarmersToday;
    });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.centreMonitoringTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Real-time workload, queue congestion index and weighbridge utilization across district mandis
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by Centre name, Code (TNJ-01) or District..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-800 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-emerald-800 focus:outline-none"
          >
            <option value="ALL">{t.thLoadStatus}</option>
            <option value="High Load">{t.statusHighLoad}</option>
            <option value="Moderate">{t.statusModerate}</option>
            <option value="Normal">{t.statusNormal}</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-emerald-800 focus:outline-none"
          >
            <option value="utilization">Sort: Utilization %</option>
            <option value="wait">Sort: Waiting Time</option>
            <option value="farmers">Sort: Farmers Today</option>
          </select>
        </div>
      </div>

      {/* Mandis Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">{t.tableCentre}</th>
                <th className="px-4 py-3">{t.todaysFarmers}</th>
                <th className="px-4 py-3">{t.thIntakeTonnage}</th>
                <th className="px-4 py-3">{t.averageWaitTime}</th>
                <th className="px-4 py-3">{t.thMandiUtilization}</th>
                <th className="px-4 py-3 text-right">{t.thLoadStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredCentres.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-500">{c.code} • {c.district}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{c.totalFarmersToday}</span>
                    <span className="text-[10px] text-slate-500 block">Served: {c.servedToday} • Wait: {c.waitingNow}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-800 dark:text-emerald-400">
                    {(c.capacityPerDay / 1000).toFixed(0)} MT
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{c.currentAvgWaitMinutes} min</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Target: {c.predictedAvgWaitMinutes}m</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{c.utilizationRate}%</span>
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            c.utilizationRate > 85 ? 'bg-rose-600' : c.utilizationRate > 65 ? 'bg-amber-500' : 'bg-emerald-700'
                          }`}
                          style={{ width: `${c.utilizationRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge
                      label={c.status}
                      variant={c.status === 'High Load' ? 'high_load' : c.status === 'Moderate' ? 'moderate' : 'normal'}
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
