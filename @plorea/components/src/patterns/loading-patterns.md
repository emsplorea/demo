# Pattern: Loading Patterns

Plorea Design System v3.3

Loading states communicate system activity without blocking staff. The wrong loading pattern can break the cashier's flow — a spinner that freezes an order screen during a busy lunch service is a real operational problem.

---

## Rule 1 — Skeleton, not spinner

Components that fetch data show **skeleton placeholders**, not spinners.

Skeletons preserve layout. The screen does not jump when data arrives. Staff can orient themselves to the layout while data loads.

```tsx
// Correct
<OrderTable loading={isLoading} rows={rows} />
// → shows bone-coloured placeholder rows at full table height

// Wrong — do not do this
{isLoading ? <Spinner /> : <OrderTable rows={rows} />}
// → screen collapses to spinner size, then re-expands — jarring
```

When `loading={true}`:
- The component renders at its expected dimensions
- Content is replaced with pulsing skeleton elements
- Interaction is disabled (no click, no hover)

When data arrives:
- Content fades in over `--dur-slow` (240ms)
- No layout shift

---

## Rule 2 — Optimistic updates

Quantity steppers, status toggles, and state advances update the UI **immediately** on tap. The server call happens in the background.

```
staff taps "Klar" on OrderCard
  → card state immediately shows "ready" (optimistic)
  → API call fires
  → if success: nothing changes (already correct)
  → if failure: revert to previous state + show error toast
```

Do not disable the control while waiting. Do not show a spinner inside the button. The staff member should be able to continue working.

---

## Rule 3 — Progressive loading for lists

Large lists render **visible rows first**. Rows below the fold load lazily as the user scrolls.

`OrderTable` handles this via `page` + `onPageChange`. Do not load all rows at once in production.

For product grids (`ProductCard` in a grid layout), use intersection observer to lazy-load images below the fold. Load the card structure immediately; load the image on scroll.

---

## Rule 4 — Toast for background operations

Toasts are for lightweight, non-blocking feedback. They appear at the top of the screen, auto-dismiss after 2.8 seconds, and require no interaction.

Use toasts for:
- Successful background saves: "✅ Endringer lagret"
- Non-critical background errors: "⚠️ Synkronisering feilet — prøver igjen"
- Informational notices: "🅿️ Parkert: Bord 4"

**Never use toasts for:**

| Situation | Correct pattern |
|-----------|----------------|
| Payment confirmation | Full confirmed screen (1.8s animation) |
| Destructive action feedback | Confirm dialog before the action |
| Validation errors | Inline, adjacent to the invalid field |
| Loading state | Skeleton placeholder |
| Critical errors | Full error state in the component, not a toast |

Maximum 3 toasts visible simultaneously. If a 4th arrives, the oldest is dismissed.

---

## Rule 5 — Never block the cashier

Actions that take > 100ms to respond must give **immediate visual feedback** even if the operation is not complete.

```
staff taps "Betal 139 kr"
  → CTA enters loading state immediately (spinner replaces label)
  → payment flow opens (not the same as operation completing)
  → never freeze the screen waiting for a network response
```

If a payment terminal call fails to respond within 10 seconds, show a timeout error with a retry option. Never show an infinite spinner.

---

## Component loading states reference

| Component | `loading=true` behaviour |
|-----------|------------------------|
| `OrderTable` | Skeleton rows, same count as last page |
| `OrderCard` | Skeleton card, same dimensions |
| `ProductCard` | Image placeholder + text bone lines |
| `CartSummary` | Line item skeletons |
| `PaymentSelector` | Method option skeletons |
| `CheckoutFlow` | Step content skeleton, step indicators visible |
| `PosCart` | Line skeletons — header and action bar always visible |
