const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { Contact } from './pages/Contact';",
  "import { Contact } from './pages/Contact';\nimport { Auth } from './pages/Auth';\nimport { AuthProvider } from './contexts/AuthContext';"
);

// Add AuthProvider
content = content.replace(
  "<BrowserRouter>",
  "<AuthProvider>\n    <BrowserRouter>"
);

content = content.replace(
  "</BrowserRouter>",
  "</BrowserRouter>\n    </AuthProvider>"
);

// Add Auth route
content = content.replace(
  '<Route path="contact" element={<Contact />} />',
  '<Route path="contact" element={<Contact />} />\n          <Route path="auth" element={<Auth />} />'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
