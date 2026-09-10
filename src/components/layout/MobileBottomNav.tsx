import { Link, useLocation } from 'react-router-dom';
import { Home, Users, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');

  const isHome = location.pathname === '/';
  const isExperts = location.pathname === '/community' && currentTab === 'experts';
  const isDiscussions = location.pathname === '/community' && (currentTab === 'discussions' || !currentTab);
  const isProfile = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/auth');

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] p-1 rounded-xl transition-colors ${
            isHome ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Experts */}
        <Link
          to="/community?tab=experts"
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] p-1 rounded-xl transition-colors ${
            isExperts ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Experts</span>
        </Link>

        {/* Ask Center Button (Emphasized) */}
        <Link
          to="/community?ask=true"
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] -mt-3 p-1 rounded-full group"
          title="Ask a Question"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 group-hover:bg-emerald-800 transition-all group-hover:scale-105">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Ask</span>
        </Link>

        {/* Discussions */}
        <Link
          to="/community?tab=discussions"
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] p-1 rounded-xl transition-colors ${
            isDiscussions ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Discussions</span>
        </Link>

        {/* Profile */}
        <Link
          to={user ? '/dashboard' : '/auth'}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] p-1 rounded-xl transition-colors ${
            isProfile ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-5 h-5 rounded-full object-cover mb-0.5 border border-emerald-600"
            />
          ) : (
            <User className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] tracking-tight">{user ? 'Profile' : 'Sign In'}</span>
        </Link>
      </div>
    </nav>
  );
}
