import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import ProgressBar from '../shared/ProgressBar';

export default function ProfileCompleteness({ percentage = 75, suggestions = [] }) {
  if (percentage >= 100) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/30 dark:to-indigo-950/30 border border-primary-100 dark:border-primary-900/40 space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-primary-700 dark:text-primary-300">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          <span>Profile Strength</span>
        </div>
        <span>{percentage}%</span>
      </div>

      <ProgressBar value={percentage} color="primary" size="sm" />

      {suggestions && suggestions.length > 0 && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Tip: {suggestions[0]} to unlock top recommendation placement.
        </p>
      )}
    </div>
  );
}
