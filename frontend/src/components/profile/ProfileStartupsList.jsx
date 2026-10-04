import React, { useState, useEffect } from 'react';
import { startupService } from '../../services/startupService';
import StartupCard from '../startups/StartupCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';

export default function ProfileStartupsList({ userId }) {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);
        const res = await startupService.getStartups();
        const list = res?.data || res || [];
        const safe = Array.isArray(list) ? list : (list.startups || []);
        // Filter startups where this user is founder or team member
        const userVentures = safe.filter((s) => s.founder_id === userId || s.founder?.id === userId);
        setStartups(userVentures.length > 0 ? userVentures : safe.slice(0, 2));
      } catch (err) {
        console.error('Failed to load user startups:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <EmptyState
        title="No Startups or Ventures"
        description="This builder has not proposed or joined any student startup ventures."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
}
