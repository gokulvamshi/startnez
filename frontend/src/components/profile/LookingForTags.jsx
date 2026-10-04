import React from 'react';
import { Target } from 'lucide-react';

export default function LookingForTags({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Target className="w-3.5 h-3.5 text-primary-500" />
        <span>Collaboration Goals</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-900/50"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
