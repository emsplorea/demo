/**
 * PosPaymentFlow — POS Component 03
 * Plorea Design System v3.2
 *
 * Complete payment flow for physical POS terminals.
 * Rendered as bottom sheets stacked on a backdrop.
 *
 * Screens (linear depth stack, not steps):
 *
 *   choose    — Hele beløpet / Splitt på personer / Splitt per vare / CashWithdraw
 *   method    — Kort vs Kontant selection (large icons, easy tap)
 *   terminal  — "Hold kortet mot terminalen" / "Betal i kassen" waiting screen
 *   split-persons — person count selector, per-person amount
 *   split-items   — per-line item quantity selector
 *   confirmed — ✅ animation, then auto-advance to receipt
 *   receipt   — monospace receipt card, Print button
 *
 * Rules:
 * - All sheets: white, rounded top 20px, slide-up animation
 * - Terminal screen: pulsing ring animation on card icon
 * - Confirmed: scale-in ✅ animation, 1.8s auto-dismiss
 * - Receipt: monospace font, dashed dividers — thermal printer aesthetic
 * - Split receipt gets "SPLITT-KVITTERING" badge
 * - Cash withdraw: added to order total, shown in receipt
 * - Prices in minor units (øre)
 */

import { useState, ReactNode } from 'react'
import type { PosCartLine, PosDiscount } from './PosCart'

// ── Types

export type PosPaymentMode = 'full' | 'persons' | 'items'
export type PosPaymentMethod = 'card' | 'cash'

export interface PosReceiptData {
  id: string
  lines: { name: string; qty: number; unitPrice: number }[]
  subtotal: number
  discountLabel?: string
  discountAmount?: number
  total: number
  cashWithdraw?: number
  charged: number
  method: PosPaymentMethod
  staffName: string
  time: string
  date: string
  isSplit?: PosPaymentMode
}

export interface PosPaymentFlowProps {
  lines: PosCartLine[]
  discount?: PosDiscount | null
  total: number
  staffName: string
  currency?: string
  onComplete: (receipt: PosReceiptData) => void
  onClose: () => void
}

// ── Helpers

function fmt(minor: number, currency = 'kr') {
  return `${(minor / 100).toLocaleString('nb-NO')} ${currency}`
}
function nowTime() {
  return new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function todayDate() {
  return new Date().toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function vat(total: number) { return Math.round(total * 0.25 / 1.25) }

// ── Sheet wrapper
function Sheet({ children, onBackdropClick }: { children: ReactNode; onBackdropClick?: () => void }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.48)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 200, animation: 'fadeIn var(--dur-fast)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onBackdropClick?.() }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp var(--dur-slow) cubic-bezier(.16,1,.3,1)',
          boxShadow: 'var(--elevation-4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ── Modal wrapper (centred)
function Modal({ children, onBackdropClick }: { children: ReactNode; onBackdropClick?: () => void }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.48)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, animation: 'fadeIn var(--dur-fast)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onBackdropClick?.() }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 20, padding: '24px 22px',
          width: 'calc(100% - 40px)', maxWidth: 380,
          animation: 'scaleIn 0.25s cubic-bezier(.16,1,.3,1)',
          boxShadow: 'var(--elevation-4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ── Shared sheet header
function SheetHead({ title }: { title: string }) {
  return (
    <div style={{
      padding: '16px 18px 10px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ width: 36 }} />
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 17, fontWeight: 700,
        color: 'var(--color-text-primary)', flex: 1, textAlign: 'center',
      }}>
        {title}
      </div>
      <div style={{ width: 36 }} />
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '14px 16px', borderRadius: 14,
      border: '1.5px solid var(--color-border)',
      background: 'var(--color-surface)', color: 'var(--color-text-primary)',
      fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    }}>
      ←
    </button>
  )
}

function BigBtn({ icon, label, onClick }: {
  icon: string; label: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8,
      padding: '24px 14px',
      borderRadius: 20, border: '1.5px solid var(--color-border)',
      background: 'var(--color-surface)', cursor: 'pointer',
      boxShadow: 'var(--elevation-1)',
      fontFamily: 'inherit',
      transition: 'background var(--dur-fast)',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
    >
      <span style={{ fontSize: 42 }}>{icon}</span>
      <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700 }}>{label}</span>
    </button>
  )
}

function OptionRow({ icon, title, subtitle, onClick }: {
  icon: string; title: string; subtitle?: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', padding: 14,
      borderRadius: 14, border: '1.5px solid var(--color-border)',
      background: 'var(--color-surface)', cursor: 'pointer',
      textAlign: 'left', marginBottom: 8, fontFamily: 'inherit',
      transition: 'background var(--dur-fast)',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{subtitle}</div>}
      </div>
      <span style={{ fontSize: 14, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>›</span>
    </button>
  )
}

// ── Screen: choose payment mode
function ChooseScreen({
  total, currency, cashWithdraw,
  onFull, onSplitPersons, onSplitItems, onCashWithdraw,
}: {
  total: number; currency: string; cashWithdraw: number
  onFull: () => void; onSplitPersons: () => void
  onSplitItems: () => void; onCashWithdraw: () => void
}) {
  const charged = total + cashWithdraw
  return (
    <div style={{ padding: '14px 20px 20px' }}>
      <OptionRow
        icon="💳"
        title={`Hele beløpet – ${fmt(charged, currency)}`}
        onClick={onFull}
      />
      <OptionRow
        icon="👥"
        title="Splitt på personer"
        subtitle="Del regningen likt"
        onClick={onSplitPersons}
      />
      <OptionRow
        icon="📋"
        title="Splitt per vare"
        subtitle="Velg hvem som betaler"
        onClick={onSplitItems}
      />
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--color-text-secondary)',
        marginBottom: 10, marginTop: 12,
      }}>
        Tillegg
      </div>
      <OptionRow
        icon="🏧"
        title="Cash Withdraw"
        subtitle={cashWithdraw > 0 ? `${fmt(cashWithdraw, currency)} lagt til` : 'Kontantuttak'}
        onClick={onCashWithdraw}
      />
    </div>
  )
}

// ── Screen: method selection (Kort / Kontant)
function MethodScreen({
  amount, currency, onCard, onCash,
}: { amount: number; currency: string; onCard: () => void; onCash: () => void }) {
  return (
    <div style={{ padding: '14px 20px 20px' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <BigBtn icon="💳" label="Kort" onClick={onCard} />
        <BigBtn icon="💵" label="Kontant" onClick={onCash} />
      </div>
    </div>
  )
}

// ── Screen: terminal waiting
function TerminalScreen({
  method, amount, cashWithdraw, currency, onConfirm,
}: {
  method: PosPaymentMethod; amount: number
  cashWithdraw: number; currency: string; onConfirm: () => void
}) {
  const isCard = method === 'card'
  return (
    <div style={{ padding: '14px 20px 20px' }}>
      <div style={{
        textAlign: 'center',
        padding: '28px 16px',
        background: 'var(--color-bg-page)',
        borderRadius: 20,
        border: '1px solid var(--color-border)',
        position: 'relative', overflow: 'hidden',
        marginBottom: 16,
      }}>
        {/* Pulse ring for card */}
        {isCard && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 90, height: 90, borderRadius: '50%',
            border: '3px solid var(--color-primary)',
            animation: 'pulse 2s infinite',
            opacity: 0.4, pointerEvents: 'none',
          }} />
        )}
        <div style={{ fontSize: 48, marginBottom: 8 }}>{isCard ? '📱' : '💵'}</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 18, fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>
          {isCard ? 'Hold kortet mot terminalen' : 'Betal i kassen'}
        </div>
        <div style={{
          fontSize: 22, fontWeight: 700,
          color: 'var(--color-secondary)', marginTop: 8,
        }}>
          {fmt(amount, currency)}
        </div>
        {cashWithdraw > 0 && (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Inkl. {fmt(cashWithdraw, currency)} uttak
          </div>
        )}
      </div>
      <button onClick={onConfirm} style={{
        padding: '14px 20px', background: 'var(--color-secondary)', color: '#fff',
        border: 'none', borderRadius: 14,
        fontSize: 14, fontWeight: 700,
        width: '100%', cursor: 'pointer', fontFamily: 'inherit',
      }}>
        {isCard ? 'Simuler betaling ✓' : 'Bekreft mottatt ✓'}
      </button>
    </div>
  )
}

// ── Screen: split on persons
function SplitPersonsScreen({
  total, currency, cashWithdraw, onPayPart,
}: {
  total: number; currency: string; cashWithdraw: number
  onPayPart: (method: PosPaymentMethod, amount: number) => void
}) {
  const [count, setCount] = useState(2)
  const perPerson = Math.ceil(total / count)
  const charged = perPerson + cashWithdraw

  return (
    <div style={{ padding: '14px 20px 20px' }}>
      {/* Person stepper */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg-page)', borderRadius: 14, overflow: 'hidden',
        marginBottom: 16, border: '1px solid var(--color-border)',
      }}>
        {[
          { label: '−', onClick: () => setCount(c => Math.max(2, c - 1)) },
          null,
          { label: '+', onClick: () => setCount(c => Math.min(10, c + 1)) },
        ].map((btn, i) =>
          btn === null ? (
            <span key={i} style={{
              width: 56, textAlign: 'center',
              fontFamily: "'Sora', sans-serif",
              fontSize: 26, fontWeight: 700,
              color: 'var(--color-secondary)',
            }}>
              {count}
            </span>
          ) : (
            <button key={i} onClick={btn.onClick} style={{
              width: 52, height: 52, border: 'none',
              background: 'transparent', color: 'var(--color-text-primary)',
              fontSize: 22, fontWeight: 700,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {btn.label}
            </button>
          )
        )}
      </div>

      {/* Summary */}
      <div style={{
        background: 'var(--color-selection)',
        borderRadius: 14, padding: '12px 16px', marginBottom: 16,
        border: '1px solid rgba(107,184,218,.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '3px 0' }}>
          <span>Totalt</span><span>{fmt(total, currency)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '3px 0' }}>
          <span>Per person</span>
          <span style={{
            fontWeight: 700, color: 'var(--color-secondary)',
            fontSize: 20, fontFamily: "'Sora', sans-serif",
          }}>
            {fmt(perPerson, currency)}
          </span>
        </div>
      </div>

      {/* Pay buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <BigBtn icon="💳" label="Kort" onClick={() => onPayPart('card', charged)} />
        <BigBtn icon="💵" label="Kontant" onClick={() => onPayPart('cash', charged)} />
      </div>
    </div>
  )
}

// ── Screen: split by items
function SplitItemsScreen({
  lines, currency, cashWithdraw, onPayPart,
}: {
  lines: PosCartLine[]; currency: string; cashWithdraw: number
  onPayPart: (method: PosPaymentMethod, amount: number) => void
}) {
  const [sel, setSel] = useState<Record<string, number>>({})

  const partTotal = lines.reduce((s, l) => {
    const unitPrice = l.unitPrice + l.modifierDelta
    return s + unitPrice * (sel[l.key] || 0)
  }, 0)
  const charged = partTotal + cashWithdraw

  function updateSel(key: string, delta: number, max: number) {
    setSel(prev => {
      const next = Math.min(max, Math.max(0, (prev[key] || 0) + delta))
      return { ...prev, [key]: next }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px' }}>
        {lines.map(line => {
          const sq = sel[line.key] || 0
          const up = line.unitPrice + line.modifierDelta
          const atS = line.modifierSummary
          return (
            <div key={line.key} style={{
              padding: 14, borderRadius: 14,
              border: `1.5px solid ${sq ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: sq ? 'var(--color-selection)' : 'var(--color-surface)',
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                {line.icon && <span style={{ fontSize: 22 }}>{line.icon}</span>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{line.name}</div>
                  {atS && <div style={{ fontSize: 11, color: 'var(--color-secondary)' }}>{atS}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{fmt(up, currency)}/stk</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: sq ? 'var(--color-secondary)' : 'var(--color-text-secondary)' }}>
                    {fmt(up * sq, currency)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Bestilt: {line.quantity}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginRight: 4 }}>Betal:</span>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'var(--color-bg-page)',
                    borderRadius: 10, overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                  }}>
                    {['−', null, '+'].map((btn, i) =>
                      btn === null ? (
                        <span key={i} style={{
                          width: 22, textAlign: 'center',
                          fontSize: 14, fontWeight: 700,
                          color: sq ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                        }}>
                          {sq}
                        </span>
                      ) : (
                        <button key={i} onClick={() => updateSel(line.key, btn === '+' ? 1 : -1, line.quantity)} style={{
                          width: 36, height: 36, border: 'none',
                          background: 'transparent', fontSize: 16, fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {btn}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 20px 20px',
        alignItems: 'center', borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Din del</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-secondary)' }}>
            {fmt(partTotal, currency)}
          </div>
        </div>
        {partTotal > 0 && (
          <>
            <button onClick={() => onPayPart('card', charged)} style={{
              padding: '12px 18px', borderRadius: 10,
              border: '1.5px solid rgba(107,184,218,.25)',
              background: 'var(--color-selection)', color: 'var(--color-secondary)',
              fontSize: 18, fontWeight: 600, cursor: 'pointer',
            }}>💳</button>
            <button onClick={() => onPayPart('cash', charged)} style={{
              padding: '12px 18px', borderRadius: 10,
              border: '1.5px solid rgba(107,184,218,.25)',
              background: 'var(--color-selection)', color: 'var(--color-secondary)',
              fontSize: 18, fontWeight: 600, cursor: 'pointer',
            }}>💵</button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Screen: cash withdraw amount
function CashWithdrawScreen({
  current, currency, onSet,
}: { current: number; currency: string; onSet: (amount: number) => void }) {
  const [custom, setCustom] = useState('')
  const PRESETS = [10000, 20000, 30000, 50000, 100000]

  return (
    <div style={{ padding: '14px 20px 20px' }}>
      <div style={{ textAlign: 'center', fontSize: 36, marginBottom: 8 }}>🏧</div>
      <div style={{
        fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700,
        textAlign: 'center', marginBottom: 6,
      }}>
        Cash Withdraw
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 14 }}>
        Legges til kundens betaling
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 14 }}>
        {PRESETS.map(v => (
          <button key={v} onClick={() => onSet(v)} style={{
            padding: '10px 16px', borderRadius: 10,
            border: `1.5px solid ${current === v ? 'var(--color-primary)' : 'rgba(107,184,218,.25)'}`,
            background: current === v ? 'var(--color-selection)' : 'var(--color-selection)',
            color: 'var(--color-secondary)',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
            {fmt(v, currency)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          placeholder="Annet beløp (øre)"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          style={{
            flex: 1, padding: '14px 16px',
            borderRadius: 10, border: '1.5px solid var(--color-border)',
            background: 'var(--color-surface)', fontSize: 16, outline: 'none',
          }}
        />
        <button onClick={() => { const v = parseInt(custom); if (v > 0) onSet(v) }} style={{
          padding: '14px 20px', background: 'var(--color-secondary)', color: '#fff',
          border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          OK
        </button>
      </div>
    </div>
  )
}

// ── Screen: receipt
function ReceiptScreen({ receipt, currency, onClose, onPrint }: {
  receipt: PosReceiptData; currency: string; onClose: () => void; onPrint: () => void
}) {
  return (
    <div style={{ padding: '20px 22px' }}>
      <div style={{ fontFamily: 'monospace' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700 }}>Plorea</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            #{receipt.id.slice(-6)} · {receipt.date} {receipt.time}
          </div>
          {receipt.isSplit && (
            <div style={{
              fontSize: 10, color: 'var(--color-secondary)',
              fontWeight: 600, marginTop: 2,
            }}>
              SPLITT-KVITTERING
            </div>
          )}
        </div>
        <div style={{ borderBottom: '1px dashed var(--color-border)', margin: '6px 0' }} />

        {/* Lines */}
        {receipt.lines.map((l, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, padding: '2px 0',
          }}>
            <span>{l.qty}x {l.name}</span>
            <span>{fmt(l.unitPrice * l.qty, currency)}</span>
          </div>
        ))}

        <div style={{ borderBottom: '1px dashed var(--color-border)', margin: '6px 0' }} />

        {/* Discount */}
        {receipt.discountAmount && receipt.discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-error)' }}>
            <span>Rabatt</span><span>−{fmt(receipt.discountAmount, currency)}</span>
          </div>
        )}

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, padding: '4px 0' }}>
          <span>TOTALT</span><span>{fmt(receipt.total, currency)}</span>
        </div>

        {/* Cash withdraw */}
        {receipt.cashWithdraw && receipt.cashWithdraw > 0 && (
          <>
            <div style={{ borderBottom: '1px dashed var(--color-border)', margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#2563eb' }}>
              <span>🏧 Uttak</span><span>+{fmt(receipt.cashWithdraw, currency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
              <span>Belastet</span><span>{fmt(receipt.charged, currency)}</span>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 6 }}>
          {receipt.method === 'card' ? '💳 Kort' : '💵 Kontant'} · {receipt.staffName}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '14px 16px',
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface)', color: 'var(--color-text-primary)',
          borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Lukk
        </button>
        <button onClick={onPrint} style={{
          flex: 1, padding: '14px 20px',
          background: 'var(--color-secondary)', color: '#fff',
          border: 'none', borderRadius: 14,
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          🖨️ Skriv ut
        </button>
      </div>
    </div>
  )
}

// ── Main export

type Screen =
  | { id: 'choose' }
  | { id: 'cw' }
  | { id: 'method'; mode: PosPaymentMode; amount: number }
  | { id: 'terminal'; method: PosPaymentMethod; amount: number; mode: PosPaymentMode }
  | { id: 'split-persons' }
  | { id: 'split-items' }
  | { id: 'confirmed'; receipt: PosReceiptData }
  | { id: 'receipt'; receipt: PosReceiptData }

export function PosPaymentFlow({
  lines, discount, total, staffName, currency = 'kr',
  onComplete, onClose,
}: PosPaymentFlowProps) {
  const [cashWithdraw, setCashWithdraw] = useState(0)
  const [screen, setScreen] = useState<Screen>({ id: 'choose' })

  function buildReceipt(
    method: PosPaymentMethod,
    charged: number,
    mode: PosPaymentMode,
  ): PosReceiptData {
    return {
      id: String(Date.now()),
      lines: lines.map(l => ({ name: l.name, qty: l.quantity, unitPrice: l.unitPrice + l.modifierDelta })),
      subtotal: total,
      discountLabel: discount?.label,
      discountAmount: discount
        ? discount.type === 'percent'
          ? Math.round(total * discount.value / 100)
          : Math.min(discount.value, total)
        : 0,
      total,
      cashWithdraw: cashWithdraw || undefined,
      charged,
      method,
      staffName,
      time: nowTime(),
      date: todayDate(),
      isSplit: mode !== 'full' ? mode : undefined,
    }
  }

  function doPayment(method: PosPaymentMethod, amount: number, mode: PosPaymentMode) {
    const receipt = buildReceipt(method, amount, mode)
    const s: Screen = { id: 'confirmed', receipt }
    setScreen(s)
    setTimeout(() => {
      setScreen({ id: 'receipt', receipt })
      onComplete(receipt)
    }, 1800)
  }

  const s = screen

  if (s.id === 'choose') {
    return (
      <Sheet onBackdropClick={onClose}>
        <SheetHead title={`Betaling – ${fmt(total + cashWithdraw, currency)}`} />
        <ChooseScreen
          total={total} currency={currency} cashWithdraw={cashWithdraw}
          onFull={() => setScreen({ id: 'method', mode: 'full', amount: total + cashWithdraw })}
          onSplitPersons={() => setScreen({ id: 'split-persons' })}
          onSplitItems={() => setScreen({ id: 'split-items' })}
          onCashWithdraw={() => setScreen({ id: 'cw' })}
        />
      </Sheet>
    )
  }

  if (s.id === 'cw') {
    return (
      <Sheet onBackdropClick={() => setScreen({ id: 'choose' })}>
        <SheetHead title="Cash Withdraw" />
        <CashWithdrawScreen
          current={cashWithdraw} currency={currency}
          onSet={v => { setCashWithdraw(v); setScreen({ id: 'choose' }) }}
        />
      </Sheet>
    )
  }

  if (s.id === 'method') {
    return (
      <Sheet onBackdropClick={() => setScreen({ id: 'choose' })}>
        <SheetHead title="Betalingsmetode" />
        <MethodScreen
          amount={s.amount} currency={currency}
          onCard={() => setScreen({ id: 'terminal', method: 'card', amount: s.amount, mode: s.mode })}
          onCash={() => setScreen({ id: 'terminal', method: 'cash', amount: s.amount, mode: s.mode })}
        />
      </Sheet>
    )
  }

  if (s.id === 'terminal') {
    return (
      <Sheet onBackdropClick={() => setScreen({ id: 'method', mode: s.mode, amount: s.amount })}>
        <SheetHead title={s.method === 'card' ? 'Kortbetaling' : 'Kontant'} />
        <TerminalScreen
          method={s.method} amount={s.amount}
          cashWithdraw={cashWithdraw} currency={currency}
          onConfirm={() => doPayment(s.method, s.amount, s.mode)}
        />
      </Sheet>
    )
  }

  if (s.id === 'split-persons') {
    return (
      <Sheet onBackdropClick={() => setScreen({ id: 'choose' })}>
        <SheetHead title="Splitt på personer" />
        <SplitPersonsScreen
          total={total} currency={currency} cashWithdraw={cashWithdraw}
          onPayPart={(method, amount) =>
            setScreen({ id: 'terminal', method, amount, mode: 'persons' })
          }
        />
      </Sheet>
    )
  }

  if (s.id === 'split-items') {
    return (
      <Sheet onBackdropClick={() => setScreen({ id: 'choose' })}>
        <SheetHead title="Velg varer & antall" />
        <SplitItemsScreen
          lines={lines} currency={currency} cashWithdraw={cashWithdraw}
          onPayPart={(method, amount) =>
            setScreen({ id: 'terminal', method, amount, mode: 'items' })
          }
        />
      </Sheet>
    )
  }

  if (s.id === 'confirmed') {
    return (
      <Modal>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 8, animation: 'scaleIn 0.4s' }}>✅</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700 }}>
            Betaling godkjent!
          </div>
        </div>
      </Modal>
    )
  }

  if (s.id === 'receipt') {
    return (
      <Modal onBackdropClick={onClose}>
        <ReceiptScreen
          receipt={s.receipt} currency={currency}
          onClose={onClose}
          onPrint={() => alert('🖨️ Printer...')}
        />
      </Modal>
    )
  }

  return null
}
