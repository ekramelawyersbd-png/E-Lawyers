import { BookmarkButton } from '../components/BookmarkButton';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockArticles } from '../data/mockData';
import { format } from 'date-fns';
import { Search as SearchIcon } from 'lucide-react';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(mockArticles);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (query) {
      const lowerQuery = query.toLowerCase();
      const filtered = mockArticles.filter(article => 
        article.title.toLowerCase().includes(lowerQuery) || 
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        article.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults(mockArticles);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Search Results</h1>
        <form 
          className="relative max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('search') as HTMLInputElement;
            setSearchParams({ q: input.value.trim() });
          }}
        >
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            name="search"
            type="text" 
            defaultValue={query}
            placeholder="Search for articles, VAT, tax rules..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm text-slate-900"
          />
        </form>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          {query ? `Showing results for "${query}"` : 'All Articles'}
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {results.length} found
        </span>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{article.category}</span>
                  <span className="text-slate-400">{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <BookmarkButton 
                    id={article.id} 
                    title={article.title} 
                    url={`/article/${article.id}`}
                    className="p-1.5 -mr-1.5 -mt-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors shrink-0" 
                  />
                </div>
                <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-sm">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  <img src={article.author.avatarUrl} alt={article.author.name} className="w-8 h-8 rounded-full object-cover" onError={(e) => { const target = e.target as HTMLImageElement; target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=047857&color=fff`; }} />
                  <span className="text-sm font-bold text-slate-700">{article.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-bold mb-2">No articles found</p>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Try adjusting your search terms or browse our categories to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
