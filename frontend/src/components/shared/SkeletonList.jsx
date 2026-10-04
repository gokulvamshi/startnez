import React from 'react';
import { SkeletonCard } from './SkeletonCard';

export const SkeletonList = ({ count = 6, gridCols = 'grid-cols-1 lg:grid-cols-2' }) => {
  return (
    <div className={`grid ${gridCols} gap-4 w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
