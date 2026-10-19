# AgriMarket Admin Console

A modern admin dashboard for an agricultural marketplace platform. Platform administrators use it to verify farmers before they can sell, manage farmer trust badges, and respond to user support requests.

## Features

### 1. Admin Overview
- Key metrics: total farmers, pending verifications, approved farmers, rejected applications, active sellers, open support tickets, resolved tickets, average response time.
- "Needs Attention" panel with urgent items requiring admin action.
- Recent admin activity feed and quick links to pending verifications and open tickets.
- Top-rated farmers showcase.

### 2. Farmer Verification
- Filterable verification queue (pending, approved, rejected, suspended, incomplete) with search.
- Detailed farmer review page with profile, location, farm type, crops, phone/email, submitted documents with status, farm photos (with lightbox), and verification notes.
- Actions: approve, reject, request more information, suspend — each with a confirmation modal.
- All actions are recorded in the audit log.

### 3. Badge Management
- Seven predefined badges: Verified Farmer, Organic Certified, Trusted Seller, Fast Responder, Premium Farmer, Local Producer, High Quality Produce.
- Each badge shows criteria, holder count, and optional expiration.
- Add, remove, and edit badges; toggle badge assignments per farmer.
- Badge holders overview table.

### 4. Support Management
- Two-pane support inbox with a ticket list and conversation view.
- Ticket statuses: open, pending, resolved, escalated.
- Reply to tickets, set priority, assign to an admin, add internal notes, and close/escalate.
- Filters by user type (farmer/buyer), category, and status, plus search.

### 5. Admin Controls
- Secure admin login screen.
- Admin roles: Super Admin, Verification Officer, Support Agent — with documented permissions.
- Audit log tracking all admin actions, surfaced on the Overview and Reports pages.
- Settings tabs: Profile, Team & Roles, Security, Notifications, Integrations.

## Design
- Clean, professional green/sand palette suited to agriculture.
- Inter + Plus Jakarta Sans typography.
- 8px spacing system, status/priority chips, cards with hover states, and tasteful animations.
- Responsive layout for desktop and tablet, with a slide-in sidebar on smaller screens.

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react icons

## Getting Started

Install dependencies:

```bash
npm install
```

Configure Firebase before starting the app. Copy `.env.example` to `.env.local` and
fill in the web app configuration from the Firebase project used by AgriMarket. In
Firebase Console, enable **Authentication → Sign-in method** for **Email/Password**,
**Google**, and **Email link (passwordless)**. Add the local and production domains
to **Authentication → Settings → Authorized domains**.

Start the dev server (runs automatically in the Bolt environment):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Type-check the project:

```bash
npm run typecheck
```

## Authentication
Authentication is handled by Firebase Authentication. Create the first administrator in the
Firebase console under **Authentication → Users → Add user**, then sign in with that account.
The **Forgot?** link sends a password-reset email for an existing account.

The repository does not contain a default password or a public sign-up flow. Do not add
credentials to source control; use Firebase Authentication and rotate credentials through the
Firebase console.

## Project Structure

```
src/
  components/   Reusable UI: Shell (sidebar/topbar), chips, ui (Modal, Avatar, etc.)
  pages/        Overview, Verification, Farmers, Badges, Support, Reports, Settings, Login
  data.ts       Realistic sample data (farmers, badges, tickets, audit log)
  store.tsx     Shared data context with stateful actions
  types.ts      TypeScript domain types
  App.tsx       Routing and auth gate
```

## Notes
- All data is in-memory sample data. Actions update state live across pages but reset on reload.
- The Supabase client is available for future persistence needs.
