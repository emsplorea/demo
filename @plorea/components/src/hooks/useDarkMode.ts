/**
 * useDarkMode — Plorea Design System v2.8
 *
 * Toggles the `dark` class on <html>, persists to localStorage,
 * and respects prefers-color-scheme on first load.
 *
 * Usage:
 *   const { dark, toggle } = useDarkMode()
 *   <button onClick={toggle}>{dark ? '☀️' : '🌙'}</button>
 */

import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('plorea-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const html = document.documentElement
    // Add transition class for smooth crossfade
    html.classList.add('theme-transition')
    html.classList.toggle('dark', dark)
    localStorage.setItem('plorea-theme', dark ? 'dark' : 'light')
    // Remove transition class after animation completes
    const t = setTimeout(() => html.classList.remove('theme-transition'), 250)
    return () => clearTimeout(t)
  }, [dark])

  return {
    dark,
    toggle: () => setDark(d => !d),
    setDark,
  }
}
