import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Table,
  Calendar,
  Building,
  CreditCard,
  AlertTriangle,
  Scale,
  CheckCircle2
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { addToast, t } = useApp();

  const [selectedReport, setSelectedReport] = useState('daily');

  const reportsList = [
    { id: 'daily', title: t.reportDaily, desc: 'Daily district-wise declared vs certified procurement quantities', icon: Calendar },
    { id: 'weekly', title: t.reportWeekly, desc: 'Centre utilization, average wait times and throughput index', icon: Building },
    { id: 'monthly', title: t.reportMonthly, desc: 'Comprehensive state-level procurement metrics and MSP totals', icon: Table },
    { id: 'crop_wise', title: t.reportCropWise, desc: 'Paddy, Wheat, Cotton, Groundnut and Sugarcane volume distribution', icon: Scale },
    { id: 'payment_dbt', title: t.reportPaymentDbt, desc: 'PFMS DBT payment clearance rates and bank reconciliation status', icon: CreditCard },
    { id: 'waiting_ai', title: t.reportWaitingAi, desc: 'AI waiting-time model accuracy and mandi congestion logs', icon: FileText },
    { id: 'anomaly', title: t.reportAnomaly, desc: 'Risk score audits and officer verification resolution rates', icon: AlertTriangle }
  ];

  const handleExportCsv = (title: string) => {
    addToast('CSV Export Ready', `${title} downloaded as .csv spreadsheet`, 'success');
  };

  const handleExportPdf = (title: string) => {
    addToast('PDF Report Generated', `${title} compiled and downloaded as official PDF report`, 'success');
  };

  const handlePrint = (title: string) => {
    addToast('Print Dialogue', `Printing ${title}`, 'info');
    window.print();
  };

  const currentReportObj = reportsList.find(r => r.id === selectedReport) || reportsList[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.reportsTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official statutory reports, analytical exports and mandi audit data extracts
        </p>
      </div>

      {/* Reports Selector Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {reportsList.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedReport === r.id;

          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-500/30 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                {r.title}
              </h4>
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {r.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Report Preview & Export Toolbar */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              REPORT PREVIEW
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {currentReportObj.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated: 26-Aug-2026 • State of Tamil Nadu Agricultural Marketing Board
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExportCsv(currentReportObj.title)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
            >
              <Download className="h-4 w-4 text-emerald-500" />
              <span>{t.exportCsv}</span>
            </button>

            <button
              onClick={() => handleExportPdf(currentReportObj.title)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-md shadow-purple-500/20"
            >
              <FileText className="h-4 w-4" />
              <span>{t.exportPdf}</span>
            </button>

            <button
              onClick={() => handlePrint(currentReportObj.title)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Printer className="h-4 w-4 text-slate-400" />
              <span>{t.print}</span>
            </button>
          </div>
        </div>

        {/* Mock Report Table Sample */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-bold uppercase text-[10px] text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3">District / Mandi</th>
                <th className="p-3">Farmers Serviced</th>
                <th className="p-3">Quantity (Tons)</th>
                <th className="p-3">Total Value (INR)</th>
                <th className="p-3">Avg Wait Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-3 font-bold">Thanjavur – APMC Mandi</td>
                <td className="p-3">450</td>
                <td className="p-3 font-black text-emerald-600">82.4 Tons</td>
                <td className="p-3 font-mono">₹1,91,16,800</td>
                <td className="p-3">27 min</td>
                <td className="p-3 text-emerald-600 font-bold">Optimal</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Kumbakonam – Regulated Market</td>
                <td className="p-3">280</td>
                <td className="p-3 font-black text-emerald-600">55.0 Tons</td>
                <td className="p-3 font-mono">₹1,27,60,000</td>
                <td className="p-3">21 min</td>
                <td className="p-3 text-emerald-600 font-bold">Optimal</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Trichy – Gandhi Market Terminal</td>
                <td className="p-3">390</td>
                <td className="p-3 font-black text-emerald-600">70.2 Tons</td>
                <td className="p-3 font-mono">₹1,62,86,400</td>
                <td className="p-3">38 min</td>
                <td className="p-3 text-amber-600 font-bold">Moderate</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Erode – Complex Terminal</td>
                <td className="p-3">410</td>
                <td className="p-3 font-black text-emerald-600">88.5 Tons</td>
                <td className="p-3 font-mono">₹2,05,32,000</td>
                <td className="p-3">31 min</td>
                <td className="p-3 text-rose-600 font-bold">High Load</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
