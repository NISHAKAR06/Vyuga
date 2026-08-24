import React from 'react';
import { LucideIcon, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    type?: 'success' | 'warning' | 'info' | 'error' | 'neutral';
  };
  icon: LucideIcon;
  iconColor?: string;
  tooltipText?: string;
  trend?: {
    value: string;
    isUp?: boolean;
    text: string;
  };
  highlight?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  iconColor = 'text-emerald-500',
  tooltipText,
  trend,
  highlight = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        highlight
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/40 shadow-lg shadow-emerald-500/10 dark:from-emerald-950/40 dark:via-emerald-900/10'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md'
      } ${onClick ? 'cursor-pointer hover:border-emerald-500/50 hover:scale-[1.01]' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>{title}</span>
            {tooltipText && (
              <Tooltip content={tooltipText}>
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-500 cursor-help" />
              </Tooltip>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  badge.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : badge.type === 'warning'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : badge.type === 'error'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2.5 flex items-center gap-1 text-xs">
              <span className={`font-semibold ${trend.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                {trend.value}
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                {trend.text}
              </span>
            </div>
          )}
        </div>

        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
