/**
 * component-contract.ts
 * Plorea Design System v3.3
 *
 * Every canonical component MUST implement this contract.
 * This file is the authoritative definition.
 *
 * ── Rules ─────────────────────────────────────────────────────────
 *
 * 1. All components accept `style?: React.CSSProperties` for layout overrides.
 *    Components NEVER use style to express their own colours — those come from tokens.
 *
 * 2. All interactive components expose `disabled?: boolean`.
 *    Disabled state is never implemented by removing event handlers only —
 *    it also sets cursor-not-allowed and reduces opacity to 0.38.
 *
 * 3. All list components expose `empty*` props for zero-state handling.
 *    No component renders a broken empty state without guidance.
 *
 * 4. All components that contain text-display of prices receive:
 *    `currency?: string` — default 'kr', passed through to formatting.
 *    ALL prices are in minor units (øre). No exceptions.
 *
 * 5. All components that can load asynchronously accept `loading?: boolean`.
 *    Loading state shows a skeleton, never a spinner inside the component.
 *
 * 6. No component exposes `className`. Slot customisation is via `style`.
 *    This prevents Tailwind collisions and keeps component internals stable.
 *
 * 7. Event handlers follow the pattern: `on{Noun}{Verb}` — never `handle*`.
 *    e.g. onRowClick, onQuantityChange, onDineChoice — not handleClick.
 *
 * ── Surface assignment ───────────────────────────────────────────
 *
 *   Virtual ordering surfaces (QR · Kiosk · Online):
 *     ProductCard, ProductModal, CartSummary, PaymentSelector,
 *     CategoryNav, ComboSuggestion, KioskShell, CheckoutFlow
 *
 *   Operational surfaces (Dashboard · KDS · Partner portal):
 *     AppShell, OrderTable, OrderCard
 *
 *   Physical POS terminal:
 *     PinPad, PosCart, PosPaymentFlow,
 *     PosParkFlow, PosDiscountFlow, PosDrawer, PosZReport
 *
 * ── File structure ───────────────────────────────────────────────
 *
 *   components/
 *     ComponentName/
 *       ComponentName.tsx        ← implementation
 *       ComponentName.types.ts   ← all exported types (optional for small components)
 *       ComponentName.stories.tsx
 *       ComponentName.test.tsx   (when test coverage exists)
 *
 *   For simple components (< ~100 lines), types live inline in the .tsx file.
 *   For complex components (PosPaymentFlow, CheckoutFlow), extract to .types.ts.
 *
 * ── Component size thresholds ───────────────────────────────────
 *
 *   Small     < 80 lines    — inline types, one story
 *   Medium    80–200 lines  — inline types, 3–5 stories
 *   Large     200–500 lines — extract types to .types.ts, 5–10 stories
 *   Composite > 500 lines   — split into sub-components, full story matrix
 */

import type { CSSProperties, ReactNode } from 'react'

// ── Base props every component receives ─────────────────────────

export interface BaseProps {
  /** Inline style for layout/positioning overrides. NOT for colours or typography. */
  style?: CSSProperties
}

// ── Props for components that display currency ──────────────────

export interface CurrencyProps {
  /**
   * ISO currency code or display suffix.
   * Default: 'kr'
   * All numeric values are in minor units (øre / cents).
   */
  currency?: string
}

// ── Props for components that can be disabled ───────────────────

export interface DisableableProps {
  /**
   * Disables all interactions. Sets cursor-not-allowed + opacity 0.38.
   * Always paired with aria-disabled on the root element.
   */
  disabled?: boolean
}

// ── Props for components that can load ─────────────────────────

export interface LoadableProps {
  /**
   * Shows skeleton loading state.
   * Never shows a spinner — layout must not shift when loading completes.
   */
  loading?: boolean
}

// ── Props for components with an empty state ────────────────────

export interface EmptyStateProps {
  /** Message shown when list is empty. */
  emptyMessage?: string
  /** Label for the empty-state action button. */
  emptyActionLabel?: string
  /** Called when the empty-state action button is clicked. */
  onEmptyAction?: () => void
}

// ── Slot pattern — for components that accept node injection ────

/**
 * Some components expose "slots" — named positions where
 * consumers can inject custom React nodes.
 *
 * Slot names:
 *   header      — replaces or extends the component header
 *   footer      — replaces or extends the component footer
 *   before      — injected before the main content
 *   after       — injected after the main content
 *   empty       — overrides the default empty state rendering
 *   loading     — overrides the default skeleton loading state
 *
 * Example usage:
 *   <OrderTable
 *     slots={{ header: <MyCustomHeader /> }}
 *   />
 */
export interface ComponentSlots {
  header?:  ReactNode
  footer?:  ReactNode
  before?:  ReactNode
  after?:   ReactNode
  empty?:   ReactNode
  loading?: ReactNode
}

export interface SlottableProps {
  slots?: ComponentSlots
}

// ── Full base for complex components ────────────────────────────

/**
 * Full base interface — extend for complex components that need
 * all capabilities.
 *
 * Usage:
 *   export interface OrderTableProps
 *     extends FullComponentProps, EmptyStateProps, SlottableProps {
 *     rows: OrderRow[]
 *     // ...
 *   }
 */
export interface FullComponentProps
  extends BaseProps, CurrencyProps, DisableableProps, LoadableProps {}

// ── Price formatting contract ────────────────────────────────────

/**
 * Canonical price formatter.
 * All components that display money MUST use this function.
 * Never format prices inline.
 *
 * @param minor  Amount in minor units (øre). Always an integer.
 * @param currency  Display suffix. Default 'kr'.
 *
 * Examples:
 *   fmtPrice(13900)         → "139 kr"
 *   fmtPrice(13900, 'NOK')  → "139 NOK"
 *   fmtPrice(139)           → "1,39 kr"
 *   fmtPrice(0)             → "0 kr"
 */
export function fmtPrice(minor: number, currency = 'kr'): string {
  const major = minor / 100
  return `${major.toLocaleString('nb-NO', {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${currency}`
}

// ── Component registry ──────────────────────────────────────────

/**
 * Canonical component list.
 * Update this when adding new components.
 *
 * Format: [id, name, surface, status]
 */
export const COMPONENT_REGISTRY = [
  // Virtual ordering surfaces
  [7,  'ProductCard',      'ordering',    'stable'],
  [8,  'CategoryNav',      'ordering',    'stable'],
  [9,  'ComboSuggestion',  'ordering',    'stable'],
  [6,  'ProductModal',     'ordering',    'stable'],
  [4,  'CartSummary',      'ordering',    'stable'],
  [5,  'PaymentSelector',  'ordering',    'stable'],
  [10, 'KioskShell',       'kiosk',       'stable'],
  [11, 'CheckoutFlow',     'online',      'stable'],

  // Operational
  [1,  'AppShell',         'operational', 'stable'],
  [2,  'OrderTable',       'operational', 'stable'],
  [3,  'OrderCard',        'operational', 'stable'],

  // POS terminal
  [12, 'PinPad',           'pos',         'stable'],
  [13, 'PosCart',          'pos',         'stable'],
  [14, 'PosPaymentFlow',   'pos',         'stable'],
  [15, 'PosParkFlow',      'pos',         'stable'],
  [15, 'PosDiscountFlow',  'pos',         'stable'],
  [15, 'PosDrawer',        'pos',         'stable'],
  [15, 'PosZReport',       'pos',         'stable'],
] as const
