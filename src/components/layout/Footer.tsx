import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 mt-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">E</div>
              <span className="font-bold text-xl text-white">E-Lawyers <span className="text-emerald-500">blog</span></span>
            </Link>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Your Trusted Platform for Corporate Law, Tax, VAT & Business Compliance Updates in Bangladesh.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About E-Lawyers blog</Link></li>
              <li><Link to="/services/legal" className="hover:text-emerald-400 transition-colors">Legal Services</Link></li>
              <li><Link to="/services/tax" className="hover:text-emerald-400 transition-colors">Tax Services</Link></li>
              <li><Link to="/services/corporate" className="hover:text-emerald-400 transition-colors">Corporate Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Resources</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Blog Categories</Link></li>
              <li><Link to="/tools" className="hover:text-emerald-400 transition-colors">Legal & Tax Tools</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Get in Touch</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Need immediate legal or tax assistance? Contact our experts today.
            </p>
            <Link to="/contact" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg">
              Book a Consultation
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold text-slate-500">NBR Portal: Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[11px] font-bold text-slate-500">RJSC System: Online</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500">© {new Date().getFullYear()} E-Lawyers blog</span>
            <Link to="/privacy" className="text-[11px] uppercase font-bold tracking-widest text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[11px] uppercase font-bold tracking-widest text-slate-500 hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
