import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X, School } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function SentRequestCard({ request, onWithdraw }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!request) return null;

  const { id, receiver, created_at } = request;

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      await onWithdraw(id);
    } catch (err) {
      console.error('Withdraw error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PROFILE(receiver?.id || '')}>
          <Avatar
            src={receiver?.avatar_url}
            name={receiver?.full_name}
            size="md"
            className="hover:ring-2 ring-primary-500/50 cursor-pointer"
          />
        </Link>
        <div>
          <Link
            to={ROUTES.PROFILE(receiver?.id || '')}
            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
          >
            {receiver?.full_name}
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <School className="w-3 h-3 text-slate-400" />
            <span>{receiver?.college || 'University'}</span>
            <span>•</span>
            <DateDisplay date={created_at} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Pending</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          isLoading={isLoading}
          onClick={handleWithdraw}
          className="text-slate-500"
        >
          <span>Withdraw</span>
        </Button>
      </div>
    </div>
  );
}
