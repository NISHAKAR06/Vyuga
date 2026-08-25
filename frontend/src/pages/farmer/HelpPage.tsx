import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockCropData } from '../../data/mockData';
import {
  HelpCircle,
  Phone,
  Scale,
  ShieldCheck,
  Building,
  Info,
  Clock,
  BookOpen
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.navHelp}
        </h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Official Government Minimum Support Price (MSP) rate card, Mandi helplines & FAQ guidelines
        </p>
      </div>

      {/* Official MSP Rates Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official MSP Rate Card (Kharif/Rabi 2026-27)
            </h3>
          </div>
          <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Government Certified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockCropData.map((crop) => (
            <div
              key={crop.id}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {crop.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {crop.season}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Variety: {crop.variety}
              </p>
              <div className="mt-2.5 flex items-baseline justify-between border-t border-slate-200 dark:border-slate-700/60 pt-2">
                <span className="text-[11px] text-slate-500">MSP / Quintal</span>
                <span className="text-sm font-black text-emerald-800 dark:text-emerald-400">
                  ₹{crop.mspPerQuintal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helplines */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <Phone className="h-5 w-5 text-emerald-800 dark:text-emerald-400 mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Kisan Call Centre</h4>
          <p className="text-slate-500 text-[11px] mt-0.5">Toll-free 24x7 farmer advisory helpline</p>
          <span className="mt-2.5 block font-mono font-bold text-emerald-800 dark:text-emerald-400 text-xs">
            1800-180-1551
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <Building className="h-5 w-5 text-blue-700 dark:text-blue-400 mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Thanjavur Mandi Desk</h4>
          <p className="text-slate-500 text-[11px] mt-0.5">Procurement Centre A Control Room</p>
          <span className="mt-2.5 block font-mono font-bold text-blue-700 dark:text-blue-400 text-xs">
            +91 4362 278100
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-slate-700 dark:text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">DBT PFMS Support</h4>
          <p className="text-slate-500 text-[11px] mt-0.5">Direct benefit transfer clearing queries</p>
          <span className="mt-2.5 block font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
            1800-118-111
          </span>
        </div>
      </div>
    </div>
  );
};
