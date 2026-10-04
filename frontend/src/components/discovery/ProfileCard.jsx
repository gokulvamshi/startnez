import React from 'react';
import { Link } from 'react-router-dom';
import { School, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';
import SkillBadge from './SkillBadge';
import ConnectionButton from './ConnectionButton';
import MutualConnectionsBadge from './MutualConnectionsBadge';
import { ROUTES } from '../../config/routes';

export default function ProfileCard({ profile, onConnectStatusChange }) {
  if (!profile) return null;

  const {
    id,
    full_name,
    avatar_url,
    college,
    year_of_study,
    city,
    bio,
    primary_skills = [],
    looking_for = [],
    connection_status = 'none',
    mutual_connections = 0,
    recommendation_score = 0
  } = profile;

  return (
    <Card className="flex flex-col justify-between p-5 hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
      <div>
        {/* Top Bar: Squircle Avatar, Name, Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <Link to={ROUTES.PROFILE(id)}>
              <Avatar
                src={avatar_url}
                name={full_name}
                size="lg"
                status="online"
                className="group-hover:ring-2 ring-primary-500/50 transition-all cursor-pointer"
              />
            </Link>
            <div>
              <Link
                to={ROUTES.PROFILE(id)}
                className="font-bold text-base text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
              >
                {full_name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[150px]">{college || 'University'}</span>
                <span>•</span>
                <span className="shrink-0">{year_of_study || 'Student'}</span>
              </div>
            </div>
          </div>

          {/* Complementary recommendation score */}
          {recommendation_score > 0 && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 text-[11px] font-semibold shrink-0">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{recommendation_score > 90 ? '98%' : `${recommendation_score}%`}</span>
            </div>
          )}
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {bio || 'Passionate student builder eager to collaborate on ambitious hackathons & startups.'}
        </p>

        {/* Top Skills Badges */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Top Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {primary_skills.length > 0 ? (
              primary_skills.slice(0, 3).map((s) => {
                const sName = typeof s === 'string' ? s : s.skill_name || s.name;
                const prof = typeof s === 'object' ? s.proficiency : null;
                return (
                  <SkillBadge
                    key={sName}
                    skillName={sName}
                    proficiency={prof}
                    isPrimary
                  />
                );
              })
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Looking For Goals */}
        {looking_for.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Looking For
            </span>
            <div className="flex flex-wrap gap-1">
              {looking_for.slice(0, 2).map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <MutualConnectionsBadge count={mutual_connections} />

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.PROFILE(id)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Full Profile"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <ConnectionButton
            userId={id}
            initialStatus={connection_status}
            onStatusChange={(status) => onConnectStatusChange?.(id, status)}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
}
