const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target = `  useEffect(() => {
    setSavedItems(getSavedItems());
  }, [activeTab]);`;

const replacement = `  useEffect(() => {
    setSavedItems(getSavedItems());
    
    const handleStorageChange = () => {
      setSavedItems(getSavedItems());
    };
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
  }, [activeTab]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Dashboard.tsx', content);
