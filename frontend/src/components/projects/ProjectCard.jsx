import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Users, Calendar, ArrowRight, Trophy } from 'lucide-react';
import Card from '../shared/Card';
import Avatar from '../shared/Avatar';
import DateDisplay from '../shared/DateDisplay';
import { ROUTES } from '../../config/routes';

export default function ProjectCard({ project }) {
  if (!project) return null;

  const {
    id,
    name,
    description,
    hackathon_name,
    project_type,
    deadline,
    member_count = 1,
    members = [],
    creator
  } = project;

  return (
    <Card className="flex flex-col justify-between p-5 hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group rounded-2xl">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <Link
                to={ROUTES.PROJECT_WORKSPACE(id)}
                className="font-bold text-base text-slate-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1"
              >
                {name}
              </Link>
              <span className="text-[11px] text-slate-400 font-medium capitalize">
                {project_type} Project
              </span>
            </div>
          </div>

          {hackathon_name && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 shrink-0">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span className="truncate max-w-[120px]">{hackathon_name}</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Deadline & Members Preview */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-4">
          <div className="flex -space-x-2 overflow-hidden">
            {members.slice(0, 4).map((m, idx) => (
              <Avatar
                key={m.id || idx}
                src={m.avatar_url}
                name={m.full_name}
                size="xs"
                className="ring-2 ring-white dark:ring-slate-900"
              />
            ))}
            {member_count > 4 && (
              <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900">
                +{member_count - 4}
              </span>
            )}
          </div>

          {deadline && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Due <DateDisplay date={deadline} /></span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <span className="text-xs text-slate-400">
          Created by {creator?.full_name || 'Lead'}
        </span>

        <Link
          to={ROUTES.PROJECT_WORKSPACE(id)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
