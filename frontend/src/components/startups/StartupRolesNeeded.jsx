import React from 'react';
import { UserPlus } from 'lucide-react';

export default function StartupRolesNeeded({ roles = [], max = 3 }) {
  if (!roles || roles.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <UserPlus className="w-3 h-3 text-primary-500" />
        <span>Recruiting Co-Founders & Roles</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {roles.slice(0, max).map((role) => (
          <span
            key={role}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-900/50"
          >
            {role}
          </span>
        ))}
        {roles.length > max && (
          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
            +{roles.length - max} more
          </span>
        )}
      </div>
    </div>
  );
}
