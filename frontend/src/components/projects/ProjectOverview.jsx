import React from 'react';
import { Calendar, Trophy, Users, FolderGit2, CheckCircle2, Clock } from 'lucide-react';
import Card from '../shared/Card';
import DateDisplay from '../shared/DateDisplay';
import ProjectMembersList from './ProjectMembersList';

export default function ProjectOverview({
  project,
  isCreator,
  onMembersUpdated
}) {
  if (!project) return null;

  const {
    id,
    name,
    description,
    hackathon_name,
    project_type,
    deadline,
    creator,
    members = [],
    created_at
  } = project;

  return (
    <div className="space-y-6">
      {/* Project Core Card */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 capitalize">
              {project_type} Track
            </span>
            {hackathon_name && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>{hackathon_name}</span>
              </span>
            )}
          </div>

          {deadline && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>Target Deadline: <DateDisplay date={deadline} /></span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
            Mission & Architecture Overview
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        <div className="pt-2 text-xs text-slate-400">
          Created by <span className="font-semibold text-slate-700 dark:text-slate-300">{creator?.full_name}</span> • Workspace initialized <DateDisplay date={created_at} />
        </div>
      </Card>

      {/* Team Roster Card */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <ProjectMembersList
          projectId={id}
          members={members}
          isCreator={isCreator}
          onMembersUpdated={onMembersUpdated}
        />
      </Card>
    </div>
  );
}
