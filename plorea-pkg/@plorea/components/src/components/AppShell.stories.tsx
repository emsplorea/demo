import type { Meta, StoryObj } from '@storybook/react'
import { AppShell } from './AppShell'

const meta: Meta<typeof AppShell> = {
  title:     'Canonical/01 AppShell',
  component:  AppShell,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The fixed frame around every Plorea view.
Sidebar, topbar, and content area are defined here — not per-page.

**Rules:**
- Sidebar is always dark regardless of page theme
- Active nav: \`--color-primary\` left border + tinted background
- Topbar primary action: right-aligned, \`btn-primary\`
- Mobile: sidebar collapses to overlay at <768px
        `,
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    primaryAction: { control: 'text' },
    title:         { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof AppShell>

const NAV = [
  {
    label: 'Operations',
    links: [
      { id: 'orders',   label: 'Orders'   },
      { id: 'kds',      label: 'KDS'      },
      { id: 'checkout', label: 'Checkout' },
    ],
  },
  {
    label: 'Management',
    links: [
      { id: 'products', label: 'Products' },
      { id: 'reports',  label: 'Reports'  },
      { id: 'settings', label: 'Settings' },
    ],
  },
]

export const Default: Story = {
  args: {
    navGroups:     NAV,
    activeId:      'orders',
    title:         'Orders',
    primaryAction: 'New order',
    children: (
      <div style={{ padding: 8 }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Page content renders here — inside the App Shell content area.
        </p>
      </div>
    ),
  },
}

export const NoAction: Story = {
  name: 'Without primary action',
  args: {
    ...Default.args,
    title:         'Reports',
    activeId:      'reports',
    primaryAction: undefined,
  },
}

export const DeepNav: Story = {
  name: 'Active item — Settings',
  args: {
    ...Default.args,
    title:    'Settings',
    activeId: 'settings',
  },
}
