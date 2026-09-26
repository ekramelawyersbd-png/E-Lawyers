import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ExternalLink, 
  Share2, 
  CheckCircle2, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube, 
  ArrowUpRight 
} from 'lucide-react';
import { NewsletterSignup } from '../NewsletterSignup';
import { LanguageToggle } from '../LanguageToggle';
import { buildAppointmentUrl, APPOINTMENT_BASE_URL } from '../../utils/appointmentRedirect';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 mt-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Professional Newsletter Signup Banner in Footer */}
        <div className="mb-14 pb-14 border-b border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Statutory & Tax Intelligence</span>
              </div>
              <h3 
                className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2"
                style={{ fontSize: '21px' }}
              >
                Stay Ahead of Bangladesh Law & Tax Updates
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
                Subscribe for curated practitioner digests of latest NBR circulars, SROs, RJSC corporate deadlines, and High Court precedents.
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterSignup variant="footer" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12" style={{ textAlign: 'center' }}>
          <div className="col-span-1 md:col-span-1 text-justify">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden bg-white/10 p-1 group-hover:scale-105 transition-transform">
                <img src="/footer-logo.png" alt="Compliance Hub Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl text-white">Compliance <span className="text-emerald-500">Hub</span></span>
            </Link>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Your Trusted Platform for Corporate Law, Tax, VAT & Business Compliance Updates in Bangladesh.
            </p>
          </div>
          
          <div style={{ textAlign: 'left', fontSize: '12px' }}>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/team" className="hover:text-emerald-400 transition-colors">Our Professional Team</Link></li>
              <li>
                <a 
                  href={buildAppointmentUrl({ service: 'Legal Advisory & Litigation', source: 'Footer Legal Services' })} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Legal Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href={buildAppointmentUrl({ service: 'Income Tax & Assessment', source: 'Footer Tax Services' })} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Tax Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href={buildAppointmentUrl({ service: 'Corporate Law & RJSC Compliance', source: 'Footer Corporate Services' })} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Corporate Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          <div style={{ textAlign: 'left', lineHeight: '33px', fontSize: '14px', fontStyle: 'normal', fontWeight: 'normal', width: '240.6px', height: '173.988px' }}>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Resources</h3>
            <ul 
              className="space-y-4 text-sm font-medium"
              style={{
                width: '226.6px',
                height: '137px',
                marginLeft: '0px',
                marginRight: '0px',
                paddingLeft: '0px',
                paddingTop: '0px',
                paddingBottom: '0px',
                borderRadius: '0px',
                borderWidth: '0px'
              }}
            >
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Blog Categories</Link></li>
              <li><Link to="/tools" className="hover:text-emerald-400 transition-colors">Legal & Tax Tools</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Legal & Tax FAQs</Link></li>
              <li>
                <Link 
                  to="/contact" 
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          <div style={{ textAlign: 'justify' }}>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Get in Touch</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Need immediate legal or tax assistance? Connect directly with our experts on our appointment platform.
            </p>
            <a 
              href={APPOINTMENT_BASE_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:shadow-emerald-900/40 transition-all duration-200 shadow-lg group"
            >
              <Calendar className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Book a Consultation</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </a>
          </div>
        </div>

        {/* Verified Ecosystem Media & Social Hubs (ACCOUNTICCA × E-LAWYERS) */}
        <div className="border-t border-slate-800/90 mt-12 pt-10 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
                <Share2 className="w-3.5 h-3.5" />
                <span>Verified Ecosystem Media Handles</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Follow ACCOUNTICCA × E-LAWYERS Across Official Channels
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Official Verified Handles
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accounticca Footer Social Hub */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-800 p-0.5 shadow-sm">
                    <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-emerald-400 font-black text-sm">
                      A
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-sm font-bold text-white tracking-wide">ACCOUNTICCA</h5>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Business &amp; Financial Advisory</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">@accounticca</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 hover:bg-[#0A66C2] border border-slate-700/80 hover:border-[#0A66C2] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-1.5 right-1.5 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">LinkedIn</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-blue-100 font-mono">/company</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 hover:bg-[#1877F2] border border-slate-700/80 hover:border-[#1877F2] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-1.5 right-1.5 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facebook</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-blue-100 font-mono">/accounticca</span>
                </a>

                {/* X */}
                <a
                  href="https://x.com/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 hover:bg-black border border-slate-700/80 hover:border-slate-500 transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-1.5 right-1.5 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-white fill-current transition-colors" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">X</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-slate-300 font-mono">@accounticca</span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 hover:bg-[#FF0000] border border-slate-700/80 hover:border-[#FF0000] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-3 h-3 absolute top-1.5 right-1.5 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-7 h-7 rounded-lg bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Youtube className="w-4 h-4 text-[#FF0000] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">YouTube</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-red-100 font-mono">@accounticca</span>
                </a>
              </div>
            </div>

            {/* E-Lawyers Footer Social Hub */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-slate-900 p-0.5 shadow-sm">
                    <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-teal-300 font-black text-sm">
                      E
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-sm font-bold text-white tracking-wide">E-LAWYERS</h5>
                      <span className="text-[10px] font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Legal &amp; Compliance Chambers</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-teal-300 font-bold hidden sm:inline">@elawyerssbd</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/elawyersbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#0A66C2] border border-slate-700/80 hover:border-[#0A66C2] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-2.5 h-2.5 absolute top-1 right-1 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-6 h-6 rounded-md bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">LinkedIn</span>
                  <span className="text-[8px] text-slate-400 group-hover:text-blue-100 font-mono">/company</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/elawyersbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#1877F2] border border-slate-700/80 hover:border-[#1877F2] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-2.5 h-2.5 absolute top-1 right-1 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-6 h-6 rounded-md bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Facebook className="w-3.5 h-3.5 text-[#1877F2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">Facebook</span>
                  <span className="text-[8px] text-slate-400 group-hover:text-blue-100 font-mono">/elawyersbd</span>
                </a>

                {/* X */}
                <a
                  href="https://x.com/elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/90 hover:bg-black border border-slate-700/80 hover:border-slate-500 transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-2.5 h-2.5 absolute top-1 right-1 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-6 h-6 rounded-md bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-white fill-current transition-colors" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">X</span>
                  <span className="text-[8px] text-slate-400 group-hover:text-slate-300 font-mono">@elawyerssbd</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#E1306C] border border-slate-700/80 hover:border-[#E1306C] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative"
                >
                  <ArrowUpRight className="w-2.5 h-2.5 absolute top-1 right-1 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-6 h-6 rounded-md bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Instagram className="w-3.5 h-3.5 text-[#E1306C] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">Instagram</span>
                  <span className="text-[8px] text-slate-400 group-hover:text-pink-100 font-mono">@elawyerssbd</span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#FF0000] border border-slate-700/80 hover:border-[#FF0000] transition-all duration-200 group text-center shadow-xs hover:shadow-lg hover:-translate-y-0.5 col-span-2 sm:col-span-1 relative"
                >
                  <ArrowUpRight className="w-2.5 h-2.5 absolute top-1 right-1 text-slate-500 group-hover:text-white transition-all opacity-60 group-hover:opacity-100" />
                  <div className="w-6 h-6 rounded-md bg-slate-800/90 group-hover:bg-white/15 flex items-center justify-center mb-1 transition-colors">
                    <Youtube className="w-3.5 h-3.5 text-[#FF0000] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">YouTube</span>
                  <span className="text-[8px] text-slate-400 group-hover:text-red-100 font-mono">@elawyerssbd</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ paddingTop: '30px', marginTop: '0px' }}
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold text-slate-500">NBR Portal: Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[11px] font-bold text-slate-500">RJSC System: Online</span>
            </div>
            <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Language:</span>
              <LanguageToggle variant="dark" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500">© {new Date().getFullYear()} Compliance Hub</span>
            <Link to="/privacy" className="text-[11px] uppercase font-bold tracking-widest text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[11px] uppercase font-bold tracking-widest text-slate-500 hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
