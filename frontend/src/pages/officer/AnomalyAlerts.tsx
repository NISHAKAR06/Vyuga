import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { RiskGaugeChart } from '../../components/common/SimpleCharts';
import { Modal } from '../../components/common/Modal';
import { TokenRecord } from '../../types';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Scale,
  Send,
  Eye,
  Info
} from 'lucide-react';

export const AnomalyAlerts: React.FC = () => {
  const { anomalyList, resolveAnomaly, t } = useApp();

  const [selectedCase, setSelectedCase] = useState<TokenRecord | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');

  const handleAction = (action: 'verify' | 'clear' | 'escalate') => {
    if (!selectedCase) return;
    resolveAnomaly(selectedCase.id, action, officerRemarks);
    setSelectedCase(null);
    setOfficerRemarks('');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-6 w-6 text-rose-500" />
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.anomalyAlertsTitle}
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          AI-assisted historical yield discrepancy detection. Officer review is mandatory prior to weighbridge finalization.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">{t.officerHitlProtocol}</h4>
          <p className="mt-0.5 text-[11px] opacity-90 leading-relaxed">
            The AI engine flags unusual statistical variations in harvest volume versus land acreage. It never marks a farmer as fraudulent. The Mandi Procurement Officer holds sole authority to verify, clear, or escalate consignments.
          </p>
        </div>
      </div>

      {/* Anomaly Cases Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {anomalyList.map((item) => {
          const isHighRisk = item.anomaly.riskScore >= 75;

          return (
            <div
              key={item.id}
              className={`overflow-hidden rounded-3xl border p-6 transition-all ${
                isHighRisk
                  ? 'border-rose-500/40 bg-white dark:bg-slate-900 shadow-lg shadow-rose-500/5'
                  : 'border-amber-500/30 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Farmer {item.farmerId}
                    </span>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold">
                      Token #{item.tokenNumber}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-black text-slate-900 dark:text-white">
                    {item.farmerName}
                  </h3>
                  <p className="text-xs text-slate-400">{item.farmerVillage}</p>
                </div>

                <Badge
                  label={item.anomaly.status}
                  variant={isHighRisk ? 'anomaly' : 'warning'}
                  size="sm"
                  dot
                />
              </div>

              {/* Gauge & Metrics */}
              <div className="my-4 flex items-center justify-between gap-4">
                <RiskGaugeChart
                  score={item.anomaly.riskScore}
                  statusText={item.anomaly.status}
                />

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">{t.thCurrentDeclared}:</span>
                    <span className="font-black text-rose-600 dark:text-rose-400">
                      {item.anomaly.currentQuantityKg.toLocaleString('en-IN')} kg
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">{t.thHistoricalAvg}:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {item.anomaly.historicalAvgKg.toLocaleString('en-IN')} kg
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">{t.landArea}:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {item.anomaly.landAreaAcres} Acres
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-bold block text-slate-900 dark:text-white mb-0.5">{t.officerAlertTrigger}</span>
                {item.anomaly.reason}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button
                  onClick={() => setSelectedCase(item)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm"
                >
                  Review & Action
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Dialog Modal */}
      <Modal
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={selectedCase ? `Officer Review: Farmer ${selectedCase.farmerId}` : ''}
        subtitle={selectedCase ? `${selectedCase.farmerName} • Declared: ${selectedCase.declaredQuantityKg} kg` : ''}
        maxWidth="lg"
      >
        {selectedCase && (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/30 p-4">
              <h4 className="font-bold text-rose-900 dark:text-rose-200">{t.officerDiscrepancyDesc}</h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedCase.anomaly.reason}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Officer Field Verification Remarks
              </label>
              <textarea
                rows={3}
                value={officerRemarks}
                onChange={e => setOfficerRemarks(e.target.value)}
                placeholder="Enter weighbridge inspection observation, crop condition or ad-hoc leased plot verification..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleAction('escalate')}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{t.escalateDistrict}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('verify')}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{t.verifyAndClear}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
