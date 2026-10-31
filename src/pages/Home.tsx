import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookmarkButton } from '../components/BookmarkButton';
import { calculateReadingTime } from '../utils/readingTime';
import {
  ArrowRight,
  Clock,
  BookOpen,
  Calculator,
  FileText,
  Landmark,
  Search,
  Scale,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2,
  ArrowUpRight,
  ExternalLink,
  Calendar as CalendarIcon,
  MessageSquare,
  Award,
  FileCheck,
  MapPin,
  Star,
  Wrench
} from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { INITIAL_EXPERTS, INITIAL_QUESTIONS } from '../data/communityData';
import { format } from 'date-fns';
import { Testimonials } from '../components/Testimonials';
import { QuickContactSection } from '../components/QuickContactSection';
import { SEO } from '../components/SEO';
import { SHOP_PRODUCTS, ShopProduct } from '../data/shopProducts';
import { useCart } from '../contexts/CartContext';
import { usePurchases } from '../contexts/PurchaseContext';
import { ProductPurchaseActions } from '../components/shop/ProductPurchaseActions';

export function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isPurchased, isPendingPurchase } = usePurchases();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [latestArticlesCategory, setLatestArticlesCategory] = useState('all');
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);
  const [heroArticleIndex, setHeroArticleIndex] = useState(0);
  const [featuredInsightIndex, setFeaturedInsightIndex] = useState(0);
  const [insightsViewMode, setInsightsViewMode] = useState<'grid' | 'carousel'>('grid');

  const featuredRegulatoryInsights = [
    {
      id: 'reg-ita-2023-sro',
      badge: 'Income Tax Act 2023 · SRO Update',
      effectiveDate: 'Effective FY 2026–2027',
      impactLevel: 'High Impact',
      title: 'Revised Corporate & Individual Tax Slabs, Minimum Tax (Sec 163) & Investment Rebate Caps',
      summary:
        'NBR statutory updates on prospective personal tax brackets, corporate compliance rate conditions (cashless transaction thresholds), and 15% allowable investment tax rebate rules.',
      statReference: 'Secs. 76, 78 & 163 · Income Tax Act 2023',
      articlePath: '/article/investment-tax-rebate-bangladesh-2026-2027',
      toolPath: '/tax-calculator',
      toolLabel: 'Run Tax Calculator'
    },
    {
      id: 'reg-vat-mushak-91',
      badge: 'VAT & SD Act 2012 · NBR Directive',
      effectiveDate: 'Monthly Return Mandate',
      impactLevel: 'Mandatory Filing',
      title: 'Input Tax Credit (Mushak 6.3) Verification & 80% Banking Channel Settlement Enforcement',
      summary:
        'Stricter enforcement under Section 46 & Section 47 requiring Mushak 6.3 tax invoices within 4 taxonomic periods and mandatory banking channel settlement for supplies exceeding BDT 1,00,000.',
      statReference: 'Secs. 46 & 47 · VAT & SD Act 2012',
      articlePath: '/article/input-tax-rebate-bangladesh-vat-guide',
      toolPath: '/tools/vat-apportionment-calculator',
      toolLabel: 'Apportionment Tool'
    },
    {
      id: 'reg-rjsc-digital',
      badge: 'Companies Act 1994 · RJSC Circular',
      effectiveDate: 'Annual Compliance',
      impactLevel: 'Corporate Governance',
      title: 'RJSC Digital Schedule X, Form XII & Beneficial Ownership Disclosure Synchronization',
      summary:
        'Updated RJSC verification workflow requiring TIN/e-Return proof for directors on Form XII changes, AGM minutes authentication, and digitized share transfer instruments (Form 117).',
      statReference: 'Secs. 36 & 85 · Companies Act 1994',
      articlePath: '/article/rjsc-guide',
      toolPath: '/tools',
      toolLabel: 'RJSC Fee Checklists'
    },
    {
      id: 'reg-tds-vds-withholding',
      badge: 'Withholding Tax Rules · Finance Act',
      effectiveDate: 'Source Deduction',
      impactLevel: 'Audit Critical',
      title: 'Updated TDS & VDS Withholding Rates on Contractor Bills, IT Services & Commercial Rent',
      summary:
        'Comprehensive alignment between Mushak 6.6 VDS certificates and PSR (Proof of Submission of Return) verification—50% higher source tax penalty applies when vendor PSR is unverified.',
      statReference: 'Part VII · ITA 2023 & VDS Rules',
      articlePath: '/article/corporate-vat-compliance-monthly-return-protocol-bangladesh',
      toolPath: '/tds-guide',
      toolLabel: 'Open TDS Matrix'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingGuides(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshGuides = () => {
    setIsLoadingGuides(true);
    setTimeout(() => {
      setIsLoadingGuides(false);
    }, 450);
  };

  // Sort all articles by published date descending and extract top 3 for hero switcher
  const heroRecentArticles = [...mockArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  const currentHeroArticle =
    heroRecentArticles[heroArticleIndex] || heroRecentArticles[0] || mockArticles[0] || null;

  const recentArticles = mockArticles.slice(1, 9);
  const filteredLatestArticles =
    latestArticlesCategory === 'all'
      ? recentArticles
      : mockArticles.filter((a) => a.categoryId === latestArticlesCategory).slice(0, 8);
  const displayLatestArticles =
    filteredLatestArticles.length > 0 ? filteredLatestArticles : recentArticles;

  const featuredGuides = [
    {
      title: 'Comprehensive Guide to Input Tax Rebate (উপকরণ কর রেয়াত) in Bangladesh',
      path: '/article/input-tax-rebate-bangladesh-vat-guide',
      category: 'VAT & Indirect Tax',
      readTime: '14 min read'
    },
    {
      title: 'Corporate VAT Compliance & Monthly Return Protocol in Bangladesh (Mushak 9.1)',
      path: '/article/corporate-vat-compliance-monthly-return-protocol-bangladesh',
      category: 'VAT & Indirect Tax',
      readTime: '15 min read'
    },
    {
      title: 'Business Identification Number (BIN) Registration in Bangladesh: Complete Guide',
      path: '/article/bin-registration-in-bangladesh',
      category: 'VAT Registration',
      readTime: '14 min read'
    },
    {
      title: 'Identification and Registration Systems Overview (71 Global & Bangladesh IDs)',
      path: '/article/identification-and-registration-systems-overview-guide',
      category: 'Regulatory Reference',
      readTime: '18 min read'
    },
    {
      title: 'Investment Tax Rebate in Bangladesh 2026–2027: Eligible Investments, Limits & Calculation',
      path: '/article/investment-tax-rebate-bangladesh-2026-2027',
      category: 'Income Tax',
      readTime: '12 min read'
    },
    {
      title: 'Complete Guide to Company Registration in Bangladesh (RJSC, MOA & AOA)',
      path: '/article/company-reg',
      category: 'Corporate Law',
      readTime: '8 min read'
    },
    {
      title: 'Income Tax Return Filing Guide 2026–2027',
      path: '/article/tax-return-guide',
      category: 'Tax Assessment',
      readTime: '10 min read'
    },
    {
      title: 'RJSC Annual Return & Statutory Filing Guide',
      path: '/article/rjsc-guide',
      category: 'RJSC Compliance',
      readTime: '6 min read'
    },
    {
      title: 'Corporate Law Services in Bangladesh (Company Formation & Advisory)',
      path: '/article/corporate-law-services-bangladesh',
      category: 'Corporate Law',
      readTime: '6 min read'
    },
    {
      title: 'Tax & VAT Services in Bangladesh (Corporate & Individual)',
      path: '/article/tax-vat-services-bangladesh',
      category: 'Tax & VAT Law',
      readTime: '6 min read'
    },
    {
      title: 'Bookkeeping Services: Keep Financial Records Organized & Audit-Ready',
      path: '/article/bookkeeping-services-accounticca',
      category: 'Accounting & Finance',
      readTime: '5 min read'
    },
    {
      title: 'Legal Checklist for Entrepreneurs & Startups in Bangladesh',
      path: '/article/startup-legal-checklist',
      category: 'Business & Startup',
      readTime: '5 min read'
    }
  ];

  const practiceDesks = [
    {
      desk: 'Corporate Structuring & Tax Strategy',
      lead: 'Ekramul Islam Khandaker',
      role: 'Founding Member',
      service: 'Integrated Joint Ecosystem Consultation',
      focus: 'Entity formation, strategic tax planning, and multi-regulatory governance',
      imgSrc: 'https://i.ibb.co/tTskLmG0/17-removebg-preview.png'
    },
    {
      desk: 'Commercial Law & Litigation',
      lead: 'Advocate Anamul Haque',
      role: 'Founding Member',
      service: 'Corporate Law & RJSC Compliance',
      focus: 'Contract vetting, RJSC compliance, commercial disputes, and regulatory vetting',
      imgSrc: 'https://i.ibb.co/GQvnZKpX/13.png'
    },
    {
      desk: 'Audit, IFRS & ACCA Advisory',
      lead: 'Muhammad Abdul Kader ACCA',
      role: 'Senior Consultant',
      service: 'Fractional CFO & Financial Modeling',
      focus: 'Financial reporting, statutory audit readiness, and internal control systems',
      imgSrc: 'https://i.ibb.co/2YPhyMYW/19.png'
    },
    {
      desk: 'NBR Income Tax & VAT Compliance',
      lead: 'Zohir Uddin',
      role: 'Partner',
      service: 'Corporate Tax, VAT & Statutory Audit',
      focus: 'Corporate & individual tax returns, Mushak compliance, and tribunal defense',
      imgSrc: 'https://i.ibb.co/FLDh8Wcx/3.png'
    }
  ];

  const routeToSpecialistDesk = (service: string, leadName: string) => {
    navigate(
      `/contact?tab=inquiry&service=${encodeURIComponent(service)}&lead=${encodeURIComponent(leadName)}#contact-form-section`
    );
  };

  return (
    <div className="w-full">
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

      {/* 1. Hero Section - Enhanced Full-Bleed Light Cover Page Experience */}
      <section className="w-full relative min-h-[calc(100vh-76px)] flex items-center bg-gradient-to-br from-white via-[#fdfaf3] to-emerald-50/50 text-slate-900 border-b border-slate-200/90 overflow-hidden py-12 lg:py-20">
        {/* Subtle radial glows and architectural grid pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-12%] left-[6%] w-[680px] h-[680px] bg-emerald-400/12 rounded-full blur-[130px]" />
          <div className="absolute bottom-[-12%] right-[4%] w-[580px] h-[580px] bg-amber-300/15 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-10 xl:px-12 max-w-full mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-emerald-300/90 text-emerald-900 text-xs font-extrabold tracking-wide mb-5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.6)]" />
                <span>Bangladesh Regulatory &amp; Corporate Intelligence Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-black tracking-tight text-slate-900 mb-5 leading-[1.07]">
                Corporate{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-[#9e7a33]">
                  Compliance Hub
                </span>
              </h1>

              {/* Credibility Line */}
              <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-slate-700 font-medium mb-6 py-2.5 px-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xs">
                <span className="text-slate-500 font-normal">Officially Powered by</span>
                <a
                  href="https://elawyersbd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-extrabold text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline transition-colors"
                >
                  <span>E-Lawyers</span>
                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                </a>
                <span className="text-slate-400">&amp;</span>
                <a
                  href="https://accounticca.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-extrabold text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline transition-colors"
                >
                  <span>Accounticca</span>
                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                </a>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-slate-800 font-bold">
                  Simplifying Legal &amp; Financial Compliance
                </span>
              </div>

              {/* Value Proposition */}
              <p
                className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-7 font-normal text-justify"
                style={{ textAlign: 'justify' }}
              >
                Authoritative statutory guidance, automated tax &amp; VAT calculators, and actionable regulatory intelligence. Built for entrepreneurs, CFOs, and practitioners navigating Bangladesh legal and financial compliance under the Income Tax Act 2023 &amp; VAT Act 2012.
              </p>

              {/* Search Bar */}
              <div className="mb-5 max-w-xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 via-amber-300/25 to-teal-400/30 rounded-2xl blur-md opacity-40 group-focus-within:opacity-80 transition duration-500"></div>
                <form
                  className="relative flex items-center bg-white rounded-2xl p-1.5 border-2 border-slate-200/90 focus-within:border-emerald-500 shadow-md transition-all"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('search') as HTMLInputElement;
                    if (input.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
                    }
                  }}
                >
                  <Search className="w-5 h-5 text-emerald-600 ml-4 absolute pointer-events-none" />
                  <input
                    name="search"
                    type="text"
                    placeholder="Search Income Tax sections, RJSC filings, Mushak VAT forms..."
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold px-6 sm:px-8 py-3 rounded-xl text-sm transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Quick Interactive Tool Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8 max-w-xl">
                <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider">
                  Quick Tools:
                </span>
                <Link
                  to="/tools/vat-apportionment-calculator"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs transition-colors"
                >
                  VAT Apportionment (Sec 47)
                </Link>
                <Link
                  to="/tax-calculator"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 shadow-2xs transition-colors"
                >
                  Tax Calculator
                </Link>
                <Link
                  to="/tds-guide"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 shadow-2xs transition-colors"
                >
                  TDS Guide
                </Link>
                <Link
                  to="/vat-guide"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 shadow-2xs transition-colors"
                >
                  VAT Guide
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-7 py-3.5 rounded-xl font-extrabold transition-all flex items-center gap-2.5 shadow-md hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/tools"
                  className="bg-white hover:bg-emerald-50/50 border-2 border-slate-200/90 hover:border-emerald-300 text-slate-800 hover:text-slate-950 px-7 py-3.5 rounded-xl font-extrabold transition-all flex items-center gap-2.5 hover:-translate-y-0.5 text-sm sm:text-base shadow-2xs"
                >
                  <span>Explore Compliance Tools</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </Link>
              </div>
            </div>

            {/* Right Content Area: Top 3 Recent Articles Switcher & Pillars */}
            <div className="lg:col-span-5 space-y-4">
              {currentHeroArticle && (
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-br from-emerald-400/20 via-amber-200/20 to-teal-300/20 rounded-[28px] blur-md opacity-60 group-hover:opacity-90 transition duration-500"></div>
                  <div className="relative flex flex-col bg-white border-2 border-slate-200/90 p-6 sm:p-7 rounded-[24px] shadow-lg overflow-hidden">
                    {/* Header: Recent Insights Tabs (1 to 3) & Navigation */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {heroRecentArticles.map((article, idx) => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => setHeroArticleIndex(idx)}
                            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
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

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setHeroArticleIndex((prev) =>
                              prev > 0 ? prev - 1 : heroRecentArticles.length - 1
                            )
                          }
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                          title="Previous recent article"
                          aria-label="Previous article"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setHeroArticleIndex((prev) =>
                              prev < heroRecentArticles.length - 1 ? prev + 1 : 0
                            )
                          }
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                          title="Next recent article"
                          aria-label="Next article"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Link
                      to={`/article/${currentHeroArticle.id}`}
                      className="group/link flex flex-col flex-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
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
                            <p className="text-xs font-bold text-slate-900">
                              {currentHeroArticle.author.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {currentHeroArticle.publishedAt
                                ? format(new Date(currentHeroArticle.publishedAt), 'MMM d, yyyy')
                                : 'Recent Update'}
                            </p>
                          </div>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 group-hover/link:bg-emerald-600 group-hover/link:text-white flex items-center justify-center transition-all duration-300 border border-emerald-200">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>

                    {/* Compact Mini-List for the other 2 recent articles */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                        Top 3 Recent Updates:
                      </div>
                      {heroRecentArticles.map((article, idx) => (
                        <button
                          key={article.id}
                          type="button"
                          onClick={() => setHeroArticleIndex(idx)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            heroArticleIndex === idx
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium flex items-center gap-2">
                            <span className="text-emerald-700 font-bold shrink-0">0{idx + 1}.</span>
                            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-3.5 text-center hover:border-emerald-300 transition-colors">
                  <Landmark className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                    Corporate
                  </div>
                  <div className="text-xs text-slate-700 font-medium">RJSC &amp; Companies</div>
                </div>
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-3.5 text-center hover:border-emerald-300 transition-colors">
                  <Calculator className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                    Tax 2023
                  </div>
                  <div className="text-xs text-slate-700 font-medium">NBR SROs &amp; Slabs</div>
                </div>
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-3.5 text-center hover:border-emerald-300 transition-colors">
                  <FileText className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                    VAT &amp; TDS
                  </div>
                  <div className="text-xs text-slate-700 font-medium">Withholding Rules</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Careers Highlight Section — E-Lawyers */}
      <section className="careers-section w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-10 xl:px-12 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="w-full max-w-full mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#c7a76b]/40 bg-gradient-to-br from-white via-[#fdfaf3] to-emerald-50/40">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c7a76b]/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* LEFT: Copy + CTA */}
                <div className="lg:w-[52%]">
                  {/* Hiring Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    <span>We&apos;re Hiring · 4 Career Tracks Open</span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-[1.15] mb-3">
                    Build Your Career at{' '}
                    <span className="bg-gradient-to-r from-[#9e7a33] via-[#b89249] to-[#8a6824] bg-clip-text text-transparent">
                      E-Lawyers
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5 max-w-md">
                    Join a premier corporate legal &amp; business consultancy in Dhaka. 4 career tracks now open for fresh graduates &amp; experienced professionals.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/Careers"
                      className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#c7a76b] via-[#d5b67b] to-[#c7a76b] hover:from-[#d5b67b] hover:to-[#c7a76b] text-[#10243a] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Explore All Careers</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Deadline: Oct 31, 2026
                    </span>
                  </div>
                </div>

                {/* RIGHT: 4 Role Mini-Cards */}
                <div className="lg:w-[48%]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Role 1: MTO */}
                    <Link
                      to="/Careers/mto"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Award className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">MTO Trainee</div>
                        <div className="text-[11px] text-[#9e7a33] font-semibold truncate">
                          Multiple Openings
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9e7a33] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Role 2: Sales & Marketing */}
                    <Link
                      to="/Careers/sales-marketing"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-400/80 shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          Sales &amp; Marketing
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold truncate">
                          Multiple Openings
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Role 3: Accountant */}
                    <Link
                      to="/Careers/accountant"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-teal-50/40 border border-slate-200/90 hover:border-teal-400/80 shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Calculator className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">Accountant</div>
                        <div className="text-[11px] text-teal-700 font-semibold truncate">
                          ২ জন (Accounts Division)
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    {/* Role 4: Customer Care */}
                    <Link
                      to="/Careers/customer-care"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-[#c7a76b] shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-300/80 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <UserCheck className="w-5 h-5 text-[#8a6824]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">Customer Care</div>
                        <div className="text-[11px] text-[#9e7a33] font-semibold truncate">
                          ২ জন (Female Only)
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9e7a33] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#9e7a33]" />
                  Panthapath, Dhaka · Full-Time In-Person Positions
                </span>
                <Link
                  to="/Careers#check-status"
                  className="text-[#9e7a33] font-bold hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  Already applied? Check Status
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Latest Articles */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-full mx-auto">
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
              { id: 'compliance', label: 'Compliance' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLatestArticlesCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  latestArticlesCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4-Column x 2-Row Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayLatestArticles.map((article) => (
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
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[85px] sm:max-w-[100px]">
                          {article.author.name}
                        </p>
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

      {/* 4. Curated Statutory & Compliance Guides Directory */}
      <section className="w-full mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Comprehensive Reference Directory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Essential Bangladesh Tax, VAT &amp; Corporate Compliance Guides
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshGuides}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGuides ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span>All Tools Hub</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.path}
                to={guide.path}
                className="group p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{guide.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {guide.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 pt-2 border-t border-slate-200/60">
                  <span>Read Full Statutory Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Specialist Practice Desks Routing Strip */}
      <section className="w-full mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
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

      {/* 6. Academy Highlight Section — Accounticca Academy */}
      <section className="w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-10 xl:px-12 bg-white border-y border-slate-200/80">
        <div className="w-full max-w-full mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="lg:w-[52%]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Live Cohorts Enrolling · CPD &amp; Professional Syllabus</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-[1.15] mb-3">
                    Accelerate Skills at{' '}
                    <span className="text-emerald-700">Accounticca Academy</span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5 max-w-md">
                    Practical practitioner-led training in Bangladesh Income Tax, VAT &amp; SD Act 2012, RJSC corporate governance, and hands-on e-Return filing.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Link
                      to="/training"
                      className="group inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Explore All Courses</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/contact?tab=inquiry#inquiry"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-all shadow-2xs"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Send an inquiry</span>
                    </Link>
                    <Link
                      to="/contact?tab=appointment"
                      className="group inline-flex items-center gap-1.5 px-4 py-3 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 text-emerald-900 font-bold text-sm rounded-xl transition-all shadow-2xs"
                    >
                      <CalendarIcon className="w-4 h-4 text-emerald-700" />
                      <span>Book appointment</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:w-[48%]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Link
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Calculator className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          Personal Income Tax
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold truncate">
                          Live Cohort · e-Return Filing
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    <Link
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-cyan-50/70 border border-slate-200 hover:border-cyan-300 shadow-2xs transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 text-cyan-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <FileCheck className="w-5 h-5 text-cyan-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          VAT &amp; SD Masterclass
                        </div>
                        <div className="text-[11px] text-cyan-700 font-semibold truncate">
                          Mushak 6.3 &amp; Withholding
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    <Link
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 shadow-2xs transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Building2 className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          RJSC &amp; Secretarial
                        </div>
                        <div className="text-[11px] text-amber-700 font-semibold truncate">
                          Incorporation &amp; Compliance
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    <Link
                      to="/training"
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 shadow-2xs transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Award className="w-5 h-5 text-teal-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          Practical Accounting
                        </div>
                        <div className="text-[11px] text-teal-700 font-semibold truncate">
                          IFRS, Excel &amp; Tax Audit
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Featured Insights Grid / Carousel: Recent Regulatory Changes */}
              <div className="mt-8 pt-7 border-t border-emerald-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Featured Insights · Regulatory Change Watch</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                      Recent Statutory &amp; Regulatory Changes in Bangladesh
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="inline-flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setInsightsViewMode('grid')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          insightsViewMode === 'grid'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Grid View
                      </button>
                      <button
                        type="button"
                        onClick={() => setInsightsViewMode('carousel')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          insightsViewMode === 'carousel'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Carousel
                      </button>
                    </div>

                    {insightsViewMode === 'carousel' && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setFeaturedInsightIndex((prev) =>
                              prev > 0 ? prev - 1 : featuredRegulatoryInsights.length - 1
                            )
                          }
                          className="w-8 h-8 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Previous regulatory insight"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFeaturedInsightIndex((prev) =>
                              prev < featuredRegulatoryInsights.length - 1 ? prev + 1 : 0
                            )
                          }
                          className="w-8 h-8 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Next regulatory insight"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {insightsViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredRegulatoryInsights.map((insight) => (
                      <div
                        key={insight.id}
                        className="bg-white/95 rounded-2xl border border-slate-200/90 hover:border-emerald-400 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider truncate">
                              {insight.badge}
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                              {insight.impactLevel}
                            </span>
                          </div>

                          <Link
                            to={insight.articlePath}
                            className="block text-sm font-extrabold text-slate-900 hover:text-emerald-700 transition-colors leading-snug line-clamp-2"
                          >
                            {insight.title}
                          </Link>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {insight.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span className="truncate">{insight.statReference}</span>
                            <span className="shrink-0 font-semibold text-emerald-700">{insight.effectiveDate}</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <Link
                              to={insight.articlePath}
                              className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 transition-colors"
                            >
                              <span>Read Briefing</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              to={insight.toolPath}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white text-[11px] font-bold transition-colors"
                            >
                              <span>{insight.toolLabel}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm">
                    {(() => {
                      const activeInsight =
                        featuredRegulatoryInsights[featuredInsightIndex] || featuredRegulatoryInsights[0];
                      return (
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="space-y-3 max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                                {activeInsight.badge}
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                                {activeInsight.impactLevel}
                              </span>
                              <span className="text-xs font-mono font-semibold text-slate-500">
                                {activeInsight.statReference} · {activeInsight.effectiveDate}
                              </span>
                            </div>

                            <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                              {activeInsight.title}
                            </h4>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {activeInsight.summary}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                            <Link
                              to={activeInsight.articlePath}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all"
                            >
                              <span>Read Full Regulatory Brief</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to={activeInsight.toolPath}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all"
                            >
                              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{activeInsight.toolLabel}</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Carousel Indicators */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {featuredRegulatoryInsights.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFeaturedInsightIndex(idx)}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              featuredInsightIndex === idx
                                ? 'w-7 bg-emerald-600'
                                : 'w-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                            aria-label={`Select insight ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        Insight 0{featuredInsightIndex + 1} of 0{featuredRegulatoryInsights.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Strip */}
              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Interactive Live Cohorts · Case Studies · Course Completion Certificates
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact?tab=inquiry#inquiry"
                    className="text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send an inquiry</span>
                  </Link>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <Link
                    to="/contact?tab=appointment"
                    className="text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1 transition-colors"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Book appointment</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6B. Featured Compliance Products, Courses & Digital Toolkits (Global Purchase Verification) */}
      <section className="w-full mx-auto max-w-full px-4 py-10 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digital Compliance Store &amp; Academy</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Featured Products, Courses &amp; Statutory Toolkits
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Instant-access tax calculation workbooks, corporate legal kits, and certified training courses. Verified purchases automatically unlock across all pages for your User ID.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors self-start sm:self-auto shrink-0"
          >
            <span>Explore Full Shop Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {SHOP_PRODUCTS.slice(0, 4).map((product: ShopProduct) => {
            const owned = isPurchased(product.id) || isPurchased(product.slug);
            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  owned
                    ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                    : 'border-slate-200/90 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/85 text-white text-[10px] font-bold">
                      {product.category}
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">{product.format}</span>
                    <span className="text-base font-black text-slate-900">
                      BDT {product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <ProductPurchaseActions
                    product={product}
                    productId={product.id}
                    productSlug={product.slug}
                    variant="card"
                    isAdded={addedProductId === product.id}
                    onAddToCart={() => {
                      if (isPurchased(product.id) || isPendingPurchase(product.id)) return;
                      addToCart(product, 1);
                      setAddedProductId(product.id);
                      setTimeout(() => setAddedProductId(null), 1600);
                    }}
                    onBuyNow={() => {
                      if (isPurchased(product.id) || isPendingPurchase(product.id)) {
                        navigate('/client-portal');
                        return;
                      }
                      navigate(`/checkout?product=${encodeURIComponent(product.slug)}&qty=1`);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Community Expert Panelists & Discussion Section */}
      <section className="w-full mx-auto max-w-full px-4 py-10 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Community Q&amp;A
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Recent Tax &amp; Legal Discussions
                </h2>
              </div>
              <Link
                to="/community"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>View Forum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {INITIAL_QUESTIONS.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{q.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{q.content}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Asked by {q.author.name}</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      {q.answersCount} Answers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Verified Panelists
                  </p>
                  <h3 className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
                    Top Legal &amp; Tax Contributors
                  </h3>
                </div>
                <Link
                  to="/community?tab=experts"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  All Experts
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="my-2 divide-y divide-slate-100">
                {INITIAL_EXPERTS.slice(0, 3).map((expert) => (
                  <article key={expert.id} className="flex items-start gap-3.5 py-4">
                    <img
                      src={expert.avatar}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate text-sm font-bold text-slate-900">{expert.name}</h4>
                        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs font-bold tabular-nums text-amber-600">
                          <Star
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            aria-hidden="true"
                          />
                          {expert.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs font-semibold text-emerald-700">
                        {expert.role}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {expert.credentials}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tabular-nums text-slate-500">
                        <span>{expert.experience} exp</span>
                        <span aria-hidden="true">·</span>
                        <span>{expert.answersCount} answers</span>
                        <span aria-hidden="true">·</span>
                        <span>{expert.helpfulVotes} helpful votes</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-2 space-y-4 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div>
                  <p className="font-mono text-base font-extrabold tabular-nums text-slate-900">
                    50+
                  </p>
                  <p className="text-[11px] text-slate-500">Verified Experts</p>
                </div>
                <div className="border-x border-slate-200">
                  <p className="font-mono text-base font-extrabold tabular-nums text-emerald-700">
                    1,200+
                  </p>
                  <p className="text-[11px] text-slate-500">Solved Inquiries</p>
                </div>
                <div>
                  <p className="font-mono text-base font-extrabold tabular-nums text-slate-900">
                    24h
                  </p>
                  <p className="text-[11px] text-slate-500">Avg. Response</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to="/community"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  Visit Community Forum
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link
                  to="/community?tab=experts"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  Meet Experts
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 8. Inquiry and appointment intake */}
      <QuickContactSection />

      {/* 9. Client testimonials */}
      <section className="mx-auto mb-10 mt-2 w-full max-w-full rounded-3xl border-t border-slate-200/70 bg-slate-50/80 px-4 py-10 sm:px-6 lg:px-10 xl:px-12">
        <Testimonials
          variant="carousel"
          title="Client Trust & Verified Success Stories"
          subtitle="See how leading Bangladeshi enterprises, startups, and CFOs rely on Accounticca and E-Lawyers for corporate governance, RJSC filings, and NBR tax strategy."
        />
      </section>
    </div>
  );
}

export default Home;
