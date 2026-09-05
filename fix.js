const fs = require('fs');
let file = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The new article is from line 51 to 216 roughly, let's just find and replace the problematic keys in the new article.
// We can use a regex to match the first object in mockArticles and replace its properties.
file = file.replace(
  /date: '2026-09-04',\s+author: 'Corporate Compliance Team',\s+category: 'Corporate Compliance',\s+readTime: '6 min read',/g,
  `categoryId: 'corporate',
    category: 'Corporate Law',
    author: mockAuthors.a1,
    publishedAt: new Date().toISOString(),
    readTime: 6,
    likes: 124,
    comments: 18,`
);

fs.writeFileSync('src/data/mockData.ts', file);
