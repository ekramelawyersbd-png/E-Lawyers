const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

if (!content.includes('ReadAloudButton')) {
  content = content.replace(
    "import { ReadProgress } from '../components/ReadProgress';",
    "import { ReadProgress } from '../components/ReadProgress';\nimport { ReadAloudButton } from '../components/ReadAloudButton';"
  );
}

const target = `            {/* 2-7. Article Content Area (Markdown) */}`;
const replacement = `            {/* Read Aloud controls */}
            <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-sm font-bold text-slate-500">Audio Version</span>
              <ReadAloudButton content={article.content} title={article.title} />
            </div>

            {/* 2-7. Article Content Area (Markdown) */}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Article.tsx', content);
