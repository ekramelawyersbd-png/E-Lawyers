const fs = require('fs');
const filePath = 'src/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

const newArticle = `
  {
    id: 'rjsc-registration-fees',
    title: 'RJSC Registration Fees in Bangladesh: Complete Guide',
    excerpt: 'A comprehensive guide on RJSC registration fees for private companies, public companies, societies, and partnership firms in Bangladesh.',
    content: \`![RJSC Building](https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)

# RJSC Registration Fees in Bangladesh: Complete Guide for Companies, Societies & Partnership Firms

Source: Registrar of Joint Stock Companies and Firms (RJSC), Bangladesh

---

## English Version

### Introduction
The Registrar of Joint Stock Companies and Firms (RJSC) is the government authority responsible for registering companies, societies, trade organizations, and partnership firms in Bangladesh.

Before starting a business entity, applicants must pay different types of fees, including:
- Stamp fees
- Registration fees
- Document filing fees
- Authorized capital-related fees
- Digital certificate fees (where applicable)

The exact registration cost depends on the type of organization and its structure.

### 1. Private Company Registration Fee
*(Under Companies Act, 1994)*
A private limited company is one of the most common business structures in Bangladesh.

**Stamp Fees**
| Document | Fee |
| :--- | :--- |
| Memorandum of Association (MOA) | BDT 2,000 |

*Articles of Association (AOA) - Stamp Fee:*
| Authorized Capital | Stamp Fee |
| :--- | :--- |
| Up to BDT 40,00,000 | BDT 10,000 |
| Above BDT 40,00,000 to BDT 12,00,00,000 | BDT 30,000 |
| Above BDT 12,00,00,000 | BDT 50,000 |

**Registration Fees**
A private company requires filing 6 documents (5 forms + 1 MOA & AOA).
- Calculation: 6 × BDT 200 = **BDT 1,200**

**Authorized Share Capital Fee**
| Authorized Capital | Additional Fee |
| :--- | :--- |
| Up to BDT 20,000 | No fee |
| Above BDT 20,000 to BDT 50,000 | No fee |
| Above BDT 50,000 to BDT 10,00,000 | No fee |
| Above BDT 10,00,000 to BDT 50,00,000 | BDT 80 per additional BDT 1,00,000 |
| Above BDT 50,00,000 | BDT 130 per additional BDT 1,00,000 |

- Digital Certificate Supply Fee: **BDT 0**

### 2. Public Company Registration Fee
*(Under Companies Act, 1994)*
Public companies require more documentation compared to private companies.

**Stamp Fees**
| Document | Fee |
| :--- | :--- |
| MOA | BDT 2,000 |

*Articles of Association:*
| Authorized Capital | Stamp Fee |
| :--- | :--- |
| Up to BDT 40,00,000 | BDT 10,000 |
| Above BDT 40,00,000 to BDT 12,00,00,000 | BDT 30,000 |
| Above BDT 12,00,00,000 | BDT 50,000 |

**Registration Fees**
Public companies require 7 or 8 forms + MOA & AOA.
- 8 documents = **BDT 1,600**
- 9 documents = **BDT 1,800**

**Authorized Capital Fee**
The calculation method is the same as a private company.
- Digital Certificate Fee: **BDT 0**

### 3. Foreign Company Registration Fee
Foreign companies registering in Bangladesh need to submit required documents to RJSC.

| Item | Fee |
| :--- | :--- |
| Filing 6 documents | BDT 3,000 |
| Memorandum & Articles of Association | BDT 3,000 |
| **Total basic fee** | **BDT 6,000** |

### 4. Trade Organization Registration Fee

**Stamp Fee**
- Memorandum of Association: **Free**
- Articles of Association: **BDT 300**

**Registration Fee**
- Document Filing (7 documents): 7 × BDT 400 = **BDT 2,800**

*Member-Based Fee:*
| Number of Members | Fee |
| :--- | :--- |
| Up to 20 members | BDT 1,000 |
| 20–100 members | BDT 2,500 |
| Above 100 members | BDT 300 per additional 100 members |
| Unlimited members | BDT 7,500 |

- Digital Certificate Fee: **BDT 0**

### 5. Society Registration Fee
*(Under Societies Registration Act, 1860)*

| Item | Fee |
| :--- | :--- |
| Registration Fee | BDT 15,000 |
| Registration Filing Fee | BDT 800 |
| Digital Certificate | Free |

### 6. Partnership Firm Registration Fee
*(Under Partnership Act, 1932)*

| Item | Fee |
| :--- | :--- |
| Registration Fee | BDT 5,000 |
| Registration Filing Fee | BDT 500 |
| Digital Certificate | Free |

### Summary Table
| Entity Type | Main Registration Cost |
| :--- | :--- |
| Private Company | Depends on capital + approx. BDT 1,200 filing fee |
| Public Company | Depends on capital + BDT 1,600–1,800 filing fee |
| Foreign Company | Approx. BDT 6,000 |
| Trade Organization | Filing + membership-based fee |
| Society | BDT 15,800 |
| Partnership Firm | BDT 5,500 |

---

## বাংলা সংস্করণ

### বাংলাদেশে RJSC নিবন্ধন ফি: সম্পূর্ণ গাইড
বাংলাদেশে কোনো ব্যবসা প্রতিষ্ঠান বা সংগঠন আইনগতভাবে প্রতিষ্ঠা করতে হলে যৌথমূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর (RJSC)-এ নিবন্ধন করতে হয়।

RJSC-তে নিবন্ধনের সময় সাধারণত নিচের ফিগুলো প্রদান করতে হয়:
- স্ট্যাম্প ফি
- নিবন্ধন ফি
- ডকুমেন্ট ফাইলিং ফি
- অনুমোদিত মূলধন অনুযায়ী ফি
- ডিজিটাল সার্টিফিকেট ফি

### ১. প্রাইভেট কোম্পানি নিবন্ধন ফি
**স্ট্যাম্প ফি**
- মেমোরেন্ডাম অব এসোসিয়েশন (MOA): **২,০০০ টাকা**

*আর্টিকেল অব এসোসিয়েশন (AOA):*
| অনুমোদিত মূলধন | ফি |
| :--- | :--- |
| ৪০ লাখ টাকা পর্যন্ত | ১০,০০০ টাকা |
| ৪০ লাখের বেশি থেকে ১২ কোটি টাকা পর্যন্ত | ৩০,০০০ টাকা |
| ১২ কোটির বেশি | ৫০,০০০ টাকা |

**নিবন্ধন ফি**
প্রাইভেট কোম্পানির জন্য ৫টি ফর্ম এবং ১টি MOA ও AOA (মোট ৬টি ডকুমেন্ট)।
- মোট: ৬ × ২০০ = **১,২০০ টাকা**

**অনুমোদিত শেয়ার মূলধন ফি**
| মূলধন | ফি |
| :--- | :--- |
| ২০,০০০ টাকা পর্যন্ত | শূন্য |
| ২০,০০০–৫০,০০০ টাকা | শূন্য |
| ৫০,০০০–১০ লাখ টাকা | শূন্য |
| ১০ লাখ–৫০ লাখ টাকা | প্রতি ১ লাখে ৮০ টাকা |
| ৫০ লাখের বেশি | প্রতি ১ লাখে ১৩০ টাকা |

- ডিজিটাল সার্টিফিকেট ফি: **শূন্য**

### ২. পাবলিক কোম্পানি নিবন্ধন ফি
**স্ট্যাম্প ফি**
- MOA: **২,০০০ টাকা**

*AOA:*
| অনুমোদিত মূলধন | ফি |
| :--- | :--- |
| ৪০ লাখ পর্যন্ত | ১০,০০০ টাকা |
| ৪০ লাখ–১২ কোটি | ৩০,০০০ টাকা |
| ১২ কোটির বেশি | ৫০,০০০ টাকা |

**ডকুমেন্ট ফাইলিং ফি**
- ৮টি হলে: **১,৬০০ টাকা**
- ৯টি হলে: **১,৮০০ টাকা**
অনুমোদিত মূলধনের ফি প্রাইভেট কোম্পানির মতো একই নিয়মে হিসাব করা হয়।

### ৩. বিদেশি কোম্পানি নিবন্ধন ফি
| বিষয় | ফি |
| :--- | :--- |
| ৬টি ডকুমেন্ট ফাইলিং | ৩,০০০ টাকা |
| MOA ও AOA | ৩,০০০ টাকা |
| **মোট** | **৬,০০০ টাকা** |

### ৪. ট্রেড অর্গানাইজেশন নিবন্ধন ফি
**স্ট্যাম্প ফি**
- MOA: শূন্য
- AOA: ৩০০ টাকা

**নিবন্ধন ফি**
- ডকুমেন্ট ফাইলিং: ৭ × ৪০০ = **২,৮০০ টাকা**

*সদস্য সংখ্যার ভিত্তিতে:*
| সদস্য সংখ্যা | ফি |
| :--- | :--- |
| ২০ জন পর্যন্ত | ১,০০০ টাকা |
| ২০–১০০ জন | ২,৫০০ টাকা |
| ১০০ জনের বেশি | প্রতি ১০০ জনে ৩০০ টাকা |
| অসীম সদস্য | ৭,৫০০ টাকা |

### ৫. সমিতি (Society) নিবন্ধন ফি
*(সোসাইটি নিবন্ধন আইন, ১৮৬০ অনুযায়ী)*

| বিষয় | ফি |
| :--- | :--- |
| নিবন্ধন ফি | ১৫,০০০ টাকা |
| ফাইলিং ফি | ৮০০ টাকা |
| ডিজিটাল সার্টিফিকেট | শূন্য |

### ৬. পার্টনারশিপ ফার্ম নিবন্ধন ফি
*(পার্টনারশিপ আইন, ১৯৩২ অনুযায়ী)*

| বিষয় | ফি |
| :--- | :--- |
| নিবন্ধন ফি | ৫,০০০ টাকা |
| ফাইলিং ফি | ৫০০ টাকা |
| ডিজিটাল সার্টিফিকেট | শূন্য |

### উপসংহার
RJSC নিবন্ধনের মোট খরচ নির্ভর করে প্রতিষ্ঠানের ধরন, অনুমোদিত মূলধন এবং প্রয়োজনীয় ডকুমেন্টের সংখ্যার ওপর। ব্যবসা শুরু করার আগে সঠিক প্রতিষ্ঠান কাঠামো নির্বাচন করলে ভবিষ্যতের আইনি ও আর্থিক ব্যবস্থাপনা সহজ হয়।\`,
    author: mockAuthors.a1,
    category: 'Corporate Law',
    categoryId: 'corporate',
    publishedAt: new Date().toISOString(),
    readTime: '8',
    tags: ['RJSC', 'Company Registration', 'Corporate Law', 'Business Setup', 'Bangladesh'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200&h=600'
  },`;

const replaceTarget = 'export const mockArticles: Article[] = [';
if (content.includes(replaceTarget)) {
  content = content.replace(replaceTarget, `${replaceTarget}\n${newArticle}`);
  fs.writeFileSync(filePath, content);
  console.log('Article added successfully.');
} else {
  console.error('Could not find export const mockArticles: Article[] = [');
}
