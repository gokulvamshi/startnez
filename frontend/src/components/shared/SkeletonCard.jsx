import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-level-1 animate-pulse flex flex-col justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Avatar skeleton */}
        <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />

        {/* Info skeleton */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="flex items-center gap-2 mt-2">
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom bar skeleton */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
