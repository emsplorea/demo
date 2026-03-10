import { useState } from 'react'
import { AppShell }        from '@plorea/components'
import { OrderTable }      from '@plorea/components'
import { OrderCard }       from '@plorea/components'
import { CartSummary }     from '@plorea/components'
import { PaymentSelector } from '@plorea/components'
import { useDarkMode }     from '@plorea/components'
import type {
  OrderRow,
  CartLine,
  PaymentMethod,
  NavGroup,
} from '@plorea/components'

// ─────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────

const ORDER_ROWS: OrderRow[] = [
  { id: '2041', channel: 'table',    channelLabel: 'Table 4', items: 3, status: 'ready',       total: 'kr 284', time: '12:34' },
  { id: '2040', channel: 'takeaway', channelLabel: 'Takeaway', items: 1, status: 'in-progress', total: 'kr 89',  time: '12:31' },
  { id: '2039', channel: 'eatin',    channelLabel: 'Eat-in',  items: 5, status: 'new',          total: 'kr 512', time: '12:28' },
  { id: '2038', channel: 'combo',    channelLabel: 'Combo',   items: 2, status: 'done',         total: 'kr 175', time: '12:19' },
  { id: '2037', channel: 'table',    channelLabel: 'Table 2', items: 4, status: 'error',        total: 'kr 340', time: '12:11' },
]

const INITIAL_CART: CartLine[] = [
  { id: 'l1', name: 'Margherita',     unitPrice: 11900, quantity: 2, modifiers: ['Extra cheese'] },
  { id: 'l2', name: 'Tiramisu',       unitPrice:  8900, quantity: 1 },
  { id: 'l3', name: 'Cola',           unitPrice:  3900, quantity: 1 },
]

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card',  label: 'Card',  description: 'Tap, insert or swipe', icon: '💳' },
  { id: 'cash',  label: 'Cash',  description: 'Count and confirm',    icon: '💵' },
  { id: 'vipps', label: 'Vipps', description: 'QR or phone number',   icon: '📱' },
]

type View = 'orders' | 'kds' | 'checkout'

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Operations',
    links: [
      { id: 'orders',   label: 'Order table' },
      { id: 'kds',      label: 'KDS view' },
      { id: 'checkout', label: 'Checkout' },
    ],
  },
  {
    label: 'Management',
    links: [
      { id: 'products', label: 'Products' },
      { id: 'reports',  label: 'Reports' },
      { id: 'settings', label: 'Settings' },
    ],
  },
]

// ─────────────────────────────────────────
// Views
// ─────────────────────────────────────────

function OrdersView() {
  const [selectedId, setSelectedId] = useState<string | undefined>('2041')
  const [rows, setRows] = useState(ORDER_ROWS)

  function handleCancel(row: OrderRow) {
    setRows(prev => prev.filter(r => r.id !== row.id))
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
          Canonical Order Table — density-aware, all channels and statuses.
          Click a row to select it.
        </p>
      </div>
      <OrderTable
        rows={rows}
        showDensityToggle
        selectedId={selectedId}
        onRowSelect={row => setSelectedId(row.id)}
        actions={[
          {
            icon: '✎',
            label: 'Edit',
            onClick: row => alert(`Edit ${row.id}`),
          },
          {
            icon: '✕',
            label: 'Cancel',
            onClick: handleCancel,
          },
        ]}
        totalRows={rows.length}
        emptyMessage="No active orders"
        emptyAction={{ label: 'New order', onClick: () => {} }}
      />
    </div>
  )
}

function KdsView() {
  const [cards, setCards] = useState([
    {
      id: '2044', channel: 'eatin'    as const, channelLabel: 'Eat-in',   time: '12:38',
      status: 'new'         as const, total: 'kr 348',
      items: [
        { name: 'Margherita', quantity: 2, modifiers: ['No garlic'] },
        { name: 'Tiramisu',   quantity: 1 },
      ],
    },
    {
      id: '2042', channel: 'table'    as const, channelLabel: 'Table 6',  time: '12:31',
      status: 'in-progress' as const, total: 'kr 189',
      items: [
        { name: 'Burger', quantity: 1 },
        { name: 'Fries',  quantity: 1 },
        { name: 'Cola',   quantity: 2 },
      ],
    },
    {
      id: '2040', channel: 'takeaway' as const, channelLabel: 'Takeaway', time: '12:27',
      status: 'ready'       as const, total: 'kr 129',
      items: [
        { name: 'Caesar Salad', quantity: 1, modifiers: ['Dressing on side'] },
      ],
    },
    {
      id: '2038', channel: 'combo'    as const, channelLabel: 'Combo',    time: '12:19',
      status: 'error'       as const, total: 'kr 225',
      items: [
        { name: 'Hot dog', quantity: 3 },
      ],
    },
  ])

  const ACTION_LABELS: Record<string, string> = {
    'new':         'Accept',
    'in-progress': 'Ready',
    'ready':       'Collect',
    'error':       'Retry',
    'done':        '',
  }

  const NEXT_STATUS: Record<string, 'in-progress' | 'ready' | 'done'> = {
    'new':         'in-progress',
    'in-progress': 'ready',
    'ready':       'done',
  }

  function handleAction(id: string) {
    setCards(prev => prev.map(c => {
      if (c.id !== id) return c
      const next = NEXT_STATUS[c.status]
      return next ? { ...c, status: next } : c
    }).filter(c => c.status !== 'done'))
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Canonical Order Cards — all four states. Actions advance status through the workflow.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {cards.map(card => (
          <OrderCard
            key={card.id}
            {...card}
            actionLabel={ACTION_LABELS[card.status]}
            onAction={handleAction}
          />
        ))}
        {cards.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, gridColumn: '1/-1' }}>
            All orders complete. 🎉
          </p>
        )}
      </div>
    </div>
  )
}

function CheckoutView() {
  const [lines, setLines] = useState<CartLine[]>(INITIAL_CART)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid]     = useState(false)

  function handleQtyChange(id: string, qty: number) {
    setLines(prev =>
      qty === 0
        ? prev.filter(l => l.id !== id)
        : prev.map(l => l.id === id ? { ...l, quantity: qty } : l)
    )
  }

  async function handleConfirm(methodId: string) {
    setPaying(true)
    await new Promise(r => setTimeout(r, 1800))
    setPaying(false)
    setPaid(true)
  }

  if (paid) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 22, fontWeight: 700,
          color: 'var(--color-text-primary)', marginBottom: 8,
        }}>
          Payment complete
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 32 }}>
          Order #2041 · Table 4
        </div>
        <button
          onClick={() => { setLines(INITIAL_CART); setPaid(false) }}
          style={{
            padding: '10px 24px', fontSize: 13, fontWeight: 700,
            background: 'var(--color-primary)',
            color: 'var(--color-primary-text)',
            border: 'none', borderRadius: 8, cursor: 'pointer',
          }}
        >
          New order
        </button>
      </div>
    )
  }

  const subtotal      = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
  const discountAmount = Math.round(subtotal * 0.1)
  const afterDisc     = subtotal - discountAmount
  const vatAmount     = Math.round(afterDisc * 0.15)
  const total         = afterDisc + vatAmount

  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Cart Summary and Payment Selector — adjust quantities, then charge.
      </p>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <CartSummary
          channel="table"
          channelLabel="Table 4"
          orderRef="2041"
          lines={lines}
          discountAmount={discountAmount}
          discountLabel="Member discount (10%)"
          vatRate={0.15}
          primaryLabel="Send to kitchen"
          secondaryLabel="Add note"
          onQuantityChange={handleQtyChange}
          onPrimary={() => {}}
          onSecondary={() => {}}
          emptyAction={{ label: 'Add products', onClick: () => setLines(INITIAL_CART) }}
        />
        <PaymentSelector
          methods={PAYMENT_METHODS}
          amount={total}
          currency="kr"
          orderSummary="Table 4 · #2041 · 3 items"
          showSplit
          onSplitPayment={() => alert('Split payment flow')}
          onConfirm={handleConfirm}
          processing={paying}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Root
// ─────────────────────────────────────────

const VIEW_TITLES: Record<View, string> = {
  orders:   'Order Table',
  kds:      'KDS View',
  checkout: 'Checkout',
}

export function App() {
  const { dark, toggle } = useDarkMode()
  const [view, setView]  = useState<View>('orders')

  return (
    <AppShell
      navGroups={NAV_GROUPS}
      activeId={view}
      title={VIEW_TITLES[view]}
      primaryAction={view === 'orders' ? 'New order' : undefined}
      onPrimaryAction={() => alert('New order')}
      topbarRight={
        <button
          onClick={toggle}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: '50%', cursor: 'pointer', fontSize: 16,
          }}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      }
      onNavChange={id => {
        if (id === 'orders' || id === 'kds' || id === 'checkout') {
          setView(id)
        }
      }}
    >
      {view === 'orders'   && <OrdersView />}
      {view === 'kds'      && <KdsView />}
      {view === 'checkout' && <CheckoutView />}
    </AppShell>
  )
}
