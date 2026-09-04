const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');
const articleRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?comments:\s*[^,]+,\s*\}/g;
let match = articleRegex.exec(content);
const mockAuthors = { a1: {}, a2: {}, a3: {} };
try {
  eval('(' + match[0] + ')');
} catch (e) {
  console.log(e);
}
