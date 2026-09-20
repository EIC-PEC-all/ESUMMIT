# E-Summit 2026 — Public Experience Portal

[![Next.js](https://img.shields.io/badge/Next.js-15.5.24-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.6-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

> The public-facing attendee portal for PEC E-Summit 2026.  
> Runs on port `3000` with interactive 3D scrubbing, real-time schedule, pass checkout, and AI Concierge.

---

## Key Highlights & User Flows

### 1. 60FPS Video Frame Scrubber (`Hero`)
- Utilizes an HTML5 `<canvas>` coupled with Web Workers and `createImageBitmap` for memory-efficient frame scrubbing across scroll progress without video decoding overhead.
- Includes adaptive quality downgrading for low-power mobile devices.

### 2. Interactive Event Portfolio (`#event-portfolio`)
- Horizontally scrollable track cards with category filtering (Hackathon, Pitch, Workshops, Competitions).
- Dynamic modal details with prize breakdown, rules, schedules, and one-click registration.

### 3. AI Festival Concierge (`Floating Assistant`)
- Integrated with Groq Cloud (Llama 3.3 70B & 3.1 8B fallback).
- Context-aware festival guide capable of parsing attendee queries and executing UI action directives (e.g. automatically scrolling to sections or highlighting schedule items).

### 4. Digital Pass Checkout (`/register`)
- Frictionless, multi-step registration flow supporting individual, student, and team passes.
- Instant Razorpay integration with automated HMAC-SHA256 digital ticket generation.

### 5. Section Anchor Navigation
- Built with smooth scrolling and dynamic header offset compensation (`-70px`).
- Deep links (`/#event-portfolio`, `/#timeline`, `/#alumni`, `/#sponsors`, `/#faq`, `/#esummit-about`) automatically synchronize with URL history and respect initial page load sequence.

---

## Tech Stack

- **Framework**: Next.js 15.5.24 (App Router)
- **UI Runtime**: React 18.3 & React DOM 18.3
- **Styling**: Tailwind CSS 3.4.6 with tailored CSS custom properties
- **Motion & Dynamics**: Framer Motion 13.1 & GSAP 3.15
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **AI Inference**: Groq Cloud SDK (`llama-3.3-70b-versatile`)
- **Backend Communication**: SWR 2.5 & Fetch API

---

## Project Structure

```text
frontend/
├── app/
│   ├── api/                    # Next.js route handlers (Auth, Groq chat, OG images)
│   ├── register/               # Multi-step pass registration page
│   ├── globals.css             # Design tokens, color system, and layout utilities
│   ├── layout.tsx              # Root HTML shell, announcement banner, and providers
│   └── page.tsx                # Single-page experience composition
├── components/
│   ├── Common/                 # Scroll transitions, banners, and edge masks
│   ├── Concierge/              # Floating AI Assistant component
│   ├── EventPortfolio/         # Interactive track showcases & modal detail cards
│   ├── Hero/                   # Frame scrubber canvas & pinned hero CTA
│   ├── Nav/                    # Responsive header & slide-over navigation drawer
│   └── ...                     # About, Speakers, Timeline, Alumni, Sponsors, FAQ
├── hooks/                      # Custom hooks (useSummitData, useHeroFrameScrubber)
├── lib/                        # API clients, constants, prefetchers, and festival metadata
└── public/                     # Image sequences, festival logos, and icons
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` LTS recommended
- **Backend API**: Running at `http://localhost:4000/api/v1` (optional for static browsing)

### 2. Local Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start development server on port 3000
npm run dev

# 5. Build for production
npm run build
npm run start
```

### 3. Environment Variables (`.env.local`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL to the NestJS backend API | `http://localhost:4000/api/v1` |
| `NEXTAUTH_SECRET` | Secret key for client session encryption | Min 32 char random string |
| `GROQ_API_KEY` | Groq Cloud API key for AI Concierge | `gsk_...` |

---

## Quality & Verification

```bash
# Production compilation
npm run build

# ESLint validation
npm run lint

# TypeScript strict typecheck
npm run typecheck
```