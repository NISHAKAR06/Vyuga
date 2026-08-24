import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockCropData } from '../../data/mockData';
import {
  Settings,
  Scale,
  Sliders,
  ShieldCheck,
  Save,
  CheckCircle2
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { addToast, t } = useApp();

  const [crops, setCrops] = useState(mockCropData);
  const [anomalyThreshold, setAnomalyThreshold] = useState(75);
  const [maxWaitAlertMin, setMaxWaitAlertMin] = useState(45);

  const handlePriceChange = (id: string, newMsp: number) => {
    setCrops(prev => prev.map(c => c.id === id ? { ...c, mspPerQuintal: newMsp } : c));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Updated', 'MSP pricing rates and anomaly threshold parameters updated state-wide', 'success');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.navAdminSettings}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          State agricultural marketing parameters, statutory MSP rate cards and AI alert tolerances
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* MSP Rates Configurator */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Scale className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Minimum Support Price (MSP) Rate Card Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {crops.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{c.variety}</span>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block uppercase font-bold">Rate (₹ / Quintal)</label>
                  <input
                    type="number"
                    value={c.mspPerQuintal}
                    onChange={e => handlePriceChange(c.id, Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs font-black text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Model Alert Thresholds */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="h-5 w-5 text-purple-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              AI Alert Tolerances & Mandi Overload Triggers
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Anomaly High-Risk Score Ceiling</span>
                <span className="text-rose-600 dark:text-rose-400 font-black">{anomalyThreshold}/100</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={anomalyThreshold}
                onChange={e => setAnomalyThreshold(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Farmers exceeding this statistical variance threshold trigger mandatory weighbridge verification.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Mandi Wait Time Congestion Alert</span>
                <span className="text-amber-600 dark:text-amber-400 font-black">{maxWaitAlertMin} min</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                value={maxWaitAlertMin}
                onChange={e => setMaxWaitAlertMin(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Triggers notification to District Agricultural Officers when mandi wait velocity slows down.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-500 shadow-md shadow-purple-500/25 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
