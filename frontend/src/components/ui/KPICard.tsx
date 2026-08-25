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
      className={`relative overflow-hidden rounded-xl border p-4 sm:p-4.5 transition-all duration-200 ${
        highlight
          ? 'bg-white dark:bg-slate-900 border-emerald-700 dark:border-emerald-600 shadow-sm ring-1 ring-emerald-700/20'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="truncate">{title}</span>
            {tooltipText && (
              <Tooltip content={tooltipText}>
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-500 cursor-help shrink-0" />
              </Tooltip>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              {value}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold shrink-0 ${
                  badge.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : badge.type === 'warning'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : badge.type === 'error'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-2 flex items-center gap-1 text-[11px]">
              <span className={`font-bold ${trend.isUp ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-500'}`}>
                {trend.value}
              </span>
              <span className="text-slate-500 dark:text-slate-400 truncate">
                {trend.text}
              </span>
            </div>
          )}
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/90 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
