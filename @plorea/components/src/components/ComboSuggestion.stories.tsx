import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ComboSuggestion } from './ComboSuggestion'

const BURGER_COMBO = {
  label: 'Burgermeny',
  triggerName: 'HOT BURGER',
  items: [
    { name: 'Pommes Frites', icon: '🍟', originalPrice: 4900 },
    { name: 'Coca-Cola',     icon: '🥤', originalPrice: 3500 },
  ],
  dealPrice: 4900,
  savingsAmount: 3500,
  currency: 'kr',
}

const PIZZA_COMBO = {
  label: 'Pizzameny',
  triggerName: 'Skinke Pizza',
  items: [
    { name: 'Coca-Cola',     icon: '🥤', originalPrice: 3500 },
    { name: 'Mineralvann',   icon: '💧', originalPrice: 2500 },
  ],
  dealPrice: 2900,
  savingsAmount: 3100,
  currency: 'kr',
}

const meta: Meta<typeof ComboSuggestion> = {
  title:     'Canonical/09 ComboSuggestion',
  component:  ComboSuggestion,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Contextual upsell banner. Shown automatically after a qualifying product is added to cart.

Two display modes:

| Mode | Layout | Used for |
|------|--------|----------|
| \`float\` | Absolute overlay above cart bar | QR, kiosk portrait |
| \`inline\` | Compact card inside cart panel | Kiosk landscape, online sidebar |

**Rules:**
- Warm off-white background (\`#FFF8F0\`) — never primary blue
- CTA uses \`--color-accent\` (dark blue) — high intent
- Savings badge: success green — positive reinforcement only
- Dismiss: muted text, never red — low friction
- Parent mounts/unmounts — component is not self-dismissing
- Enter animation: \`fadeUp 0.35s\`
        `,
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: ['float', 'inline'] },
  },
}

export default meta
type Story = StoryObj<typeof ComboSuggestion>

// ─────────────────────────────────────────────────────────────────
// Float — interactive (simulates QR / kiosk portrait)
// ─────────────────────────────────────────────────────────────────

export const FloatInteractive: Story = {
  name: 'Float — interactive',
  render: () => {
    const [visible, setVisible] = useState(true)
    const [result, setResult] = useState<string | null>(null)

    return (
      <div style={{
        position: 'relative',
        height: 380,
        background: 'var(--color-bg-page)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Simulated product list background */}
        <div style={{ flex: 1, padding: 16, opacity: 0.35 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 72, background: 'var(--color-surface)',
              borderRadius: 'var(--r-lg)', marginBottom: 10,
              border: '1px solid var(--color-border)',
            }} />
          ))}
        </div>

        {/* Simulated cart bar */}
        <div style={{
          height: 56, background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Se bestilling</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>99 kr</span>
        </div>

        {/* Combo suggestion — floats above cart bar */}
        {visible && (
          <ComboSuggestion
            {...BURGER_COMBO}
            mode="float"
            bottomOffset={56}
            onAccept={() => { setResult('✓ Burgermeny lagt til'); setVisible(false) }}
            onDismiss={() => { setResult('Avvist'); setVisible(false) }}
          />
        )}

        {/* Reset */}
        {!visible && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: result?.startsWith('✓') ? 'var(--color-success)' : 'var(--color-text-muted)',
            }}>
              {result}
            </div>
            <button
              onClick={() => { setVisible(true); setResult(null) }}
              style={{
                padding: '8px 20px', borderRadius: 'var(--r-lg)', border: 'none',
                background: 'var(--color-primary)', color: '#fff',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Vis igjen
            </button>
          </div>
        )}
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────────
// Inline — interactive (simulates landscape cart panel)
// ─────────────────────────────────────────────────────────────────

export const InlineInteractive: Story = {
  name: 'Inline — interactive',
  render: () => {
    const [visible, setVisible] = useState(true)
    const [added, setAdded] = useState(false)

    return (
      <div style={{
        width: 260, background: 'var(--color-surface)',
        border: '1px solid var(--color-border)', borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
      }}>
        {/* Cart header */}
        <div style={{
          padding: '10px 12px 6px', borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontWeight: 700, fontSize: 10, color: 'var(--color-secondary)' }}>plorea</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Min bestilling</span>
        </div>

        {/* Cart item */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <span style={{ fontSize: 20 }}>🍔</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>HOT BURGER</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>99 kr</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700 }}>×1</span>
        </div>

        {/* Inline combo suggestion */}
        {visible && !added && (
          <div style={{ padding: '0 10px' }}>
            <ComboSuggestion
              {...BURGER_COMBO}
              mode="inline"
              onAccept={() => { setAdded(true); setVisible(false) }}
              onDismiss={() => setVisible(false)}
            />
          </div>
        )}

        {added && (
          <>
            {BURGER_COMBO.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderTop: '1px solid var(--color-border)',
                fontSize: 12,
              }}>
                <span>{item.icon}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{item.name}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {(BURGER_COMBO.dealPrice / 100 / BURGER_COMBO.items.length).toFixed(0)} kr
                </span>
              </div>
            ))}
          </>
        )}

        {/* Cart footer */}
        <div style={{
          padding: '8px 12px', borderTop: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Total</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            {added ? `${((9900 + 4900) / 100).toFixed(0)} kr` : '99 kr'}
          </span>
        </div>
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────────
// No savings — badge hidden
// ─────────────────────────────────────────────────────────────────

export const NoSavings: Story = {
  name: 'No savings badge',
  render: () => (
    <div style={{ maxWidth: 360, position: 'relative' }}>
      <ComboSuggestion
        {...BURGER_COMBO}
        savingsAmount={0}
        mode="inline"
        onAccept={() => {}}
        onDismiss={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'When `savingsAmount` is 0 or undefined the savings badge is hidden.' },
    },
  },
}

// ─────────────────────────────────────────────────────────────────
// Both modes side by side
// ─────────────────────────────────────────────────────────────────

export const BothModes: Story = {
  name: 'Both modes — comparison',
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
          float — QR / portrait
        </div>
        <div style={{ width: 320, position: 'relative' }}>
          <ComboSuggestion {...PIZZA_COMBO} mode="float" style={{ position: 'relative', bottom: 'auto', left: 'auto', right: 'auto' }} onAccept={() => {}} onDismiss={() => {}} />
        </div>
      </div>
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
          inline — landscape cart
        </div>
        <div style={{ width: 240 }}>
          <ComboSuggestion {...PIZZA_COMBO} mode="inline" onAccept={() => {}} onDismiss={() => {}} />
        </div>
      </div>
    </div>
  ),
}
