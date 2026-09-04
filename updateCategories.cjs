const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const targetCategories = /export const categories: { id: string; name: Category; description: string }\[\] = \[\s*[\s\S]*?\s*\];/;

const replacementCategories = `export const categories: { id: string; name: Category; description: string }[] = [
  { id: 'corporate', name: 'Corporate Law', description: 'Company Registration, RJSC Compliance, Share Transfer' },
  { id: 'tax', name: 'Income Tax', description: 'Income Tax Return Filing, Tax Calculation Guide, NBR Circulars' },
  { id: 'vat', name: 'VAT & Customs', description: 'VAT Registration, VAT Return Filing, Customs Compliance' },
  { id: 'business', name: 'Business & Startup', description: 'Business Registration, Trade License, Startup Legal' },
  { id: 'legal_docs', name: 'Legal Documentation', description: 'Agreement Drafting, Legal Notices, Contracts' },
  { id: 'civil_criminal', name: 'Civil & Criminal Law', description: 'Property Law, Family Law, Litigation Process' },
  { id: 'compliance', name: 'Compliance', description: 'Business Compliance Checklist, Legal Rights' },
  { id: 'updates', name: 'Latest Legal Updates', description: 'New Laws & Amendments, Government Notifications' },
  
  // Legacy categories to keep mock articles working
  { id: 'legal', name: 'Legal Updates', description: 'Legacy Legal Category' },
  { id: 'accounting', name: 'Accounting & Finance', description: 'Legacy Accounting' },
  { id: 'software', name: 'Accounting Software', description: 'Legacy Software' },
  { id: 'accounticca', name: 'Accounticca Updates', description: 'Legacy Accounticca' }
];`;

content = content.replace(targetCategories, replacementCategories);

// Find articles with old categories and change them
content = content.replace(/categoryId: 'legal'/g, "categoryId: 'corporate'");
content = content.replace(/category: 'Legal Updates'/g, "category: 'Corporate Law'");
content = content.replace(/category: 'Tax Updates'/g, "category: 'Income Tax'");

fs.writeFileSync('src/data/mockData.ts', content);
