import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../shared/Avatar';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function PostAuthorInfo({ author, createdAt, postType }) {
  if (!author) return null;

  return (
    <div className="flex items-center gap-3">
      <Link to={ROUTES.PROFILE(author.id)}>
        <Avatar
          src={author.avatar_url}
          name={author.full_name}
          size="md"
          className="hover:ring-2 ring-primary-500/50 transition-all cursor-pointer"
        />
      </Link>
      <div>
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.PROFILE(author.id)}
            className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {author.full_name}
          </Link>
          {author.primary_skill && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {author.primary_skill}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{author.year_of_study || 'Student'}</span>
          <span>•</span>
          <DateDisplay date={createdAt} />
        </div>
      </div>
    </div>
  );
}
