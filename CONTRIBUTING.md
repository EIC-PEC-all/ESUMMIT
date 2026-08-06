# Contributing to PEC E-Summit '26 🚀

Thank you for your interest in contributing to the official website of **PEC E-Summit '26** — hosted by the **Entrepreneurship and Incubation Cell (EIC), Punjab Engineering College, Chandigarh**.

This document provides a set of guidelines and standards for contributing code, features, and fixes to the codebase.

---

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Branching Strategy](#-branching-strategy)
- [Commit Message Conventions](#-commit-message-conventions)
- [Coding Standards & Guidelines](#-coding-standards--guidelines)
- [Pull Request Process](#-pull-request-process)
- [Project Architecture Overview](#-project-architecture-overview)

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher (or `pnpm` / `yarn`)
- **Git**: Installed and configured with your GitHub credentials

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EIC-PEC-all/ESUMMIT.git
   cd ESUMMIT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the live application.

4. **Verify TypeScript compilation:**
   ```bash
   npx tsc --noEmit
   ```

---

## 🌿 Branching Strategy

We follow a structured branch naming convention for organized collaboration:

| Branch Type | Naming Format | Description |
|---|---|---|
| **Production** | `main` | Production-ready stable codebase. |
| **Active Staging** | `ananay` / `manan` | Primary development branches for active feature integration. |
| **Feature** | `feature/feature-name` | New UI components or section additions. |
| **Bugfix** | `fix/bug-description` | Fixing styling, layout, or hydration issues. |
| **Refactor** | `refactor/component-name` | Performance optimizations or architectural cleanup. |

### Workflow Example

```bash
# Checkout working development branch
git checkout ananay

# Create a feature branch
git checkout -b feature/interactive-timeline

# Make changes, stage and commit
git add .
git commit -m "feat: implement GSAP scroll timeline for campus map"

# Push to remote branch
git push origin feature/interactive-timeline
```

---

## 📝 Commit Message Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org/) to maintain a clean git log:

```
<type>(<scope>): <short description>
```

### Commit Types

- `feat`: A new feature or major UI component (e.g., `feat: add 60fps frame scrubber to hero`).
- `fix`: A bug fix or layout correction (e.g., `fix: align navbar width with footer grid`).
- `style`: CSS/Tailwind styling updates, theme variables, or padding tweaks without logic changes.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `docs`: Documentation updates (e.g., README or CONTRIBUTING updates).
- `perf`: Performance improvements (e.g., image sequence optimizations).

---

## 🎨 Coding Standards & Guidelines

### 1. Theme Awareness & CSS Variables
All components must support both **Dark Mode** (`data-theme="dark"`) and **Light/Olive Theme** (`data-theme="light"`):
- Use Tailwind theme tokens like `bg-panel`, `bg-void`, `text-primary`, `text-secondary`, `text-mint`, `border-border-subtle`.
- Avoid hardcoding black/white backgrounds on text containers unless explicitly required for dedicated dark-card sections (e.g., countdown digits).

### 2. Button Styling Standards
- **Navbar PASSES Button**: Solid Gold (`bg-[#FFD700] text-black font-black`).
- **Main Action CTAs**: Neon Mint (`bg-mint text-void font-bold shadow-[0_0_25px_rgba(126,211,33,0.4)]`).
- **Secondary Actions**: Theme-aware dark/light glass panels (`bg-panel text-primary border border-border-subtle`).

### 3. Component Performance & Smooth Scroll
- Keep Canvas frame scrubbers lightweight (sample 100 frames instead of heavy 600-frame full loads).
- Ensure Framer Motion and Lenis smooth scrolling interoperate without layout shifts.
- Include `'use client'` at the top of interactive components using React hooks or Framer Motion.

---

## 📬 Pull Request Process

1. Ensure `npx tsc --noEmit` passes with **0 TypeScript errors** before opening a PR.
2. Provide a descriptive title and summary of changes in your PR description.
3. Attach screenshots or screen recordings for UI/design updates.
4. Request review from team leads before merging into `ananay` or `main`.

---

## 🏛️ Organization

**Entrepreneurship and Incubation Cell (EIC)**  
Punjab Engineering College (PEC), Sector 12, Chandigarh — 160012  
📧 **Email**: eicpec@pec.edu.in | info@ecellpec.in
