/**
 * OrderCard — Canonical Component 03
 * Plorea Design System v2.8
 *
 * Compact single-order representation for POS, KDS, and mobile views.
 * State drives visual treatment — not ad-hoc styles.
 *
 * Rules:
 * - Card width: 240–320px, never full-width except on mobile
 * - State border: new=primary, in-progress=warning, ready=success, error=error
 * - Header is always one line — never wraps
 * - Max 6 item rows before collapse with "+N more"
 * - Processing state uses pulse-subtle animation — no spinner
 * - Primary action touch target: min 44×44px
 */

import { useState } from 'react'
import type { OrderChannel, OrderStatus } from './OrderTable'

export interface OrderCardItem {
  name: string
  quantity: number
  modifiers?: string[]
}

export interface OrderCardProps {
  id: string
  channel: OrderChannel
  channelLabel?: string
  time: string
  items: OrderCardItem[]
  total: string
  status: OrderStatus
  /** Primary action label — use outcome verbs: "Accept", "Ready", "Collect" */
  actionLabel?: string
  onAction?: (id: string) => void
  /** Processing: disables action, adds pulse animation */
  processing?: boolean
  style?: React.CSSProperties
}

const STATE_BORDER: Record<OrderStatus, string> = {
  'new':         'var(--color-primary)',
  'in-progress': 'var(--color-warning)',
  'ready':       'var(--color-success)',
  'done':        'var(--color-border)',
  'error':       'var(--color-error)',
}

const STATE_BG: Record<OrderStatus, string> = {
  'new':         'var(--color-surface)',
  'in-progress': 'var(--color-surface)',
  'ready':       'var(--color-surface)',
  'done':        'var(--color-surface)',
  'error':       'var(--color-error-bg)',
}

const STATUS_BADGE: Record<OrderStatus, { bg: string; color: string; pip: string; label: string }> = {
  'new':         { bg: 'rgba(107,184,218,0.12)', color: 'var(--color-accent)',   pip: 'var(--color-primary)', label: 'New'         },
  'in-progress': { bg: 'rgba(218,218,107,0.2)',  color: '#5C5C00',               pip: 'var(--color-warning)', label: 'In progress' },
  'ready':       { bg: 'rgba(107,218,178,0.15)', color: '#1A6B4A',               pip: 'var(--color-success)', label: 'Ready'       },
  'done':        { bg: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', pip: 'var(--color-text-muted)', label: 'Done' },
  'error':       { bg: 'rgba(218,107,107,0.15)', color: '#8B2020',               pip: 'var(--color-error)',   label: 'Error'       },
}

const ACTION_STYLE: Partial<Record<OrderStatus, { bg: string; color: string; border: string }>> = {
  'ready': { bg: 'var(--color-success-bg)', color: '#1A6B4A', border: 'rgba(107,218,178,0.4)' },
  'error': { bg: 'var(--color-error-bg)',   color: '#8B2020', border: 'rgba(218,107,107,0.4)' },
}

const CHANNEL_STYLES: Record<OrderChannel, { bg: string; border: string; color: string }> = {
  table:    { bg: 'var(--channel-table-bg)',    border: 'var(--channel-table-border)',    color: 'var(--channel-table-text)'    },
  takeaway: { bg: 'var(--channel-takeaway-bg)', border: 'var(--channel-takeaway-border)', color: 'var(--channel-takeaway-text)' },
  eatin:    { bg: 'var(--channel-eatin-bg)',    border: 'var(--channel-eatin-border)',    color: 'var(--channel-eatin-text)'    },
  combo:    { bg: 'var(--channel-combo-bg)',    border: 'var(--channel-combo-border)',    color: 'var(--channel-combo-text)'    },
}

const CHANNEL_LABELS: Record<OrderChannel, string> = {
  table: 'Table', takeaway: 'Takeaway', eatin: 'Eat-in', combo: 'Combo',
}

const MAX_VISIBLE_ITEMS = 6

export function OrderCard({
  id,
  channel,
  channelLabel,
  time,
  items,
  total,
  status,
  actionLabel,
  onAction,
  processing = false,
  style,
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const visibleItems   = expanded ? items : items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount    = items.length - MAX_VISIBLE_ITEMS
  const badge          = STATUS_BADGE[status]
  const channelStyle   = CHANNEL_STYLES[channel]
  const actionOverride = ACTION_STYLE[status]

  return (
    <div
      style={{
        background: STATE_BG[status],
        border: '1px solid var(--color-border)',
        borderLeft: `3px solid ${STATE_BORDER[status]}`,
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: 'var(--elevation-1)',
        minWidth: 240, maxWidth: 320,
        opacity: processing ? 1 : undefined,
        animation: processing ? 'pulse-subtle 1.6s ease-in-out infinite' : undefined,
        transition: 'box-shadow 160ms',
        ...style,
      }}
    >
      {/* Header — always one line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
        <span style={{
          fontFamily: 'monospace', fontWeight: 700,
          color: 'var(--color-accent)', fontSize: 12, flexShrink: 0,
        }}>
          #{id}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 9999,
          background: channelStyle.bg,
          border: `1px solid ${channelStyle.border}`,
          color: channelStyle.color,
          flexShrink: 0,
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: channelStyle.color }} />
          {channelLabel ?? CHANNEL_LABELS[channel]}
        </span>
        <span style={{
          fontFamily: 'monospace', fontSize: 10,
          color: 'var(--color-text-muted)',
          marginLeft: 'auto', flexShrink: 0,
        }}>
          {time}
        </span>
      </div>

      {/* Item list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {visibleItems.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 20 }}>
                {item.quantity}×
              </span>
              {item.name}
            </div>
            {item.modifiers?.map((mod, j) => (
              <div key={j} style={{
                fontSize: 11, color: 'var(--color-text-muted)',
                paddingLeft: 26, marginTop: 1,
              }}>
                + {mod}
              </div>
            ))}
          </div>
        ))}

        {/* Collapse/expand */}
        {hiddenCount > 0 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            style={{
              background: 'none', border: 'none',
              fontSize: 11, color: 'var(--color-accent)',
              cursor: 'pointer', textAlign: 'left',
              padding: '2px 0', paddingLeft: 26,
            }}
          >
            +{hiddenCount} more
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        borderTop: '1px solid var(--color-border)',
        paddingTop: 10,
      }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)', marginRight: 'auto' }}>
          {total}
        </span>

        {/* Status badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 9999,
          background: badge.bg, color: badge.color,
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: badge.pip }} />
          {badge.label}
        </span>

        {/* Primary action */}
        {actionLabel && onAction && (
          <button
            onClick={() => !processing && onAction(id)}
            disabled={processing}
            style={{
              minHeight: 44, minWidth: 44,
              fontSize: 10, fontWeight: 700,
              padding: '5px 10px', borderRadius: 8,
              border: `1.5px solid ${actionOverride?.border ?? 'var(--color-border-strong)'}`,
              background: actionOverride?.bg ?? 'var(--color-surface-hover)',
              color: actionOverride?.color ?? 'var(--color-text-secondary)',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.5 : 1,
              transition: 'all 100ms',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
