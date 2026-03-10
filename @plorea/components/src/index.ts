/**
 * Plorea Component Library
 * v2.8 · March 2026
 *
 * Canonical components — use these patterns unless there is a
 * strong documented reason not to.
 *
 * Setup:
 *   1. Import tokens.css once in your app root:
 *      import 'plorea-components/tokens.css'
 *   2. Ensure tailwind.config.js uses the plorea config.
 *   3. Add `darkMode: 'class'` to your Tailwind config.
 */

// ── Canonical Components
export { AppShell }         from './components/AppShell'
export { OrderTable }       from './components/OrderTable'
export { OrderCard }        from './components/OrderCard'
export { CartSummary }      from './components/CartSummary'
export { PaymentSelector }  from './components/PaymentSelector'

// ── Hooks
export { useDarkMode }  from './hooks/useDarkMode'
export { useDensity }   from './hooks/useDensity'

// ── Types
export type { AppShellProps, NavLink, NavGroup }            from './components/AppShell'
export type { OrderTableProps, OrderRow, OrderTableColumn,
              OrderTableAction, OrderChannel, OrderStatus,
              DensityMode }                                  from './components/OrderTable'
export type { OrderCardProps, OrderCardItem }               from './components/OrderCard'
export type { CartSummaryProps, CartLine }                  from './components/CartSummary'
export type { PaymentSelectorProps, PaymentMethod }         from './components/PaymentSelector'
