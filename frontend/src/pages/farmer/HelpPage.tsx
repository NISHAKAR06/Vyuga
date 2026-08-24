import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockCropData } from '../../data/mockData';
import {
  HelpCircle,
  Phone,
  Scale,
  Sparkles,
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
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.navHelp}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official Government Minimum Support Price (MSP) rate card, Mandi helplines & FAQ guidelines
        </p>
      </div>

      {/* Official MSP Rates Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Official MSP Rate Card (Kharif/Rabi 2026-27)
            </h3>
          </div>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            Government Certified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockCropData.map((crop) => (
            <div
              key={crop.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {crop.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {crop.season}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Variety: {crop.variety}
              </p>
              <div className="mt-3 flex items-baseline justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                <span className="text-xs text-slate-500">MSP / Quintal</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  ₹{crop.mspPerQuintal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helplines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <Phone className="h-6 w-6 text-emerald-500 mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Kisan Call Centre</h4>
          <p className="text-slate-500 mt-1">Toll-free 24x7 farmer advisory helpline</p>
          <span className="mt-3 block font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
            1800-180-1551
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <Building className="h-6 w-6 text-blue-500 mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Thanjavur Mandi Desk</h4>
          <p className="text-slate-500 mt-1">Procurement Centre A Control Room</p>
          <span className="mt-3 block font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
            +91 4362 278100
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-purple-500 mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">DBT PFMS Support</h4>
          <p className="text-slate-500 mt-1">Direct benefit transfer clearing queries</p>
          <span className="mt-3 block font-mono font-black text-purple-600 dark:text-purple-400 text-sm">
            1800-118-111
          </span>
        </div>
      </div>

      {/* FAQs */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Q: Does the AI automatically assign my procurement slot?
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              No. In AgriProcure, slots are created by Procurement Officers based on weighbridge capacity. Farmers freely choose any available time slot. AI is strictly used for dynamic queue waiting time predictions and crowd forecasting.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Q: What does "Verification Required" or "Anomaly Detected" mean?
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              It indicates that declared harvest quantity differs from your registered land acreage baseline or historical averages. This never marks anyone as fraudulent; it simply alerts the intake officer to perform a standard manual review at the weighbridge.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Q: When is the payment credited to my bank account?
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              Direct Benefit Transfer (DBT) is initiated within 2 hours of weighbridge certification and credited within 24–48 hours directly to your Aadhaar-linked bank account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
