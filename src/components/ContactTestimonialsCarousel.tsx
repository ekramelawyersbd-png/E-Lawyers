import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  TrendingUp, 
  Building2, 
  Award, 
  Lock, 
  Clock, 
  Scale, 
  SlidersHorizontal, 
  LayoutGrid,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';
import { APPOINTMENT_BASE_URL } from '../utils/appointmentRedirect';

export interface VerifiedTestimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  companyName: string;
  industry: string;
  avatarUrl: string;
  practiceArea: 'Legal & RJSC' | 'Tax & VAT' | 'Joint Ecosystem' | 'FDI & BIDA';
  rating: number;
  headline: string;
  story: string;
  metric: string;
  verifiedYear: string;
}

const VERIFIED_TESTIMONIALS: VerifiedTestimonial[] = [
  {
    id: 'story-finovate-fdi',
    clientName: 'Farhana Rashid, ACCA',
    clientTitle: 'Co-Founder & Chief Financial Officer',
    companyName: 'Finovate Digital Ltd.',
    industry: 'Financial Technology / Cross-Border SaaS',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=240',
    practiceArea: 'FDI & BIDA',
    rating: 5,
    headline: 'Structured our $1.2M foreign inward investment & BIDA approval seamlessly',
    story: 'Navigating Bangladesh Bank inward remittance guidelines and BIDA registration can stall a cross-border startup for months. The combined firepower of E-Lawyers drafting our shareholder agreements and Accounticca handling foreign encashment certificates made our overseas institutional investment effortless.',
    metric: '100% statutory clearance & closed $1.2M Pre-Series A round in 45 days',
    verifiedYear: 'Verified Client • 2025'
  },
  {
    id: 'story-apex-vat-defense',
    clientName: 'Shamsul Huq',
    clientTitle: 'Managing Director',
    companyName: 'Apex Artisan Apparels & Textiles',
    industry: 'RMG Manufacturing & Global Export',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=240',
    practiceArea: 'Tax & VAT',
    rating: 5,
    headline: 'Successfully resolved a BDT 28M NBR assessment demand at Tribunal',
    story: 'When our manufacturing units received an aggressive NBR VAT audit assessment claiming inadmissible input tax rebates, Accounticca’s chartered accountants reconstructed the purchase ledgers while E-Lawyers’ High Court advocates drafted the statutory legal defense. The demand was dismissed in our favor.',
    metric: 'BDT 28.4M tax liability overturned with zero administrative penalties',
    verifiedYear: 'Verified Client • 2024'
  },
  {
    id: 'story-zenith-joint-retainer',
    clientName: 'Mahmudur Rahman',
    clientTitle: 'Director of Corporate Operations',
    companyName: 'Zenith Healthcare Distribution',
    industry: 'Pharmaceuticals & Supply Chain',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=240',
    practiceArea: 'Joint Ecosystem',
    rating: 5,
    headline: 'One unified retainer replaced three separate uncoordinated agencies',
    story: 'Prior to entering the Accounticca × E-Lawyers ecosystem, our contracts were drafted by lawyers who did not understand withholding taxes, while our accountants had no legal background. Having a single point of partner-level contact for both corporate secretarial and tax filing transformed our governance.',
    metric: 'Over 120+ vendor agreements vetted with zero contractual dispute incidents',
    verifiedYear: 'Verified Client • 2025'
  },
  {
    id: 'story-nexustech-automation',
    clientName: 'Tanvir Ahmed',
    clientTitle: 'Chief Operating Officer',
    companyName: 'NexusTech Global BD',
    industry: 'Enterprise Software & ITES Export',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
    practiceArea: 'Legal & RJSC',
    rating: 5,
    headline: 'Complete RJSC restructuring, share issuance & fractional CFO oversight',
    story: 'As we scaled from 15 to 90 engineers, we needed to issue sweat equity, update our Memorandum at RJSC, and formalize executive employment bonds. The advisory desk delivered institutional-quality governance documents and tax-optimized employee benefit plans.',
    metric: '4-week turnaround for multi-class share restructuring at RJSC',
    verifiedYear: 'Verified Client • 2025'
  },
  {
    id: 'story-bengal-logistics',
    clientName: 'Nusrat Jahan Chowdhury',
    clientTitle: 'General Counsel & Executive Director',
    companyName: 'Bengal Express Logistics Ltd.',
    industry: 'Multimodal Freight & Warehousing',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=240',
    practiceArea: 'Joint Ecosystem',
    rating: 5,
    headline: 'Rigorous compliance oversight for nationwide logistics fleet operations',
    story: 'Operating across 64 districts requires strict adherence to commercial motor transport statutes, local trade licenses, and complex withholding tax deductibility. Accounticca and E-Lawyers keep our operations 100% compliant with proactive monthly audits.',
    metric: '0 statutory compliance non-conformities across 18 municipal zones',
    verifiedYear: 'Verified Client • 2024'
  }
];

const TRUST_BADGES = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    title: 'Dual-Firm Chartered Standing',
    desc: 'ICAB Chartered Accountants & Supreme Court Bar Advocates'
  },
  {
    icon: <Scale className="w-5 h-5 text-teal-300" />,
    title: '100% Compliance Defense Record',
    desc: 'Tested and proven across RJSC, NBR, and Appellate Tribunals'
  },
  {
    icon: <Award className="w-5 h-5 text-amber-400" />,
    title: '5.0 / 5.0 Rating',
    desc: 'Consistently rated 5 stars across 500+ client engagements'
  },
  {
    icon: <Clock className="w-5 h-5 text-emerald-400" />,
    title: 'Guaranteed 24h Triage SLA',
    desc: 'Urgent matters routed immediately to senior partner desks'
  },
  {
    icon: <Lock className="w-5 h-5 text-cyan-300" />,
    title: 'Strict Privilege & NDA',
    desc: 'Statutory confidentiality protected under professional law'
  }
];

export function ContactTestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [filterPractice, setFilterPractice] = useState<string>('all');

  const filteredTestimonials = VERIFIED_TESTIMONIALS.filter(t => {
    if (filterPractice === 'all') return true;
    return t.practiceArea === filterPractice;
  });

  const totalSlides = filteredTestimonials.length;
  const currentTestimonial = filteredTestimonials[currentIndex] || filteredTestimonials[0] || VERIFIED_TESTIMONIALS[0];

  useEffect(() => {
    if (!isAutoPlaying || isHovered || viewMode !== 'carousel' || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, 6500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, viewMode, totalSlides]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="client-testimonials">
      {/* 1. Institutional Trust Badges Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/50 shadow-xl mb-8 relative overflow-hidden">
        {/* Subtle Ambient Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Institutional Credibility &amp; Trust
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Trusted by Leading Bangladeshi Enterprises &amp; Foreign Investors
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {TRUST_BADGES.map((badge, idx) => (
              <div 
                key={idx}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                  {badge.icon}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Testimonials Carousel Card */}
      <div 
        className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle decorative background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Client Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Real Impact. Measurable Outcomes.
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Discover how our joint chartered accounting and corporate law practices deliver clear strategic value for scaling businesses across Bangladesh.
            </p>
          </div>

          {/* Practice Filter & View Mode Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Practice Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 overflow-x-auto">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'Joint Ecosystem', label: 'Joint Retainers' },
                { id: 'Tax & VAT', label: 'Tax & VAT' },
                { id: 'FDI & BIDA', label: 'FDI & BIDA' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilterPractice(tab.id);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    filterPractice === tab.id
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Slider / Grid Toggle */}
            <div className="hidden sm:inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <button
                onClick={() => setViewMode('carousel')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'carousel' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Carousel Slider View"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Content Mode */}
        {viewMode === 'carousel' ? (
          <div className="relative z-10">
            {/* Slide Navigation Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">
                  Review <span className="text-emerald-700 font-black">{currentIndex + 1}</span> of {totalSlides}
                </span>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                  title={isAutoPlaying ? "Pause automatic slide rotation" : "Resume slide rotation"}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Auto-playing (6.5s)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">Paused</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prev / Next Circular Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Featured Testimonial Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50/80 via-white to-emerald-50/30 p-6 sm:p-10 shadow-sm relative overflow-hidden transition-all duration-300">
              {/* Quote Mark Icon in Background */}
              <Quote className="w-24 h-24 text-emerald-950/[0.04] absolute top-4 right-4 pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between min-h-[300px]">
                <div>
                  {/* Rating Stars & Practice Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-1.5">5.0 Star Verified Review</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
                        {currentTestimonial.practiceArea}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                        {currentTestimonial.verifiedYear}
                      </span>
                    </div>
                  </div>

                  {/* Headline Quote */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-4">
                    "{currentTestimonial.headline}"
                  </h3>

                  {/* Testimonial Body Story */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal max-w-4xl">
                    "{currentTestimonial.story}"
                  </p>
                </div>

                <div>
                  {/* Verified Impact Metric */}
                  {currentTestimonial.metric && (
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-emerald-200/90 mb-6 shadow-2xs">
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified Result: {currentTestimonial.metric}</span>
                    </div>
                  )}

                  {/* Client Author Attribution */}
                  <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={currentTestimonial.avatarUrl}
                        alt={currentTestimonial.clientName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900">
                            {currentTestimonial.clientName}
                          </h4>
                          <span title="Verified Client Identity">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {currentTestimonial.clientTitle} • <strong className="text-slate-800">{currentTestimonial.companyName}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {currentTestimonial.industry}
                        </p>
                      </div>
                    </div>

                    <a
                      href={APPOINTMENT_BASE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto bg-white px-3.5 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 shadow-2xs transition-colors"
                    >
                      <span>Consult on Similar Case</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Bullet Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-emerald-600 shadow-xs' 
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Grid View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {item.practiceArea}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    "{item.headline}"
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed mb-4">
                    "{item.story}"
                  </p>
                </div>

                <div>
                  {item.metric && (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 text-[11px] font-bold border border-emerald-200/80 mb-4 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.metric}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                    <img
                      src={item.avatarUrl}
                      alt={item.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.clientName}
                        </h4>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.clientTitle}, {item.companyName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
