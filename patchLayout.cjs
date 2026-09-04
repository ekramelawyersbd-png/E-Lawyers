const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');

if (!content.includes('QuickAccessDrawer')) {
  content = content.replace(
    "import { NotificationSystem } from '../NotificationSystem';",
    "import { NotificationSystem } from '../NotificationSystem';\nimport { QuickAccessDrawer } from './QuickAccessDrawer';"
  );
  
  content = content.replace(
    "<NotificationSystem />",
    "<NotificationSystem />\n      <QuickAccessDrawer />"
  );
  
  fs.writeFileSync('src/components/layout/Layout.tsx', content);
}
