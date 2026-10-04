import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import Card from '../shared/Card';
import Avatar from '../shared/Avatar';
import StartupStageBadge from './StartupStageBadge';
import StartupRolesNeeded from './StartupRolesNeeded';
import { ROUTES } from '../../config/routes';

export default function StartupCard({ startup }) {
  if (!startup) return null;

  const {
    id,
    name,
    one_liner,
    stage,
    tech_stack = [],
    roles_needed = [],
    logo_url,
    founder,
    member_count = 1,
    application_count = 0
  } = startup;

  return (
    <Card className="flex flex-col justify-between p-5 hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group rounded-2xl">
      <div>
        {/* Header: Logo, Name, Stage */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {logo_url ? (
              <img
                src={logo_url}
                alt={name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-sm">
                {name[0]}
              </div>
            )}
            <div>
              <Link
                to={ROUTES.STARTUP_DETAIL(id)}
                className="font-bold text-base text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
              >
                {name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>By {founder?.full_name || 'Founder'}</span>
                {founder?.college && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{founder.college}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <StartupStageBadge stage={stage} />
        </div>

        {/* One-liner Pitch */}
        <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-2 leading-relaxed">
          {one_liner}
        </p>

        {/* Roles Needed */}
        <div className="mb-4">
          <StartupRolesNeeded roles={roles_needed} max={3} />
        </div>

        {/* Tech Stack Chips */}
        {tech_stack && tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats & Navigation */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1" title="Team Members">
            <Users className="w-3.5 h-3.5" />
            <span>{member_count}</span>
          </span>
          <span className="flex items-center gap-1" title="Applications Received">
            <FileText className="w-3.5 h-3.5" />
            <span>{application_count}</span>
          </span>
        </div>

        <Link
          to={ROUTES.STARTUP_DETAIL(id)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors"
        >
          <span>View Venture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
