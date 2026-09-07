const fs = require('fs');

const articleData = `{
    id: 'personal-income-tax-return-submission-guide-2025-2026',
    title: 'Personal Income Tax Return Submission Guide 2025–2026',
    metaTitle: 'Personal Income Tax Return Checklist 2025-2026 Bangladesh',
    metaDescription: 'Detailed checklist of documents required for submitting a Personal Income Tax Return for the Financial Year 2025–2026 in Bangladesh.',
    excerpt: 'A comprehensive checklist and guide for individual taxpayers in Bangladesh to prepare and submit their personal income tax return for the Tax Year 2025-2026 (Income Year 2024-2025).',
    content: \`**Income Year:** 01 July 2024 to 30 June 2025  
**Tax Year:** 01 July 2025 to 30 June 2026  

Filing a personal income tax return requires proper documentation to declare income, assets, investments, expenses, and tax benefits accurately. Maintaining complete records helps taxpayers avoid complications and ensures smooth submission of the income tax return.

Below is a detailed checklist of documents required for submitting a Personal Income Tax Return for the Financial Year 2025–2026.

## 1. Primary Information of Assessee (Taxpayer)

Every taxpayer should provide the following basic documents and information:

*   e-TIN Certificate (Electronic Taxpayer Identification Number)
*   National Identity Card (NID) Copy / Passport Copy (for non-residents)
*   Recent Passport Size Photograph (especially for first-time return submission)
*   Current and Permanent Address Details
*   Previous Year's Income Tax Return Copy (if applicable)
*   Mobile Number and Email Address
*   Bank Account Information
*   Taxpayer Status Information
    *   Resident / Non-resident status
    *   Any changes in personal information

## 2. Documents Required for Employees (Income from Salary)

Individuals receiving salary income should prepare:

*   **Salary Certificate from Employer**
    *   Basic salary
    *   House rent allowance
    *   Medical allowance
    *   Bonus
    *   Other benefits
*   Monthly Salary Statement / Payslip
*   **Bank Statement** showing salary credit transactions
*   **Provident Fund Information**
    *   Employee contribution details
    *   Employer contribution details
*   Tax Deduction at Source (TDS) Certificate / Challan
*   **Investment Documents for Tax Rebate**
    *   Life insurance premium
    *   DPS contribution
    *   Approved savings instruments
    *   Pension schemes

## 3. Documents Required for Business Income

Business owners, traders, and entrepreneurs need to submit:

*   Updated Trade License
*   Business Registration Documents
*   Investment Information
*   Sales and Purchase Records
*   Profit and Loss Statement
*   Income Statement
*   Balance Sheet / Statement of Financial Position
*   Bank Account Statements Related to Business
*   VAT Documents (if applicable)
*   **Business Expense Records**
    *   Rent expenses
    *   Employee salaries
    *   Utility bills
    *   Other operational costs

## 4. Documents for House Property / Rental Income

Taxpayers earning rental income should provide:

*   House Ownership Documents
*   Rental Agreement
*   Rent Collection Receipts
*   Bank Statement Showing Rental Income
*   Property Tax / Holding Tax Documents
*   Loan Documents (if property purchased through loan)
*   Interest Payment Certificate from Bank
*   Repair and Maintenance Expense Documents
*   Other Property-Related Expenses

## 5. Other Income Documents

For additional income sources, taxpayers should provide:

**Agricultural Income:**
*   Agricultural land ownership documents
*   Income calculation details
*   Sales receipts of agricultural products
*   Proof of agricultural expenses

**Other Income:**
*   Proof of any additional income source
*   Receipt or supporting documents
*   Investment income records
*   Commission or consultancy income documents

## 6. Tax-Free Income Documents

Tax-free income must also be reported with proper evidence. Required documents may include:

*   Remittance Income Certificate
*   Foreign Income Documents
*   Dividend Income Certificate
*   Capital Gain Documents
*   Income from Government-approved tax-exempt sources
*   Final Settlement Documents with Proof of Income

## 7. Property and Asset Information Documents

Taxpayers must provide information about their assets and wealth. Required documents:

**Land and Building:**
*   Land Purchase Deed
*   Mutation Documents
*   RAJUK/Authority Approved Plan (if applicable)
*   Flat Purchase Agreement
*   Developer Agreement
*   Construction Cost Details

**Vehicles:**
*   Vehicle Registration Certificate
*   Car Purchase Invoice
*   Tax Token Information
*   Fitness Certificate

**Other Assets:**
*   Jewellery Purchase Documents
*   Furniture Purchase Information
*   Electronic Equipment Details
*   Valuable Asset Purchase Documents

**Loans:**
*   Bank Loan Certificate
*   Loan Outstanding Statement
*   Documents of Loans Given to Others

## 8. Investment, Interest, Profit & Dividend Income Documents

For investment-related income, submit:

*   Savings Certificate Profit Statement
*   Prize Bond Information
*   FDR Interest Certificate
*   DPS Profit Certificate
*   Bank Interest Certificate
*   Insurance Policy Documents
*   Life Insurance Premium Payment Certificate
*   Provident Fund Contribution Statement
*   Pension Scheme Contribution Documents
*   Zakat Fund Contribution / Donation Evidence
*   **Investment Documents**
    *   Shares
    *   Stocks
    *   Approved Debentures
    *   Mutual Funds

## 9. Documents for Tax Rebate Claim

To claim available tax rebates, taxpayers should keep:

*   Life insurance premium certificate
*   Investment certificate
*   DPS certificate
*   Approved savings instrument documents
*   Donation receipts
*   Zakat payment evidence
*   Retirement benefit contribution documents

## 10. Bank and Financial Documents

Important financial records include:

*   Personal bank statements
*   Fixed Deposit (FDR) statements
*   DPS statements
*   Loan statements
*   Credit card statements (if applicable)
*   Investment account statements

## 11. Checklist Before Submitting Your Tax Return

Before submitting your return for Tax Year 2025–2026, make sure:

*   ✅ All income sources are properly declared
*   ✅ Assets and liabilities information is updated
*   ✅ Bank statements are collected
*   ✅ Investment documents are available
*   ✅ Tax deduction certificates are collected
*   ✅ Previous year's return has been reviewed
*   ✅ Supporting documents are properly organized

> **Important Note:** The deadline for submitting an individual income tax return for the Tax Year 2025–2026 should be confirmed according to the latest notification issued by the National Board of Revenue (NBR), Bangladesh.

Submitting a complete and accurate tax return helps taxpayers maintain compliance and avoid future complications.

---

### Need Assistance with Personal Income Tax Return Submission?

Professional tax consultants can help with:

*   Individual tax return preparation
*   Income calculation
*   Asset declaration
*   Tax rebate calculation
*   Online return submission
*   Tax planning and compliance support

*Prepare your Personal Income Tax Return for Financial Year 2025–2026 with proper documentation and expert guidance.*\`,
    categoryId: 'tax',
    category: 'Income Tax',
    author: mockAuthors.a1,
    publishedAt: new Date().toISOString(),
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000',
    tags: [
      'Income Tax Return',
      'Tax Year 2025-2026',
      'Income Tax Bangladesh',
      'Tax Checklist',
      'NBR',
      'Individual Taxpayer'
    ],
    likes: 342,
    comments: 45,
    isExpertOpinion: true
  },`;

const filePath = 'src/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

const insertionPoint = 'export const mockArticles: Article[] = [';
content = content.replace(insertionPoint, insertionPoint + '\\n  ' + articleData);

fs.writeFileSync(filePath, content);
console.log('Successfully prepended the article!');
