import React from 'react';
import { cn } from '../../lib/utils';

export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = false,
  label = null,
  color = 'bg-blue-600',
  className = ''
}) => {
  const actualColor = color === 'primary' ? 'bg-primary-600' : color;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          <span className="font-mono text-blue-600 dark:text-blue-400">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', actualColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
