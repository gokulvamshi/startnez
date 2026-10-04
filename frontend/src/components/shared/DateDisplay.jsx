import React from 'react';
import { formatRelativeTime, formatDate } from '../../lib/utils';

export const DateDisplay = ({ date, relative = true, className = '' }) => {
  if (!date) return null;
  const formatted = relative ? formatRelativeTime(date) : formatDate(date);
  return (
    <time dateTime={date} title={formatDate(date, 'PPPPpppp')} className={className}>
      {formatted}
    </time>
  );
};

export default DateDisplay;
