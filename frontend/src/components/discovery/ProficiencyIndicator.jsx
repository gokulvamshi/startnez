import React from 'react';

const LEVEL_MAP = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

export default function ProficiencyIndicator({ level = 'Intermediate' }) {
  const activeCount = LEVEL_MAP[level] || 2;

  return (
    <div className="flex items-center gap-1" title={`Proficiency: ${level}`}>
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className={`h-1.5 w-3 rounded-full transition-all ${
            step <= activeCount
              ? 'bg-primary-600 dark:bg-primary-500'
              : 'bg-slate-200 dark:bg-slate-800'
          }`}
        />
      ))}
    </div>
  );
}
