import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { OrderCard } from './OrderCard'

const meta: Meta<typeof OrderCard> = {
  title:     'Canonical/03 OrderCard',
  component:  OrderCard,
  tags:      ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Compact single-order card for POS, KDS, and mobile views.
State drives visual treatment — not ad-hoc styles.

**Rules:**
- Card width: 240–320px, never full-width except on mobile
- State border: new=primary, in-progress=warning, ready=success, error=error
- Max 6 item rows before +N more collapse
- Processing state: \`pulse-subtle\` animation — no spinner
- Primary action: min 44×44px touch target
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['new', 'in-progress', 'ready', 'done', 'error'],
    },
    channel: {
      control: 'select',
      options: ['table', 'takeaway', 'eatin', 'combo'],
    },
  },
}

export default meta
type Story = StoryObj<typeof OrderCard>

const ITEMS_SHORT = [
  { name: 'Margherita',  quantity: 2, modifiers: ['Extra cheese'] },
  { name: 'Tiramisu',    quantity: 1 },
  { name: 'Sparkling water', quantity: 2 },
]

const ITEMS_LONG = [
  { name: 'Margherita',      quantity: 2, modifiers: ['Extra cheese', 'No garlic'] },
  { name: 'Tiramisu',        quantity: 1 },
  { name: 'Caesar Salad',    quantity: 1, modifiers: ['Dressing on side'] },
  { name: 'Sparkling water', quantity: 2 },
  { name: 'Espresso',        quantity: 2 },
  { name: 'Chocolate cake',  quantity: 1 },
  { name: 'Lemonade',        quantity: 3 },
]

// ── Default — New
export const Default: Story = {
  args: {
    id:           '2041',
    channel:      'table',
    channelLabel: 'Table 4',
    time:         '12:34',
    status:       'new',
    total:        'kr 348',
    items:        ITEMS_SHORT,
    actionLabel:  'Accept',
    onAction:     (id) => alert(`Accept ${id}`),
  },
}

// ── Interactive — advances through states
export const Interactive: Story = {
  name: 'Interactive (advances state)',
  render: () => {
    const STATES   = ['new', 'in-progress', 'ready', 'done'] as const
    const LABELS   = { new: 'Accept', 'in-progress': 'Ready', ready: 'Collect', done: '' }
    const [idx, setIdx] = useState(0)
    const status = STATES[idx]
    return (
      <OrderCard
        id="2044"
        channel="eatin"
        channelLabel="Eat-in"
        time="12:38"
        status={status}
        total="kr 284"
        items={ITEMS_SHORT}
        actionLabel={LABELS[status]}
        onAction={() => setIdx(i => Math.min(i + 1, STATES.length - 1))}
      />
    )
  },
}

// ── All four states — grid
export const AllStates: Story = {
  name: 'All states',
  parameters: {
    docs: {
      description: { story: 'Visual reference — all four active states.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['new', 'in-progress', 'ready', 'error'] as const).map(status => (
        <OrderCard
          key={status}
          id={`20${status}`}
          channel="table"
          channelLabel="Table 4"
          time="12:34"
          status={status}
          total="kr 348"
          items={ITEMS_SHORT}
          actionLabel={status === 'error' ? 'Retry' : status === 'ready' ? 'Collect' : status === 'in-progress' ? 'Ready' : 'Accept'}
          onAction={() => {}}
        />
      ))}
    </div>
  ),
}

// ── All channels
export const AllChannels: Story = {
  name: 'All channels',
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(
        [
          { channel: 'table',    label: 'Table 4'  },
          { channel: 'takeaway', label: 'Takeaway' },
          { channel: 'eatin',    label: 'Eat-in'   },
          { channel: 'combo',    label: 'Combo'    },
        ] as const
      ).map(({ channel, label }) => (
        <OrderCard
          key={channel}
          id={`20${channel}`}
          channel={channel}
          channelLabel={label}
          time="12:34"
          status="new"
          total="kr 189"
          items={ITEMS_SHORT}
          actionLabel="Accept"
          onAction={() => {}}
        />
      ))}
    </div>
  ),
}

// ── Long item list with collapse
export const LongList: Story = {
  name: 'Long item list (collapse)',
  args: {
    id:           '2099',
    channel:      'table',
    channelLabel: 'Table 8',
    time:         '12:55',
    status:       'new',
    total:        'kr 892',
    items:        ITEMS_LONG,
    actionLabel:  'Accept',
    onAction:     () => {},
  },
}

// ── Processing
export const Processing: Story = {
  name: 'Processing state',
  args: {
    ...Default.args,
    status:     'in-progress',
    processing:  true,
    actionLabel: 'Ready',
  },
}
