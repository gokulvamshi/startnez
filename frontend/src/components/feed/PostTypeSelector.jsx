import React from 'react';
import { Trophy, Code, BookOpen, HelpCircle, Award, Share2 } from 'lucide-react';
import { POST_CATEGORIES } from '../../config/skills';

const ICON_MAP = {
  hackathon_experience: Trophy,
  project_showcase: Code,
  tutorial: BookOpen,
  question: HelpCircle,
  achievement: Award,
  resource: Share2
};

export default function PostTypeSelector({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        Post Type / Topic
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {POST_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.value] || Code;
          const isSelected = value === cat.value;

          return (
            <button
              type="button"
              key={cat.value}
              onClick={() => onChange(cat.value)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className="text-xs truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
