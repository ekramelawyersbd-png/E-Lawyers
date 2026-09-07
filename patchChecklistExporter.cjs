const fs = require('fs');
let content = fs.readFileSync('src/components/ChecklistExporter.tsx', 'utf8');

content = content.replace(
  "if (!hasItems) return null;",
  "// Removed: if (!hasItems) return null; -> Let's always show it if it's the checklist article."
);

content = content.replace(
  "export function ChecklistExporter({ articleId }: ChecklistExporterProps) {",
  "export function ChecklistExporter({ articleId }: ChecklistExporterProps) {\n  if (articleId !== 'personal-income-tax-return-submission-guide-2025-2026') return null;\n"
);

fs.writeFileSync('src/components/ChecklistExporter.tsx', content);
console.log('patched ChecklistExporter.tsx');
