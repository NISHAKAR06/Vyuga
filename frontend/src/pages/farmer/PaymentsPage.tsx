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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.paymentsTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Aadhaar-enabled Direct Benefit Transfer (DBT) via Public Financial Management System (PFMS)
          </p>
        </div>

        <button
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
        >
          <Download className="h-4 w-4 text-emerald-500" />
          <span>Download DBT Statement</span>
        </button>
      </div>

      {activePayment && (
        <>
          {/* Main Payment Summary Hero */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-600/10 via-slate-900/5 to-slate-900/10 dark:from-emerald-950/40 dark:via-slate-900/40 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  TOTAL DBT DISBURSAL AMOUNT
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  ₹{activePayment.netAmount.toLocaleString('en-IN')}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  For {activePayment.quantityKg.toLocaleString('en-IN')} kg {activePayment.crop}
                </p>
              </div>

              <Badge
                label={activePayment.status}
                variant={activePayment.status === 'Completed' ? 'completed' : 'processing'}
                size="lg"
                dot
              />
            </div>

            {/* Price Calculation Breakdown */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.totalQuantity}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                  {activePayment.quantityKg.toLocaleString('en-IN')} kg
                </span>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.ratePerKg}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                  ₹{activePayment.ratePerKg.toFixed(2)}
                </span>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.baseMspAmount}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                  ₹{activePayment.baseAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">{t.bonusIncentive}</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  + ₹{activePayment.bonusAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Bank Reference */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 dark:border-slate-800 pt-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Building className="h-4 w-4 text-emerald-500" />
                <span>Credited to: <strong>{activePayment.bankName}</strong> ({activePayment.farmerAccount})</span>
              </div>
              <div className="font-mono text-slate-500 dark:text-slate-400">
                UTR: <strong className="text-slate-800 dark:text-slate-200">{activePayment.utrNumber}</strong>
              </div>
            </div>
          </div>

          {/* Payment Lifecycle Timeline */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span>{t.paymentTimeline}</span>
            </h3>

            <div className="space-y-6">
              {activePayment.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Connector Line */}
                  {idx < activePayment.timeline.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                        step.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : step.current
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 animate-pulse'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-bold ${step.current ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {step.title}
                      </h4>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
