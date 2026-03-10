# UX Rules

Plorea Design System v3.3

These rules exist so that developers don't accidentally break the design. Each rule has a reason, a test, and examples of violations.

They apply most strictly to the **POS terminal surface**, where breaking them has direct operational consequences (queue builds up, cashier gets confused, customer gets frustrated). Most rules apply to all surfaces — the POS column notes when a rule is POS-specific.

---

## Rule 1 — Maximum 2 taps to any action

A cashier should never need more than 2 taps to reach any common action from the product grid.

| From | To | Taps |
|------|----|------|
| Product grid | Add to cart | 1 |
| Product grid | Pay | 2 (cart bar → pay) |
| Product grid | Park order | 2 (cart bar → park) |
| Product grid | Apply discount | 2 (cart bar → %) |
| Product grid | Open drawer | 1 (header icon) |
| Product grid | Z-report | 1 (header icon) |

**Violation:** Putting the payment button inside a submenu that requires navigating away from the cart.

**Test:** Time a new cashier completing their first order from product selection to receipt. If it takes more than 4 taps total, re-examine the flow.

---

## Rule 2 — No hidden actions

Every action the staff can take must be **visible on screen** without scrolling, hovering, or long-pressing.

The POS cart action bar shows all four contextual actions at once: Avbryt | 🅿️ | % | ← | Betal. None are hidden in a "more" menu.

**Violation:** Hiding the discount button behind a "•••" overflow menu.

**Exception:** The Z-report and drawer are in the header because they are session-level actions, not order-level. They are always visible — just in a different zone.

---

## Rule 3 — Primary action always visible

The primary CTA (the blue "Betal" button) must be:
- Always visible — never scrolled off screen
- Always labelled with the amount — "Betal 139 kr", not "Betal"
- Always the rightmost action in the action bar
- Disabled (but visible) only when the cart is empty

**Violation:** A cart that scrolls its action bar off screen on a short device.

**Implementation:** The action bar uses `flexShrink: 0` and `position: sticky` so it never scrolls. The product list scrolls inside a `flex: 1, overflow: auto` container above the action bar.

---

## Rule 4 — Never block the cashier

No operation may prevent the cashier from taking the next order while waiting for a result.

This means:
- Payment confirmation screen auto-dismisses after 1.8 seconds — the cashier does not need to tap "close"
- Printer failures show a warning but do not block the screen — the order is logged regardless
- Network errors degrade gracefully — the local session continues, syncs when connection returns
- Loading states never show a full-screen spinner that prevents all interaction

**Violation:** A printer dialog that requires the cashier to confirm "ok" before returning to the product grid.

---

## Rule 5 — Feedback under 100ms

Every tap must produce **visible feedback within 100ms**. This is the threshold of "feels instant" to a human.

| Action | Expected feedback |
|--------|------------------|
| Tap product | Card scales slightly (CSS active state) |
| Tap CTA | Button enters loading state (opacity change) |
| Tap stepper | Count updates immediately |
| Tap payment method | Method highlights immediately |
| Tap "Park" option | Sheet closes immediately, toast appears |

**CSS implementation:**
```css
button:active {
  transform: scale(0.97);
  opacity: 0.85;
  transition: transform 80ms, opacity 80ms;
}
```

The `--dur-micro: 80ms` token exists precisely for active states.

**Violation:** A button that triggers an API call before showing any visual response, causing the cashier to tap it twice.

---

## Rule 6 — Colour conveys state consistently

The same colour must mean the same thing everywhere in the system.

| Colour | Meaning | Token |
|--------|---------|-------|
| Blue (#6BB8DA) | Interactive / CTA / primary | `--color-primary` |
| Green | Success / ready / positive | `--color-success` |
| Amber/yellow | In progress / warning / parked | `--color-warning` |
| Red | Error / cancelled / destructive | `--color-error` |
| Muted/gray | Completed / inactive / metadata | `--color-text-muted` |

**Violations:**
- Using red for a non-destructive "close" button
- Using green for a "preparing" state (customers expect green = done)
- Using amber for an error (it reads as "warning", not "stop")

**The park colour (#b5a825 / amber-gold) is the only semantic colour not in the main token set.** It represents "held / waiting" — distinct from both warning (amber) and success (green). It is used only for parked orders.

---

## Rule 7 — One clear focus per screen

Every screen has exactly **one primary action**. The primary action is always the blue button on the right.

Supporting actions exist but must not compete visually with the primary:

| Zone | Hierarchy |
|------|-----------|
| Blue filled button (right) | Primary — "what you're expected to do" |
| Neutral outlined button | Secondary — "available alternatives" |
| Tinted buttons (park, discount) | Contextual — "optional modifiers" |
| Red tinted button | Destructive — "escape hatch" |

**Violation:** Two blue buttons on the same screen (e.g. "Betaling kort" AND "Betaling kontant" both styled as primary). The method selection screen shows two **neutral** large buttons — the primary CTA comes at the terminal screen, not the method selection.

---

## Additional rules for all surfaces

### Rule 8 — Prices are always in øre (minor units)

All numeric price values in the component API are in minor units (øre). Never pass kr-denominated floats.

```ts
// Correct
<CartSummary lines={[{ unitPrice: 13900, quantity: 1 }]} />  // 139 kr

// Wrong — silent bug, no type error
<CartSummary lines={[{ unitPrice: 139, quantity: 1 }]} />    // shows "1.39 kr"
```

This rule eliminates floating-point arithmetic errors in totals and split calculations.

### Rule 9 — Touch targets ≥ 44px

All interactive elements must have a minimum touch target of 44×44px (WCAG 2.5.5).

On POS terminals: 48px minimum. On kiosk dine-choice screens: 120px minimum.

Implement with `min-height` + `min-width` rather than `padding` alone, because padding does not always expand the tap target on all browsers.

### Rule 10 — Destructive actions require confirmation

Any action that cannot be undone must have a confirmation step.

| Action | Confirmation pattern |
|--------|---------------------|
| Cancel order | `confirm()` dialog with order total + item count |
| Delete parked order | 🗑️ button → confirm dialog |
| Void payment | Modal with reason field |
| Staff log out | No confirmation needed (not destructive) |

Single-tap destructive actions are not permitted, even for small amounts.
