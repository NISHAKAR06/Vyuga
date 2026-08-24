import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { TokenRecord } from '../../types';
import {
  Users,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Scale,
  PauseCircle,
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const OfficerLiveQueue: React.FC = () => {
  const {
    liveQueue,
    counters,
    advanceQueue,
    updateTokenStage,
    updateCounterStatus,
    setCurrentTab,
    addToast,
    t
  } = useApp();

  const [selectedToken, setSelectedToken] = useState<TokenRecord | null>(null);

  const servingToken = liveQueue.find(q => q.status === 'Now Serving');
  const waitingTokens = liveQueue.filter(q => q.status === 'Booked' || q.status === 'Arrived');
  const nextToken = waitingTokens[0];

  const handleMarkArrived = (token: TokenRecord) => {
    updateTokenStage(token.id, 'at_centre', 'Arrived');
    addToast('Farmer Marked Arrived', `Token #${token.tokenNumber} is now at gate`, 'info');
  };

  const handleMarkAbsent = (token: TokenRecord) => {
    updateTokenStage(token.id, token.stage, 'Absent');
    addToast('Farmer Marked Absent', `Token #${token.tokenNumber} skipped`, 'warning');
  };

  const handleHold = (token: TokenRecord) => {
    updateTokenStage(token.id, token.stage, 'On Hold');
    addToast('Token Held', `Token #${token.tokenNumber} put on hold`, 'warning');
  };

  const handleStartWeighing = (token: TokenRecord) => {
    updateTokenStage(token.id, 'verification', 'Now Serving');
    setCurrentTab('procurement_process');
  };

  const handleComplete = (token: TokenRecord) => {
    updateTokenStage(token.id, 'procurement_completed', 'Completed', token.declaredQuantityKg);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Badge label="LIVE ●" variant="live" size="md" />
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.officerQueueTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time weighbridge counter dispatch, token calling and attendance management
          </p>
        </div>

        <button
          onClick={advanceQueue}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400 transition-all active:scale-95"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>{t.callNext}</span>
        </button>
      </div>

      {/* Main Focus: Currently Serving Farmer Card */}
      {servingToken ? (
        <div className="overflow-hidden rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-slate-900/10 dark:from-emerald-950/60 dark:via-slate-900/40 p-6 sm:p-8 shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-500/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                NOW SERVING AT WEIGHBRIDGE COUNTER 1
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  Token #{servingToken.tokenNumber}
                </span>
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  {servingToken.farmerName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ID: {servingToken.farmerId} • {servingToken.farmerVillage} • Phone: {servingToken.farmerPhone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                label={servingToken.anomaly.status}
                variant={servingToken.anomaly.detected ? 'verification' : 'cleared'}
                size="md"
                dot
              />
            </div>
          </div>

          <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Produce</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                {servingToken.crop} ({servingToken.cropVariety})
              </span>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Declared Quantity</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {servingToken.declaredQuantityKg.toLocaleString('en-IN')} kg
              </span>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Booked Slot</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                {servingToken.slotTimeWindow}
              </span>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Stage</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 block">
                {servingToken.stage.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action Buttons for Current Token */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => handleHold(servingToken)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100"
            >
              <PauseCircle className="h-4 w-4" />
              <span>{t.holdToken}</span>
            </button>

            <button
              onClick={() => handleStartWeighing(servingToken)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-500/20"
            >
              <Scale className="h-4 w-4" />
              <span>{t.startProcessing}</span>
            </button>

            <button
              onClick={() => handleComplete(servingToken)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.completeProcurement}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/40">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Farmer Currently at Weighbridge</h4>
          <button
            onClick={advanceQueue}
            className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
          >
            {t.callNext}
          </button>
        </div>
      )}

      {/* Waiting List Queue Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Upcoming Queue ({waitingTokens.length} Farmers Waiting)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Farmers scheduled for intake sorted by token order
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Token #</th>
                <th className="px-5 py-3.5">Farmer Name</th>
                <th className="px-5 py-3.5">Crop & Qty</th>
                <th className="px-5 py-3.5">Slot Window</th>
                <th className="px-5 py-3.5">Anomaly Status</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {waitingTokens.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-black text-base text-slate-900 dark:text-white">
                    #{item.tokenNumber}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.farmerName}</span>
                    <span className="text-[10px] text-slate-400">{item.farmerVillage}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">{item.crop}</span>
                    <span className="block text-[10px] text-emerald-600 font-bold">{item.declaredQuantityKg.toLocaleString('en-IN')} kg</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {item.slotTimeWindow}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={item.anomaly.status}
                      variant={item.anomaly.detected ? 'verification' : 'cleared'}
                      size="sm"
                      dot
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={item.status}
                      variant={item.status === 'Arrived' ? 'serving' : 'normal'}
                      size="sm"
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleMarkArrived(item)}
                        className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      >
                        {t.markArrived}
                      </button>
                      <button
                        onClick={() => handleMarkAbsent(item)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        {t.markAbsent}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
          Counter Operations & Maintenance Controls
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                <Badge label={c.status} variant={c.status === 'Serving' ? 'serving' : c.status === 'Available' ? 'available' : 'maintenance'} size="sm" />
              </div>
              <p className="text-slate-400 mt-1">Officer: {c.officerName}</p>

              <div className="mt-3 flex gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <button
                  onClick={() => updateCounterStatus(c.id, 'Serving')}
                  className="rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-[10px] font-bold"
                >
                  Serve
                </button>
                <button
                  onClick={() => updateCounterStatus(c.id, 'Available')}
                  className="rounded-lg bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-1 text-[10px] font-bold"
                >
                  Open
                </button>
                <button
                  onClick={() => updateCounterStatus(c.id, 'Maintenance')}
                  className="rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 px-2 py-1 text-[10px] font-bold"
                >
                  Maint.
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
