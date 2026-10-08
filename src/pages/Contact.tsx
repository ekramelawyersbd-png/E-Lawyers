import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  Copy, 
  Check, 
  Globe, 
  Briefcase,
  Share2,
  FileText,
  Home,
  ChevronRight,
  Sparkles,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ContactFaq } from '../components/ContactFaq';
import { OfficeLocationMap } from '../components/OfficeLocationMap';
import { FloatingLiveChat } from '../components/FloatingLiveChat';
import { ContactTestimonialsCarousel } from '../components/ContactTestimonialsCarousel';

export function Contact() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Corporate Law & RJSC Compliance');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const primaryPhone = '+880 1335-230170';
  const rawTelNumber = '+8801335230170';
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=BTI+Centara+Grand+144+Green+Road+Panthapath+Dhaka+1205';

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawTelNumber);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  const handleCopyEmail = (address: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopiedEmail(address);
      setTimeout(() => setCopiedEmail(null), 2200);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* 1. Full-Screen Edge-to-Edge Hero Section (Matching Community Hero) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40">
        {/* Subtle decorative mesh background and ambient orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.25),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto mb-8 relative z-10">
          <nav className="flex items-center text-xs sm:text-sm font-medium text-emerald-300/80 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="flex items-center text-emerald-300 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-500 shrink-0" />
            <span className="text-white font-semibold">Contact Us</span>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Eyebrow Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-semibold mb-2 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Integrated Advisory Ecosystem</span>
          </div>

          {/* Hero Main Heading & Dual Identity */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.2] space-y-2">
            <span className="block text-xl sm:text-2xl lg:text-3xl font-bold tracking-normal text-slate-300/90">
              Contact Us
            </span>
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-1">
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm tracking-tight font-black">
                ACCOUNTICCA
              </span>
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 font-light text-base sm:text-xl shadow-inner select-none">
                ×
              </span>
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-sm tracking-tight font-black">
                E-LAWYERS
              </span>
            </span>
          </h1>

          {/* Core Taglines */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              Complete Business Support. One Ecosystem.
            </h2>
            <p className="text-base sm:text-lg italic font-medium text-emerald-300/90">
              Where Business Strategy Meets Legal Excellence.
            </p>
          </div>

          {/* Value Proposition Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            Whether you require corporate legal counsel, tax &amp; VAT optimization, statutory audit, or end-to-end business consultancy, our integrated team provides unified, cross-disciplinary advisory under one roof.
          </p>

          {/* Hero Quick Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#inquiry-form-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 group"
            >
              <Calendar className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Submit an Inquiry</span>
              <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={`tel:${rawTelNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700/80 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 group"
            >
              <Phone className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>Call Our Direct Desk</span>
              <span className="text-xs text-emerald-400 font-mono font-medium hidden md:inline">
                ({primaryPhone})
              </span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 border-t border-emerald-900/40 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Dual-Firm Chartered Advisory
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Direct Senior Partner Oversight
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Guaranteed 24-Hour Inquiry Turnaround
            </span>
          </div>
        </div>
      </section>

      {/* Direct Channels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Immediate Contacts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Direct Communication Channels
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Reach our advisory departments directly by telephone, verified email desks, or in-person at our Panthapath executive suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Head Office */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="inline-block text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                Head Office
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                ACCOUNTICCA × E-LAWYERS
              </h3>
              <address className="not-italic text-sm text-slate-600 leading-relaxed space-y-1 mb-4">
                <p className="font-semibold text-slate-800">Suite G-5, BTI Centara Grand</p>
                <p>144–144/1 Green Road, Panthapath</p>
                <p>Dhaka–1205, Bangladesh</p>
              </address>
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                Conveniently located near Panthapath junction, accessible with dedicated client parking.
              </p>
            </div>
            
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 px-4 py-2.5 rounded-xl transition-colors group mt-2"
            >
              <span>Get Directions via Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Card 2: Telephone & Hunting Lines */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-5">
                <Phone className="w-6 h-6" />
              </div>
              <div className="inline-block text-[11px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md mb-2">
                Telephone &amp; Hunting Lines
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Direct Telephony Desk
              </h3>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Primary Hunting Line (Click to Call):
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${rawTelNumber}`}
                      className="text-base sm:text-lg font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline tracking-tight"
                    >
                      {primaryPhone}
                    </a>
                    <button
                      onClick={handleCopyPhone}
                      title="Copy phone number"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">
                    PABX / Extension Range:
                  </p>
                  <p className="font-mono text-slate-700">
                    +880 1335-230170 through 230181
                  </p>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    12 dedicated lines routing to corporate, tax, and audit secretariats.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Available Sunday to Thursday for corporate consultations &amp; inquiries.</span>
              </div>
            </div>

            <a
              href={`tel:${rawTelNumber}`}
              className="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition-colors shadow-xs group mt-2"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Place Direct Call Now</span>
            </a>
          </div>

          {/* Card 3: Email Advisory Desks */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <div className="inline-block text-[11px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md mb-2">
                Electronic Mail Desks
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Email Advisory Desks
              </h3>

              <div className="space-y-3 mb-4">
                {/* Accounticca Desk */}
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                    ACCOUNTICCA Desk
                  </span>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Finance, Tax, VAT, Audit &amp; Advisory:
                  </p>
                  <div className="flex items-center justify-between">
                    <a
                      href="mailto:info@accounticca.com"
                      className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      info@accounticca.com
                    </a>
                    <button
                      onClick={() => handleCopyEmail('info@accounticca.com')}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Copy email"
                    >
                      {copiedEmail === 'info@accounticca.com' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* E-Lawyers Desk */}
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                    E-LAWYERS Desk
                  </span>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Corporate Law, Litigation &amp; Compliance:
                  </p>
                  <div className="flex items-center justify-between">
                    <a
                      href="mailto:info@elawyersbd.com"
                      className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      info@elawyersbd.com
                    </a>
                    <button
                      onClick={() => handleCopyEmail('info@elawyersbd.com')}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Copy email"
                    >
                      {copiedEmail === 'info@elawyersbd.com' ? (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>All client communications protected under strict confidentiality covenants.</span>
              </p>
            </div>

            <a
              href="mailto:info@accounticca.com?cc=info@elawyersbd.com&subject=Joint%20Ecosystem%20Consultation%20Inquiry"
              className="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-4 py-2.5 rounded-xl transition-colors group mt-2"
            >
              <Mail className="w-3.5 h-3.5 text-slate-600 group-hover:scale-110 transition-transform" />
              <span>Compose Joint Brief</span>
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Head Office Map & Navigation Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <OfficeLocationMap primaryPhone={primaryPhone} rawTelNumber={rawTelNumber} />
      </section>

      {/* Explore Our Ecosystem Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Integrated Digital Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Our Ecosystem Portals
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Access the specialized platforms, appointment calendars, and institutional knowledge engines of both practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ecosystem Card 1: ACCOUNTICCA */}
            <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                      A
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">ACCOUNTICCA</h3>
                      <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                        Business &amp; Financial Practice
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Finance &amp; Tax
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Core Focus Areas:
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    Accounting • Tax &amp; VAT • Statutory Audit • Corporate Finance • Fractional CFO
                  </p>
                </div>

                <div className="space-y-2.5 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Official Portals &amp; Systems:
                  </h4>
                  
                  <a
                    href="https://accounticca.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                        accounticca.com
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 group-hover:text-emerald-700">
                      Primary Portal <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>

                  <a
                    href="https://blog.accounticca.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                        blog.accounticca.com
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 group-hover:text-emerald-700">
                      Advisory Blog <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs text-slate-500">
                <span>Partner Desk: Chartered &amp; Tax Advisors</span>
                <span className="text-emerald-700 font-bold">Online Intake Active</span>
              </div>
            </div>

            {/* Ecosystem Card 2: E-LAWYERS */}
            <div className="rounded-2xl border-2 border-teal-100 bg-gradient-to-b from-teal-50/40 to-white p-6 sm:p-8 flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-teal-500/30 p-1 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                      <img 
                        src="/elawyers-emblem.png" 
                        alt="E-LAWYERS" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">E-LAWYERS</h3>
                      <p className="text-xs text-teal-800 font-semibold uppercase tracking-wider">
                        Legal &amp; Compliance Practice
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                    Corporate &amp; Law
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Core Focus Areas:
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    Corporate Law • Litigation • Compliance • Regulatory Advisory • RJSC &amp; BIDA
                  </p>
                </div>

                <div className="space-y-2.5 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Official Portals &amp; Systems:
                  </h4>
                  
                  <a
                    href="https://elawyersbd.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-teal-700" />
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-700">
                        elawyersbd.com
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 group-hover:text-teal-700">
                      Legal Firm Portal <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-slate-400" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-600">
                        High Court &amp; RJSC Chambers
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">Dhaka Jurisdiction</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-xs text-slate-500">
                <span>Partner Desk: Barristers &amp; Corporate Advocates</span>
                <span className="text-teal-700 font-bold">Chambers Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standardized Social Networks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>Verified Ecosystem Handles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Connect Across Our Networks
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Follow our official media channels for timely statutory alerts, NBR circular breakdowns, High Court precedents, and executive commentary.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Accounticca Social Hub */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-800/60 to-slate-900/90 border border-emerald-500/30 shadow-xl space-y-5 relative overflow-hidden group">
              {/* Subtle ambient corner glow */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-300" />

              {/* Official Brand Header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  {/* Official Emblem */}
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-900 p-0.5 shadow-md shadow-emerald-950/60 shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-slate-900/95 flex items-center justify-center p-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-emerald-500/15" />
                      <div className="relative z-10 w-full h-full flex items-center justify-center text-emerald-400 font-black text-xl tracking-tight">
                        A
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white tracking-wide">
                        ACCOUNTICCA
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/80 font-medium">
                      Chartered &amp; Financial Practice
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    @accounticca
                  </span>
                </div>
              </div>

              {/* Official Social Links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 hover:bg-[#0A66C2] border border-slate-700/80 hover:border-[#0A66C2] transition-all group text-slate-200 hover:text-white"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:text-white shrink-0 transition-colors" />
                  <span className="text-xs font-bold">LinkedIn</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 hover:bg-[#1877F2] border border-slate-700/80 hover:border-[#1877F2] transition-all group text-slate-200 hover:text-white"
                >
                  <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white shrink-0 transition-colors" />
                  <span className="text-xs font-bold">Facebook</span>
                </a>

                {/* X */}
                <a
                  href="https://x.com/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 hover:bg-black border border-slate-700/80 hover:border-slate-500 transition-all group text-slate-200 hover:text-white"
                >
                  <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-white fill-current shrink-0 transition-colors" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-xs font-bold">X</span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 hover:bg-[#FF0000] border border-slate-700/80 hover:border-[#FF0000] transition-all group text-slate-200 hover:text-white"
                >
                  <Youtube className="w-4 h-4 text-[#FF0000] group-hover:text-white shrink-0 transition-colors" />
                  <span className="text-xs font-bold">YouTube</span>
                </a>
              </div>
            </div>

            {/* E-Lawyers Social Hub */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-800/60 to-slate-900/90 border border-teal-500/30 shadow-xl space-y-5 relative overflow-hidden group">
              {/* Subtle ambient corner glow */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/20 transition-all duration-300" />

              {/* Official Brand Header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  {/* Official Emblem */}
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-600 to-slate-900 p-0.5 shadow-md shadow-teal-950/60 shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-slate-900/95 flex items-center justify-center p-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-teal-500/15" />
                      <div className="relative z-10 w-full h-full flex items-center justify-center text-teal-400 font-black text-xl tracking-tight">
                        E
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white tracking-wide">
                        E-LAWYERS
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 border border-teal-400/40 text-teal-300">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" />
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-teal-300/80 font-medium">
                      Corporate Law &amp; Litigation Chambers
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono text-teal-300 font-bold bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-500/30">
                    @elawyerssbd
                  </span>
                </div>
              </div>

              {/* Official Social Links with Real Brand Logos */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 relative z-10">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/elawyersbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/90 hover:bg-[#0A66C2] border border-slate-700/80 hover:border-[#0A66C2] transition-all duration-200 group text-center shadow-xs hover:shadow-xl hover:shadow-[#0A66C2]/20 hover:-translate-y-1 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-2 right-2 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1.5 transition-colors">
                    <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">LinkedIn</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-blue-100 font-mono mt-0.5">/company</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/elawyersbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/90 hover:bg-[#1877F2] border border-slate-700/80 hover:border-[#1877F2] transition-all duration-200 group text-center shadow-xs hover:shadow-xl hover:shadow-[#1877F2]/20 hover:-translate-y-1 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-2 right-2 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1.5 transition-colors">
                    <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facebook</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-blue-100 font-mono mt-0.5">/elawyersbd</span>
                </a>

                {/* X */}
                <a
                  href="https://x.com/elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/90 hover:bg-black border border-slate-700/80 hover:border-slate-500 transition-all duration-200 group text-center shadow-xs hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-2 right-2 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1.5 transition-colors">
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-white fill-current transition-colors" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">X</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-slate-300 font-mono mt-0.5">@elawyerssbd</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/90 hover:bg-[#E1306C] border border-slate-700/80 hover:border-[#E1306C] transition-all duration-200 group text-center shadow-xs hover:shadow-xl hover:shadow-[#E1306C]/20 hover:-translate-y-1 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-2 right-2 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1.5 transition-colors">
                    <Instagram className="w-4 h-4 text-[#E1306C] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Instagram</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-pink-100 font-mono mt-0.5">@elawyerssbd</span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/90 hover:bg-[#FF0000] border border-slate-700/80 hover:border-[#FF0000] transition-all duration-200 group text-center shadow-xs hover:shadow-xl hover:shadow-[#FF0000]/20 hover:-translate-y-1 col-span-2 sm:col-span-1 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-2 right-2 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1.5 transition-colors">
                    <Youtube className="w-4 h-4 text-[#FF0000] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">YouTube</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-red-100 font-mono mt-0.5">@elawyerssbd</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Client Testimonials & Institutional Trust Badges Carousel */}
      <ContactTestimonialsCarousel />

      {/* Main Dual Columns: Inquiry Form & Practice Capabilities */}
      <section id="inquiry-form-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Submit an Executive Inquiry
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Senior Advisory Routing
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Complete your brief below. Our senior advisory leads review every corporate inquiry and respond within 2 to 4 business hours.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Inquiry Received Successfully</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{firstName} {lastName}</strong>. Your matter brief regarding <strong>{service}</strong> has been assigned to our senior advisory desk. We will reach out to you at <strong>{email}</strong> or <strong>{phone}</strong> shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFirstName('');
                      setLastName('');
                      setEmail('');
                      setPhone('');
                      setCompanyName('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="e.g. Mahfuz"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="e.g. Rahman"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                    placeholder="+880 1712-XXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company / Entity Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    placeholder="Company or Venture Ltd."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Practice Service Area *
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="Corporate Law & RJSC Compliance">Corporate Law &amp; RJSC Compliance (E-Lawyers)</option>
                    <option value="Corporate Tax, VAT & Statutory Audit">Corporate Tax, VAT &amp; Statutory Audit (Accounticca)</option>
                    <option value="Fractional CFO & Financial Modeling">Fractional CFO &amp; Financial Modeling (Accounticca)</option>
                    <option value="BIDA Approvals & Foreign Direct Investment">BIDA Approvals &amp; FDI Services (E-Lawyers)</option>
                    <option value="Commercial Contracts & IP Protection">Commercial Contracts &amp; IP Protection (E-Lawyers)</option>
                    <option value="Business Process Optimization & Automation">Business Process Optimization &amp; Automation (Accounticca)</option>
                    <option value="Integrated Joint Ecosystem Consultation">Integrated Joint Ecosystem Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Matter Description / Legal Brief *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 resize-none leading-relaxed"
                  placeholder="Outline your requirements (e.g. corporate structuring, tax notice defense, contract review, or audit planning)..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6 py-4 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer group"
              >
                <span>Submit Inquiry to Advisory Desk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 flex-wrap gap-2">
                <span>Need immediate telephone assistance?</span>
                <a
                  href={`tel:${rawTelNumber}`}
                  className="font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
                >
                  <span>Call Direct Desk: {primaryPhone}</span>
                </a>
              </div>
            </form>
            )}
          </div>

          {/* Practice Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Practice Highlights */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Why Dual-Firm Advisory?</h3>
                  <p className="text-xs text-slate-400">One Retainer. Zero Disconnect.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Synchronized Tax &amp; Legal Stance
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Contractual provisions drafted with direct respect for withholding tax (TDS), VAT compliance, and allowable expense deductions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-teal-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Fractional CFO + Corporate Secretarial
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Statutory filings at RJSC aligned seamlessly with multi-year financial forecasts, cap tables, and investor reporting.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    BIDA &amp; FDI Foreign Investor Desks
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Turnkey inward investment facilitation, outward dividend remittance, and expatriate work-permit processing.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Chambers: Panthapath, Dhaka</span>
                <span className="text-emerald-400 font-bold">Bangladeshi Jurisdictions</span>
              </div>
            </div>

            {/* Direct Dial Banner */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-emerald-700/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest block mb-1">
                  Need Immediate Assistance?
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                  Speak to Our Direct Desk
                </h4>
                <p className="text-xs text-emerald-100">
                  Direct hunting line +880 1335-230170 (Lines 70–81)
                </p>
              </div>

              <a
                href={`tel:${rawTelNumber}`}
                className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md"
                aria-label="Call direct hunting line"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Service FAQ Accordion Section */}
      <ContactFaq />

      {/* Closing Value Prompt (Action Step: Friction-Reducing Closing CTA instead of repetition) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/60 p-8 sm:p-12 text-center text-white shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Ready to elevate your business operations?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Schedule an introductory consultation with our senior partners to discuss your legal, fiscal, and corporate objectives. Our advisory desks guarantee prompt review and dedicated partner oversight.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#inquiry-form-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all duration-200 group"
              >
                <span>Schedule Your Consultation Today</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`tel:${rawTelNumber}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-sm px-6 py-4 rounded-xl border border-slate-700 transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call +880 1335-230170</span>
              </a>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span>✓ Guaranteed Response Window</span>
              <span>✓ Confidential Briefings</span>
              <span>✓ Partner-Level Consultation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Real-Time Business Support Live Chat Widget */}
      <FloatingLiveChat />
    </div>
  );
}
