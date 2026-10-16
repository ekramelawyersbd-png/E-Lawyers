# Implementation Plan - Paymenter UddoktaPay Extension & Admin Tab

## User Review Required
> [!IMPORTANT]
> Please review the plan below for generating the Paymenter UddoktaPay extension package (`extensions/Gateways/uddoktapay`) and adding the dedicated Gateway tab in the Admin panel.

- **Extension Package**: We will create the complete set of files required for the Paymenter gateway extension (`gateway.json`, `UddoktaPayController.php`, gateway readme, and ZIP download generator).
- **Admin Panel Tab**: A dedicated "Paymenter Gateways & Extensions" tab in `AdminShop.tsx` allowing administrators to configure API keys, test endpoints, view gateway documentation, and download the ready-to-upload extension ZIP package directly.

## Proposed Changes

### 1. Extension Package Generation (`src/extensions/uddoktapay/`)
- Create files for the Paymenter UddoktaPay extension:
  - `gateway.json`: Metadata for Paymenter gateway registry.
  - `UddoktaPayController.php`: Gateway controller handling payment initiation, verification, and IPN callback (`/gateway/uddoktapay/ipn`).
  - `README.md`: Installation instructions for uploading to `extensions/Gateways/uddoktapay`.
- Provide a JS utility to bundle these files into a downloadable `.zip` file using `jszip` (or manual blob creation).

### 2. Admin Panel Integration (`src/pages/AdminShop.tsx`)
- Add a new tab: **Paymenter Gateways & Extensions**.
- Provide UI for configuring:
  - UddoktaPay API Key & Secret Key
  - Gateway Mode (Sandbox / Live)
  - Hosted URL configuration
- Provide a one-click **"Download UddoktaPay Extension ZIP"** button for Paymenter.
- Provide step-by-step instructions matching the user's prompt:
  1. Upload the UddoktaPay folder to `extensions/Gateways`
  2. Open Paymenter Admin Panel > Gateways > Add New
  3. Select "UddoktaPay Hosted"
  4. Enter API key, secret, and hosted URL
  5. Save & ready to accept payments

## Verification Plan
- **Automated Tests / Build**: Run `compile_applet` to ensure TypeScript compilation passes.
- **Manual Verification**: Verify tab navigation in Admin Shop, test settings persistence, and verify ZIP download functionality.
