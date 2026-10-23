# Shop Catalog & Customer Orders — Workspace Google Sheets Synchronization Plan

Synchronize all digital product catalog items, pricing updates, and customer checkout orders from `/shop`, `/checkout`, and `/admin/shop` directly into a unified Google Spreadsheet managed inside `/workspace`, pairing real-time automatic row appending with deduplicated one-click batch synchronization.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices incorporate your confirmed answers from our planning check:

- **Confirmed Decision 1 — Unified Data Scope (`Customer Orders` + `Product Catalog Inventory`)**: Both customer checkout purchases (Order Number, Customer Details, bKash TrxID, Purchased Items, Total BDT) and product catalog inventory items (Product SKU/ID, Title, Type, Practice Area, Format, Pricing, Status) are persisted and synchronized to Google Sheets.
- **Confirmed Decision 2 — Single Unified Sheet Tab (`Shop`)**: All records are stored in a single unified tab (`Shop`) with a dedicated **Record Type** discriminator column (`Customer Order` vs. `Catalog Product`) and a shared 16-column schema so partners and operations managers can filter, pivot, and audit all Shop activity in one sheet.
- **Confirmed Decision 3 — Real-Time Automatic Sync + Manual Batch Backfill**: Every completed order on `/checkout` and product save/update in `/admin/shop` (or `/shop` catalog sync action) automatically appends or syncs to the connected Google Sheet when a Google Workspace OAuth session is active, while always persisting to the backend ledger so admins can run a 1-click deduplicated batch sync from `/workspace` at any time.

---

## 1. Overview & Core Concept

- **What It Does**: Connects the Digital Shop ecosystem (`/shop`, `/checkout`, and `/admin/shop`) to Google Sheets inside the `/workspace` hub. Every product in the statutory repository and every customer order transaction is recorded on the server and mirrored into a 16-column Google Sheet (`Accounticca × E-Lawyers — Digital Shop & Orders Master Sheet 2026`).
- **Target Audience / Persona**: Managing partners, corporate tax consultants, and operations staff at Accounticca & E-Lawyers who track digital toolkit inventory, statutory template pricing, and customer bKash/digital procurement orders in Google Workspace.
- **Key Value**: Eliminates manual bookkeeping of digital toolkit sales and catalog updates by providing a single source of truth in Google Sheets with zero duplicate rows.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Workspace Sheet Setup (`/workspace` → Google Sheets Tab)**:
     - Alongside the Recruitment and Contact & Meetings cards, a new **Shop Catalog & Orders Sheet Sync** card allows admins to paste an existing Google Spreadsheet URL/ID or click **Create Official Shop Sheet** to provision a formatted 16-column spreadsheet (`Shop` tab with frozen header row) in one click.
     - Displays live counters (Total Catalog Products, Total Customer Orders, Synced to Sheet, Pending Sync) using tabular numerals (`tabular-nums`) and provides a **Sync All Shop Info Now** button for deduplicated batch synchronization of both catalog products and customer orders.
  2. **Customer Checkout Order Capture (`/checkout` & `/shop`)**:
     - When a customer completes an order on `/checkout`, the order is saved to the server ledger (`POST /api/shop/orders`) and—if a Workspace Google token and Shop Sheet ID are active—immediately appended to the Google Sheet.
     - The order confirmation screen displays a clear verification status badge confirming whether the order was logged to the Google Sheet in real time or queued for Workspace batch sync.
     - On `/shop`, authenticated admins see a quick **Sync Shop to Workspace Sheet** action in the Admin Session bar for immediate catalog export.
  3. **Admin Catalog Management (`/admin/shop`)**:
     - Creating or updating a product in the Admin Catalog Desk saves the product to the server and automatically appends/updates its catalog record in the connected Shop Google Sheet.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Executive legal & financial workspace blending editorial authority with high-density SaaS data clarity.
  - *Color Palette & Mood*: Deep slate (`#0F172A`) and emerald/amber accents (`#059669`, `#D97706`) on clean white (`#FFFFFF`) and neutral stone (`#F8FAFC`) surfaces, adhering to a 60-30-10 color distribution and single-elevation card depth (`border border-slate-200`).
  - *Typography & Hierarchy*: Crisp sans-serif headings (`Plus Jakarta Sans`) paired with readable body copy and strict monospace tabular figures (`JetBrains Mono` / `tabular-nums`) for Reference IDs, BDT currency amounts, bKash TrxIDs, and sync counters.
  - *Component Styling & Layout*: Clean segmented filter controls (`All Shop Records`, `Customer Orders`, `Catalog Products`) in the `/workspace` ledger table, unboxed inline metadata with middle-dot (`·`) separators, and single-line action buttons (`whitespace-nowrap shrink-0`).

- **Interactive Feedback & Motion**:
  - Instant button loading states during Google Sheets API calls, toast/banner confirmation showing exact counts of newly appended products and orders vs. already-synced records, and direct external links to open the connected Google Sheet in a new tab.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Unified 16-Column Schema Across Catalog Products & Customer Orders**
  - *Chosen Approach*: Map both `Customer Order` and `Catalog Product` records into a shared, well-structured 16-column layout in the `Shop` tab:
    1. `Reference / SKU ID` (`ACC-2026-XXXXXX` for orders, `PRD-<id>` for catalog items)
    2. `Timestamp / Updated At`
    3. `Record Type` (`Customer Order` | `Catalog Product`)
    4. `Category / Practice Area`
    5. `Product Type / Fulfillment` (`Templates`, `Consultation`, `Legal Kits`, `Books & Manuals`, or `Multi-Item Order`)
    6. `Title / Order Summary`
    7. `Format / Specifications`
    8. `Unit / Original Price (BDT)`
    9. `Sale / Net Total (BDT)`
    10. `Discount / Promo Applied`
    11. `Customer / Maintainer Name`
    12. `Email Address`
    13. `Phone / WhatsApp`
    14. `Company / Organization`
    15. `Payment / TrxID / Governing Law`
    16. `Status` (`Completed Order`, `Published Live`, `Draft Hidden`)
  - *Why*: Satisfies the single unified sheet tab requirement while keeping every column meaningful and sortable for both inventory audits and revenue reconciliation.
  - *Alternatives Considered*: Separate tabs for Orders and Products (passed over per user preference for a single unified sheet tab).

- **Decision 2: Dual-Layer Persistence (Server JSON Ledger + Client/Server Google Sheets API v4)**
  - *Chosen Approach*: Persist all shop products (`data/shop-products.json`), customer orders (`data/shop-orders.json`), and the connected Shop spreadsheet configuration (`data/shop-sheet-config.json`) on the Express server while executing Google Sheets API v4 requests using the user's Workspace OAuth bearer token.
  - *Why*: Customer orders can occur when an admin is not signed into Google OAuth on that browser. Storing orders on the server ensures zero data loss and allows the admin to sync all pending orders and catalog items in one click from `/workspace`.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND VIEWS & INTERACTIONS                         │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐  │
│  │     /shop &          │  ┌──────────────────────┐  │    /workspace      │  │
│  │   /admin/shop        │  │     /checkout        │  │ (WorkspaceHub.tsx) │  │
│  │  • Catalog browsing  │  │  (CheckoutPage.tsx)  │  │  • Connect/Create  │  │
│  │  • Admin CRUD save   │  │  • Order submission  │  │    Shop Sheet      │  │
│  │  • Quick Sheet Sync  │  │  • bKash TrxID &     │  │  • 1-Click Batch   │  │
│  └──────────┬───────────┘  │    Social Auth check │  │    Sync & Ledger   │  │
│             │              └──────────┬───────────┘  └─────────┬──────────┘  │
└─────────────┼─────────────────────────┼────────────────────────┼─────────────┘
              │                         │                        │
              ▼                         ▼                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                 CLIENT SYNC SERVICE (shopSheetsSync.ts)                      │
│  • Formats Catalog Products & Customer Orders into unified 16-col rows       │
│  • Creates Official Shop Google Sheet & initializes frozen header row        │
│  • Real-time row append via Sheets API v4 + Batch deduplication by Ref ID    │
└─────────────────────────────┬──────────────────────────────────┬─────────────┘
                              │                                  │
                              ▼                                  ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────┐
│        EXPRESS BACKEND (server.ts)        │  │     GOOGLE SHEETS API v4      │
│  • GET/POST /api/shop/products            │  │  • spreadsheets.create        │
│  • GET/POST /api/shop/orders              │  │  • spreadsheets.values.get    │
│  • GET/POST /api/shop/sheet-config        │  │  • spreadsheets.values.append │
│  • POST /api/shop/sync-sheet              │  │    (Tab: "Shop" or "A1")      │
└───────────────────────────────────────────┘  └───────────────────────────────┘
```

### Data Model & State

- **`ShopOrderRecord` (Persistent Customer Order Model)**:
  - `referenceId`: Unique order token (e.g., `ACC-2026-482910`)
  - `submittedAt`: ISO timestamp of purchase
  - `customerName`, `email`, `phone`, `companyName`, `authProvider` (`google` | `facebook`)
  - `paymentMethod`, `trxId` (bKash TrxID or `FREE-ACCESS`)
  - `items`: Array of `{ productId, slug, title, category, productType, format, quantity, price }`
  - `subtotal`, `discount`, `promoCode`, `totalAmount`
  - `status`: `'Completed Order'`
  - `sheetSynced`: boolean flag & `sheetSyncedAt` timestamp
- **`ShopProduct` (Catalog Inventory Model)**:
  - Mapped with deterministic reference ID `PRD-${product.id}` so catalog items can be batch-synced alongside customer orders without duplicates.

### Interactive Component & State Mapping

- **Checkout Submission (`CheckoutPage.tsx`)**:
  - Validates Firebase social sign-in, customer contact fields, and bKash TrxID.
  - Calls `POST /api/shop/orders` to persist the order on the server.
  - Calls `appendShopRecordToSheet()` if a Shop Google Sheet is configured and a Workspace OAuth token is present, updating the order's `sheetSynced` status via `PATCH /api/shop/orders/:referenceId/sheet-status`.
- **Workspace Hub (`WorkspaceHub.tsx` — Google Sheets Tab)**:
  - Loads `/api/shop/sheet-config`, `/api/shop/orders`, and `/api/shop/products`.
  - Provides input to connect an existing Google Spreadsheet ID/URL, a **Create Official Shop Sheet** button, and a **Sync All Shop Info Now** button (`POST /api/shop/sync-sheet` / client batch sync) that reads existing Column A (`Reference / SKU ID`) values from the sheet and appends all unsynced catalog products and customer orders.
  - Renders an interactive ledger table with filter tabs (`All Records`, `Customer Orders`, `Catalog Products`) so admins can inspect every shop item and order right inside `/workspace`.
