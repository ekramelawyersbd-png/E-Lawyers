import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Wrench, 
  BookOpen, 
  Calculator, 
  Building2, 
  FileText, 
  GraduationCap, 
  Receipt, 
  Coins, 
  Briefcase, 
  ScrollText, 
  ShieldCheck, 
  Newspaper,
  HelpCircle,
  Bookmark,
  Settings,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { getSavedItems } from '../../utils/readingList';
import { LanguageToggle } from '../LanguageToggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const blogDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const blogTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const location = useLocation();
  const { user, logout } = useAuth();
  const [savedBookmarkCount, setSavedBookmarkCount] = useState(() => getSavedItems().length);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => setSavedBookmarkCount(getSavedItems().length);
    window.addEventListener('bookmarksUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('bookmarksUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const blogCategories = [
    { 
      name: 'Corporate Law', 
      path: '/category/corporate', 
      description: 'RJSC filings, company registration & share transfers',
      icon: Building2 
    },
    { 
      name: 'Income Tax', 
      path: '/category/tax', 
      description: 'Income tax return filing, tax slabs & rebates',
      icon: Receipt 
    },
    { 
      name: 'VAT & Customs', 
      path: '/category/vat', 
      description: 'VAT registration, withholding tax & compliance',
      icon: Coins 
    },
    { 
      name: 'Business Law', 
      path: '/category/business', 
      description: 'Trade licenses, startup legalities & contracts',
      icon: Briefcase 
    },
    { 
      name: 'Legal Documents', 
      path: '/category/legal_docs', 
      description: 'Agreement drafting, contracts & notices',
      icon: ScrollText 
    },
    { 
      name: 'Compliance', 
      path: '/category/compliance', 
      description: 'Statutory compliance checklists & filings',
      icon: ShieldCheck 
    },
    { 
      name: 'Legal Updates', 
      path: '/category/updates', 
      description: 'New government circulars, SROs & amendments',
      icon: Newspaper 
    },
  ];

  const resourceLinks = [
    { 
      name: 'Tools Hub', 
      path: '/tools', 
      description: 'Calculators, compliance checklists & utilities',
      icon: Wrench 
    },
    { 
      name: 'Glossary', 
      path: '/glossary', 
      description: 'Definitions of legal, fiscal & tax terms',
      icon: BookOpen 
    },
    { 
      name: 'Tax Calculator 2026-27', 
      path: '/tax-calculator', 
      description: 'Income tax calculator with cloud save',
      icon: Calculator 
    },
    { 
      name: 'Corporate Tax Planner', 
      path: '/corporate-planner', 
      description: 'Corporate slabs, rebate & planning tool',
      icon: Building2 
    },
    { 
      name: 'VAT Guide', 
      path: '/vat-guide', 
      description: 'Withholding rules, deductions & compliance',
      icon: FileText 
    },
    { 
      name: 'Training & CPD', 
      path: '/training', 
      description: 'Webinars, masterclasses & legal workshops',
      icon: GraduationCap 
    },
    { 
      name: 'Legal & Tax FAQs', 
      path: '/faq', 
      description: 'Frequently asked questions on tax, VAT & law',
      icon: HelpCircle 
    },
  ];

  const isBlogActive = blogCategories.some(link => location.pathname === link.path) || 
    location.pathname.startsWith('/category/') || 
    location.pathname.startsWith('/article/');
    
  const isResourceActive = resourceLinks.some(link => location.pathname === link.path);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (blogDropdownRef.current && !blogDropdownRef.current.contains(event.target as Node)) {
        setBlogOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route navigation
  useEffect(() => {
    setBlogOpen(false);
    setResourcesOpen(false);
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleBlogMouseEnter = () => {
    if (blogTimeoutRef.current) clearTimeout(blogTimeoutRef.current);
    setBlogOpen(true);
  };

  const handleBlogMouseLeave = () => {
    blogTimeoutRef.current = setTimeout(() => {
      setBlogOpen(false);
    }, 150);
  };

  const handleResourcesMouseEnter = () => {
    if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    setResourcesOpen(true);
  };

  const handleResourcesMouseLeave = () => {
    resourcesTimeoutRef.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 150);
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out print:hidden",
        isScrolled && !isOpen ? "pt-4 px-4 sm:px-6 lg:px-8" : "bg-transparent px-0"
      )}
    >
      <div 
        className={cn(
          "max-w-7xl mx-auto transition-all duration-300 ease-in-out",
          isScrolled && !isOpen
            ? "bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[24px] border border-slate-200/50 px-4 sm:px-6"
            : "bg-white/95 sm:bg-transparent px-4 sm:px-6 lg:px-8 border-b border-transparent"
        )}
      >
        <div className={cn(
          "flex justify-between items-center gap-4 transition-all duration-300 ease-in-out",
          isScrolled && !isOpen ? "h-16" : "h-20"
        )}>
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden bg-emerald-800/10 p-1 group-hover:scale-105 transition-transform">
                <img src="/logo.png" alt="E-Lawyers Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">E-Lawyers <span className="text-emerald-700">blog</span></h1>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold leading-none">Legal • Tax • Tech</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (Center/Main row) */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5">
            {/* Home */}
            <Link
              to="/"
              className={cn(
                "inline-block text-[12px] xl:text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2",
                location.pathname === '/' ? "text-emerald-700 border-emerald-700" : "text-slate-600 border-transparent"
              )}
            >
              Home
            </Link>

            {/* Dynamic Blog Dropdown Menu */}
            <div 
              ref={blogDropdownRef} 
              className="relative inline-block"
              onMouseEnter={handleBlogMouseEnter}
              onMouseLeave={handleBlogMouseLeave}
            >
              <button
                type="button"
                onClick={() => setBlogOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1 text-[12px] xl:text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2 focus:outline-none",
                  isBlogActive || blogOpen
                    ? "text-emerald-700 border-emerald-700" 
                    : "text-slate-600 border-transparent"
                )}
                aria-expanded={blogOpen}
                aria-haspopup="true"
              >
                <span>Blog</span>
                <ChevronDown 
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200", 
                    blogOpen ? "rotate-180 text-emerald-700" : "text-slate-400"
                  )} 
                />
              </button>

              {/* Blog Dropdown Panel */}
              {blogOpen && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[540px] bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 px-2 border-b border-slate-100">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Blog Categories & Law Topics
                    </span>
                    <Link 
                      to="/search" 
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                      onClick={() => setBlogOpen(false)}
                    >
                      Browse All Articles →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {blogCategories.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setBlogOpen(false)}
                          className={cn(
                            "flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 group text-left",
                            isActive 
                              ? "bg-emerald-50/80 border border-emerald-200/60" 
                              : "hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          )}
                          role="menuitem"
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isActive 
                              ? "bg-emerald-600 text-white shadow-sm" 
                              : "bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className={cn(
                              "text-xs font-bold transition-colors leading-tight",
                              isActive ? "text-emerald-900" : "text-slate-900 group-hover:text-emerald-700"
                            )}>
                              {item.name}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-normal">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Resources Dropdown Menu */}
            <div 
              ref={resourcesDropdownRef} 
              className="relative inline-block"
              onMouseEnter={handleResourcesMouseEnter}
              onMouseLeave={handleResourcesMouseLeave}
            >
              <button
                type="button"
                onClick={() => setResourcesOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1 text-[12px] xl:text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2 focus:outline-none",
                  isResourceActive || resourcesOpen
                    ? "text-emerald-700 border-emerald-700" 
                    : "text-slate-600 border-transparent"
                )}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
              >
                <span>Resources</span>
                <ChevronDown 
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200", 
                    resourcesOpen ? "rotate-180 text-emerald-700" : "text-slate-400"
                  )} 
                />
              </button>

              {/* Resources Dropdown Panel */}
              {resourcesOpen && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[520px] bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 px-2 border-b border-slate-100">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Legal & Tax Resources
                    </span>
                    <Link 
                      to="/tools" 
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      View All Tools →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {resourceLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setResourcesOpen(false)}
                          className={cn(
                            "flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 group text-left",
                            isActive 
                              ? "bg-emerald-50/80 border border-emerald-200/60" 
                              : "hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          )}
                          role="menuitem"
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isActive 
                              ? "bg-emerald-600 text-white shadow-sm" 
                              : "bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className={cn(
                              "text-xs font-bold transition-colors leading-tight",
                              isActive ? "text-emerald-900" : "text-slate-900 group-hover:text-emerald-700"
                            )}>
                              {item.name}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-normal">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Community */}
            <Link
              to="/community"
              className={cn(
                "inline-block text-[12px] xl:text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2",
                location.pathname === '/community' ? "text-emerald-700 border-emerald-700" : "text-slate-600 border-transparent"
              )}
            >
              Community
            </Link>

            {/* Contact */}
            <a
              href="https://appointment.accounticca.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[12px] xl:text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2 text-slate-600 border-transparent"
            >
              Contact
            </a>
          </nav>
          
          {/* Right actions: Search + Auth + Mobile menu toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            <LanguageToggle className="hidden sm:flex" />
            <form 
              className="hidden md:block relative text-slate-400 focus-within:text-emerald-600"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('search') as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                }
              }}
            >
               <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
               <input name="search" type="text" placeholder="Search..." className="bg-slate-100 border border-transparent rounded-full py-2 pl-9 pr-3 text-xs sm:text-sm w-36 xl:w-52 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-emerald-200 text-slate-900 transition-all focus:w-48 xl:focus:w-64 shadow-inner" />
            </form>
            
            {/* Help / Support Icon */}
            <div className="relative group hidden sm:block">
              <Link
                to="/community"
                className="p-2 rounded-xl transition-colors flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                aria-label="Help & FAQ"
              >
                <HelpCircle className="w-5 h-5" />
              </Link>
              <div className="absolute top-full right-1/2 translate-x-1/2 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-50">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                <p className="font-bold mb-1">Need assistance?</p>
                <p className="text-slate-300">Browse FAQs and community support.</p>
              </div>
            </div>

            {/* Bookmarks Icon Button */}
            {user && (
              <Link
                to="/dashboard?tab=bookmarks"
                id="navbar-bookmarks-btn"
                title="Saved Bookmarks"
                aria-label="View saved legal bookmarks"
                className={cn(
                  "relative p-2 rounded-xl transition-colors flex items-center justify-center",
                  location.pathname === '/dashboard' && location.search.includes('tab=bookmarks')
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                )}
              >
                <Bookmark className="w-5 h-5" />
                {savedBookmarkCount > 0 && (
                  <span 
                    id="navbar-bookmarks-count"
                    className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {savedBookmarkCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 mb-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.displayName || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </Link>
                    <Link
                      to="/dashboard?tab=settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 bg-slate-900 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-colors shadow-sm whitespace-nowrap">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Sign In
              </Link>
            )}
            <button 
              className="lg:hidden text-slate-600 hover:text-emerald-600 transition-colors p-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg absolute left-0 right-0 w-full max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 pt-4 pb-2">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Language</span>
              <LanguageToggle />
            </div>
            <form 
              className="relative text-slate-400 focus-within:text-emerald-600"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('search') as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                }
              }}
            >
               <Search className="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
               <input name="search" type="text" placeholder="Search articles..." className="bg-slate-100 border-none rounded-xl py-3 pl-11 pr-4 text-base w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900" />
            </form>
          </div>
          <div className="px-4 pt-2 pb-6 space-y-1">
            {/* Mobile Home */}
            <Link
              to="/"
              className={cn(
                "block px-4 py-2.5 rounded-xl text-base font-bold transition-colors",
                location.pathname === '/' ? "text-emerald-700 bg-emerald-50" : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Blog Accordion */}
            <div className="border-y border-slate-100 py-1 my-2">
              <button
                type="button"
                onClick={() => setMobileBlogOpen(prev => !prev)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold transition-colors",
                  isBlogActive ? "text-emerald-700 bg-emerald-50/50" : "text-slate-700 hover:text-emerald-700"
                )}
              >
                <span className="flex items-center gap-2">Blog Categories</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", mobileBlogOpen && "rotate-180")} />
              </button>

              {mobileBlogOpen && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50/50 rounded-xl my-1">
                  {blogCategories.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors",
                          location.pathname === item.path ? "text-emerald-700 bg-emerald-100/60" : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Resources Accordion */}
            <div className="border-b border-slate-100 py-1 my-2">
              <button
                type="button"
                onClick={() => setMobileResourcesOpen(prev => !prev)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold transition-colors",
                  isResourceActive ? "text-emerald-700 bg-emerald-50/50" : "text-slate-700 hover:text-emerald-700"
                )}
              >
                <span className="flex items-center gap-2">Resources & Tools</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", mobileResourcesOpen && "rotate-180")} />
              </button>

              {mobileResourcesOpen && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50/50 rounded-xl my-1">
                  {resourceLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors",
                          location.pathname === item.path ? "text-emerald-700 bg-emerald-100/60" : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Bookmarks */}
            <Link
              to="/dashboard?tab=bookmarks"
              id="mobile-bookmarks-link"
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-bold transition-colors",
                location.pathname === '/dashboard' && location.search.includes('tab=bookmarks') 
                  ? "text-emerald-700 bg-emerald-50" 
                  : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-emerald-600" />
                <span>Bookmarks</span>
              </div>
              {savedBookmarkCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {savedBookmarkCount}
                </span>
              )}
            </Link>

            {/* Mobile Community */}
            <Link
              to="/community"
              className={cn(
                "block px-4 py-2.5 rounded-xl text-base font-bold transition-colors",
                location.pathname === '/community' ? "text-emerald-700 bg-emerald-50" : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>

            {/* Mobile Contact */}
            <a
              href="https://appointment.accounticca.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 rounded-xl text-base font-bold transition-colors text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>

            {user ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="px-4 py-2 text-sm font-bold text-slate-500">
                  Signed in as {user.displayName || user.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-3 mt-4 rounded-xl text-base font-bold text-white bg-slate-900 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

