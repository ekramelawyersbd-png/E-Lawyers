export interface SearchableTool {
  id: string;
  name: string;
  shortName: string;
  category: 'Tax Calculator' | 'Tax Planner' | 'Statutory Guide' | 'Compliance Reference' | 'Utility';
  description: string;
  path: string;
  iconName: 'Calculator' | 'Calendar' | 'FileText' | 'BookOpen' | 'Coins' | 'Building2' | 'FolderDown' | 'Scale' | 'Receipt' | 'ShieldCheck';
  badge?: string;
  tags: string[];
  featured?: boolean;
}

export const searchableTaxTools: SearchableTool[] = [
  {
    id: 'trade-license-guide-dncc-dscc',
    name: 'Trade License Guide (DNCC & DSCC)',
    shortName: 'Trade License Guide',
    category: 'Statutory Guide',
    description: 'Complete operational and legal guide to Trade License in Bangladesh, DNCC/DSCC requirements, application, renewal & costs.',
    path: '/article/trade-license-bangladesh-guide-dncc-dscc',
    iconName: 'Building2',
    badge: 'DNCC & DSCC',
    tags: ['trade license', 'dncc', 'dscc', 'trade license bangladesh', 'city corporation', 'trade license renewal', 'trade license cost', 'business registration', 'dhaka'],
    featured: true
  },
  {
    id: 'total-income-calculation',
    name: 'Total Income Calculation 2026–2027',
    shortName: 'Total Income & 10 Heads',
    category: 'Statutory Guide',
    description: 'Calculate Total Income (মোট আয়) across 10 statutory heads under Income Tax Act 2023 and reconcile the Section 78 3% rebate base.',
    path: '/article/total-income-calculation-bangladesh-2026-2027',
    iconName: 'Calculator',
    badge: 'IT-11GA Framework',
    tags: ['total income', 'মোট আয়', '10 heads', 'heads of income', 'salary', 'rent', 'business', 'agriculture', 'capital gains', 'section 78', 'investment rebate', 'ay 2026-27'],
    featured: true
  },
  {
    id: 'tax-return-checklist',
    name: '10 Heads Income Return Checklist',
    shortName: 'Income Return Checklist',
    category: 'Tax Planner',
    description: 'Interactive checklist to tick off all 10 statutory income heads under IT-11GA, tracking progress toward Total Income & Section 78 rebate limits.',
    path: '/article/total-income-calculation-bangladesh-2026-2027#tax-return-checklist-tool',
    iconName: 'ShieldCheck',
    badge: 'Interactive Tracker',
    tags: ['tax checklist', 'return checklist', 'total income checklist', '10 heads', 'it-11ga', 'income heads', 'income tax act 2023'],
    featured: true
  },
  {
    id: 'tax-calculator',
    name: 'Tax Calculator 2026-27',
    shortName: 'Tax Calculator',
    category: 'Tax Calculator',
    description: 'Calculate salary, business & individual income tax liability with FY 2026-27 statutory slabs and rebates.',
    path: '/tax-calculator',
    iconName: 'Calculator',
    badge: 'FY 2026-27 Updated',
    tags: ['tax calculator', 'income tax', 'individual tax', 'salary tax', 'rebate', 'slabs', 'assessment year', 'ait', 'tax rate', '2026-27', 'tax slab'],
    featured: true
  },
  {
    id: 'tax-planner',
    name: 'Individual Tax Planner',
    shortName: 'Tax Planner',
    category: 'Tax Planner',
    description: 'Strategic tax optimizer for personal income tax, investment rebates under Schedule 2, and minimum cliff taxes.',
    path: '/tax-planner',
    iconName: 'Receipt',
    badge: 'Schedule 2 Optimizer',
    tags: ['tax planner', 'planning', 'investment rebate', 'dps', 'sanchayapatra', 'life insurance', 'stocks', 'minimum tax', '82c', 'tax saving'],
    featured: true
  },
  {
    id: 'corporate-planner',
    name: 'Corporate Tax Planner',
    shortName: 'Corporate Tax',
    category: 'Tax Planner',
    description: 'Simulate corporate tax rates for Private Limited, Listed, and Non-Listed entities with RJSC statutory deductions.',
    path: '/corporate-planner',
    iconName: 'Building2',
    badge: 'Corporate',
    tags: ['corporate tax', 'corporate planner', 'company tax', 'private limited', 'public limited', 'turnover tax', 'withholding', 'rjsc', 'corporate slab'],
    featured: true
  },
  {
    id: 'tds-guide',
    name: 'TDS Reference & Deduction Rates',
    shortName: 'TDS Guide',
    category: 'Compliance Reference',
    description: 'Comprehensive withholding tax directory covering Section 89, 90, 119 rates, SRO exemptions, and certificates.',
    path: '/tds-guide',
    iconName: 'BookOpen',
    badge: 'Income Tax Act 2023',
    tags: ['tds', 'tax deducted at source', 'withholding tax', 'section 89', 'section 90', 'section 119', 'source tax', 'deduction', 'sro', 'tds rates'],
    featured: true
  },
  {
    id: 'vat-guide',
    name: 'VAT & Customs Guide (VDS)',
    shortName: 'VAT & VDS Guide',
    category: 'Statutory Guide',
    description: 'Official Value Added Tax rules, Mushak forms, withholding VAT (VDS) deduction rates, and customs guidelines.',
    path: '/vat-guide',
    iconName: 'FileText',
    badge: 'VAT Act 2012',
    tags: ['vat', 'vds', 'withholding vat', 'mushak', 'customs', 'import', 'export', 'vat return', 'vat registration', 'vat exemption'],
    featured: true
  },
  {
    id: 'policy-analysis',
    name: 'Tax Policy Analysis & SRO Impact',
    shortName: 'Tax Policy Analysis',
    category: 'Statutory Guide',
    description: 'Comparative analysis of Finance Act revisions, statutory regulatory orders (SROs), and economic policy impact.',
    path: '/policy-analysis',
    iconName: 'Scale',
    badge: 'NBR Circulars',
    tags: ['policy', 'tax policy', 'sro', 'finance act', 'gazette', 'nbr circular', 'budget 2026', 'amendment', 'statutory updates'],
    featured: false
  },
  {
    id: 'tax-refund-guide',
    name: 'Income Tax Refund Guide',
    shortName: 'Tax Refund Guide',
    category: 'Statutory Guide',
    description: 'Step-by-step statutory process for claiming tax refunds under Section 240 of the Income Tax Act 2023.',
    path: '/tax-refund-guide',
    iconName: 'Coins',
    badge: 'Section 240 Guide',
    tags: ['refund', 'tax refund', 'advance income tax', 'ait refund', 'section 240', 'overpayment', 'adjustment', 'bank account refund'],
    featured: true
  },
  {
    id: 'rjsc-fee-estimator',
    name: 'RJSC Incorporation Fee Estimator',
    shortName: 'RJSC Fee Estimator',
    category: 'Tax Calculator',
    description: 'Estimate authorized capital registration fees, stamp duty, digital certificate charges, and RJSC compliance costs.',
    path: '/tools#rjsc-fee-calculator',
    iconName: 'Calculator',
    badge: 'Incorporation',
    tags: ['rjsc', 'company incorporation', 'authorized capital', 'filing fee', 'stamp duty', 'registration', 'name clearance', 'memorandum'],
    featured: false
  },
  {
    id: 'wealth-surcharge-tool',
    name: 'Net Wealth Surcharge Visualizer',
    shortName: 'Wealth Surcharge Visualizer',
    category: 'Tax Calculator',
    description: 'Explore progressive net wealth surcharge tiers (10% to 35%) and luxury asset triggers under Section 2(86B).',
    path: '/tools#wealth-surcharge-tool',
    iconName: 'Coins',
    badge: 'Wealth Surcharge',
    tags: ['wealth surcharge', 'net assets', 'luxury tax', 'cars', 'real estate', 'section 2(86B)', 'surcharge brackets', 'wealth statement'],
    featured: false
  },
  {
    id: 'early-filing-tool',
    name: 'Early Filing Incentive Calculator',
    shortName: 'Early Filing Incentive',
    category: 'Tax Calculator',
    description: 'Calculate your statutory 5% tax rebate (up to BDT 25,000) for filing returns between July 1 and September 30.',
    path: '/tools#early-filing-tool',
    iconName: 'Calendar',
    badge: '5% Rebate',
    tags: ['early filing', '5% incentive', 'tax day', 'rebate calculator', 'early bird', 'september 30 deadline', 'incentive'],
    featured: false
  },
  {
    id: 'resource-library',
    name: 'Legal & Tax Resource Library (PDFs)',
    shortName: 'Resource Library',
    category: 'Utility',
    description: 'Download standard NDA agreements, service contracts, board resolutions, and tax return filing checklists.',
    path: '/tools#resource-library',
    iconName: 'FolderDown',
    badge: 'Downloadable Docs',
    tags: ['pdf', 'download', 'template', 'nda', 'agreement', 'checklist', 'board resolution', 'draft', 'contract', 'resource library'],
    featured: false
  },
  {
    id: 'glossary',
    name: 'Legal, Fiscal & Tax Glossary',
    shortName: 'Legal & Tax Glossary',
    category: 'Compliance Reference',
    description: 'A-to-Z repository of statutory legal definitions, corporate compliance terms, and tax jargon explained simply.',
    path: '/glossary',
    iconName: 'BookOpen',
    badge: 'Definitions Hub',
    tags: ['glossary', 'dictionary', 'definition', 'legal terms', 'tax terms', 'fiscal jargon', 'assessment', 'depreciation', 'glossary terms'],
    featured: false
  },
  {
    id: 'compliance-calendar',
    name: 'Statutory Compliance Calendar',
    shortName: 'Compliance Calendar',
    category: 'Compliance Reference',
    description: 'Interactive dashboard tracking corporate tax return due dates, monthly withholding statements, and VAT deadlines.',
    path: '/dashboard',
    iconName: 'Calendar',
    badge: 'Deadlines Tracker',
    tags: ['calendar', 'deadline', 'due date', 'statutory timeline', 'monthly returns', 'annual return', 'tax day', 'vat deadline', 'compliance calendar'],
    featured: false
  }
];
