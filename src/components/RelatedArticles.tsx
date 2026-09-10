import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { mockArticles } from '../data/mockData';
import { Clock, ChevronRight, Tag, ArrowUpRight, Sparkles, BookOpen, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { calculateReadingTime } from '../utils/readingTime';
import { BookmarkButton } from './BookmarkButton';

interface RelatedArticlesProps {
  currentArticle: Article;
  articles?: Article[];
  maxItems?: number;
}

export interface RecommendedArticleItem {
  article: Article;
  score: number;
  matchingTags: string[];
  isSameCategory: boolean;
}

/**
 * Recommends 3-4 relevant articles from the same category using
 * tag-based similarity scoring, with graceful fallback.
 */
export function getRecommendedArticles(
  currentArticle: Article,
  allArticles: Article[] = mockArticles,
  limit: number = 4
): RecommendedArticleItem[] {
  if (!currentArticle) return [];

  const currentTags = (currentArticle.tags || []).map(t => t.toLowerCase().trim());

  const getOverlapInfo = (candidate: Article) => {
    if (!candidate.tags || candidate.tags.length === 0) {
      return { score: 0, matches: [] };
    }

    const candTags = candidate.tags.map(t => t.toLowerCase().trim());
    let score = 0;
    const matches: string[] = [];

    for (let i = 0; i < candidate.tags.length; i++) {
      const origTag = candidate.tags[i];
      const lowerTag = candTags[i];

      if (currentTags.includes(lowerTag)) {
        score += 3; // High weight for exact tag match
        matches.push(origTag);
      } else {
        // Partial or word-boundary overlap
        for (const ct of currentTags) {
          if (ct.includes(lowerTag) || lowerTag.includes(ct)) {
            score += 1;
            matches.push(origTag);
            break;
          }
        }
      }
    }

    return { score, matches: Array.from(new Set(matches)) };
  };

  // 1. Primary pool: other articles from the EXACT same category
  const sameCategoryPool = allArticles.filter(
    a => a.id !== currentArticle.id && a.categoryId === currentArticle.categoryId
  );

  const scoredSameCategory: RecommendedArticleItem[] = sameCategoryPool.map(article => {
    const { score, matches } = getOverlapInfo(article);
    return {
      article,
      score,
      matchingTags: matches,
      isSameCategory: true
    };
  });

  // Sort primarily by tag overlap score, then by recency (published date), then popularity
  scoredSameCategory.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const dateA = new Date(a.article.publishedAt).getTime();
    const dateB = new Date(b.article.publishedAt).getTime();
    if (dateB !== dateA) {
      return dateB - dateA;
    }
    return (b.article.likes || 0) - (a.article.likes || 0);
  });

  const recommendations: RecommendedArticleItem[] = [...scoredSameCategory];

  // 2. If the same category has fewer than the required limit (e.g. 3-4 items),
  // supplement with top tag-matched articles from other categories
  if (recommendations.length < limit) {
    const existingIds = new Set([currentArticle.id, ...recommendations.map(r => r.article.id)]);
    const otherPool = allArticles.filter(a => !existingIds.has(a.id));

    const scoredOthers: RecommendedArticleItem[] = otherPool
      .map(article => {
        const { score, matches } = getOverlapInfo(article);
        return {
          article,
          score,
          matchingTags: matches,
          isSameCategory: false
        };
      })
      .filter(item => item.score > 0);

    scoredOthers.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
    });

    for (const item of scoredOthers) {
      if (recommendations.length >= limit) break;
      recommendations.push(item);
      existingIds.add(item.article.id);
    }

    // 3. Fallback: if still under limit, backfill with most recent general articles
    if (recommendations.length < limit) {
      const remaining = allArticles
        .filter(a => !existingIds.has(a.id))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      for (const article of remaining) {
        if (recommendations.length >= limit) break;
        recommendations.push({
          article,
          score: 0,
          matchingTags: [],
          isSameCategory: false
        });
      }
    }
  }

  return recommendations.slice(0, limit);
}

export function RelatedArticles({
  currentArticle,
  articles = mockArticles,
  maxItems = 4
}: RelatedArticlesProps) {
  const recommendedItems = useMemo(
    () => getRecommendedArticles(currentArticle, articles, maxItems),
    [currentArticle, articles, maxItems]
  );

  if (recommendedItems.length === 0) {
    return null;
  }

  const gridColsClass =
    recommendedItems.length === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section 
      id="related-articles-section"
      aria-label="Related Insights"
      className="bg-slate-50/80 py-14 md:py-20 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recommended For You</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Related Insights
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-1.5 max-w-2xl">
              Relevant legal guides and regulatory analyses in <span className="font-semibold text-slate-800">{currentArticle.category}</span> curated by topic and statutory tags.
            </p>
          </div>

          <Link
            id="related-articles-view-category-btn"
            to={`/category/${currentArticle.categoryId}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group shrink-0"
          >
            <span>All {currentArticle.category} Articles</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Articles Cards Grid */}
        <div className={`grid ${gridColsClass} gap-6`}>
          {recommendedItems.map(({ article, matchingTags }, idx) => {
            const readingTime = calculateReadingTime(article.content);
            const displayTag = matchingTags.length > 0 ? matchingTags[0] : (article.tags && article.tags[0]);

            return (
              <article
                key={article.id}
                id={`related-article-card-${idx}`}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden h-full"
              >
                {/* Image Container */}
                <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100">
                  <Link to={`/article/${article.id}`} tabIndex={-1} aria-hidden="true">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Category Pill Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm">
                      {article.category}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <div className="absolute top-3 right-3">
                    <BookmarkButton
                      id={article.id}
                      title={article.title}
                      url={`/article/${article.id}`}
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-slate-700 shadow-sm"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tag Indicator */}
                    {displayTag && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mb-2">
                        <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">#{displayTag}</span>
                      </div>
                    )}

                    {/* Article Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                      <Link 
                        id={`related-article-link-${idx}`}
                        to={`/article/${article.id}`}
                        className="focus:outline-none focus:underline"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Metadata Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      {article.author?.avatarUrl ? (
                        <img 
                          src={article.author.avatarUrl} 
                          alt={article.author.name} 
                          className="w-5 h-5 rounded-full object-cover border border-slate-200" 
                        />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className="truncate">{article.author?.name || 'Legal Team'}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {readingTime} min
                      </span>
                      <Link
                        to={`/article/${article.id}`}
                        aria-label={`Read ${article.title}`}
                        className="p-1 rounded-md text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
