import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CategoryNav } from './CategoryNav'
import type { Category } from './CategoryNav'

const CATEGORIES: Category[] = [
  { id: 1, label: 'Mat',     icon: '🍔' },
  { id: 2, label: 'Tilbehør', icon: '🍟' },
  { id: 3, label: 'Drikke',  icon: '🥤' },
  { id: 4, label: 'Dessert', icon: '🍰' },
]

const CATEGORIES_LONG: Category[] = [
  { id: 1,  label: 'Frokost',    icon: '🍳' },
  { id: 2,  label: 'Lunsj',      icon: '🥪' },
  { id: 3,  label: 'Middag',     icon: '🍽️' },
  { id: 4,  label: 'Burgere',    icon: '🍔' },
  { id: 5,  label: 'Pizza',      icon: '🍕' },
  { id: 6,  label: 'Pasta',      icon: '🍝' },
  { id: 7,  label: 'Salat',      icon: '🥗' },
  { id: 8,  label: 'Tilbehør',   icon: '🍟' },
  { id: 9,  label: 'Drikke',     icon: '🥤' },
  { id: 10, label: 'Dessert',    icon: '🍰' },
]

const meta: Meta<typeof CategoryNav> = {
  title:     'Canonical/08 CategoryNav',
  component:  CategoryNav,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Category navigation for all ordering surfaces.

Two layout variants:

| Variant | Layout | Used for |
|---------|--------|----------|
| \`pills\` | Horizontal scrolling pill row, sticky top | QR, kiosk portrait, online |
| \`sidebar\` | Vertical icon + label column, 76px wide | Kiosk portrait left edge |

**Rules:**
- Touch target: min 36px pills, min 52px sidebar buttons
- Pills: \`position: sticky; top: 0\` — always visible during scroll
- Sidebar: active item gets 3px left accent bar + blue-50 background
- \`onSelect\` fires with category id — scroll-to-section is caller's responsibility
- Icon is optional — falls back to first letter of label
        `,
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['pills', 'sidebar'] },
  },
}

export default meta
type Story = StoryObj<typeof CategoryNav>

// ─────────────────────────────────────────────────────────────────
// Pills
// ─────────────────────────────────────────────────────────────────

export const PillsDefault: Story = {
  name: 'Pills — default',
  render: () => {
    const [active, setActive] = useState<number>(1)
    return (
      <div style={{ background: 'var(--color-bg-page)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <CategoryNav
          categories={CATEGORIES}
          activeId={active}
          variant="pills"
          onSelect={id => setActive(id as number)}
        />
        <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Active: <strong>{CATEGORIES.find(c => c.id === active)?.label}</strong>
        </div>
      </div>
    )
  },
}

export const PillsScrollable: Story = {
  name: 'Pills — many categories (scrollable)',
  render: () => {
    const [active, setActive] = useState<number>(1)
    return (
      <div style={{
        background: 'var(--color-bg-page)', borderRadius: 'var(--r-lg)',
        overflow: 'hidden', maxWidth: 375,
      }}>
        <CategoryNav
          categories={CATEGORIES_LONG}
          activeId={active}
          variant="pills"
          onSelect={id => setActive(id as number)}
        />
        <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Active: <strong>{CATEGORIES_LONG.find(c => c.id === active)?.label}</strong>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: { story: 'Overflow scrolls horizontally. Scrollbar hidden via CSS.' },
    },
  },
}

export const PillsNoIcons: Story = {
  name: 'Pills — no icons',
  render: () => {
    const [active, setActive] = useState<number>(1)
    const cats = CATEGORIES.map(({ icon: _icon, ...c }) => c)
    return (
      <CategoryNav
        categories={cats}
        activeId={active}
        variant="pills"
        onSelect={id => setActive(id as number)}
      />
    )
  },
}

// ─────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────

export const SidebarDefault: Story = {
  name: 'Sidebar — default',
  render: () => {
    const [active, setActive] = useState<number>(1)
    return (
      <div style={{ display: 'flex', height: 280, border: '1px solid var(--color-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <CategoryNav
          categories={CATEGORIES}
          activeId={active}
          variant="sidebar"
          onSelect={id => setActive(id as number)}
        />
        <div style={{
          flex: 1, padding: 16, background: 'var(--color-bg-page)',
          fontSize: 13, color: 'var(--color-text-secondary)',
        }}>
          Active: <strong>{CATEGORIES.find(c => c.id === active)?.label}</strong>
        </div>
      </div>
    )
  },
}

export const SidebarScrollable: Story = {
  name: 'Sidebar — many categories (scrollable)',
  render: () => {
    const [active, setActive] = useState<number>(1)
    return (
      <div style={{
        display: 'flex', height: 320,
        border: '1px solid var(--color-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden',
      }}>
        <CategoryNav
          categories={CATEGORIES_LONG}
          activeId={active}
          variant="sidebar"
          onSelect={id => setActive(id as number)}
        />
        <div style={{ flex: 1, padding: 16, background: 'var(--color-bg-page)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Active: <strong>{CATEGORIES_LONG.find(c => c.id === active)?.label}</strong>
        </div>
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────────
// Side by side comparison
// ─────────────────────────────────────────────────────────────────

export const BothVariants: Story = {
  name: 'Both variants — comparison',
  render: () => {
    const [active, setActive] = useState<number>(1)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 6 }}>
            pills — QR / online
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <CategoryNav categories={CATEGORIES} activeId={active} variant="pills" onSelect={id => setActive(id as number)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 6 }}>
              sidebar — kiosk portrait
            </div>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 240 }}>
              <CategoryNav categories={CATEGORIES} activeId={active} variant="sidebar" onSelect={id => setActive(id as number)} />
            </div>
          </div>
        </div>
      </div>
    )
  },
}
