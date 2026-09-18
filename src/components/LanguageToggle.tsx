import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { cn } from '../lib/utils';

export function LanguageToggle({ className, variant = 'light' }: { className?: string; variant?: 'light' | 'dark' }) {
  const { language, setLanguage } = useLanguage();

  const isDark = variant === 'dark';

  return (
    <div className={cn(
      "flex items-center gap-1 p-1 rounded-full",
      isDark ? "bg-slate-800/90 border border-slate-700" : "bg-slate-100",
      className
    )}>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-2.5 py-1 text-xs font-bold rounded-full transition-colors",
          language === 'en'
            ? isDark ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-emerald-700 shadow-sm"
            : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={cn(
          "px-2.5 py-1 text-xs font-bold rounded-full transition-colors",
          language === 'bn'
            ? isDark ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-emerald-700 shadow-sm"
            : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
        )}
      >
        বাং
      </button>
    </div>
  );
}
