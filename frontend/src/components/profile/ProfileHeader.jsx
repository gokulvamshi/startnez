import React from 'react';
import { Link } from 'react-router-dom';
import { School, MapPin, Edit3, Camera } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ProfileLinks from './ProfileLinks';
import ProfileStats from './ProfileStats';
import ConnectionButton from '../discovery/ConnectionButton';
import { ROUTES } from '../../config/routes';

export default function ProfileHeader({
  profile,
  isOwnProfile = false,
  connectionStatus = 'none',
  onConnectStatusChange
}) {
  if (!profile) return null;

  const {
    id,
    full_name,
    avatar_url,
    cover_image_url,
    college,
    year_of_study,
    city,
    bio,
    connection_count = 0,
    post_count = 0,
    project_count = 0,
    github_url,
    portfolio_url,
    twitter_url,
    linkedin_url,
    website_url
  } = profile;

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm">
      {/* Cover Image Banner */}
      <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600">
        {cover_image_url && (
          <img
            src={cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Main Header Content */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={avatar_url}
              name={full_name}
              size="2xl"
              status="online"
              className="ring-4 ring-white dark:ring-slate-900 shadow-xl"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <Link to={ROUTES.EDIT_PROFILE}>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            ) : (
              <ConnectionButton
                userId={id}
                initialStatus={connectionStatus}
                onStatusChange={onConnectStatusChange}
                size="md"
              />
            )}
          </div>
        </div>

        {/* Name and Basic Meta */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {full_name}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              <div className="flex items-center gap-1.5">
                <School className="w-4 h-4 text-primary-500 shrink-0" />
                <span>{college || 'University'}</span>
                <span>•</span>
                <span>{year_of_study || 'Student'}</span>
              </div>
              {city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {bio}
            </p>
          )}

          {/* External Links */}
          <ProfileLinks
            githubUrl={github_url}
            portfolioUrl={portfolio_url}
            twitterUrl={twitter_url}
            linkedinUrl={linkedin_url}
            websiteUrl={website_url}
          />

          {/* Stats Bar */}
          <div className="pt-2">
            <ProfileStats
              connectionCount={connection_count}
              postCount={post_count}
              projectCount={project_count}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
