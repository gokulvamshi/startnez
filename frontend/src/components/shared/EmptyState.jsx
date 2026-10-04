import React from 'react';
import { Button } from './Button';
import { Search } from 'lucide-react';

export const EmptyState = ({
  icon = <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
  title = 'No results found',
  description = 'Try adjusting your search filters or check back later.',
  actionLabel = null,
  actionText = null,
  onAction = null
}) => {
  const effectiveAction = actionText || actionLabel;

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-level-1">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>

      {effectiveAction && onAction && (
        <Button onClick={onAction} size="sm">
          {effectiveAction}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
