import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
          info: <Info className="h-5 w-5 text-blue-500 shrink-0" />
        };

        const borderStyles = {
          success: 'border-emerald-500/40 bg-emerald-50/90 dark:bg-emerald-950/80',
          warning: 'border-amber-500/40 bg-amber-50/90 dark:bg-amber-950/80',
          error: 'border-rose-500/40 bg-rose-50/90 dark:bg-rose-950/80',
          info: 'border-blue-500/40 bg-blue-50/90 dark:bg-blue-950/80'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${
              borderStyles[toast.type || 'info']
            }`}
          >
            {icons[toast.type || 'info']}
            <div className="flex-1 pr-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
