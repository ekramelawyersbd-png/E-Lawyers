import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkButton } from '../components/BookmarkButton';
import { calculateReadingTime } from '../utils/readingTime';
import { ArrowRight, Clock, Minus, Plus, Type, Contrast, BookOpen, Calculator, FileText, Landmark, LineChart, MessageSquare, Search, Scale, Briefcase, FileSignature, Users, BookMarked, Download, Calendar as CalendarIcon, ArrowUpRight, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { mockArticles, categories } from '../data/mockData';
import { format } from 'date-fns';
import { CopySectionButton } from '../components/CopySectionButton';
import { BookmarkSectionButton } from '../components/BookmarkSectionButton';
import { ShareSectionButton } from '../components/ShareSectionButton';
import { SectionNote } from '../components/SectionNote';
import { FAQ } from '../components/FAQ';
import { NewsletterSignup } from '../components/NewsletterSignup';

export function Home() {
  const [newsFontScale, setNewsFontScale] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [latestArticlesCategory, setLatestArticlesCategory] = useState('all');

  const handleIncreaseFont = () => setNewsFontScale(p => Math.min(p + 1, 3));
  const handleDecreaseFont = () => setNewsFontScale(p => Math.max(p - 1, 0));

  const featuredArticle = mockArticles[0] || null;
  const recentArticles = mockArticles.slice(1, 9);
  const filteredLatestArticles = latestArticlesCategory === 'all'
    ? recentArticles
    : mockArticles.filter(a => a.categoryId === latestArticlesCategory).slice(0, 8);
  const displayLatestArticles = filteredLatestArticles.length > 0 ? filteredLatestArticles : recentArticles;
  const popularArticles = mockArticles.slice(2, 5); // Just using different slice for mockup
  const legalUpdates = mockArticles.filter(a => a.categoryId === 'updates' || a.categoryId === 'corporate').slice(0, 4);

  const mainCategories = [
    {
      id: 'corporate',
      icon: <Landmark className="w-6 h-6 text-emerald-600" />,
      title: 'Corporate Law',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400',
      contents: ['Company Registration', 'RJSC Compliance', 'Share Transfer', 'Directors\' Responsibilities', 'Corporate Governance']
    },
    {
      id: 'tax',
      icon: <Calculator className="w-6 h-6 text-emerald-600" />,
      title: 'Income Tax',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600&h=400',
      contents: ['Income Tax Return Filing', 'Tax Calculation Guide', 'Tax Rebate Rules', 'TIN & e-TIN Updates', 'NBR Tax Circulars']
    },
    {
      id: 'vat',
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: 'VAT & Customs',
      imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&q=80&w=600&h=400',
      contents: ['VAT Registration', 'VAT Return Filing', 'VAT Rules & Procedures', 'Customs Compliance', 'Import-Export Tax Issues']
    },
    {
      id: 'business',
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      title: 'Business & Startup',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600&h=400',
      contents: ['Business Registration', 'Trade License', 'Partnership Agreements', 'Startup Legal Requirements', 'Business Compliance Checklist']
    },
    {
      id: 'legal_docs',
      icon: <FileSignature className="w-6 h-6 text-emerald-600" />,
      title: 'Legal Documentation',
      imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600&h=400',
      contents: ['Agreement Drafting', 'Legal Notices', 'Contracts', 'Power of Attorney', 'Deeds & Documents']
    },
    {
      id: 'civil_criminal',
      icon: <Scale className="w-6 h-6 text-emerald-600" />,
      title: 'Civil & Criminal Law',
      imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=600&h=400',
      contents: ['Property Law', 'Family Law', 'Court Procedures', 'Legal Rights', 'Litigation Process']
    }
  ];

  const featuredGuides = [
    { title: 'Complete Guide to Company Registration in Bangladesh', path: '/article/company-reg' },
    { title: 'Income Tax Return Filing Guide 2026', path: '/article/tax-return-guide' },
    { title: 'VAT Compliance Guide for Businesses', path: '/vat-guide' },
    { title: 'RJSC Annual Return Filing Guide', path: '/article/rjsc-guide' },
    { title: 'Legal Checklist for Entrepreneurs', path: '/article/startup-legal-checklist' }
  ];

  const freeResources = [
    { title: 'Tax Calculator', icon: <Calculator className="w-5 h-5" />, path: '/tax-calculator' },
    { title: 'VAT Calculator', icon: <Calculator className="w-5 h-5" />, path: '/tools' },
    { title: 'Legal Forms', icon: <FileSignature className="w-5 h-5" />, path: '/tools' },
    { title: 'Compliance Checklist', icon: <BookMarked className="w-5 h-5" />, path: '/tools' },
    { title: 'Sample Agreements', icon: <FileText className="w-5 h-5" />, path: '/tools' },
    { title: 'Tax Calendar', icon: <CalendarIcon className="w-5 h-5" />, path: '/dashboard' }
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="w-full relative bg-[#071426] overflow-hidden">
        {/* Subtle radial glow and modern background pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#00A878]/20 rounded-full blur-[120px] mix-blend-screen animate-in fade-in duration-1000" />
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[#00A878]/10 rounded-full blur-[100px] mix-blend-screen" />
          {/* Abstract Grid/Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTM5LjUgMGguNXY0MGgtLjV6TTAgMzkuNXYuNWg0MHYtLjV6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-80px)] pt-[19px] pb-[81px] pl-[46px] pr-[49px] max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide mb-5 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bangladesh Regulatory &amp; Corporate Intelligence</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
                Compliance <span className="text-emerald-400">Hub</span>
              </h1>
              
              {/* Refined Credibility Line */}
              <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-slate-300 font-medium mb-6 py-2 px-3.5 sm:px-4 rounded-xl bg-white/[0.05] border border-white/10 shadow-sm backdrop-blur-md">
                <span className="text-slate-400 font-normal">Powered by</span>
                <a 
                  href="https://elawyersbd.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline transition-colors"
                >
                  <span>E-Lawyers</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400/80" />
                </a>
                <span className="text-slate-500">&amp;</span>
                <a 
                  href="https://accounticca.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline transition-colors"
                >
                  <span>Accounticca</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400/80" />
                </a>
                <span className="text-slate-500 hidden sm:inline">—</span>
                <span className="text-slate-200 font-medium">Simplifying Legal &amp; Financial Compliance</span>
              </div>
              
              {/* Value Proposition */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-normal">
                Authoritative statutory guidance, tax calculators, and actionable regulatory insights. Built for entrepreneurs, CFOs, and practitioners navigating Bangladesh legal and financial compliance.
              </p>
              
              {/* Search Bar */}
              <div className="mb-5 max-w-xl relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                <form 
                  className="relative flex items-center bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1.5 border border-slate-700/80 shadow-2xl transition-all"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('search') as HTMLInputElement;
                    if (input.value.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                    }
                  }}
                >
                  <Search className="w-5 h-5 text-slate-400 ml-4 absolute pointer-events-none" />
                  <input 
                    name="search"
                    type="text" 
                    placeholder="Search Income Tax sections, RJSC filings, VAT circulars..." 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
                    Search
                  </button>
                </form>
              </div>

              {/* Quick Interactive Tool Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8 max-w-xl">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Quick Tools:</span>
                <Link to="/tax-calculator" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors">
                  Tax Calculator
                </Link>
                <Link to="/tds-reference" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors">
                  TDS Guide
                </Link>
                <Link to="/corporate-tax-planner" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors">
                  Corporate Tax
                </Link>
                <Link to="/vat-guide" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors">
                  VAT Guide
                </Link>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a 
                  href="https://appointment.accounticca.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <span>Book Consultation</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link 
                  to="/category/compliance" 
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-7 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <span>Compliance Checklists</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Content Area: SaaS Interactive Card & Pillars */}
            <div className="lg:col-span-5 space-y-4">
              {featuredArticle && (
                <div className="relative group animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-1000 delay-150">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/30 to-slate-800 rounded-[26px] blur-sm opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <Link 
                    to={`/article/${featuredArticle.id}`} 
                    className="relative flex flex-col bg-slate-900/80 backdrop-blur-2xl border border-slate-700/70 p-7 rounded-[22px] shadow-2xl hover:border-emerald-500/40 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{featuredArticle.category || 'Featured Insight'}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {calculateReadingTime(featuredArticle.content)} min
                      </span>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug group-hover:text-emerald-300 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    
                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-800">
                      <div className="flex items-center gap-3">
                        <img 
                          src={featuredArticle.author.avatarUrl} 
                          alt={featuredArticle.author.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm" 
                        />
                        <div>
                          <p className="text-sm font-bold text-white">{featuredArticle.author.name}</p>
                          <p className="text-xs text-slate-400">{featuredArticle.author.role || 'Senior Counsel'}</p>
                        </div>
                      </div>
                      <span className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Three SaaS Compliance Pillar Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Corporate</div>
                  <div className="text-xs text-slate-300 font-medium">RJSC &amp; Companies</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Tax 2023</div>
                  <div className="text-xs text-slate-300 font-medium">NBR SROs &amp; Slabs</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">VAT &amp; TDS</div>
                  <div className="text-xs text-slate-300 font-medium">Withholding Rules</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Latest Articles */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Statutory &amp; Regulatory Dispatches</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Latest Articles &amp; Precedents
              </h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
                Expert legal analysis, NBR tax codes, corporate governance mandates, and procedural checklists for Bangladesh.
              </p>
            </div>
            
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-4 py-2.5 rounded-xl transition-all group shrink-0 self-start md:self-auto"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'tax', label: 'Income Tax' },
              { id: 'corporate', label: 'Corporate Law' },
              { id: 'vat', label: 'VAT & Customs' },
              { id: 'compliance', label: 'Compliance' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLatestArticlesCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  latestArticlesCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4-Column x 2-Row Articles Grid (4 boxes per line, 2 lines) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayLatestArticles.map(article => (
              <Link 
                key={article.id} 
                to={`/article/${article.id}`} 
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {calculateReadingTime(article.content)} min
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1 font-normal">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                    <div className="flex items-center gap-2 min-w-0">
                      <img 
                        src={article.author.avatarUrl} 
                        alt={article.author.name} 
                        className="w-7 h-7 rounded-full border border-slate-200 object-cover shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[85px] sm:max-w-[100px]">{article.author.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                          {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <BookmarkButton 
                        id={article.id} 
                        title={article.title} 
                        url={`/article/${article.id}`} 
                        className="text-slate-400 hover:text-emerald-600 transition-colors p-1" 
                      />
                      <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-all duration-200">
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Practice Areas & Legal Categories</h2>
            <p className="text-lg text-slate-600">Explore comprehensive guides, laws, and compliance procedures categorized by practice area.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainCategories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group flex flex-col h-full overflow-hidden">
                {category.imageUrl && (
                  <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={category.imageUrl} 
                      alt={category.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{category.title}</h3>
                  </div>
                  <ul className="space-y-3 mb-6 flex-1">
                    {category.contents.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto pt-4 border-t border-slate-100">
                    View All <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Guides & 5. Latest Legal Updates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Featured Guides */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-600" /> Featured Guides
            </h2>
            <div className="space-y-4">
              {featuredGuides.map((guide, idx) => (
                <Link key={idx} to={guide.path} className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <span className="font-bold">0{idx + 1}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{guide.title}</h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Legal Updates */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 h-full flex flex-col">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Scale className="w-32 h-32" />
              </div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Latest Legal Updates
              </h2>
              <div className="space-y-6 relative z-10 flex-1">
                {legalUpdates.map((update, idx) => (
                  <div key={idx} className="border-b border-slate-800 pb-5 last:border-0 last:pb-0">
                    <Link to={`/article/${update.id}`} className="group block">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2 block">{format(new Date(update.publishedAt), 'MMM d, yyyy')}</span>
                      <h4 className="text-base font-bold text-slate-100 group-hover:text-white leading-snug mb-2">{update.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{update.excerpt}</p>
                    </Link>
                  </div>
                ))}
              </div>
              <Link to="/category/updates" className="mt-8 pt-4 border-t border-slate-800 text-emerald-400 text-sm font-bold flex items-center justify-center gap-2 hover:text-emerald-300 transition-colors">
                Read All Updates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Popular Articles & 7. Expert Advice Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Popular Articles */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Popular Articles</h2>
            <div className="space-y-6">
              {popularArticles.map(article => (
                <Link key={article.id} to={`/article/${article.id}`} className="group flex gap-6 items-start p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{article.category}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {calculateReadingTime(article.content)} min read</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 leading-tight">{article.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Expert Advice */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Expert Advice</h2>
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 relative">
              <div className="absolute top-4 right-4 text-emerald-200">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <div className="space-y-6">
                {popularArticles.slice(0, 2).map((article, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={article.author.avatarUrl} alt={article.author.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" />
                      <div>
                        <h4 className="font-bold text-slate-900">{article.author.name}</h4>
                        <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">{article.author.role || 'Corporate Lawyer'}</p>
                      </div>
                    </div>
                    <Link to={`/article/${article.id}`} className="block">
                      <h3 className="text-lg font-bold text-slate-800 hover:text-emerald-700 transition-colors mb-2">{article.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/team" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition-colors">
                  Meet Our Experts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Free Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Free Resources</h2>
            <p className="text-lg text-slate-600">Downloadable tools, forms, and calculators for your business.</p>
          </div>
          <Link to="/tools" className="inline-flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-5 py-2.5 rounded-full hover:bg-emerald-100 transition-colors">
            View All Resources
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {freeResources.map((resource, idx) => (
            <Link key={idx} to={resource.path} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {resource.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{resource.title}</h3>
              <Download className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors mt-auto" />
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Consultation CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden border border-emerald-700">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Need Legal Assistance?</h2>
            <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Our expert team of corporate lawyers, tax consultants, and VAT specialists are ready to help your business grow securely.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="https://appointment.accounticca.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg inline-flex items-center justify-center gap-2"
              >
                <span>Book Consultation</span>
                <ExternalLink className="w-5 h-5 text-emerald-800" />
              </a>
              <a 
                href="https://appointment.accounticca.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto bg-emerald-700 text-white hover:bg-emerald-600 border border-emerald-500 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg inline-flex items-center justify-center gap-2"
              >
                <span>Request Callback</span>
                <ExternalLink className="w-5 h-5 text-emerald-200" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Legal & Tax Queries */}
      <FAQ />

      {/* 10. Newsletter Subscription */}
            <section id="newsletter" className={`py-20 px-4 sm:px-6 lg:px-8 text-center relative group transition-colors ${isHighContrast ? 'bg-black border-t-[6px] border-yellow-400' : 'bg-emerald-50 border-t border-emerald-100'}`}>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 flex items-center gap-2">
          
          <button 
            type="button" 
            onClick={() => setIsHighContrast(!isHighContrast)} 
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-sm ${isHighContrast ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
            title="Toggle High Contrast Mode"
          >
            <Contrast className="w-3.5 h-3.5" />
            High Contrast
          </button>
          
          <div className={`flex items-center gap-1 border rounded-lg p-1 shadow-sm transition-colors ${isHighContrast ? 'bg-black border-yellow-400' : 'bg-white border-slate-200'}`}>
            <button type="button" onClick={handleDecreaseFont} disabled={newsFontScale === 0} className={`p-1 rounded disabled:opacity-30 disabled:hover:bg-transparent ${isHighContrast ? 'text-yellow-400 hover:text-black hover:bg-yellow-400' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Decrease font size">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <Type className={`w-3.5 h-3.5 ${isHighContrast ? 'text-white' : 'text-slate-400'}`} />
            <button type="button" onClick={handleIncreaseFont} disabled={newsFontScale === 3} className={`p-1 rounded disabled:opacity-30 disabled:hover:bg-transparent ${isHighContrast ? 'text-yellow-400 hover:text-black hover:bg-yellow-400' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Increase font size">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <ShareSectionButton 
            title="Stay Updated with Legal & Tax News"
            text="Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox."
            url="/#newsletter"
            className={isHighContrast ? '!bg-black !text-yellow-400 !border-yellow-400 hover:!bg-yellow-400 hover:!text-black' : ''}
          />
          <BookmarkSectionButton 
            id="newsletter-section" 
            title="Legal & Tax News Newsletter" 
            url="/#newsletter"
            className={isHighContrast ? '!bg-black !text-yellow-400 !border-yellow-400 hover:!bg-yellow-400 hover:!text-black' : ''}
          />
          <CopySectionButton 
            content="Stay Updated with Legal & Tax News

Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.

By subscribing, you agree to our Privacy Policy and Terms of Service." 
            className={isHighContrast ? '!bg-black !text-yellow-400 !border-yellow-400 hover:!bg-yellow-400 hover:!text-black' : ''}
          />
        </div>
        <div className={`max-w-4xl mx-auto p-8 md:p-12 rounded-[2.5rem] shadow-2xl border relative overflow-hidden ${isHighContrast ? 'bg-black border-yellow-400' : 'bg-white/80 backdrop-blur-2xl border-white shadow-emerald-900/5'}`}>
          {!isHighContrast && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-100/40 to-teal-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />
          )}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors shadow-sm relative z-10 ${isHighContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-emerald-100 text-emerald-600'}`}>
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className={`relative z-10 ${['text-2xl md:text-3xl', 'text-3xl md:text-4xl', 'text-4xl md:text-5xl', 'text-5xl md:text-6xl'][newsFontScale]} font-bold mb-4 transition-all ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Stay Updated with Legal & Tax News</h2>
          <p className={`relative z-10 ${['text-base', 'text-lg', 'text-xl', 'text-2xl'][newsFontScale]} mb-10 transition-all ${isHighContrast ? 'text-yellow-400 font-bold tracking-wide' : 'text-slate-600'}`}>
            Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.
          </p>
          <div className="text-left mt-8 max-w-2xl mx-auto relative z-10"><NewsletterSignup variant="full-width" /></div>
          <p className={`relative z-10 text-xs mt-6 transition-colors ${isHighContrast ? 'text-white font-bold' : 'text-slate-500'}`}>By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
          <SectionNote id="newsletter-section" isHighContrast={isHighContrast} />
        </div>
      </section>
    </div>
  );
}
