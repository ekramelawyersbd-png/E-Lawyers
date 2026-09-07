const fs = require('fs');
let content = fs.readFileSync('src/components/ChecklistExporter.tsx', 'utf8');

content = content.replace(
  "if (items.length === 0) return;",
  `if (items.length === 0) {
      alert("No checklist items found. Check some items first to export them.");
      return;
    }`
);

fs.writeFileSync('src/components/ChecklistExporter.tsx', content);
console.log('patched ChecklistExporter warning');
