const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

if (!content.includes('import { ChecklistExporter }')) {
  content = content.replace(
    "import { Comments } from '../components/Comments';",
    "import { Comments } from '../components/Comments';\nimport { ChecklistExporter } from '../components/ChecklistExporter';"
  );
}

content = content.replace(
  "{/* 11. Professional Comments & Peer Discussion Section */}",
  "<ChecklistExporter articleId={article.id} />\n            {/* 11. Professional Comments & Peer Discussion Section */}"
);

fs.writeFileSync('src/pages/Article.tsx', content);
console.log('patched Article.tsx');
