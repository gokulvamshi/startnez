import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, User } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { ROUTES } from '../../config/routes';

export default function StartupTeamList({ members = [], founderId }) {
  if (!members || members.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Active Team Members ({members.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((member) => {
          const isFounder = member.is_founder || member.id === founderId;
          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <Link to={ROUTES.PROFILE(member.id)}>
                  <Avatar
                    src={member.avatar_url}
                    name={member.full_name}
                    size="md"
                    className="cursor-pointer hover:ring-2 ring-primary-500/50"
                  />
                </Link>
                <div>
                  <Link
                    to={ROUTES.PROFILE(member.id)}
                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
                  >
                    {member.full_name}
                  </Link>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {member.role || (isFounder ? 'Founder' : 'Team Member')}
                  </p>
                </div>
              </div>

              {isFounder ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span>Founder</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Member</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
