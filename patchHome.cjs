const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add Clock to lucide-react import
content = content.replace(
  "import { ArrowRight",
  "import { ArrowRight, Clock"
);

// Add reading time to featuredArticle
content = content.replace(
  "{format(new Date(featuredArticle.publishedAt), 'MMM d, yyyy')}</p>",
  "{format(new Date(featuredArticle.publishedAt), 'MMM d, yyyy')} • {calculateReadingTime(featuredArticle.content)} min read</p>"
);

// Add reading time to recentArticles
content = content.replace(
  "{format(new Date(article.publishedAt), 'MMM d, yyyy')}</p>",
  "{format(new Date(article.publishedAt), 'MMM d, yyyy')} • {calculateReadingTime(article.content)} min read</p>"
);

// Add reading time to popularArticles
content = content.replace(
  "<span className=\"text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1 block\">{article.category}</span>",
  `<div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{article.category}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {calculateReadingTime(article.content)} min read</span>
                    </div>`
);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log('patched Home.tsx');
