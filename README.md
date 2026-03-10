# Plorea Design System — v3.3

**Storybook:** https://emsplorea.github.io/demo

**For deg som skal ta dette i bruk**

---

## Start her

### Alternativ A — Null installasjon

Åpne `demo.html` i nettleseren. Ingen npm, ingen build. Alle tokens, alle
komponent-eksempler, live dark mode og interaktive demos.

### Alternativ B — Kjør starter-appen (anbefalt)

```bash
cd @plorea/components && npm install
cd ../plorea-starter  && npm install && npm run dev
# → http://localhost:5173
```

Starter-appen peker på `@plorea/components/src` via Vite-alias — ingen
publisering nødvendig. Endre en komponent og se hot reload.

### Alternativ C — Storybook (live)

**https://emsplorea.github.io/demo** ← ingen installasjon nødvendig

```bash
cd @plorea/components && npm install && npm run storybook
# → http://localhost:6006
```

---

## Hva er dette?

15 kanoniske komponenter for Plorea-plattformen i to lag:

| Lag | Komponenter | Brukes på |
|-----|------------|-----------|
| **Virtuelle surfaces** | AppShell, OrderTable, OrderCard, CartSummary, PaymentSelector, ProductCard, ProductModal, CategoryNav, ComboSuggestion, KioskShell, CheckoutFlow | Dashboard, KDS, QR, kiosk, web |
| **POS-terminal** | PinPad, PosCart, PosPaymentFlow, PosParkFlow, PosDiscountFlow, PosDrawer, PosZReport | Kun kasseterminal |

---

## Struktur

```
plorea-design-system/
├── demo.html                    ← START HER — åpnes direkte i nettleser
├── @plorea/components/
│   ├── src/
│   │   ├── components/          ← 15 komponenter + stories
│   │   ├── tokens/              ← TypeScript-tokens (colors, spacing, osv.)
│   │   ├── patterns/            ← UX-mønstre dokumentert
│   │   ├── docs/ux-rules.md     ← De 10 UX-reglene
│   │   └── component-contract.ts
│   ├── tokens.css               ← Importer EN gang i app-root
│   └── tailwind.config.js
├── plorea-starter/              ← Kjørbar demo-app
└── .github/workflows/           ← CI + release + GitHub Pages
```

---

## Grunnleggende bruk

```tsx
// main.tsx — importer tokens én gang
import '@plorea/components/tokens.css'

// Bruk komponenter
import { OrderTable, CartSummary, PinPad } from '@plorea/components'

// Alle priser i øre (minor units)
<CartSummary lines={[{ id:'1', name:'Burger', unitPrice: 13900, quantity: 1 }]} />
//                                                               ↑ 139 kr
```

### Tokens — alltid, aldri hardkodede farger

```tsx
style={{ color: 'var(--color-text-primary)' }}   // ✅
style={{ color: '#1A1A1A' }}                      // ❌ bryter dark mode
```

### Dark mode

```ts
import { useDarkMode } from '@plorea/components'
const { dark, toggle } = useDarkMode()
```

---

## Kommandoer

```bash
# @plorea/components/
npm run storybook       # Storybook :6006
npm run build           # Bygg til dist/
npm run typecheck

# plorea-starter/
npm run dev             # Demo-app :5173
```

---

## Dokumentasjon

| Spørsmål | Fil |
|----------|-----|
| Alle fargetokens | `demo.html` eller `src/tokens/colors.ts` |
| Props for komponent | Storybook eller `.tsx`-filen |
| Ordre-state-maskin | `src/patterns/order-flow.md` |
| Betalingsflyt | `src/patterns/payment-flow.md` |
| UX-regler | `src/docs/ux-rules.md` |
| Komponent-kontrakt | `src/component-contract.ts` |

---

## Repo

GitHub: https://github.com/emsplorea/demo  
Storybook (GitHub Pages): https://emsplorea.github.io/demo

> GitHub Pages aktiveres i Settings → Pages → Source: **GitHub Actions**
