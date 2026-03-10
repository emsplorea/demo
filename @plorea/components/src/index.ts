/**
 * Plorea Component Library
 * v3.3 · March 2026
 */

// ── Virtual ordering surfaces
export { AppShell }        from './components/AppShell'
export { OrderTable }      from './components/OrderTable'
export { OrderCard }       from './components/OrderCard'
export { CartSummary }     from './components/CartSummary'
export { PaymentSelector } from './components/PaymentSelector'
export { ProductCard }     from './components/ProductCard'
export { ProductModal }    from './components/ProductModal'
export { CategoryNav }     from './components/CategoryNav'
export { ComboSuggestion } from './components/ComboSuggestion'
export { KioskShell }      from './components/KioskShell'
export { CheckoutFlow }    from './components/CheckoutFlow'

// ── Physical POS terminal
export { PinPad }          from './components/PinPad'
export { PosCart }         from './components/PosCart'
export { PosPaymentFlow }  from './components/PosPaymentFlow'
export { PosParkFlow, PosDiscountFlow, PosDrawer, PosZReport } from './components/PosUtilities'

// ── Hooks
export { useDarkMode } from './hooks/useDarkMode'
export { useDensity }  from './hooks/useDensity'

// ── Design tokens (JS)
export {
  lightColors, darkColors, resolveColors, channelColors,
  spacing, semanticSpacing, sp,
  fontFamilies, fontSizes, fontWeights, lineHeights, typeScale,
  durations, easings, transitions,
  radius, radiusVars,
} from './tokens'

// ── Component contract
export { fmtPrice, COMPONENT_REGISTRY } from './component-contract'

// ── Types — virtual surfaces
export type { AppShellProps, NavLink, NavGroup }           from './components/AppShell'
export type { OrderTableProps, OrderRow, OrderTableColumn,
              OrderTableAction, OrderChannel, OrderStatus,
              DensityMode }                                from './components/OrderTable'
export type { OrderCardProps, OrderCardItem }              from './components/OrderCard'
export type { CartSummaryProps, CartLine }                 from './components/CartSummary'
export type { PaymentSelectorProps, PaymentMethod }        from './components/PaymentSelector'
export type { ProductCardProps, ProductCardVariant,
              ProductBadge, AllergenTag }                  from './components/ProductCard'
export type { ProductModalProps, ProductModalProduct,
              ModifierGroup, ModifierOption,
              SelectedModifier }                           from './components/ProductModal'
export type { CategoryNavProps, CategoryNavVariant,
              Category }                                   from './components/CategoryNav'
export type { ComboSuggestionProps, ComboSuggestionMode,
              ComboItem }                                  from './components/ComboSuggestion'
export type { KioskShellProps, DineType }                  from './components/KioskShell'
export type { CheckoutFlowProps, CheckoutCartLine,
              CheckoutPaymentMethod, CheckoutContactInfo,
              CheckoutServiceType,
              CheckoutDisplayMode }                        from './components/CheckoutFlow'

// ── Types — POS terminal
export type { PosStaffMember, PinPadProps }                from './components/PinPad'
export type { PosCartLine, PosDiscount, PosCartProps }     from './components/PosCart'
export type { PosPaymentFlowProps, PosReceiptData,
              PosPaymentMode,
              PosPaymentMethod as PosPaymentMethodType }   from './components/PosPaymentFlow'
export type { PosParkFlowProps, PosDiscountFlowProps,
              PosDiscountPreset, PosDrawerProps,
              DrawerEntry, PosZReportProps,
              ZReportReceipt }                             from './components/PosUtilities'

// ── Types — tokens
export type { ColorTokens, ChannelColorToken,
              SpacingKey }                                 from './tokens'

// ── Types — component contract
export type { BaseProps, CurrencyProps, DisableableProps,
              LoadableProps, EmptyStateProps,
              ComponentSlots, SlottableProps,
              FullComponentProps }                         from './component-contract'
