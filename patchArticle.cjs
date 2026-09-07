const fs = require('fs');
const filePath = 'src/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The article content is wrapped in \` \` so we can replace within it.
// We only want to replace '* ' or '*   ' with '* [ ] ' inside the specific article.
// Let's use a regex to replace the content of that specific article.

const articleId = "id: 'personal-income-tax-return-submission-guide-2025-2026',";
const startIndex = content.indexOf(articleId);
if (startIndex !== -1) {
  const endIndex = content.indexOf('},', startIndex);
  let articleStr = content.substring(startIndex, endIndex);
  
  // replace '*   ' or '* ' with '* [ ] '
  articleStr = articleStr.replace(/\*\s+/g, '* [ ] ');
  
  content = content.substring(0, startIndex) + articleStr + content.substring(endIndex);
  fs.writeFileSync(filePath, content);
  console.log('Patched mockData.ts');
} else {
  console.log('Article not found');
}
