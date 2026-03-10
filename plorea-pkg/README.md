# Plorea Design System — v2.8

**March 2026**

This package contains two projects:

```
plorea-design-system/
├── @plorea/components/    ← Component library (build + publish this)
└── plorea-starter/        ← Starter app (run this to see everything working)
```

---

## Quick start — see it running in 2 minutes

```bash
# 1. Install deps for the component library
cd @plorea/components
npm install

# 2. Open Storybook — all 5 canonical components with live controls
npm run storybook
# → http://localhost:6006

# 3. Or run the starter app instead
cd ../plorea-starter
npm install
npm run dev
# → http://localhost:5173
```

---

## @plorea/components

The canonical component library.

### Commands

| Command | What it does |
|---------|-------------|
| `npm run storybook` | Start Storybook dev server on :6006 |
| `npm run build` | Build distributable to `dist/` |
| `npm run build:watch` | Watch mode build |
| `npm run typecheck` | Type-check without emitting |
| `npm run build-storybook` | Build static Storybook to `storybook-static/` |

### What's included

```
@plorea/components/
├── src/
│   ├── components/
│   │   ├── AppShell.tsx              + AppShell.stories.tsx
│   │   ├── OrderTable.tsx            + OrderTable.stories.tsx
│   │   ├── OrderCard.tsx             + OrderCard.stories.tsx
│   │   ├── CartSummary.tsx           + CartSummary.stories.tsx
│   │   └── PaymentSelector.tsx       + PaymentSelector.stories.tsx
│   ├── hooks/
│   │   ├── useDarkMode.ts
│   │   └── useDensity.ts
│   ├── index.ts                      ← barrel exports
│   └── Introduction.mdx              ← Storybook intro page
├── .storybook/
│   ├── main.ts
│   ├── preview.tsx                   ← dark mode toolbar, token injection
│   └── previewStyles.ts
├── tokens.css                        ← single source of truth for all tokens
├── tailwind.config.js                ← shared Tailwind config
├── vite.lib.config.ts                ← library build config
├── tsconfig.json
└── tsconfig.storybook.json
```

### Publishing to npm

After `npm run build`:

```bash
# Verify the dist output looks correct
ls dist/

# Publish (requires npm account with @plorea scope access)
npm publish --access restricted
```

Consumers install with:
```bash
npm install @plorea/components
```

And import tokens once:
```ts
// main.tsx
import '@plorea/components/tokens.css'
```

---

## plorea-starter

A minimal working app that demonstrates all 5 canonical components with realistic data.

Three views accessible from the sidebar:
- **Order Table** — OrderTable with density toggle, row selection, row actions
- **KDS View** — OrderCard grid, cards advance through state on action
- **Checkout** — CartSummary + PaymentSelector wired together end-to-end

Dark mode toggle in the topbar. Uses `useDarkMode` hook.

---

## Token architecture

```
tokens.css (:root + .dark)     ← single source of truth
       ↓
tailwind.config.js             ← references tokens via var() with hex fallbacks
       ↓
Components                     ← consume var(--color-*) only, never hardcoded hex
```

Dark mode: add `.dark` class to `<html>`.
```ts
document.documentElement.classList.toggle('dark')
```

---

## Design rules

| Rule | Detail |
|------|--------|
| Tokens only | All colours via `var(--color-*)` — never hardcoded hex in components |
| Touch targets | Min 44×44px, 48px preferred for kiosk/POS |
| Qty controls | `[-] n [+]` stepper — never a text input |
| Payment | CTA disabled until method selected — never speculative |
| Labels | Outcome-led: "Send to kitchen" not "Submit" |
| Density | Row height always follows `--row-h` token |

Full documentation: see `plorea-design-guidelines.html` (in parent project).
