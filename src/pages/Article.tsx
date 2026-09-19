import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockArticles, categories } from '../data/mockData';
import { format } from 'date-fns';
import { isItemSaved } from '../utils/readingList';
import { calculateReadingTime } from '../utils/readingTime';
import { Bookmark, Clock, MessageCircle, Share2, ThumbsUp, Printer, Award, Facebook, Twitter, Linkedin, Link as LinkIcon, Search, ChevronRight, User, Calendar, Briefcase, FileText, ExternalLink, Loader2, ImageOff, Check, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { DocumentChecklist } from '../components/DocumentChecklist';
import React from 'react';
import { ReadProgress } from '../components/ReadProgress';
import { ArticleReadingProgress } from '../components/ArticleReadingProgress';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { ChecklistExporter } from '../components/ChecklistExporter';
import { SocialShareButtons } from '../components/SocialShareButtons';
import { useAuth } from '../contexts/AuthContext';
import { saveBookmark, removeBookmark } from '../services/bookmarkService';

import { ComplianceChecklist } from '../components/ComplianceChecklist';
import { ImageCarousel } from '../components/ImageCarousel';
import { useImageLoader } from '../hooks/useImageLoader';
import { MarkdownImage } from '../components/MarkdownImage';
import { TableOfContents } from '../components/TableOfContents';
import { LegalAlertBanner } from '../components/LegalAlertBanner';
import { PenaltyFlowchart } from '../components/PenaltyFlowchart';
import { Section272Checklist as Section272ComplianceChecklist } from '../components/Section272Checklist';
import { RelatedArticles, getRecommendedArticles } from '../components/RelatedArticles';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { InteractiveChecklistItem } from '../components/InteractiveChecklistItem';

import { useLanguage } from '../contexts/LanguageContext';

import { SortableTable } from '../components/SortableTable';
import { EarlyFilingIncentive } from '../components/tax/EarlyFilingIncentive';
import { ImageGallery } from '../components/ImageGallery';
import { CommentSection } from '../components/CommentSection';
import { BlogSEO } from '../components/BlogSEO';
import { BlogDisclaimer } from '../components/BlogDisclaimer';
import { ContactELawyers } from '../components/ContactELawyers';
import { RelatedResources } from '../components/RelatedResources';

export function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsSaved(isItemSaved(id));
      const handleStorageChange = () => setIsSaved(isItemSaved(id));
      window.addEventListener('bookmarksUpdated', handleStorageChange);
      return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
    }
  }, [id]);

  const article = mockArticles.find(a => a.id === id);

  useEffect(() => {
    if (article) {
      document.title = article.metaTitle || `${article.title} | Compliance Hub`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.metaDescription || article.excerpt);
      }
    }
  }, [article]);
  const popularArticles = mockArticles.slice(0, 4);
  const { isLoaded: isFeaturedLoaded, hasError: hasFeaturedError } = useImageLoader(article?.imageUrl);



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

  const toggleSave = async () => {
    if (!id || !article) return;
    if (isSaved) {
      await removeBookmark(id, user);
      setIsSaved(false);
      setSaveFeedback(null);
    } else {
      await saveBookmark({
        id,
        title: article.title,
        type: 'article',
        url: `/article/${id}`,
        dateSaved: new Date().toISOString(),
        offlineContent: article.content,
        offlineExcerpt: article.excerpt,
        offlineImageUrl: article.imageUrl,
        category: article.category,
        categoryId: article.categoryId,
        readTime: article.readTime,
        authorName: article.author?.name
      }, user);
      setIsSaved(true);
      setSaveFeedback(user ? 'Saved to your private Saved Items on your Dashboard' : 'Saved locally on this device. Sign in to sync across devices');
      setTimeout(() => setSaveFeedback(null), 4500);
    }
  };

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    if (input.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
    }
  };

  const relatedArticles = useMemo(
    () => getRecommendedArticles(article, mockArticles, 4).map(r => r.article),
    [article]
  );

  const localizedContent = useMemo(() => {
    if (!article) return '';
    const regex = /(?:\n|^)---\s*\n\s*(?:#+\s*)?(?:বাংলা|in bangla)/i;
    const parts = article.content.split(regex);
    if (language === 'en') {
      return parts[0].trim();
    } else {
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }
  }, [article, language]);

  const readingTimeMinutes = useMemo(() => calculateReadingTime(localizedContent), [localizedContent]);
  // Long-form articles typically exceed 300 words or require >= 2 minutes to read thoroughly
  const isLongForm = readingTimeMinutes >= 2 || localizedContent.length > 500;

  const markdownComponents = useMemo(() => ({
    h1: ({ node, children, ...props }: any) => {
      const id = React.Children.toArray(children).join('').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h1 id={id} className="text-[25px] leading-[33px] scroll-mt-28" {...props}>{children}</h1>;
    },
    h2: ({ node, children, ...props }: any) => {
      const id = React.Children.toArray(children).join('').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const isFlowchartTarget = article.id === 'section-272-income-tax-act-2023-penalty-bangladesh' && id === 'mandatory-hearing-before-imposing-penalty';
      
      const isSpecificH2 = id === 'required-documents-list-for-employees-income-from-salary-fy-2025-26-ay-2026-27';
      const className = isSpecificH2 
        ? "text-[15px] leading-[25px] scroll-mt-28 font-bold" 
        : "text-[25px] leading-[33px] scroll-mt-28 font-bold";

      return (
        <>
          <h2 id={id} className={className} {...props}>{children}</h2>
          {isFlowchartTarget && <PenaltyFlowchart />}
        </>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      const id = React.Children.toArray(children).join('').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 id={id} className="scroll-mt-28" {...props}>{children}</h3>;
    },
    p: ({ node, children }: any) => {
      const elementChildren = React.Children.toArray(children);
      
      const isOnlyImages = elementChildren.length > 0 && elementChildren.every((child: any) => {
        if (typeof child === 'string') {
          return child.trim() === '';
        }
        return React.isValidElement(child) && (child.props as any)?.node?.tagName === 'img';
      });

      const imageElements = elementChildren.filter((child: any) => React.isValidElement(child) && (child.props as any)?.node?.tagName === 'img');

      if (isOnlyImages && imageElements.length > 1) {
        const carouselImages = imageElements.map((img: any) => ({
          src: img.props.src,
          alt: img.props.alt
        }));
        return <ImageCarousel images={carouselImages} />;
      }
      
            if (elementChildren.some((child: any) => React.isValidElement(child) && (child.props as any)?.node?.tagName === "document-checklist")) {
        return <div className="mb-4">{children}</div>;
      }
      return <p className="text-[15px] leading-[25px] text-slate-600 mb-6 text-justify">{children}</p>;
    },
    img: ({ node, ...props }: any) => <MarkdownImage {...props} />,
    ul: ({ node, children, ...props }: any) => {
      if (article.id === 'personal-income-tax-return-submission-guide-2025-2026') {
        return <ul className="list-none pl-0 space-y-3 my-6 text-[15px] leading-[25px] text-justify" {...props}>{children}</ul>;
      }
      return <ul className="list-disc pl-5 space-y-2 mb-6 text-[15px] leading-[25px] text-justify text-slate-600" {...props}>{children}</ul>;
    },
    li: ({ node, children, ...props }: any) => {
      if (article.id === 'personal-income-tax-return-submission-guide-2025-2026') {
        return <InteractiveChecklistItem articleId={article.id} {...props}>{children}</InteractiveChecklistItem>;
      }
      return <li {...props}>{children}</li>;
    },
    table: ({ node, children, ...props }: any) => <SortableTable {...props}>{children}</SortableTable>
  }), [article.id]);

  return (
    <>
      <BlogSEO article={article} />
      {!isLongForm && <ReadProgress />}
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
            
            {article.id === 'section-272-income-tax-act-2023-penalty-bangladesh' && (
              <LegalAlertBanner />
            )}

            {/* 1. Article Header Section */}
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <Link to={`/category/${article.categoryId}`} className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  {article.category}
                </Link>
                <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {calculateReadingTime(localizedContent)} min read
                </div>
              </div>
              
              <h1 className="text-[25px] leading-[33px] font-bold text-slate-900 mb-6">
                {article.title}
              </h1>
              <p className="text-[15px] leading-[25px] text-justify text-slate-600 mb-8">
                {article.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <img src={article.author.avatarUrl} alt={article.author.name} className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
                  <div>
                    <p className="font-bold text-slate-900">{article.author.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                      <span>&bull;</span>
                      <a href="#professional-comments-section" className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-semibold transition-colors">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Discussion</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button 
                      id="article-bookmark-btn"
                      onClick={toggleSave} 
                      title={isSaved ? "Remove from Saved Items" : "Save this article to your private Dashboard"}
                      aria-label={isSaved ? "Remove from Saved Items" : "Save this article to your private Dashboard"}
                      className={`px-4 py-2.5 rounded-xl border font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                        isSaved 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 transition-transform active:scale-125 duration-150 ${isSaved ? 'fill-current text-emerald-600' : ''}`} />
                      <span className="hidden sm:inline text-sm">{isSaved ? "Saved to Dashboard" : "Save Article"}</span>
                    </button>
                  </div>

                  {saveFeedback && (
                    <div id="bookmark-save-feedback" className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs shadow-xs animate-in fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{saveFeedback}</span>
                      <Link to="/dashboard?tab=saved" className="font-bold underline ml-1 hover:text-emerald-950">
                        View Dashboard &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Social Sharing Bar (LinkedIn, Facebook, WhatsApp, Copy Link) */}
              <div className="pt-6">
                <SocialShareButtons 
                  title={article.title} 
                  summary={article.excerpt} 
                  variant="top-bar" 
                />
              </div>
            </header>

            {/* Visual Reading Progress Indicator Bar for Long-Form Articles */}
            {isLongForm && (
              <ArticleReadingProgress
                targetContentId="article-content-body"
                totalMinutes={readingTimeMinutes}
                articleTitle={article.title}
                category={article.category}
                rawContent={localizedContent}
                isSaved={isSaved}
                onToggleSave={toggleSave}
              />
            )}

            {/* 2-7. Article Content Area (Markdown) */}
            <div id="article-content-body" className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-emerald-600 prose-a:font-semibold hover:prose-a:text-emerald-700 mb-16">
              <Markdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{...markdownComponents, "document-checklist": () => <DocumentChecklist /> } as any}
              >
                {localizedContent}
              </Markdown>
            </div>

            {/* Conditional Checklists Injection */}
            {article.id === 'required-documents-rjsc-annual-return-filing-bangladesh' && (
              <ComplianceChecklist />
            )}
            {article.id === 'section-272-income-tax-act-2023-penalty-bangladesh' && (
              <Section272ComplianceChecklist />
            )}
            {article.id === 'benefits-of-filing-income-tax-return-bangladesh' && (
              <>
                <div className="my-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Tax Filing Deadline & Incentives</h3>
                  <ImageGallery 
                    layout="grid"
                    images={[
                      { url: 'https://pub-d893cbb677b6463eb69f13e1dbb40541.r2.dev/Tax%20sep%2030300.png', caption: 'Tax Return Deadline: September 30' },
                      { url: 'https://pub-d893cbb677b6463eb69f13e1dbb40541.r2.dev/tax%20sep%2030.png', caption: 'Early Filing Benefits & Incentives' }
                    ]} 
                  />
                </div>
                <div className="my-12" id="early-filing-tool">
                  <EarlyFilingIncentive initialPayableTax={50000} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ring-1 ring-slate-900/5" />
                </div>
              </>
            )}

            {/* Dynamic Gallery Images */}
            {article.galleryImages && article.galleryImages.length > 0 && (
              <div className="my-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Gallery Images</h3>
                <ImageGallery 
                  layout="grid"
                  images={article.galleryImages}
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex items-center gap-3 py-6 border-y border-slate-200 mb-8 flex-wrap">
              <span className="text-sm font-bold text-slate-900">Related Tags:</span>
              {article.tags.map(tag => (
                <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="text-sm bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Bottom Social Media Sharing & Networking Bar */}
            <SocialShareButtons 
              title={article.title} 
              summary={article.excerpt} 
              variant="bottom-bar" 
            />

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

            <BlogDisclaimer topic={article.category} />

            <RelatedResources currentCategory={article.category} />

            
            <ContactELawyers />

            <ChecklistExporter articleId={article.id} />
            {/* 11. Professional Comments & Peer Discussion Section */}
            <CommentSection articleId={article.id} />

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

              {/* Sidebar Promotional Image */}
              <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <img 
                  src="https://pub-d893cbb677b6463eb69f13e1dbb40541.r2.dev/90b0e2d5-0462-418b-ab5f-3dd3b3b40770.png" 
                  alt="Featured Guide" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" 
                />
              </div>

              {/* Table of Contents */}
              <TableOfContents content={localizedContent} />

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

              {/* Related Insights (Sidebar) */}
              {relatedArticles.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" /> Related Insights
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.slice(0, 3).map(rel => (
                      <Link key={rel.id} to={`/article/${rel.id}`} className="flex gap-4 group">
                        <img src={rel.imageUrl} alt={rel.title} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">{rel.title}</h4>
                          <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">{rel.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Newsletter Signup in Sidebar (Direct Firestore Persistence) */}
              <NewsletterSignup 
                variant="sidebar"
                currentCategory={article.category}
                sourceArticleTitle={article.title}
                sourceArticleId={article.id}
              />

              {/* Quick Share Widget */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Share Insight</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Share this statutory analysis with your professional network and colleagues.
                </p>
                <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 flex items-center justify-center">
                  <SocialShareButtons 
                    title={article.title} 
                    summary={article.excerpt} 
                    variant="compact" 
                    className="justify-center w-full"
                  />
                </div>
              </div>

              {/* Advertisement / Service Banner */}
              <div className="bg-slate-900 p-8 rounded-3xl text-center text-white shadow-lg relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <FileText className="w-24 h-24 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">Company Registration Service</h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10">End-to-end RJSC incorporation and trade license acquisition.</p>
                <a 
                  href="https://appointment.accounticca.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors relative z-10 shadow-md"
                >
                  <span>Book Consultation</span>
                  <ExternalLink className="w-4 h-4 text-emerald-200" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 9. Related Articles */}
      <RelatedArticles currentArticle={article} maxItems={3} />

      {/* 10. Newsletter Signup */}
      <NewsletterSignup 
        variant="full-width"
        currentCategory={article.category}
        sourceArticleTitle={article.title}
        sourceArticleId={article.id}
      />
    </>
  );
}
