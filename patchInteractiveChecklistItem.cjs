const fs = require('fs');
let content = fs.readFileSync('src/components/InteractiveChecklistItem.tsx', 'utf8');

content = content.replace(
  "localStorage.setItem(storageKey, String(nextState));",
  "localStorage.setItem(storageKey, JSON.stringify({ checked: nextState, text: extractText(children) }));"
);

content = content.replace(
  "const stored = localStorage.getItem(storageKey);\n    if (stored === 'true') {\n      setIsChecked(true);\n    }",
  `const stored = localStorage.getItem(storageKey);
    if (stored) {
      if (stored === 'true') {
        setIsChecked(true);
        // Migrate to new format
        localStorage.setItem(storageKey, JSON.stringify({ checked: true, text: extractText(children) }));
      } else if (stored === 'false') {
        setIsChecked(false);
      } else {
        try {
          const parsed = JSON.parse(stored);
          setIsChecked(parsed.checked);
        } catch(e) {}
      }
    }`
);

fs.writeFileSync('src/components/InteractiveChecklistItem.tsx', content);
console.log('patched InteractiveChecklistItem.tsx');
