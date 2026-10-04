import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, FileText, Rocket, ArrowRight } from 'lucide-react';
import { searchService } from '../../services/searchService';
import Avatar from '../shared/Avatar';
import { ROUTES } from '../../config/routes';

export default function GlobalSearchBar({ className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await searchService.search(query.trim());
        const data = res?.data || res;
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search builders, skills, posts, ventures..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults(null);
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Instant Dropdown Preview */}
      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {/* People */}
          {results.profiles && results.profiles.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Builders ({results.profiles.length})
              </span>
              <div className="space-y-1">
                {results.profiles.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(ROUTES.PROFILE(p.id));
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <Avatar src={p.avatar_url} name={p.full_name} size="xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {p.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{p.college || 'Builder'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Startups */}
          {results.startups && results.startups.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Ventures ({results.startups.length})
              </span>
              <div className="space-y-1">
                {results.startups.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(ROUTES.STARTUP_DETAIL(s.id));
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                      {s.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{s.one_liner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Results Link */}
          <div
            onClick={() => {
              setIsOpen(false);
              navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
            }}
            className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-primary-50 dark:hover:bg-primary-950/40 cursor-pointer text-center text-xs font-semibold text-primary-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>See all results for "{query}"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
}
