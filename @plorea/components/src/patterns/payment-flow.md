# Pattern: Payment Flow

Plorea Design System v3.3

Payment flow covers two distinct surfaces with different constraints: online checkout (customer-facing, async, multi-device) and POS terminal (staff-facing, synchronous, single-device). Both share the same underlying order model, but the interaction patterns differ significantly.

---

## Online checkout (CheckoutFlow)

### Step sequence

```
0 Handlekurv     — review items, see total
1 Detaljer       — pickup time OR delivery address + optional note
2 Info           — name (required), phone (required), email (optional)
                   SKIPPED if customer is logged in (loggedIn=true)
3 Oversikt       — full summary, inline edit links
4 Betaling       — payment method selection, final CTA with amount
✓ Bekreftet      — order number + estimated time, terminal state
```

### Step rules

- **Back is always available** on steps 1–4. Step 0 and Bekreftet have no back.
- **The CTA always shows the total**: "Bekreft bestilling — 139 kr". Never just "Next" or "Continue".
- **Required fields block the CTA** — they do not show errors on blur, only when the CTA is tapped while the field is empty. Inline error appears adjacent to the field, never as a toast.
- **Step 3 (Oversikt) is the last chance to edit.** Provide edit links back to step 0, 1, and 2. Once payment is confirmed, no edits are possible.
- **Bekreftet is a terminal state.** No back button. No close button in panel mode. The order is submitted. A new order starts fresh from step 0.

### Mode variants

| Mode | Layout | Use case |
|------|--------|----------|
| `panel` | 330px fixed right sidebar | Desktop restaurant website |
| `sheet` | Bottom sheet slide-up | Mobile QR ordering |

The step sequence and rules are identical in both modes. Only the chrome (header, width, backdrop) differs.

---

## POS payment (PosPaymentFlow)

### Screen sequence

```
choose     — select payment mode
  ↓
  ├── Hele beløpet → method → terminal → confirmed → receipt
  ├── Splitt på personer → person count → method → terminal → confirmed → receipt
  ├── Splitt per vare → item selection → method → terminal → confirmed → receipt
  └── Cash Withdraw → amount → back to choose (with amount added to total)
```

### Split payment rules

Split payments are **non-destructive**. When a customer pays part of the bill:
1. The partial payment is recorded as a `SPLITT-KVITTERING` (split receipt).
2. The remaining items stay in the cart — they are not deleted.
3. The remaining cart can be parked, split again, or paid in full.
4. Staff can park the remaining balance: "🅿️ Parkér restordre" after a partial payment.

This allows one table to pay in three rounds, across three cards, for three different item subsets.

### Cash withdraw rules

Cash withdraw adds a cash advance to the card transaction. The customer pays for their order *and* receives cash from the till in a single tap.

- Withdraw amount is **added to the charged total** on the terminal.
- Shown as a separate line on the receipt: "🏧 Uttak — +200 kr"
- The drawer log is updated automatically after the transaction.
- There is no minimum order amount required for a withdrawal.

### Confirmation timing

```
payment confirmed by terminal
  → 1.8 seconds: ✅ "Betaling godkjent!" animation
  → receipt screen appears
  → staff taps "Lukk" or "🖨️ Skriv ut"
  → cart cleared, return to product grid
```

The 1.8-second delay is **intentional**. It signals finality to both staff and the customer standing at the counter. Do not reduce it below 1.2 seconds.

### Receipt structure

```
Plorea
#[last 6 of order ID] · [date] · [time]
[SPLITT-KVITTERING]    ← only on split receipts
──────────────────────
[qty]x [item name]     [subtotal]
──────────────────────
Rabatt ([label])       -[amount]   ← only if discount applied
TOTALT                 [total]
──────────────────────
🏧 Uttak              +[amount]   ← only if cash withdraw
Belastet              [charged]   ← only if cash withdraw
💳 Kort / 💵 Kontant · [staff name]
```

Monospace font, dashed dividers — matches thermal printer output for visual continuity when printed.

---

## Shared rules (both surfaces)

1. **Amount is always visible on the primary CTA.** The staff and customer should never have to calculate mentally.
2. **Payment method is never pre-selected.** The customer must make an active choice. No defaults.
3. **Every payment flow is recoverable until the terminal confirmation.** Back is available at every screen except the confirmed screen.
4. **Partial payments persist** — they are never silently discarded when closing a flow. If the flow is closed mid-split, the partial payment record remains in the sales log.
