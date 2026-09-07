const fs = require('fs');
let content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

if (!content.includes('import { calculateReadingTime }')) {
  content = content.replace(
    "import { format } from 'date-fns';",
    "import { format } from 'date-fns';\nimport { calculateReadingTime } from '../utils/readingTime';"
  );
}

if (!content.includes('Clock')) {
  content = content.replace(
    "import { Search as SearchIcon, History, X }",
    "import { Search as SearchIcon, History, X, Clock }"
  );
}

content = content.replace(
  "<span className=\"text-slate-400\">{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>",
  `<span className="text-slate-400 flex items-center gap-1">
                    {format(new Date(article.publishedAt), 'MMM d, yyyy')} • 
                    <Clock className="w-3 h-3" /> {calculateReadingTime(article.content)} min
                  </span>`
);

fs.writeFileSync('src/pages/Search.tsx', content);
console.log('patched Search.tsx');
