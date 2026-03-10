/**
 * AppShell — Canonical Component 01
 * Plorea Design System v2.8
 *
 * The fixed frame around every Plorea view.
 * Sidebar, topbar, and content area are defined here — not per-page.
 *
 * Rules:
 * - Sidebar is always dark regardless of page theme mode
 * - Active nav item: --color-primary left border + tinted bg
 * - Topbar primary action: right-aligned, btn-primary
 * - Content area background: --color-bg-page — never hardcoded
 * - Mobile: sidebar collapses to overlay at <768px
 */

import { useState, ReactNode } from 'react'

export interface NavLink {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
}

export interface NavGroup {
  label: string
  links: NavLink[]
}

export interface AppShellProps {
  /** Navigation groups shown in the sidebar */
  navGroups: NavGroup[]
  /** Currently active nav link id */
  activeId?: string
  /** Topbar: page title or breadcrumb */
  title: string
  /** Topbar: primary action button label */
  primaryAction?: string
  /** Topbar: primary action click handler */
  onPrimaryAction?: () => void
  /** Topbar: right-side slot (user avatar, etc.) */
  topbarRight?: ReactNode
  /** Page content */
  children: ReactNode
  /** Callback when a nav link is clicked */
  onNavChange?: (id: string) => void
}

export function AppShell({
  navGroups,
  activeId,
  title,
  primaryAction,
  onPrimaryAction,
  topbarRight,
  children,
  onNavChange,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-page)' }}>

      {/* ── Sidebar overlay (mobile) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'var(--color-surface-overlay)',
            zIndex: 1199,
          }}
        />
      )}

      {/* ── Sidebar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 240,
        background: '#1A1825',
        borderRight: '1px solid #2E2C38',
        display: 'flex', flexDirection: 'column',
        zIndex: 1200,
        transform: mobileOpen ? 'translateX(0)' : undefined,
        transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 15, fontWeight: 700,
            color: '#FFFFFF', letterSpacing: '-0.01em',
          }}>
            Pl<span style={{ color: 'var(--color-primary)' }}>or</span>ea
          </div>
          <div style={{
            fontSize: 10, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)', marginTop: 4,
          }}>
            Design System
          </div>
        </div>

        {/* Nav groups */}
        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: 24 }}>
          {navGroups.map(group => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div style={{
                fontSize: 9, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
                padding: '16px 24px 5px',
              }}>
                {group.label}
              </div>
              {group.links.map(link => {
                const isActive = link.id === activeId
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      link.onClick?.()
                      onNavChange?.(link.id)
                      setMobileOpen(false)
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', padding: '7px 24px',
                      fontSize: 12.5, fontWeight: isActive ? 500 : 400,
                      color: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.48)',
                      background: isActive ? 'rgba(107,184,218,0.06)' : 'transparent',
                      borderLeft: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
                      border: 'none', borderLeftStyle: 'solid',
                      borderLeftWidth: 2,
                      borderLeftColor: isActive ? 'var(--color-primary)' : 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'color 100ms, background 100ms',
                    }}
                  >
                    {link.icon && <span style={{ opacity: 0.7, flexShrink: 0 }}>{link.icon}</span>}
                    <span
                      style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: 'currentColor', opacity: 0.5, flexShrink: 0,
                        display: link.icon ? 'none' : 'block',
                      }}
                    />
                    {link.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Main */}
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0,
          height: 48,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 12,
          zIndex: 1100,
          boxShadow: 'var(--elevation-1)',
        }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{
              display: 'none', // shown via CSS @media
              background: 'none', border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer', fontSize: 18, padding: '4px 8px',
            }}
            aria-label="Open menu"
          >
            ☰
          </button>

          <span style={{
            fontSize: 14, fontWeight: 600,
            color: 'var(--color-text-primary)', flex: 1,
          }}>
            {title}
          </span>

          {topbarRight}

          {primaryAction && (
            <button
              onClick={onPrimaryAction}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '7px 16px',
                fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                background: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
                border: 'none', borderRadius: 8,
                cursor: 'pointer',
                transition: 'background 160ms',
              }}
            >
              {primaryAction}
            </button>
          )}
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          padding: '32px 40px',
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
