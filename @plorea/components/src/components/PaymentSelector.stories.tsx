import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PaymentSelector } from './PaymentSelector'
import type { PaymentMethod } from './PaymentSelector'

const meta: Meta<typeof PaymentSelector> = {
  title:     'Canonical/05 PaymentSelector',
  component:  PaymentSelector,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Critical final step before order completion.

**Rules:**
- No method pre-selected on mount — always requires explicit user choice
- CTA disabled until a method is selected — never speculatively enabled
- CTA label always shows the amount: "Charge kr 378"
- Processing: spinner in CTA, method cards become non-interactive
- Error: red border + inline message — no modal
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PaymentSelector>

const METHODS: PaymentMethod[] = [
  { id: 'card',  label: 'Card',  description: 'Tap, insert or swipe', icon: '💳' },
  { id: 'cash',  label: 'Cash',  description: 'Count and confirm',    icon: '💵' },
  { id: 'vipps', label: 'Vipps', description: 'QR or phone number',   icon: '📱' },
]

// ── Default — interactive
export const Default: Story = {
  name: 'Default (interactive)',
  render: (args) => {
    const [processing, setProcessing] = useState(false)
    const [paid, setPaid] = useState(false)

    async function handleConfirm() {
      setProcessing(true)
      await new Promise(r => setTimeout(r, 1800))
      setProcessing(false)
      setPaid(true)
    }

    if (paid) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <p style={{ color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: 16 }}>
            Payment complete
          </p>
          <button
            onClick={() => setPaid(false)}
            style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 700,
              background: 'var(--color-primary)', color: 'var(--color-primary-text)',
              border: 'none', borderRadius: 8, cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      )
    }

    return (
      <PaymentSelector
        {...args}
        processing={processing}
        onConfirm={handleConfirm}
      />
    )
  },
  args: {
    methods:      METHODS,
    amount:       37800,
    currency:     'kr',
    orderSummary: 'Table 4 · #2041 · 3 items',
    showSplit:    true,
  },
}

// ── No selection (initial mount state)
export const NoneSelected: Story = {
  name: 'No method selected (initial)',
  parameters: {
    docs: {
      description: {
        story: 'CTA is disabled until the user makes an explicit choice.',
      },
    },
  },
  args: {
    methods:      METHODS,
    amount:       37800,
    currency:     'kr',
    orderSummary: 'Table 4 · #2041 · 3 items',
  },
}

// ── Processing (after confirm)
export const ProcessingState: Story = {
  name: 'Processing',
  args: {
    methods:     METHODS,
    amount:      37800,
    currency:    'kr',
    processing:   true,
  },
}

// ── Method error
export const MethodError: Story = {
  name: 'Method error',
  args: {
    methods:      METHODS,
    amount:       37800,
    currency:     'kr',
    methodErrors: { card: 'Terminal offline — try another method' },
  },
}

// ── Global error
export const GlobalError: Story = {
  name: 'Global error',
  args: {
    methods:  METHODS,
    amount:   37800,
    currency: 'kr',
    error:    'Payment service unavailable. Contact support.',
  },
}

// ── Disabled method
export const DisabledMethod: Story = {
  name: 'Disabled method (Vipps)',
  args: {
    methods: [
      { id: 'card',  label: 'Card',  description: 'Tap, insert or swipe', icon: '💳' },
      { id: 'cash',  label: 'Cash',  description: 'Count and confirm',    icon: '💵' },
      { id: 'vipps', label: 'Vipps', description: 'Currently unavailable', icon: '📱', disabled: true },
    ],
    amount:   37800,
    currency: 'kr',
  },
}

// ── Large amount
export const LargeAmount: Story = {
  name: 'Large amount',
  args: {
    methods:      METHODS,
    amount:       189500,
    currency:     'kr',
    orderSummary: 'Catering · #3301 · 12 items',
    showSplit:    true,
  },
}
