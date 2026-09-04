const fs = require('fs');

const content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Regex to capture the header
const headerRegex = /([\s\S]*?export const mockArticles: Article\[\] = \[)/;
const headerMatch = content.match(headerRegex);
const header = headerMatch ? headerMatch[1] : '';

// Regex to capture articles
const articleRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?comments:\s*[^,]+,\s*\}/g;
const uniqueArticles = new Map();

let match;
while ((match = articleRegex.exec(content)) !== null) {
  const id = match[1];
  if (!uniqueArticles.has(id)) {
    uniqueArticles.set(id, match[0]);
  }
}

console.log("Found " + uniqueArticles.size + " unique articles.");

const newArticlesArray = Array.from(uniqueArticles.values()).join(',\n');
const newContent = header + '\n' + newArticlesArray + '\n];\n';

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log("mockData.ts restored successfully!");
