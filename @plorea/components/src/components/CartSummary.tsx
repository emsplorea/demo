/**
 * CartSummary — Canonical Component 04
 * Plorea Design System v2.8
 *
 * Connects product selection to payment.
 * Used in POS, QR ordering, and online checkout.
 *
 * Rules:
 * - Qty stepper: [-] n [+] — never a text input
 * - Removing last item of a line: confirm only if cart becomes empty
 * - Line total updates instantly — no loading state for calculation
 * - Discount row only renders if discount > 0
 * - Primary CTA: min 48px height, full width, btn-primary
 * - CTA label is outcome-led: "Send to kitchen" not "Submit"
 * - Empty cart shows product prompt — never a blank panel
 */

import { ReactNode } from 'react'
import type { OrderChannel } from './OrderTable'

export interface CartLine {
  id: string
  name: string
  unitPrice: number        // in minor units (øre) to avoid float arithmetic
  quantity: number
  modifiers?: string[]     // display-only modifier descriptions
}

export interface CartSummaryProps {
  /** Order channel context */
  channel?: OrderChannel
  channelLabel?: string
  /** Order reference, shown in header */
  orderRef?: string
  lines: CartLine[]
  /** Discount amount in minor units. Row hidden if 0. */
  discountAmount?: number
  /** Discount label, e.g. "Member discount (10%)" */
  discountLabel?: string
  /** VAT rate, e.g. 0.15 for 15%. Applied to subtotal after discount. */
  vatRate?: number
  /** Currency symbol, default "kr" */
  currency?: string
  /** Primary CTA label */
  primaryLabel?: string
  /** Secondary CTA label */
  secondaryLabel?: string
  /** Called when quantity changes. qty=0 removes the line. */
  onQuantityChange?: (lineId: string, qty: number) => void
  onPrimary?: () => void
  onSecondary?: () => void
  /** Disable primary CTA (e.g. while sending) */
  primaryLoading?: boolean
  /** Empty cart message */
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
  style?: React.CSSProperties
}

function formatMinor(minor: number, currency = 'kr'): string {
  return `${currency} ${(minor / 100).toFixed(0)}`
}

function QtyButton({ children, onClick, disabled }: {
  children: ReactNode; onClick: () => void; disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-surface-hover)',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        color: 'var(--color-text-primary)',
        fontSize: 14, fontWeight: 700,
        opacity: disabled ? 0.4 : 1,
        transition: 'background 80ms',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

const CHANNEL_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  table:    { bg: 'var(--channel-table-bg)',    border: 'var(--channel-table-border)',    color: 'var(--channel-table-text)'    },
  takeaway: { bg: 'var(--channel-takeaway-bg)', border: 'var(--channel-takeaway-border)', color: 'var(--channel-takeaway-text)' },
  eatin:    { bg: 'var(--channel-eatin-bg)',    border: 'var(--channel-eatin-border)',    color: 'var(--channel-eatin-text)'    },
  combo:    { bg: 'var(--channel-combo-bg)',    border: 'var(--channel-combo-border)',    color: 'var(--channel-combo-text)'    },
}

export function CartSummary({
  channel,
  channelLabel,
  orderRef,
  lines,
  discountAmount = 0,
  discountLabel = 'Discount',
  vatRate = 0,
  currency = 'kr',
  primaryLabel = 'Send to kitchen',
  secondaryLabel,
  onQuantityChange,
  onPrimary,
  onSecondary,
  primaryLoading = false,
  emptyMessage = 'Cart is empty',
  emptyAction,
  style,
}: CartSummaryProps) {
  const subtotal    = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
  const afterDisc   = subtotal - discountAmount
  const vatAmount   = Math.round(afterDisc * vatRate)
  const total       = afterDisc + vatAmount
  const itemCount   = lines.reduce((sum, l) => sum + l.quantity, 0)
  const channelStyle = channel ? CHANNEL_STYLES[channel] : undefined

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 14,
      overflow: 'hidden',
      maxWidth: 380,
      boxShadow: 'var(--elevation-1)',
      ...style,
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {channel && channelStyle && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 9999,
            background: channelStyle.bg,
            border: `1px solid ${channelStyle.border}`,
            color: channelStyle.color,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: channelStyle.color }} />
            {channelLabel ?? channel}
          </span>
        )}
        {orderRef && (
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-muted)' }}>
            #{orderRef}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)' }}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Lines */}
      {lines.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12 }}>
            {emptyMessage}
          </div>
          {emptyAction && (
            <button
              onClick={emptyAction.onClick}
              style={{
                padding: '8px 18px', fontSize: 13, fontWeight: 700,
                background: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
              }}
            >
              {emptyAction.label}
            </button>
          )}
        </div>
      ) : (
        <div style={{ padding: '0 20px' }}>
          {lines.map(line => (
            <div key={line.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {/* Stepper */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid var(--color-border-strong)',
                  borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                }}>
                  <QtyButton
                    onClick={() => onQuantityChange?.(line.id, line.quantity - 1)}
                    disabled={!onQuantityChange}
                  >
                    −
                  </QtyButton>
                  <span style={{
                    width: 32, textAlign: 'center',
                    fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    borderLeft: '1px solid var(--color-border)',
                    borderRight: '1px solid var(--color-border)',
                    padding: '0 4px',
                    lineHeight: '28px',
                  }}>
                    {line.quantity}
                  </span>
                  <QtyButton
                    onClick={() => onQuantityChange?.(line.id, line.quantity + 1)}
                    disabled={!onQuantityChange}
                  >
                    +
                  </QtyButton>
                </div>

                {/* Name */}
                <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text-primary)' }}>
                  {line.name}
                </span>

                {/* Line total */}
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                  {formatMinor(line.unitPrice * line.quantity, currency)}
                </span>
              </div>

              {/* Modifiers */}
              {line.modifiers?.map((mod, i) => (
                <div key={i} style={{
                  fontSize: 11, color: 'var(--color-text-muted)',
                  paddingLeft: 78, paddingBottom: 4,
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  + {mod}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      {lines.length > 0 && (
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <span>Subtotal</span>
            <span>{formatMinor(subtotal, currency)}</span>
          </div>

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-success)' }}>
              <span>{discountLabel}</span>
              <span>− {formatMinor(discountAmount, currency)}</span>
            </div>
          )}

          {vatRate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)' }}>
              <span>VAT ({Math.round(vatRate * 100)}%)</span>
              <span>{formatMinor(vatAmount, currency)}</span>
            </div>
          )}

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 8, marginTop: 4,
          }}>
            <span>Total</span>
            <span>{formatMinor(total, currency)}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      {lines.length > 0 && (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onPrimary}
            disabled={primaryLoading || lines.length === 0}
            style={{
              width: '100%', minHeight: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
              background: 'var(--color-primary)',
              color: 'var(--color-primary-text)',
              border: 'none', borderRadius: 10,
              cursor: primaryLoading ? 'not-allowed' : 'pointer',
              opacity: primaryLoading ? 0.7 : 1,
              transition: 'background 160ms',
            }}
          >
            {primaryLoading ? 'Sending…' : primaryLabel}
          </button>

          {secondaryLabel && onSecondary && (
            <button
              onClick={onSecondary}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600,
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1.5px solid var(--color-border-strong)',
                borderRadius: 8, padding: '8px 0',
                cursor: 'pointer',
                transition: 'border-color 100ms, color 100ms',
              }}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
