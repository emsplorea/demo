/**
 * CheckoutFlow — Canonical Component 11
 * Plorea Design System v3.0
 *
 * 5-step online checkout panel. Used in two display contexts:
 *
 *   panel  — fixed-width sidebar (330px), always visible alongside menu
 *            Used by: online landscape
 *
 *   sheet  — bottom sheet, slide-up overlay over menu
 *            Used by: online mobile, QR
 *
 * Steps:
 *   0  Handlekurv  — cart review, combo inline, subtotals
 *   1  Detaljer    — pickup vs delivery, timeslot or address
 *   2  Info        — name, phone, email (skipped if logged in)
 *   3  Oversikt    — full order summary, edit links, comment
 *   4  Betaling    — payment method selection
 *   ✓  Bekreftet   — order confirmed, receipt, confetti
 *
 * Rules:
 * - Header: dark (--color-text-primary bg, white text) — consistent across all steps
 * - Back button: step > 0 only, not shown on confirmation
 * - Close button: sheet mode step 0 only
 * - Required fields (name, phone): CTA disabled until both valid
 * - Phone valid = length ≥ 8
 * - Delivery fee and service fee are props — not hardcoded
 * - Payment methods are passed as props — caller controls available options
 * - Confirmation: animated checkmark SVG + confetti + order number
 * - All prices in minor units (øre)
 */

import { useState, useCallback, ReactNode } from 'react'

// ── Types

export interface CheckoutCartLine {
  id: string
  name: string
  qty: number
  /** Line total in minor units */
  total: number
  modifiers?: string[]
  image?: string
}

export interface CheckoutPaymentMethod {
  id: string
  label: string
  description?: string
  icon: ReactNode
}

export interface CheckoutContactInfo {
  name: string
  phone: string
  email?: string
}

export type CheckoutServiceType = 'pickup' | 'delivery'

export type CheckoutDisplayMode = 'panel' | 'sheet'

export interface CheckoutFlowProps {
  lines: CheckoutCartLine[]
  paymentMethods: CheckoutPaymentMethod[]
  currency?: string
  /** Minor units. 0 = free pickup. */
  deliveryFee?: number
  serviceFee?: number
  /** Available pickup times e.g. ['18:15','18:30'] */
  pickupTimes?: string[]
  /** Skip contact info step (user is logged in) */
  loggedIn?: boolean
  mode?: CheckoutDisplayMode
  /** Called when panel's × or backdrop is clicked */
  onClose?: () => void
  /** Called with final state when user confirms payment method */
  onConfirm?: (info: {
    lines: CheckoutCartLine[]
    service: CheckoutServiceType
    pickupTime: string
    contact: CheckoutContactInfo
    paymentMethodId: string
    grandTotal: number
  }) => void
  /** Called when user wants to continue shopping (step 0 "legg til mer") */
  onContinueShopping?: () => void
  /** Called when user cancels entire order */
  onCancel?: () => void
  style?: React.CSSProperties
}

// ── Helpers

function fmt(minor: number, currency = 'kr') {
  return `${(minor / 100).toLocaleString('nb-NO')} ${currency}`
}
function vat(total: number) {
  return Math.round(total * 0.25 / 1.25)
}

const STEPS = ['Handlekurv', 'Detaljer', 'Info', 'Oversikt', 'Betaling']

// ── Sub-components

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: 'var(--color-text-secondary)',
      marginBottom: 4,
    }}>
      {children}
    </div>
  )
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 14,
      border: '1px solid var(--color-border)',
      padding: 14,
      ...style,
    }}>
      {children}
    </div>
  )
}

function PrimaryBtn({
  children, onClick, disabled = false, small = false,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: small ? '10px 14px' : '13px 14px',
        border: 'none',
        borderRadius: 'var(--r-lg)',
        fontSize: small ? 13 : 14,
        fontWeight: 700,
        background: disabled ? 'var(--color-border)' : 'var(--color-accent)',
        color: disabled ? 'var(--color-text-muted)' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        transition: 'background var(--dur-fast)',
      }}
    >
      {children}
    </button>
  )
}

function GhostBtn({ children, onClick, danger = false }: {
  children: ReactNode; onClick?: () => void; danger?: boolean
}) {
  return (
    <button onClick={onClick} style={{
      border: 'none', background: 'transparent',
      color: danger ? 'var(--color-error)' : 'var(--color-text-link)',
      fontSize: 11, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0',
    }}>
      {children}
    </button>
  )
}

function SegmentedControl<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{
      display: 'flex', background: 'var(--color-border)',
      borderRadius: 'var(--r-lg)', padding: 3, gap: 3,
    }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            flex: 1, padding: '10px', border: 'none',
            borderRadius: 'var(--r-md)', fontSize: 12, fontWeight: 700,
            background: value === o.value ? 'var(--color-surface)' : 'transparent',
            color: value === o.value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            boxShadow: value === o.value ? 'var(--elevation-1)' : 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all var(--dur-fast)',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function TimeButton({ time, selected, onClick }: {
  time: string; selected: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      padding: '10px', border: `2px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
      borderRadius: 8,
      background: selected ? '#FFF8F0' : 'var(--color-surface)',
      fontWeight: 700, fontSize: 13, textAlign: 'center',
      fontFamily: 'inherit', cursor: 'pointer',
      transition: 'border-color var(--dur-fast), background var(--dur-fast)',
    }}>
      {time}
    </button>
  )
}

function InputField({ label, required, value, onChange, placeholder, type = 'text' }: {
  label: string; required?: boolean; value: string
  onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <SectionLabel>{label}{required && <span style={{ color: 'var(--color-error)' }}> *</span>}</SectionLabel>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px',
          border: '2px solid var(--color-border)',
          borderRadius: 8, fontSize: 13, outline: 'none',
          background: 'var(--color-bg-page)', fontFamily: 'inherit',
          transition: 'border-color var(--dur-fast)',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--color-border-focus)')}
        onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
      />
    </div>
  )
}

// ── Confetti
function Confetti() {
  const cols = ['#6BB8DA', '#6BDAB2', '#DA6B6B', '#DADA6B', '#FFB3BA']
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 200, overflow: 'hidden', pointerEvents: 'none', zIndex: 5,
    }}>
      {Array.from({ length: 24 }, (_, i) => {
        const col = cols[i % cols.length]
        const left = (Math.random() * 100).toFixed(1)
        const dur  = (1.2 + Math.random() * 1.5).toFixed(2)
        const del  = (Math.random() * 0.4).toFixed(2)
        const sz   = (5 + Math.random() * 5).toFixed(0)
        const round = Math.random() > 0.5
        return (
          <div key={i} style={{
            position: 'absolute', top: -10,
            left: `${left}%`,
            width: sz + 'px', height: round ? sz + 'px' : parseFloat(sz) * 1.5 + 'px',
            borderRadius: round ? '50%' : 2,
            background: col,
            animation: `confetti ${dur}s ease-in ${del}s forwards`,
            opacity: 0,
          }} />
        )
      })}
    </div>
  )
}

// ── Animated checkmark
function CheckMark() {
  return (
    <svg viewBox="0 0 80 80" width="64" height="64">
      <circle cx="40" cy="40" r="38"
        fill="rgba(107,218,178,0.15)"
        stroke="var(--color-success)" strokeWidth="2" />
      <path d="M24 42 L35 53 L56 28" fill="none"
        stroke="var(--color-success)" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: 50, strokeDashoffset: 50,
          animation: 'checkDraw 0.5s ease 0.3s forwards',
        }}
      />
    </svg>
  )
}

// ── Step renderers ────────────────────────────────────────────────

type StepProps = {
  lines: CheckoutCartLine[]
  service: CheckoutServiceType
  setService: (s: CheckoutServiceType) => void
  pickupTime: string
  setPickupTime: (t: string) => void
  pickupTimes: string[]
  contact: CheckoutContactInfo
  setContact: (c: CheckoutContactInfo) => void
  paymentMethods: CheckoutPaymentMethod[]
  selectedPayment: string
  setSelectedPayment: (id: string) => void
  comment: string
  setComment: (c: string) => void
  subtotal: number
  deliveryFee: number
  serviceFee: number
  grandTotal: number
  currency: string
  loggedIn: boolean
  isSheet: boolean
  advance: (step?: number) => void
  onCancel?: () => void
  onContinueShopping?: () => void
  onConfirm?: () => void
}

function StepCart(p: StepProps) {
  const { lines, subtotal, grandTotal, currency, isSheet, advance, onCancel, onContinueShopping } = p
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      {lines.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.5 }}>🛒</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Handlekurven er tom</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Legg til noe godt fra menyen 🍔</div>
        </div>
      ) : (
        <>
          <Card>
            {lines.map((l, i) => (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: i < lines.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                {l.image && (
                  <img src={l.image} alt="" style={{
                    width: 36, height: 36, borderRadius: 'var(--r)',
                    objectFit: 'cover', flexShrink: 0,
                  }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    {l.name}{l.qty > 1 ? ` ×${l.qty}` : ''}
                  </div>
                  {l.modifiers && l.modifiers.length > 0 && (
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                      {l.modifiers.join(', ')}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {fmt(l.total, currency)}
                </span>
              </div>
            ))}
          </Card>

          {isSheet && (
            <button
              onClick={onContinueShopping}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                border: '2px dashed var(--color-border-strong)', borderRadius: 'var(--r-lg)',
                padding: 12, width: '100%', background: 'none',
                fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)',
                marginTop: 10, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              + Legg til mer
            </button>
          )}

          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              <span>Subtotal</span><span>{fmt(subtotal, currency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)' }}>
              <span>Est. total</span>
              <span style={{ fontWeight: 700 }}>{fmt(grandTotal, currency)}</span>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <PrimaryBtn onClick={() => advance()}>
              Gå til utsjekk • {fmt(subtotal, currency)}
            </PrimaryBtn>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <GhostBtn onClick={onCancel} danger>Avbryt bestilling</GhostBtn>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StepDetails(p: StepProps) {
  const { service, setService, pickupTime, setPickupTime, pickupTimes, deliveryFee, currency, loggedIn, advance } = p
  const nextStep = loggedIn ? 3 : 2

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      <SegmentedControl
        options={[
          { value: 'pickup' as CheckoutServiceType, label: '🏪 Hent selv' },
          { value: 'delivery' as CheckoutServiceType, label: '🚗 Levering' },
        ]}
        value={service}
        onChange={setService}
      />

      <div style={{ marginTop: 14 }}>
        {service === 'pickup' ? (
          <>
            <SectionLabel>Hentetidspunkt</SectionLabel>
            <button
              onClick={() => { setPickupTime('asap'); advance(nextStep) }}
              style={{
                width: '100%', padding: '12px 14px',
                border: `2px solid ${pickupTime === 'asap' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 12,
                background: pickupTime === 'asap' ? '#FFF8F0' : 'var(--color-surface)',
                textAlign: 'left', marginBottom: 8, fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                Så snart som mulig{' '}
                <span style={{
                  background: 'var(--color-accent)', color: '#fff',
                  fontSize: 9, padding: '2px 5px', borderRadius: 4, marginLeft: 4,
                }}>
                  Anbefalt
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Klar ca. 15 min
              </div>
            </button>

            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1px', color: 'var(--color-text-secondary)',
              margin: '8px 0 6px',
            }}>
              Eller velg tidspunkt
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {pickupTimes.map(t => (
                <TimeButton
                  key={t} time={t}
                  selected={pickupTime === t}
                  onClick={() => { setPickupTime(t); advance(nextStep) }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionLabel>Leveringsadresse</SectionLabel>
            <input
              placeholder="Skriv adresse..."
              style={{
                width: '100%', padding: '11px 13px',
                border: '2px solid var(--color-border)',
                borderRadius: 10, fontSize: 13, outline: 'none',
                background: 'var(--color-bg-page)', fontFamily: 'inherit',
              }}
            />
            {deliveryFee > 0 && (
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 6 }}>
                Leveringsavgift: {fmt(deliveryFee, currency)}
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <PrimaryBtn onClick={() => advance(nextStep)}>Neste</PrimaryBtn>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StepInfo(p: StepProps) {
  const { contact, setContact, advance } = p
  const valid = contact.name.trim().length > 0 && contact.phone.length >= 8

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Kontaktinfo</div>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
        Så vi kan oppdatere deg
      </p>
      <Card>
        <InputField
          label="Navn" required value={contact.name} placeholder="Ditt navn"
          onChange={v => setContact({ ...contact, name: v })}
        />
        <InputField
          label="Telefon" required value={contact.phone} placeholder="900 00 000"
          type="tel"
          onChange={v => setContact({ ...contact, phone: v })}
        />
        <InputField
          label="E-post" value={contact.email ?? ''} placeholder="din@epost.no"
          type="email"
          onChange={v => setContact({ ...contact, email: v })}
        />
      </Card>
      <div style={{ marginTop: 12 }}>
        <PrimaryBtn onClick={() => advance()} disabled={!valid}>Neste</PrimaryBtn>
      </div>
    </div>
  )
}

function StepOverview(p: StepProps) {
  const {
    lines, service, pickupTime, contact, comment, setComment,
    subtotal, deliveryFee, serviceFee, grandTotal, currency, advance,
  } = p
  const vatAmount = vat(grandTotal)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Din bestilling</div>

      {/* Items */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <SectionLabel>Varer</SectionLabel>
          <GhostBtn onClick={() => advance(0)}>Endre</GhostBtn>
        </div>
        {lines.map((l, i) => (
          <div key={l.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
            borderBottom: i < lines.length - 1 ? '1px solid var(--color-bg-page)' : 'none',
          }}>
            {l.image && (
              <img src={l.image} alt="" style={{
                width: 36, height: 36, borderRadius: 'var(--r)',
                objectFit: 'cover', flexShrink: 0,
              }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {l.name}{l.qty > 1 ? ` ×${l.qty}` : ''}
              </div>
              {l.modifiers && l.modifiers.length > 0 && (
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>
                  {l.modifiers.join(', ')}
                </div>
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {fmt(l.total, currency)}
            </span>
          </div>
        ))}
        <div style={{ borderTop: '2px solid var(--color-border)', marginTop: 6, paddingTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            <span>Mat subtotal</span><span>{fmt(subtotal, currency)}</span>
          </div>
          {service === 'delivery' && deliveryFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              <span>Levering</span><span>{fmt(deliveryFee, currency)}</span>
            </div>
          )}
          {serviceFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              <span>Service fee</span><span>{fmt(serviceFee, currency)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
            <span>MVA (inkl.)</span><span>{fmt(vatAmount, currency)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, paddingTop: 6, borderTop: '2px solid var(--color-border)' }}>
            <span>Totalt</span><span>{fmt(grandTotal, currency)}</span>
          </div>
        </div>
      </Card>

      {/* Pickup/delivery */}
      <Card style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <SectionLabel>{service === 'delivery' ? 'Leveres til' : 'Hentes hos'}</SectionLabel>
          <GhostBtn onClick={() => advance(1)}>Endre</GhostBtn>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          {service === 'delivery' ? 'Din adresse' : 'Restauranten'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
          {service === 'delivery'
            ? 'Estimert 35–45 min'
            : `Klar ${pickupTime === 'asap' ? 'ca. 15 min' : pickupTime}`}
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 10, paddingTop: 8 }}>
          <SectionLabel>Kontakt</SectionLabel>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{contact.name}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {contact.phone}{contact.email ? ` · ${contact.email}` : ''}
          </div>
        </div>
      </Card>

      {/* Comment */}
      <Card style={{ marginTop: 10 }}>
        <SectionLabel>Kommentar til restauranten</SectionLabel>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="F.eks. ingen løk, ring på døra..."
          rows={2}
          style={{
            width: '100%', padding: '8px 10px',
            border: '1.5px solid var(--color-border-strong)',
            borderRadius: 'var(--r)', fontSize: 12, outline: 'none',
            resize: 'vertical', background: 'var(--color-bg-page)',
            fontFamily: 'inherit',
          }}
        />
      </Card>

      <div style={{ marginTop: 12 }}>
        <PrimaryBtn onClick={() => advance()}>
          Velg betaling • {fmt(grandTotal, currency)}
        </PrimaryBtn>
      </div>
    </div>
  )
}

function StepPayment(p: StepProps) {
  const { paymentMethods, selectedPayment, setSelectedPayment, grandTotal, currency, onConfirm } = p

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      <div style={{ textAlign: 'center', padding: '12px 0 16px', borderBottom: '1px solid var(--color-border)', marginBottom: 16 }}>
        <SectionLabel>Totalt å betale</SectionLabel>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 2 }}>{fmt(grandTotal, currency)}</div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Velg betalingsmåte</div>

      {paymentMethods.map(m => {
        const sel = selectedPayment === m.id
        return (
          <button
            key={m.id}
            onClick={() => { setSelectedPayment(m.id); onConfirm?.() }}
            style={{
              width: '100%', padding: '14px 16px',
              border: `2px solid ${sel ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--r-lg)', background: 'var(--color-surface)',
              textAlign: 'left', marginBottom: 8, fontFamily: 'inherit',
              cursor: 'pointer', transition: 'border-color var(--dur-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-surface-hover)', flexShrink: 0,
              }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</div>
                {m.description && (
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                    {m.description}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>›</span>
            </div>
          </button>
        )
      })}

      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 8 }}>
        🔒 Sikker betaling
      </div>
    </div>
  )
}

function StepConfirmed(p: StepProps & { orderNumber: string; onNewOrder: () => void }) {
  const { lines, service, pickupTime, contact, grandTotal, currency, orderNumber, onNewOrder } = p
  const vatAmount = vat(grandTotal)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <Confetti />
      <div style={{ marginBottom: 12 }}>
        <CheckMark />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800 }}>Takk for bestillingen!</h2>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
        Ordre #{orderNumber}
      </p>

      <Card style={{ marginTop: 16, textAlign: 'left' }}>
        {lines.map((l, i) => (
          <div key={l.id} style={{
            display: 'flex', justifyContent: 'space-between', padding: '6px 0',
            fontSize: 13,
            borderBottom: i < lines.length - 1 ? '1px solid var(--color-bg-page)' : 'none',
          }}>
            <span>{l.name}{l.qty > 1 ? ` ×${l.qty}` : ''}</span>
            <span style={{ fontWeight: 600 }}>{fmt(l.total, currency)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 6 }}>
          <span>MVA</span><span>{fmt(vatAmount, currency)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 15, paddingTop: 6, marginTop: 4, borderTop: '2px solid var(--color-border)' }}>
          <span>Total</span><span>{fmt(grandTotal, currency)}</span>
        </div>
      </Card>

      <Card style={{ marginTop: 10, textAlign: 'left', fontSize: 12, color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          💬 {service === 'delivery' ? 'Leveres til din adresse' : 'Hent maten i baren'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
          📱 SMS til {contact.phone || 'ditt nummer'}
        </div>
      </Card>

      <div style={{ marginTop: 14 }}>
        <PrimaryBtn onClick={onNewOrder}>Ny bestilling</PrimaryBtn>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export function CheckoutFlow({
  lines,
  paymentMethods,
  currency = 'kr',
  deliveryFee = 5900,
  serviceFee = 500,
  pickupTimes = ['18:15', '18:30', '18:45', '19:00', '19:15', '19:30'],
  loggedIn = false,
  mode = 'panel',
  onClose,
  onConfirm,
  onContinueShopping,
  onCancel,
  style,
}: CheckoutFlowProps) {
  const [step, setStep]               = useState(0)
  const [service, setService]         = useState<CheckoutServiceType>('pickup')
  const [pickupTime, setPickupTime]   = useState('asap')
  const [contact, setContact]         = useState<CheckoutContactInfo>({ name: '', phone: '', email: '' })
  const [selectedPayment, setPayment] = useState('')
  const [comment, setComment]         = useState('')
  const [confirmed, setConfirmed]     = useState(false)
  const [orderNumber]                 = useState(() => String(3000 + Math.floor(Math.random() * 1000)))

  const subtotal   = lines.reduce((s, l) => s + l.total, 0)
  const df         = service === 'delivery' ? deliveryFee : 0
  const grandTotal = subtotal + df + serviceFee

  const advance = useCallback((to?: number) => {
    setStep(prev => to !== undefined ? to : prev + 1)
  }, [])

  function handleConfirmPayment() {
    setConfirmed(true)
    onConfirm?.({
      lines, service, pickupTime, contact,
      paymentMethodId: selectedPayment,
      grandTotal,
    })
  }

  function handleNewOrder() {
    setStep(0); setConfirmed(false)
    setService('pickup'); setPickupTime('asap')
    setContact({ name: '', phone: '', email: '' })
    setPayment(''); setComment('')
  }

  const isSheet = mode === 'sheet'
  const stepLabel = confirmed ? 'Bestilt!' : STEPS[step]

  const stepProps: StepProps = {
    lines, service, setService, pickupTime, setPickupTime, pickupTimes,
    contact, setContact, paymentMethods,
    selectedPayment, setSelectedPayment: setPayment,
    comment, setComment,
    subtotal, deliveryFee, serviceFee, grandTotal,
    currency, loggedIn, isSheet,
    advance,
    onCancel,
    onContinueShopping,
    onConfirm: handleConfirmPayment,
  }

  const inner = (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
      background: 'var(--color-bg-page)',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0,
        background: 'var(--color-text-primary)',
        color: '#fff',
      }}>
        {step > 0 && !confirmed && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
              width: 28, height: 28, borderRadius: 8, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            ←
          </button>
        )}
        <span style={{
          flex: 1, fontWeight: 700, fontSize: 13,
          textAlign: step > 0 ? 'center' : 'left',
        }}>
          {stepLabel}
        </span>
        {step === 0 && !confirmed && isSheet && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
              width: 28, height: 28, borderRadius: 8, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Step content */}
      {confirmed
        ? <StepConfirmed {...stepProps} orderNumber={orderNumber} onNewOrder={handleNewOrder} />
        : step === 0 ? <StepCart {...stepProps} />
        : step === 1 ? <StepDetails {...stepProps} />
        : step === 2 ? <StepInfo {...stepProps} />
        : step === 3 ? <StepOverview {...stepProps} />
        : <StepPayment {...stepProps} />
      }
    </div>
  )

  if (isSheet) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1200,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}
          onClick={onClose}
        />
        <div style={{
          position: 'relative',
          background: 'var(--color-bg-page)',
          borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
          maxHeight: '90%', height: '90%',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--elevation-4)',
          animation: 'slideUp var(--dur-slow) var(--ease-out)',
          ...style,
        }}>
          {inner}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: 330, flexShrink: 0,
      borderLeft: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}>
      {inner}
    </div>
  )
}
