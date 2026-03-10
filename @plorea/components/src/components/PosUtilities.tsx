/**
 * PosParkFlow — POS Component 04a
 * PosDiscountFlow — POS Component 04b
 * PosDrawer — POS Component 04c
 * PosZReport — POS Component 04d
 *
 * Plorea Design System v3.2
 *
 * Four POS utility components — all modal/sheet overlays,
 * all exclusively for physical POS terminals.
 *
 * ── PosParkFlow ──────────────────────────────────────────────────
 * Lets staff park (hold) the current order.
 * Three options: Table number, Name/Phone, Quick park.
 *   - Table: 5×4 grid (1–20), yellow CTA once selected
 *   - Contact: toggle Name ↔ Phone, text input, Enter to confirm
 *   - Quick: immediate park with "Rask" label
 * onPark(label) called — caller handles cart persistence.
 *
 * ── PosDiscountFlow ──────────────────────────────────────────────
 * Applies a discount to the current order.
 * Quick picks: preset % and fixed-kr options.
 * Custom: toggle % / kr, numeric input.
 * onApply(discount) called — caller stores on cart state.
 *
 * ── PosDrawer ────────────────────────────────────────────────────
 * Cash drawer balance tracker.
 * In/Out toggle, amount input with OK, scrollable transaction log.
 * Balance shown green ≥ 0, red < 0.
 * onAddEntry(entry) for persistence — entries passed as prop.
 *
 * ── PosZReport ───────────────────────────────────────────────────
 * End-of-day Z-report modal. Monospace thermal printer aesthetic.
 * Totals calculated from receipts prop.
 * Read-only — no mutations.
 *
 * Rules (all four):
 * - All: bottom sheet with blur backdrop (park/discount/drawer)
 * - Z-report: centred modal
 * - Park amber: #b5a825 / rgba(218,218,107,...)
 * - Prices in minor units (øre)
 */

import { useState, ReactNode, useRef, useEffect } from 'react'
import type { PosDiscount } from './PosCart'

// ── Shared primitives ─────────────────────────────────────────────

function Sheet({ children, onBackdropClick }: { children: ReactNode; onBackdropClick?: () => void }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 200, animation: 'fadeIn var(--dur-fast)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onBackdropClick?.() }}
    >
      <div
        style={{
          background: 'var(--color-surface)', borderRadius: '20px 20px 0 0',
          width: '100%', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
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

function Modal({ children, onBackdropClick }: { children: ReactNode; onBackdropClick?: () => void }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, animation: 'fadeIn var(--dur-fast)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onBackdropClick?.() }}
    >
      <div
        style={{
          background: 'var(--color-surface)', borderRadius: 20,
          padding: '24px 22px', width: 'calc(100% - 40px)', maxWidth: 380,
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
        fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)',
        flex: 1, textAlign: 'center',
      }}>
        {title}
      </div>
      <div style={{ width: 36 }} />
    </div>
  )
}

function OptionRow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', padding: 14, borderRadius: 14,
      border: '1.5px solid var(--color-border)', background: 'var(--color-surface)',
      cursor: 'pointer', textAlign: 'left', marginBottom: 8, fontFamily: 'inherit',
      transition: 'background var(--dur-fast)',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</div>
      <span style={{ fontSize: 14, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>›</span>
    </button>
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

function fmt(minor: number, currency = 'kr') {
  return `${(minor / 100).toLocaleString('nb-NO')} ${currency}`
}

// ════════════════════════════════════════════════════════════════
// PosParkFlow
// ════════════════════════════════════════════════════════════════

export interface PosParkFlowProps {
  onPark: (label: string) => void
  onClose: () => void
}

type ParkScreen = 'choose' | 'table' | 'contact'

export function PosParkFlow({ onPark, onClose }: PosParkFlowProps) {
  const [screen, setScreen] = useState<ParkScreen>('choose')
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [contactType, setContactType] = useState<'name' | 'phone'>('name')
  const [contactVal, setContactVal] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (screen === 'contact') setTimeout(() => inputRef.current?.focus(), 100)
  }, [screen])

  if (screen === 'choose') {
    return (
      <Sheet onBackdropClick={onClose}>
        <SheetHead title="Parkér" />
        <div style={{ padding: '14px 20px 20px' }}>
          <OptionRow icon="🍽️" label="Bordnummer" onClick={() => setScreen('table')} />
          <OptionRow icon="👤" label="Navn / Telefon" onClick={() => setScreen('contact')} />
          <OptionRow icon="⚡" label="Rask parkering" onClick={() => onPark('Rask')} />
        </div>
      </Sheet>
    )
  }

  if (screen === 'table') {
    return (
      <Sheet onBackdropClick={onClose}>
        <SheetHead title="Velg bord" />
        <div style={{ padding: '14px 20px 20px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16,
          }}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map(t => (
              <button key={t} onClick={() => setSelectedTable(t)} style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: `1.5px solid ${selectedTable === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: selectedTable === t ? 'var(--color-selection)' : 'var(--color-surface)',
                color: selectedTable === t ? 'var(--color-secondary)' : 'var(--color-text-primary)',
                fontSize: 17, fontWeight: 700,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--dur-fast)',
              }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <BackBtn onClick={() => setScreen('choose')} />
            <button
              onClick={() => selectedTable && onPark(`Bord ${selectedTable}`)}
              disabled={!selectedTable}
              style={{
                flex: 1, padding: 14,
                background: selectedTable ? '#b5a825' : 'var(--color-border)',
                color: '#fff', border: 'none', borderRadius: 14,
                fontSize: 14, fontWeight: 700,
                cursor: selectedTable ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              }}
            >
              Parkér bord {selectedTable ?? '…'}
            </button>
          </div>
        </div>
      </Sheet>
    )
  }

  // contact screen
  const placeholder = contactType === 'phone' ? 'Telefonnummer…' : 'Navn…'
  return (
    <Sheet onBackdropClick={onClose}>
      <SheetHead title="Identifiser" />
      <div style={{ padding: '14px 20px 20px' }}>
        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['name', 'phone'] as const).map(t => (
            <button key={t} onClick={() => setContactType(t)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 5, padding: 12, borderRadius: 10,
              border: `1.5px solid ${contactType === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: contactType === t ? 'var(--color-selection)' : 'var(--color-surface)',
              color: contactType === t ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              {t === 'name' ? '👤 Navn' : '📞 Tlf'}
            </button>
          ))}
        </div>

        <input
          ref={inputRef}
          type={contactType === 'phone' ? 'tel' : 'text'}
          placeholder={placeholder}
          value={contactVal}
          onChange={e => setContactVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && contactVal.trim()) {
              onPark(contactType === 'phone' ? `📞 ${contactVal.trim()}` : contactVal.trim())
            }
          }}
          style={{
            width: '100%', padding: '14px 16px',
            borderRadius: 10, border: '1.5px solid var(--color-border)',
            background: 'var(--color-surface)', color: 'var(--color-text-primary)',
            fontSize: 16, fontWeight: 500, outline: 'none', marginBottom: 12,
          }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <BackBtn onClick={() => setScreen('choose')} />
          <button
            onClick={() => contactVal.trim() && onPark(
              contactType === 'phone' ? `📞 ${contactVal.trim()}` : contactVal.trim()
            )}
            style={{
              flex: 1, padding: 14,
              background: '#b5a825', color: '#fff',
              border: 'none', borderRadius: 14,
              fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Parkér
          </button>
        </div>
      </div>
    </Sheet>
  )
}

// ════════════════════════════════════════════════════════════════
// PosDiscountFlow
// ════════════════════════════════════════════════════════════════

export interface PosDiscountPreset {
  label: string
  type: 'percent' | 'fixed'
  value: number
}

export interface PosDiscountFlowProps {
  presets?: PosDiscountPreset[]
  currency?: string
  onApply: (discount: PosDiscount) => void
  onClose: () => void
}

const DEFAULT_PRESETS: PosDiscountPreset[] = [
  { label: '10%',   type: 'percent', value: 10 },
  { label: '20%',   type: 'percent', value: 20 },
  { label: '50%',   type: 'percent', value: 50 },
  { label: 'Ansatt', type: 'percent', value: 30 },
  { label: '50 kr', type: 'fixed',   value: 5000 },
  { label: '100 kr', type: 'fixed',  value: 10000 },
]

export function PosDiscountFlow({
  presets = DEFAULT_PRESETS,
  currency = 'kr',
  onApply,
  onClose,
}: PosDiscountFlowProps) {
  const [custType, setCustType] = useState<'percent' | 'fixed'>('percent')
  const [custVal, setCustVal] = useState('')

  return (
    <Modal onBackdropClick={onClose}>
      <div style={{
        fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700,
        textAlign: 'center', marginBottom: 12,
      }}>
        Rabatt
      </div>

      {/* Quick presets */}
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 10,
      }}>
        Hurtigvalg
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {presets.map(p => (
          <button key={p.label} onClick={() => onApply({ label: p.label, type: p.type, value: p.value })} style={{
            padding: '12px 16px', borderRadius: 10,
            border: '1.5px solid var(--color-border)', background: 'var(--color-surface)',
            cursor: 'pointer', minWidth: 65,
            fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center',
            transition: 'background var(--dur-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom */}
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--color-text-secondary)', marginBottom: 10,
      }}>
        Egendefinert
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {(['percent', 'fixed'] as const).map(t => (
          <button key={t} onClick={() => setCustType(t)} style={{
            flex: 1, padding: 12, borderRadius: 10,
            border: `1.5px solid ${custType === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: custType === t ? 'var(--color-selection)' : 'var(--color-surface)',
            color: custType === t ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            {t === 'percent' ? '%' : 'kr'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          placeholder={custType === 'percent' ? 'Prosent' : 'Beløp (øre)'}
          value={custVal}
          onChange={e => setCustVal(e.target.value)}
          style={{
            flex: 1, padding: '14px 16px', borderRadius: 10,
            border: '1.5px solid var(--color-border)',
            background: 'var(--color-surface)', fontSize: 16, outline: 'none',
          }}
        />
        <button
          onClick={() => {
            const v = parseInt(custVal)
            if (v > 0) onApply({
              label: custType === 'percent' ? `${v}%` : fmt(v, currency),
              type: custType,
              value: v,
            })
          }}
          style={{
            padding: '14px 20px', background: 'var(--color-secondary)', color: '#fff',
            border: 'none', borderRadius: 14,
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Bruk
        </button>
      </div>
    </Modal>
  )
}

// ════════════════════════════════════════════════════════════════
// PosDrawer
// ════════════════════════════════════════════════════════════════

export interface DrawerEntry {
  direction: 'in' | 'out'
  amount: number     // minor units (øre)
  time: string
  staffName: string
}

export interface PosDrawerProps {
  entries: DrawerEntry[]
  currency?: string
  onAddEntry: (entry: DrawerEntry) => void
  onClose: () => void
  staffName: string
}

export function PosDrawer({ entries, currency = 'kr', onAddEntry, onClose, staffName }: PosDrawerProps) {
  const [direction, setDirection] = useState<'in' | 'out'>('in')
  const [amount, setAmount] = useState('')

  const balance = entries.reduce((s, e) => s + (e.direction === 'in' ? e.amount : -e.amount), 0)
  const balancePositive = balance >= 0

  function handleAdd() {
    const v = parseInt(amount)
    if (v > 0) {
      onAddEntry({
        direction,
        amount: v,
        time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        staffName,
      })
      setAmount('')
    }
  }

  return (
    <Sheet onBackdropClick={onClose}>
      <SheetHead title="💰 Kasseskuff" />
      <div style={{ padding: '14px 20px 20px', flex: 1, overflowY: 'auto' }}>

        {/* Balance */}
        <div style={{
          textAlign: 'center', padding: 14,
          background: 'var(--color-bg-page)', borderRadius: 14,
          marginBottom: 14, border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Saldo</div>
          <div style={{
            fontSize: 28, fontWeight: 700,
            color: balancePositive ? 'var(--color-success)' : 'var(--color-error)',
          }}>
            {fmt(balance, currency)}
          </div>
        </div>

        {/* Direction toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {(['in', 'out'] as const).map(d => (
            <button key={d} onClick={() => setDirection(d)} style={{
              flex: 1, padding: 12, borderRadius: 10,
              border: `1.5px solid ${direction === d
                ? d === 'in' ? 'var(--color-success)' : 'var(--color-error)'
                : 'var(--color-border)'}`,
              background: direction === d
                ? d === 'in' ? 'rgba(107,218,178,.1)' : 'rgba(218,107,107,.1)'
                : 'var(--color-surface)',
              color: direction === d
                ? d === 'in' ? 'var(--color-success)' : 'var(--color-error)'
                : 'var(--color-text-secondary)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              {d === 'in' ? 'Inn' : 'Ut'}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            type="number"
            placeholder="Beløp (øre)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{
              flex: 1, padding: '14px 16px', borderRadius: 10,
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface)', fontSize: 16, outline: 'none',
            }}
          />
          <button onClick={handleAdd} style={{
            padding: '14px 20px', background: 'var(--color-secondary)', color: '#fff',
            border: 'none', borderRadius: 14,
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            OK
          </button>
        </div>

        {/* Log */}
        {[...entries].reverse().map((e, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, padding: '5px 0',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{ color: e.direction === 'in' ? 'var(--color-success)' : 'var(--color-error)' }}>
              {e.direction === 'in' ? '+' : '−'}{fmt(e.amount, currency)}
            </span>
            <span style={{ color: 'var(--color-text-secondary)' }}>{e.time}</span>
          </div>
        ))}

        {entries.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 16, fontSize: 13 }}>
            Ingen transaksjoner
          </div>
        )}
      </div>
    </Sheet>
  )
}

// ════════════════════════════════════════════════════════════════
// PosZReport
// ════════════════════════════════════════════════════════════════

export interface ZReportReceipt {
  total: number
  discountAmount?: number
}

export interface PosZReportProps {
  receipts: ZReportReceipt[]
  drawerBalance: number
  currency?: string
  date?: string
  onClose: () => void
}

export function PosZReport({
  receipts, drawerBalance, currency = 'kr', date, onClose,
}: PosZReportProps) {
  const today = date ?? new Date().toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const totalDiscount = receipts.reduce((s, r) => s + (r.discountAmount ?? 0), 0)
  const netTotal      = receipts.reduce((s, r) => s + r.total, 0)
  const grossTotal    = netTotal + totalDiscount
  const vatAmount     = Math.round(netTotal * 0.25 / 1.25)

  return (
    <Modal onBackdropClick={onClose}>
      <div style={{ fontFamily: 'monospace' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700 }}>Z-RAPPORT</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{today}</div>
        </div>
        <div style={{ borderBottom: '1px dashed var(--color-border)', margin: '6px 0' }} />

        {[
          { label: 'Salg',      value: String(receipts.length),     color: 'var(--color-text-primary)' },
          { label: 'Brutto',    value: fmt(grossTotal, currency),    color: 'var(--color-text-primary)' },
          { label: 'Rabatter',  value: `−${fmt(totalDiscount, currency)}`, color: 'var(--color-error)' },
          { label: 'MVA (inkl.)', value: fmt(vatAmount, currency),   color: 'var(--color-text-secondary)' },
          { label: 'Netto',     value: fmt(netTotal, currency),      color: 'var(--color-text-primary)', bold: true },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: row.bold ? 15 : 13,
            fontWeight: row.bold ? 700 : 400,
            padding: '3px 0', color: row.color,
          }}>
            <span>{row.label}</span><span>{row.value}</span>
          </div>
        ))}

        <div style={{ borderBottom: '1px dashed var(--color-border)', margin: '6px 0' }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 13, padding: '3px 0',
        }}>
          <span>Kasse</span>
          <span style={{ color: drawerBalance >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {fmt(drawerBalance, currency)}
          </span>
        </div>
      </div>

      <button onClick={onClose} style={{
        padding: '14px 16px', border: '1.5px solid var(--color-border)',
        background: 'var(--color-surface)', color: 'var(--color-text-primary)',
        borderRadius: 14, fontSize: 13, fontWeight: 700,
        width: '100%', marginTop: 10, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        Lukk
      </button>
    </Modal>
  )
}
