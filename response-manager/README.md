# PEC E-Summit 2026 — Registration & Response Manager

Streamlined registration and pass management platform for PEC E-Summit 2026.

## Architecture

- **Port**: `3002`
- **Framework**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Database**: Direct MongoDB connection sharing the same database (`Registration`, `User`, `funding_conclave_applications`)
- **Theme**: Cyber mint / obsidian dark mode aligned with the E-Summit 2026 Design System

## Features

- **Form Response Compliance**: Accurately displays the actual fields collected in the Student Pass Form (Name, Email, Phone, College, Course/Year, City, State, Motive, Pass Tier) and Startup Pass Form (Name, Email, Phone, Organization, Role, Motive, Pass Tier).
- **Payment & Status Management**: Read form responses and update payment verification status (`Payment Pending`, `Shortlisted`, `Payment Confirmed`, `Rejected`).
- **Live Metrics**: Real-time counts for student delegates, confirmed passes, pass tier breakdown, campus diversity, and startup registrations.
- **One-Click Actions**: Quick-set payment confirmation, WhatsApp/email links, and internal reviewer notes.
- **Users & Sessions Directory**: Inspect registered users, active sessions, and pass linkages.
- **CSV Export**: Clean CSV exports for student registrations, startup applications, and user directory.

## Run Locally

```bash
cd response-manager
npm install
npm run dev
```

Runs at `http://localhost:3002`.
