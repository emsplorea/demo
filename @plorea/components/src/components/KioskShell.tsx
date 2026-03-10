/**
 * KioskShell — Canonical Component 10
 * Plorea Design System v3.0
 *
 * Wraps a kiosk ordering surface with:
 *   1. Idle screen  — shown when no session is active
 *   2. Dine choice  — "Spis her" / "Ta med" selector (rendered inside idle)
 *   3. Active shell — renders children once dine type is chosen
 *
 * State machine:
 *
 *   idle=true  → shows IdleScreen (with dine choice buttons)
 *   idle=false → renders children (the menu surface)
 *
 * The component is uncontrolled by default: it owns idle state internally
 * and calls onDineChoice when the user picks. Pass `defaultIdle={false}`
 * to skip the idle screen (e.g. in Storybook stories or test builds).
 *
 * Rules:
 * - Touch targets: dine choice buttons min 120×120px
 * - Logo: top-left, always visible on idle screen
 * - Idle screen: full white, centred, no scrolling
 * - Watermark: absolute bottom-centre — "plorea." in muted colour
 * - Children render inside a full-height flex column container
 * - No idle timeout logic here — that belongs in the app layer
 */

import { useState, ReactNode } from 'react'

export type DineType = 'here' | 'takeaway'

export interface KioskShellProps {
  /** App/brand name shown in logo area on idle */
  brandName?: string
  /** Start in idle state. Default: true */
  defaultIdle?: boolean
  /** Called when user picks a dine type — shell switches to active */
  onDineChoice?: (type: DineType) => void
  /** The menu surface rendered when active */
  children: ReactNode
  style?: React.CSSProperties
}

// ── SVG icons — matching kiosk demo exactly
function DineHereIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="22" width="24" height="3" rx="1.5" fill="#fff" />
      <line x1="12" y1="25" x2="12" y2="34" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="25" x2="28" y2="34" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function TakeawayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <rect x="10" y="12" width="20" height="22" rx="3" fill="none" stroke="#fff" strokeWidth="2.5" />
      <path d="M16 12V8a4 4 0 018 0v4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function OrderIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
      <rect x="16" y="12" width="32" height="40" rx="4"
        stroke="var(--color-text-primary)" strokeWidth="2.5" fill="none" />
      <line x1="22" y1="24" x2="42" y2="24"
        stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="32" x2="42" y2="32"
        stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="40" x2="34" y2="40"
        stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
      <rect x="26" y="6" width="12" height="10" rx="2"
        stroke="var(--color-text-primary)" strokeWidth="2" fill="none" />
    </svg>
  )
}

// ── Idle screen with embedded dine choice
function IdleScreen({
  brandName = 'plorea',
  onChoose,
}: {
  brandName?: string
  onChoose: (type: DineType) => void
}) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-surface)',
      padding: 40,
      position: 'relative',
      userSelect: 'none',
    }}>
      {/* Brand */}
      <div style={{
        fontWeight: 700,
        fontSize: 22,
        color: 'var(--color-secondary)',
        letterSpacing: 0.5,
        marginBottom: 60,
        fontFamily: "'Sora', sans-serif",
      }}>
        {brandName}
      </div>

      {/* Order icon */}
      <div style={{ marginBottom: 20 }}>
        <OrderIcon />
      </div>

      {/* Headline */}
      <h2 style={{
        fontSize: 24,
        fontWeight: 800,
        color: 'var(--color-text-primary)',
        margin: '0 0 6px',
        textAlign: 'center',
      }}>
        Velkommen!
      </h2>
      <p style={{
        fontSize: 14,
        color: 'var(--color-text-secondary)',
        marginBottom: 32,
        textAlign: 'center',
      }}>
        Hvor ønsker du å spise?
      </p>

      {/* Dine choice buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        width: '100%',
        maxWidth: 300,
      }}>
        <DineButton
          icon={<DineHereIcon />}
          label="Spis her"
          onClick={() => onChoose('here')}
        />
        <DineButton
          icon={<TakeawayIcon />}
          label="Ta med"
          onClick={() => onChoose('takeaway')}
        />
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        color: 'var(--color-border)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 1,
      }}>
        plorea.
      </div>
    </div>
  )
}

function DineButton({
  icon, label, onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '28px 16px',
        borderRadius: 16,
        border: 'none',
        background: 'var(--color-primary)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'inherit',
        cursor: 'pointer',
        minHeight: 120,
        transition: 'background var(--dur-fast), transform var(--dur-fast)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-hover)'
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)'
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
      }}
        onMouseDown={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'
        }}
        onMouseUp={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
        }}
    >
      {icon}
      <span style={{ fontSize: 15, fontWeight: 700 }}>{label}</span>
    </button>
  )
}

// ── Main export
export function KioskShell({
  brandName,
  defaultIdle = true,
  onDineChoice,
  children,
  style,
}: KioskShellProps) {
  const [idle, setIdle] = useState(defaultIdle)

  function handleChoose(type: DineType) {
    setIdle(false)
    onDineChoice?.(type)
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}>
      {idle
        ? <IdleScreen brandName={brandName} onChoose={handleChoose} />
        : <>{children}</>
      }
    </div>
  )
}
