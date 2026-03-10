# Plorea Design System — Cheat Sheet

**Storybook (live):** https://emsplorea.github.io/demo

v3.3 · For deg som vil komme raskt i gang

---

## Setup (én gang)

```bash
# Kopier tailwind.config.js fra @plorea/components/ til appen din
# Legg til i main.tsx / App.tsx:
import '@plorea/components/tokens.css'
```

```js
// tailwind.config.js i appen din
module.exports = require('./@plorea/components/tailwind.config.js')
```

---

## Tokens — hurtigreferanse

```tsx
// I style props — alltid dette, aldri hardkodet hex
'var(--color-text-primary)'      // #1A1A1A / #F0EEF5 dark
'var(--color-text-secondary)'    // #666 / #9B98A8 dark
'var(--color-surface)'           // #FFF / #1E1D24 dark
'var(--color-bg-page)'           // #FAFAFA / #16151A dark
'var(--color-border)'            // #E9E9E9 / #2E2C38 dark
'var(--color-primary)'           // #6BB8DA — CTA, dekorativ
'var(--color-secondary)'         // #468DAC — sekundære handlinger
'var(--color-accent)'            // #2E6B87 — interaktiv tekst, lenker
'var(--color-success)'           // #6BDAB2
'var(--color-warning)'           // #DADA6B
'var(--color-error)'             // #DA6B6B
'var(--color-selection)'         // #EBF6FB — valgte rader
'var(--elevation-1)'             // subtil skygge (kort, panel)
'var(--elevation-3)'             // sterk skygge (modal, sheet)
'var(--r-md)'                    // 10px — standard knapp/kort
'var(--r-lg)'                    // 14px — større kort
'var(--r-xl)'                    // 20px — sheets, modals
'var(--dur-fast)'                // 100ms — hover-states
'var(--dur-slow)'                // 240ms — slide-inn
```

```ts
// I JS (charting, canvas, framer-motion) — importer heller JS-tokens:
import { lightColors, darkColors, durations, radius } from '@plorea/components/tokens'
lightColors.accent          // '#2E6B87'
darkColors.textPrimary      // '#F0EEF5'
durations.slow              // 240
radius.lg                   // 14
```

---

## Priser — alltid øre (minor units)

```ts
// ✅ 139 kr
<CartSummary lines={[{ unitPrice: 13900 }]} />

// ✅ Formatering
import { fmtPrice } from '@plorea/components'
fmtPrice(13900)         // "139 kr"
fmtPrice(13900, 'NOK')  // "139 NOK"
fmtPrice(139)           // "1,39 kr"

// ❌ Aldri dette
<CartSummary lines={[{ unitPrice: 139 }]} />  // viser "1,39 kr"
```

---

## Komponenter — hurtigeksempler

### AppShell — ramme rundt alt

```tsx
<AppShell
  title="Bestillinger"
  navGroups={[{
    label: 'Operasjon',
    links: [
      { id: 'orders', label: 'Bestillinger', icon: <span>📋</span> },
      { id: 'menu',   label: 'Meny',         icon: <span>🍔</span> },
    ],
  }]}
  activeId="orders"
  primaryAction="Ny bestilling"
  onPrimaryAction={() => openNewOrder()}
>
  {/* innhold */}
</AppShell>
```

### OrderTable — bestillingsliste

```tsx
import type { OrderRow } from '@plorea/components'

const rows: OrderRow[] = [
  { id: '2041', channel: 'table', channelLabel: 'Bord 4',
    items: 3, status: 'ready', total: 28400, time: '12:34' },
]

<OrderTable
  rows={rows}
  density="comfortable"           // 'comfortable' | 'compact' | 'ultra'
  showDensityToggle
  selectedId={selectedId}
  onRowSelect={id => setSelected(id)}
  emptyMessage="Ingen bestillinger"
/>
```

### OrderCard — KDS-kort

```tsx
<OrderCard
  id="2041"
  channel="table"
  channelLabel="Bord 4"
  time="12:34"
  status="preparing"
  items={[
    { name: 'Classic Burger', quantity: 2, modifiers: ['Stor', 'Bacon'] },
    { name: 'Cola', quantity: 1 },
  ]}
  total={28400}
  actionLabel="Marker klar"
  onAction={() => markReady('2041')}
/>
```

### ProductCard — produktkort

```tsx
// Grid-variant (standard)
<ProductCard
  id={1}
  name="Classic Burger"
  description="Angus biff, cheddar"
  price={13900}
  image="🍔"
  variant="grid"
  onClick={() => openModal(product)}
/>

// Featured-variant (fremhevet produkt)
<ProductCard
  id={1}
  name="Dagens anbefaling"
  price={13900}
  variant="featured"
  badge={{ label: 'Hot', variant: 'hot' }}
  popular
/>
```

### CartSummary — handlekurv (kunde-vendt)

```tsx
<CartSummary
  lines={[
    { id: 'l1', name: 'Classic Burger', unitPrice: 13900, quantity: 1,
      modifiers: ['Stor', 'Bacon'] },
    { id: 'l2', name: 'Cola', unitPrice: 3900, quantity: 2 },
  ]}
  discountAmount={2000}
  discountLabel="10%"
  vatRate={0.25}
  primaryLabel="Gå til betaling"
  onPrimary={() => proceedToCheckout()}
  onQuantityChange={(id, qty) => updateCart(id, qty)}
/>
```

### PaymentSelector — velg betalingsmetode

```tsx
<PaymentSelector
  methods={[
    { id: 'card',  label: 'Kort',   icon: <span>💳</span> },
    { id: 'cash',  label: 'Kontant', icon: <span>💵</span> },
    { id: 'vipps', label: 'Vipps',  icon: <span>📱</span> },
  ]}
  amount={28400}
  onConfirm={(methodId) => processPayment(methodId)}
/>
```

### KioskShell — kiosk-ramme

```tsx
<KioskShell
  brandName="Plorea Burger"
  defaultIdle={true}
  onDineChoice={(type) => {
    // type: 'here' | 'takeaway'
    setDineType(type)
  }}
>
  <ProductGrid />
</KioskShell>
```

### PinPad — POS-innlogging

```tsx
const staff = [
  { id: '1', name: 'Maria H.', pin: '1234', role: 'Manager' },
  { id: '2', name: 'Erik S.',  pin: '5678' },
]

<PinPad
  staff={staff}
  hint="Demo: 1234"
  onSuccess={(member) => setLoggedInStaff(member)}
/>
```

### PosCart — POS-ordregjennomgang

```tsx
<PosCart
  lines={cartLines}
  discount={activeDiscount}
  staffName={staff.name}
  currency="kr"
  onEditLine={(line) => openModifierSheet(line)}
  onIncrementLine={(key) => increment(key)}
  onDecrementLine={(key) => decrement(key)}
  onPark={() => setPosView('park')}
  onDiscount={() => setPosView('discount')}
  onPay={() => setPosView('payment')}
  onBack={() => setPosView('menu')}
  onCancel={() => { if (confirm('Avbryt?')) clearCart() }}
/>
```

### PosPaymentFlow — POS-betaling

```tsx
<PosPaymentFlow
  lines={cartLines}
  discount={activeDiscount}
  total={cartTotal}
  staffName={staff.name}
  currency="kr"
  onComplete={(receipt) => {
    // receipt inneholder: id, lines, total, cashWithdraw, method, staffName, osv.
    clearCart()
    setPosView('menu')
  }}
  onClose={() => setPosView('cart')}
/>
```

---

## Hooks

```tsx
// Dark mode
import { useDarkMode } from '@plorea/components'
const { dark, toggle, setDark } = useDarkMode()

// Density
import { useDensity } from '@plorea/components'
const { density, setDensity, containerProps } = useDensity()
// Spre containerProps på wrapperen:
<div {...containerProps}>
  <OrderTable density={density} />
</div>
```

---

## Komponent-kontrakt — regler for alle komponenter

```ts
// Alle komponenter:
style?: React.CSSProperties    // layout-override, IKKE farger

// Priskomponenter:
currency?: string              // default 'kr'

// Listekomponenter (emtpy state):
emptyMessage?: string
emptyActionLabel?: string
onEmptyAction?: () => void

// Event-navn: alltid on{Noun}{Verb}
onRowClick, onQuantityChange, onDineChoice   // ✅
handleClick, handleChange                    // ❌
```

---

## De 10 UX-reglene (kortversjon)

```
1 — Maks 2 trykk til enhver handling fra produktgrid
2 — Ingen skjulte handlinger — alt synlig på skjermen
3 — Primærhandling alltid synlig — aldri scrollet bort
4 — Blokker aldri kassereren — optimistiske oppdateringer alltid
5 — Feedback under 100ms — :active-state på alle knapper
6 — Farge = state — grønn er klar, gul er i arbeid, rød er feil
7 — Én tydelig fokus per skjerm — én primærknapp, alltid blå
8 — Priser alltid i øre (minor units)
9 — Touch-targets ≥ 44px (48px POS, 120px kiosk-valg)
10 — Destruktive handlinger krever bekreftelse
```

Fullstendig dokumentasjon: `src/docs/ux-rules.md`

---

## Tillegg til Tailwind — farger tilgjengelig som klasser

```html
<!-- Tekstfarger -->
<p class="text-plorea-primary">...</p>        <!-- #6BB8DA -->
<p class="text-plorea-secondary">...</p>      <!-- #468DAC -->
<p class="text-plorea-accent">...</p>         <!-- #2E6B87 -->

<!-- Bakgrunner -->
<div class="bg-plorea-surface">...</div>
<div class="bg-plorea-selection">...</div>

<!-- Orden og kanal — se tailwind.config.js for full liste -->
```

Men: **i komponent-kode bruk alltid `var(--color-*)` i `style`-prop**, ikke Tailwind-klasser. Tailwind-klasser er for layout og spacing i applikasjonssjiktet.
