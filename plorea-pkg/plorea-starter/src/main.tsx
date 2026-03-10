import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ── 1. Plorea design tokens — must come first
import '../@plorea/components/tokens.css'

// ── 2. Tailwind base
import './index.css'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
