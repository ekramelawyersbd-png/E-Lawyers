import { BookmarkButton } from '../components/BookmarkButton';
import { useParams, Link } from 'react-router-dom';
import { calculateReadingTime } from '../utils/readingTime';
import { mockArticles, categories } from '../data/mockData';
import { format } from 'date-fns';
import { Filter, Search } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function Category() {
  const { id } = useParams();
  
  const category = categories.find(c => c.id === id);
  const articles = mockArticles.filter(a => a.categoryId === id);

  if (!category) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Category not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs 
        items={[
          { label: 'Categories' },
          { label: category.name }
        ]} 
      />
      {/* Category Header */}
      <div className="mb-12 border-b border-slate-200 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{category.name}</h1>
        <p className="text-lg text-slate-600 max-w-2xl">{category.description}</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Search in ${category.name}...`}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
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
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{article.author.name}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {calculateReadingTime(article.content)} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-lg font-bold">No articles found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
