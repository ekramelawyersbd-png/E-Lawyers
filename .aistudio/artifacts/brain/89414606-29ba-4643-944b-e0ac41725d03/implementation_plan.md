# Implementation Plan - Book Appointment under Contact Page

Integrate a dedicated, executive appointment booking system directly within the Contact page (`/contact`) of E-Lawyers & Accounticca, allowing corporate clients and individuals to schedule consultations across both Virtual (Google Meet) and In-Person Chamber formats.

---

## 1. User Review Required

> [!IMPORTANT]
> Based on your preferences, the appointment scheduler will feature:
> 1. **Dual Consultation Modes**: Clients can choose between **Virtual Consultation (Google Meet)** or **In-Person Chamber Consultation** (Panthapath, Dhaka Head Office).
> 2. **Tabbed Contact Experience**: An intuitive tab switch on the Contact page between **"Submit Executive Inquiry"** and **"Book Consultation Appointment"**, maintaining the existing inquiry workflow while giving appointment booking prominent, first-class status.
> 3. **Practice Area & Time Slot Selection**: Clients select their legal/tax focus (Corporate Law, Tax & VAT, Statutory Audit, RJSC Incorporation, Fractional CFO) with date selection and available BST time slots.
> 4. **Calendar Sync & Receipts**: Instant confirmation with one-click **Add to Google Calendar**, downloadable **.ics file**, and appointment reference ID.

---

## 2. Proposed Architecture & Component Plan

### A. Dedicated Component: `src/components/AppointmentBookingForm.tsx`
Create a modular appointment scheduler component with:
- **Practice Area Selector**:
  - Corporate Law & Litigation Advisory (E-Lawyers)
  - Income Tax Assessment & NBR Defense (Accounticca)
  - VAT & SD Act Compliance & Reconciliations
  - Statutory Financial Audit & Assurance
  - RJSC Company Incorporation & Secretarial
  - Fractional CFO & Corporate Finance
- **Consultation Mode Selector**:
  - **Google Meet (Virtual)**: Generates direct video conference appointment details.
  - **In-Person Chamber**: Routes to Executive Chamber at BTI Centara Grand, 144 Green Road, Panthapath, Dhaka.
- **Interactive Date & Time Slot Picker**:
  - Date selector with validation (Monday to Saturday business days, blocking past dates).
  - Time slot grid in Bangladesh Standard Time (BST): Morning (10:00 AM, 11:30 AM), Afternoon (02:30 PM, 03:45 PM), and Evening (05:00 PM, 06:15 PM).
- **Client & Matter Details**:
  - Client Full Name, Corporate Email, Phone / WhatsApp, Company / Organization name.
  - Consultation Brief / Discussion Agenda.
- **Confirmation Screen & Calendar Sync**:
  - Unique Appointment Reference ID (e.g., `APT-2026-89412`).
  - One-click Google Calendar generator (`https://calendar.google.com/calendar/render?action=TEMPLATE...`).
  - Downloadable standard `.ics` calendar invitation file.
  - Option to print confirmation receipt or book another session.
  - Persistence in Firestore (`appointments` collection) and `localStorage` for reliability.

### B. Contact Page Integration: `src/pages/Contact.tsx`
- **Tabbed Switcher on Inquiry Section**:
  - Tab 1: **Submit Executive Inquiry** (the existing matter brief form).
  - Tab 2: **Book Consultation Appointment** (the new interactive appointment booking form).
- **CTA Updates & Deep Linking**:
  - Update all "Schedule Consultation" CTAs across the page (including the hero CTA, ecosystem cards, and closing prompt) to seamlessly switch to and scroll to the appointment tab.
  - URL hash support (`#book-appointment` or `#appointment`) so external links directly activate the appointment tab.

### C. Backend & Firestore Security Rules: `firestore.rules`
- Add security rules for `appointments` collection allowing clients to create appointments and authenticated users/staff to manage them.

---

## 3. Verification Plan

### Automated Verification
- Run `compile_applet` to verify TypeScript compilation and JSX tree integrity.
- Run `lint_applet` to ensure zero linter or syntax issues.

### Manual & User Scenario Verification
1. **Tab Switching**: Visit `/contact`, verify switching between "Submit Executive Inquiry" and "Book Consultation Appointment" is smooth with zero layout shift.
2. **Mode Toggle**: Select "Google Meet (Virtual)" vs "In-Person Chamber", verify appropriate chamber address vs video link instructions update dynamically.
3. **Date & Slot Selection**: Pick upcoming dates, verify slots are selectable and past dates are prohibited.
4. **Appointment Submission**: Fill out client brief and submit, verify the confirmation receipt renders with Ref ID.
5. **Calendar Integration**: Verify clicking "Add to Google Calendar" pre-populates dates, location, and brief, and clicking "Download .ics" generates a valid iCalendar file.
6. **Hero & Footer Links**: Click "Schedule Your Consultation Today" buttons on the Contact page and confirm it opens the booking tab directly.
