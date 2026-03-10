/**
 * ComboSuggestion — Canonical Component 09
 * Plorea Design System v2.9
 *
 * Contextual upsell banner shown after a qualifying product is added to cart.
 * Surfaces a pre-configured combo deal (e.g. "Burgermeny" = burger + fries + drink).
 *
 * Two display modes:
 *
 *   float    — absolute-positioned overlay above the cart bar, full width
 *              Used by: QR, kiosk portrait  (appears over product list)
 *
 *   inline   — compact card embedded inside the cart sidebar/sheet
 *              Used by: kiosk landscape cart panel, online cart sidebar
 *
 * Behaviour:
 * - Enters with fadeUp animation
 * - "Add combo" fires onAccept — caller adds items and dismisses
 * - "No thanks" fires onDismiss
 * - Savings badge hidden when savingsAmount ≤ 0
 * - Component is always uncontrolled re: visibility — parent mounts/unmounts it
 *
 * Rules:
 * - Background: warm off-white #FFF8F0, border #FFE0B2 — never use primary blue here
 * - "Add combo" CTA: --color-accent (dark blue) — high intent, not primary blue
 * - Savings badge: success green — positive reinforcement
 * - Dismiss link: muted, never red — low friction, not destructive
 */

export interface ComboItem {
  name: string
  icon?: string
  /** Original full price in minor units (øre) */
  originalPrice: number
}

export type ComboSuggestionMode = 'float' | 'inline'

export interface ComboSuggestionProps {
  /** e.g. "Burgermeny" */
  label: string
  /** e.g. "Gjør dette til en Burgermeny?" */
  headline?: string
  triggerName?: string   // e.g. "HOT BURGER" — used in default headline
  items: ComboItem[]
  /** Deal price delta in minor units (øre) — shown as "+X kr" */
  dealPrice: number
  /** Original sum of items minus dealPrice — shown as "Spar X kr" badge */
  savingsAmount?: number
  currency?: string
  mode?: ComboSuggestionMode
  /** px from bottom — used in float mode to clear cart bar */
  bottomOffset?: number
  onAccept?: () => void
  onDismiss?: () => void
  style?: React.CSSProperties
}

function formatPrice(minor: number, currency = 'kr') {
  return `${(minor / 100).toFixed(0)} ${currency}`
}

// ── Combo background / border — warm amber, not primary blue
const COMBO_BG     = '#FFF8F0'
const COMBO_BORDER = '#FFE0B2'

// ─────────────────────────────────────────────────────────────────
// Shared inner content (used by both modes)
// ─────────────────────────────────────────────────────────────────
function ComboContent({
  label, headline, triggerName, items, dealPrice, savingsAmount = 0,
  currency = 'kr', mode, onAccept, onDismiss,
}: ComboSuggestionProps) {
  const isInline = mode === 'inline'

  const defaultHeadline = triggerName
    ? `Gjør dette til en ${label}?`
    : `${label}tilbud`

  return (
    <div
      style={{
        background: COMBO_BG,
        border: `1.5px solid ${COMBO_BORDER}`,
        borderRadius: isInline ? 10 : 14,
        padding: isInline ? 10 : 14,
        animation: 'fadeUp 0.35s ease both',
        boxShadow: isInline ? 'none' : 'var(--elevation-2)',
      }}
    >
      {/* Headline */}
      <div style={{
        fontSize: isInline ? 11 : 13,
        fontWeight: 800,
        color: 'var(--color-accent)',
        marginBottom: isInline ? 6 : 10,
      }}>
        {headline ?? defaultHeadline} 🍔
      </div>

      {/* Item list */}
      <div style={{
        background: isInline ? 'transparent' : 'var(--color-surface)',
        borderRadius: isInline ? 0 : 10,
        padding: isInline ? 0 : '10px',
        marginBottom: isInline ? 0 : 10,
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isInline ? 6 : 8,
              padding: isInline ? '2px 0' : '4px 0',
            }}
          >
            {item.icon && (
              <span style={{ fontSize: isInline ? 14 : 16 }}>{item.icon}</span>
            )}
            <span style={{
              fontSize: isInline ? 11 : 13,
              fontWeight: 600,
              flex: 1,
              color: 'var(--color-text-primary)',
            }}>
              {item.name}
            </span>
            <span style={{
              fontSize: isInline ? 10 : 12,
              color: 'var(--color-text-secondary)',
              textDecoration: 'line-through',
            }}>
              {formatPrice(item.originalPrice, currency)}
            </span>
          </div>
        ))}
      </div>

      {/* Price + savings row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: isInline ? '6px 0 4px' : '0 0 8px',
      }}>
        <span style={{
          fontSize: isInline ? 12 : 15,
          fontWeight: 800,
          color: 'var(--color-accent)',
        }}>
          +{formatPrice(dealPrice, currency)}
        </span>

        {savingsAmount > 0 && (
          <span style={{
            fontSize: isInline ? 9 : 11,
            fontWeight: 700,
            color: 'var(--color-success)',
            background: 'rgba(107,218,178,0.15)',
            padding: isInline ? '1px 6px' : '2px 8px',
            borderRadius: 6,
          }}>
            Spar {formatPrice(savingsAmount, currency)}
          </span>
        )}
      </div>

      {/* Accept CTA */}
      <button
        onClick={onAccept}
        style={{
          width: '100%',
          padding: isInline ? '8px' : '11px',
          border: 'none',
          borderRadius: isInline ? 8 : 10,
          background: 'var(--color-accent)',
          color: '#fff',
          fontWeight: 700,
          fontSize: isInline ? 12 : 14,
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'background var(--dur-fast)',
        }}
        onMouseEnter={e =>
          (e.currentTarget.style.background = 'var(--color-secondary)')
        }
        onMouseLeave={e =>
          (e.currentTarget.style.background = 'var(--color-accent)')
        }
      >
        Legg til {label}
      </button>

      {/* Dismiss link */}
      <button
        onClick={onDismiss}
        style={{
          display: 'block',
          marginTop: isInline ? 4 : 6,
          border: 'none',
          background: 'transparent',
          color: 'var(--color-text-muted)',
          fontSize: isInline ? 10 : 11,
          width: '100%',
          textAlign: 'center',
          cursor: 'pointer',
          fontFamily: 'inherit',
          padding: '4px 0',
        }}
      >
        Nei takk
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Float mode — absolute overlay above cart bar
// ─────────────────────────────────────────────────────────────────
function FloatCombo(props: ComboSuggestionProps) {
  const { bottomOffset = 56, style } = props
  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset + 6,
        left: 10,
        right: 10,
        zIndex: 9,
        ...style,
      }}
    >
      <ComboContent {...props} mode="float" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Inline mode — embedded in cart panel
// ─────────────────────────────────────────────────────────────────
function InlineCombo(props: ComboSuggestionProps) {
  return (
    <div style={{ margin: '8px 0', ...props.style }}>
      <ComboContent {...props} mode="inline" />
    </div>
  )
}

// ── Main export
export function ComboSuggestion(props: ComboSuggestionProps) {
  const { mode = 'float' } = props
  if (mode === 'inline') return <InlineCombo {...props} />
  return <FloatCombo {...props} />
}
