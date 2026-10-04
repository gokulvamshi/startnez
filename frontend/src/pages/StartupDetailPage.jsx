import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { startupService } from '../services/startupService';
import { useAuthStore } from '../stores/authStore';
import StartupDetailView from '../components/startups/StartupDetailView';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SEOHead from '../components/shared/SEOHead';
import { ROUTES } from '../config/routes';

export default function StartupDetailPage() {
  const { startupId } = useParams();
  const { user } = useAuthStore();
  const [startup, setStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStartup = async () => {
    try {
      setIsLoading(true);
      const res = await startupService.getStartup(startupId);
      setStartup(res?.data || res);
    } catch (err) {
      console.error('Failed to load startup detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (startupId) fetchStartup();
  }, [startupId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Startup Proposal Not Found
        </h2>
        <Link to={ROUTES.STARTUPS} className="text-primary-600 font-semibold hover:underline text-sm">
          Browse All Ventures
        </Link>
      </div>
    );
  }

  const isFounder = startup.founder_id === user?.id || startup.founder?.id === user?.id || startup.is_founder;

  return (
    <div className="space-y-4 py-4">
      <SEOHead title={`${startup.name} — HackConnect Ventures`} />

      <Link
        to={ROUTES.STARTUPS}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ventures</span>
      </Link>

      <StartupDetailView
        startup={startup}
        isFounder={isFounder}
        userApplicationStatus={startup.user_application_status || 'none'}
        onRefresh={fetchStartup}
      />
    </div>
  );
}
