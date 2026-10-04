import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, School } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function ConnectionRequestCard({
  request,
  onAccept,
  onReject
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!request) return null;

  const { id, requester, created_at } = request;

  const handleAction = async (action) => {
    try {
      setIsLoading(true);
      if (action === 'accept') await onAccept(id);
      else await onReject(id);
    } catch (err) {
      console.error('Request action error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PROFILE(requester?.id || '')}>
          <Avatar
            src={requester?.avatar_url}
            name={requester?.full_name}
            size="md"
            className="hover:ring-2 ring-primary-500/50 cursor-pointer"
          />
        </Link>
        <div>
          <Link
            to={ROUTES.PROFILE(requester?.id || '')}
            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
          >
            {requester?.full_name}
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <School className="w-3 h-3 text-slate-400" />
            <span>{requester?.college || 'University'}</span>
            <span>•</span>
            <DateDisplay date={created_at} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          isLoading={isLoading}
          onClick={() => handleAction('reject')}
          className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          <span>Decline</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          isLoading={isLoading}
          onClick={() => handleAction('accept')}
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          <span>Accept</span>
        </Button>
      </div>
    </div>
  );
}
