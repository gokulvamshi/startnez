import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, FileText, CheckCircle2, UserPlus, Clock } from 'lucide-react';
import Card from '../shared/Card';
import Avatar from '../shared/Avatar';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import StartupStageBadge from './StartupStageBadge';
import StartupRolesNeeded from './StartupRolesNeeded';
import StartupTeamList from './StartupTeamList';
import ApplicationsList from './ApplicationsList';
import StartupApplicationForm from './StartupApplicationForm';
import { ROUTES } from '../../config/routes';

export default function StartupDetailView({
  startup,
  isFounder = false,
  userApplicationStatus = 'none',
  onRefresh
}) {
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!startup) return null;

  const {
    id,
    name,
    one_liner,
    problem_statement,
    solution,
    description,
    stage,
    tech_stack = [],
    roles_needed = [],
    website_url,
    founder,
    team = []
  } = startup;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {name}
                </h1>
                <StartupStageBadge stage={stage} />
              </div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">
                {one_liner}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <Link to={ROUTES.PROFILE(founder?.id || '')} className="flex items-center gap-1.5 hover:underline">
                  <Avatar src={founder?.avatar_url} name={founder?.full_name} size="xs" />
                  <span>Founded by {founder?.full_name}</span>
                </Link>
                {founder?.college && (
                  <>
                    <span>•</span>
                    <span>{founder.college}</span>
                  </>
                )}
                {website_url && (
                  <>
                    <span>•</span>
                    <a
                      href={website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Button: Apply / Status */}
          <div className="shrink-0">
            {!isFounder ? (
              userApplicationStatus === 'none' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowApplyModal(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>Apply to Join Team</span>
                </Button>
              ) : userApplicationStatus === 'pending' ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Application Pending Review</span>
                </div>
              ) : userApplicationStatus === 'accepted' ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Accepted as Team Member</span>
                </div>
              ) : (
                <span className="text-xs text-red-500 font-semibold">Application Declined</span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                You are the Founder
              </span>
            )}
          </div>
        </div>

        {/* Roles Recruiting */}
        <div className="py-4">
          <StartupRolesNeeded roles={roles_needed} max={6} />
        </div>

        {/* Tech Stack */}
        {tech_stack.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Technology Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tech_stack.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Problem & Solution Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">
            The Problem Space
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {problem_statement}
          </p>
        </Card>

        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500">
            The Proposed Solution
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {solution}
          </p>
        </Card>
      </div>

      {/* Extended Description */}
      {description && (
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Detailed Vision & Roadmap
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </Card>
      )}

      {/* Team Members List */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <StartupTeamList members={team} founderId={founder?.id} />
      </Card>

      {/* Founder Applications Management Dashboard */}
      {isFounder && (
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <ApplicationsList startupId={id} onTeamUpdated={onRefresh} />
        </Card>
      )}

      {/* Apply to Join Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to ${name}`}
        size="md"
      >
        <StartupApplicationForm
          startupId={id}
          rolesNeeded={roles_needed}
          onSuccess={() => {
            setShowApplyModal(false);
            onRefresh?.();
          }}
          onCancel={() => setShowApplyModal(false)}
        />
      </Modal>
    </div>
  );
}
