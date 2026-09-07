const fs = require('fs');
let content = fs.readFileSync('src/components/RelatedArticles.tsx', 'utf8');

content = content.replace(
  "{readingTime}m",
  "{readingTime} min"
);

fs.writeFileSync('src/components/RelatedArticles.tsx', content);
console.log('patched RelatedArticles.tsx');
