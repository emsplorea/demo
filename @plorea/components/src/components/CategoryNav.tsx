/**
 * CategoryNav — Canonical Component 08
 * Plorea Design System v2.9
 *
 * Category navigation used across all ordering surfaces.
 *
 * Two layout variants:
 *
 *   pills    — horizontal scrolling pill row, sticky top
 *              Used by: QR, kiosk portrait, online mobile/landscape
 *
 *   sidebar  — vertical icon + label column, fixed width 76px
 *              Used by: kiosk portrait (left edge)
 *
 * Active state:
 *   pills   → filled primary background, white text
 *   sidebar → blue-50 background + 3px left accent bar
 *
 * Rules:
 * - Touch target: min 44px height (pills), 52px height (sidebar buttons)
 * - Sticky: pills use `position: sticky; top: 0; z-index: 10`
 * - Sidebar never scrolls horizontally — always full label visible
 * - `onSelect` called with category id — scroll-to-section is caller's responsibility
 * - Icon is optional; falls back to first letter of label
 */

export interface Category {
  id: string | number
  label: string
  /** Emoji or any short string — shown large in sidebar, small in pills */
  icon?: string
}

export type CategoryNavVariant = 'pills' | 'sidebar'

export interface CategoryNavProps {
  categories: Category[]
  activeId?: string | number
  variant?: CategoryNavVariant
  onSelect?: (id: string | number) => void
  style?: React.CSSProperties
}

// ── Shared active/inactive token values
const ACTIVE_BG    = 'var(--color-primary)'
const ACTIVE_TEXT  = 'var(--color-primary-text, #fff)'
const INACTIVE_BG  = 'var(--color-surface)'
const INACTIVE_TEXT = 'var(--color-text-secondary)'
const ACTIVE_INDICATOR_COLOR = 'var(--color-primary)'

// ─────────────────────────────────────────────────────────────────
// Pills variant
// ─────────────────────────────────────────────────────────────────
function PillsNav({ categories, activeId, onSelect, style }: CategoryNavProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        padding: '8px 14px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        // Hide scrollbar
        scrollbarWidth: 'none' as any,
        msOverflowStyle: 'none' as any,
        ...style,
      }}
    >
      {categories.map(cat => {
        const isActive = cat.id === activeId
        return (
          <button
            key={cat.id}
            onClick={() => onSelect?.(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '8px 14px',
              borderRadius: 'var(--r-full)',
              border: `1.5px solid ${isActive ? ACTIVE_BG : 'var(--color-border-strong)'}`,
              background: isActive ? ACTIVE_BG : INACTIVE_BG,
              color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'background var(--dur), color var(--dur), border-color var(--dur)',
              minHeight: 36,
            }}
            aria-pressed={isActive}
          >
            {cat.icon && (
              <span style={{ fontSize: 15, lineHeight: 1 }}>{cat.icon}</span>
            )}
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Sidebar variant
// ─────────────────────────────────────────────────────────────────
function SidebarNav({ categories, activeId, onSelect, style }: CategoryNavProps) {
  return (
    <div
      role="navigation"
      aria-label="Categories"
      style={{
        width: 76,
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0',
        gap: 2,
        overflowY: 'auto',
        flexShrink: 0,
        scrollbarWidth: 'none' as any,
        ...style,
      }}
    >
      {categories.map(cat => {
        const isActive = cat.id === activeId
        return (
          <button
            key={cat.id}
            onClick={() => onSelect?.(cat.id)}
            aria-pressed={isActive}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '9px 4px',
              margin: '0 5px',
              border: 'none',
              borderRadius: 'var(--r)',
              background: isActive ? 'var(--color-selection)' : 'transparent',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background var(--dur)',
              minHeight: 52,
              // Accent bar
            }}
            onMouseEnter={e => {
              if (!isActive)
                (e.currentTarget as HTMLButtonElement).style.background =
                  'var(--color-surface-hover)'
            }}
            onMouseLeave={e => {
              if (!isActive)
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            {/* Left accent bar */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  left: -5,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 22,
                  borderRadius: '0 3px 3px 0',
                  background: ACTIVE_INDICATOR_COLOR,
                }}
              />
            )}

            {/* Icon */}
            <span style={{ fontSize: 22, lineHeight: 1 }}>
              {cat.icon ?? cat.label.charAt(0)}
            </span>

            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                textAlign: 'center',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                maxWidth: 60,
              }}
            >
              {cat.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Main export
export function CategoryNav(props: CategoryNavProps) {
  const { variant = 'pills' } = props
  if (variant === 'sidebar') return <SidebarNav {...props} />
  return <PillsNav {...props} />
}
