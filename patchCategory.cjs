const fs = require('fs');
let content = fs.readFileSync('src/pages/Category.tsx', 'utf8');

if (!content.includes('Clock')) {
  content = content.replace(
    "import { BookOpen, AlertCircle, Search",
    "import { BookOpen, AlertCircle, Search, Clock"
  );
}

content = content.replace(
  "<span className=\"text-xs text-slate-500\">{calculateReadingTime(article.content)} min read</span>",
  `<span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {calculateReadingTime(article.content)} min read</span>`
);

fs.writeFileSync('src/pages/Category.tsx', content);
console.log('patched Category.tsx');
