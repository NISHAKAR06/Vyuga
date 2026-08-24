import React from 'react';

export type BadgeVariant = 
  | 'available' 
  | 'limited' 
  | 'full' 
  | 'normal' 
  | 'warning' 
  | 'verification' 
  | 'anomaly' 
  | 'under_review' 
  | 'cleared' 
  | 'completed' 
  | 'processing' 
  | 'pending' 
  | 'high_load' 
  | 'moderate' 
  | 'serving' 
  | 'maintenance'
  | 'live';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'normal',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'available':
      case 'cleared':
      case 'completed':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'limited':
      case 'moderate':
      case 'warning':
      case 'under_review':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'full':
      case 'anomaly':
      case 'verification':
      case 'high_load':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
      case 'processing':
      case 'serving':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'live':
        return 'bg-emerald-500 text-white border-transparent shadow-sm shadow-emerald-500/30';
      case 'maintenance':
      case 'pending':
      case 'normal':
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${getStyles()} ${sizeStyles[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === 'live' ? 'bg-white animate-pulse' : 'bg-current opacity-80'}`} />
      )}
      {label}
    </span>
  );
};
