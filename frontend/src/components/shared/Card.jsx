import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick = null,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-level-1 dark:shadow-dark-1 transition-all duration-150',
        hoverEffect && 'hover:-translate-y-0.5 hover:shadow-level-2 dark:hover:shadow-dark-2 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
