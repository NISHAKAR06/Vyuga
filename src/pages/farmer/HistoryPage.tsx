import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { ReceiptModal } from '../../components/modals/ReceiptModal';
import { ProcurementHistoryItem } from '../../types';
import {
  History,
  Search,
  Filter,
  FileText,
  Download,
  Calendar,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { farmerHistory, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [activeReceipt, setActiveReceipt] = useState<ProcurementHistoryItem | null>(null);

  const filteredHistory = farmerHistory.filter((item) => {
    const matchesSearch =
      item.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.centreName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCrop === 'ALL' || item.crop === selectedCrop;

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.historyTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Historical procurement weighment records, payment settlements and certified digital slips
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder={t.searchHistory}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-900 dark:text-white"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Crops</option>
            <option value="Paddy">Paddy</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Cotton">Cotton</option>
            <option value="Wheat">Wheat</option>
          </select>
        </div>
      </div>

      {/* Records Table / Cards on mobile */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Receipt #</th>
                <th className="px-5 py-3.5">{t.tableDate}</th>
                <th className="px-5 py-3.5">{t.tableCrop}</th>
                <th className="px-5 py-3.5">{t.tableQuantity}</th>
                <th className="px-5 py-3.5">{t.tableCentre}</th>
                <th className="px-5 py-3.5">{t.tableAmount}</th>
                <th className="px-5 py-3.5">{t.tablePayment}</th>
                <th className="px-5 py-3.5 text-right">{t.tableAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {item.receiptNumber}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {item.date}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">{item.crop}</span>
                    <span className="block text-[10px] text-slate-400">{item.variety}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {item.actualQuantityKg.toLocaleString('en-IN')} kg
                  </td>
                  <td className="px-5 py-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                    {item.centreName}
                  </td>
                  <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <Badge label={item.paymentStatus} variant="completed" size="sm" dot />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveReceipt(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{t.viewReceipt}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        record={activeReceipt}
      />
    </div>
  );
};
