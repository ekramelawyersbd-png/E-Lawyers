const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// import
content = content.replace(
  "import { VatGuide } from './pages/VatGuide';",
  "import { VatGuide } from './pages/VatGuide';\nimport { Contact } from './pages/Contact';"
);

// route
content = content.replace(
  '<Route path="vat-guide" element={<VatGuide />} />',
  '<Route path="vat-guide" element={<VatGuide />} />\n          <Route path="contact" element={<Contact />} />'
);

fs.writeFileSync('src/App.tsx', content);
