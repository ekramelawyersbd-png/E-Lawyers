const fs = require('fs');

let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

const target = `            {/* 8. Author Profile Section */}`;

const replacement = `            {/* Suggested Reading Footer Section */}
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
                      <Link to={\`/article/\${rel.id}\`} className="text-slate-700 hover:text-emerald-700 font-medium transition-colors line-clamp-1">
                        {rel.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 8. Author Profile Section */}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Article.tsx', content);
