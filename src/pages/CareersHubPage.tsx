import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ServiceSEO } from '../components/SEO';
import {
  Briefcase,
  Headphones,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  Building2,
  GraduationCap,
  Sparkles,
  FileText,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Laptop,
  Check,
  ExternalLink,
  DollarSign,
  ChevronDown
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Can fresh graduates apply for these positions?',
    a: 'Yes, absolutely! For both the Accountant and Customer Care Executive positions, highly motivated fresh graduates are strongly encouraged to apply. For Accountants, candidates with BBA/B.Com in Accounting/Finance or prior internship/trainee experience are preferred. For Customer Care Executives, candidates with minimum HSC or Bachelor degrees in any discipline and strong communication skills are welcome.'
  },
  {
    q: 'Can I apply for both Accountant and Customer Care Executive positions?',
    a: 'Yes. If you meet the qualifications for both roles, you may submit separate applications for each position. You will receive an independent Reference ID for each application so you can track your status separately.'
  },
  {
    q: 'Is there any application fee or processing charge?',
    a: 'No. E-Lawyers Legal & Business Consultancy Firm never charges any application fee, registration fee, or security deposit at any stage of the recruitment process. All applications submitted through our official portal are 100% free of charge.'
  },
  {
    q: 'Where is the job location and what are the working hours?',
    a: 'Both positions are full-time, in-person roles based at our central corporate office located at BTI Centara Grand, Panthapath, Green Road, Dhaka, Bangladesh. Standard office hours are Sunday through Thursday, 9:30 AM to 6:30 PM (with Saturday rotas as mutually agreed).'
  },
  {
    q: 'How will I know if my application was successfully received?',
    a: 'Upon submitting your application form online, you will instantly receive a unique Reference ID (e.g., ELAW-ACC-2026-XXXX or ELAW-CCE-2026-XXXX) on the screen. If EmailJS is active, an automated confirmation email is also dispatched. You can check your application status anytime using our self-service status desk on this page.'
  },
  {
    q: 'What is the selection and interview timeline?',
    a: 'Our HR & Management review applications on a rolling basis until October 31, 2026. Shortlisted candidates are invited for an in-person assessment and interview at our Panthapath office within 5 to 7 business days of submission.'
  }
];

export const CareersHubPage: React.FC = () => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<'both' | 'accountant' | 'customercare'>('both');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Status lookup state
  const [refIdInput, setRefIdInput] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    found: boolean;
    referenceId?: string;
    candidateName?: string;
    position?: string;
    department?: string;
    status?: string;
    submittedAt?: string;
    message?: string;
  } | null>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = refIdInput.trim();
    if (!query) return;

    setStatusLoading(true);
    setStatusResult(null);

    try {
      const res = await fetch(`/api/careers/applications?refId=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data && data.success && Array.isArray(data.applications) && data.applications.length > 0) {
        const app = data.applications[0];
        setStatusResult({
          found: true,
          referenceId: app.referenceId,
          candidateName: app.candidateName,
          position: app.position || 'Applicant',
          department: app.department || 'General',
          status: app.status || 'Received',
          submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recently'
        });
      } else {
        // Fallback search by email
        const resEmail = await fetch(`/api/careers/applications?email=${encodeURIComponent(query)}`);
        const dataEmail = await resEmail.json();
        if (dataEmail && dataEmail.success && Array.isArray(dataEmail.applications) && dataEmail.applications.length > 0) {
          const app = dataEmail.applications[0];
          setStatusResult({
            found: true,
            referenceId: app.referenceId,
            candidateName: app.candidateName,
            position: app.position || 'Applicant',
            department: app.department || 'General',
            status: app.status || 'Received',
            submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recently'
          });
        } else {
          setStatusResult({
            found: false,
            message: `No record found with Reference ID or Email "${query}". Please double-check your Reference ID (e.g. ELAW-ACC-... or ELAW-CCE-...).`
          });
        }
      }
    } catch {
      setStatusResult({
        found: false,
        message: 'Unable to reach the recruitment verification server at this time. Please try again shortly.'
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] text-[#243446] font-sans pb-24">
      <ServiceSEO
        title="Careers & Current Openings | E-Lawyers Legal & Business Consultancy Firm"
        description="Join E-Lawyers Legal & Business Consultancy Firm in Panthapath, Dhaka. Explore career opportunities and apply online for Accountant (Accounts Division) and Customer Care Executive (Female). Deadline: Oct 31, 2026."
        canonicalUrl="/Careers"
        serviceType="Job Recruitment & Career Opportunities"
      />

      {/* Hero Header - Light Corporate Theme (Layered in Background) */}
      <section className="bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] text-slate-800 pt-10 pb-28 sm:pb-32 px-4 border-b border-slate-200 relative z-10 overflow-hidden">
        {/* Subtle ultra-light background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top Brand Tagline & Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#167d83]/25 flex items-center justify-center font-black text-[#167d83] text-lg shadow-xs">
                ELA
              </div>
              <div>
                <span className="text-xs font-black tracking-widest text-[#10243a] uppercase block">
                  E-Lawyers Legal &amp; Business Consultancy Firm
                </span>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#167d83]" />
                  Central Careers &amp; Recruitment Portal · Panthapath, Dhaka
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-3.5 py-1.5 rounded-full font-bold shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Recruitment · 4 Total Openings</span>
              </span>
            </div>
          </div>

          {/* Hero Main Copy */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> 2026 Corporate Recruitment Drive
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#10243a] mb-4 leading-[1.15]">
              Advance Your Career at <span className="text-[#167d83]">E-Lawyers</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
              E-Lawyers is a premier corporate legal and business consultancy firm in Dhaka. We are actively hiring dynamic professionals to join our corporate accounts division and client care team. Explore our open positions and submit your application online directly.
            </p>

            {/* Quick 1-Click Action Buttons to Form */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/Careers/accountant?tab=apply"
                className="px-5 py-3.5 bg-[#167d83] hover:bg-[#136a70] text-white font-black rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm border border-teal-600/30"
              >
                <Briefcase className="w-4 h-4 text-emerald-200" />
                <span>Apply as Accountant (২ জন)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/Careers/customer-care?tab=apply"
                className="px-5 py-3.5 bg-white hover:bg-amber-50/70 text-amber-900 font-black rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 text-sm border-2 border-amber-400"
              >
                <Headphones className="w-4 h-4 text-amber-800" />
                <span>Apply as Customer Care (Female - ২ জন)</span>
                <ArrowRight className="w-4 h-4 text-amber-800" />
              </Link>

              <a
                href="#check-status"
                className="px-4 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-[#167d83]" />
                <span>Check Status</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-10 pt-6 pb-2 border-t border-slate-200">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-xs hover:shadow-sm hover:border-slate-300 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-[#167d83]">4</div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">Open Vacancies</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-xs hover:shadow-sm hover:border-slate-300 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-[#10243a]">2</div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">Key Divisions</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-xs hover:shadow-sm hover:border-slate-300 transition-all">
              <div className="text-sm sm:text-base font-extrabold text-[#10243a] mt-1">Panthapath, Dhaka</div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">Central Workplace</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-xs hover:shadow-sm hover:border-slate-300 transition-all">
              <div className="text-sm sm:text-base font-extrabold text-amber-700 mt-1">Oct 31, 2026</div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">Application Deadline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 sm:-mt-10 space-y-12 relative z-20">

        {/* Unified Application Navigator Banner - Moved Forward with Elevated Depth */}
        <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl border-2 border-slate-200/90 p-5 md:p-7 relative z-30 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#167d83] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#167d83]" />
                Central Navigation Hub · Fast Track
              </div>
              <h2 className="text-xl md:text-2xl font-black text-[#10243a] mt-0.5 tracking-tight">
                Current Open Opportunities &amp; Direct Application Forms
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Select your preferred track below to view role requirements or move forward directly to the official 8-step application form.
              </p>
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs self-start md:self-auto">
              <button
                onClick={() => setSelectedRoleTab('both')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRoleTab === 'both'
                    ? 'bg-[#10243a] text-white shadow-sm scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                All Roles (2)
              </button>
              <button
                onClick={() => setSelectedRoleTab('accountant')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRoleTab === 'accountant'
                    ? 'bg-[#167d83] text-white shadow-sm scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Accountant</span>
              </button>
              <button
                onClick={() => setSelectedRoleTab('customercare')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRoleTab === 'customercare'
                    ? 'bg-[#c7a76b] text-[#10243a] shadow-sm scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Customer Care</span>
              </button>
            </div>
          </div>

          {/* Quick Direct Link Row - Forward Progression Cards */}
          <div className="grid sm:grid-cols-2 gap-4 pt-5">
            <Link
              to="/Careers/accountant?tab=apply"
              className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/90 via-teal-50/50 to-white hover:to-teal-50 border-2 border-teal-200/90 hover:border-teal-400 transition-all shadow-xs hover:shadow-md flex items-center justify-between group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#167d83] to-[#0c4e52] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                      Step 1 of 8
                    </span>
                    <span className="text-xs text-teal-900 font-bold uppercase tracking-wider">Fast-Track Form</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#10243a] group-hover:text-[#167d83] mt-0.5">
                    Apply as Accountant (অনলাইন আবেদন)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-teal-700 bg-white/80 px-2.5 py-1.5 rounded-xl border border-teal-200/70 group-hover:bg-[#167d83] group-hover:text-white transition-all">
                <span className="hidden md:inline">Proceed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/Careers/customer-care?tab=apply"
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-white hover:to-amber-50 border-2 border-amber-200/90 hover:border-amber-400 transition-all shadow-xs hover:shadow-md flex items-center justify-between group hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c7a76b] to-[#9e7a33] text-[#10243a] flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5 text-amber-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded">
                      Step 1 of 8
                    </span>
                    <span className="text-xs text-amber-900 font-bold uppercase tracking-wider">Fast-Track Form</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#10243a] group-hover:text-amber-800 mt-0.5">
                    Apply as Customer Care Executive (অনলাইন আবেদন)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-white/80 px-2.5 py-1.5 rounded-xl border border-amber-200/70 group-hover:bg-[#c7a76b] group-hover:text-[#10243a] transition-all">
                <span className="hidden md:inline">Proceed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Detailed Open Positions Showcase - Responsive Grid Layout */}
        <div className={`grid gap-8 items-stretch ${
          selectedRoleTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto w-full'
        }`}>
          {/* Card 1: Accountant */}
          {(selectedRoleTab === 'both' || selectedRoleTab === 'accountant') && (
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#167d83] transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div>
                {/* Header Section with Deep Navy-Teal Gradient & Gold Trim */}
                <div className="bg-gradient-to-br from-[#091b2c] via-[#102d45] to-[#167d83] p-6 sm:p-7 text-white border-b-4 border-[#c7a76b] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-teal-400/15 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>
                  <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  {/* Top Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#ddc38f] bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xs">
                      <Briefcase className="w-3.5 h-3.5 text-[#ddc38f]" />
                      Accounts Division (B2B Services)
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-400/50 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      ২ জন · Full-Time · Urgent Hiring
                    </span>
                  </div>

                  {/* Job Title & Nature */}
                  <div className="space-y-1.5 relative z-10">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Accountant
                      </h3>
                      <span className="text-xs sm:text-sm font-bold text-[#ddc38f] bg-black/30 border border-[#c7a76b]/40 px-3 py-1 rounded-lg backdrop-blur-xs">
                        হিসাবরক্ষক
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                      Voucher Posting, Double-Entry General Ledger, Bank Reconciliation &amp; Statutory Tax/VAT Compliance (ITA 2023)
                    </p>
                  </div>
                </div>

                {/* 4-Tile Quick Specs Matrix */}
                <div className="grid grid-cols-2 gap-2.5 p-5 bg-slate-50/90 border-b border-slate-200">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Education</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#10243a] leading-tight">
                      BBA / B.Com / M.Com
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Accounting or Finance Major</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <Users className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Experience</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-emerald-700 leading-tight">
                      Freshers Welcome (0–2 Yrs)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Internship / trainee exp. valued</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Remuneration</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-emerald-700 leading-tight">
                      BDT 25,000 – 30,000
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">+ 2 Festival Bonuses &amp; Medical</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Workplace</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#10243a] leading-tight">
                      Panthapath, Dhaka
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">In-Person Corporate Office</div>
                  </div>
                </div>

                {/* Card Body & Responsibilities */}
                <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
                  <p className="text-slate-600 leading-relaxed">
                    E-Lawyers is expanding its professional Accounts Division to handle corporate bookkeeping, double-entry voucher posting, monthly bank reconciliations, audit trail preparations, and statutory Tax/VAT compliance under the Income Tax Act 2023.
                  </p>

                  {/* Key Tasks List */}
                  <div className="space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                    <div className="font-extrabold text-[#10243a] text-xs uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Key Daily Responsibilities:</span>
                      <span className="text-[10px] text-teal-800 font-bold bg-teal-100 px-2 py-0.5 rounded">Core Tasks</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Daily voucher posting, journal entry, debit/credit verification, and general ledger maintenance in accounting software</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Monthly bank reconciliations, accounts payable/receivable ledgers, and cash flow statement preparation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>TDS &amp; VDS withholding calculation schedules and VAT-9.1 return working paper documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Assisting senior advocates and tax advisors with year-end trial balance and statutory corporate tax return filings</span>
                      </li>
                    </ul>
                  </div>

                  {/* Essential Tool Badges */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">Required Tools &amp; Competencies:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['MS Excel (VLOOKUP & Pivot)', 'Tally Prime / QuickBooks', 'Double-Entry Bookkeeping', 'TDS / VDS Compliance', 'Income Tax Act 2023', 'Bank Reconciliation', 'Trial Balance'].map((tool, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 px-2.5 py-1 rounded-md font-medium transition-colors">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Official Role Recruitment Announcement Card Preview (Symmetrical with Card 2) */}
                  <div className="pt-1">
                    <Link
                      to="/Careers/accountant"
                      className="block relative rounded-2xl overflow-hidden border-2 border-teal-600/30 hover:border-teal-500 shadow-sm hover:shadow-lg transition-all group/banner bg-gradient-to-br from-[#0c1f33] via-[#112d47] to-[#15465a] p-5 text-white"
                      title="View Official Accountant Recruitment Notice &amp; Syllabus"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#ddc38f] font-black text-xs shadow-inner">
                            ELA
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-teal-300">Official Notice</div>
                            <div className="text-xs font-extrabold text-white">E-Lawyers Legal &amp; Business Consultancy</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-black/40 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                          Ref: EL/HR-ACC/2026
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                          <span>Accountant (হিসাবরক্ষক)</span>
                          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-400/30">
                            ২ টি পদ
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          BBA/B.Com Major in Accounting/Finance · BDT 25,000–30,000 · Panthapath Office
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200 bg-white/5 border border-white/10 rounded-xl p-2.5 mb-2">
                        <div><strong className="text-white">Status:</strong> Full-Time (In-Person)</div>
                        <div><strong className="text-white">Mentorship:</strong> ITA 2023 CA/Advocate</div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs font-bold text-teal-200 group-hover/banner:text-white transition-colors">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          View Complete Job Circular, Syllabus &amp; Exam Scheme
                        </span>
                        <ChevronRight className="w-4 h-4 text-teal-300 group-hover/banner:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  {/* Balanced Mentorship Box for Accountant */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50/90 via-slate-50 to-emerald-50/90 border border-teal-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#167d83] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        ITA
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#10243a]">Structured Professional Mentorship</div>
                        <div className="text-[11px] text-slate-600">Direct guidance by Senior Advocates &amp; Chartered Accountants</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-white px-2.5 py-1 rounded-md border border-teal-200 whitespace-nowrap shadow-2xs">
                      2 Openings
                    </span>
                  </div>
                </div>
              </div>

              {/* High-Impact Call-To-Action (CTA) Dock */}
              <div className="p-6 bg-slate-50/90 border-t border-slate-200 space-y-3 mt-auto">
                <Link
                  to="/Careers/accountant?tab=apply"
                  className="w-full py-4 px-5 bg-gradient-to-r from-[#167d83] via-[#126b70] to-[#0c4e52] hover:from-[#198d94] hover:to-[#106267] text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-[1.01] border border-teal-300/30"
                >
                  <FileText className="w-5 h-5 text-emerald-300" />
                  <span>Apply Online — Accountant Form (অনলাইন আবেদন)</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    to="/Careers/accountant"
                    className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#10243a] bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-2xs"
                  >
                    View Job Circular (বিজ্ঞপ্তি ও সিলেবাস)
                  </Link>
                  <span className="text-[11px] text-slate-500 font-semibold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap">
                    Deadline: Oct 31, 2026
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Customer Care Executive */}
          {(selectedRoleTab === 'both' || selectedRoleTab === 'customercare') && (
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#c7a76b] transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div>
                {/* Header Section with Deep Navy-Amber Gradient & Gold Trim */}
                <div className="bg-gradient-to-br from-[#122438] via-[#1a3854] to-[#1a6670] p-6 sm:p-7 text-white border-b-4 border-amber-400 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
                  
                  {/* Top Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      <Headphones className="w-3.5 h-3.5 text-amber-300" />
                      Customer Care / Call Center Desk
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-400/40 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      ২ জন (Female) · Full-Time
                    </span>
                  </div>

                  {/* Job Title & Nature */}
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-between">
                      <span>Customer Care Executive</span>
                      <span className="text-xs sm:text-sm font-semibold text-amber-300 bg-black/20 px-2.5 py-1 rounded-lg">
                        Female
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      Client Communications, Inbound Support, Scheduling &amp; WhatsApp Desk
                    </p>
                  </div>
                </div>

                {/* 4-Tile Quick Specs Matrix */}
                <div className="grid grid-cols-2 gap-2.5 p-5 bg-slate-50 border-b border-slate-200">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Education</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#10243a] leading-tight">
                      HSC / Graduate
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Any academic discipline</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <Users className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Experience</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-emerald-700 leading-tight">
                      Freshers Welcome
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Call center exp. preferred</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Remuneration</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-emerald-700 leading-tight">
                      Negotiable (Competitive)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">+ 2 Festival Bonuses</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#167d83]" />
                      <span>Workplace</span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#10243a] leading-tight">
                      Panthapath, Dhaka
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Safe Corporate Office</div>
                  </div>
                </div>

                {/* Card Body & Responsibilities */}
                <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
                  <p className="text-slate-600 leading-relaxed">
                    E-Lawyers is seeking 2 motivated Female Customer Care Executives to manage inbound client telephone calls, coordinate appointment slots with senior advocates and tax advisors, and maintain proactive communication on digital channels.
                  </p>

                  {/* Key Tasks List */}
                  <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                    <div className="font-extrabold text-[#10243a] text-xs uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Key Daily Responsibilities:</span>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">Client Care</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Receiving inbound inquiries with polite telephone etiquette, active listening, and proper guidance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Scheduling client consultations for advocates, company law attorneys, and tax specialists</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Managing official WhatsApp Business inquiries, caller logs, and CRM record accuracy</span>
                      </li>
                    </ul>
                  </div>

                  {/* Essential Tool Badges */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">Required Tools &amp; Competencies:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Fluent Spoken Bengali', 'Conversational English', 'Telephone Etiquette', 'WhatsApp Business CRM', 'Active Listening', 'Client Appointment Scheduling'].map((tool, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 px-2.5 py-1 rounded-md font-medium transition-colors">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Official Role Infographic Picture Preview */}
                  <div className="pt-1">
                    <Link
                      to="/Careers/customer-care"
                      className="block relative rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all group/banner"
                      title="View Official Customer Care Recruitment Banner"
                    >
                      <img
                        src="/customer-care-executive-recruitment.png"
                        alt="Customer Care Executive (Female) Recruitment Notice - E-Lawyers Legal & Business Consultancy Firm"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover group-hover/banner:scale-[1.015] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          View Full Announcement &amp; Circular
                        </span>
                        <span className="text-xs bg-[#c7a76b] text-[#10243a] px-2.5 py-1 rounded-lg font-black shadow-sm">
                          Read Details
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* High-Impact Call-To-Action (CTA) Dock */}
              <div className="p-6 bg-slate-50/80 border-t border-slate-200 space-y-3 mt-auto">
                <Link
                  to="/Careers/customer-care?tab=apply"
                  className="w-full py-4 px-5 bg-gradient-to-r from-[#c7a76b] via-[#b89553] to-[#a07c39] hover:from-[#d5b67b] hover:to-[#b89553] text-[#10243a] font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-[1.01] border border-amber-300/40"
                >
                  <FileText className="w-5 h-5 text-[#10243a]" />
                  <span>Apply Online — Customer Care Form (অনলাইন আবেদন)</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    to="/Careers/customer-care"
                    className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#10243a] bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-2xs"
                  >
                    View Job Circular (সম্পূর্ণ বিজ্ঞপ্তি)
                  </Link>
                  <span className="text-[11px] text-slate-500 font-semibold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap">
                    Deadline: Oct 31, 2026
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Detailed Role Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#10243a]">Position Overview &amp; Side-by-Side Comparison</h3>
              <p className="text-xs text-slate-500 mt-0.5">Compare key requirements, eligibility, responsibilities, and application paths</p>
            </div>
            <div className="text-xs text-slate-500 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Panthapath, Dhaka Office
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-[#10243a] text-white">
                  <th className="py-3.5 px-4 font-bold border-r border-slate-700 w-1/4">Criteria / Feature</th>
                  <th className="py-3.5 px-4 font-bold border-r border-slate-700 w-3/8 text-amber-300">
                    Accountant (Accounts Division)
                  </th>
                  <th className="py-3.5 px-4 font-bold w-3/8 text-emerald-300">
                    Customer Care Executive (Female)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Department</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">Accounts &amp; Tax Compliance</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">Customer Care / Call Center Desk</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Number of Vacancies</td>
                  <td className="py-3 px-4 font-bold text-[#10243a]">২ জন (Both Male &amp; Female)</td>
                  <td className="py-3 px-4 font-bold text-[#10243a]">২ জন (Female Candidates Only)</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Educational Qualification</td>
                  <td className="py-3 px-4 text-slate-800">
                    BBA / B.Com / M.Com in Accounting, Finance or Business Studies
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    Minimum HSC or Bachelor Degree in any discipline (Honours/Pass/BBA)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Experience Level</td>
                  <td className="py-3 px-4 text-slate-800">
                    Fresh graduates warmly welcomed; internship or 1-2 years experience is a plus
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    Freshers encouraged; previous call center or customer support experience prioritized
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Core Competencies</td>
                  <td className="py-3 px-4 text-slate-800">
                    Bookkeeping, Excel, TDS/VDS deductions, bank reconciliations, attention to detail
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    Fluent spoken Bengali, polite phone etiquette, patience, active listening, WhatsApp desk
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Salary &amp; Benefits</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    BDT 25,000 – 30,000 / month (Negotiable) + 2 Festival Bonuses
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    Negotiable based on skills + 2 Festival Bonuses + Performance rewards
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Location</td>
                  <td className="py-3 px-4 text-slate-800">Panthapath, Dhaka (On-site)</td>
                  <td className="py-3 px-4 text-slate-800">Panthapath, Dhaka (On-site)</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Application Deadline</td>
                  <td className="py-3 px-4 font-bold text-amber-800">October 31, 2026</td>
                  <td className="py-3 px-4 font-bold text-amber-800">October 31, 2026</td>
                </tr>
                <tr className="bg-slate-50/90">
                  <td className="py-3.5 px-4 font-bold text-slate-700">Online Application Form</td>
                  <td className="py-3.5 px-4">
                    <Link
                      to="/Careers/accountant?tab=apply"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#167d83] text-white text-xs font-bold hover:bg-[#106267] transition-colors shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-200" />
                      <span>Open Accountant Form</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      to="/Careers/customer-care?tab=apply"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c7a76b] text-[#10243a] text-xs font-black hover:bg-[#b8975a] transition-colors shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#10243a]" />
                      <span>Open Customer Care Form</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4-Step Application & Selection Flow */}
        <div className="bg-gradient-to-br from-[#10243a] via-[#142e47] to-[#16445a] text-white rounded-2xl p-6 md:p-8 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-widest text-[#ddc38f] uppercase">Structured Selection Process</span>
            <h3 className="text-2xl font-black text-white mt-1">How We Review &amp; Select Candidates</h3>
            <p className="text-xs text-slate-300 mt-1">A transparent, merit-based 4-stage recruitment cycle</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ddc38f] text-[#10243a] text-xs font-extrabold flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                1
              </div>
              <h5 className="font-bold text-sm text-white mb-1">Fill Application Form</h5>
              <p className="text-xs text-slate-300">
                Choose either role, complete our comprehensive online application, and upload your CV (PDF format).
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ddc38f] text-[#10243a] text-xs font-extrabold flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                2
              </div>
              <h5 className="font-bold text-sm text-white mb-1">Get Reference ID</h5>
              <p className="text-xs text-slate-300">
                You receive an official tracking ID (e.g. ELAW-ACC-... or ELAW-CCE-...) for self-service verification.
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ddc38f] text-[#10243a] text-xs font-extrabold flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                3
              </div>
              <h5 className="font-bold text-sm text-white mb-1">Office Assessment</h5>
              <p className="text-xs text-slate-300">
                Shortlisted candidates are invited to our Panthapath office for in-person discussion and skills review.
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ddc38f] text-[#10243a] text-xs font-extrabold flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                4
              </div>
              <h5 className="font-bold text-sm text-white mb-1">Offer &amp; Onboarding</h5>
              <p className="text-xs text-slate-300">
                Selected candidates receive an appointment letter and embark on structured mentorship with senior counsel.
              </p>
            </div>
          </div>
        </div>

        {/* Live Application Status Checker */}
        <div id="check-status" className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#167d83] uppercase">
                Applicant Self-Service Desk
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#10243a] mt-0.5">
                Check Your Application Status (আবেদনের অবস্থা যাচাই)
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Already submitted an application? Enter your unique Reference ID or candidate email to check recruitment progress.
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#167d83] border border-teal-200 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handleCheckStatus} className="max-w-xl flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={refIdInput}
              onChange={e => setRefIdInput(e.target.value)}
              placeholder="e.g. ELAW-ACC-2026-0001 or candidate email"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#167d83]"
              required
            />
            <button
              type="submit"
              disabled={statusLoading}
              className="px-6 py-2.5 bg-[#10243a] hover:bg-[#193650] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {statusLoading ? 'Verifying...' : 'Check Status'}
            </button>
          </form>

          {/* Status Result Card */}
          {statusResult && (
            <div className="mt-6 animate-fade-in">
              {statusResult.found ? (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm">Application Found in E-Lawyers Recruitment Registry</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div><strong>Reference ID:</strong> <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{statusResult.referenceId}</span></div>
                    <div><strong>Candidate Name:</strong> {statusResult.candidateName}</div>
                    <div><strong>Position:</strong> {statusResult.position} ({statusResult.department})</div>
                    <div><strong>Current Status:</strong> <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">{statusResult.status}</span></div>
                    <div><strong>Submission Date:</strong> {statusResult.submittedAt}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>{statusResult.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Why Build Your Career at E-Lawyers? */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-wider text-[#c7a76b] uppercase">Firm Culture &amp; Benefits</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#10243a] mt-1">
              Why Join E-Lawyers Legal &amp; Business Consultancy Firm?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-2">
              We cultivate a culture of excellence, professional dignity, mentorship, and continuous learning.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-[#167d83] flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#10243a] mb-1">Real Corporate Exposure</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work directly with corporate businesses, SME accounts, VAT audits, and high-value legal advisories, gaining real-world skills.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#c7a76b] flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#10243a] mb-1">Fresh Graduate Friendly</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We nurture emerging talent. Senior chartered accountants and advocates provide hands-on mentorship from day one.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#10243a] mb-1">Safe &amp; Inclusive Workplace</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We maintain an exemplary, dignified, and women-friendly workplace environment in our modern Panthapath commercial corporate facility.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#10243a] mb-1">Festival Bonuses &amp; Incentives</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Competitive monthly compensation, two annual festival bonuses, and timely recognition incentives for high performance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#10243a] mb-1">Prime Dhaka Location</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centrally located at BTI Centara Grand, Panthapath / Green Road, easily accessible from Dhanmondi, Farmgate, Tejgaon, and Karwan Bazar.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#10243a] mb-1">Structured Career Progression</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear promotion tracks into senior accounting roles, corporate consulting, client relationship management, and team lead positions.
              </p>
            </div>
          </div>
        </div>

        {/* Recruitment FAQ Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#167d83] uppercase tracking-wider">Candidate Support</span>
            <h3 className="text-2xl font-black text-[#10243a] mt-0.5">Frequently Asked Questions</h3>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Find quick answers to common questions regarding our hiring procedure, qualifications, and workplace.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                  >
                    <span className="text-sm font-bold text-[#10243a]">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#167d83]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-2 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Helpdesk & Contact Footer Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#c7a76b] uppercase tracking-wider">Recruitment Helpdesk</span>
            <h4 className="text-xl font-bold text-[#10243a] mt-0.5">Need Help with Your Application?</h4>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl">
              For inquiries regarding circular details, submission queries, or interview status, contact our recruitment team:
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#167d83]" /> career@elawyersbd.com
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#167d83]" /> info@elawyersbd.com
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#167d83]" /> +880 1313-583838
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#10243a] font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Office Map</span>
            </Link>
            <a
              href="#check-status"
              className="px-5 py-2.5 rounded-xl bg-[#10243a] hover:bg-[#193650] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#ddc38f]" />
              <span>Check Status</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareersHubPage;
