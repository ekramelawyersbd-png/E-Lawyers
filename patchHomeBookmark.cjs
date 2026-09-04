const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Import BookmarkSectionButton
if (!content.includes('BookmarkSectionButton')) {
  content = content.replace(
    "import { CopySectionButton } from '../components/CopySectionButton';",
    "import { CopySectionButton } from '../components/CopySectionButton';\nimport { BookmarkSectionButton } from '../components/BookmarkSectionButton';"
  );
}

// 2. Add the button
const target = `<div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
          <CopySectionButton`;

const replacement = `<div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 flex items-center gap-2">
          <BookmarkSectionButton 
            id="newsletter-section" 
            title="Legal & Tax News Newsletter" 
            url="/#newsletter" 
          />
          <CopySectionButton`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Home.tsx', content);
