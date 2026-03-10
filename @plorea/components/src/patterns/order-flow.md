# Pattern: Order Flow

Plorea Design System v3.3

Order flow defines how an order moves through the system — from the first product tap to the kitchen confirmation. This pattern is **surface-agnostic**: POS, QR, kiosk, and online ordering all produce the same order object, and KDS + admin consume it using the same state machine.

---

## State machine

```
         ┌──────────┐
         │  (start) │
         └────┬─────┘
              │ customer places order / staff sends to kitchen
              ▼
         ┌──────────┐
         │   new    │  ← appears in KDS, order table
         └────┬─────┘
              │ kitchen acknowledges
              ▼
         ┌────────────┐
         │ preparing  │  ← kitchen is working on it
         └────┬───────┘
              │ kitchen marks ready
              ▼
         ┌──────────┐
         │  ready   │  ← at the pass, waiting for pickup/delivery
         └────┬─────┘
              │ staff confirms handoff
              ▼
         ┌───────────┐
         │ completed │  ← terminal state, archived
         └───────────┘

    From any active state:
              │ staff voids (requires confirmation)
              ▼
         ┌───────────┐
         │ cancelled │  ← terminal state, logged
         └───────────┘
```

## State definitions

| State | Token | Who triggers | Reversible |
|-------|-------|-------------|------------|
| `new` | `--color-info` | System (on payment confirmation) | No |
| `preparing` | `--color-warning` | Kitchen staff | No |
| `ready` | `--color-success` | Kitchen staff | No |
| `completed` | `--color-text-muted` | Counter/delivery staff | No |
| `cancelled` | `--color-error` | Any staff (with confirmation) | No |

State is **append-only**. The system logs every transition with a timestamp and the staff member who triggered it. This log is the audit trail — never delete it.

## Colour usage

State colours must be consistent across all surfaces. A customer who sees a green "Ready" indicator at the kiosk and a staff member who sees the same green on the KDS card must interpret them identically.

```ts
// Correct — use token variables
const stateColors: Record<OrderStatus, string> = {
  new:        'var(--color-info)',
  preparing:  'var(--color-warning)',
  ready:      'var(--color-success)',
  completed:  'var(--color-text-muted)',
  cancelled:  'var(--color-error)',
}

// Wrong — never hardcode
const stateColors = {
  new: '#6BB8DA',      // ← breaks dark mode, breaks rebranding
}
```

## Channel colours

Orders arrive on four channels. Channel colour is separate from state colour — it identifies *origin*, not *status*.

| Channel | Token group | Meaning |
|---------|-------------|---------|
| `table` | `--channel-table-*` | Dine-in, table service |
| `takeaway` | `--channel-takeaway-*` | Counter pickup |
| `eatin` | `--channel-eatin-*` | Eat-in without table (e.g. kiosk) |
| `combo` | `--channel-combo-*` | Combo deal origin |

Both channel and state are visible simultaneously in `OrderCard` and `OrderTable`.

## Components that implement this pattern

| Component | How it uses order state |
|-----------|------------------------|
| `OrderCard` | Displays state badge; staff taps to advance state |
| `OrderTable` | Row colour reflects state; column shows status badge |
| `PosCart` | Pre-order; triggers `new` state on payment confirm |

## Rules

1. **Never skip a state.** An order that goes from `new` directly to `completed` without `preparing` is a data error — surface it, don't hide it.
2. **`cancelled` requires a confirmation dialog.** No single-tap cancellation. The dialog must show the order total and item count.
3. **Ready timeout.** An order that remains `ready` for more than 15 minutes should trigger a visual alert. Implement this at the app layer via a timer — `OrderCard` exposes `readySince?: Date` for this purpose.
4. **Customer-facing devices never show order state.** Kiosk and QR surfaces show only the confirmation screen. KDS and admin surfaces show full state progression.
