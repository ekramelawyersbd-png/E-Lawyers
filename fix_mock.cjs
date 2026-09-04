const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The file probably has a trailing comma at the end of the array, or a double comma ,,
// Let's just fix it by evaluating and writing it back, or just replacing ,, with ,
// Or better, let's just find the undefined slot.

content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, ']');

fs.writeFileSync('src/data/mockData.ts', content);
console.log("Fixed mockData.ts syntax.");
