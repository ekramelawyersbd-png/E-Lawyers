const fs = require('fs');

let catContent = fs.readFileSync('src/pages/Category.tsx', 'utf8');
catContent = "import { BookmarkButton } from '../components/BookmarkButton';\n" + catContent;
fs.writeFileSync('src/pages/Category.tsx', catContent);

let searchContent = fs.readFileSync('src/pages/Search.tsx', 'utf8');
searchContent = "import { BookmarkButton } from '../components/BookmarkButton';\n" + searchContent;
fs.writeFileSync('src/pages/Search.tsx', searchContent);
