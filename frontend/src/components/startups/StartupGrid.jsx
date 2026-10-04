import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Search, PlusCircle } from 'lucide-react';
import { startupService } from '../../services/startupService';
import StartupCard from './StartupCard';
import StartupFilters from './StartupFilters';
import SkeletonCard from '../shared/SkeletonCard';
import EmptyState from '../shared/EmptyState';
import Button from '../shared/Button';
import { ROUTES } from '../../config/routes';

export default function StartupGrid() {
  const [startups, setStartups] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ stage: '', role: '', tech: '' });

  const fetchStartups = async () => {
    try {
      setIsLoading(true);
      const params = {
        search: searchQuery.trim() || undefined,
        stage: filters.stage || undefined,
        role: filters.role || undefined,
        tech: filters.tech || undefined
      };

      const res = await startupService.getStartups(params);
      const list = res?.data || res || [];
      const safeList = Array.isArray(list) ? list : (list.startups || []);
      setStartups(safeList);
      setTotalCount(safeList.length);
    } catch (err) {
      console.error('Failed to fetch startups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStartups();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handleResetFilters = () => {
    setFilters({ stage: '', role: '', tech: '' });
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-1">
            <Rocket className="w-3.5 h-3.5 text-primary-500" />
            <span>Student Ventures & Co-Founders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Startup Proposals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Serious projects and student startups recruiting technical & non-technical co-founders.
          </p>
        </div>

        <Link to={ROUTES.CREATE_STARTUP}>
          <Button variant="primary" size="md">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Propose Venture</span>
          </Button>
        </Link>
      </div>

      {/* Instant Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search startups, problems, tech stacks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
        />
      </div>

      {/* Filter Toolbar */}
      <StartupFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Startup Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : startups.length === 0 ? (
        <EmptyState
          title="No Startup Proposals Found"
          description="Have an ambitious problem you're passionate about solving? Form a team and recruit co-founders today."
          actionText="Propose Startup"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {startups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      )}
    </div>
  );
}
