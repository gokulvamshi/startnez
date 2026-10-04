import React, { useState, useEffect } from 'react';
import { startupService } from '../../services/startupService';
import ApplicationCard from './ApplicationCard';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function ApplicationsList({ startupId, onTeamUpdated }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = async () => {
    try {
      setIsLoading(true);
      const res = await startupService.getApplications(startupId);
      const list = res?.data || res || [];
      setApplications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [startupId]);

  const handleAccept = async (appId) => {
    await startupService.acceptApplication(appId);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'accepted' } : a))
    );
    onTeamUpdated?.();
  };

  const handleReject = async (appId) => {
    await startupService.rejectApplication(appId);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected' } : a))
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No applications received yet. Students browsing your proposal can apply to open roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Review Candidates ({applications.length})
      </h4>
      <div className="space-y-3">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
}
