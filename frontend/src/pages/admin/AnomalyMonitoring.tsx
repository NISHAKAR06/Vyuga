import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Building,
  Eye,
  Info
} from 'lucide-react';

export const AnomalyMonitoring: React.FC = () => {
  const { anomalyList, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const filtered = anomalyList.filter((item) => {
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.centreName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || item.anomaly.riskLevel === selectedRisk;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-6 w-6 text-rose-500" />
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.anomalyMonitoringTitle}
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          State-wide surveillance of statistical harvest discrepancies, multiple mandi registrations and acreage anomalies
        </p>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.adminTotalAnomalies}</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">18</span>
          <span className="text-[10px] text-slate-400">{t.adminFlaggedStatewide}</span>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">{t.highRiskCases}</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">5</span>
          <span className="text-[10px] text-rose-500">Risk Score &gt; 75/100</span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">{t.mediumRiskCases}</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">8</span>
          <span className="text-[10px] text-amber-500">Risk Score 40-74</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">{t.lowRiskCases}</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">5</span>
          <span className="text-[10px] text-emerald-500">Risk Score &lt; 40</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by Farmer ID, Name or Centre..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">{t.adminAllRiskLevels}</option>
            <option value="HIGH">{t.adminHighRiskOnly}</option>
            <option value="MEDIUM">{t.adminMediumRisk}</option>
            <option value="LOW">{t.adminLowRisk}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">{t.thFarmerToken}</th>
                <th className="px-5 py-3.5">{t.tableCentre}</th>
                <th className="px-5 py-3.5">{t.thCurrentDeclared}</th>
                <th className="px-5 py-3.5">{t.thHistoricalAvg}</th>
                <th className="px-5 py-3.5">{t.thRiskScore}</th>
                <th className="px-5 py-3.5 text-right">{t.thAuditStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.farmerName}</span>
                    <span className="font-mono text-[10px] text-slate-400">Farmer {item.farmerId}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {item.centreName.split('–')[0]}
                  </td>
                  <td className="px-5 py-4 font-black text-rose-600 dark:text-rose-400">
                    {item.anomaly.currentQuantityKg.toLocaleString('en-IN')} kg
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {item.anomaly.historicalAvgKg.toLocaleString('en-IN')} kg
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-black text-sm ${
                      item.anomaly.riskScore >= 75 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.anomaly.riskScore}/100
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Badge
                      label={item.anomaly.status}
                      variant={item.anomaly.status === 'Cleared' ? 'cleared' : item.anomaly.riskScore >= 75 ? 'anomaly' : 'warning'}
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
