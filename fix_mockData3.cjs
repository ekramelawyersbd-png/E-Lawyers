const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const articleRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?comments:\s*[^,]+,\s*\}/g;
const uniqueArticles = new Map();

const mockAuthors = { a1: {}, a2: {}, a3: {} };

let match;
while ((match = articleRegex.exec(content)) !== null) {
  const id = match[1];
  let articleStr = match[0];
  try {
    eval('(' + articleStr + ')');
    if (!uniqueArticles.has(id)) {
      uniqueArticles.set(id, articleStr);
    }
  } catch (e) {
    // try to see what the error is
    // console.log(e.message);
  }
}

const headerRegex = /([\s\S]*?export const mockArticles: Article\[\] = \[)/;
const headerMatch = content.match(headerRegex);
const header = headerMatch ? headerMatch[1] : '';

const newArticlesArray = Array.from(uniqueArticles.values()).join(',\n');
const newContent = header + '\n' + newArticlesArray + '\n];\n';

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log("Kept " + uniqueArticles.size + " valid articles.");
