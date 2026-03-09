import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { OrderTable } from './OrderTable'
import type { OrderRow } from './OrderTable'

const meta: Meta<typeof OrderTable> = {
  title:     'Canonical/02 OrderTable',
  component:  OrderTable,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Primary operational list for order management. Drives every back-office and POS order view.

**Rules:**
- Row height follows \`--row-h\` density token — never hardcoded
- Order IDs: monospace, \`--color-accent\`
- Selected row: \`--color-selection\` bg + left border
- Row actions: right-aligned, visible on hover only, max 3
- Empty state: centred message + optional CTA
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof OrderTable>

const ALL_ROWS: OrderRow[] = [
  { id: '2041', channel: 'table',    channelLabel: 'Table 4',  items: 3, status: 'ready',       total: 'kr 284', time: '12:34' },
  { id: '2040', channel: 'takeaway', channelLabel: 'Takeaway', items: 1, status: 'in-progress', total: 'kr 89',  time: '12:31' },
  { id: '2039', channel: 'eatin',    channelLabel: 'Eat-in',   items: 5, status: 'new',          total: 'kr 512', time: '12:28' },
  { id: '2038', channel: 'combo',    channelLabel: 'Combo',    items: 2, status: 'done',         total: 'kr 175', time: '12:19' },
  { id: '2037', channel: 'table',    channelLabel: 'Table 2',  items: 4, status: 'error',        total: 'kr 340', time: '12:11' },
]

// ── Default — all channels + statuses
export const Default: Story = {
  args: {
    rows:       ALL_ROWS,
    totalRows:  ALL_ROWS.length,
  },
}

// ── With row selection
export const WithSelection: Story = {
  name: 'Row selection',
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string | undefined>('2041')
    return (
      <OrderTable
        {...args}
        selectedId={selectedId}
        onRowSelect={row => setSelectedId(row.id)}
      />
    )
  },
  args: { rows: ALL_ROWS },
}

// ── Row actions
export const WithActions: Story = {
  name: 'Row actions (hover to reveal)',
  args: {
    rows: ALL_ROWS,
    actions: [
      { icon: '✎', label: 'Edit',   onClick: (row) => alert(`Edit ${row.id}`) },
      { icon: '✕', label: 'Cancel', onClick: (row) => alert(`Cancel ${row.id}`) },
    ],
  },
}

// ── Density toggle
export const DensityToggle: Story = {
  name: 'Density toggle',
  args: {
    rows:             ALL_ROWS,
    showDensityToggle: true,
  },
}

// ── Pagination
export const Paginated: Story = {
  name: 'With pagination',
  args: {
    rows:       ALL_ROWS,
    totalRows:  48,
    page:       2,
    totalPages: 8,
  },
}

// ── Empty state
export const Empty: Story = {
  name: 'Empty state',
  args: {
    rows:         [],
    emptyMessage: 'No active orders',
    emptyAction:  { label: 'New order', onClick: () => {} },
  },
}

// ── All statuses at once (reference)
export const AllStatuses: Story = {
  name: 'All statuses',
  parameters: {
    docs: {
      description: {
        story: 'One row per status — use as a visual reference.',
      },
    },
  },
  args: {
    rows: [
      { id: '001', channel: 'table', channelLabel: 'Table 1', items: 2, status: 'new',         total: 'kr 200', time: '13:00' },
      { id: '002', channel: 'table', channelLabel: 'Table 2', items: 2, status: 'in-progress', total: 'kr 200', time: '13:01' },
      { id: '003', channel: 'table', channelLabel: 'Table 3', items: 2, status: 'ready',       total: 'kr 200', time: '13:02' },
      { id: '004', channel: 'table', channelLabel: 'Table 4', items: 2, status: 'done',        total: 'kr 200', time: '13:03' },
      { id: '005', channel: 'table', channelLabel: 'Table 5', items: 2, status: 'error',       total: 'kr 200', time: '13:04' },
    ],
  },
}

// ── All channels at once (reference)
export const AllChannels: Story = {
  name: 'All channels',
  args: {
    rows: [
      { id: '010', channel: 'table',    channelLabel: 'Table 7', items: 1, status: 'new', total: 'kr 100', time: '13:10' },
      { id: '011', channel: 'takeaway', channelLabel: 'Takeaway', items: 1, status: 'new', total: 'kr 100', time: '13:11' },
      { id: '012', channel: 'eatin',    channelLabel: 'Eat-in',   items: 1, status: 'new', total: 'kr 100', time: '13:12' },
      { id: '013', channel: 'combo',    channelLabel: 'Combo',    items: 1, status: 'new', total: 'kr 100', time: '13:13' },
    ],
  },
}
