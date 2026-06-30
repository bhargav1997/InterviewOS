import React from 'react';

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
  label = 'ATS Score',
  sublabel = 'out of 100'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return '#10b981'; // emerald-500
    if (s >= 70) return '#6366f1'; // indigo-500
    if (s >= 55) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800 dark:text-slate-700/60"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight" style={{ color }}>
          {score}
        </span>
        {label && <span className="text-xs font-medium text-slate-400 mt-0.5">{label}</span>}
      </div>
    </div>
  );
};
