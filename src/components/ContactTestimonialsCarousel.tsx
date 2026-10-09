import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Lock, 
  Clock, 
  Scale
} from 'lucide-react';

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
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="client-testimonials">
      {/* 1. Institutional Trust Badges Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/50 shadow-xl relative overflow-hidden">
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

    </section>
  );
}
