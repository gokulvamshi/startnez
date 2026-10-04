import React from 'react';
import { STARTUP_STAGES } from '../../config/skills';

export default function StartupStageBadge({ stage = 'idea', className = '' }) {
  const stageObj = STARTUP_STAGES.find((s) => s.value === stage) || STARTUP_STAGES[0];

  const COLOR_MAP = {
    idea: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    building_mvp: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
    mvp_ready: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    growing: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    launched: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        COLOR_MAP[stage] || COLOR_MAP.idea
      } ${className}`}
    >
      <span>{stageObj.label}</span>
    </span>
  );
}
