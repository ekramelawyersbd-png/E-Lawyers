import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ExternalLink, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube,
  ArrowRight
} from 'lucide-react';
import { LanguageToggle } from '../LanguageToggle';
import { buildAppointmentUrl } from '../../utils/appointmentRedirect';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 mt-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
              <li><Link to="/resource-library" className="hover:text-emerald-400 transition-colors text-emerald-400 font-bold">Resource Library (PDFs)</Link></li>
              <li><Link to="/shop" className="hover:text-emerald-400 transition-colors text-emerald-400 font-bold">Legal & Tax Shop (Digital)</Link></li>
              <li className="hidden"><Link to="/admin/shop" className="hidden">Catalog Admin & Add Products</Link></li>
              <li><Link to="/tools" className="hover:text-emerald-400 transition-colors">Legal & Tax Tools</Link></li>
            </ul>
          </div>

          <div style={{ textAlign: 'justify' }}>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Get in Touch</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Need immediate legal or tax assistance? Connect directly with our experts through our contact desk.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:shadow-emerald-900/40 transition-all duration-200 shadow-lg group"
            >
              <Calendar className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Contact Our Advisors</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Verified Ecosystem Media & Social Hubs (ACCOUNTICCA × E-LAWYERS) */}
        <div 
          className="border-t border-slate-800/80 mt-12 pt-8 pb-2"
          style={{
            marginTop: '120px',
            paddingTop: '6px',
            paddingLeft: '0px'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-center md:text-left">
              <span className="text-xs font-bold text-white tracking-wide">
                ACCOUNTICCA <span className="text-emerald-400 font-light">×</span> E-LAWYERS
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Official Media Channels
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {/* Accounticca Socials */}
              <div className="flex items-center gap-1 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-emerald-400 mr-1.5">ACCOUNTICCA:</span>
                <a
                  href="https://linkedin.com/company/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#0A66C2] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="ACCOUNTICCA on LinkedIn"
                  aria-label="ACCOUNTICCA on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#1877F2] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="ACCOUNTICCA on Facebook"
                  aria-label="ACCOUNTICCA on Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://x.com/accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="ACCOUNTICCA on X"
                  aria-label="ACCOUNTICCA on X"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@accounticca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#FF0000] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="ACCOUNTICCA on YouTube"
                  aria-label="ACCOUNTICCA on YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* E-Lawyers Socials */}
              <div className="flex items-center gap-1 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-teal-300 mr-1.5">E-LAWYERS:</span>
                <a
                  href="https://linkedin.com/company/elawyersbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#0A66C2] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="E-LAWYERS on LinkedIn"
                  aria-label="E-LAWYERS on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com/elawyersbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#1877F2] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="E-LAWYERS on Facebook"
                  aria-label="E-LAWYERS on Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://x.com/elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="E-LAWYERS on X"
                  aria-label="E-LAWYERS on X"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#E1306C] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="E-LAWYERS on Instagram"
                  aria-label="E-LAWYERS on Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com/@elawyerssbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-[#FF0000] hover:bg-slate-700/60 rounded-lg transition-colors"
                  title="E-LAWYERS on YouTube"
                  aria-label="E-LAWYERS on YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
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
