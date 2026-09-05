import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Settings, 
  BookMarked, 
  Bookmark, 
  PenSquare, 
  Bell, 
  BellRing, 
  Download, 
  Trash2,
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cloud,
  LogIn,
  RefreshCw,
  Check,
  Lock,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { ComplianceCalendar } from '../components/dashboard/ComplianceCalendar';
import { ComplianceChecklist } from '../components/dashboard/ComplianceChecklist';
import { generateComplianceSummaryPDF } from '../utils/pdfGenerator';
import { getSavedItems, SavedItem, clearSavedItems } from '../utils/readingList';
import { Link, useSearchParams } from 'react-router-dom';
import { mockArticles } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { 
  saveBookmark, 
  removeBookmark, 
  subscribeToUserSavedItems, 
  syncLocalBookmarksToCloud 
} from '../services/bookmarkService';

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { user, signInWithGoogle, logout } = useAuth();
  
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  // Support both 'saved' and 'bookmarks' tab parameter for backwards compatibility
  const [activeTab, setActiveTab] = useState<'saved' | 'articles'>(
    tabParam === 'articles' ? 'articles' : 'saved'
  );
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => getSavedItems());
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === 'articles') {
      setActiveTab('articles');
    } else if (tabParam === 'saved' || tabParam === 'bookmarks') {
      setActiveTab('saved');
    }
  }, [tabParam]);

  const switchTab = (tab: 'saved' | 'articles') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Synchronize saved items:
  // If user is logged in, attach real-time Firestore listener; otherwise listen to local storage events
  useEffect(() => {
    // Initial local read
    setSavedItems(getSavedItems());

    let unsubscribeFirestore: (() => void) | null = null;

    if (user) {
      unsubscribeFirestore = subscribeToUserSavedItems(
        user.uid,
        (cloudItems) => {
          // Merge cloud items with local items (cloud takes precedence for persistence)
          const localItems = getSavedItems();
          const itemMap = new Map<string, SavedItem>();
          
          // Add local items
          localItems.forEach(item => itemMap.set(item.id, item));
          // Add/override with cloud items
          cloudItems.forEach(item => itemMap.set(item.id, item));
          
          const merged = Array.from(itemMap.values()).sort(
            (a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime()
          );
          setSavedItems(merged);
        },
        (err) => {
          console.warn('Firestore subscription fallback to local storage', err);
          setSavedItems(getSavedItems());
        }
      );
    }

    const handleStorageChange = () => {
      if (!user) {
        setSavedItems(getSavedItems());
      }
    };

    window.addEventListener('bookmarksUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('bookmarksUpdated', handleStorageChange);
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [user]);

  const handleRemoveSaved = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await removeBookmark(id, user);
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearAll = async () => {
    // Remove all saved items
    const itemsToDelete = [...savedItems];
    clearSavedItems();
    setSavedItems([]);
    setConfirmClear(false);

    if (user) {
      for (const item of itemsToDelete) {
        await removeBookmark(item.id, user);
      }
    }
  };

  const handleQuickBookmark = async (articleId: string) => {
    const article = mockArticles.find(a => a.id === articleId);
    if (article) {
      await saveBookmark({
        id: article.id,
        title: article.title,
        type: 'article',
        url: `/article/${article.id}`,
        dateSaved: new Date().toISOString(),
        offlineExcerpt: article.excerpt,
        offlineImageUrl: article.imageUrl,
        category: article.category,
        categoryId: article.categoryId,
        readTime: article.readTime,
        authorName: article.author?.name
      }, user);
      setSavedItems(getSavedItems());
    }
  };

  const handleSyncToCloud = async () => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    setIsSyncing(true);
    try {
      const count = await syncLocalBookmarksToCloud(user);
      setSyncSuccessMsg(`Successfully synced ${count} item${count === 1 ? '' : 's'} to your cloud library!`);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch {
      setSyncSuccessMsg('Cloud synchronization completed.');
      setTimeout(() => setSyncSuccessMsg(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const simulateAmendmentAlert = () => {
    if (notificationPermission === 'granted') {
      const notification = new Notification('Finance Act 2026 Amendment', {
        body: 'A new amendment affecting "Corporate Tax" (your saved category) has been published.',
        icon: '/vite.svg',
      });

      notification.onclick = function() {
        window.focus();
        this.close();
      };
    } else {
      alert('Please enable notifications first.');
    }
  };

  // Extract unique categories from saved items
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    savedItems.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [savedItems]);

  // Filtered items
  const filteredSavedItems = useMemo(() => {
    return savedItems.filter(item => {
      const matchesSearch = !searchFilter.trim() || 
        item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (item.offlineExcerpt && item.offlineExcerpt.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [savedItems, searchFilter, selectedCategory]);

  const recommendedGuides = useMemo(() => {
    return mockArticles.slice(0, 3);
  }, []);

  // Compute initials for user avatar
  const userInitials = useMemo(() => {
    if (!user) return 'GU';
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6">
          {/* User Profile Card */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "User avatar"} 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                {userInitials}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-slate-900 truncate">
                {user ? user.displayName || user.email?.split('@')[0] : 'Guest User'}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold flex items-center gap-1">
                {user ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Private Account</span>
                  </>
                ) : (
                  <span>Offline Session</span>
                )}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-6">
            <button 
              id="dashboard-tab-bookmarks"
              onClick={() => switchTab('saved')} 
              className={`w-full flex items-center justify-between px-3.5 py-2.5 transition-colors rounded-xl font-bold text-sm cursor-pointer ${
                activeTab === 'saved' 
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookMarked className="w-5 h-5 text-emerald-600" />
                <span>Saved Items</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'saved' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {savedItems.length}
              </span>
            </button>

            <button 
              id="dashboard-tab-articles"
              onClick={() => switchTab('articles')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors rounded-xl font-bold text-sm cursor-pointer ${
                activeTab === 'articles' 
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <PenSquare className="w-5 h-5" /> 
              <span>My Articles</span>
            </button>

            <div className="pt-2">
              {user ? (
                <button
                  id="dashboard-logout-btn"
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3.5 py-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl font-semibold text-xs cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  id="dashboard-signin-btn"
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </nav>
          
          <div className="border-t border-slate-100 pt-6">
            <button 
              id="download-summary-pdf-btn"
              onClick={generateComplianceSummaryPDF}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Summary PDF
            </button>
          </div>
        </div>

        <div className="bg-emerald-900 rounded-3xl border border-emerald-800 p-6 shadow-sm text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-800 p-2 rounded-xl">
              {notificationPermission === 'granted' ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <h3 className="font-bold">Alerts</h3>
          </div>
          <p className="text-emerald-200 text-sm mb-4">
            Get notified instantly when amendments affect your saved legal categories.
          </p>
          
          {notificationPermission !== 'granted' ? (
            <button 
              id="enable-notifications-btn"
              onClick={requestNotificationPermission}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Enable Notifications
            </button>
          ) : (
            <button 
              id="simulate-alert-btn"
              onClick={simulateAmendmentAlert}
              className="w-full bg-emerald-800 border border-emerald-700 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Test Alert Simulation
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <ComplianceCalendar />
        <ComplianceChecklist />

        <div id="dashboard-main-card" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[500px]">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 id="dashboard-section-title" className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                  {activeTab === 'saved' ? (
                    <>
                      <BookMarked className="w-6 h-6 text-emerald-600" />
                      <span>Saved Items</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6 text-emerald-600" />
                      <span>My Articles</span>
                    </>
                  )}
                </h1>

                {activeTab === 'saved' && (
                  user ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Private Library</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Local Device Only</span>
                    </span>
                  )
                )}
              </div>

              <p className="text-sm text-slate-500 mt-1">
                {activeTab === 'saved' 
                  ? user 
                    ? 'Your private, cloud-synchronized repository of statutory guides, tax policies, and legal analyses.'
                    : 'Statutory guides and legal analyses saved on this device. Sign in to sync across all your devices.'
                  : 'Manage and publish legal insights for the E-Lawyers community.'}
              </p>
            </div>

            {activeTab === 'articles' ? (
              <button 
                id="new-article-btn"
                className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <PenSquare className="w-4 h-4" /> New Article
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {user && (
                  <button
                    id="sync-cloud-bookmarks-btn"
                    onClick={handleSyncToCloud}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    title="Sync local bookmarks to cloud"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync to Cloud'}</span>
                  </button>
                )}

                {savedItems.length > 0 && (
                  confirmClear ? (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                      <span className="text-xs text-red-700 font-semibold">Clear all saved items?</span>
                      <button
                        id="confirm-clear-bookmarks-btn"
                        onClick={handleClearAll}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        Yes, Clear
                      </button>
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="text-xs text-slate-600 hover:text-slate-800 px-1 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      id="clear-all-bookmarks-btn"
                      onClick={() => setConfirmClear(true)}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors border border-slate-200 hover:border-red-200 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sync Success Message */}
          {syncSuccessMsg && (
            <div className="mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
          )}

          {/* Guest Sign-in Callout if not logged in */}
          {activeTab === 'saved' && !user && (
            <div id="saved-items-auth-prompt" className="mb-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Make your Saved Items permanent & private</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    You are currently saving articles locally on this browser. Sign in with Google to automatically back up your saved guides to your private cloud library and access them across all your devices.
                  </p>
                </div>
              </div>
              <button
                onClick={signInWithGoogle}
                className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            </div>
          )}
          
          {activeTab === 'articles' ? (
            <div id="my-articles-empty-state" className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No articles yet</h3>
              <p className="text-slate-500 max-w-sm mb-6 text-sm">You haven't written any articles. Share your expertise with the community.</p>
              <button className="text-emerald-700 font-bold hover:underline text-sm cursor-pointer">
                Start writing now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filter and Search Toolbar */}
              {savedItems.length > 0 && (
                <div id="bookmarks-toolbar" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="bookmarks-search-input"
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search saved guides, tax policies, or keywords..."
                      className="w-full pl-9 pr-4 py-2 bg-white text-xs sm:text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {availableCategories.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                      <button
                        id="cat-filter-all"
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          selectedCategory === 'all'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        All ({savedItems.length})
                      </button>
                      {availableCategories.map((cat) => {
                        const count = savedItems.filter(i => i.category === cat).length;
                        return (
                          <button
                            key={cat}
                            id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                              selectedCategory === cat
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            {cat} ({count})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Bookmarked items display */}
              {savedItems.length === 0 ? (
                /* Empty state with recommendations */
                <div id="bookmarks-empty-state" className="py-10 text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <BookMarked className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No saved items in your library yet</h3>
                  <p className="text-slate-500 max-w-md mx-auto text-sm mb-8 leading-relaxed">
                    Bookmark articles, statutory provisions, and tax compliance guidelines while researching. Click the bookmark icon on any guide to store it here in your private Saved Items library for future reference.
                  </p>

                  <div className="border-t border-slate-100 pt-8 max-w-2xl mx-auto text-left">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Recommended Legal Guides to Save</h4>
                    </div>
                    <div className="space-y-3">
                      {recommendedGuides.map((guide) => (
                        <div 
                          key={guide.id} 
                          id={`rec-guide-${guide.id}`}
                          className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-2xl transition-colors group"
                        >
                          <div className="min-w-0 pr-4">
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
                              {guide.category}
                            </span>
                            <Link 
                              to={`/article/${guide.id}`} 
                              className="block font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm truncate"
                            >
                              {guide.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              id={`bookmark-rec-btn-${guide.id}`}
                              onClick={() => handleQuickBookmark(guide.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <Link
                              to={`/article/${guide.id}`}
                              className="text-xs text-slate-500 hover:text-slate-900 p-1.5 transition-colors"
                              title="Read Guide"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredSavedItems.length === 0 ? (
                /* Search filter gave 0 items */
                <div id="bookmarks-no-filter-results" className="text-center py-16">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No saved items match your search</h3>
                  <p className="text-sm text-slate-500 mb-4">Try checking for typos or clear your search query.</p>
                  <button
                    onClick={() => {
                      setSearchFilter('');
                      setSelectedCategory('all');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                /* Grid of saved items cards */
                <div id="bookmarks-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSavedItems.map((item) => (
                    <div 
                      key={item.id} 
                      id={`bookmarked-item-${item.id}`}
                      className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Top badge row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                            {item.category || (item.type === 'policy' ? 'Tax Policy' : 'Legal Guide')}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{item.readTime ? `${item.readTime} min read` : 'Saved Guide'}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <Link 
                          to={item.url} 
                          className="block font-bold text-slate-900 hover:text-emerald-700 transition-colors text-base leading-snug mb-2 line-clamp-2"
                        >
                          {item.title}
                        </Link>

                        {/* Excerpt if available */}
                        {item.offlineExcerpt && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                            {item.offlineExcerpt}
                          </p>
                        )}
                      </div>

                      {/* Bottom action row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs mt-2">
                        <span className="text-slate-400 text-[11px]">
                          Saved {new Date(item.dateSaved).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            id={`remove-bookmark-btn-${item.id}`}
                            onClick={(e) => handleRemoveSaved(item.id, e)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove from Saved Items"
                            aria-label="Remove saved item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link 
                            to={item.url} 
                            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
