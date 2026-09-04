const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// import BookmarkButton
if (!content.includes('BookmarkButton')) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { BookmarkButton } from '../components/BookmarkButton';");
}

const target = `                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h3>`;

const replacement = `                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {featuredArticle.title}
                      </h3>
                      <BookmarkButton 
                        id={featuredArticle.id} 
                        title={featuredArticle.title} 
                        url={\`/article/\${featuredArticle.id}\`}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors shrink-0" 
                      />
                    </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
