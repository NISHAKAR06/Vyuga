import React from 'react';
import { ProcurementStage } from '../../types';
import { Check, Clock, CircleDot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StepperProps {
  currentStage: ProcurementStage;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({
  currentStage,
  orientation = 'horizontal'
}) => {
  const { t } = useApp();

  const stages: { key: ProcurementStage; label: string; desc: string }[] = [
    { key: 'registration', label: t.stageRegistration, desc: 'Produce & Land declared' },
    { key: 'slot_selected', label: t.stageSlotSelected, desc: 'Centre & Time booked' },
    { key: 'waiting', label: t.stageWaiting, desc: 'In queue with Token' },
    { key: 'at_centre', label: t.stageAtCentre, desc: 'Vehicle gate entry' },
    { key: 'verification', label: t.stageVerification, desc: 'Weighbridge & Quality check' },
    { key: 'procurement_completed', label: t.stageProcurementCompleted, desc: 'Quantity certified' },
    { key: 'payment_processing', label: t.stagePaymentProcessing, desc: 'PFMS DBT initiated' },
    { key: 'payment_completed', label: t.stagePaymentCompleted, desc: 'Directly credited to Bank' }
  ];

  const stageOrder: ProcurementStage[] = [
    'registration',
    'slot_selected',
    'waiting',
    'at_centre',
    'verification',
    'procurement_completed',
    'payment_processing',
    'payment_completed'
  ];

  const currentIndex = stageOrder.indexOf(currentStage);

  if (orientation === 'vertical') {
    return (
      <div className="relative flex flex-col space-y-6">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.key} className="relative flex items-start gap-4">
              {/* Vertical connector line */}
              {idx < stages.length - 1 && (
                <div
                  className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 text-emerald-500 ring-4 ring-emerald-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : isCurrent ? (
                  <CircleDot className="h-4 w-4 animate-pulse stroke-[3]" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Text */}
              <div className="pt-0.5">
                <p className={`text-sm font-bold ${
                  isCurrent
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isCompleted
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {stage.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Stepper for desktop/responsive
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex min-w-[720px] items-center justify-between">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center text-center">
                {/* Stage Circle */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 ring-4 ring-emerald-500/20'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <CircleDot className="h-4 w-4 animate-pulse stroke-[3]" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Stage Title */}
                <span className={`mt-2 max-w-[90px] text-xs font-bold ${
                  isCurrent
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {stage.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < stages.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 -mt-5 transition-colors ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
