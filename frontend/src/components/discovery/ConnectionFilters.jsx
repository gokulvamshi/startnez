import React from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { YEAR_OPTIONS, LOOKING_FOR_OPTIONS, UNIVERSITIES, SKILL_CATEGORIES } from '../../config/skills';
import Select from '../shared/Select';
import Button from '../shared/Button';

export default function ConnectionFilters({
  filters,
  onChange,
  onReset,
  totalResults = 0
}) {
  const hasActiveFilters = Boolean(
    filters.skill ||
    filters.year ||
    filters.college ||
    filters.lookingFor
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary-500" />
          <span>Filter Talent ({totalResults} builders found)</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            <X className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Domain / Skill filter */}
        <select
          value={filters.skill || ''}
          onChange={(e) => onChange({ ...filters, skill: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Technical Domains</option>
          {SKILL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Year filter */}
        <select
          value={filters.year || ''}
          onChange={(e) => onChange({ ...filters, year: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Academic Years</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* College filter */}
        <select
          value={filters.college || ''}
          onChange={(e) => onChange({ ...filters, college: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Universities</option>
          {UNIVERSITIES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Looking for filter */}
        <select
          value={filters.lookingFor || ''}
          onChange={(e) => onChange({ ...filters, lookingFor: e.target.value })}
          className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Collaboration Goals</option>
          {LOOKING_FOR_OPTIONS.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
