import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { cn } from '../lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center gap-1 bg-slate-100 p-1 rounded-full", className)}>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-2 py-1 text-xs font-bold rounded-full transition-colors",
          language === 'en'
            ? "bg-white text-emerald-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={cn(
          "px-2 py-1 text-xs font-bold rounded-full transition-colors",
          language === 'bn'
            ? "bg-white text-emerald-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        বাং
      </button>
    </div>
  );
}
