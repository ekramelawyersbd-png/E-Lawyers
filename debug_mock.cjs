const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// I'm just going to write a small script to find undefined in mockArticles
const regex = /export const mockArticles: Article\[\] = \[([\s\S]*)\];/;
const match = content.match(regex);
if (match) {
  let str = match[1];
  console.log("Characters in mockArticles array:", str.length);
  // Just print the end of it to see if there is a trailing comma or something
  console.log("End:", str.slice(-100));
}
