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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              OPERATIONAL
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.officerQueueTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Real-time weighbridge counter dispatch, token calling and attendance management
          </p>
        </div>

        <button
          onClick={advanceQueue}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{t.callNext}</span>
        </button>
      </div>

      {/* Main Focus: Currently Serving Farmer Card */}
      {servingToken ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-200 dark:border-emerald-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                NOW SERVING AT WEIGHBRIDGE COUNTER 1
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Token #{servingToken.tokenNumber}
                </span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {servingToken.farmerName}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t.tableCrop}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                {servingToken.crop} ({servingToken.cropVariety})
              </span>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t.declaredQuantity}</span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-0.5 block">
                {servingToken.declaredQuantityKg.toLocaleString('en-IN')} kg
              </span>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t.thBookedSlot}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                {servingToken.slotTimeWindow}
              </span>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t.tableStatus}</span>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-0.5 block">
                {servingToken.stage.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action Buttons for Current Token */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <button
              onClick={() => handleHold(servingToken)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors"
            >
              <PauseCircle className="h-4 w-4" />
              <span>{t.holdToken}</span>
            </button>

            <button
              onClick={() => handleStartWeighing(servingToken)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-800 shadow-sm transition-colors"
            >
              <Scale className="h-4 w-4" />
              <span>{t.startProcessing}</span>
            </button>

            <button
              onClick={() => handleComplete(servingToken)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-900 shadow-sm transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.completeProcurement}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-white dark:bg-slate-900">
          <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{t.officerNoFarmerWeighbridge}</h4>
          <button
            onClick={advanceQueue}
            className="mt-3 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-colors"
          >
            {t.callNext}
          </button>
        </div>
      )}

      {/* Waiting List Queue Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Upcoming Queue ({waitingTokens.length} {t.officerFarmersWaitingSuffix})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Farmers scheduled for intake sorted by token order
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Token #</th>
                <th className="px-4 py-3">{t.thFarmerName}</th>
                <th className="px-4 py-3">{t.thProduceQty}</th>
                <th className="px-4 py-3">{t.thTimeWindow}</th>
                <th className="px-4 py-3">{t.thAnomalyStatus}</th>
                <th className="px-4 py-3">{t.tableStatus}</th>
                <th className="px-4 py-3 text-right">{t.thDeskActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {waitingTokens.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                    #{item.tokenNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.farmerName}</span>
                    <span className="text-[10px] text-slate-500">{item.farmerVillage}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{item.crop}</span>
                    <span className="block text-[10px] text-emerald-800 dark:text-emerald-400 font-bold">{item.declaredQuantityKg.toLocaleString('en-IN')} kg</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {item.slotTimeWindow}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={item.anomaly.status}
                      variant={item.anomaly.detected ? 'verification' : 'cleared'}
                      size="sm"
                      dot
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={item.status}
                      variant={item.status === 'Arrived' ? 'serving' : 'normal'}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleMarkArrived(item)}
                        className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                      >
                        {t.markArrived}
                      </button>
                      <button
                        onClick={() => handleMarkAbsent(item)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          Counter Operations & Maintenance Controls
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-800/40 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                <Badge label={c.status} variant={c.status === 'Serving' ? 'serving' : c.status === 'Available' ? 'available' : 'maintenance'} size="sm" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Officer: {c.officerName}</p>

              <div className="mt-3 flex gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => updateCounterStatus(c.id, 'Serving')}
                  className="rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-1 text-[10px] font-bold"
                >
                  Serve
                </button>
                <button
                  onClick={() => updateCounterStatus(c.id, 'Available')}
                  className="rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 px-2 py-1 text-[10px] font-bold"
                >
                  Open
                </button>
                <button
                  onClick={() => updateCounterStatus(c.id, 'Maintenance')}
                  className="rounded bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 px-2 py-1 text-[10px] font-bold"
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
