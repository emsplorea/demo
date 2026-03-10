import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ProductModal } from './ProductModal'
import type { ProductModalProduct, SelectedModifier } from './ProductModal'

function pImg(emoji: string, bg1: string, bg2: string) {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="${bg1}"/>` +
      `<stop offset="100%" stop-color="${bg2}"/>` +
      `</linearGradient></defs>` +
      `<rect width="400" height="400" fill="url(#g)"/>` +
      `<text x="200" y="240" text-anchor="middle" font-size="160">${emoji}</text>` +
      `</svg>`
    )
  )
}

const BURGER: ProductModalProduct = {
  id: '1',
  name: 'HOT BURGER',
  description: 'Saftig burger med friske grønnsaker og huslagd dressing. Serveres med valg av størrelse og tilbehør.',
  price: 9900,
  image: pImg('🍔', '#FFF3E0', '#FFE0B2'),
  allergens: [
    { icon: '🥛', label: 'Dairy' },
    { icon: '🌾', label: 'Gluten' },
  ],
  modifiers: [
    {
      name: 'Størrelse',
      type: 'radio',
      required: true,
      options: [
        { name: '160G', price: 0 },
        { name: '250G', price: 4000 },
        { name: '300G', price: 6000 },
      ],
    },
    {
      name: 'Ta bort',
      type: 'checkbox',
      options: [
        { name: 'Syltagurk' },
        { name: 'Tomat' },
        { name: 'Løk' },
        { name: 'Salat' },
      ],
    },
    {
      name: 'Ekstra',
      type: 'checkbox',
      options: [
        { name: 'Cheese',    price: 1000 },
        { name: 'Jalapeños', price: 1000 },
        { name: 'Bacon',     price: 1000 },
      ],
    },
  ],
}

const PIZZA: ProductModalProduct = {
  id: '5',
  name: 'Skinke Pizza',
  description: 'Hjemmelaget pizzabunn med mozzarella, tomatsaus og norsk skinke.',
  price: 20000,
  image: pImg('🍕', '#FFF3E0', '#FFE0B2'),
  allergens: [
    { icon: '🌾', label: 'Gluten' },
    { icon: '🥛', label: 'Dairy' },
  ],
  modifiers: [
    {
      name: 'Størrelse',
      type: 'radio',
      required: true,
      options: [
        { name: 'Liten (22cm)',  price: 0 },
        { name: 'Stor (30cm)',   price: 4000 },
        { name: 'Jumbo (36cm)', price: 8000 },
      ],
    },
    {
      name: 'Ekstra topping',
      type: 'checkbox',
      options: [
        { name: 'Ekstra ost',   price: 1500 },
        { name: 'Ruccola',      price: 1000 },
        { name: 'Pepperoni',    price: 2000 },
      ],
    },
  ],
}

const DRINK: ProductModalProduct = {
  id: '10',
  name: 'Coca-Cola',
  description: '0.5L iskald Coca-Cola.',
  price: 3500,
  image: pImg('🥤', '#FFEBEE', '#FFCDD2'),
  allergens: [{ icon: '🌱', label: 'Vegan' }],
  // No modifiers — simple add-to-cart
}

const meta: Meta<typeof ProductModal> = {
  title:     'Canonical/07 ProductModal',
  component:  ProductModal,
  tags:      ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Product detail + customisation dialog. Opens when a ProductCard is tapped.

Two modes:
- **Add** — fresh item, no pre-fills
- **Edit** — update existing cart line, selections and qty pre-filled

**Rules:**
- Required modifier groups (\`*\`) block CTA until satisfied
- Radio: selecting one auto-deselects previous
- Price updates live — displayed in CTA as "Add to cart • X kr"
- Backdrop click dismisses
- Allergen tags shown below description
- Wide layout (≥460px) on kiosk/desktop, narrow on mobile/QR
        `,
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['narrow', 'wide'],
    },
  },
  decorators: [
    Story => (
      <div style={{ position: 'relative', width: '100%', height: '100vh', background: 'var(--color-bg-page)' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProductModal>

// ─────────────────────────────────────────────────────────────────
// Interactive — full add-to-cart flow
// ─────────────────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive — add to cart',
  render: () => {
    const [open, setOpen] = useState(true)
    const [lastOrder, setLastOrder] = useState<string | null>(null)

    return (
      <div style={{
        position: 'relative', width: '100%', height: '100vh',
        background: 'var(--color-bg-page)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        {!open && (
          <>
            {lastOrder && (
              <div style={{
                background: 'var(--color-success-bg)', borderRadius: 'var(--r-lg)',
                padding: '12px 20px', fontSize: 13, fontWeight: 600,
                color: 'var(--color-accent)', maxWidth: 320, textAlign: 'center',
              }}>
                ✓ Added to cart: {lastOrder}
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              style={{
                padding: '12px 24px', borderRadius: 'var(--r-lg)', border: 'none',
                background: 'var(--color-primary)', color: 'var(--color-primary-text)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Open HOT BURGER
            </button>
          </>
        )}
        {open && (
          <ProductModal
            product={BURGER}
            layout="narrow"
            onConfirm={(sel, qty) => {
              const mods = Object.values(sel).flat().map(s => s.name).join(', ')
              setLastOrder(`${qty}× HOT BURGER${mods ? ` (${mods})` : ''}`)
              setOpen(false)
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────────
// Wide layout — kiosk
// ─────────────────────────────────────────────────────────────────

export const WideLayout: Story = {
  name: 'Wide layout — kiosk',
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: 'var(--color-bg-page)' }}>
      <ProductModal
        product={PIZZA}
        layout="wide"
        onConfirm={(sel, qty) => console.log('confirm', sel, qty)}
        onClose={() => console.log('close')}
      />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// No modifiers — simple product
// ─────────────────────────────────────────────────────────────────

export const NoModifiers: Story = {
  name: 'No modifiers — simple add',
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: 'var(--color-bg-page)' }}>
      <ProductModal
        product={DRINK}
        layout="narrow"
        onConfirm={(_, qty) => console.log('added', qty)}
        onClose={() => console.log('close')}
      />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Edit mode — pre-filled
// ─────────────────────────────────────────────────────────────────

export const EditMode: Story = {
  name: 'Edit mode — pre-filled',
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: 'var(--color-bg-page)' }}>
      <ProductModal
        product={BURGER}
        layout="narrow"
        initialQty={2}
        initialSelections={{
          'Størrelse': [{ name: '250G', price: 4000 }],
          'Ekstra':    [{ name: 'Bacon', price: 1000 }, { name: 'Cheese', price: 1000 }],
        }}
        ctaLabel="Update"
        onConfirm={(sel, qty) => console.log('update', sel, qty)}
        onClose={() => console.log('close')}
      />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Required not met — CTA blocked
// ─────────────────────────────────────────────────────────────────

export const RequiredNotMet: Story = {
  name: 'Required not met — CTA blocked',
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: 'var(--color-bg-page)' }}>
      <ProductModal
        product={BURGER}
        layout="narrow"
        // No initialSelections → Størrelse (required) unmet → CTA disabled
        onConfirm={(sel, qty) => console.log('confirm', sel, qty)}
        onClose={() => console.log('close')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'CTA is disabled until all required modifier groups (*) have a selection. The hint text below the button guides the user.',
      },
    },
  },
}

// ─────────────────────────────────────────────────────────────────
// Qty interaction
// ─────────────────────────────────────────────────────────────────

export const QtyAndPrice: Story = {
  name: 'Qty stepper — live price',
  render: () => {
    const [result, setResult] = useState<string | null>(null)
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh', background: 'var(--color-bg-page)' }}>
        <ProductModal
          product={DRINK}
          layout="narrow"
          initialQty={1}
          onConfirm={(_, qty) => setResult(`Added ${qty}× Coca-Cola`)}
          onClose={() => {}}
        />
        {result && (
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--color-success-bg)', borderRadius: 'var(--r-lg)',
            padding: '10px 20px', fontSize: 13, fontWeight: 600,
            color: 'var(--color-accent)', whiteSpace: 'nowrap',
          }}>
            ✓ {result}
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Total price in CTA updates live as qty changes. Min qty is 1 — the − button is visually disabled at 1.',
      },
    },
  },
}
