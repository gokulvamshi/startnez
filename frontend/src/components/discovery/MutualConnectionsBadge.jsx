import React from 'react';
import { Users } from 'lucide-react';

export default function MutualConnectionsBadge({ count = 0, className = '' }) {
  if (!count || count <= 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium ${className}`}
    >
      <div className="flex -space-x-1.5 overflow-hidden">
        <span className="inline-block w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-[9px] text-primary-600 font-bold">
          <Users className="w-2.5 h-2.5" />
        </span>
      </div>
      <span>
        {count} mutual connection{count > 1 ? 's' : ''}
      </span>
    </div>
  );
}
