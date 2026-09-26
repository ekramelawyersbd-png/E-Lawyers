import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Building2,
  Sparkles
} from 'lucide-react';
import { APPOINTMENT_BASE_URL } from '../utils/appointmentRedirect';

export function ContactELawyers() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=BTI+Centara+Grand+144+Green+Road+Panthapath+Dhaka+1205';

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('+8801335230170');
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleCopyEmail = (emailText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailText);
      setCopiedEmail(emailText);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-8 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white my-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Ambience Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* HEADER: Contact Us / ACCOUNTICCA × E-LAWYERS                              */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Contact Us</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            ACCOUNTICCA <span className="text-emerald-400 font-light">×</span> E-LAWYERS
          </h2>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-2xl font-extrabold text-emerald-300">
              Complete Business Support. One Ecosystem.
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-200">
              Where Business Strategy Meets Legal Excellence.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Whether you need legal advisory, tax &amp; VAT support, accounting, audit, corporate compliance, business consultancy, or professional assistance, our integrated team is ready to help.
          </p>

          <p className="text-sm sm:text-base font-bold text-emerald-400 pt-1">
            Talk to Us. Let’s Build Your Business with Confidence.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. OUR OFFICES & CONTACT INFORMATION                                      */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Our Offices &amp; Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Visit Our Office */}
            <div className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Visit Our Office</span>
                </h4>

                <div className="text-xs sm:text-sm text-slate-300 space-y-1 leading-relaxed">
                  <strong className="text-emerald-300 block text-sm">ACCOUNTICCA × E-LAWYERS</strong>
                  <p>G-5, BTI Centara Grand</p>
                  <p>144–144/1 Green Road, Panthapath</p>
                  <p>Dhaka–1205, Bangladesh</p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-700/70">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-all"
                >
                  <span>Get Directions</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: Call Us */}
            <div className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Call Us</span>
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/80">
                    <a
                      href="tel:+8801335230170"
                      className="text-sm font-black text-emerald-300 hover:text-emerald-200 font-mono"
                    >
                      +88 01335-230170–81
                    </a>
                    <button
                      onClick={handleCopyPhone}
                      title="Copy telephone number"
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Available for business enquiries, professional consultations, and service-related assistance.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-700/70">
                <a
                  href="tel:+8801335230170"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-teal-200 group-hover:translate-x-1 transition-all"
                >
                  <span>Call Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 3: Email Us */}
            <div className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Email Us</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Accounticca Email */}
                  <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">ACCOUNTICCA</span>
                      <a href="mailto:info@accounticca.com" className="font-semibold text-emerald-300 hover:underline">
                        info@accounticca.com
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopyEmail('info@accounticca.com')}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy email"
                    >
                      {copiedEmail === 'info@accounticca.com' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* E-Lawyers Email */}
                  <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-700/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">E-LAWYERS</span>
                      <a href="mailto:info@elawyersbd.com" className="font-semibold text-teal-300 hover:underline">
                        info@elawyersbd.com
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopyEmail('info@elawyersbd.com')}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy email"
                    >
                      {copiedEmail === 'info@elawyersbd.com' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1 leading-snug">
                    For service enquiries, document submissions, corporate support, and general communication.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-700/70">
                <a
                  href="mailto:info@accounticca.com?cc=info@elawyersbd.com&subject=General%20Service%20Enquiry"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-blue-200 group-hover:translate-x-1 transition-all"
                >
                  <span>Send an Email</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. EXPLORE OUR ECOSYSTEM                                                  */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Explore Our Ecosystem
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Accounticca Hub */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/90 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                    A
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">ACCOUNTICCA</h4>
                    <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                      Business &amp; Financial Practice
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Verified Portal
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-emerald-200 bg-slate-900/90 p-3 rounded-xl border border-slate-700/80">
                Accounting • Tax • Audit • Finance • Business Consultancy
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="https://accounticca.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700/80 transition-colors group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-emerald-300 flex items-center gap-2">
                    🌐 accounticca.com
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
                </a>

                <a
                  href={APPOINTMENT_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700/80 transition-colors group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-emerald-300 flex items-center gap-2">
                    📅 appointment.accounticca.com
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
                </a>

                <a
                  href="https://blog.accounticca.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700/80 transition-colors group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-emerald-300 flex items-center gap-2">
                    📰 blog.accounticca.com
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
                </a>
              </div>
            </div>

            {/* E-Lawyers Hub */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/90 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-base shadow-sm">
                    E
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">E-LAWYERS</h4>
                    <span className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                      Legal &amp; Compliance Practice
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-500/30">
                  Legal Chambers
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-teal-200 bg-slate-900/90 p-3 rounded-xl border border-slate-700/80">
                Legal • Tax &amp; VAT • Corporate • Compliance • Business Consultancy
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="https://elawyersbd.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700/80 transition-colors group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-teal-300 flex items-center gap-2">
                    🌐 elawyersbd.com
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300" />
                </a>

                <a
                  href={APPOINTMENT_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700/80 transition-colors group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-teal-300 flex items-center gap-2">
                    📅 appointment.accounticca.com (Shared)
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300" />
                </a>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
                  <span className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                    ⚖️ High Court &amp; RJSC Chambers
                  </span>
                  <span className="text-[11px] text-slate-500">Dhaka Jurisdiction</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ECOSYSTEM SUMMARY BADGE                                            */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-slate-800 text-center space-y-3">
          <h4 className="text-lg font-black text-white">ACCOUNTICCA × E-LAWYERS</h4>
          <p className="text-xs sm:text-sm font-bold text-emerald-400">
            Complete Business Support. One Ecosystem.
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Accounting | Tax | Audit | Legal | VAT | Corporate | Compliance | Business Consultancy
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-2 font-mono">
            <span>📍 Dhaka, Bangladesh</span>
            <span>•</span>
            <a href="tel:+8801335230170" className="hover:text-emerald-300">📞 +88 01335-230170–81</a>
            <span>•</span>
            <span className="text-slate-300">
              ✉️ <a href="mailto:info@accounticca.com" className="hover:text-emerald-300">info@accounticca.com</a> | <a href="mailto:info@elawyersbd.com" className="hover:text-teal-300">info@elawyersbd.com</a>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
