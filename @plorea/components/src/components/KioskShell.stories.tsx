import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { KioskShell } from './KioskShell'

const meta: Meta<typeof KioskShell> = {
  title:     'Canonical/10 KioskShell',
  component:  KioskShell,
  tags:      ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Wraps a kiosk surface with idle screen + dine choice flow.

**State machine:**
- \`idle=true\` → idle screen with "Spis her" / "Ta med" buttons
- user picks → \`onDineChoice\` fires → shell renders children

**Rules:**
- Dine choice buttons: min 120×120px touch target
- Idle screen: full white, centred, no scroll
- Watermark: absolute bottom-centre
- No idle timeout — belongs in app layer
- \`defaultIdle={false}\` skips idle (useful in dev/test)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof KioskShell>

// ── Menu placeholder
function MenuPlaceholder({ dineType }: { dineType?: string }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-page)', gap: 12,
    }}>
      <div style={{ fontSize: 40 }}>🍔</div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>
        Meny — {dineType === 'here' ? 'Spis her' : 'Ta med'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
        Menu surface rendered here
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Default — starts on idle screen
// ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  name: 'Default — idle → menu',
  render: () => {
    const [dineType, setDineType] = useState<string | undefined>(undefined)
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <KioskShell
          defaultIdle={true}
          onDineChoice={type => setDineType(type)}
        >
          <MenuPlaceholder dineType={dineType} />
        </KioskShell>
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────────
// Active — no idle screen
// ─────────────────────────────────────────────────────────────────
export const Active: Story = {
  name: 'Active — no idle',
  render: () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <KioskShell defaultIdle={false}>
        <MenuPlaceholder dineType="here" />
      </KioskShell>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Pass `defaultIdle={false}` to skip idle (e.g. in dev builds or test suites).' },
    },
  },
}

// ─────────────────────────────────────────────────────────────────
// Custom brand name
// ─────────────────────────────────────────────────────────────────
export const CustomBrand: Story = {
  name: 'Custom brand name',
  render: () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <KioskShell defaultIdle={true} brandName="Demo Burger">
        <MenuPlaceholder />
      </KioskShell>
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────
// Kiosk portrait frame (520px wide)
// ─────────────────────────────────────────────────────────────────
export const KioskPortraitFrame: Story = {
  name: 'Kiosk portrait frame — 520px',
  render: () => {
    const [dineType, setDineType] = useState<string | undefined>(undefined)
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        background: '#111',
      }}>
        <div style={{
          width: 520, height: 760,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <KioskShell
            defaultIdle={true}
            onDineChoice={type => setDineType(type)}
          >
            <MenuPlaceholder dineType={dineType} />
          </KioskShell>
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Portrait kiosk hardware frame (520×760px). Tap a dine type button to advance to the menu surface.',
      },
    },
  },
}
