import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FileText,
  Wrench,
  GraduationCap,
  ArrowRight,
  Sparkles,
  History,
  BookOpen,
  Calculator,
  Building2,
  Receipt,
  Coins,
  ShieldCheck,
  Award,
  ExternalLink,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { mockArticles } from '../../data/mockData';
import { searchableTaxTools, SearchableTool } from '../../data/searchableTools';
import { SHOP_PRODUCTS, ShopProduct } from '../../data/shopProducts';
import { Article } from '../../types';
import { cn } from '../../lib/utils';

const GLOBAL_RECENT_SEARCHES_KEY = 'elawyers_global_recent_searches_v2';
const MAX_RECENT = 5;

type SearchResultItem =
  | { type: 'article'; id: string; title: string; category: string; path: string; description: string; badge?: string }
  | { type: 'tool'; id: string; title: string; category: string; path: string; description: string; badge?: string }
  | { type: 'course'; id: string; title: string; category: string; path: string; description: string; badge?: string; price?: number };

export function GlobalSearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'tools' | 'courses'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Recent searches storage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const saveRecent = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(GLOBAL_RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      try {
        localStorage.setItem(GLOBAL_RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(GLOBAL_RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Global event listener for Cmd+K / Ctrl+K and custom open event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-global-search', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-global-search', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Gather all searchable items (Articles, Tools, Courses)
  const allResults = useMemo(() => {
    const results: SearchResultItem[] = [];

    // 1. Articles
    mockArticles.forEach((article) => {
      results.push({
        type: 'article',
        id: `article-${article.id}`,
        title: article.title,
        category: article.category || 'Tax & Legal Article',
        path: `/article/${article.id}`,
        description: article.excerpt || article.title,
        badge: article.tags?.[0] || 'Article'
      });
    });

    // 2. Tools
    searchableTaxTools.forEach((tool) => {
      results.push({
        type: 'tool',
        id: `tool-${tool.id}`,
        title: tool.name,
        category: tool.category,
        path: tool.path || `/tools/${tool.id}`,
        description: tool.description,
        badge: tool.badge || 'Tool'
      });
    });

    // 3. Courses (Academy Courses from SHOP_PRODUCTS or training)
    SHOP_PRODUCTS.filter(
      (p) => p.category === 'Academy Courses' || (p.productType || '').includes('Academy') || p.id.startsWith('academy-')
    ).forEach((course) => {
      results.push({
        type: 'course',
        id: `course-${course.id}`,
        title: course.title,
        category: 'Academy Course / Live Cohort',
        path: course.coursePath || `/shop/${course.slug}`,
        description: course.shortDescription,
        badge: course.badge || 'Certified',
        price: course.price
      });
    });

    return results;
  }, []);

  // Filtered results based on query and active tab
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    let list = allResults;

    // Filter by tab
    if (activeTab === 'articles') list = list.filter((item) => item.type === 'article');
    else if (activeTab === 'tools') list = list.filter((item) => item.type === 'tool');
    else if (activeTab === 'courses') list = list.filter((item) => item.type === 'course');

    if (!trimmed) {
      // If no query, return top 8 popular items or recent highlights
      return list.slice(0, 8);
    }

    const tokens = trimmed.split(/\s+/).filter(Boolean);

    return list
      .map((item) => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        const catLower = item.category.toLowerCase();

        if (titleLower === trimmed) score += 300;
        else if (titleLower.startsWith(trimmed)) score += 180;
        else if (tokens.every((t) => titleLower.includes(t))) score += 100;
        else if (tokens.some((t) => titleLower.includes(t))) score += 50;

        if (tokens.every((t) => descLower.includes(t))) score += 30;
        else if (tokens.some((t) => descLower.includes(t))) score += 15;

        if (catLower.includes(trimmed)) score += 20;

        return { item, score };
      })
      .filter((res) => res.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((res) => res.item);
  }, [allResults, query, activeTab]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (query.trim()) {
      saveRecent(query.trim());
    }
    setIsOpen(false);
    setQuery('');
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter' && filteredResults.length > 0) {
      e.preventDefault();
      const chosen = filteredResults[selectedIndex] || filteredResults[0];
      if (chosen) handleSelectResult(chosen);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_25px_70px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-emerald-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search across all articles, tax calculators, legal tools & Academy courses (Cmd+K)..."
            className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors mr-2 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 bg-slate-200/70 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Tab Filter Row */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100/70 border-b border-slate-200/60 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Results', count: allResults.length },
            { id: 'articles', label: 'Articles & Guides', count: allResults.filter((i) => i.type === 'article').length },
            { id: 'tools', label: 'Calculators & Tools', count: allResults.filter((i) => i.type === 'tool').length },
            { id: 'courses', label: 'Academy Courses', count: allResults.filter((i) => i.type === 'course').length }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white hover:bg-slate-200/60 text-slate-700 border border-slate-200/80"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn("text-[10px] px-1.5 py-0.2 rounded-full font-black", isSelected ? "bg-emerald-400 text-slate-950" : "bg-slate-100 text-slate-500")}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2 overscroll-contain">
          {/* Recent Searches (when query is empty and tab is 'all') */}
          {!query && recentSearches.length > 0 && activeTab === 'all' && (
            <div className="mb-4 px-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-600" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearAllRecent}
                  className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/80 cursor-pointer group"
                  >
                    <span>{term}</span>
                    <span
                      onClick={(e) => removeRecent(term, e)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {filteredResults.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">No matching results found for "{query}"</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Try searching for "income tax", "vat return", "nda contract", "bar council", or "calculator".
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer border",
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-300 shadow-2xs ring-2 ring-emerald-500/20"
                        : "bg-white hover:bg-slate-50/80 border-slate-100"
                    )}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs",
                          item.type === 'article' && "bg-blue-50 text-blue-700 border-blue-200",
                          item.type === 'tool' && "bg-amber-50 text-amber-700 border-amber-200",
                          item.type === 'course' && "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {item.type === 'article' && <FileText className="w-5 h-5" />}
                        {item.type === 'tool' && <Wrench className="w-5 h-5" />}
                        {item.type === 'course' && <GraduationCap className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded",
                              item.type === 'article' && "bg-blue-100 text-blue-800",
                              item.type === 'tool' && "bg-amber-100 text-amber-800",
                              item.type === 'course' && "bg-emerald-100 text-emerald-900"
                            )}
                          >
                            {item.type === 'article' ? 'Article' : item.type === 'tool' ? 'Tool / Calc' : 'Academy Course'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 truncate">
                            {item.category}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-500 truncate leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pl-3">
                      {item.type === 'course' && (item as any).price !== undefined && (
                        <span className="text-xs font-mono font-bold text-slate-900">
                          BDT {(item as any).price.toLocaleString()}
                        </span>
                      )}
                      <ArrowRight className={cn("w-4 h-4 transition-transform", isSelected ? "text-emerald-600 translate-x-0.5" : "text-slate-300")} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Info */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px] shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px] shadow-2xs">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px] shadow-2xs">Enter</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-[10px] shadow-2xs">Esc</kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="font-bold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accounticca &amp; E-Lawyers Global Index</span>
          </div>
        </div>
      </div>
    </div>
  );
}
