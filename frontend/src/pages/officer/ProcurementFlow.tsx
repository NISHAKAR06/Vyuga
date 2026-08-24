import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { TokenRecord } from '../../types';
import {
  Scale,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  QrCode,
  FileCheck,
  User,
  ArrowRight
} from 'lucide-react';

export const ProcurementFlow: React.FC = () => {
  const { liveQueue, updateTokenStage, setCurrentTab, addToast, t } = useApp();

  const activeServing = liveQueue.find(q => q.status === 'Now Serving') || liveQueue[0];
  const [selectedTokenId, setSelectedTokenId] = useState<string>(activeServing?.id || '');

  const currentToken = liveQueue.find(q => q.id === selectedTokenId) || activeServing;

  const [actualQty, setActualQty] = useState<number>(currentToken ? currentToken.declaredQuantityKg : 3000);
  const [moisture, setMoisture] = useState<number>(14.2);
  const [grade, setGrade] = useState<TokenRecord['qualityGrade']>('Grade A');
  const [remarks, setRemarks] = useState<string>('Standard quality weighbridge certification passed.');

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentToken) return;

    updateTokenStage(
      currentToken.id,
      'procurement_completed',
      'Completed',
      Number(actualQty),
      remarks,
      Number(moisture),
      grade
    );

    addToast(
      'Procurement Completed',
      `Token #${currentToken.tokenNumber} (${currentToken.farmerName}) certified for ${actualQty} kg. DBT Payment calculation initiated.`,
      'success'
    );

    setCurrentTab('payments');
  };

  const handleReject = () => {
    if (!currentToken) return;
    updateTokenStage(currentToken.id, 'verification', 'Absent', undefined, 'Consignment failed moisture limits.');
    addToast('Consignment Rejected', `Token #${currentToken.tokenNumber} rejected due to high moisture`, 'error');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Scale className="h-6 w-6 text-emerald-500" />
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.navProcurementProcess}
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official weighbridge intake terminal: record net certified weights and quality grades
        </p>
      </div>

      {/* Token Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          Select Token:
        </span>
        {liveQueue.map((item) => {
          const isSelected = item.id === selectedTokenId;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedTokenId(item.id);
                setActualQty(item.declaredQuantityKg);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              #{item.tokenNumber} {item.farmerName.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {currentToken && (
        <form onSubmit={handleAccept} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Farmer Card Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                PROCURING CONSIGNMENT
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  Token #{currentToken.tokenNumber}
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {currentToken.farmerName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ID: {currentToken.farmerId} • {currentToken.farmerVillage} • {currentToken.crop} ({currentToken.cropVariety})
              </p>
            </div>

            <Badge
              label={currentToken.anomaly.status}
              variant={currentToken.anomaly.detected ? 'verification' : 'cleared'}
              size="md"
              dot
            />
          </div>

          {/* Weighbridge Inputs Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Declared Quantity (kg)
              </label>
              <input
                type="text"
                disabled
                value={`${currentToken.declaredQuantityKg.toLocaleString('en-IN')} kg`}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 p-3 text-xs font-bold text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t.actualQuantityKg} *
              </label>
              <input
                type="number"
                min="100"
                step="10"
                value={actualQty}
                onChange={e => setActualQty(Number(e.target.value))}
                required
                className="mt-1.5 w-full rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-800 p-3 text-sm font-black text-slate-900 dark:text-white focus:outline-none ring-2 ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t.moisturePercent}
              </label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={e => setMoisture(Number(e.target.value))}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">FAQ Standard: max 17.0%</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t.qualityGrade}
              </label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value as any)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Grade A">Grade A (Fine Quality MSP + ₹20/q bonus)</option>
                <option value="Standard (FAQ)">Standard (Fair Average Quality FAQ)</option>
                <option value="Grade B">Grade B</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t.officerRemarks}
              </label>
              <input
                type="text"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
            <button
              type="button"
              onClick={handleReject}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <XCircle className="h-4 w-4" />
              <span>{t.rejectProcurement}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400 transition-all active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{t.acceptProcurement}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
