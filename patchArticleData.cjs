const fs = require('fs');

const content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const newArticle = `  {
    id: 'income-tax-calculation-guide-2026-27',
    title: 'Bangladesh Income Tax Calculation Guide 2026-27: Tax Slabs, Rebates and Examples',
    excerpt: 'A comprehensive guide explaining the updated individual income tax rates, tax-free limits, investment rebates, minimum tax requirements for 2026-27.',
    content: \`# Bangladesh Income Tax Calculation Guide 2026-27: Tax Slabs, Rebates and Examples

## Introduction

Understanding income tax calculation is essential for every taxpayer in Bangladesh. Under the **Bangladesh Finance Act 2026**, taxpayers need to calculate their taxable income, apply the applicable tax slabs, and consider available investment rebates to determine their final tax liability for the **assessment year 2026-27**.

This guide explains the updated individual income tax rates, tax-free limits, investment rebates, minimum tax requirements, and provides a practical example of tax calculation.

---

# Individual Income Tax Slabs for Assessment Year 2026-27

For a resident individual taxpayer (excluding special categories such as women, senior citizens, and disabled persons), income tax is calculated based on the following slabs:

| Taxable Income Range | Tax Rate      |
| -------------------- | ------------- |
| First Tk. 4,00,000   | 0% (Tax-Free) |
| Next Tk. 3,00,000    | 10%           |
| Next Tk. 4,00,000    | 15%           |
| Next Tk. 5,00,000    | 20%           |
| Next Tk. 10,00,000   | 25%           |
| Remaining Amount     | 30%           |

The tax is calculated progressively, meaning each portion of income is taxed according to the relevant slab.

---

# Special Tax-Free Limits for Different Taxpayers

Certain taxpayers receive additional tax-free benefits under the income tax rules.

### Women and Senior Citizens

Women taxpayers and individuals aged **65 years or above** can enjoy a higher tax-free threshold:

* First Tk. 4,50,000 of income: **Tax-Free**

### Disabled Taxpayers

Disabled persons receive a higher exemption:

* First Tk. 5,25,000 of income: **Tax-Free**

### War-Wounded Freedom Fighters

War-wounded freedom fighters receive special benefits:

* First Tk. 5,50,000 of income: **Tax-Free**

### Parents or Guardians of Disabled Persons

Parents or guardians of disabled children or dependents may receive an additional:

* Tk. 50,000 exemption for each disabled child or dependent

---

# How to Calculate Taxable Income

Before calculating tax, taxpayers must determine their taxable income.

The basic formula is:

**Total Gross Income - Allowable Exemptions = Taxable Income**

After calculating taxable income, the applicable tax slabs are applied to determine the gross tax liability.

Some categories of income, such as income from specific startup entities or special sectors, may have separate tax treatments depending on applicable regulations.

---

# Investment Tax Rebate Rules

Taxpayers can reduce their tax liability by making eligible investments. The investment rebate is calculated based on the lowest amount among the following three limits:

1. **3% of total income**
2. **15% of eligible investment amount**
3. **Maximum rebate limit of Tk. 10,00,000**

The lowest amount among these calculations will be allowed as the tax rebate.

---

# Eligible Investments for Tax Rebate

Common eligible investments include:

* Provident Fund contributions
* Life insurance premiums
* Government securities and savings certificates
* Approved investment schemes
* Zakat Fund contributions

Proper documentation should be maintained to claim investment tax benefits.

---

# Minimum Tax Requirement

Even after applying investment rebates, taxpayers may have to pay a minimum amount of tax if their taxable income exceeds the tax-free threshold.

Minimum tax depends on the taxpayer’s location:

| Location                                    | Minimum Tax |
| ------------------------------------------- | ----------- |
| Dhaka and Chattogram City Corporation areas | Tk. 5,000   |
| Other City Corporation areas                | Tk. 4,000   |
| Areas outside City Corporations             | Tk. 3,000   |

---

# Example: Income Tax Calculation on Tk. 10,00,000 Income

Suppose a resident male taxpayer has a taxable income of **Tk. 10,00,000**.

### Step 1: Apply Tax Slabs

**First Tk. 4,00,000**

Tax = 0%

**Next Tk. 3,00,000**

Tax = 10%

= Tk. 30,000

**Remaining Tk. 3,00,000**

Tax = 15%

= Tk. 45,000

### Total Gross Tax

Tk. 30,000 + Tk. 45,000

= **Tk. 75,000**

---

# Step 2: Calculate Investment Rebate

Assume the taxpayer invests **Tk. 2,00,000** in eligible investments.

Calculation:

* 3% of total income = Tk. 30,000
* 15% of investment = Tk. 30,000
* Maximum limit = Tk. 10,00,000

The lowest amount is:

**Allowed Tax Rebate = Tk. 30,000**

---

# Step 3: Final Tax Payable

Gross Tax:

Tk. 75,000

Less: Investment Rebate

Tk. 30,000

**Net Tax Payable = Tk. 45,000**

---

# Conclusion

Calculating income tax under the Bangladesh Finance Act 2026 requires understanding tax slabs, applicable exemptions, investment rebates, and minimum tax rules. Proper tax planning and eligible investments can significantly reduce overall tax liability while ensuring compliance with government regulations.

Taxpayers should maintain accurate income records and consult tax professionals when dealing with complex income sources or special tax situations.\`,
    categoryId: 'tax',
    category: 'Income Tax',
    author: mockAuthors.a1,
    publishedAt: new Date().toISOString(),
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    tags: ['Income Tax', 'Tax Rebate', 'Tax Slabs', 'Finance Act 2026', 'Bangladesh'],
    likes: 342,
    comments: 45,
    isExpertOpinion: true
  },
`;

const updatedContent = content.replace(
  'export const mockArticles: Article[] = [',
  'export const mockArticles: Article[] = [\n' + newArticle
);

fs.writeFileSync('src/data/mockData.ts', updatedContent);
