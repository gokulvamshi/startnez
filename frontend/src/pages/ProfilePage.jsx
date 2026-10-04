import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { useAuthStore } from '../stores/authStore';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileCompleteness from '../components/profile/ProfileCompleteness';
import ProfileSkillsGrid from '../components/profile/ProfileSkillsGrid';
import LookingForTags from '../components/profile/LookingForTags';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfilePostsList from '../components/profile/ProfilePostsList';
import ProfileProjectsList from '../components/profile/ProfileProjectsList';
import ProfileStartupsList from '../components/profile/ProfileStartupsList';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SEOHead from '../components/shared/SEOHead';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user, profile: authProfile } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = !userId || userId === 'me' || userId === user?.id;

  const fetchTargetProfile = async () => {
    try {
      setIsLoading(true);
      if (isOwnProfile) {
        const res = await profileService.getMe();
        setProfile(res?.data || res);
      } else {
        const res = await profileService.getProfile(userId);
        setProfile(res?.data || res);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTargetProfile();
  }, [userId, user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Student Profile Not Found
        </h2>
      </div>
    );
  }

  const effectiveId = profile.id || user?.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <SEOHead title={`${profile.full_name || 'Builder Profile'} — HackConnect`} />

      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        connectionStatus={profile.connection_status || 'none'}
      />

      {/* Completeness Bar for own profile */}
      {isOwnProfile && (
        <ProfileCompleteness
          percentage={profile.profile_completeness || 85}
          suggestions={['Add your GitHub repository', 'Upload project slides']}
        />
      )}

      {/* Skills Grid */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm space-y-6">
        <ProfileSkillsGrid skills={profile.skills || profile.primary_skills || []} />
        {profile.looking_for && profile.looking_for.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <LookingForTags items={profile.looking_for} />
          </div>
        )}
      </Card>

      {/* Tabs & Content */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm space-y-6">
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

        <div>
          {activeTab === 'posts' && <ProfilePostsList userId={effectiveId} />}
          {activeTab === 'projects' && <ProfileProjectsList userId={effectiveId} />}
          {activeTab === 'startups' && <ProfileStartupsList userId={effectiveId} />}
        </div>
      </Card>
    </div>
  );
}
