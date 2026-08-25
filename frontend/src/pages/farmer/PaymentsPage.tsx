import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  DollarSign,
  Download,
  AlertCircle
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { payments, user, addToast, t } = useApp();

  const farmerPayments = payments.filter(p => p.farmerId === user.id || p.farmerId === 'F-TN-2026-8841');
  const activePayment = farmerPayments[0] || payments[0];

  const handleDownloadInvoice = () => {
    addToast('DBT Statement Downloaded', 'Payment remittance voucher downloaded as PDF', 'success');
  };

  const timelineSteps = [
    {
      title: t.paymentStage1Title,
      description: t.paymentStage1Desc,
      timestamp: '2026-08-26 11:30 AM',
      completed: true,
      current: false
    },
    {
      title: t.paymentStage2Title,
      description: t.paymentStage2Desc,
      timestamp: '2026-08-26 11:35 AM',
      completed: true,
      current: false
    },
    {
      title: t.paymentStage3Title,
      description: t.paymentStage3Desc,
      timestamp: '2026-08-26 11:45 AM',
      completed: true,
      current: false
    },
    {
      title: t.paymentStage4Title,
      description: t.paymentStage4Desc,
      timestamp: t.paymentStage4Est,
      completed: false,
      current: true
    },
    {
      title: t.paymentStage5Title,
      description: t.paymentStage5Desc,
      timestamp: t.paymentStage5Status,
      completed: false,
      current: false
    }
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.paymentsTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t.paymentsSubtitle}
          </p>
        </div>

        <button
          onClick={handleDownloadInvoice}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
        >
          <Download className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
          <span>{t.farmerDownloadDbt}</span>
        </button>
      </div>

      {activePayment && (
        <>
          {/* Main Payment Summary Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {t.paymentsTotalDisbursal}
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  ₹{activePayment.netAmount.toLocaleString('en-IN')}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.paymentsForProduce}
                </p>
              </div>

              <Badge
                label={t.statusProcessing}
                variant="processing"
                size="md"
                dot
              />
            </div>

            {/* Price Calculation Breakdown */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.totalQuantity}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  {activePayment.quantityKg.toLocaleString('en-IN')} kg
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.ratePerKg}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  ₹{activePayment.ratePerKg.toFixed(2)}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.baseMspAmount}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                  ₹{activePayment.baseAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 p-3.5 border border-emerald-300 dark:border-emerald-800">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">{t.bonusIncentive}</span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1 block">
                  + ₹{activePayment.bonusAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Bank Reference */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                <Building className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
                <span>{t.farmerCreditedTo}: <strong>{activePayment.bankName}</strong> ({activePayment.farmerAccount})</span>
              </div>
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {t.utrNumberLabel}: <strong className="text-slate-800 dark:text-slate-200 font-bold">{activePayment.utrNumber}</strong>
              </div>
            </div>
          </div>

          {/* Payment Lifecycle Timeline */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Clock className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
              <span>{t.paymentTimeline}</span>
            </h3>

            <div className="space-y-5">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Connector Line */}
                  {idx < timelineSteps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 -bottom-5 w-0.5 ${
                        step.completed ? 'bg-emerald-700' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.completed
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : step.current
                        ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-800'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-xs font-bold ${step.current ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {step.title}
                      </h4>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
