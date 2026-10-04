import React from 'react';
import { PROJECT_ROLES } from '../../config/skills';

const COLOR_MAP = {
  lead: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  frontend: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
  backend: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  fullstack: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
  designer: 'text-pink-700 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
  presenter: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  ml_engineer: 'text-orange-700 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  devops: 'text-slate-700 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
  member: 'text-slate-600 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
};

export default function ProjectRoleBadge({ role = 'member' }) {
  const roleObj = PROJECT_ROLES.find((r) => r.value === role) || { label: role };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        COLOR_MAP[role] || COLOR_MAP.member
      }`}
    >
      {roleObj.label}
    </span>
  );
}
