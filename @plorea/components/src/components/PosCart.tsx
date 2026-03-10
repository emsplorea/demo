/**
 * PosCart — POS Component 02
 * Plorea Design System v3.2
 *
 * Full-screen cart overlay for POS terminals. Slides up from bottom.
 * Staff-facing — different from CartSummary (customer-facing).
 *
 * Key differences from CartSummary:
 * - Full-screen slide-up (not sidebar/sheet)
 * - Per-item "Endre" button → triggers modifier re-selection
 * - Action bar: Cancel | Park 🅿️ | Discount % | Back | Pay
 * - Discount badge shown on cart bar when active
 * - Park goes to ParkFlow (table / contact / quick)
 * - Discount goes to DiscountFlow
 * - Pay goes to PaymentFlow
 *
 * Rules:
 * - Cancel is destructive: requires confirmation, uses error red
 * - Park: amber/yellow — neutral, non-destructive hold
 * - Discount: green tint — additive action
 * - Pay: primary blue — primary CTA
 * - Prices in minor units (øre)
 */

import { ReactNode } from 'react'

export interface PosCartLine {
  key: string
  productId: string | number
  name: string
  icon?: string
  description?: string
  category: string
  /** Base unit price in minor units */
  unitPrice: number
  quantity: number
  /** Modifier label string e.g. "Stor · Bacon, Ost" */
  modifierSummary?: string
  /** Price modifier from selections in minor units */
  modifierDelta: number
}

export interface PosDiscount {
  label: string
  type: 'percent' | 'fixed'
  value: number
}

export interface PosCartProps {
  lines: PosCartLine[]
  discount?: PosDiscount | null
  staffName?: string
  currency?: string
  onEditLine?: (line: PosCartLine) => void
  onIncrementLine?: (key: string) => void
  onDecrementLine?: (key: string) => void
  onPark?: () => void
  onDiscount?: () => void
  onPay?: () => void
  onBack?: () => void
  onCancel?: () => void
  style?: React.CSSProperties
}

function fmt(minor: number, currency = 'kr') {
  return `${(minor / 100).toLocaleString('nb-NO')} ${currency}`
}

function lineTotal(l: PosCartLine) {
  return (l.unitPrice + l.modifierDelta) * l.quantity
}

function subtotal(lines: PosCartLine[]) {
  return lines.reduce((s, l) => s + lineTotal(l), 0)
}

function discountAmount(sub: number, d?: PosDiscount | null) {
  if (!d) return 0
  return d.type === 'percent'
    ? Math.round(sub * d.value / 100)
    : Math.min(d.value, sub)
}

function Stepper({
  value, onDecrement, onIncrement,
}: { value: number; onDecrement: () => void; onIncrement: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--color-bg-page)',
      borderRadius: 10, overflow: 'hidden',
      border: '1px solid var(--color-border)',
    }}>
      {[
        { label: '−', onClick: onDecrement },
        null,
        { label: '+', onClick: onIncrement },
      ].map((btn, i) =>
        btn === null ? (
          <span key={i} style={{
            width: 22, textAlign: 'center',
            fontSize: 14, fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}>
            {value}
          </span>
        ) : (
          <button key={i} onClick={btn.onClick} style={{
            width: 36, height: 36, border: 'none',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            fontSize: 16, fontWeight: 600,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {btn.label}
          </button>
        )
      )}
    </div>
  )
}

function ActionBtn({
  children, onClick, variant = 'neutral',
}: { children: ReactNode; onClick?: () => void; variant?: 'neutral' | 'danger' | 'park' | 'discount' | 'primary' }) {
  const styles: Record<string, React.CSSProperties> = {
    neutral:  { border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-primary)' },
    danger:   { border: '1.5px solid rgba(218,107,107,.25)', background: 'rgba(218,107,107,.1)', color: 'var(--color-error)' },
    park:     { border: '1.5px solid rgba(218,218,107,.35)', background: 'rgba(218,218,107,.12)', color: '#8a7a20' },
    discount: { border: '1.5px solid rgba(107,218,178,.25)', background: 'rgba(107,218,178,.1)', color: 'var(--color-success)' },
    primary:  { border: 'none', background: 'var(--color-secondary)', color: '#fff' },
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 12px',
        borderRadius: 14,
        fontSize: 12, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        transition: 'opacity var(--dur-fast)',
        ...styles[variant],
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  )
}

export function PosCart({
  lines, discount, staffName, currency = 'kr',
  onEditLine, onIncrementLine, onDecrementLine,
  onPark, onDiscount, onPay, onBack, onCancel,
  style,
}: PosCartProps) {
  const sub = subtotal(lines)
  const da  = discountAmount(sub, discount)
  const tot = sub - da
  const vat = Math.round(tot * 0.25 / 1.25)
  const cnt = lines.reduce((s, l) => s + l.quantity, 0)

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--color-bg-page)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
      animation: 'slideUp var(--dur-slow) cubic-bezier(.16,1,.3,1)',
      ...style,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px 4px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 17, fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>
          Pl<span style={{ color: 'var(--color-primary)' }}>or</span>ea
        </div>
        {staffName && (
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{staffName}</span>
        )}
      </div>
      <div style={{
        padding: '6px 16px 12px',
        display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between',
        background: 'var(--color-surface)',
      }}>
        <span style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 20, fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>
          Bestilling
        </span>
        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{cnt} varer</span>
      </div>

      {/* Lines */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 14px', minHeight: 0 }}>
        {lines.map(line => {
          const lp = lineTotal(line)
          return (
            <div key={line.key} style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '12px 2px',
              borderBottom: '1px solid var(--color-border)',
              gap: 4,
            }}>
              {/* Left: icon + name + modifiers */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1, minWidth: 0 }}>
                {line.icon && (
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'var(--color-bg-page)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {line.icon}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{line.name}</div>
                  {line.modifierSummary && (
                    <div style={{
                      fontSize: 10, color: 'var(--color-secondary)',
                      marginTop: 1, fontWeight: 500,
                    }}>
                      {line.modifierSummary}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: edit + stepper + price */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-end', gap: 5, flexShrink: 0,
              }}>
                <button
                  onClick={() => onEditLine?.(line)}
                  style={{
                    padding: '3px 10px', borderRadius: 8,
                    border: '1px solid rgba(107,184,218,.25)',
                    background: 'var(--color-selection)',
                    color: 'var(--color-secondary)',
                    fontSize: 10, fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.02em',
                  }}
                >
                  Endre
                </button>
                <Stepper
                  value={line.quantity}
                  onDecrement={() => onDecrementLine?.(line.key)}
                  onIncrement={() => onIncrementLine?.(line.key)}
                />
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: 'var(--color-secondary)',
                  minWidth: 50, textAlign: 'right',
                }}>
                  {fmt(lp, currency)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--color-border)',
        flexShrink: 0, background: 'var(--color-surface)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-secondary)', padding: '2px 0' }}>
          <span>Subtotal</span><span>{fmt(sub, currency)}</span>
        </div>
        {discount && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-error)', padding: '2px 0' }}>
            <span>Rabatt ({discount.label})</span>
            <span>−{fmt(da, currency)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-secondary)', padding: '2px 0' }}>
          <span>MVA (inkl.)</span><span>{fmt(vat, currency)}</span>
        </div>
        <div style={{ height: 1, background: 'var(--color-border)', margin: '5px 0' }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Sora', sans-serif",
          fontSize: 18, fontWeight: 700,
          color: 'var(--color-text-primary)', padding: '3px 0',
        }}>
          <span>Totalt</span><span>{fmt(tot, currency)}</span>
        </div>
      </div>

      {/* Action bar */}
      <div style={{
        display: 'flex', gap: 6,
        padding: '12px 16px 20px',
        flexShrink: 0,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <ActionBtn variant="danger" onClick={onCancel}>Avbryt</ActionBtn>
        <ActionBtn variant="park" onClick={onPark}>🅿️</ActionBtn>
        <ActionBtn variant="discount" onClick={onDiscount}>%</ActionBtn>
        <ActionBtn variant="neutral" onClick={onBack}>←</ActionBtn>
        <button
          onClick={onPay}
          style={{
            flex: 1, padding: '14px 20px',
            background: 'var(--color-secondary)', color: '#fff',
            border: 'none', borderRadius: 14,
            fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Betal {fmt(tot, currency)}
        </button>
      </div>
    </div>
  )
}
