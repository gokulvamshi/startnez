import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { profileService } from '../../services/profileService';
import ProfileCard from './ProfileCard';
import ConnectionFilters from './ConnectionFilters';
import SkeletonCard from '../shared/SkeletonCard';
import EmptyState from '../shared/EmptyState';
import Button from '../shared/Button';

export default function DiscoveryFeed() {
  const [profiles, setProfiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skill: '',
    year: '',
    college: '',
    lookingFor: ''
  });

  const fetchDiscovery = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const params = {
        page: pageNum,
        limit: 12,
        search: searchQuery.trim() || undefined,
        skills: filters.skill || undefined,
        year: filters.year || undefined,
        college: filters.college || undefined,
        lookingFor: filters.lookingFor || undefined
      };

      const res = await profileService.getDiscovery(params);
      const data = res?.data || res;
      const list = data?.profiles || [];

      if (append) {
        setProfiles((prev) => [...prev, ...list]);
      } else {
        setProfiles(list);
      }

      setTotalCount(data?.pagination?.total || list.length);
      setHasMore(data?.pagination?.has_more || false);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load discovery profiles:', err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDiscovery(1, false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handleStatusChange = (id, newStatus) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, connection_status: newStatus } : p))
    );
  };

  const handleResetFilters = () => {
    setFilters({ skill: '', year: '', college: '', lookingFor: '' });
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>AI Matchmaker & Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Hackathon Teammates
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Intelligently ranked by complementary skillsets, university proximity, and shared goals.
          </p>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search builders, skills, colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <ConnectionFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Profile Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState
          title="No Matching Builders Found"
          description="Try broadening your skill domains or clearing university filters to connect with peers."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onConnectStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                size="md"
                isLoading={isFetchingMore}
                onClick={() => fetchDiscovery(page + 1, true)}
                className="px-6"
              >
                <span>Load More Builders</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
