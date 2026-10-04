import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, MessageSquare, School } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function ApplicationCard({
  application,
  onAccept,
  onReject
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!application) return null;

  const { id, applicant, message, role_applied_for, status, created_at } = application;

  const handleAction = async (action) => {
    try {
      setIsProcessing(true);
      if (action === 'accept') await onAccept(id);
      else await onReject(id);
    } catch (err) {
      console.error('Failed to update application:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={ROUTES.PROFILE(applicant?.id || '')}>
            <Avatar
              src={applicant?.avatar_url}
              name={applicant?.full_name}
              size="md"
              className="cursor-pointer hover:ring-2 ring-primary-500/50"
            />
          </Link>
          <div>
            <Link
              to={ROUTES.PROFILE(applicant?.id || '')}
              className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
            >
              {applicant?.full_name || 'Applicant'}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>{applicant?.college || 'University'}</span>
              <span>•</span>
              <DateDisplay date={created_at} />
            </div>
          </div>
        </div>

        {/* Role Applied For Badge */}
        {role_applied_for && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-900/50">
            Applying as: {role_applied_for}
          </span>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <MessageSquare className="w-3 h-3 text-slate-400" />
            <span>Applicant's Pitch</span>
          </div>
          {message}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {status === 'pending' ? (
          <>
            <Button
              variant="outline"
              size="sm"
              isLoading={isProcessing}
              onClick={() => handleAction('reject')}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              <span>Decline</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={() => handleAction('accept')}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Accept into Team</span>
            </Button>
          </>
        ) : (
          <span
            className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${
              status === 'accepted'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
