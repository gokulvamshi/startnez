import React, { useState } from 'react';
import SearchResultCard from './SearchResultCard';
import EmptyState from '../shared/EmptyState';

const TABS = [
  { id: 'all', label: 'All Results' },
  { id: 'people', label: 'Builders' },
  { id: 'startups', label: 'Ventures' },
  { id: 'posts', label: 'Posts' }
];

export default function SearchResults({ results, query }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!results) return null;

  const peopleList = results.profiles || [];
  const startupList = results.startups || [];
  const postList = results.posts || [];

  const total = peopleList.length + startupList.length + postList.length;

  if (total === 0) {
    return (
      <EmptyState
        title={`No Results for "${query}"`}
        description="Try searching by other engineering skills, university names, or keywords."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {TABS.map((tab) => {
          const count =
            tab.id === 'all'
              ? total
              : tab.id === 'people'
              ? peopleList.length
              : tab.id === 'startups'
              ? startupList.length
              : postList.length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Content */}
      <div className="space-y-4">
        {(activeTab === 'all' || activeTab === 'people') && peopleList.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Builders ({peopleList.length})
            </h3>
            <div className="space-y-2">
              {peopleList.map((p) => (
                <SearchResultCard key={p.id} type="people" data={p} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'startups') && startupList.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ventures ({startupList.length})
            </h3>
            <div className="space-y-2">
              {startupList.map((s) => (
                <SearchResultCard key={s.id} type="startups" data={s} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'posts') && postList.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Posts ({postList.length})
            </h3>
            <div className="space-y-2">
              {postList.map((po) => (
                <SearchResultCard key={po.id} type="posts" data={po} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
