const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('ShareSectionButton')) {
  content = content.replace(
    "import { BookmarkSectionButton } from '../components/BookmarkSectionButton';",
    "import { BookmarkSectionButton } from '../components/BookmarkSectionButton';\nimport { ShareSectionButton } from '../components/ShareSectionButton';"
  );
}

const target = `<BookmarkSectionButton`;
const replacement = `<ShareSectionButton 
            title="Stay Updated with Legal & Tax News"
            text="Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox."
            url="/#newsletter"
            className={isHighContrast ? '!bg-black !text-yellow-400 !border-yellow-400 hover:!bg-yellow-400 hover:!text-black' : ''}
          />
          <BookmarkSectionButton`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Home.tsx', content);
