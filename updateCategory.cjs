const fs = require('fs');
let content = fs.readFileSync('src/pages/Category.tsx', 'utf8');

if (!content.includes('BookmarkButton')) {
  content = content.replace("import { Link, useParams } from 'react-router-dom';", "import { Link, useParams } from 'react-router-dom';\nimport { BookmarkButton } from '../components/BookmarkButton';");
}

const target = `                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                  {article.title}
                </h3>`;

const replacement = `                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <BookmarkButton 
                    id={article.id} 
                    title={article.title} 
                    url={\`/article/\${article.id}\`}
                    className="p-1.5 -mr-1.5 -mt-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors shrink-0" 
                  />
                </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Category.tsx', content);
