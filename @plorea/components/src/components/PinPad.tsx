/**
 * PinPad — POS Component 01
 * Plorea Design System v3.2
 *
 * Staff PIN authentication screen for POS terminals.
 * Full-screen overlay, 4-digit PIN, shake-animation on error.
 *
 * Used exclusively on physical POS terminals — NOT on virtual
 * ordering devices (QR, kiosk, online).
 *
 * Behaviour:
 * - 4 dots animate fill as digits are entered
 * - On 4th digit: validates immediately — no confirm button
 * - Wrong PIN: red dots + shake animation + auto-clears after 800ms
 * - "Slett" clears all, ⌫ deletes last digit
 * - Correct PIN fires onSuccess(staff)
 *
 * Rules:
 * - Digit buttons: Sora font, large (56px tall) — optimised for fat fingers
 * - Error state: --color-error red, never primary blue
 * - Demo hint: shown below numpad, subdued opacity
 * - Layout: always centred, full-bleed white, z-index 300
 */

export interface PosStaffMember {
  id: string
  name: string
  pin: string
  role?: string
}

export interface PinPadProps {
  staff: PosStaffMember[]
  hint?: string
  onSuccess: (member: PosStaffMember) => void
  style?: React.CSSProperties
}

import { useState, useEffect, useCallback } from 'react'

// ── PIN dot indicator
function PinDots({ length, error }: { length: number; error: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 10,
    }}>
      {Array.from({ length: 4 }, (_, i) => {
        const filled = i < length
        return (
          <div key={i} style={{
            width: 20, height: 20,
            borderRadius: '50%',
            border: `2.5px solid ${error ? 'var(--color-error)' : filled ? 'var(--color-secondary)' : 'var(--color-border-strong)'}`,
            background: filled
              ? error ? 'var(--color-error)' : 'var(--color-secondary)'
              : 'transparent',
            transition: 'all 0.12s',
            animation: error ? 'shake 0.4s' : 'none',
          }} />
        )
      })}
    </div>
  )
}

// ── Numpad button
function NumKey({
  label, sub, onClick, variant = 'digit',
}: {
  label: string
  sub?: string
  onClick: () => void
  variant?: 'digit' | 'action'
}) {
  const isAction = variant === 'action'
  return (
    <button
      onClick={onClick}
      style={{
        height: 56,
        borderRadius: 14,
        border: '1px solid var(--color-border)',
        background: isAction ? 'var(--color-bg-page)' : 'var(--color-surface)',
        color: isAction ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
        fontSize: isAction ? 13 : 22,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: isAction ? 'inherit' : "'Sora', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 1,
        transition: 'background var(--dur-fast)',
        userSelect: 'none',
      }}
      onMouseDown={e =>
        (e.currentTarget.style.background = isAction
          ? 'var(--color-border)'
          : 'var(--color-surface-hover)')
      }
      onMouseUp={e =>
        (e.currentTarget.style.background = isAction
          ? 'var(--color-bg-page)'
          : 'var(--color-surface)')
      }
      onMouseLeave={e =>
        (e.currentTarget.style.background = isAction
          ? 'var(--color-bg-page)'
          : 'var(--color-surface)')
      }
    >
      <span>{label}</span>
      {sub && <span style={{ fontSize: 8, opacity: 0.5, letterSpacing: '0.08em' }}>{sub}</span>}
    </button>
  )
}

// ── Main
export function PinPad({ staff, hint, onSuccess, style }: PinPadProps) {
  const [pin, setPin]     = useState('')
  const [error, setError] = useState(false)

  const handleDigit = useCallback((digit: string) => {
    if (error) return
    const next = pin + digit
    if (next.length > 4) return
    setPin(next)
    if (next.length === 4) {
      const match = staff.find(s => s.pin === next)
      if (match) {
        setPin('')
        onSuccess(match)
      } else {
        setError(true)
        setTimeout(() => { setPin(''); setError(false) }, 800)
      }
    }
  }, [pin, error, staff, onSuccess])

  const handleBackspace = useCallback(() => {
    if (!error) setPin(p => p.slice(0, -1))
  }, [error])

  const handleClear = useCallback(() => {
    setPin(''); setError(false)
  }, [])

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (/^[0-9]$/.test(e.key)) handleDigit(e.key)
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === 'Escape') handleClear()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleDigit, handleBackspace, handleClear])

  const KEYS: { label: string; sub?: string; action?: 'clear' | 'back' }[] = [
    { label: '1' }, { label: '2', sub: 'ABC' }, { label: '3', sub: 'DEF' },
    { label: '4', sub: 'GHI' }, { label: '5', sub: 'JKL' }, { label: '6', sub: 'MNO' },
    { label: '7', sub: 'PQRS' }, { label: '8', sub: 'TUV' }, { label: '9', sub: 'WXYZ' },
    { label: 'Slett', action: 'clear' }, { label: '0' }, { label: '⌫', action: 'back' },
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--color-surface)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: 20,
      ...style,
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 28, fontWeight: 700,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.01em',
        marginBottom: 8,
      }}>
        Pl<span style={{ color: 'var(--color-primary)' }}>or</span>ea
      </div>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 12, fontWeight: 700,
        color: 'var(--color-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 32,
      }}>
        POS Terminal
      </div>

      {/* PIN dots */}
      <PinDots length={pin.length} error={error} />

      {/* Status message */}
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: error ? 'var(--color-error)' : 'var(--color-text-secondary)',
        height: 22, marginBottom: 16,
        transition: 'color 0.16s',
      }}>
        {error ? 'Feil PIN-kode' : 'Tast inn 4-sifret PIN'}
      </div>

      {/* Numpad */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10, width: 250,
      }}>
        {KEYS.map((k, i) => (
          <NumKey
            key={i}
            label={k.label}
            sub={k.sub}
            variant={k.action ? 'action' : 'digit'}
            onClick={() => {
              if (k.action === 'clear') handleClear()
              else if (k.action === 'back') handleBackspace()
              else handleDigit(k.label)
            }}
          />
        ))}
      </div>

      {/* Demo hint */}
      {hint && (
        <div style={{
          fontSize: 11, color: 'var(--color-text-muted)',
          marginTop: 20, opacity: 0.6,
        }}>
          {hint}
        </div>
      )}
    </div>
  )
}
