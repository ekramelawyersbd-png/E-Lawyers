const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.tsx', 'utf8');

const target = `  useEffect(() => {
    if (id) setIsSaved(isItemSaved(id));
  }, [id]);`;

const replacement = `  useEffect(() => {
    if (id) {
      setIsSaved(isItemSaved(id));
      
      const handleStorageChange = () => {
        setIsSaved(isItemSaved(id));
      };
      
      window.addEventListener('bookmarksUpdated', handleStorageChange);
      return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
    }
  }, [id]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Article.tsx', content);
