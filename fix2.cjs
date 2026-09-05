const fs = require('fs');
let file = fs.readFileSync('src/data/mockData.ts', 'utf8');

file = file.replace("date: '2026-09-04',", "categoryId: 'corporate',");
file = file.replace("author: 'Corporate Compliance Team',", "author: mockAuthors.a1,");
file = file.replace("category: 'Corporate Compliance',", "category: 'Corporate Law', publishedAt: new Date().toISOString(),");
file = file.replace("readTime: '6 min read',", "readTime: 6, likes: 124, comments: 18,");

fs.writeFileSync('src/data/mockData.ts', file);
