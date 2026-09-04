import { useState, useEffect } from 'react';

export function ReadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (docHeight > 0) {
        setProgress((scrollY / docHeight) * 100);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 z-[100] transition-all duration-150 ease-out print:hidden"
      style={{ width: `${progress}%` }}
    />
  );
}
