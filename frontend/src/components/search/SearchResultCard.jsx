import React from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Rocket, ExternalLink, School } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';
import SkillBadge from '../discovery/SkillBadge';
import StartupStageBadge from '../startups/StartupStageBadge';
import { ROUTES } from '../../config/routes';

export default function SearchResultCard({ type, data }) {
  if (!data) return null;

  if (type === 'people') {
    return (
      <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-between gap-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <Link to={ROUTES.PROFILE(data.id)}>
            <Avatar src={data.avatar_url} name={data.full_name} size="md" />
          </Link>
          <div>
            <Link
              to={ROUTES.PROFILE(data.id)}
              className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
            >
              {data.full_name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span>{data.college || 'University'}</span>
              <span>•</span>
              <span>{data.year_of_study || 'Student'}</span>
            </div>
            {data.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                {data.bio}
              </p>
            )}
          </div>
        </div>

        <Link
          to={ROUTES.PROFILE(data.id)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors shrink-0"
        >
          View Profile
        </Link>
      </Card>
    );
  }

  if (type === 'startups') {
    return (
      <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-between gap-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-base shrink-0">
            {data.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.STARTUP_DETAIL(data.id)}
                className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
              >
                {data.name}
              </Link>
              <StartupStageBadge stage={data.stage} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
              {data.one_liner}
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.STARTUP_DETAIL(data.id)}
          className="px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-xs font-semibold text-primary-600 hover:bg-primary-100 transition-colors shrink-0"
        >
          View Venture
        </Link>
      </Card>
    );
  }

  if (type === 'posts') {
    return (
      <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-2 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            By {data.author?.full_name || 'Builder'}
          </span>
          <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
            {data.post_type}
          </span>
        </div>
        {data.title && (
          <Link
            to={ROUTES.POST_DETAIL(data.id)}
            className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 block"
          >
            {data.title}
          </Link>
        )}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
          {data.content}
        </p>
      </Card>
    );
  }

  return null;
}
