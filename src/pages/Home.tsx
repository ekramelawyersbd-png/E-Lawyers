import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkButton } from '../components/BookmarkButton';
import { calculateReadingTime } from '../utils/readingTime';
import { ArrowRight, Minus, Plus, Type, Contrast, BookOpen, Calculator, FileText, Landmark, LineChart, MessageSquare, Search, Scale, Briefcase, FileSignature, Users, BookMarked, Download, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import { mockArticles, categories } from '../data/mockData';
import { format } from 'date-fns';
import { CopySectionButton } from '../components/CopySectionButton';
import { BookmarkSectionButton } from '../components/BookmarkSectionButton';
import { ShareSectionButton } from '../components/ShareSectionButton';
import { SectionNote } from '../components/SectionNote';

export function Home() {
  const [newsFontScale, setNewsFontScale] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const handleIncreaseFont = () => setNewsFontScale(p => Math.min(p + 1, 3));
  const handleDecreaseFont = () => setNewsFontScale(p => Math.max(p - 1, 0));

  const featuredArticle = mockArticles[0] || null;
  const recentArticles = mockArticles.slice(1, 4);
  const popularArticles = mockArticles.slice(2, 5); // Just using different slice for mockup
  const legalUpdates = mockArticles.filter(a => a.categoryId === 'updates' || a.categoryId === 'corporate').slice(0, 4);

  const mainCategories = [
    {
      id: 'corporate',
      icon: <Landmark className="w-6 h-6 text-emerald-600" />,
      title: 'Corporate Law',
      contents: ['Company Registration', 'RJSC Compliance', 'Share Transfer', 'Directors\' Responsibilities', 'Corporate Governance']
    },
    {
      id: 'tax',
      icon: <Calculator className="w-6 h-6 text-emerald-600" />,
      title: 'Income Tax',
      contents: ['Income Tax Return Filing', 'Tax Calculation Guide', 'Tax Rebate Rules', 'TIN & e-TIN Updates', 'NBR Tax Circulars']
    },
    {
      id: 'vat',
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: 'VAT & Customs',
      contents: ['VAT Registration', 'VAT Return Filing', 'VAT Rules & Procedures', 'Customs Compliance', 'Import-Export Tax Issues']
    },
    {
      id: 'business',
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      title: 'Business & Startup',
      contents: ['Business Registration', 'Trade License', 'Partnership Agreements', 'Startup Legal Requirements', 'Business Compliance Checklist']
    },
    {
      id: 'legal_docs',
      icon: <FileSignature className="w-6 h-6 text-emerald-600" />,
      title: 'Legal Documentation',
      contents: ['Agreement Drafting', 'Legal Notices', 'Contracts', 'Power of Attorney', 'Deeds & Documents']
    },
    {
      id: 'civil_criminal',
      icon: <Scale className="w-6 h-6 text-emerald-600" />,
      title: 'Civil & Criminal Law',
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
      <section className="w-full relative">
        <div className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center min-h-[calc(100vh-130px)] text-white shadow-xl">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 opacity-90 text-[17px]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Latest Legal Updates
              </span>
              <h1 className="text-[45px] font-bold tracking-tight mb-6 leading-tight max-w-2xl">
                Expert Legal, Tax & Corporate Solutions for Bangladesh
              </h1>
              
              <div className="mb-8 max-w-xl">
                <form 
                  className="relative flex items-center bg-white rounded-full p-1 border border-slate-200/20 focus-within:ring-2 focus-within:ring-emerald-500 transition-all shadow-lg"
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
                    placeholder="Search Legal Articles..." 
                    className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 focus:outline-none text-sm md:text-base font-medium"
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-md">
                    Search
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/contact" className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2 shadow-md">
                  Consult a Lawyer
                </Link>
                <Link to="/contact" className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2 shadow-md">
                  Get Legal Advice
                </Link>
              </div>
            </div>

            {featuredArticle && (
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Link to={`/article/${featuredArticle.id}`} className="relative block bg-slate-800 border border-slate-700 p-6 rounded-3xl hover:border-emerald-500/50 transition-all shadow-2xl">
                  <span className="inline-block bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-4 border border-amber-400/30">
                    Featured Article
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-emerald-400 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <img src={featuredArticle.author.avatarUrl} alt={featuredArticle.author.name} className="w-8 h-8 rounded-full border-2 border-slate-700" />
                      <div>
                        <p className="text-xs font-bold text-white">{featuredArticle.author.name}</p>
                        <p className="text-[10px] text-slate-400">{format(new Date(featuredArticle.publishedAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Latest Articles */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Articles</h2>
            <p className="text-slate-600 text-lg">Tax Updates, Legal Notices, Business Law & Corporate Compliance</p>
          </div>
          <Link to="/category/updates" className="hidden sm:flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition-colors group">
            View All Updates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentArticles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden h-full">
              <div className="aspect-[16/9] w-full overflow-hidden relative">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <img src={article.author.avatarUrl} alt={article.author.name} className="w-8 h-8 rounded-full border border-slate-200" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{article.author.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{format(new Date(article.publishedAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <BookmarkButton id={article.id} title={article.title} url={`/article/${article.id}`} className="text-slate-400 hover:text-emerald-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
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
              <Link key={category.id} to={`/category/${category.id}`} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group flex flex-col h-full">
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
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1 block">{article.category}</span>
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
              <Link to="/contact" className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg">
                Book Consultation
              </Link>
              <Link to="/contact" className="w-full sm:w-auto bg-emerald-700 text-white hover:bg-emerald-600 border border-emerald-500 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg">
                Request Callback
              </Link>
            </div>
          </div>
        </div>
      </section>

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
        <div className="max-w-3xl mx-auto">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors shadow-sm ${isHighContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-emerald-100 text-emerald-600'}`}>
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className={`${['text-2xl md:text-3xl', 'text-3xl md:text-4xl', 'text-4xl md:text-5xl', 'text-5xl md:text-6xl'][newsFontScale]} font-bold mb-4 transition-all ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Stay Updated with Legal & Tax News</h2>
          <p className={`${['text-base', 'text-lg', 'text-xl', 'text-2xl'][newsFontScale]} mb-10 transition-all ${isHighContrast ? 'text-yellow-400 font-bold tracking-wide' : 'text-slate-600'}`}>
            Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.
          </p>
          <form className={`p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 border shadow-sm transition-colors ${isHighContrast ? 'bg-black border-4 border-yellow-400' : 'bg-white border-slate-200'}`}>
            <input 
              type="text" 
              name="name"
              autoComplete="name"
              placeholder="Your Name" 
              className={`flex-1 bg-transparent border-none py-3 px-6 focus:outline-none focus:ring-0 ${isHighContrast ? 'text-white placeholder:text-white/50 font-bold' : 'text-slate-900 placeholder:text-slate-400'}`}
              required
            />
            <div className={`hidden md:block w-px h-8 self-center transition-colors ${isHighContrast ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
            <input 
              type="email" 
              name="email"
              autoComplete="email"
              placeholder="Email Address" 
              className={`flex-1 bg-transparent border-none py-3 px-6 focus:outline-none focus:ring-0 ${isHighContrast ? 'text-white placeholder:text-white/50 font-bold' : 'text-slate-900 placeholder:text-slate-400'}`}
              required
            />
            <div className={`hidden md:block w-px h-8 self-center transition-colors ${isHighContrast ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
            <input 
              type="tel" 
              name="tel"
              autoComplete="tel"
              placeholder="Phone Number" 
              className={`flex-1 bg-transparent border-none py-3 px-6 focus:outline-none focus:ring-0 ${isHighContrast ? 'text-white placeholder:text-white/50 font-bold' : 'text-slate-900 placeholder:text-slate-400'}`}
            />
            <button 
              type="submit" 
              className={`px-8 py-4 rounded-xl md:rounded-full font-bold transition-all hover:scale-105 whitespace-nowrap shadow-sm ${isHighContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300 uppercase tracking-widest' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              Subscribe Now
            </button>
          </form>
          <p className={`text-xs mt-6 transition-colors ${isHighContrast ? 'text-white font-bold' : 'text-slate-500'}`}>By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
          <SectionNote id="newsletter-section" isHighContrast={isHighContrast} />
        </div>
      </section>
    </div>
  );
}
