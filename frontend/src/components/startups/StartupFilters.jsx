import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { STARTUP_STAGES, SKILL_CATEGORIES } from '../../config/skills';

export default function StartupFilters({
  filters,
  onChange,
  onReset,
  totalResults = 0
}) {
  const hasActive = Boolean(filters.stage || filters.tech || filters.role);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary-500" />
          <span>Filter Ventures ({totalResults} proposals found)</span>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            <X className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stage Filter */}
        <select
          value={filters.stage || ''}
          onChange={(e) => onChange({ ...filters, stage: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Startup Stages</option>
          {STARTUP_STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Roles Needed Filter */}
        <select
          value={filters.role || ''}
          onChange={(e) => onChange({ ...filters, role: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Roles Recruiting</option>
          {SKILL_CATEGORIES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Tech Stack Search Filter */}
        <input
          type="text"
          placeholder="Tech stack (e.g. React, Python)..."
          value={filters.tech || ''}
          onChange={(e) => onChange({ ...filters, tech: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
    </div>
  );
}
