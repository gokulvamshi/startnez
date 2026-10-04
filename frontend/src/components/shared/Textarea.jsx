import React from 'react';
import { cn } from '../../lib/utils';

export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  maxLength,
  value,
  className = '',
  rows = 4,
  id,
  required = false,
  ...props
}, ref) => {
  const textareaId = id || props.name;
  const currentLen = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs font-mono text-slate-400">
            {currentLen}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={cn(
          'w-full p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border rounded-xl transition-all duration-150',
          'border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y',
          error && 'border-rose-400 focus:ring-rose-500 bg-rose-50/20',
          className
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs font-medium text-rose-500 mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
