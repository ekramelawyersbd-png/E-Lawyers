const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Import CopySectionButton
if (!content.includes('CopySectionButton')) {
  content = content.replace(
    "import { format } from 'date-fns';",
    "import { format } from 'date-fns';\nimport { CopySectionButton } from '../components/CopySectionButton';"
  );
}

// 2. Modify section
const target = `<section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50 border-t border-emerald-100 text-center">`;
const replacement = `<section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50 border-t border-emerald-100 text-center relative group">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
          <CopySectionButton content="Stay Updated with Legal & Tax News\n\nSubscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.\n\nBy subscribing, you agree to our Privacy Policy and Terms of Service." />
        </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Home.tsx', content);
