/**
 * ProductModal — Canonical Component 07
 * Plorea Design System v2.8
 *
 * Full-screen product detail + customisation sheet.
 * Used when a ProductCard is tapped in any ordering surface.
 *
 * Handles two modes:
 *   add   — fresh add to cart (default)
 *   edit  — update an existing cart line (pre-fills selections + qty)
 *
 * Rules:
 * - Required attribute groups (*) block "Add to cart" until satisfied
 * - Radio groups: selecting one auto-deselects previous
 * - Qty stepper: min 1, no upper limit enforced here (business logic in caller)
 * - Price updates live as selections change
 * - Wide layout (≥460px) used on kiosk/desktop, narrow on mobile/QR
 * - Backdrop click dismisses modal
 * - Allergen tags shown below description — icon + label
 */

import { useState, useEffect, useCallback } from 'react'

export interface ModifierOption {
  name: string
  /** Price delta in minor units (øre). 0 or undefined = no extra cost. */
  price?: number
}

export interface ModifierGroup {
  name: string
  type: 'radio' | 'checkbox'
  /** If true, an option must be selected before adding to cart */
  required?: boolean
  options: ModifierOption[]
}

export interface AllergenInfo {
  icon: string
  label: string
}

export interface ProductModalProduct {
  id: string | number
  name: string
  description?: string
  price: number          // base price in minor units
  image?: string
  modifiers?: ModifierGroup[]
  allergens?: AllergenInfo[]
}

export interface SelectedModifier {
  name: string
  price: number
}

export interface ProductModalProps {
  product: ProductModalProduct
  /** Pre-fill for edit mode */
  initialSelections?: Record<string, SelectedModifier[]>
  initialQty?: number
  currency?: string
  /** 'wide' for kiosk/desktop, 'narrow' for mobile/QR */
  layout?: 'wide' | 'narrow'
  /** CTA label override */
  ctaLabel?: string
  onConfirm?: (selections: Record<string, SelectedModifier[]>, qty: number) => void
  onClose?: () => void
}

function formatPrice(minor: number, currency = 'kr') {
  return `${(minor / 100).toFixed(0)} ${currency}`
}

function formatDelta(minor: number, currency = 'kr') {
  return `+${(minor / 100).toFixed(0)},00 ${currency}`
}

export function ProductModal({
  product,
  initialSelections,
  initialQty = 1,
  currency = 'kr',
  layout = 'narrow',
  ctaLabel,
  onConfirm,
  onClose,
}: ProductModalProps) {
  const isWide = layout === 'wide'
  const hasModifiers = (product.modifiers?.length ?? 0) > 0

  // ── State
  const [selections, setSelections] = useState<Record<string, SelectedModifier[]>>(
    initialSelections ?? {}
  )
  const [qty, setQty] = useState(initialQty)

  // Re-initialise when product or initial values change (edit mode)
  useEffect(() => {
    setSelections(initialSelections ?? {})
    setQty(initialQty)
  }, [product.id, initialSelections, initialQty])

  // ── Derived values
  const allSelected = Object.values(selections).flat()
  const extraCost   = allSelected.reduce((sum, o) => sum + o.price, 0)
  const lineTotal   = (product.price + extraCost) * qty

  const allRequiredMet = (product.modifiers ?? [])
    .filter(g => g.required)
    .every(g => (selections[g.name]?.length ?? 0) > 0)

  const canAdd = !hasModifiers || allRequiredMet

  // ── Modifier selection handler
  const handleSelect = useCallback((group: ModifierGroup, option: ModifierOption) => {
    setSelections(prev => {
      const current = prev[group.name] ?? []
      if (group.type === 'radio') {
        // Radio: replace selection
        return { ...prev, [group.name]: [{ name: option.name, price: option.price ?? 0 }] }
      } else {
        // Checkbox: toggle
        const exists = current.some(s => s.name === option.name)
        return {
          ...prev,
          [group.name]: exists
            ? current.filter(s => s.name !== option.name)
            : [...current, { name: option.name, price: option.price ?? 0 }],
        }
      }
    })
  }, [])

  // ── Keyboard trap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const imageHeight = isWide ? 200 : 170

  return (
    /* Backdrop */
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 1300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
    >
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        style={{
          width: isWide ? 460 : '90%',
          maxWidth: 480,
          background: 'var(--color-surface)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--elevation-4)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '85vh',
          animation: 'fade-in 120ms ease-out',
        }}
      >
        {/* Hero image */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: imageHeight, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: imageHeight,
              background: 'var(--color-surface-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 56,
            }}>
              🍽️
            </div>
          )}

          {/* Name overlay on image */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            padding: '20px 16px 10px',
          }}>
            <h2 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>
              {product.name}
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--color-error)', border: 'none',
              color: '#fff', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px' }}>
          {/* Description */}
          {product.description && (
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 12px' }}>
              {product.description}
            </p>
          )}

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap',
              marginBottom: 14,
            }}>
              {product.allergens.map(a => (
                <span
                  key={a.icon}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 11, color: 'var(--color-text-secondary)',
                    background: 'var(--color-surface-hover)',
                    padding: '2px 8px', borderRadius: 'var(--r-full)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {a.icon} {a.label}
                </span>
              ))}
            </div>
          )}

          {/* Modifier groups */}
          {product.modifiers?.map(group => (
            <div key={group.name} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: 'var(--color-text-primary)', marginBottom: 6,
              }}>
                {group.name}
                {group.required && (
                  <span style={{ color: 'var(--color-error)', marginLeft: 4 }}>*</span>
                )}
              </div>

              {group.options.map(option => {
                const isSelected = (selections[group.name] ?? [])
                  .some(s => s.name === option.name)

                return (
                  <div
                    key={option.name}
                    onClick={() => handleSelect(group, option)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 11px', marginBottom: 3,
                      borderRadius: 7,
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'rgba(107,184,218,0.04)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'border-color var(--dur-fast), background var(--dur-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Radio / checkbox indicator */}
                      <div style={{
                        width: 18, height: 18,
                        borderRadius: group.type === 'radio' ? '50%' : 3,
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
                        background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'background var(--dur-fast), border-color var(--dur-fast)',
                      }}>
                        {isSelected && (
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>
                        {option.name}
                      </span>
                    </div>

                    {(option.price ?? 0) > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {formatDelta(option.price!, currency)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Sticky footer */}
        <div style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid var(--color-border)',
          flexShrink: 0,
          background: 'var(--color-surface)',
        }}>
          {/* Qty + total row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 10,
          }}>
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginRight: 8 }}>
                Qty
              </span>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 32, height: 32, borderRadius: 7, border: 'none',
                  background: 'var(--color-surface-hover)',
                  fontSize: 15, fontWeight: 700,
                  color: 'var(--color-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: qty <= 1 ? 'not-allowed' : 'pointer',
                  opacity: qty <= 1 ? 0.4 : 1,
                }}
              >
                −
              </button>
              <span style={{
                minWidth: 32, textAlign: 'center',
                fontWeight: 700, fontSize: 15,
                color: 'var(--color-text-primary)',
              }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 32, height: 32, borderRadius: 7, border: 'none',
                  background: 'var(--color-primary)',
                  fontSize: 15, fontWeight: 700, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>

            {/* Live total */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 1 }}>
                Total
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {formatPrice(lineTotal, currency)}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => canAdd && onConfirm?.(selections, qty)}
            disabled={!canAdd}
            style={{
              width: '100%', padding: '13px',
              border: 'none', borderRadius: 'var(--r-lg)',
              fontSize: 14, fontWeight: 700,
              background: canAdd ? 'var(--color-primary)' : 'var(--color-border)',
              color: canAdd ? 'var(--color-primary-text)' : 'var(--color-text-muted)',
              cursor: canAdd ? 'pointer' : 'not-allowed',
              transition: 'background var(--dur), color var(--dur)',
            }}
          >
            {ctaLabel ?? (initialSelections ? 'Update' : 'Add to cart')}
            {canAdd && ` • ${formatPrice(lineTotal, currency)}`}
          </button>

          {/* Required hint */}
          {hasModifiers && !allRequiredMet && (
            <p style={{
              fontSize: 10, color: 'var(--color-text-muted)',
              textAlign: 'center', marginTop: 6,
            }}>
              Select required options (*) to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
