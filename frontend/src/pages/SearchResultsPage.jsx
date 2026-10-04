import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchService } from '../services/searchService';
import SearchResults from '../components/search/SearchResults';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SEOHead from '../components/shared/SEOHead';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const executeSearch = async () => {
      if (!query.trim()) {
        setResults(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await searchService.search(query.trim());
        setResults(res?.data || res);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    executeSearch();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <SEOHead title={`Search: ${query || 'Global'} — HackConnect`} />

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Search className="w-6 h-6 text-primary-500" />
          <span>Search Results</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {query ? `Showing matches for "${query}"` : 'Enter a search term in the search bar above.'}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <SearchResults results={results} query={query} />
      )}
    </div>
  );
}
