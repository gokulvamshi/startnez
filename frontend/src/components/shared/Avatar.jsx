import React, { useState } from 'react';
import { cn, getInitials } from '../../lib/utils';

export const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  isOnline = false,
  status = null,
  showPulse = false,
  shape = 'squircle', // 'squircle' (Stitch standard) | 'circle'
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
    '2xl': 'w-24 h-24 text-2xl font-bold'
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  };

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className={cn('relative inline-flex flex-shrink-0 select-none', className)}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setImageError(true)}
          className={cn(
            'object-cover ring-1 ring-slate-200/80 dark:ring-slate-700/80 bg-slate-100 dark:bg-slate-800',
            sizeClasses[size],
            shapeClass
          )}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center font-display font-semibold uppercase bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs',
            sizeClasses[size],
            shapeClass
          )}
        >
          {getInitials(name || alt)}
        </div>
      )}

      {(isOnline || status === 'online') && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900',
            statusDotSizes[size],
            (showPulse || status === 'online') && 'animate-pulse'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
