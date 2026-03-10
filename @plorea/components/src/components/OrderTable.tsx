/**
 * OrderTable — Canonical Component 02
 * Plorea Design System v2.8
 *
 * Primary operational list component for order management.
 * Drives every back-office and POS order view.
 *
 * Rules:
 * - Row height follows --row-h density token — never hardcoded
 * - Order IDs always monospace, --color-accent
 * - Selected row: --color-selection bg + --color-accent left border
 * - Hover: --color-surface-hover only — never border change
 * - Actions right-aligned, appear on row hover, max 3 icons
 * - Timestamps: monospace, --color-text-muted, right-aligned
 * - Empty state: centred message + CTA, no blank table
 */

import { useState, ReactNode } from 'react'

export type OrderChannel = 'table' | 'takeaway' | 'eatin' | 'combo'
export type OrderStatus  = 'new' | 'in-progress' | 'ready' | 'done' | 'error'
export type DensityMode  = 'comfortable' | 'compact' | 'ultra'

export interface OrderRow {
  id: string
  channel: OrderChannel
  channelLabel?: string   // e.g. "Table 4" — falls back to channel name
  items: number
  status: OrderStatus
  total: string           // pre-formatted, e.g. "kr 284"
  time: string            // pre-formatted, e.g. "12:34"
  [key: string]: unknown  // allow extra data columns
}

export interface OrderTableAction {
  icon: ReactNode
  label: string
  onClick: (row: OrderRow) => void
}

export interface OrderTableColumn {
  key: keyof OrderRow | string
  header: string
  sortable?: boolean
  render?: (row: OrderRow) => ReactNode
  align?: 'left' | 'right'
  width?: number | string
}

export interface OrderTableProps {
  rows: OrderRow[]
  /** Columns to show — defaults to standard order columns */
  columns?: OrderTableColumn[]
  /** Row actions (max 3) */
  actions?: OrderTableAction[]
  /** Selected row id */
  selectedId?: string
  onRowSelect?: (row: OrderRow) => void
  onRowClick?: (row: OrderRow) => void
  /** Show density controls */
  showDensityToggle?: boolean
  density?: DensityMode
  onDensityChange?: (mode: DensityMode) => void
  /** Footer: total row count for pagination label */
  totalRows?: number
  /** Footer: current page */
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
}

// ── Channel badge styles
const channelStyles: Record<OrderChannel, { bg: string; border: string; color: string }> = {
  table:    { bg: 'var(--channel-table-bg)',    border: 'var(--channel-table-border)',    color: 'var(--channel-table-text)'    },
  takeaway: { bg: 'var(--channel-takeaway-bg)', border: 'var(--channel-takeaway-border)', color: 'var(--channel-takeaway-text)' },
  eatin:    { bg: 'var(--channel-eatin-bg)',    border: 'var(--channel-eatin-border)',    color: 'var(--channel-eatin-text)'    },
  combo:    { bg: 'var(--channel-combo-bg)',    border: 'var(--channel-combo-border)',    color: 'var(--channel-combo-text)'    },
}

const channelDefaultLabels: Record<OrderChannel, string> = {
  table: 'Table', takeaway: 'Takeaway', eatin: 'Eat-in', combo: 'Combo',
}

// ── Status badge styles
const statusStyles: Record<OrderStatus, { bg: string; color: string; pip: string }> = {
  'new':         { bg: 'rgba(107,184,218,0.12)', color: 'var(--color-accent)',   pip: 'var(--color-primary)' },
  'in-progress': { bg: 'rgba(218,218,107,0.2)',  color: '#5C5C00',               pip: 'var(--color-warning)' },
  'ready':       { bg: 'rgba(107,218,178,0.15)', color: '#1A6B4A',               pip: 'var(--color-success)' },
  'done':        { bg: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', pip: 'var(--color-text-muted)' },
  'error':       { bg: 'rgba(218,107,107,0.15)', color: '#8B2020',               pip: 'var(--color-error)'   },
}

const statusLabels: Record<OrderStatus, string> = {
  'new': 'New', 'in-progress': 'In progress', 'ready': 'Ready', 'done': 'Done', 'error': 'Error',
}

const densityTokens: Record<DensityMode, { rowH: number; cellPy: number }> = {
  comfortable: { rowH: 56, cellPy: 14 },
  compact:     { rowH: 44, cellPy: 10 },
  ultra:       { rowH: 36, cellPy:  7 },
}

function ChannelBadge({ channel, label }: { channel: OrderChannel; label?: string }) {
  const s = channelStyles[channel]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700,
      padding: '3px 9px', borderRadius: 9999,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {label ?? channelDefaultLabels[channel]}
    </span>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const s = statusStyles[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700,
      padding: '3px 9px', borderRadius: 9999,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.pip, flexShrink: 0 }} />
      {statusLabels[status]}
    </span>
  )
}

const DEFAULT_COLUMNS: OrderTableColumn[] = [
  { key: 'id',      header: 'Order',   sortable: true },
  { key: 'channel', header: 'Channel' },
  { key: 'items',   header: 'Items' },
  { key: 'status',  header: 'Status' },
  { key: 'total',   header: 'Total',   align: 'right' },
  { key: 'time',    header: 'Time',    align: 'right' },
]

export function OrderTable({
  rows,
  columns = DEFAULT_COLUMNS,
  actions = [],
  selectedId,
  onRowSelect,
  onRowClick,
  showDensityToggle = false,
  density: densityProp = 'comfortable',
  onDensityChange,
  totalRows,
  page = 1,
  totalPages,
  onPageChange,
  emptyMessage = 'No orders',
  emptyAction,
}: OrderTableProps) {
  const [density, setDensity] = useState<DensityMode>(densityProp)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { rowH, cellPy } = densityTokens[density]

  function handleDensity(mode: DensityMode) {
    setDensity(mode)
    onDensityChange?.(mode)
  }

  function renderCell(row: OrderRow, col: OrderTableColumn): ReactNode {
    if (col.render) return col.render(row)
    switch (col.key) {
      case 'id':
        return (
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-accent)' }}>
            #{row.id}
          </span>
        )
      case 'channel':
        return <ChannelBadge channel={row.channel} label={row.channelLabel} />
      case 'status':
        return <StatusBadge status={row.status} />
      case 'time':
        return (
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-muted)' }}>
            {row.time}
          </span>
        )
      case 'total':
        return <span style={{ fontWeight: 600 }}>{row.total}</span>
      default:
        return String(row[col.key] ?? '')
    }
  }

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 14, overflow: 'hidden' }}>

      {/* Density toggle */}
      {showDensityToggle && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '10px 16px', borderBottom: '1px solid var(--color-border)',
          gap: 6,
        }}>
          {(['comfortable', 'compact', 'ultra'] as DensityMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => handleDensity(mode)}
              style={{
                padding: '4px 12px', borderRadius: 9999,
                border: '1px solid',
                borderColor: density === mode ? 'var(--color-accent)' : 'var(--color-border-strong)',
                background: density === mode ? 'var(--color-accent)' : 'var(--color-surface)',
                color: density === mode ? 'var(--color-primary-text)' : 'var(--color-text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 120ms',
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border-strong)' }}>
            {columns.map(col => (
              <th
                key={col.key as string}
                style={{
                  textAlign: col.align === 'right' ? 'right' : 'left',
                  padding: '10px 14px',
                  fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-surface-hover)',
                  whiteSpace: 'nowrap',
                  cursor: col.sortable ? 'pointer' : 'default',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th style={{
                width: actions.length * 36,
                background: 'var(--color-surface-hover)',
                padding: '10px 14px',
              }} />
            )}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                style={{ textAlign: 'center', padding: '48px 24px' }}
              >
                <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 12 }}>
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
              </td>
            </tr>
          ) : rows.map(row => {
            const isSelected = row.id === selectedId
            const isHovered  = row.id === hoveredId
            return (
              <tr
                key={row.id}
                onClick={() => { onRowSelect?.(row); onRowClick?.(row) }}
                onMouseEnter={() => setHoveredId(row.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  height: rowH,
                  background: isSelected
                    ? 'var(--color-selection)'
                    : isHovered
                      ? 'var(--color-surface-hover)'
                      : 'var(--color-surface)',
                  borderLeft: isSelected ? '3px solid var(--color-accent)' : '3px solid transparent',
                  cursor: onRowClick || onRowSelect ? 'pointer' : 'default',
                  transition: 'background 100ms',
                }}
              >
                {columns.map(col => (
                  <td
                    key={col.key as string}
                    style={{
                      padding: `${cellPy}px 14px`,
                      borderBottom: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                      textAlign: col.align === 'right' ? 'right' : 'left',
                      verticalAlign: 'middle',
                    }}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td style={{
                    padding: `${cellPy}px 8px`,
                    borderBottom: '1px solid var(--color-border)',
                    textAlign: 'right',
                    verticalAlign: 'middle',
                  }}>
                    <div style={{
                      display: 'flex', gap: 2, justifyContent: 'flex-end',
                      opacity: isHovered || isSelected ? 1 : 0,
                      transition: 'opacity 100ms',
                    }}>
                      {actions.slice(0, 3).map((action, i) => (
                        <button
                          key={i}
                          onClick={e => { e.stopPropagation(); action.onClick(row) }}
                          title={action.label}
                          style={{
                            width: 28, height: 28,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'none', border: 'none',
                            color: 'var(--color-text-muted)',
                            borderRadius: 6, cursor: 'pointer',
                            transition: 'background 100ms, color 100ms',
                          }}
                          onMouseEnter={e => {
                            ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-hover)'
                            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'
                          }}
                          onMouseLeave={e => {
                            ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
                            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'
                          }}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border)',
        fontSize: 12, color: 'var(--color-text-muted)',
      }}>
        <span>{totalRows ?? rows.length} orders</span>
        {totalPages && totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              style={{
                padding: '3px 10px', fontSize: 12, borderRadius: 6,
                border: '1px solid var(--color-border-strong)',
                background: 'var(--color-surface)',
                color: page <= 1 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ←
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              style={{
                padding: '3px 10px', fontSize: 12, borderRadius: 6,
                border: '1px solid var(--color-border-strong)',
                background: 'var(--color-surface)',
                color: page >= totalPages ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
