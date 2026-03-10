import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './ProductCard'

// ── Shared demo images (emoji-based SVG, same as kiosk demo)
function pImg(emoji: string, bg1: string, bg2: string) {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="${bg1}"/>` +
      `<stop offset="100%" stop-color="${bg2}"/>` +
      `</linearGradient></defs>` +
      `<rect width="400" height="400" fill="url(#g)"/>` +
      `<text x="200" y="240" text-anchor="middle" font-size="160">${emoji}</text>` +
      `</svg>`
    )
  )
}

const IMG_BURGER  = pImg('🍔', '#FFF3E0', '#FFE0B2')
const IMG_PIZZA   = pImg('🍕', '#FFF3E0', '#FFE0B2')
const IMG_FRIES   = pImg('🍟', '#FFF8E1', '#FFECB3')
const IMG_DRINK   = pImg('🥤', '#FFEBEE', '#FFCDD2')
const IMG_DESSERT = pImg('🍰', '#FCE4EC', '#F8BBD0')
const IMG_VEGGIE  = pImg('🥗', '#E8F5E9', '#C8E6C9')

const ALLERGENS_DAIRY   = [{ icon: '🥛', label: 'Dairy' }]
const ALLERGENS_GLUTEN  = [{ icon: '🌾', label: 'Gluten' }]
const ALLERGENS_VEGAN   = [{ icon: '🌱', label: 'Vegan' }]
const ALLERGENS_MIXED   = [
  { icon: '🌾', label: 'Gluten' },
  { icon: '🥛', label: 'Dairy' },
]

const meta: Meta<typeof ProductCard> = {
  title:     'Canonical/06 ProductCard',
  component:  ProductCard,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Product tile used across **all ordering surfaces** — QR, kiosk portrait, kiosk landscape, online.

Three display variants:

| Variant | Layout | Used for |
|---------|--------|----------|
| \`grid\` | Square image + name + price | Kiosk product grids, popular carousel |
| \`featured\` | Wide hero row, image right | QR/mobile first-item per category |
| \`compact\` | Text-only row | Dense lists, no-image contexts |

**Rules:**
- Touch target: min 44×44px on all surfaces
- Price always in \`--color-accent\`, fontWeight 700
- Badge: absolute top-left overlay — never shifts layout
- Allergen icons: icon-only with \`title\` tooltip
- Out-of-stock: greyed, cursor not-allowed, onClick suppressed
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid', 'featured', 'compact'],
    },
    price: { control: 'number' },
    outOfStock: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ProductCard>

// ─────────────────────────────────────────────────────────────────
// Grid variant
// ─────────────────────────────────────────────────────────────────

export const GridDefault: Story = {
  name: 'Grid — default',
  args: {
    id: '1',
    name: 'HOT BURGER',
    price: 9900,
    image: IMG_BURGER,
    currency: 'kr',
    variant: 'grid',
    onClick: (id) => console.log('clicked', id),
  },
}

export const GridWithBadge: Story = {
  name: 'Grid — with badge',
  args: {
    id: '2',
    name: 'Chili Burger',
    price: 15000,
    image: IMG_PIZZA,
    currency: 'kr',
    variant: 'grid',
    badge: { label: 'Bestseller', variant: 'hot' },
    allergens: ALLERGENS_MIXED,
    onClick: (id) => console.log('clicked', id),
  },
}

export const GridOutOfStock: Story = {
  name: 'Grid — out of stock',
  args: {
    id: '3',
    name: 'Brownie',
    price: 6500,
    image: IMG_DESSERT,
    currency: 'kr',
    variant: 'grid',
    outOfStock: true,
  },
}

export const GridNoImage: Story = {
  name: 'Grid — no image (fallback)',
  args: {
    id: '4',
    name: 'Veggie Burger',
    price: 13000,
    currency: 'kr',
    variant: 'grid',
    allergens: ALLERGENS_VEGAN,
    badge: { label: 'New', variant: 'new' },
  },
}

/** All badge variants in a row */
export const GridAllBadges: Story = {
  name: 'Grid — all badge variants',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['hot', 'new', 'popular'] as const).map(variant => (
        <ProductCard
          key={variant}
          id={variant}
          name={{ hot: '🔥 Hot item', new: '✨ New item', popular: '⭐ Popular' }[variant]}
          price={9900}
          image={IMG_FRIES}
          currency="kr"
          badge={{ label: variant.charAt(0).toUpperCase() + variant.slice(1), variant }}
          onClick={() => {}}
        />
      ))}
    </div>
  ),
}

/** Simulated kiosk grid — 3-column */
export const GridKioskLayout: Story = {
  name: 'Grid — kiosk 3-column',
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 130px)',
      gap: 10,
    }}>
      {[
        { id: '1', name: 'HOT BURGER',    price: 9900,  image: IMG_BURGER,  badge: { label: 'Hot', variant: 'hot' as const } },
        { id: '2', name: 'Chili Burger',  price: 15000, image: IMG_PIZZA },
        { id: '3', name: 'Bacon Burger',  price: 15000, image: IMG_BURGER },
        { id: '4', name: 'Pommes Frites', price: 4900,  image: IMG_FRIES,   allergens: ALLERGENS_GLUTEN },
        { id: '5', name: 'Coca-Cola',     price: 3500,  image: IMG_DRINK,   allergens: ALLERGENS_VEGAN },
        { id: '6', name: 'Iskrem',        price: 4500,  image: IMG_DESSERT, allergens: ALLERGENS_DAIRY, badge: { label: 'New', variant: 'new' as const } },
      ].map(p => (
        <ProductCard key={p.id} {...p} currency="kr" onClick={() => {}} />
      ))}
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Featured variant
// ─────────────────────────────────────────────────────────────────

export const FeaturedDefault: Story = {
  name: 'Featured — default',
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ maxWidth: 375 }}>
      <ProductCard
        id="1"
        name="HOT BURGER"
        description="Saftig burger med friske grønnsaker og huslagd dressing"
        price={9900}
        image={IMG_BURGER}
        currency="kr"
        variant="featured"
        badge={{ label: 'Bestseller', variant: 'hot' }}
        allergens={ALLERGENS_DAIRY}
        onClick={() => {}}
      />
    </div>
  ),
}

export const FeaturedQRLayout: Story = {
  name: 'Featured — QR mobile list',
  render: () => (
    <div style={{ maxWidth: 375, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, padding: '10px 0 6px' }}>Mat</div>
      <ProductCard
        id="1" name="HOT BURGER"
        description="Saftig burger med friske grønnsaker"
        price={9900} image={IMG_BURGER} currency="kr"
        variant="featured"
        badge={{ label: 'Hot', variant: 'hot' }}
        allergens={ALLERGENS_DAIRY}
        onClick={() => {}}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        {[
          { id: '2', name: 'Chili Burger',  price: 15000, image: IMG_PIZZA },
          { id: '3', name: 'Veggie Burger', price: 13000, image: IMG_VEGGIE, allergens: ALLERGENS_VEGAN, badge: { label: 'New', variant: 'new' as const } },
        ].map(p => (
          <ProductCard key={p.id} {...p} currency="kr" onClick={() => {}} />
        ))}
      </div>
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Compact variant
// ─────────────────────────────────────────────────────────────────

export const CompactDefault: Story = {
  name: 'Compact — list',
  render: () => (
    <div style={{
      maxWidth: 400,
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
    }}>
      {[
        { id: '1', name: 'HOT BURGER',    price: 9900,  description: 'Saftig burger med dressing',  badge: { label: 'Hot', variant: 'hot' as const } },
        { id: '2', name: 'Chili Burger',  price: 15000, description: 'Med jalapeño og sriracha',    allergens: ALLERGENS_MIXED },
        { id: '3', name: 'Veggie Burger', price: 13000, description: 'Plantebasert',                allergens: ALLERGENS_VEGAN, badge: { label: 'New', variant: 'new' as const } },
        { id: '4', name: 'Pommes Frites', price: 4900,  description: 'Sprøstekte',                  allergens: ALLERGENS_GLUTEN },
      ].map(p => (
        <ProductCard key={p.id} {...p} currency="kr" variant="compact" onClick={() => {}} />
      ))}
    </div>
  ),
}
