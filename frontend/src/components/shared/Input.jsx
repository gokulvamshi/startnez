import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  icon,
  rightIcon,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const actualLeftIcon = leftIcon || icon;
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {actualLeftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {actualLeftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 px-3.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border rounded-xl transition-all duration-150',
            'border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            actualLeftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-rose-400 focus:ring-rose-500 bg-rose-50/20',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
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

Input.displayName = 'Input';

export default Input;
