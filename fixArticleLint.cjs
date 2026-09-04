const fs = require('fs');

let articleContent = fs.readFileSync('src/pages/Article.tsx', 'utf8');

const handlerRegex = /const handleSubmitComment = \(e: React\.FormEvent\) => \{[\s\S]*?setCommentEmail\(""\);\n  };\n/s;
articleContent = articleContent.replace(handlerRegex, "");

const stateRegex = /const \[commentText.*?\]\);\n/s;
articleContent = articleContent.replace(stateRegex, "");

fs.writeFileSync('src/pages/Article.tsx', articleContent);
