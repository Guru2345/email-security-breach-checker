import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  let badgeStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
  let Icon = ShieldCheck;
  let label = 'LOW RISK';

  if (level === 'MEDIUM') {
    badgeStyle = 'bg-amber-950/60 text-amber-300 border-amber-500/30';
    Icon = AlertTriangle;
    label = 'MEDIUM RISK';
  } else if (level === 'HIGH') {
    badgeStyle = 'bg-orange-950/60 text-orange-300 border-orange-500/30';
    Icon = AlertOctagon;
    label = 'HIGH RISK';
  } else if (level === 'CRITICAL') {
    badgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse';
    Icon = Flame;
    label = 'CRITICAL RISK';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wider',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  }[size];

  return (
    <span
      id={`risk-badge-${level.toLowerCase()}`}
      className={`inline-flex items-center rounded-md border font-mono uppercase whitespace-nowrap shadow-xs ${badgeStyle} ${sizeClasses}`}
    >
      {showIcon && <Icon size={iconSizes} className="shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
