import React from 'react';
import { AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { KANBAN_PRIORITIES } from '../../config/skills';

export default function KanbanPriorityBadge({ priority = 0 }) {
  const meta = KANBAN_PRIORITIES.find((p) => p.value === priority) || KANBAN_PRIORITIES[0];

  const CONFIG = {
    0: { color: 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', icon: Minus },
    1: { color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800', icon: ArrowDown },
    2: { color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', icon: ArrowUp },
    3: { color: 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800', icon: AlertCircle }
  };

  const current = CONFIG[priority] || CONFIG[0];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${current.color}`}
    >
      <Icon className="w-3 h-3" />
      <span>{meta.label}</span>
    </span>
  );
}
