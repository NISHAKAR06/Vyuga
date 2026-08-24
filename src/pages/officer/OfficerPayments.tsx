import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Building,
  Search,
  Filter
} from 'lucide-react';

export const OfficerPayments: React.FC = () => {
  const { payments, processPayment, t } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'Pending' | 'Processing' | 'Completed'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = payments.filter((item) => {
    const matchesTab = activeTab === 'ALL' || item.status === activeTab;
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.procurementId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.navOfficerPayments}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Batch authorization and PFMS gateway status for Direct Benefit Transfer disbursals
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
          {(['ALL', 'Processing', 'Completed', 'Pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              {tab === 'ALL' ? 'All Batches' : tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by Farmer or Procurement ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Procurement ID</th>
                <th className="px-5 py-3.5">Farmer Details</th>
                <th className="px-5 py-3.5">Crop & Certified Qty</th>
                <th className="px-5 py-3.5">DBT Disbursal Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Gateway Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {p.procurementId}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{p.farmerName}</span>
                    <span className="text-[10px] text-slate-400">{p.farmerAccount} ({p.bankName})</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">{p.crop}</span>
                    <span className="block text-[10px] text-emerald-600 font-bold">{p.quantityKg.toLocaleString('en-IN')} kg</span>
                  </td>
                  <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                    ₹{p.netAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={p.status}
                      variant={p.status === 'Completed' ? 'completed' : 'processing'}
                      size="sm"
                      dot
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {p.status !== 'Completed' ? (
                      <button
                        onClick={() => processPayment(p.id)}
                        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition-all"
                      >
                        Authorize DBT
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        UTR: {p.utrNumber?.slice(0, 10)}...
                      </span>
                    )}
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
