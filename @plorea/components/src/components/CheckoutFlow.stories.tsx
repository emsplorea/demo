import type { Meta, StoryObj } from '@storybook/react'
import { CheckoutFlow } from './CheckoutFlow'
import type { CheckoutCartLine, CheckoutPaymentMethod } from './CheckoutFlow'

// ── Demo data
const LINES: CheckoutCartLine[] = [
  { id: '1', name: 'HOT BURGER',    qty: 1, total: 9900,  modifiers: ['250G', 'Bacon'] },
  { id: '2', name: 'Pommes Frites', qty: 1, total: 4900  },
  { id: '3', name: 'Coca-Cola',     qty: 2, total: 7000  },
]

const PAYMENT_METHODS: CheckoutPaymentMethod[] = [
  {
    id: 'vipps',
    label: 'Vipps',
    description: 'Betal med Vipps-appen',
    icon: (
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: '#FF5B24',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 900, fontSize: 11,
      }}>
        Vipps
      </div>
    ),
  },
  {
    id: 'card',
    label: 'Kort',
    description: 'Visa, Mastercard',
    icon: (
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'var(--color-text-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        💳
      </div>
    ),
  },
]

const meta: Meta<typeof CheckoutFlow> = {
  title:     'Canonical/11 CheckoutFlow',
  component:  CheckoutFlow,
  tags:      ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
5-step online checkout. Two display contexts:

| Mode | Layout | Used for |
|------|--------|----------|
| \`panel\` | 330px fixed sidebar | Online landscape |
| \`sheet\` | Bottom sheet overlay | Online mobile, QR |

**Steps:**
0. **Handlekurv** — review items, combo inline, subtotals
1. **Detaljer** — pickup timeslot or delivery address
2. **Info** — name + phone (skipped if \`loggedIn=true\`)
3. **Oversikt** — full summary with edit links, comment
4. **Betaling** — payment method selection → confirms immediately
✓  **Bekreftet** — animated checkmark + confetti + order number

**Rules:**
- Header always dark — consistent visual anchor across steps
- Back button: steps > 0 only, not on confirmation
- Required fields block next until valid (name + phone ≥ 8 chars)
- All prices in minor units (øre)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof CheckoutFlow>

// ─────────────────────────────────────────────────────────────────
// Panel mode — full walkthrough
// ─────────────────────────────────────────────────────────────────
export const PanelInteractive: Story = {
  name: 'Panel — full walkthrough',
  render: () => (
    <div style={{
      display: 'flex', height: '100vh',
      background: 'var(--color-bg-page)',
    }}>
      {/* Simulated menu */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', opacity: 0.4,
        flexDirection: 'column', gap: 12,
        fontSize: 14, color: 'var(--color-text-secondary)',
      }}>
        <div style={{ fontSize: 40 }}>🍔</div>
        Menu surface
      </div>

      <CheckoutFlow
        lines={LINES}
        paymentMethods={PAYMENT_METHODS}
        currency="kr"
        deliveryFee={5900}
        serviceFee={500}
        mode="panel"
        onConfirm={info => console.log('confirmed', info)}
        onCancel={() => console.log('cancel')}
        onContinueShopping={() => console.log('continue shopping')}
      />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Sheet mode — mobile overlay
// ─────────────────────────────────────────────────────────────────
export const SheetInteractive: Story = {
  name: 'Sheet — mobile overlay',
  render: () => (
    <div style={{
      position: 'relative', height: '100vh', maxWidth: 390, margin: '0 auto',
      background: 'var(--color-bg-page)', overflow: 'hidden',
    }}>
      {/* Menu background */}
      <div style={{
        padding: 16, opacity: 0.35,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            height: 72, background: 'var(--color-surface)',
            borderRadius: 'var(--r-lg)', border: '1px solid var(--color-border)',
          }} />
        ))}
      </div>

      <CheckoutFlow
        lines={LINES}
        paymentMethods={PAYMENT_METHODS}
        currency="kr"
        mode="sheet"
        onClose={() => console.log('close')}
        onConfirm={info => console.log('confirmed', info)}
        onCancel={() => console.log('cancel')}
        onContinueShopping={() => console.log('continue shopping')}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// ─────────────────────────────────────────────────────────────────
// Empty cart
// ─────────────────────────────────────────────────────────────────
export const EmptyCart: Story = {
  name: 'Panel — empty cart',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg-page)' }}>
      <div style={{ flex: 1 }} />
      <CheckoutFlow
        lines={[]}
        paymentMethods={PAYMENT_METHODS}
        currency="kr"
        mode="panel"
      />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Logged in — skips Info step
// ─────────────────────────────────────────────────────────────────
export const LoggedIn: Story = {
  name: 'Panel — logged in (skips Info step)',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg-page)' }}>
      <div style={{ flex: 1 }} />
      <CheckoutFlow
        lines={LINES}
        paymentMethods={PAYMENT_METHODS}
        currency="kr"
        loggedIn={true}
        mode="panel"
        onConfirm={info => console.log('confirmed', info)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When `loggedIn=true` the Info step (name/phone) is skipped. Step 1 Detaljer advances directly to step 3 Oversikt.',
      },
    },
  },
}

// ─────────────────────────────────────────────────────────────────
// Delivery mode
// ─────────────────────────────────────────────────────────────────
export const DeliveryMode: Story = {
  name: 'Panel — delivery selected',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg-page)' }}>
      <div style={{ flex: 1 }} />
      <CheckoutFlow
        lines={LINES}
        paymentMethods={PAYMENT_METHODS}
        currency="kr"
        deliveryFee={5900}
        serviceFee={500}
        mode="panel"
        onConfirm={info => console.log('confirmed', info)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Switch to "Levering" in step 1 to see the delivery address input and the delivery fee added in Oversikt.',
      },
    },
  },
}
