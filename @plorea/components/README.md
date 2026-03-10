# @plorea/components

Canonical component library for the Plorea restaurant platform.
Design System v2.8 · March 2026

## Setup

```bash
npm install @plorea/components
```

Import tokens once in your app root (`main.tsx` or `App.tsx`):

```ts
import '@plorea/components/tokens.css'
```

Ensure your `tailwind.config.js` uses `darkMode: 'class'`.

---

## Components

### AppShell — Canonical Component 01

The fixed frame around every Plorea view.

```tsx
import { AppShell } from '@plorea/components'

<AppShell
  title="Orders"
  primaryAction="New order"
  onPrimaryAction={() => {}}
  navGroups={[
    {
      label: 'Operations',
      links: [
        { id: 'orders',   label: 'Orders'   },
        { id: 'products', label: 'Products' },
      ],
    },
  ]}
  activeId="orders"
>
  <p>Page content here</p>
</AppShell>
```

---

### OrderTable — Canonical Component 02

Primary operational list for order management. Density-aware.

```tsx
import { OrderTable } from '@plorea/components'
import type { OrderRow } from '@plorea/components'

const rows: OrderRow[] = [
  {
    id: '2041',
    channel: 'table',
    channelLabel: 'Table 4',
    items: 3,
    status: 'ready',
    total: 'kr 284',
    time: '12:34',
  },
]

<OrderTable
  rows={rows}
  showDensityToggle
  selectedId="2041"
  onRowSelect={(row) => console.log(row.id)}
  actions={[
    { icon: '✎', label: 'Edit',   onClick: (row) => {} },
    { icon: '✕', label: 'Cancel', onClick: (row) => {} },
  ]}
  totalRows={48}
  page={1}
  totalPages={5}
  onPageChange={(p) => {}}
/>
```

---

### OrderCard — Canonical Component 03

Compact single-order card for POS, KDS, and mobile grids.

```tsx
import { OrderCard } from '@plorea/components'

<OrderCard
  id="2044"
  channel="eatin"
  channelLabel="Eat-in"
  time="12:38"
  status="new"
  total="kr 348"
  items={[
    { name: 'Margherita', quantity: 2, modifiers: ['No garlic'] },
    { name: 'Tiramisu',   quantity: 1 },
  ]}
  actionLabel="Accept"
  onAction={(id) => console.log('Accept', id)}
/>
```

---

### CartSummary — Canonical Component 04

Connects product selection to payment. POS and QR/online checkout.

```tsx
import { CartSummary } from '@plorea/components'
import type { CartLine } from '@plorea/components'

const [lines, setLines] = useState<CartLine[]>([
  { id: 'l1', name: 'Margherita', unitPrice: 11900, quantity: 2 },
  { id: 'l2', name: 'Cola',       unitPrice:  3900, quantity: 1 },
])

<CartSummary
  channel="table"
  channelLabel="Table 4"
  orderRef="2041"
  lines={lines}
  discountAmount={2000}
  discountLabel="Member discount"
  vatRate={0.15}
  primaryLabel="Send to kitchen"
  secondaryLabel="Add note"
  onQuantityChange={(id, qty) => {
    setLines(prev =>
      qty === 0
        ? prev.filter(l => l.id !== id)
        : prev.map(l => l.id === id ? { ...l, quantity: qty } : l)
    )
  }}
  onPrimary={() => console.log('Send to kitchen')}
/>
```

---

### PaymentSelector — Canonical Component 05

Critical final step. No method selected on mount — always requires explicit choice.

```tsx
import { PaymentSelector } from '@plorea/components'
import type { PaymentMethod } from '@plorea/components'

const methods: PaymentMethod[] = [
  { id: 'card',  label: 'Card',  description: 'Tap, insert or swipe', icon: '💳' },
  { id: 'cash',  label: 'Cash',  description: 'Count and confirm',    icon: '💵' },
  { id: 'vipps', label: 'Vipps', description: 'QR or phone number',  icon: '📱' },
]

<PaymentSelector
  methods={methods}
  amount={37800}   // kr 378 in øre
  currency="kr"
  orderSummary="Table 4 · #2041 · 3 items"
  showSplit
  onSplitPayment={() => {}}
  onConfirm={(methodId) => console.log('Charge with', methodId)}
/>
```

---

## Hooks

### useDarkMode

```ts
import { useDarkMode } from '@plorea/components'

const { dark, toggle } = useDarkMode()
// Toggles .dark on <html>, persists to localStorage,
// respects prefers-color-scheme on first load.
```

### useDensity

```ts
import { useDensity } from '@plorea/components'

const { density, setDensity, containerProps } = useDensity('comfortable')

// Spread containerProps onto the wrapping element:
<div {...containerProps}>
  <OrderTable density={density} />
</div>
```

---

## Design rules

These components are **opinionated**. Use them as specified unless there is a strong documented reason not to.

| Rule | Detail |
|------|--------|
| Tokens only | All colours via `var(--color-*)` — never hardcoded hex |
| Density | Row height always follows `--row-h` token |
| Touch targets | Min 44×44px, 48px preferred for kiosk/POS |
| Qty controls | `[-] n [+]` stepper — never a text input |
| Payment | CTA disabled until method selected — never speculative |
| Labels | Outcome-led: "Send to kitchen" not "Submit" |

Full documentation: `plorea-design-guidelines.html`
