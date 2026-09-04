import { mockArticles } from './src/data/mockData';
let undefinedCount = 0;
let missingIdCount = 0;
for (let i = 0; i < mockArticles.length; i++) {
  if (mockArticles[i] === undefined) {
    undefinedCount++;
  } else if (!mockArticles[i].id) {
    missingIdCount++;
  }
}
console.log("Array length:", mockArticles.length);
console.log("Undefined elements:", undefinedCount);
console.log("Missing id:", missingIdCount);
