# Plorea UI Patterns

Design System v3.3 · March 2026

Patterns are not components. A component is a reusable UI element. A pattern is a sequence of interactions and states that recurs across surfaces. Patterns define the *logic* — components implement the *pixels*.

Every surface in Plorea (POS, KDS, admin, online ordering) shares these patterns. When a pattern is respected consistently, staff develop muscle memory and customers develop trust.

---

## 1. Order Lifecycle

An order always moves forward. It never jumps backwards and it never disappears without confirmation.

### States

```
new → preparing → ready → completed
                         ↘ cancelled (from any state with staff override)
```

| State | Colour token | Meaning |
|-------|-------------|---------|
| `new` | `--color-info` | Received, not yet acknowledged |
| `preparing` | `--color-warning` | Kitchen is working on it |
| `ready` | `--color-success` | At the pass, waiting for pickup |
| `completed` | `--color-text-muted` | Handed over |
| `cancelled` | `--color-error` | Voided — always requires confirmation |

### Rules

- State changes are **always staff-initiated** on POS and KDS. Customer-facing devices never show order state.
- `cancelled` is the only backwards transition. It requires a confirm dialog. Never a single tap.
- An order that is `ready` for more than 15 minutes should surface a visual alert — implement at the app layer via a timer, not in the component.
- KDS renders one `OrderCard` per order. Admin `OrderTable` renders all orders across channels. Same state machine, different presentation.

### Component mapping

| Component | Role in lifecycle |
|-----------|------------------|
| `OrderCard` | Single-order state display, kitchen confirmation |
| `OrderTable` | Multi-order monitoring and bulk state changes |
| `PosCart` | Pre-order → triggers new order on payment |

---

## 2. Payment Flow

Payment flows are **linear, non-branching, and recoverable** at every step.

### Online checkout (CheckoutFlow)

```
0 Handlekurv
  → review items, see estimated total
1 Detaljer
  → pickup time OR delivery address
2 Info  (skipped if logged in)
  → name + phone (required), email (optional)
3 Oversikt
  → full summary, edit links at every section
4 Betaling
  → payment method selection
✓ Bekreftet
  → order number, pickup/delivery info, SMS confirmation
```

**Rules:**
- Every step has a **back button** (except step 0 in panel mode and the confirmation screen).
- The **CTA always shows the amount**: "Gå til utsjekk • 139 kr" — not just "Continue".
- Required fields (name, phone) **gate the CTA** — they do not show an error on blur, only on attempted advance.
- The confirmation screen is a **terminal state** — no back button, no edit. A new order starts fresh.

### POS payment (PosPaymentFlow)

```
choose   → whole amount / split by person / split by item / cash withdraw
method   → Kort / Kontant (large touch targets)
terminal → "Hold kortet mot terminalen" / "Betal i kassen"
confirmed → ✅ 1.8s then auto-advance to receipt
receipt  → print / close
```

**Rules:**
- **Split payment is non-destructive** — partial payments park the remaining balance, they do not delete items.
- **Cash withdraw is additive** — shown as a separate line on the receipt, added to the transaction total, never substituted.
- A split receipt gets a `SPLITT-KVITTERING` badge — auditors need to distinguish these.
- After payment is confirmed there is a **1.8-second celebration moment** (✅ animation) before the receipt appears. This is intentional — it signals finality to both staff and customer.

---

## 3. Table Interactions

### Selection model

`OrderTable` supports single-row selection via `selectedId` + `onRowSelect`. There is no multi-select — bulk operations are handled via action menus, not checkboxes.

### Density modes

```
comfortable  — 56px row height — default, admin dashboards
compact      — 44px row height — side-by-side panels, KDS prep view
ultra        — 36px row height — print view, high-volume reports
```

Density is controlled at the container level via `data-density` attribute. Components inherit it — they never set it themselves.

### Empty state

Every table requires an `emptyMessage`. Never show a blank table. If there is a recoverable action (e.g. "Add a product"), provide `emptyActionLabel` + `onEmptyAction`.

### Column overflow

Long text in cells truncates with `text-overflow: ellipsis`. Tables never expand their column widths to fit content. Column widths are fixed or proportional — never `auto` on a live data table.

---

## 4. Loading Patterns

### Skeleton, not spinner

Components that load data show **skeleton placeholders**, not spinners. Skeletons preserve layout — the screen does not jump when data arrives.

```
loading=true  → skeleton placeholder, same dimensions as content
loading=false → content appears with a 160ms fade-in
```

### Optimistic updates

Quantity steppers and status toggles update the UI **immediately** on tap. If the server call fails, revert with a toast notification. Never disable the stepper while waiting.

### Progressive loading

Large lists render **visible rows first**. Rows below the fold can load lazily. The pagination component handles this — do not load all rows at once in production tables.

### Toast notifications

`toast(message)` is a lightweight fire-and-forget notification for:
- Successful background operations ("🅿️ Parkert: Bord 4")
- Non-critical errors that don't block the user

Toasts appear at the top of the screen, auto-dismiss after 2.8 seconds, and never stack more than 3 high.

**Never use a toast for:**
- Payment confirmation (use the confirmed screen)
- Destructive actions (use a confirm dialog)
- Validation errors (show inline, adjacent to the field)

---

## 5. Kiosk Idle + Dine Choice

The `KioskShell` component manages the transition from idle to active:

```
idle screen
  → "Spis her" / "Ta med" choice
  → menu renders
  → customer adds items
  → cart bar appears
  → checkout completes
  → return to idle after receipt
```

**Rules:**
- The idle screen **never shows pricing or promotions**. It is a neutral welcome screen.
- After order completion, the shell **automatically returns to idle** — the app layer handles this via a timer after `onDineChoice` fires.
- The dine choice is **sticky for the session** — it appears as a label in the header ("Meny — Spis her") and cannot be changed mid-order. A new order starts a new session.

---

## 6. POS Park Flow

Parking holds an order without losing it. It is used for:
- Table service (park by table number, retrieve when the customer is ready)
- Customer left temporarily (park by name or phone)
- Quick handoff between staff (quick park)

```
cart → park options
  → table grid → select table → park
  → name/phone input → park
  → quick park (immediate, label "Rask")
```

A parked order appears in the header as a badge: "🅿️ 2". Tapping it opens the parked orders sheet.

**Rules:**
- Parking does **not** clear the staff session. The same staff member resumes.
- Retrieving a parked order **replaces the current cart**. If there are items in the current cart, show a confirm dialog first.
- Parked orders survive a full screen re-render — they are stored in app state, not in the component.

---

## 7. Category Navigation

`CategoryNav` appears on all ordering surfaces. Its behaviour is consistent even though its layout changes:

```
pills    — sticky top, horizontal scroll   — QR, online, kiosk portrait header
sidebar  — fixed left column, 76px         — kiosk portrait (standalone)
```

**Scroll-to-section** is the caller's responsibility. The component fires `onSelect(id)` — the parent handles the scroll. This separation ensures the component works in both DOM-scroll and virtual-scroll contexts.

**Rules:**
- The active category **always has visible focus** (filled pill / blue accent bar).
- Selecting a category shows a **loading skeleton** for ~350ms, then reveals the products. This prevents layout thrash on slow connections and creates the perception of intentional navigation.
- The category list never reorders dynamically — the order is set by the restaurant configuration and does not change during a session.
