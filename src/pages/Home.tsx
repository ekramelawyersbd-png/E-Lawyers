import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookmarkButton } from '../components/BookmarkButton';
import { calculateReadingTime } from '../utils/readingTime';
import { ArrowRight, Clock, Minus, Plus, Type, Contrast, BookOpen, Calculator, FileText, Landmark, LineChart, MessageSquare, Search, Scale, Briefcase, FileSignature, Users, BookMarked, Calendar as CalendarIcon, ArrowUpRight, ExternalLink, ShieldCheck, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Wrench, GraduationCap, Award, UserCheck, CheckSquare, Building2, ScrollText, Gavel, Facebook, Linkedin, Share2, Copy, Check, ThumbsUp, MessageCircle, HelpCircle, Star, CheckCircle2, MapPin, ShoppingBag, FileCheck } from 'lucide-react';
import { mockArticles, categories } from '../data/mockData';
import { INITIAL_EXPERTS, INITIAL_QUESTIONS } from '../data/communityData';
import { format } from 'date-fns';
import { CopySectionButton } from '../components/CopySectionButton';
import { BookmarkSectionButton } from '../components/BookmarkSectionButton';
import { ShareSectionButton } from '../components/ShareSectionButton';
import { SectionNote } from '../components/SectionNote';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Testimonials } from '../components/Testimonials';
import { QuickContactSection } from '../components/QuickContactSection';
import { SEO } from '../components/SEO';

export function Home() {
  const navigate = useNavigate();
  const [latestArticlesCategory, setLatestArticlesCategory] = useState('all');
  const [communityTopicFilter, setCommunityTopicFilter] = useState('all');
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);
  const [heroArticleIndex, setHeroArticleIndex] = useState(0);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://accounticca.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2400);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Initial loading state to provide visual skeleton feedback on load
    const timer = setTimeout(() => {
      setIsLoadingGuides(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshGuides = () => {
    setIsLoadingGuides(true);
    setTimeout(() => {
      setIsLoadingGuides(false);
    }, 600);
  };

  // Sort all articles by published date descending and extract top 3 for hero switcher
  const heroRecentArticles = [...mockArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  const currentHeroArticle = heroRecentArticles[heroArticleIndex] || heroRecentArticles[0] || mockArticles[0] || null;

  const featuredArticle = mockArticles[0] || null;
  const recentArticles = mockArticles.slice(1, 9);
  const filteredLatestArticles = latestArticlesCategory === 'all'
    ? recentArticles
    : mockArticles.filter(a => a.categoryId === latestArticlesCategory).slice(0, 8);
  const displayLatestArticles = filteredLatestArticles.length > 0 ? filteredLatestArticles : recentArticles;
  const popularArticles = mockArticles.slice(2, 5); // Just using different slice for mockup
  const legalUpdates = mockArticles.filter(a => a.categoryId === 'updates' || a.categoryId === 'corporate').slice(0, 4);

  const featuredGuides = [
    { title: 'Investment Tax Rebate in Bangladesh 2026–2027: Eligible Investments, Limits & Calculation', path: '/article/investment-tax-rebate-bangladesh-2026-2027', category: 'Income Tax', readTime: '12 min read' },
    { title: 'Outsourced Business Support: Extended Business Team for Smarter Growth', path: '/article/outsourced-business-support-accounticca', category: 'Business & Startup', readTime: '6 min read' },
    { title: 'Sales & Marketing Consultancy: Build a Strong Market Presence', path: '/article/sales-marketing-consultancy-accounticca', category: 'Business & Startup', readTime: '6 min read' },
    { title: 'HR & Organizational Consultancy: Build Strong Teams & Scalable Orgs', path: '/article/hr-organizational-consultancy-accounticca', category: 'Business & Startup', readTime: '5 min read' },
    { title: 'Business Automation Consultancy: Make Your Business Smarter With Tech', path: '/article/business-automation-consultancy-accounticca', category: 'Accounting Software', readTime: '6 min read' },
    { title: 'Business Process Optimization: Improve Efficiency Through Better Systems', path: '/article/business-process-optimization-accounticca', category: 'Business & Startup', readTime: '6 min read' },
    { title: 'Bookkeeping Services: Keep Financial Records Organized & Audit-Ready', path: '/article/bookkeeping-services-accounticca', category: 'Accounting & Finance', readTime: '5 min read' },
    { title: 'Accounting & Financial Consultancy: Better Financial Control & Decisions', path: '/article/accounting-financial-consultancy', category: 'Accounting & Finance', readTime: '6 min read' },
    { title: 'Business Planning & Strategy Consultancy: Create a Clear Growth Roadmap', path: '/article/business-planning-strategy-consultancy', category: 'Business & Startup', readTime: '6 min read' },
    { title: 'Business Startup Consultancy: Turn Business Ideas Into Reality', path: '/article/business-startup-consultancy', category: 'Business & Startup', readTime: '6 min read' },
    { title: 'Corporate Law Services in Bangladesh (Company Formation & Advisory)', path: '/article/corporate-law-services-bangladesh', category: 'Corporate Law', readTime: '6 min read' },
    { title: 'Tax & VAT Services in Bangladesh (Corporate & Individual)', path: '/article/tax-vat-services-bangladesh', category: 'Tax & VAT Law', readTime: '6 min read' },
    { title: 'RJSC & Compliance Services in Bangladesh', path: '/article/rjsc-compliance-services-bangladesh', category: 'RJSC & Corporate', readTime: '5 min read' },
    { title: 'Intellectual Property Services in Bangladesh (Trademark, Patent & Copyright)', path: '/article/intellectual-property-services-bangladesh', category: 'Intellectual Property', readTime: '5 min read' },
    { title: 'Litigation & Arbitration Services in Bangladesh', path: '/article/litigation-arbitration-services-bangladesh', category: 'Litigation & ADR', readTime: '5 min read' },
    { title: 'Accounting & Finance Solutions for Businesses', path: '/article/accounting-finance-solutions', category: 'Accounting & Finance', readTime: '6 min read' },
    { title: 'Business Consultancy Services in Bangladesh', path: '/article/business-consultancy-services-bangladesh', category: 'Business & Startup', readTime: '5 min read' },
    { title: 'Professional Training & Academy (Tax, VAT, RJSC & Legal)', path: '/article/professional-training-academy-bangladesh', category: 'Academy & Training', readTime: '6 min read' },
    { title: 'Legal Consultancy Services in Bangladesh', path: '/article/legal-consultancy-services-bangladesh', category: 'Corporate Law', readTime: '5 min read' },
    { title: 'Complete Guide to Company Registration in Bangladesh', path: '/article/company-reg', category: 'Corporate Law', readTime: '8 min read' },
    { title: 'Income Tax Return Filing Guide 2026', path: '/article/tax-return-guide', category: 'Tax Assessment', readTime: '10 min read' },
    { title: 'VAT Compliance Guide for Businesses', path: '/vat-guide', category: 'Indirect Tax', readTime: '7 min read' },
    { title: 'RJSC Annual Return Filing Guide', path: '/article/rjsc-guide', category: 'RJSC Compliance', readTime: '6 min read' },
    { title: 'Legal Checklist for Entrepreneurs', path: '/article/startup-legal-checklist', category: 'Business & Startup', readTime: '5 min read' }
  ];

  const practiceDesks = [
    {
      desk: 'Corporate Structuring & Tax Strategy',
      lead: 'Ekramul Islam Khandaker',
      role: 'Founding Member',
      service: 'Integrated Joint Ecosystem Consultation',
      focus: 'Entity formation, strategic tax planning, and multi-regulatory governance',
      imgSrc: 'https://i.ibb.co/tTskLmG0/17-removebg-preview.png',
    },
    {
      desk: 'Commercial Law & Litigation',
      lead: 'Advocate Anamul Haque',
      role: 'Founding Member',
      service: 'Corporate Law & RJSC Compliance',
      focus: 'Contract vetting, RJSC compliance, commercial disputes, and regulatory vetting',
      imgSrc: 'https://i.ibb.co/GQvnZKpX/13.png',
    },
    {
      desk: 'Audit, IFRS & ACCA Advisory',
      lead: 'Muhammad Abdul Kader ACCA',
      role: 'Senior Consultant',
      service: 'Fractional CFO & Financial Modeling',
      focus: 'Financial reporting, statutory audit readiness, and internal control systems',
      imgSrc: 'https://i.ibb.co/2YPhyMYW/19.png',
    },
    {
      desk: 'NBR Income Tax & VAT Compliance',
      lead: 'Zohir Uddin',
      role: 'Partner',
      service: 'Corporate Tax, VAT & Statutory Audit',
      focus: 'Corporate & individual tax returns, Mushak compliance, and tribunal defense',
      imgSrc: 'https://i.ibb.co/FLDh8Wcx/3.png',
    },
  ];

  const routeToSpecialistDesk = (service: string, leadName: string) => {
    navigate(
      `/contact?tab=inquiry&service=${encodeURIComponent(service)}&lead=${encodeURIComponent(leadName)}#contact-form-section`
    );
  };



  return (
    <div>
      <SEO
        title="Accounticca Blog Hub | Legal, Tax, VAT, Accounting & Business Technology"
        description="Empowering Bangladeshi businesses, startups, and foreign investors with integrated legal governance, NBR tax advisory, RJSC compliance, and fractional CFO leadership."
        canonicalUrl="/"
        keywords={[
          'Compliance Hub Bangladesh',
          'Legal Advisory Dhaka',
          'Tax Consulting Bangladesh',
          'VAT Advisory',
          'RJSC Company Registration',
          'Fractional CFO Services',
          'Accounticca',
          'E-Lawyers'
        ]}
      />
      {/* 1. Hero Section */}
      <section className="w-full relative bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100/70 border-b border-slate-200/80 overflow-hidden">
        {/* Subtle radial glow and modern background pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply animate-in fade-in duration-1000" />
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] mix-blend-multiply" />
          {/* Abstract Grid/Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTM5LjUgMGguNXY0MGgtLjV6TTAgMzkuNXYuNWg0MHYtLjV6IiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDIpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-70" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-80px)] pt-8 pb-16 sm:py-16 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide mb-5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Bangladesh Regulatory &amp; Corporate Intelligence</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.1]">
                Compliance <span className="text-emerald-600">Hub</span>
              </h1>
              
              {/* Refined Credibility Line */}
              <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-slate-700 font-medium mb-6 py-2 px-3.5 sm:px-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <span className="text-slate-500 font-normal">Powered by</span>
                <a 
                  href="https://elawyersbd.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline transition-colors"
                >
                  <span>E-Lawyers</span>
                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                </a>
                <span className="text-slate-400">&amp;</span>
                <a 
                  href="https://accounticca.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline transition-colors"
                >
                  <span>Accounticca</span>
                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                </a>
                <span className="text-slate-400 hidden sm:inline">—</span>
                <span className="text-slate-700 font-semibold">Simplifying Legal &amp; Financial Compliance</span>
              </div>
              
              {/* Value Proposition */}
              <p 
                className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-normal text-justify"
                style={{ textAlign: 'justify' }}
              >
                Authoritative statutory guidance, tax calculators, and actionable regulatory insights. Built for entrepreneurs, CFOs, and practitioners navigating Bangladesh legal and financial compliance.
              </p>
              
              {/* Search Bar */}
              <div className="mb-5 max-w-xl relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                <form 
                  className="relative flex items-center bg-white rounded-2xl p-1.5 border border-slate-300 shadow-md transition-all"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('search') as HTMLInputElement;
                    if (input.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
                    }
                  }}
                >
                  <Search className="w-5 h-5 text-slate-400 ml-4 absolute pointer-events-none" />
                  <input 
                    name="search"
                    type="text" 
                    placeholder="Search Income Tax sections, RJSC filings, VAT circulars..." 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md shrink-0">
                    Search
                  </button>
                </form>
              </div>

              {/* Quick Interactive Tool Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8 max-w-xl">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Quick Tools:</span>
                <Link to="/tax-calculator" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors">
                  Tax Calculator
                </Link>
                <Link to="/tds-guide" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors">
                  TDS Guide
                </Link>
                <Link to="/corporate-planner" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors">
                  Corporate Tax
                </Link>
                <Link to="/vat-guide" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors">
                  VAT Guide
                </Link>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/contact" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/category/compliance" 
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-slate-950 px-7 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 hover:-translate-y-0.5 text-sm sm:text-base shadow-2xs"
                >
                  <span>Compliance Checklists</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Content Area: Top 3 Recent Articles Switcher & Pillars */}
            <div className="lg:col-span-5 space-y-4">
              {currentHeroArticle && (
                <div className="relative group animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-1000 delay-150">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-slate-200 rounded-[26px] blur-sm opacity-50 group-hover:opacity-80 transition duration-500"></div>
                  <div className="relative flex flex-col bg-white border border-slate-200/90 p-6 sm:p-7 rounded-[22px] shadow-lg overflow-hidden">
                    
                    {/* Header: Recent Insights Tabs (1 to 3) & Navigation */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {heroRecentArticles.map((article, idx) => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => setHeroArticleIndex(idx)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              heroArticleIndex === idx
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                            }`}
                            title={`View recent article ${idx + 1}`}
                          >
                            <span>Recent 0{idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setHeroArticleIndex((prev) => (prev > 0 ? prev - 1 : heroRecentArticles.length - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                          title="Previous recent article"
                          aria-label="Previous article"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroArticleIndex((prev) => (prev < heroRecentArticles.length - 1 ? prev + 1 : 0))}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                          title="Next recent article"
                          aria-label="Next article"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <Link 
                      to={`/article/${currentHeroArticle.id}`} 
                      className="group/link flex flex-col flex-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{currentHeroArticle.category || 'Recent Insight'}</span>
                        </div>
                        <span className="text-slate-600 text-xs font-semibold flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {calculateReadingTime(currentHeroArticle.content)} min
                        </span>
                      </div>
                      
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug group-hover/link:text-emerald-700 transition-colors line-clamp-2">
                        {currentHeroArticle.title}
                      </h2>
                      
                      <p 
                        className="text-slate-600 text-xs sm:text-sm mb-5 line-clamp-2 leading-relaxed text-justify"
                        style={{ textAlign: 'justify' }}
                      >
                        {currentHeroArticle.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <img 
                            src={currentHeroArticle.author.avatarUrl} 
                            alt={currentHeroArticle.author.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm" 
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{currentHeroArticle.author.name}</p>
                            <p className="text-[10px] text-slate-500">
                              {currentHeroArticle.publishedAt ? format(new Date(currentHeroArticle.publishedAt), 'MMM d, yyyy') : 'Recent Update'}
                            </p>
                          </div>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 group-hover/link:bg-emerald-600 group-hover/link:text-white flex items-center justify-center transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>

                    {/* Compact Mini-List for the other 2 recent articles */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Top 3 Recent Updates:
                      </div>
                      {heroRecentArticles.map((article, idx) => (
                        <button
                          key={article.id}
                          type="button"
                          onClick={() => setHeroArticleIndex(idx)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            heroArticleIndex === idx 
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold' 
                              : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium flex items-center gap-1.5">
                            <span className="text-emerald-700 font-bold shrink-0">0{idx + 1}.</span>
                            <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{article.title}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {format(new Date(article.publishedAt), 'MMM d')}
                          </span>
                        </button>
                      ))}
                    </div>

                  </div>
                </div>
              )}

              {/* Three SaaS Compliance Pillar Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200/90 shadow-2xs rounded-xl p-3 text-center hover:border-emerald-500/40 transition-colors">
                  <Landmark className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Corporate</div>
                  <div className="text-xs text-slate-700 font-medium">RJSC &amp; Companies</div>
                </div>
                <div className="bg-white border border-slate-200/90 shadow-2xs rounded-xl p-3 text-center hover:border-emerald-500/40 transition-colors">
                  <Calculator className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Tax 2023</div>
                  <div className="text-xs text-slate-700 font-medium">NBR SROs &amp; Slabs</div>
                </div>
                <div className="bg-white border border-slate-200/90 shadow-2xs rounded-xl p-3 text-center hover:border-emerald-500/40 transition-colors">
                  <FileText className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">VAT &amp; TDS</div>
                  <div className="text-xs text-slate-700 font-medium">Withholding Rules</div>
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
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2"
                style={{ borderColor: '#06398d' }}
              >
                Latest Articles &amp; Precedents
              </h2>
              <p 
                className="text-slate-500 text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
                style={{ borderColor: '#00050d' }}
              >
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
            {displayLatestArticles.map((article, idx) => (
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
                  <h3 
                    className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                    style={idx === 0 ? {
                      fontSize: '17px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial',
                      lineHeight: '19px'
                    } : undefined}
                  >
                    {article.title}
                  </h3>
                  <p 
                    className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1 font-normal"
                    style={idx === 0 ? {
                      color: '#110101',
                      textAlign: 'justify',
                      fontFamily: 'Arial',
                      lineHeight: '16.5px'
                    } : undefined}
                  >
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
                      <span 
                        className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-all duration-200"
                        style={idx === 0 ? {
                          color: '#1554e8',
                          fontWeight: 'bold',
                          lineHeight: '27px'
                        } : undefined}
                      >
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

      {/* 3. Specialist Practice Desks Routing Strip */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-emerald-800">Practice Leadership Routing</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-950">
                Route your inquiry directly to a specialist partner desk
              </h2>
            </div>
            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              <span>Meet all 21 team members</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {practiceDesks.map((item) => (
              <article
                key={item.lead}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={item.imgSrc}
                      alt={item.lead}
                      loading="lazy"
                      className="h-12 w-12 rounded-full object-cover object-top border border-slate-200 bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.lead}</h3>
                      <p className="text-xs font-medium text-emerald-700">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mb-1">{item.desk}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.focus}</p>
                </div>

                <button
                  type="button"
                  onClick={() => routeToSpecialistDesk(item.service, item.lead)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-700 text-emerald-800 hover:text-white border border-slate-200 hover:border-emerald-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Route Brief to Desk</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Academy Highlight Section — Accounticca Academy */}
      <section className="py-10 sm:py-14 px-4 bg-[#f3f6f9]">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-[#061e24] via-[#092d35] to-[#0c3c46]">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* LEFT: Copy + CTA */}
                <div className="lg:w-[52%]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Cohorts Enrolling · CPD &amp; Professional Syllabus</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-[1.15] mb-3">
                    Accelerate Skills at{' '}
                    <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                      Accounticca Academy
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 max-w-md">
                    Practical practitioner-led training in Bangladesh Income Tax, VAT &amp; SD Act 2012, RJSC corporate governance, and hands-on e-Return filing.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Link 
                      to="/training"
                      className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <span>Explore All Courses</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-white/10 hover:bg-white/20 border border-emerald-400/30 hover:border-emerald-400/60 text-white font-bold text-sm rounded-xl backdrop-blur-xs transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-300" />
                      <span>Send an inquiry</span>
                    </Link>
                    <Link 
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 hover:border-emerald-300 text-emerald-200 hover:text-white font-bold text-sm rounded-xl backdrop-blur-xs transition-all shadow-sm"
                    >
                      <CalendarIcon className="w-4 h-4 text-emerald-300" />
                      <span>Book appointment</span>
                    </Link>
                  </div>
                </div>

                {/* RIGHT: 4 Course Mini-Cards */}
                <div className="lg:w-[48%]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Course 1: Personal Income Tax */}
                    <Link 
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Calculator className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Personal Income Tax</div>
                        <div className="text-[11px] text-emerald-300 font-semibold truncate">Live Cohort · e-Return Filing</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Course 2: VAT & SD Act */}
                    <Link 
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileCheck className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">VAT &amp; SD Masterclass</div>
                        <div className="text-[11px] text-cyan-300 font-semibold truncate">Mushak 6.3 &amp; Withholding</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Course 3: RJSC & Company Law */}
                    <Link 
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Building2 className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">RJSC &amp; Secretarial</div>
                        <div className="text-[11px] text-amber-300 font-semibold truncate">Incorporation &amp; Compliance</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Course 4: Practical Accounting */}
                    <Link 
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-emerald-950 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Award className="w-5 h-5 text-teal-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Practical Accounting</div>
                        <div className="text-[11px] text-teal-300 font-semibold truncate">IFRS, Excel &amp; Tax Audit</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Interactive Live Cohorts · Case Studies · Course Completion Certificates
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    to="/contact?tab=inquiry#inquiry"
                    className="text-emerald-300 font-semibold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send an inquiry</span>
                  </Link>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <Link 
                    to="/contact?tab=inquiry#inquiry"
                    className="text-teal-300 font-semibold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Book appointment</span>
                  </Link>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <Link 
                    to="/verify-certificate"
                    className="text-slate-300 font-bold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Verify Student Certificate
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Shop Highlight Section — Compliance Shop */}
      <section className="py-10 sm:py-14 px-4 bg-[#eaeff5] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-400/40 bg-gradient-to-br from-[#0c0e23] via-[#141838] to-[#1a214d]">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* LEFT: Copy + CTA */}
                <div className="lg:w-[52%]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span>Instant Digital Downloads · Supreme Court &amp; CA Vetted</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-[1.15] mb-3">
                    Legal &amp; Tax Toolkits at{' '}
                    <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                      Compliance Shop
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 max-w-md">
                    Skip weeks of drafting. Download ready-to-use MOA &amp; AOA templates, Board resolutions, automated income tax calculators, and statutory registers.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Link 
                      to="/shop"
                      className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#c7a76b] via-[#ddc38f] to-[#c7a76b] hover:from-[#ddc38f] hover:to-[#c7a76b] text-[#10243a] font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <span>Explore All Toolkits</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-white/10 hover:bg-white/20 border border-amber-400/30 hover:border-amber-400/60 text-white font-bold text-sm rounded-xl backdrop-blur-xs transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-300" />
                      <span>Send an inquiry</span>
                    </Link>
                    <Link 
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-white font-bold text-sm rounded-xl backdrop-blur-xs transition-all shadow-sm"
                    >
                      <CalendarIcon className="w-4 h-4 text-amber-300" />
                      <span>Book appointment</span>
                    </Link>
                  </div>
                </div>

                {/* RIGHT: 4 Product Mini-Cards */}
                <div className="lg:w-[48%]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Product 1: RJSC Incorporation Kit */}
                    <Link 
                      to="/shop?category=corporate"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Building2 className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">RJSC Incorporation Kit</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">MOA, AOA &amp; Resolutions</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Product 2: Income Tax Return Suite */}
                    <Link 
                      to="/shop?category=tax"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileText className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Income Tax Return Suite</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">Excel Computations 2026-27</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Product 3: Commercial Contracts */}
                    <Link 
                      to="/shop?category=legal"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-slate-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Scale className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Commercial Agreements</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">Vendor, Employment &amp; Lease</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Product 4: VAT Mushak Toolkit */}
                    <Link 
                      to="/shop?category=vat"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-cyan-950 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Briefcase className="w-5 h-5 text-teal-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">VAT Mushak Toolkit</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">6.1, 6.2, 6.3 &amp; Challans</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  100% Bangladesh Statutory Compliant · Instant File Delivery
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    to="/contact?tab=inquiry#inquiry"
                    className="text-amber-300 font-semibold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send an inquiry</span>
                  </Link>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <Link 
                    to="/contact?tab=inquiry#inquiry"
                    className="text-amber-200 font-semibold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Book appointment</span>
                  </Link>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <Link 
                    to="/shop"
                    className="text-[#ddc38f] font-bold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Browse All 40+ Toolkits
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Careers Highlight Section — E-Lawyers */}
      <section className="py-10 sm:py-14 px-4 bg-[#f3f6f9]">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#c7a76b]/50 bg-gradient-to-br from-[#0b1726] via-[#10243a] to-[#16445a]">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c7a76b]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* LEFT: Copy + CTA */}
                <div className="lg:w-[52%]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>We're Hiring · 4 Career Tracks Open</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-[1.15] mb-3">
                    Build Your Career at{' '}
                    <span className="bg-gradient-to-r from-[#ddc38f] via-[#c7a76b] to-[#ddc38f] bg-clip-text text-transparent">
                      E-Lawyers
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 max-w-md">
                    Join a premier corporate legal &amp; business consultancy in Dhaka. 4 career
                    tracks now open for fresh graduates &amp; experienced professionals.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Link 
                      to="/Careers"
                      className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#c7a76b] via-[#d5b67b] to-[#c7a76b] hover:from-[#d5b67b] hover:to-[#c7a76b] text-[#10243a] font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <span>Explore All Careers</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-white/10 hover:bg-white/20 border border-[#c7a76b]/30 hover:border-[#c7a76b]/60 text-white font-bold text-sm rounded-xl backdrop-blur-xs transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-[#ddc38f]" />
                      <span>Send an inquiry</span>
                    </Link>
                    <Link 
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-[#c7a76b]/50 hover:border-amber-300 text-amber-200 hover:text-white font-bold text-sm rounded-xl backdrop-blur-xs transition-all shadow-sm"
                    >
                      <CalendarIcon className="w-4 h-4 text-[#ddc38f]" />
                      <span>Book appointment</span>
                    </Link>
                  </div>
                </div>

                {/* RIGHT: 4 Role Mini-Cards */}
                <div className="lg:w-[48%]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Role 1: MTO */}
                    <Link 
                      to="/Careers/mto"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10243a] to-[#1c3c5d] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">MTO Trainee</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">Multiple Openings</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Role 2: Sales & Marketing */}
                    <Link 
                      to="/Careers/sales-marketing"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <LineChart className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Sales &amp; Marketing</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">Multiple Openings</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Role 3: Accountant */}
                    <Link 
                      to="/Careers/accountant"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/60 backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#167d83] to-[#0c4e52] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Calculator className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Accountant</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">২ জন (Accounts Division)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Role 4: Customer Care */}
                    <Link 
                      to="/Careers/customer-care"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c7a76b] backdrop-blur-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c7a76b] to-[#9e7a33] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Users className="w-5 h-5 text-[#10243a]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">Customer Care</div>
                        <div className="text-[11px] text-[#ddc38f] font-semibold truncate">২ জন (Female Only)</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ddc38f] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#c7a76b]" />
                  Panthapath, Dhaka · Full-Time In-Person Positions
                </span>
                <Link 
                  to="/Careers#check-status"
                  className="text-[#ddc38f] font-bold hover:text-white flex items-center gap-1 transition-colors"
                >
                  Already applied? Check Status
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Guides & 5. Latest Legal Updates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Featured Guides */}
          <div 
            id="featured-guides-container" 
            className="lg:col-span-8"
            aria-live="polite"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Quick Access Advisory &amp; Services</span>
                </div>
                <button
                  id="refresh-guides-btn"
                  type="button"
                  onClick={handleRefreshGuides}
                  disabled={isLoadingGuides}
                  title="Reload guides to inspect loading skeleton state"
                  aria-label="Refresh featured guides"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingGuides ? 'animate-spin text-emerald-600' : ''}`} />
                  <span className="hidden sm:inline">{isLoadingGuides ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-emerald-600 shrink-0" />
                <span>Featured Practice Guides &amp; Professional Services</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                Direct access to actionable compliance roadmaps, statutory tax planning guidelines, and corporate advisory services designed for Bangladesh enterprises.
              </p>
            </div>

            {isLoadingGuides ? (
              <div 
                id="featured-guides-skeleton-list"
                aria-busy="true" 
                aria-label="Loading featured legal guides"
                className="space-y-4"
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs animate-pulse"
                  >
                    <div className="flex items-center gap-4 w-full pr-4 min-w-0">
                      {/* Placeholder Index Badge */}
                      <div className="w-10 h-10 rounded-xl bg-slate-200/70 shrink-0" />

                      {/* Placeholder Title & Category Lines */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div 
                          className="h-4.5 bg-slate-200/80 rounded-md"
                          style={{ width: `${64 + (i % 3) * 14}%` }}
                        />
                        <div className="flex items-center gap-2">
                          <div className="h-3 bg-slate-200/60 rounded-md w-28" />
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className="h-3 bg-slate-100 rounded-md w-14" />
                        </div>
                      </div>
                    </div>

                    {/* Placeholder Action Icon */}
                    <div className="w-5 h-5 rounded-md bg-slate-100 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {featuredGuides.slice(0, 6).map((guide, idx) => (
                  <Link 
                    key={idx} 
                    to={guide.path} 
                    className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0 pr-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                        <span className="font-bold">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {guide.title}
                        </h3>
                        {guide.category && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                            <span className="text-emerald-700 font-semibold">{guide.category}</span>
                            <span>•</span>
                            <span>{guide.readTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
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

      {/* 6. Professional Legal, Tax & Business Community Section (/community) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Accounticca Verified Professional Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Legal, Tax &amp; Corporate Compliance Community
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              Connect directly with Supreme Court advocates, Income Tax Practitioners (ITP), Chartered Accountants, and entrepreneurs across Bangladesh. Ask statutory questions, review verified legal answers, or book a practitioner consultation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/community?ask=true"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Ask a Question</span>
            </Link>
            <Link
              to="/community"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-colors group"
            >
              <span>Explore Community Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 12-Column Split: 7 Cols Live Q&A Discussions + 5 Cols Verified Experts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (7 Cols): Live Community Q&A & Statutory Discussions */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Practitioner Q&amp;A Discussions
                  </h3>
                </div>

                {/* Topic Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'Income Tax', label: 'Income Tax' },
                    { id: 'Company Law & RJSC', label: 'RJSC & Corporate' },
                    { id: 'VAT & Customs', label: 'VAT' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCommunityTopicFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        communityTopicFilter === tab.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="divide-y divide-slate-100">
                {(communityTopicFilter === 'all'
                  ? INITIAL_QUESTIONS
                  : INITIAL_QUESTIONS.filter(
                      (q) =>
                        q.category.toLowerCase().includes(communityTopicFilter.toLowerCase()) ||
                        q.tags.some((t) =>
                          t.toLowerCase().includes(communityTopicFilter.toLowerCase())
                        )
                    )
                )
                  .slice(0, 3)
                  .map((question, idx) => {
                    const topAnswer = question.answers?.[0];
                    return (
                      <div key={question.id} className={`py-5 first:pt-4 last:pb-2 ${idx === 1 || idx === 2 ? 'hidden' : ''}`}>
                        {/* Unboxed Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-1.5">
                          <span className="font-bold text-emerald-700">{question.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-700">{question.author.name}</span>
                          <span className="text-slate-400">({question.author.role})</span>
                          <span aria-hidden="true">·</span>
                          <span>{question.time}</span>
                          {question.isAnsweredByExpert && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Expert Answered</span>
                              </span>
                            </>
                          )}
                        </div>

                        <Link
                          to="/community?tab=discussions"
                          className="group block"
                        >
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-1.5">
                            {question.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {question.content}
                          </p>
                        </Link>

                        {/* Top Verified Answer Preview */}
                        {topAnswer && (
                          <div className="mt-3 pl-3.5 border-l-2 border-emerald-500/70 bg-slate-50/70 rounded-r-xl py-2.5 pr-3.5">
                            <div className="flex items-center gap-2 text-xs mb-1">
                              <img
                                src={topAnswer.author.avatar}
                                alt={topAnswer.author.name}
                                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                              />
                              <span className="font-bold text-slate-900">
                                {topAnswer.author.name}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-emerald-700 font-medium text-[11px]">
                                {topAnswer.author.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {topAnswer.content}
                            </p>
                          </div>
                        )}

                        {/* Engagement Footer */}
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-4 font-mono tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                              <span>{question.upvotes} helpful</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>{question.answersCount} answers</span>
                            </span>
                          </div>

                          <Link
                            to="/community?tab=discussions"
                            className="font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                          >
                            <span>Read thread</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Have a specific Income Tax, VAT, or RJSC compliance question?
              </span>
              <Link
                to="/community?tab=discussions"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
              >
                <span>View All Community Discussions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 Cols): Verified Community Experts Directory Spotlight */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-7 text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Verified Panelists
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Top Legal &amp; Tax Contributors
                  </h3>
                </div>
                <Link
                  to="/community?tab=experts"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  <span>All Experts</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-800/80 my-2">
                {INITIAL_EXPERTS.slice(0, 3).map((expert) => (
                  <div key={expert.id} className="py-4 flex items-start gap-3.5">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white truncate">
                          {expert.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-xs font-mono tabular-nums font-bold text-amber-400 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{expert.rating.toFixed(1)}</span>
                        </span>
                      </div>

                      <p className="text-xs text-emerald-400 font-medium truncate mt-0.5">
                        {expert.role}
                      </p>

                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {expert.credentials}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-400 font-mono tabular-nums">
                        <span>{expert.experience} exp</span>
                        <span aria-hidden="true">·</span>
                        <span>{expert.answersCount} answers</span>
                        <span aria-hidden="true">·</span>
                        <span>{expert.helpfulVotes} helpful votes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Callout & CTA */}
            <div className="pt-4 mt-2 border-t border-slate-800 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-800/60 rounded-xl p-3 border border-slate-800">
                <div>
                  <div className="text-base font-extrabold text-white font-mono tabular-nums">
                    50+
                  </div>
                  <div className="text-[11px] text-slate-400">Verified Experts</div>
                </div>
                <div className="border-x border-slate-700/70">
                  <div className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                    1,200+
                  </div>
                  <div className="text-[11px] text-slate-400">Solved Inquiries</div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-white font-mono tabular-nums">
                    24h
                  </div>
                  <div className="text-[11px] text-slate-400">Avg. Response</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  to="/community"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Visit /community Forum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/community?tab=experts"
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Meet Experts</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shorter Consultation & Intake Desk Section (Inquiry & Appointment) */}
      <QuickContactSection />

      {/* Customer Testimonial Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Testimonials 
          variant="carousel"
          title="Client Trust & Verified Success Stories"
          subtitle="See how leading Bangladeshi enterprises, startups, and CFOs rely on Accounticca and E-Lawyers for corporate governance, RJSC filings, and NBR tax strategy."
        />
      </div>
    </div>
  );
}
