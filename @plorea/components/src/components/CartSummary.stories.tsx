import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CartSummary } from './CartSummary'
import type { CartLine } from './CartSummary'

const meta: Meta<typeof CartSummary> = {
  title:     'Canonical/04 CartSummary',
  component:  CartSummary,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Connects product selection to payment. Used in POS, QR ordering, and online checkout.

**Rules:**
- Qty stepper \`[-] n [+]\` — never a text input
- Discount row only renders when \`discountAmount > 0\`
- Removing last item: confirm only if cart becomes empty
- Primary CTA: full-width, min 48px height, outcome-led label
- Empty state: product prompt — never a blank panel
        `,
      },
    },
  },
  argTypes: {
    channel: {
      control: 'select',
      options: ['table', 'takeaway', 'eatin', 'combo'],
    },
    vatRate: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
    },
  },
}

export default meta
type Story = StoryObj<typeof CartSummary>

const BASE_LINES: CartLine[] = [
  { id: 'l1', name: 'Margherita',     unitPrice: 11900, quantity: 2, modifiers: ['Extra cheese'] },
  { id: 'l2', name: 'Tiramisu',       unitPrice:  8900, quantity: 1 },
  { id: 'l3', name: 'Sparkling water', unitPrice: 3900, quantity: 2 },
]

// ── Default — interactive qty steppers
export const Default: Story = {
  render: (args) => {
    const [lines, setLines] = useState<CartLine[]>(BASE_LINES)
    return (
      <CartSummary
        {...args}
        lines={lines}
        onQuantityChange={(id, qty) =>
          setLines(prev =>
            qty === 0
              ? prev.filter(l => l.id !== id)
              : prev.map(l => l.id === id ? { ...l, quantity: qty } : l)
          )
        }
        onPrimary={() => alert('Send to kitchen')}
        onSecondary={() => alert('Add note')}
        emptyAction={{ label: 'Add products', onClick: () => setLines(BASE_LINES) }}
      />
    )
  },
  args: {
    channel:       'table',
    channelLabel:  'Table 4',
    orderRef:      '2041',
    discountAmount: 0,
    vatRate:        0,
    primaryLabel:   'Send to kitchen',
    secondaryLabel: 'Add note',
  },
}

// ── With discount + VAT
export const WithDiscountAndVat: Story = {
  name: 'Discount + VAT',
  render: (args) => {
    const [lines, setLines] = useState<CartLine[]>(BASE_LINES)
    return (
      <CartSummary
        {...args}
        lines={lines}
        onQuantityChange={(id, qty) =>
          setLines(prev =>
            qty === 0
              ? prev.filter(l => l.id !== id)
              : prev.map(l => l.id === id ? { ...l, quantity: qty } : l)
          )
        }
        onPrimary={() => {}}
      />
    )
  },
  args: {
    channel:       'table',
    channelLabel:  'Table 4',
    orderRef:      '2041',
    discountAmount: 4000,
    discountLabel:  'Member discount (10%)',
    vatRate:        0.15,
    primaryLabel:   'Send to kitchen',
  },
}

// ── Takeaway channel
export const Takeaway: Story = {
  render: (args) => {
    const [lines, setLines] = useState<CartLine[]>(BASE_LINES)
    return (
      <CartSummary
        {...args}
        lines={lines}
        onQuantityChange={(id, qty) =>
          setLines(prev =>
            qty === 0
              ? prev.filter(l => l.id !== id)
              : prev.map(l => l.id === id ? { ...l, quantity: qty } : l)
          )
        }
        onPrimary={() => {}}
      />
    )
  },
  args: {
    channel:      'takeaway',
    channelLabel: 'Takeaway',
    primaryLabel: 'Place order',
  },
}

// ── Primary loading
export const Loading: Story = {
  name: 'Sending (loading state)',
  args: {
    channel:        'table',
    channelLabel:   'Table 4',
    lines:           BASE_LINES,
    primaryLabel:   'Send to kitchen',
    primaryLoading:  true,
  },
}

// ── Empty cart
export const EmptyCart: Story = {
  name: 'Empty cart',
  args: {
    channel:      'table',
    channelLabel: 'Table 4',
    lines:        [],
    emptyMessage: 'Cart is empty',
    emptyAction:  { label: 'Add products', onClick: () => {} },
  },
}
