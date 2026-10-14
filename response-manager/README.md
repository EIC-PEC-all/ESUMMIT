# PEC E-Summit 2026 — Funding Conclave Response Manager

Independent response and application management platform for the PEC E-Summit 2026 Funding Conclave.

## Architecture

- **Port**: `3002`
- **Framework**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Database**: Direct MongoDB connection sharing the same database as the main frontend (`esummit.funding_conclave_applications`)
- **Theme**: Consistent cyber teal / obsidian dark mode aligned with the E-Summit 2026 Design System

## Features

- **Live Metric Dashboards**: Total submissions, shortlisting conversion rate, MoU acceptance tracker, and investor readiness.
- **Search & Multi-Filter**: Search by startup name, founder name, email, sector, or application ID. Filter by stage and review status.
- **Detailed Application Reviewer Drawer**: View full Google Form entries, open pitch decks, contact founder via WhatsApp or LinkedIn, assign 1-5 star ratings, and leave internal review notes.
- **Exporting**: One-click CSV export for offline analysis and investor sharing.
- **Status Workflows**: Move startups through stages (`PENDING_REVIEW` → `UNDER_REVIEW` → `SHORTLISTED` → `MOU_SENT` → `MOU_ACCEPTED` → `PAYMENT_CONFIRMED`).

## Run Locally

```bash
cd response-manager
npm install
npm run dev
```

Platform will run at `http://localhost:3002`.
