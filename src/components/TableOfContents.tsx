import { useEffect, useState } from 'react';
import { ChevronRight, List } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse markdown headings (## or ###)
    const matches = content.match(/^(##|###)\s+(.+)$/gm);
    if (matches) {
      const items = matches.map((match) => {
        const level = match.startsWith('###') ? 3 : 2;
        const title = match.replace(/^(##|###)\s+/, '').replace(/\*/g, '').trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id, title, level };
      });
      setHeadings(items);
    }
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;
    
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      let currentActiveId = '';
      
      for (const element of headingElements) {
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        // If heading is near the top of the viewport
        if (rect.top <= 120) {
          currentActiveId = element.id;
        } else {
          break; // Since they are in order, we can stop
        }
      }
      
      if (currentActiveId) setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header if any
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <List className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Table of Contents</h3>
      </div>
      <ul className="space-y-3">
        {headings.map((heading, index) => (
          <li 
            key={`${heading.id}-${index}`}
            className={`${heading.level === 3 ? 'ml-4' : ''}`}
          >
            <a 
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(e, heading.id)}
              className={`text-sm transition-colors flex items-start gap-2 group ${
                activeId === heading.id 
                  ? 'text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                activeId === heading.id ? 'text-emerald-600' : 'text-slate-300 group-hover:text-emerald-500'
              }`} />
              <span className="line-clamp-2 leading-relaxed">{heading.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
