import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Corporate Law', path: '/category/corporate' },
    { name: 'Tax', path: '/category/tax' },
    { name: 'VAT', path: '/category/vat' },
    { name: 'Business Law', path: '/category/business' },
    { name: 'Legal Documents', path: '/category/legal_docs' },
    { name: 'Compliance', path: '/category/compliance' },
    { name: 'Legal Updates', path: '/category/updates' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all print:hidden">
      {/* Header (Top Row) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-sm">E</div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">E-Lawyers <span className="text-emerald-700">blog</span></h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold leading-none">Legal • Tax • Tech</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <form 
              className="hidden md:block relative text-slate-400 focus-within:text-emerald-600"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('search') as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                }
              }}
            >
               <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
               <input name="search" type="text" placeholder="Search articles..." className="bg-slate-100 border border-transparent rounded-full py-2 pl-10 pr-4 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-emerald-200 text-slate-900 transition-all focus:w-72 shadow-inner" />
            </form>
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700">{user.displayName || user.email?.split('@')[0]}</span>
                <button 
                  onClick={logout}
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:flex items-center gap-2 text-sm font-bold text-white hover:bg-emerald-600 bg-slate-900 px-5 py-2.5 rounded-full transition-colors shadow-sm">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
            <button 
              className="lg:hidden text-slate-600 hover:text-emerald-600 transition-colors p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header (Bottom Row - Navigation) */}
      <div className="hidden lg:block border-t border-slate-100 bg-transparent transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-8 h-12 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "inline-block text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2",
                    location.pathname === link.path ? "text-emerald-700 border-emerald-700" : "text-slate-600 border-transparent"
                  )}
                >
                  {link.name}
                </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg absolute w-full">
          <div className="px-4 pt-4 pb-2">
            <form 
              className="relative text-slate-400 focus-within:text-emerald-600"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('search') as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                }
              }}
            >
               <Search className="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
               <input name="search" type="text" placeholder="Search articles..." className="bg-slate-100 border-none rounded-xl py-3 pl-11 pr-4 text-base w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900" />
            </form>
          </div>
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-bold transition-colors",
                    location.pathname === link.path ? "text-emerald-700 bg-emerald-50" : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
            ))}
            {user ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="px-4 py-2 text-sm font-bold text-slate-500">
                  Signed in as {user.displayName || user.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-3 mt-4 rounded-xl text-base font-bold text-white bg-slate-900 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
