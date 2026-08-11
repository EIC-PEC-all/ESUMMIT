# PEC E-Summit 2026 — High Voltage Entrepreneurship Summit

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.6-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.3-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-0.166-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

> **The flagship entrepreneurship summit of E-Cell PEC, Chandigarh.**  
> North India's premier high-voltage platform for student innovators, startup founders, venture builders, and angel investors.

---

## Overview

**PEC Summit 2026** is an immersive, high-energy web platform engineered for North India's biggest student entrepreneurship festival hosted at **Punjab Engineering College (PEC), Chandigarh**. 

Designed with a bold **"Stock Market Bull Edition"** visual theme — featuring obsidian dark mode (`#070B08`), radiant Volt Green accents (`#7ED321`), kinetic typography, interactive 3D elements, continuous GSAP scroll animations, and an integrated **AI Concierge** assistant.

---

## Key Features & Architectural Highlights

### Stock Market Bull Edition Hero (`components/EsummitHero`)
- **Live Simulated Ticker Strip**: Real-time ticker stream tracking startup indices, fundings, and stock-style market updates.
- **Magnetic Micro-Interactions**: Physics-based magnetic hover effects on primary registration buttons powered by Framer Motion springs.
- **Floating Market Badges**: Interactive 3D tilt, floating badges, and dynamic orbit rings background decor.

### Interactive 3D & Parallax Experience
- **GSAP & Lenis Smooth Scroll**: Inertial, ultra-smooth scrolling architecture provided by `@studio-freight/lenis` integrated with GSAP `ScrollTrigger`.
- **Scroll-Parallax Showcase Marquee (`components/EsummitMarquee`)**: Multi-row infinite horizontal text and visual showcases reacting dynamically to scroll position.
- **3D Speaker Grid (`components/Speakers`)**: Interactive perspective cards with 3D tilt calculations, custom border highlights, and instant track filtering.
- **Sticky Stacking Cards (`components/EsummitSpeakers`)**: Framer Motion scroll progress-driven depth stacking for highlight cards.

### AI Concierge Widget (`components/Concierge`)
- **Floating Interactive Assistant**: Dedicated AI Concierge floating widget accessible on every page.
- **Instant Summit Guidance**: Quick assistance for event timelines, track details, registration queries, pass pricing, and venue navigation.

### Dynamic Stats & Live Components
- **StatBurst Counter (`components/StatBurst`)**: Animated count-up triggers for key summit milestones (3000+ Attendees, 40+ Speakers, ₹15L+ Prize Pool).
- **Event Timeline (`components/Timeline`)**: Interactive day-by-day and track-filtered schedule viewer with expandable session descriptions.
- **Sponsors & Partners Marquee (`components/Sponsors`)**: Dynamic multi-tier sponsor showcase grid and continuous marquee.

---

## Design System & Visual Palette

| Token | Hex / Value | Application |
| :--- | :--- | :--- |
| **Obsidian Dark (Background)** | `#070B08` | Primary global background |
| **Card Surface** | `#0D140E` | High-contrast card surfaces & panels |
| **Volt Green (Primary Accent)**| `#7ED321` | High-voltage buttons, glows, metrics & badges |
| **Crimson Flame (Secondary)** | `#FF4D3D` | Pitch track tags & urgent alerts |
| **Cyan Spark (Tertiary)** | `#3DD9FF` | Deep tech, panel tags & highlights |
| **Primary Typography** | `Kanit`, sans-serif | High-impact headings & titles |
| **Data Typography** | `JetBrains Mono` / `font-mono-data` | Tickers, dates, stats & code metrics |

---

## Technology Stack

### Core Framework & Runtime
- **[Next.js 14.2.5](https://nextjs.org/)** (App Router architecture, React Server Components & Client Components)
- **[React 18](https://reactjs.org/)** & **[TypeScript 5](https://www.typescriptlang.org/)**
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** with custom PostCSS utilities & custom theme tokens

### Animation & Graphics Engine
- **[Framer Motion 11](https://www.framer.com/motion/)**: Layout animations, spring physics, gestures, dynamic scroll hooks (`useScroll`, `useTransform`, `useSpring`).
- **[GSAP 3.12](https://greensock.com/gsap/)**: ScrollTrigger timeline management & complex scroll parallax.
- **[Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / [Drei](https://github.com/pmndrs/drei)**: 3D canvas visuals, custom geometry shaders, ambient space elements.
- **[Lenis](https://lenis.darkroom.engineering/)**: Inertial smooth scroll engine.
- **[Anime.js 4](https://animejs.com/)**: SVG path and micro-interaction orchestration.

---

## Project Structure

```bash
PEC-SUMMIT/
├── app/                        # Next.js 14 App Router routes & layouts
│   ├── faq/                    # FAQ page route
│   ├── passes/                 # Pass tiers & pricing page route
│   ├── register/               # Registration & entry forms route
│   ├── schedule/               # Full event timeline & schedule route
│   ├── speakers/               # Speaker line-up page route
│   ├── sponsors/               # Sponsor ecosystem page route
│   ├── tracks/                 # Event tracks detail page route
│   ├── globals.css             # Global Tailwind directives, fonts, noise overlay
│   ├── layout.tsx              # Root layout with SmoothScroll & OpeningLoader
│   └── page.tsx                # Main high-voltage landing page composition
├── components/                 # Component Library
│   ├── Concierge/              # Floating AI Assistant Component
│   ├── EsummitAbout/           # About section with char-by-char reveal & 3D accents
│   ├── EsummitHero/            # Stock Market Bull Hero with live ticker & magnet buttons
│   ├── EsummitMarquee/         # Parallax GIF & text ticker showcase
│   ├── EsummitSpeakers/        # Sticky card stacking highlight section
│   ├── EsummitTracks/          # Numbered event tracks list & details
│   ├── FAQ/                    # Expandable FAQ accordion
│   ├── Footer/                 # Footer CTA, social handles & navigation links
│   ├── Nav/                    # Responsive header navigation & mobile drawer
│   ├── Providers/              # Smooth scroll & intro loader context providers
│   ├── Speakers/               # 3D interactive speaker cards grid
│   ├── Sponsors/               # Partner & sponsor logo marquee
│   ├── StatBurst/              # Live counter stats section
│   ├── Timeline/               # GSAP-powered day schedule timeline
│   └── ui/                     # Reusable atomic UI components (Magnet, FadeIn, RegisterButton, AnimatedText)
├── hooks/                      # Custom React Hooks (useCountUp, useReducedMotion)
├── lib/                        # Data stores, metadata & event helper functions
│   ├── data.ts                 # Festival metadata, tracks, speakers, stats, FAQ data
│   └── events.ts               # Event scheduling utilities
└── public/                     # Static assets, logos, speaker portraits, icons
```

---

## Event Tracks & Highlights

| Track | Category | Description |
| :--- | :--- | :--- |
| **Pitch Competition** | Founders Stage | Present startup decks to top VCs and angel investors for funding and mentorship. |
| **Panel Discussions** | Thought Leadership | Hard-hitting panels with founders, CXOs, and tech policy makers. |
| **Startup Expo** | Show + Tell | 30+ student & early-stage startups showcasing live products to 3,000+ attendees. |
| **24-Hour Hackathon** | 24-Hr Build | Intensive 24-hour sprint in AI, Web3, Deep-Tech, and Climate Tech. |
| **Networking Mixer** | Connect | Speed networking, 1-on-1 Investor Open Hours, and VIP social evening. |

---

## Quick Start / Local Development

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 2. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/ecellpec/pec-summit.git

# Navigate into the project directory
cd pec-summit

# Install packages
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
```bash
# Run type-checks, linting, and build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## Deployment

This application is ready for zero-config deployment on **[Vercel](https://vercel.com/)** or **[Firebase App Hosting](https://firebase.google.com/)**:

```bash
# Deploy with Vercel CLI
npx vercel
```

---

## Organized By

**E-Cell PEC (Entrepreneurship Cell)**  
*Punjab Engineering College (Deemed to be University), Sector 12, Chandigarh*

- **Website**: [ecellpec.in](https://ecellpec.in)
- **Instagram**: [@ecellpec](https://instagram.com/ecellpec)
- **LinkedIn**: [E-Cell PEC Chandigarh](https://linkedin.com/company/ecellpec)
- **Twitter / X**: [@ecellpec](https://twitter.com/ecellpec)

---

<div align="center">
  <sub>Built by E-Cell PEC Dev Team</sub>
</div>