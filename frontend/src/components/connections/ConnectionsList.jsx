import React from 'react';
import { Link } from 'react-router-dom';
import { School, UserMinus, ExternalLink } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';
import SkillBadge from '../discovery/SkillBadge';
import { ROUTES } from '../../config/routes';

export default function ConnectionsList({
  connections = [],
  onRemoveConnection
}) {
  if (!connections || connections.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          You don't have any accepted connections yet. Discover peers on the Home page to build your network!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {connections.map((item) => {
        const user = item.user || item;

        return (
          <Card
            key={item.id || user.id}
            className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Link to={ROUTES.PROFILE(user.id)}>
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name}
                  size="md"
                  status="online"
                  className="hover:ring-2 ring-primary-500/50 cursor-pointer"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  to={ROUTES.PROFILE(user.id)}
                  className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-primary-600 transition-colors truncate block"
                >
                  {user.full_name}
                </Link>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 truncate">
                  <School className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{user.college || 'University'}</span>
                  <span>•</span>
                  <span>{user.year_of_study || 'Student'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                to={ROUTES.PROFILE(user.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              {onRemoveConnection && (
                <button
                  type="button"
                  onClick={() => onRemoveConnection(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Connection"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
