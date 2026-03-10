/**
 * useDensity — Plorea Design System v2.8
 *
 * Manages the density mode for a table or list container.
 * Sets CSS custom properties via data-density attribute.
 *
 * Usage:
 *   const { density, setDensity, containerProps } = useDensity('comfortable')
 *   <div {...containerProps}>
 *     <OrderTable density={density} />
 *   </div>
 */

import { useState } from 'react'

export type DensityMode = 'comfortable' | 'compact' | 'ultra'

const DENSITY_TOKENS: Record<DensityMode, { rowH: string; rowGap: string; cellPy: string }> = {
  comfortable: { rowH: '56px', rowGap: '16px', cellPy: '14px' },
  compact:     { rowH: '44px', rowGap: '12px', cellPy: '10px' },
  ultra:       { rowH: '36px', rowGap:  '8px', cellPy:  '7px' },
}

export function useDensity(initial: DensityMode = 'comfortable') {
  const [density, setDensity] = useState<DensityMode>(initial)
  const tokens = DENSITY_TOKENS[density]

  return {
    density,
    setDensity,
    /** Spread onto the container element to activate density CSS tokens */
    containerProps: {
      'data-density': density,
      style: {
        '--row-h':   tokens.rowH,
        '--row-gap': tokens.rowGap,
        '--cell-py': tokens.cellPy,
      } as React.CSSProperties,
    },
  }
}
