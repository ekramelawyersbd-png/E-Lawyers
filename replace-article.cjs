const fs = require('fs');
const filePath = 'src/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

const oldContent = `
### 1. Private Company Registration Fee
*(Under Companies Act, 1994)*
A private limited company is one of the most common business structures in Bangladesh.

**Stamp Fees**`;

const newContent = `
### 1. Private Company Registration Fee

![Corporate Law and Documents](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000)
*(Under Companies Act, 1994)*
A private limited company is one of the most common business structures in Bangladesh.

**Stamp Fees**`;

content = content.replace(oldContent, newContent);

const oldContent2 = `
### 4. Trade Organization Registration Fee

**Stamp Fee**`;

const newContent2 = `
### 4. Trade Organization Registration Fee

![Business Meeting and Planning](https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000)

**Stamp Fee**`;

content = content.replace(oldContent2, newContent2);


const oldContent3 = `
### ১. প্রাইভেট কোম্পানি নিবন্ধন ফি
**স্ট্যাম্প ফি**`;

const newContent3 = `
### ১. প্রাইভেট কোম্পানি নিবন্ধন ফি

![Corporate Law and Documents](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000)

**স্ট্যাম্প ফি**`;

content = content.replace(oldContent3, newContent3);

const oldContent4 = `
### ৪. ট্রেড অর্গানাইজেশন নিবন্ধন ফি
**স্ট্যাম্প ফি**`;

const newContent4 = `
### ৪. ট্রেড অর্গানাইজেশন নিবন্ধন ফি

![Business Meeting and Planning](https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000)

**স্ট্যাম্প ফি**`;

content = content.replace(oldContent4, newContent4);


fs.writeFileSync(filePath, content);
console.log('Replaced');
