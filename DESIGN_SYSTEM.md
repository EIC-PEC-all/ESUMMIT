# PEC E-Summit '26 — Design System & Tokens 🎨

This document outlines the visual design language, color tokens, typography scales, glassmorphism specs, and component styling rules for the **PEC E-Summit '26** platform.

---

## 🎨 Color Palette & CSS Variables

The design system operates on dynamic CSS custom properties, allowing seamless switching between **Dark Void Mode** and **Light Olive Mode**.

### 1. Dark Mode (`data-theme="dark"`)

| Token | CSS Variable | Hex / Value | Description |
|---|---|---|---|
| **Void Deep** | `--bg-deep` | `#060B08` | Primary background void |
| **Panel** | `--bg-panel` | `#0B150E` | Dark glass card background |
| **Accent Mint** | `--accent-mint` | `#7ED321` | Brand primary neon green |
| **Mint Glow** | `--accent-green-glow` | `rgba(126,211,33,0.3)` | Radial glow effect |
| **Gold** | N/A | `#FFD700` | Navbar PASSES button accent |
| **Text Primary** | `--text-primary` | `#F5F5F0` | High-contrast off-white text |
| **Text Secondary** | `--text-secondary` | `#94A3B8` | Subtitle / muted text |

### 2. Light / Olive Mode (`data-theme="light"`)

| Token | CSS Variable | Hex / Value | Description |
|---|---|---|---|
| **Deep Background** | `--bg-deep` | `#F8FAFC` | Clean light canvas |
| **Panel** | `--bg-panel` | `#FFFFFF` | Elevated white card backing |
| **Accent Green** | `--accent-mint` | `#4E6527` | Deep olive green brand accent |
| **Text Primary** | `--text-primary` | `#0F172A` | Dark charcoal high-contrast text |

---

## 🔤 Typography & Font Hierarchy

- **Hero & Headings**: `Khaviax` (custom display font) & `Inter` (sans-serif, weight 800-900).
- **Data & Badges**: `JetBrains Mono` / `font-mono-data` (uppercase, tracked out `0.15em`).
- **Body & Captions**: `Inter` (weights 400, 500, 600).

---

## 🔘 Button Matrix

| Button Type | Class Spec | Target Context |
|---|---|---|
| **Solid Gold Pass** | `bg-[#FFD700] text-black font-black shadow-md` | Navbar header `/passes` CTA |
| **Neon Mint Main** | `bg-mint text-void font-bold shadow-mint-glow` | Main hero CTAs & pitch registration |
| **Dark Glass Secondary** | `bg-panel text-primary border border-border-subtle` | `EXPLORE TRACKS` & secondary buttons |
| **Ghost Outline** | `border border-mint text-mint hover:bg-mint/10` | Secondary cards & drawer triggers |

---

## ✨ Micro-Animations & Glows

- **Canvas Frame Scrubber**: 60fps scroll-driven video frame scrubbing (`NewHero.tsx` & `Vdo2Showcase`).
- **Mouse Spotlight**: Interactive radial gradient following cursor coordinates (`BurstCard` in `StatBurst`).
- **Stacked Sliced Banner**: Scroll-scrubbed multi-layered typography expansion (`StackedSlicedText.tsx`).
