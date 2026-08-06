# Contributing to PEC E-Summit '26

This document covers the workflow, conventions, and standards for contributing to the official website of PEC E-Summit '26, hosted by the Entrepreneurship and Incubation Cell (EIC), Punjab Engineering College, Chandigarh.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Branching Strategy](#branching-strategy)
- [Commit Conventions](#commit-conventions)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

**Prerequisites:** Node.js 20+, npm, Git

```bash
# Clone the repository
git clone https://github.com/EIC-PEC-all/E-Summit-26.git
cd E-Summit-26

# Install dependencies
npm install

# Start development server
npm run dev
```

Dev server runs at `http://localhost:3000`.

Before opening a PR, verify the build passes locally:

```bash
npm run typecheck
npm run lint
npm run build
```

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — deploys to live site |
| `develop` | Integration — all feature branches merge here first |
| `feature/<name>` | New UI components or sections |
| `fix/<description>` | Bug fixes — styling, layout, hydration |
| `refactor/<component>` | Performance or architectural cleanup |
| `docs/<topic>` | Documentation-only changes |

**Workflow:**

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create your branch
git checkout -b feature/interactive-timeline

# Work, commit, push
git add .
git commit -m "feat(timeline): implement GSAP scroll-driven animation"
git push origin feature/interactive-timeline
```

Open a pull request from your branch into `develop`. Do not open PRs directly to `main`.

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New component, section, or user-facing feature |
| `fix` | Bug fix — layout, hydration, scroll, logic |
| `style` | CSS, Tailwind, or token-only changes with no logic change |
| `refactor` | Code restructure that does not fix a bug or add a feature |
| `perf` | Performance improvement — frame sequence size, lazy loading |
| `docs` | README, CONTRIBUTING, DESIGN_SYSTEM, or inline comment updates |
| `chore` | Dependency updates, config changes, CI tweaks |

**Examples:**

```
feat(hero): add 60fps scroll-scrubbed frame animation
fix(navbar): correct z-index stacking on mobile
style(statburst): adjust mint glow intensity on hover
perf(sequence): compress JPEG frames to under 80KB each
docs(readme): add performance notes for frame sequences
```

Scope is optional but recommended — use the component or section name.

---

## Coding Standards

### TypeScript

- Strict mode is enabled (`"strict": true` in `tsconfig.json`). All code must be type-safe.
- No `any` types. Use proper generics or `unknown` where necessary.
- Run `npm run typecheck` before committing.

### Components

- All interactive components using hooks or Framer Motion must have `'use client'` at the top.
- Components that depend on browser-only APIs (scroll position, canvas, `window`) must be loaded via `next/dynamic` with `ssr: false`.
- Keep components focused. If a component exceeds ~300 lines, split into subcomponents.

### Styling

- Use Tailwind utility classes. Do not write raw inline styles unless interfacing with animation libraries (GSAP, Anime.js, Framer Motion).
- Use the design token aliases — `bg-void`, `text-primary`, `mint`, `font-display` — not hardcoded hex values.
- CSS custom properties are defined in `app/globals.css`. Add new tokens there if needed and alias them in `tailwind.config.js`.
- Do not hardcode `#000000` or `#FFFFFF` backgrounds on containers. Use `bg-void` and `bg-panel`.

### Button Standards

| Context | Class |
|---|---|
| Primary CTA (hero, register) | `bg-mint text-void font-bold` |
| Navigation passes button | `bg-[#FFD700] text-black font-black` |
| Secondary action | `bg-panel text-primary border border-border-subtle` |
| Ghost / outline | `border border-mint text-mint hover:bg-mint/10` |

### Performance

- Frame sequences in `public/sequence/` and `public/vdo/` must be kept under 80KB per JPEG frame.
- Do not import heavy libraries (Three.js, GSAP) at the top of pages — keep them inside the components that use them.
- Use `useReducedMotion` hook to disable animations for accessibility.

### Smooth Scroll

- Lenis is mounted globally in `SmoothScrollProvider`. Do not instantiate a second Lenis instance anywhere.
- Framer Motion `useScroll` and Lenis must not conflict — use Framer Motion's scroll hooks inside Lenis-wrapped containers without calling `lenis.stop()` unless intentionally pausing scroll.

---

## Pull Request Process

1. Branch must be up to date with `develop` before opening a PR.
2. All three checks must pass locally: `npm run typecheck`, `npm run lint`, `npm run build`.
3. CI (`ci.yml`) must pass — the PR will be blocked if lint, typecheck, or build fails.
4. PR description must include:
   - What was changed and why
   - Screenshots or a short screen recording for any visual change
5. Request a review from at least one other team member before merging.
6. Squash commits on merge to keep `develop` history clean.

---

## Organization

Entrepreneurship and Incubation Cell (EIC)
Punjab Engineering College, Sector 12, Chandigarh — 160012
Contact: eicpec@pec.edu.in
