/**
 * PaymentSelector — Canonical Component 05
 * Plorea Design System v2.8
 *
 * Critical final step before order completion.
 * Large touch targets, explicit selection state, zero ambiguity on confirm.
 *
 * Rules:
 * - No method selected on mount — always requires explicit user choice
 * - Confirm CTA disabled until method is selected — never enabled speculatively
 * - Method card min height: 64px. Touch target min: 48px
 * - Selected: --color-accent border + --elevation-focus ring
 * - Processing: spinner in CTA, method cards non-interactive
 * - Error: red border + inline message — no modal
 * - CTA label always shows amount: "Charge kr 378"
 */

import { useState, ReactNode } from 'react'

export interface PaymentMethod {
  id: string
  label: string
  description?: string
  icon: ReactNode
  /** Method unavailable (shown greyed, not selectable) */
  disabled?: boolean
}

export interface PaymentSelectorProps {
  methods: PaymentMethod[]
  /** Order amount in minor units */
  amount: number
  currency?: string
  /** Pre-formatted order recap line, e.g. "Table 4 · #2041 · 3 items" */
  orderSummary?: string
  /** Show split payment option */
  showSplit?: boolean
  onSplitPayment?: () => void
  /** Called with selected method id when confirmed */
  onConfirm?: (methodId: string) => void
  /** Processing: disables all interaction, shows spinner in CTA */
  processing?: boolean
  /** Per-method error messages */
  methodErrors?: Record<string, string>
  /** Global error (e.g. terminal offline) */
  error?: string
}

function formatAmount(minor: number, currency = 'kr'): string {
  return `${currency} ${(minor / 100).toFixed(0)}`
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 16, height: 16,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin-slow 0.8s linear infinite',
      marginRight: 8,
    }} />
  )
}

export function PaymentSelector({
  methods,
  amount,
  currency = 'kr',
  orderSummary,
  showSplit = false,
  onSplitPayment,
  onConfirm,
  processing = false,
  methodErrors = {},
  error,
}: PaymentSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const canConfirm = !!selectedId && !processing

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 14,
      overflow: 'hidden',
      maxWidth: 380,
      boxShadow: 'var(--elevation-1)',
    }}>

      {/* Order recap */}
      <div style={{
        padding: '14px 20px',
        background: 'var(--color-surface-hover)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          {orderSummary && (
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
              {orderSummary}
            </div>
          )}
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 26, fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {formatAmount(amount, currency)}
          </div>
        </div>

        {/* Ready badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999,
          background: 'rgba(107,218,178,0.15)', color: '#1A6B4A',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-success)' }} />
          Ready
        </span>
      </div>

      {/* Global error */}
      {error && (
        <div style={{
          margin: '12px 20px 0',
          padding: '10px 14px',
          background: 'var(--color-error-bg)',
          border: '1px solid var(--color-error)',
          borderRadius: 8,
          fontSize: 12, color: '#8B2020',
        }}>
          {error}
        </div>
      )}

      {/* Method cards */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontSize: 9, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)', marginBottom: 4,
        }}>
          Payment method
        </div>

        {methods.map(method => {
          const isSelected  = method.id === selectedId
          const methodError = methodErrors[method.id]
          const isDisabled  = method.disabled || processing

          return (
            <div key={method.id}>
              <button
                onClick={() => !isDisabled && setSelectedId(method.id)}
                disabled={isDisabled}
                style={{
                  width: '100%', minHeight: 64,
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: isSelected ? 'var(--color-selection)' : 'var(--color-surface)',
                  border: `2px solid ${
                    methodError
                      ? 'var(--color-error)'
                      : isSelected
                        ? 'var(--color-accent)'
                        : 'var(--color-border)'
                  }`,
                  borderRadius: 12,
                  boxShadow: isSelected ? 'var(--elevation-focus)' : 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled && !isSelected ? 0.5 : 1,
                  transition: 'border-color 160ms, box-shadow 160ms, background 160ms',
                  textAlign: 'left',
                }}
                aria-pressed={isSelected}
              >
                {/* Icon */}
                <span style={{ fontSize: 24, flexShrink: 0 }}>{method.icon}</span>

                {/* Labels */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}>
                    {method.label}
                  </div>
                  {method.description && (
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {method.description}
                    </div>
                  )}
                </div>

                {/* Selected check */}
                <span style={{
                  fontSize: 14, fontWeight: 700,
                  color: 'var(--color-accent)',
                  opacity: isSelected ? 1 : 0,
                  transition: 'opacity 160ms',
                  flexShrink: 0,
                }}>
                  ✓
                </span>
              </button>

              {/* Per-method error */}
              {methodError && (
                <div style={{
                  fontSize: 11, color: 'var(--color-error)',
                  marginTop: 4, paddingLeft: 4,
                }}>
                  {methodError}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={() => canConfirm && selectedId && onConfirm?.(selectedId)}
          disabled={!canConfirm}
          style={{
            width: '100%', minHeight: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700,
            background: canConfirm ? 'var(--color-primary)' : 'var(--color-border)',
            color: canConfirm ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
            border: 'none', borderRadius: 10,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            transition: 'background 200ms, color 200ms',
          }}
        >
          {processing && <Spinner />}
          {processing
            ? 'Processing…'
            : canConfirm
              ? `Charge ${formatAmount(amount, currency)}`
              : 'Select a payment method'
          }
        </button>

        {showSplit && onSplitPayment && (
          <button
            onClick={onSplitPayment}
            disabled={processing}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: 'none', padding: '8px 0',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.5 : 1,
            }}
          >
            Split payment
          </button>
        )}
      </div>
    </div>
  )
}
