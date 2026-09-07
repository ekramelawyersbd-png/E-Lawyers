const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(
  "allow create: if request.resource.data.articleId is string",
  "allow create: if isAuthenticated() && request.resource.data.articleId is string"
);

fs.writeFileSync('firestore.rules', content);
console.log('patched rules');
