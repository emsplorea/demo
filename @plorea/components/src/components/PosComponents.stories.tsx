/**
 * POS Stories — PinPad, PosCart, PosPaymentFlow, PosUtilities
 * All in one file since they're tightly coupled by shared state.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PinPad }               from './PinPad'
import { PosCart }              from './PosCart'
import { PosPaymentFlow }       from './PosPaymentFlow'
import { PosParkFlow, PosDiscountFlow, PosDrawer, PosZReport } from './PosUtilities'
import type { PosStaffMember }  from './PinPad'
import type { PosCartLine, PosDiscount } from './PosCart'
import type { DrawerEntry, ZReportReceipt } from './PosUtilities'

// ── Demo data ──────────────────────────────────────────────────

const STAFF: PosStaffMember[] = [
  { id: '1', name: 'Maria H.', pin: '1234', role: 'Manager' },
  { id: '2', name: 'Erik S.',  pin: '5678' },
  { id: '3', name: 'Lina K.',  pin: '9012' },
]

const LINES: PosCartLine[] = [
  {
    key: 'a1', productId: 1, name: 'Classic Burger', icon: '🍔',
    category: 'burgers', unitPrice: 13900,
    quantity: 1, modifierDelta: 3000, modifierSummary: 'Stor · Bacon',
  },
  {
    key: 'a2', productId: 8, name: 'Pommes Frites', icon: '🍟',
    category: 'sides', unitPrice: 4900,
    quantity: 2, modifierDelta: 0, modifierSummary: 'Medium',
  },
  {
    key: 'a3', productId: 11, name: 'Cola', icon: '🥤',
    category: 'drinks', unitPrice: 3900,
    quantity: 1, modifierDelta: 0,
  },
]

function cartTotal(lines: PosCartLine[], disc?: PosDiscount | null) {
  const sub = lines.reduce((s, l) => s + (l.unitPrice + l.modifierDelta) * l.quantity, 0)
  if (!disc) return sub
  const da = disc.type === 'percent' ? Math.round(sub * disc.value / 100) : Math.min(disc.value, sub)
  return sub - da
}

// ════════════════════════════════════════════════════════════════
// PinPad stories
// ════════════════════════════════════════════════════════════════

const pinMeta: Meta<typeof PinPad> = {
  title:     'POS/01 PinPad',
  component:  PinPad,
  tags:      ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
4-digit staff PIN authentication. Physical POS only.

- Auto-validates on 4th digit
- Shake + red error on wrong PIN, auto-clears after 800ms
- Keyboard support: 0–9, Backspace, Escape
- "Slett" = clear all, ⌫ = delete last

**Demo PINs:** 1234 (Maria H.) · 5678 (Erik S.) · 9012 (Lina K.)
        `,
      },
    },
  },
}
export default pinMeta

export const PinPadDefault: StoryObj<typeof PinPad> = {
  name: 'PinPad — default',
  render: () => {
    const [authed, setAuthed] = useState<PosStaffMember | null>(null)
    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: '100vh', background: 'var(--color-surface)', margin: '0 auto' }}>
        {authed ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12,
          }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Innlogget: {authed.name}</div>
            {authed.role && <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{authed.role}</div>}
            <button onClick={() => setAuthed(null)} style={{
              marginTop: 8, padding: '10px 20px', background: 'var(--color-secondary)',
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            }}>
              Logg ut
            </button>
          </div>
        ) : (
          <PinPad
            staff={STAFF}
            hint="Demo: 1234 (Manager) · 5678 · 9012"
            onSuccess={s => setAuthed(s)}
          />
        )}
      </div>
    )
  },
}

// ════════════════════════════════════════════════════════════════
// PosCart + full POS flow
// ════════════════════════════════════════════════════════════════

export const FullPosFlow: StoryObj<typeof PinPad> = {
  name: 'Full POS flow — cart → payment',
  parameters: {
    docs: {
      description: {
        story: 'Complete POS flow: cart review → park/discount/payment. Combines PosCart + PosPaymentFlow + PosParkFlow + PosDiscountFlow.',
      },
    },
  },
  render: () => {
    const [lines, setLines]     = useState<PosCartLine[]>(LINES)
    const [discount, setDisc]   = useState<PosDiscount | null>(null)
    const [view, setView]       = useState<'cart' | 'payment' | 'park' | 'discount'>('cart')
    const [toast, setToast]     = useState<string | null>(null)

    function showToast(msg: string) {
      setToast(msg)
      setTimeout(() => setToast(null), 2200)
    }

    const tot = cartTotal(lines, discount)

    return (
      <div style={{
        position: 'relative', width: '100%', maxWidth: 480,
        height: '100vh', background: 'var(--color-bg-page)',
        margin: '0 auto', overflow: 'hidden',
      }}>
        {/* Toast */}
        {toast && (
          <div style={{
            position: 'absolute', top: 56, left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-text-primary)', color: '#fff',
            padding: '10px 20px', borderRadius: 10,
            fontSize: 14, fontWeight: 600, zIndex: 300,
            whiteSpace: 'nowrap',
          }}>
            {toast}
          </div>
        )}

        <PosCart
          lines={lines}
          discount={discount}
          staffName="Maria H."
          currency="kr"
          onDecrementLine={key => {
            const next = lines
              .map(l => l.key === key ? { ...l, quantity: l.quantity - 1 } : l)
              .filter(l => l.quantity > 0)
            setLines(next)
          }}
          onIncrementLine={key => setLines(lines.map(l => l.key === key ? { ...l, quantity: l.quantity + 1 } : l))}
          onEditLine={line => showToast(`Endre: ${line.name}`)}
          onPark={() => setView('park')}
          onDiscount={() => setView('discount')}
          onPay={() => setView('payment')}
          onBack={() => showToast('← tilbake til meny')}
          onCancel={() => { if (confirm('Avbryt bestilling?')) { setLines([]); setDisc(null) } }}
        />

        {view === 'payment' && (
          <PosPaymentFlow
            lines={lines}
            discount={discount}
            total={tot}
            staffName="Maria H."
            currency="kr"
            onComplete={r => { showToast(`✅ Betalt: ${r.charged / 100} kr`); setView('cart'); setLines([]); setDisc(null) }}
            onClose={() => setView('cart')}
          />
        )}

        {view === 'park' && (
          <PosParkFlow
            onPark={label => { showToast(`🅿️ Parkert: ${label}`); setView('cart'); setLines([]); setDisc(null) }}
            onClose={() => setView('cart')}
          />
        )}

        {view === 'discount' && (
          <PosDiscountFlow
            currency="kr"
            onApply={d => { setDisc(d); showToast(`% Rabatt: ${d.label}`); setView('cart') }}
            onClose={() => setView('cart')}
          />
        )}
      </div>
    )
  },
}

// ════════════════════════════════════════════════════════════════
// PosDrawer
// ════════════════════════════════════════════════════════════════

export const DrawerStory: StoryObj<typeof PinPad> = {
  name: 'PosDrawer — cash drawer',
  render: () => {
    const [entries, setEntries] = useState<DrawerEntry[]>([
      { direction: 'in', amount: 200000, time: '08:00:12', staffName: 'Maria H.' },
      { direction: 'out', amount: 5000, time: '09:14:33', staffName: 'Erik S.' },
    ])
    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: '100vh', background: 'var(--color-bg-page)', margin: '0 auto' }}>
        <div style={{ padding: 20, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Kasseskuff åpen (alltid synlig i story)
        </div>
        <PosDrawer
          entries={entries}
          staffName="Maria H."
          currency="kr"
          onAddEntry={e => setEntries(prev => [...prev, e])}
          onClose={() => {}}
        />
      </div>
    )
  },
}

// ════════════════════════════════════════════════════════════════
// PosZReport
// ════════════════════════════════════════════════════════════════

const SAMPLE_RECEIPTS: ZReportReceipt[] = [
  { total: 32800, discountAmount: 0 },
  { total: 22000, discountAmount: 4400 },
  { total: 16900, discountAmount: 0 },
  { total: 41500, discountAmount: 8300 },
  { total: 8900,  discountAmount: 0 },
]

export const ZReportStory: StoryObj<typeof PinPad> = {
  name: 'PosZReport — Z-rapport',
  render: () => (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: '100vh', background: 'var(--color-bg-page)', margin: '0 auto' }}>
      <div style={{ padding: 20, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        Z-rapport (alltid synlig i story)
      </div>
      <PosZReport
        receipts={SAMPLE_RECEIPTS}
        drawerBalance={195000}
        currency="kr"
        date="10.03.2026"
        onClose={() => {}}
      />
    </div>
  ),
}
