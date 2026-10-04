import React from 'react';
import { cn } from '../../lib/utils';

export const PageContainer = ({ children, className = '', maxWidth = 'max-w-[1360px]' }) => {
  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8 py-6', maxWidth, className)}>
      {children}
    </div>
  );
};

export default PageContainer;
