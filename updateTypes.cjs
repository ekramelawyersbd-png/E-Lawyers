const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const replacement = `export type Category = 
  | 'Corporate Law'
  | 'Income Tax'
  | 'VAT & Customs'
  | 'Business & Startup'
  | 'Legal Documentation'
  | 'Civil & Criminal Law'
  | 'Latest Legal Updates'
  | 'Compliance'
  | 'Legal Updates'
  | 'Tax Updates'
  | 'Corporate Tax'
  | 'Accounting & Finance'
  | 'Accounting Software'
  | 'Accounticca Updates';`;

content = content.replace(/export type Category = [\s\S]*?;/, replacement);
fs.writeFileSync('src/types.ts', content);
