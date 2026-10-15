# PEC E-Summit '26 — Design System

This document defines the visual language, color tokens, typography, and component styling rules for the PEC E-Summit '26 platform.

---

## Color Palette

The design system is built on CSS custom properties defined in `app/globals.css`. Tailwind aliases are configured in `tailwind.config.js`.

### Dark Mode (default)

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| Void | `--bg-void` | `#060D0B` | Deep obsidian page canvas |
| Deep | `--bg-deep` | `#081310` | Recessed backgrounds |
| Panel | `--bg-panel` | `#0D1C18` | Card and panel backgrounds |
| Panel Alt | `--bg-panel-alt` | `#12241F` | Elevated surface backgrounds |
| Cyber Mint | `--accent-mint` | `#00F5D4` | Official brand primary, CTAs, electric highlights |
| Emerald Aqua | `--accent-green` | `#00DFBA` | Secondary teal-green accent |
| Cyber Blue | `--accent-blue` | `#3DD9FF` | Cool contrast accent matching logo curve |
| Obsidian Navy | `--accent-navy` | `#0D1C18` | Deep panel accent |
| Accent Coral | `--accent-coral` | `#FF4D3D` | Pitch competition warm accent |
| Mint Glow | `--accent-green-dim` | `rgba(0, 245, 212, 0.15)` | Radial glow, shadow effects |
| Gold | — | `#FFD700` | Highlight accents |
| Text Primary | `--text-primary` | `#FFFFFF` | Body text |
| Text Secondary | `--text-secondary` | `#94A3B8` | Subtitles, secondary labels |
| Text Muted | `--text-muted` | `#64748B` | Captions, placeholders |
| Border Subtle | `--border-subtle` | `rgba(255, 255, 255, 0.10)` | Default card borders |
| Border Panel | `--border-panel` | `rgba(255, 255, 255, 0.15)` | Panel dividers |
| Border Glow | `--border-glow` | `rgba(0, 245, 212, 0.30)` | Active / hover borders |

### Light / Olive Mode

| CSS Variable | Value | Usage |
|---|---|---|
| `--bg-void` | `#F8FAFC` | Light page canvas |
| `--bg-panel` | `#FFFFFF` | Card backgrounds |
| `--accent-mint` | `#4E6527` | Deep olive brand accent |
| `--text-primary` | `#0F172A` | Dark charcoal text |
| `--text-secondary` | `#475569` | Subdued text |

---

## Typography

Three font families are configured. All are loaded in `app/layout.tsx` and exposed as CSS variables.

| Font | Variable | Tailwind Alias | Usage |
|---|---|---|---|
| Tamrin (local OTF) | `--font-tamrin` | `font-display` / `font-tamrin` / `font-kanit` | Big headings, section titles (`h1`, `h2`, `h3`) |
| Inter (Google) | `--font-inter` | `font-body` | Body text, paragraphs, buttons |
| JetBrains Mono (Google) | `--font-jetbrains` | `font-mono` | Data labels, stat numbers, code, badges |

**Scale notes:**
- Big headings (`h1`, `h2`, `h3`): `Tamrin`, `font-display`
- Data / badge text: `font-mono`, uppercase, `letter-spacing: 0.15em`
- Body: `font-body`, weight 400–600

---

## Button Standards

| Type | Tailwind Classes | Usage |
|---|---|---|
| Primary CTA | `bg-mint text-void font-bold shadow-[0_0_25px_rgba(0,245,212,0.4)]` | Hero register, pitch CTA, main actions |
| Passes (Nav) | `bg-[#FFD700] text-black font-black` | Navbar PASSES button only |
| Secondary | `bg-panel text-primary border border-border-subtle` | Explore Tracks, secondary actions |
| Ghost Outline | `border border-mint text-mint hover:bg-mint/10` | Card triggers, drawer opens |

---

## Motion & Animation

| Effect | Implementation | Component |
|---|---|---|
| Frame scrubbing | JPEG sequence rendered to canvas, frame index driven by scroll progress | `Hero/NewHero.tsx`, `Vdo2Showcase/` |
| Smooth scroll | Lenis physics-based scroll inertia, global | `Providers/SmoothScrollProvider.tsx` |
| Sticky card stack | Framer Motion `useScroll` + `useTransform`, cards pin and stack | `EsummitSpeakers/` |
| Character reveal | Text split into chars, staggered opacity/transform on scroll entry | `EsummitAbout/` |
| Mouse spotlight | Radial gradient position updated on `mousemove` | `StatBurst/` (BurstCard) |
| Marquee | CSS `marquee` / `marquee2` keyframes, dual direction | `EsummitMarquee/`, `Sponsors/` |
| Pixel transition | Canvas pixel-dissolve reveal on hover | `Alumni/` |
| Counter | Intersection Observer triggers count-up animation | `hooks/useCountUp.ts` |

**Reduced motion:** All scroll-driven and entrance animations must check `useReducedMotion()` and render a static fallback if `true`.

---

## Layout Tokens

| Class | Value | Usage |
|---|---|---|
| `section-container` | `max-width + horizontal padding` | Standard section wrapper |
| `bg-void` | CSS var backed | Page-level background |
| `noise` | CSS noise texture overlay | Applied on `<body>` |

---

## Track Accent Colors

Each event track has an assigned accent color used for card borders and icon tints:

| Track | Hex |
|---|---|
| Pitch Competition | `#FF4D3D` |
| Panel Discussions | `#3DD9FF` |
| Startup Expo | `#00F5D4` |
| Hackathon | `#A855F7` |
| Investor Networking | `#F59E0B` |
