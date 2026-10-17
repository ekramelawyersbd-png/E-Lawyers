# Implementation Plan - Dedicated Tool Pages with Shop Protection Architecture

Transition all legal and tax tools from single-page stacked components into dedicated standalone sub-routes (e.g., `/tools/rjsc-fee-calculator`, `/tools/post-registration-checklist`, `/tools/rjsc-functions-explorer`, `/tools/rjsc-returns-filing-guide`, etc.). Wrap every tool route with Shop Page access restriction (`RequirePurchase`), ensuring each tool has a separate Shop product option. Upon purchase or checkout submission, the restricted tool opens seamlessly.

## User Intent & Requirements Alignment

Based on user requirements:
1. **Routing**: Each tool opens on its own dedicated sub-route (`/tools/<tool-slug>`) rather than scrolling down a single stacked page.
2. **Shop Page Access Restriction**:
   - Every tool link is restricted by the Shop page access control layer.
   - Each existing and newly created tool has a corresponding Shop product option in `SHOP_PRODUCTS`.
   - Submitting/purchasing the tool option on the Shop page unlocks and opens the restricted tool link immediately.
3. **Page Navigation Layout**: Header on each tool page featuring breadcrumbs back to Tools Hub, quick-switch tool dropdown, and related tools sidebar.
4. **Tools Hub Directory**: Interactive grid of feature cards with category tags that click through to individual standalone tool pages.

---

## Architecture & File Structure

```
src/
├── data/
│   └── shopProducts.ts                   # Shop products catalog matching each tool ID
├── components/
│   ├── shop/
│   │   └── RequirePurchase.tsx           # Shop purchase verification & instant unlock wrapper
│   └── tools/
│       └── ToolPageLayout.tsx            # Shared page wrapper (breadcrumbs, quick-switch dropdown, sidebar)
├── pages/
│   ├── ToolsHub.tsx                      # Clean directory index with tool grid cards & shop badges
│   └── tools/                            # Dedicated tool page wrappers wrapped in RequirePurchase
│       ├── RJscFeeCalculatorPage.tsx
│       ├── PostRegistrationChecklistPage.tsx
│       ├── RjscFunctionsExplorerPage.tsx
│       ├── RjscReturnsFilingGuidePage.tsx
│       ├── CapitalGainsTaxPage.tsx
│       ├── CorporateTaxRatePage.tsx
│       ├── WealthSurchargePage.tsx
│       ├── InvestmentRebatePage.tsx
│       ├── AgriculturalTaxPage.tsx
│       ├── MinimumTurnoverTaxPage.tsx
│       ├── DvcVerificationPage.tsx
│       └── ResourceLibraryPage.tsx
└── App.tsx                               # Route definitions for /tools and /tools/:toolSlug
```

---

## User Review Required

> [!IMPORTANT]
> - All tools will now load on dedicated URLs (e.g. `/tools/rjsc-fee-calculator`).
> - Every tool requires Shop access. If a user hasn't acquired the tool from the Shop page, they will see the Shop acquisition modal with one-click purchase/unlock capability. Upon submission, the restricted tool page unlocks immediately.

---

## Step-by-Step Proposed Implementation Plan

### Step 1: Ensure All Tools Have Shop Product Entries (`src/data/shopProducts.ts`)
- Audit `SHOP_PRODUCTS` to ensure every single tool has a matching shop product entry with a unique ID:
  - `rjsc-fee-calculator-tool`
  - `post-registration-checklist-tool`
  - `rjsc-functions-explorer-tool`
  - `rjsc-returns-filing-guide-tool`
  - `capital-gains-tax-tool`
  - `corporate-tax-tool`
  - `wealth-surcharge-tool`
  - `investment-rebate-calculator-tool`
  - `agricultural-tax-tool`
  - `minimum-turnover-tax-tool`
  - `dvc-verification-tool`
  - `resource-library-tool`

### Step 2: Create Shared `ToolPageLayout` Component
- Build `src/components/tools/ToolPageLayout.tsx` providing:
  - Header with breadcrumbs (`Tools Hub / Category / Tool Name`).
  - Quick-switch dropdown menu listing all available tools with icons, category tags, and lock/unlock indicators.
  - Related tools sidebar showing 3–4 contextually relevant tools from the same category.
  - Smooth back button to return to Tools Hub index.

### Step 3: Create Dedicated Tool Page Wrappers Protected by `RequirePurchase`
- Build page wrapper components in `src/pages/tools/`. Each page component wraps its respective tool inside `<RequirePurchase product={matchingShopProduct}>`.
- Files to create:
  - `RJscFeeCalculatorPage.tsx`
  - `PostRegistrationChecklistPage.tsx`
  - `RjscFunctionsExplorerPage.tsx`
  - `RjscReturnsFilingGuidePage.tsx`
  - `CapitalGainsTaxPage.tsx`
  - `CorporateTaxRatePage.tsx`
  - `WealthSurchargePage.tsx`
  - `InvestmentRebatePage.tsx`
  - `AgriculturalTaxPage.tsx`
  - `MinimumTurnoverTaxPage.tsx`
  - `DvcVerificationPage.tsx`
  - `ResourceLibraryPage.tsx`

### Step 4: Register Sub-Routes in `src/App.tsx`
- Map individual `/tools/<tool-slug>` routes in `App.tsx`.
- Enable scroll restoration so entering any tool route scrolls to top.

### Step 5: Refactor `ToolsHub.tsx` Directory
- Convert `ToolsHub.tsx` into a fast, searchable directory index card grid.
- Display Shop lock/unlock status badge on each tool card.
- Direct navigation links to `/tools/<tool-slug>`.
- Remove heavy inline stacked component renderings from `ToolsHub.tsx` for optimal render performance.

---

## Verification Plan

### Automated Verification
1. Run `lint_applet` to confirm zero TypeScript compilation errors or broken imports across all newly created route files and shop product maps.
2. Run `compile_applet` to ensure Vite successfully bundles all routes and components.

### Manual / Structural Verification
1. Navigate to `/tools` and verify the directory grid displays tool cards with Shop badges.
2. Click on "RJSC Business Registration Fee Calculator" -> Navigates to `/tools/rjsc-fee-calculator`.
3. If not yet purchased, verifies the Shop restriction card appears with "Add to Cart" and "Activate Instant Access / Sim Buy" options.
4. Click "Activate Instant Access" -> Confirms the restricted tool unlocks immediately and renders the interactive calculator.
5. Verify breadcrumb navigation, quick-switch tool dropdown, and related tools sidebar.
