import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileInstallPrompt } from '../pwa/MobileInstallPrompt';
import { CartDrawer } from '../shop/CartDrawer';
import { useFocusMode } from '../../contexts/FocusModeContext';

export function Layout() {
  const { isFocusMode, readerTheme } = useFocusMode();
  const location = useLocation();
  const isArticleView = location.pathname.startsWith('/article/');
  const hideNavs = isFocusMode && isArticleView;

  const bgThemeClass = !hideNavs
    ? 'bg-slate-50'
    : readerTheme === 'sepia'
    ? 'bg-[#fbf7ee] text-[#3c2f1f]'
    : readerTheme === 'dark'
    ? 'bg-[#12161a] text-slate-100'
    : 'bg-white text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col ${bgThemeClass} w-full max-w-full overflow-x-clip transition-colors duration-300`}>
      {!hideNavs && <Navbar />}
      <main className={`flex-1 w-full max-w-full ${hideNavs ? 'pb-8 pt-0' : 'pb-16 lg:pb-0'}`}>
        <Outlet />
      </main>
      {!hideNavs && <Footer />}
      {!hideNavs && <MobileBottomNav />}
      {!hideNavs && <MobileInstallPrompt />}
      <CartDrawer />
    </div>
  );
}
