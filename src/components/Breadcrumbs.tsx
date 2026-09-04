import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 print:hidden">
      <Link to="/" className="flex items-center hover:text-emerald-700 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400 shrink-0" />
          {item.path ? (
            <Link 
              to={item.path}
              className="hover:text-emerald-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-bold">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
