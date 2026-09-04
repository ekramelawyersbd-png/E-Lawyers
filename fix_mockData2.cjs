const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Find all articles. We'll manually parse them out.
const articleRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?comments:\s*[^,]+,\s*\}/g;
const uniqueArticles = new Map();

let match;
while ((match = articleRegex.exec(content)) !== null) {
  const id = match[1];
  let articleStr = match[0];
  // check if articleStr has unterminated string
  try {
    // A quick hack: see if we can append "}" and parse it using eval
    eval('(' + articleStr + ')');
    if (!uniqueArticles.has(id)) {
      uniqueArticles.set(id, articleStr);
    }
  } catch (e) {
    console.log("Skipping corrupted article " + id);
  }
}

const headerRegex = /([\s\S]*?export const mockArticles: Article\[\] = \[)/;
const headerMatch = content.match(headerRegex);
const header = headerMatch ? headerMatch[1] : '';

const newArticlesArray = Array.from(uniqueArticles.values()).join(',\n');
const newContent = header + '\n' + newArticlesArray + '\n];\n';

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log("Kept " + uniqueArticles.size + " valid articles.");
