import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color = 'bg-brand-500'
}) => {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-semibold text-slate-200">{percent}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
