/**
 * ProductCard — Canonical Component 06
 * Plorea Design System v2.8
 *
 * Product tile used across all ordering surfaces:
 * QR/mobile, kiosk portrait, kiosk landscape, online.
 *
 * Three display variants driven by `variant` prop:
 *
 *   grid      — square image + name + price (kiosk grid, popular carousel)
 *   featured  — wide landscape layout, image right (QR first-item hero)
 *   compact   — no image, text-only row (dense lists)
 *
 * Rules:
 * - Touch target: min 44×44px on all interactive surfaces
 * - Image always aspect-ratio:1 in grid, fixed height in featured
 * - Badge position: absolute top-left over image — never shifts layout
 * - Price: always --color-accent, fontWeight 700
 * - Allergen tags: icon-only, title tooltip — never expand card height
 * - Out-of-stock: greyed, cursor not-allowed, no onClick fired
 */

import { ReactNode } from 'react'

export interface ProductBadge {
  label: string
  /** 'hot' → orange, 'new' → green, 'popular' → blue */
  variant: 'hot' | 'new' | 'popular'
}

export interface AllergenTag {
  icon: string   // e.g. '🌾', '🥛', '🌱'
  label: string  // e.g. 'Gluten-free', 'Lactose-free'
}

export type ProductCardVariant = 'grid' | 'featured' | 'compact'

export interface ProductCardProps {
  id: string | number
  name: string
  description?: string
  price: number                // in minor units (øre)
  currency?: string            // default 'kr'
  image?: string               // URL or data URI
  imageFallback?: ReactNode    // shown when image is missing
  badge?: ProductBadge
  allergens?: AllergenTag[]
  popular?: boolean
  outOfStock?: boolean
  variant?: ProductCardVariant
  /** Width hint for grid variant — used by parent grid layout */
  minWidth?: number
  onClick?: (id: string | number) => void
  style?: React.CSSProperties
}

// ── Badge colours
const BADGE_STYLES: Record<ProductBadge['variant'], { bg: string; color: string }> = {
  hot:     { bg: '#FFF3E0', color: '#E65100' },
  new:     { bg: 'rgba(107,218,178,0.15)', color: 'var(--color-success)' },
  popular: { bg: 'var(--color-info-bg)',   color: 'var(--color-accent)'  },
}

const BADGE_ICONS: Record<ProductBadge['variant'], string> = {
  hot: '🔥', new: '✨', popular: '⭐',
}

function formatPrice(minor: number, currency = 'kr'): string {
  return `${(minor / 100).toFixed(0)} ${currency}`
}

function BadgePip({ badge }: { badge: ProductBadge }) {
  const s = BADGE_STYLES[badge.variant]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 10, fontWeight: 700,
      padding: '2px 6px', borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {BADGE_ICONS[badge.variant]} {badge.label}
    </span>
  )
}

function ProductImage({
  src, fallback, height, width,
}: {
  src?: string; fallback?: ReactNode; height?: number | string; width?: number | string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{
          width:  width  ?? '100%',
          height: height ?? '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    )
  }
  return (
    <div style={{
      width: width ?? '100%', height: height ?? '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-surface-hover)',
      fontSize: 32,
    }}>
      {fallback ?? '🍽️'}
    </div>
  )
}

// ── GRID variant — square tile, used in product grids and popular carousel
function GridCard({
  name, price, currency, image, imageFallback, badge, allergens,
  outOfStock, onClick, id, style,
}: ProductCardProps) {
  return (
    <div
      role="button"
      tabIndex={outOfStock ? -1 : 0}
      onClick={() => !outOfStock && onClick?.(id)}
      onKeyDown={e => e.key === 'Enter' && !outOfStock && onClick?.(id)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: var_r_lg,
        overflow: 'hidden',
        border: '1px solid #eef0f2',
        cursor: outOfStock ? 'not-allowed' : 'pointer',
        opacity: outOfStock ? 0.55 : 1,
        position: 'relative',
        transition: `box-shadow var(--dur-fast), transform var(--dur-fast)`,
        ...style,
      }}
      onMouseEnter={e => {
        if (!outOfStock) {
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--elevation-2)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Badge overlay */}
      {badge && (
        <div style={{ position: 'absolute', top: 6, left: 6, zIndex: 1 }}>
          <BadgePip badge={badge} />
        </div>
      )}

      {/* Image */}
      <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
        <ProductImage src={image} fallback={imageFallback} />
      </div>

      {/* Info */}
      <div style={{ padding: '7px 9px' }}>
        <div style={{
          fontSize: 12, fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          color: 'var(--color-text-primary)',
        }}>
          {name}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: 3,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)' }}>
            {formatPrice(price, currency)}
          </span>
          {allergens && allergens.length > 0 && (
            <span style={{ display: 'flex', gap: 2 }}>
              {allergens.map(a => (
                <span key={a.icon} title={a.label} style={{ fontSize: 10 }}>{a.icon}</span>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── FEATURED variant — wide hero row, image right (QR first product)
function FeaturedCard({
  name, description, price, currency, image, imageFallback, badge,
  allergens, outOfStock, onClick, id, style,
}: ProductCardProps) {
  return (
    <div
      role="button"
      tabIndex={outOfStock ? -1 : 0}
      onClick={() => !outOfStock && onClick?.(id)}
      onKeyDown={e => e.key === 'Enter' && !outOfStock && onClick?.(id)}
      style={{
        display: 'flex',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        cursor: outOfStock ? 'not-allowed' : 'pointer',
        opacity: outOfStock ? 0.55 : 1,
        marginBottom: 8,
        minHeight: 80,
        transition: `box-shadow var(--dur-fast)`,
        ...style,
      }}
      onMouseEnter={e => {
        if (!outOfStock)
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--elevation-1)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {/* Text */}
      <div style={{
        flex: 1, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {name}
          </span>
          {badge && <BadgePip badge={badge} />}
        </div>
        {description && (
          <div style={{
            fontSize: 11, color: 'var(--color-text-secondary)',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-accent)' }}>
            {formatPrice(price, currency)}
          </span>
          {allergens?.map(a => (
            <span key={a.icon} title={a.label} style={{ fontSize: 11 }}>{a.icon}</span>
          ))}
        </div>
      </div>

      {/* Image */}
      <div style={{ width: 110, minHeight: 80, flexShrink: 0, overflow: 'hidden' }}>
        <ProductImage src={image} fallback={imageFallback} height="100%" />
      </div>
    </div>
  )
}

// ── COMPACT variant — text-only row, no image
function CompactCard({
  name, description, price, currency, badge, allergens,
  outOfStock, onClick, id, style,
}: ProductCardProps) {
  return (
    <div
      role="button"
      tabIndex={outOfStock ? -1 : 0}
      onClick={() => !outOfStock && onClick?.(id)}
      onKeyDown={e => e.key === 'Enter' && !outOfStock && onClick?.(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        cursor: outOfStock ? 'not-allowed' : 'pointer',
        opacity: outOfStock ? 0.55 : 1,
        minHeight: 44,
        transition: `background var(--dur-fast)`,
        ...style,
      }}
      onMouseEnter={e => {
        if (!outOfStock)
          ;(e.currentTarget as HTMLDivElement).style.background = 'var(--color-surface-hover)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.background = 'var(--color-surface)'
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {name}
          </span>
          {badge && <BadgePip badge={badge} />}
        </div>
        {description && (
          <div style={{
            fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {description}
          </div>
        )}
      </div>

      {allergens && allergens.length > 0 && (
        <span style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          {allergens.map(a => (
            <span key={a.icon} title={a.label} style={{ fontSize: 11 }}>{a.icon}</span>
          ))}
        </span>
      )}

      <span style={{
        fontSize: 13, fontWeight: 700,
        color: 'var(--color-accent)', flexShrink: 0,
      }}>
        {formatPrice(price, currency)}
      </span>
    </div>
  )
}

// ── CSS variable shorthand (avoids repetition)
const var_r_lg = 'var(--r-lg)'

// ── Main export — delegates to variant
export function ProductCard(props: ProductCardProps) {
  const { variant = 'grid' } = props
  if (variant === 'featured') return <FeaturedCard {...props} />
  if (variant === 'compact')  return <CompactCard  {...props} />
  return <GridCard {...props} />
}
