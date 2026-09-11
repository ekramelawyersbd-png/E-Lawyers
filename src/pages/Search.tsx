import { BookmarkButton } from '../components/BookmarkButton';
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockArticles } from '../data/mockData';
import { format } from 'date-fns';
import { calculateReadingTime } from '../utils/readingTime';
import { Search as SearchIcon, History, X, Clock, Calendar, ExternalLink } from 'lucide-react';
import { buildAppointmentUrl } from '../utils/appointmentRedirect';

const RECENT_SEARCHES_KEY = 'elawyers_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState(mockArticles);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENT_SEARCHES);
        }
      }
    } catch {
      // ignore JSON parse error
    }
    return [];
  });

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (query) {
      const lowerQuery = query.toLowerCase();
      const filtered = mockArticles.filter(article => 
        article.title.toLowerCase().includes(lowerQuery) || 
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        article.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);

      const trimmed = query.trim();
      if (trimmed) {
        setRecentSearches(prev => {
          const updated = [trimmed, ...prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
          try {
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
          } catch {
            // ignore localStorage quota errors
          }
          return updated;
        });
      }
    } else {
      setResults(mockArticles);
    }
  }, [query]);

  const handleSelectRecent = (term: string) => {
    setInputValue(term);
    setSearchParams({ q: term });
  };

  const handleRemoveRecent = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(term => term !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 id="search-page-title" className="text-3xl font-bold text-slate-900 mb-6">Search Results</h1>
        <form 
          id="search-page-form"
          className="relative max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed) {
              setSearchParams({ q: trimmed });
            } else {
              setSearchParams({});
            }
          }}
        >
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            id="search-page-input"
            name="search"
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for articles, VAT, tax rules..."
            className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm text-slate-900"
          />
          {inputValue && (
            <button
              id="search-input-clear-btn"
              type="button"
              onClick={() => {
                setInputValue('');
                setSearchParams({});
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {recentSearches.length > 0 && (
          <div id="recent-searches-section" className="mt-4 flex flex-wrap items-center gap-2 max-w-2xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1 shrink-0">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent Searches:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {recentSearches.map((term, index) => {
                const isActive = query.toLowerCase() === term.toLowerCase();
                return (
                  <button
                    key={`${term}-${index}`}
                    id={`recent-search-chip-${index}`}
                    type="button"
                    onClick={() => handleSelectRecent(term)}
                    className={`group inline-flex items-center gap-1.5 pl-3 pr-2 py-1 text-xs font-medium rounded-full transition-colors border ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <span>{term}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove "${term}" from recent searches`}
                      onClick={(e) => handleRemoveRecent(term, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRemoveRecent(term, e as any);
                        }
                      }}
                      className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              id="clear-all-recent-searches-btn"
              type="button"
              onClick={handleClearAllRecent}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors ml-2 hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 id="search-results-heading" className="text-lg font-bold text-slate-800">
          {query ? `Showing results for "${query}"` : 'All Articles'}
        </h2>
        <span id="search-results-count" className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {results.length} found
        </span>
      </div>

      {results.length > 0 ? (
        <div id="search-results-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(article => (
            <Link key={article.id} id={`search-result-article-${article.id}`} to={`/article/${article.id}`} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{article.category}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    {format(new Date(article.publishedAt), 'MMM d, yyyy')} • 
                    <Clock className="w-3 h-3" /> {calculateReadingTime(article.content)} min
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <BookmarkButton 
                    id={article.id} 
                    title={article.title} 
                    url={`/article/${article.id}`}
                    className="p-1.5 -mr-1.5 -mt-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors shrink-0" 
                  />
                </div>
                <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-sm">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  <img src={article.author.avatarUrl} alt={article.author.name} className="w-8 h-8 rounded-full object-cover" onError={(e) => { const target = e.target as HTMLImageElement; target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=047857&color=fff`; }} />
                  <span className="text-sm font-bold text-slate-700">{article.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div id="search-no-results" className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-900 text-lg font-bold mb-2">No articles found{query ? ` for "${query}"` : ''}</p>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Looking for customized legal advice or tax representation on this topic? Connect directly with our panel of practicing lawyers.
          </p>
          <a
            href={buildAppointmentUrl({
              service: 'Legal & Tax Consultation',
              notes: query ? `Search query: ${query}` : undefined,
              source: 'Search Page - No Results'
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4 text-emerald-200" />
            <span>Book Consultation on Appointment Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </a>
        </div>
      )}
    </div>
  );
}
