import React from 'react';
import { useApp } from '../../context/AppContext';
import { Stepper } from '../../components/common/Stepper';
import { Badge } from '../../components/common/Badge';
import {
  CheckCircle2,
  Clock,
  Scale,
  QrCode,
  FileCheck,
  Building,
  User,
  ShieldCheck
} from 'lucide-react';

export const ProcurementStatus: React.FC = () => {
  const { activeFarmerToken, t } = useApp();

  const currentStage = activeFarmerToken ? activeFarmerToken.stage : 'waiting';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.procurementStatusTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Live 8-stage procurement lifecycle tracker from produce registration to bank credit
        </p>
      </div>

      {/* Main Stepper Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ACTIVE PROCUREMENT LOT
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {activeFarmerToken ? activeFarmerToken.produceId : 'PRD-TNJ-2026-904'}
            </h3>
          </div>
          <Badge
            label={currentStage.replace(/_/g, ' ').toUpperCase()}
            variant="processing"
            size="md"
            dot
          />
        </div>

        {/* Stepper Component */}
        <div className="py-4">
          <Stepper currentStage={currentStage} orientation="horizontal" />
        </div>
      </div>

      {/* Detailed Current Stage Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left Stage Details (7 cols) */}
        <div className="md:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-500" />
            <span>Consignment Certification Summary</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Crop / Variety</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {activeFarmerToken ? activeFarmerToken.crop : 'Paddy'} ({activeFarmerToken?.cropVariety || 'Ponni Samba'})
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Declared Weight</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {activeFarmerToken ? activeFarmerToken.declaredQuantityKg.toLocaleString('en-IN') : '3,000'} kg
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Assigned Counter</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Weighbridge Counter 1
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Intake Officer</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                K. Senthil Nathan
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 text-xs text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Weighbridge Tare & Net Weight Ready</span>
            </div>
            <p className="mt-1 text-[11px] opacity-90">
              When your vehicle enters the weighbridge platform, gross and tare weights are automatically logged to eliminate discrepancy.
            </p>
          </div>
        </div>

        {/* Right Vertical Milestones (5 cols) */}
        <div className="md:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Stage Milestones
          </h3>
          <Stepper currentStage={currentStage} orientation="vertical" />
        </div>
      </div>
    </div>
  );
};
