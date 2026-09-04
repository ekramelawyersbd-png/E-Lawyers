import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockArticles, categories } from '../data/mockData';
import { format } from 'date-fns';
import { saveItem, removeItem, isItemSaved } from '../utils/readingList';
import { calculateReadingTime } from '../utils/readingTime';
import { Bookmark, Clock, MessageCircle, Share2, ThumbsUp, Printer, Award, Facebook, Twitter, Linkedin, Link as LinkIcon, Search, ChevronRight, User, Calendar, Briefcase, FileText } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReadProgress } from '../components/ReadProgress';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { Comments } from '../components/Comments';

export function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    if (id) {
      setIsSaved(isItemSaved(id));
      const handleStorageChange = () => setIsSaved(isItemSaved(id));
      window.addEventListener('bookmarksUpdated', handleStorageChange);
      return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
    }
  }, [id]);

  const article = mockArticles.find(a => a.id === id);
  const popularArticles = mockArticles.slice(0, 4);



  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <p className="text-slate-600 mb-8">The legal article or guide you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const toggleSave = () => {
    if (!id) return;
    if (isSaved) {
      removeItem(id);
      setIsSaved(false);
    } else {
      saveItem({
        id,
        title: article.title,
        type: 'article',
        url: `/article/${id}`,
        dateSaved: new Date().toISOString()
      });
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  
  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    if (input.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
    }
  };

  const relatedArticles = mockArticles
    .filter(a => a.id !== article.id && (a.categoryId === article.categoryId || a.tags.some(t => article.tags.includes(t))))
    .slice(0, 3);

  return (
    <>
      <ReadProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs 
          items={[
            { label: article.category, path: `/category/${article.categoryId}` },
            { label: article.title }
          ]} 
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            
            {/* 1. Article Header Section */}
            <header className="mb-10">
              <Link to={`/category/${article.categoryId}`} className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md mb-6">
                {article.category}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                {article.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <img src={article.author.avatarUrl} alt={article.author.name} className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
                  <div>
                    <p className="font-bold text-slate-900">{article.author.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {calculateReadingTime(article.content)} min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={toggleSave} className={`p-2.5 rounded-full border ${isSaved ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <div className="flex gap-1 border-l border-slate-200 pl-2">
                    <button className="p-2 text-slate-400 hover:text-[#1877F2] transition-colors"><Facebook className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-[#0A66C2] transition-colors"><Linkedin className="w-4 h-4" /></button>
                    <div className="relative">
                      <button onClick={handleShare} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><LinkIcon className="w-4 h-4" /></button>
                      {showShareToast && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Link copied!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-10 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative aspect-[16/9] bg-slate-100">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Read Aloud controls */}
            <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-sm font-bold text-slate-500">Audio Version</span>
              <ReadAloudButton content={article.content} title={article.title} />
            </div>

            {/* 2-7. Article Content Area (Markdown) */}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-emerald-600 prose-a:font-semibold hover:prose-a:text-emerald-700 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 mb-16">
              <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 py-6 border-y border-slate-200 mb-12 flex-wrap">
              <span className="text-sm font-bold text-slate-900">Related Tags:</span>
              {article.tags.map(tag => (
                <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="text-sm bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Suggested Reading Footer Section */}
            {relatedArticles.length > 0 && (
              <div className="bg-emerald-50/50 rounded-3xl p-6 mb-12 border border-emerald-100/50">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Suggested Reading
                </h4>
                <ul className="space-y-3">
                  {relatedArticles.map((rel) => (
                    <li key={rel.id} className="flex items-start gap-2 group">
                      <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                      <Link to={`/article/${rel.id}`} className="text-slate-700 hover:text-emerald-700 font-medium transition-colors line-clamp-1">
                        {rel.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 8. Author Profile Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-6 items-start">
              <img src={article.author.avatarUrl} alt={article.author.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-sm shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{article.author.name}</h3>
                <p className="text-emerald-700 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {article.author.role || 'Corporate Legal Expert'}
                </p>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {article.author.name} is a seasoned legal professional specializing in corporate compliance, tax legislation, and business advisory in Bangladesh. With over a decade of experience, they provide actionable insights for growing enterprises.
                </p>
                <Link to="/team" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                  View Full Profile <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 10. Call-to-Action Section (In-content Banner) */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden mb-16 border border-emerald-700">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/>%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/>%3C/g%3E%3C/svg%3E")' }}></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Need Professional Legal Assistance?</h3>
                <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                  Our experts are ready to assist you with corporate compliance, tax filing, and legal documentation.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/contact" className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-md">
                    Consult a Lawyer
                  </Link>
                  <Link to="/contact" className="bg-emerald-700 text-white border border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                    Request Legal Service
                  </Link>
                </div>
              </div>
            </div>

            {/* 11. Comments Section */}
            <Comments articleId={article.id} />

          </div>

          {/* 12. Sidebar Content (Desktop) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              
              {/* Search Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Search Legal Articles</h3>
                <form onSubmit={searchSubmit} className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="search"
                    type="text" 
                    placeholder="Search topics..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/category/${cat.id}`} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-700 transition-colors">{cat.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Posts */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" /> Most Read Articles
                </h3>
                <div className="space-y-4">
                  {popularArticles.map(pop => (
                    <Link key={pop.id} to={`/article/${pop.id}`} className="flex gap-4 group">
                      <img src={pop.imageUrl} alt={pop.title} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">{pop.title}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">{pop.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Advertisement / Service Banner */}
              <div className="bg-slate-900 p-8 rounded-3xl text-center text-white shadow-lg relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <FileText className="w-24 h-24 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">Company Registration Service</h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10">End-to-end RJSC incorporation and trade license acquisition.</p>
                <Link to="/contact" className="inline-block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors relative z-10 shadow-md">
                  Learn More
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 9. Related Articles */}
      <div className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Related Articles</h2>
            <Link to={`/category/${article.categoryId}`} className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors hidden sm:flex items-center gap-2">
              View Category <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map(rel => (
              <Link key={rel.id} to={`/article/${rel.id}`} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden h-full">
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img 
                    src={rel.imageUrl} 
                    alt={rel.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-2 block">{rel.category}</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                    {rel.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 flex-1 mb-4">
                    {rel.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 border-t border-slate-100 pt-4 mt-auto">
                    <User className="w-3.5 h-3.5" /> {rel.author.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
