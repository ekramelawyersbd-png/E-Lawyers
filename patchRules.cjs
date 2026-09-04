const fs = require('fs');

let blueprint = fs.readFileSync('firebase-blueprint.json', 'utf8');
let blueprintJson = JSON.parse(blueprint);

blueprintJson.collections.push({
  "name": "favorites",
  "description": "User saved articles and policies",
  "fields": {
    "userId": "string",
    "articleId": "string",
    "title": "string",
    "url": "string",
    "type": "string",
    "createdAt": "timestamp"
  }
});
blueprintJson.relationships.push({
  "parent": "users",
  "child": "favorites",
  "type": "one-to-many"
});

fs.writeFileSync('firebase-blueprint.json', JSON.stringify(blueprintJson, null, 2));

let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  "  }\n}",
  `    
    // Favorites Collection
    match /favorites/{favoriteId} {
      allow read, update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}`
);
fs.writeFileSync('firestore.rules', rules);
console.log("Patched Rules");
