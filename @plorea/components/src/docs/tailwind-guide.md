# Tailwind + Plorea tokens

Plorea Design System v3.3

Dette er den vanligste kilden til forvirring for nye utviklere: **når bruker
jeg Tailwind-klasser, og når bruker jeg CSS-variabler?**

Kortsvar:
- **Tailwind** → layout, spacing, typography-størrelse, breakpoints
- **`var(--color-*)`** → alle farger i komponent-kode
- **Tailwind fargehjelpere** → kun i applikasjonssjiktet (sider, layout)

---

## Konfigurasjon

Din app arver Plorea sin Tailwind-konfig:

```js
// tailwind.config.js i appen din
module.exports = require('./@plorea/components/tailwind.config.js')
```

Eller extend den:

```js
const plorea = require('./@plorea/components/tailwind.config.js')

module.exports = {
  ...plorea,
  content: [
    './src/**/*.{ts,tsx}',
    '../@plorea/components/src/**/*.{ts,tsx}',  // ← husk komponenter
  ],
}
```

---

## Hva Tailwind-konfigurasjonen gjør

`tailwind.config.js` registrerer alle Plorea-tokens som Tailwind-utilities.
Under panseret bruker de `var()` — de fungerer med dark mode.

```css
/* Generert av Tailwind fra config */
.text-plorea-primary    { color: var(--color-text-primary) }
.bg-plorea-surface      { background-color: var(--color-surface) }
.border-plorea          { border-color: var(--color-border) }
```

---

## Bruk i praksis

### I komponent-kode → bruk `var()` i `style`-prop

```tsx
// ✅ Riktig — fungerer i dark mode, ingen Tailwind-avhengighet
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    new:       { bg: 'var(--color-selection)',  text: 'var(--color-accent)' },
    preparing: { bg: 'var(--color-warning-bg)', text: '#8a7a20' },
    ready:     { bg: 'var(--color-success-bg)', text: '#1a5c3a' },
  }
  return (
    <span style={{
      background: colors[status]?.bg,
      color:      colors[status]?.text,
      borderRadius: 'var(--r-full)',
      padding: '3px 10px',
      fontSize: 11, fontWeight: 700,
    }}>
      {status}
    </span>
  )
}

// ❌ Feil — bryter dark mode fordi Tailwind-klassen er statisk ved build-tid
<span className="bg-blue-100 text-blue-800">status</span>
```

### I applikasjonssjiktet → Tailwind-klasser er OK for layout

```tsx
// ✅ Layout, spacing, typography-størrelse — bruk Tailwind
<div className="grid grid-cols-3 gap-4 p-6">
  <div className="flex items-center justify-between mt-2">
    <span className="text-sm font-semibold">Ordre</span>
  </div>
</div>

// ✅ Plorea fargehjelpere i applikasjonssjiktet — OK
<div className="bg-plorea-surface border border-plorea rounded-xl p-4">
```

---

## Tilgjengelige Tailwind-fargehjelpere

Fra `tailwind.config.js`:

```
Tekst:
  text-plorea-primary      → var(--color-text-primary)
  text-plorea-secondary    → var(--color-text-secondary)
  text-plorea-muted        → var(--color-text-muted)
  text-plorea-link         → var(--color-text-link)
  text-plorea-accent       → var(--color-accent)

Bakgrunn:
  bg-plorea-page           → var(--color-bg-page)
  bg-plorea-surface        → var(--color-surface)
  bg-plorea-hover          → var(--color-surface-hover)
  bg-plorea-selection      → var(--color-selection)
  bg-plorea-primary        → var(--color-primary)

Kant:
  border-plorea            → var(--color-border)
  border-plorea-strong     → var(--color-border-strong)
  border-plorea-focus      → var(--color-border-focus)

Status:
  bg-plorea-success        → var(--color-success)
  bg-plorea-success-bg     → var(--color-success-bg)
  bg-plorea-warning        → var(--color-warning)
  bg-plorea-error          → var(--color-error)
```

---

## Dark mode

Dark mode aktiveres ved å legge `.dark`-klasse på `<html>`:

```ts
document.documentElement.classList.toggle('dark')

// eller med useDarkMode-hook:
import { useDarkMode } from '@plorea/components'
const { toggle } = useDarkMode()
```

Tailwind sin `dark:` modifier fungerer **ikke** med Plorea sitt token-system
— vi bruker CSS-klasse-basert dark mode, ikke media-query-basert.

```tsx
// ❌ Fungerer ikke med Plorea
<div className="bg-white dark:bg-gray-900">

// ✅ Fungerer alltid
<div style={{ background: 'var(--color-surface)' }}>
```

---

## Density

Density styres via `data-density` på container-elementet. Komponentene
arver den via CSS.

```tsx
// Manuelt
<div data-density="compact">
  <OrderTable rows={rows} />
</div>

// Via useDensity-hook (anbefalt)
import { useDensity } from '@plorea/components'
const { density, setDensity, containerProps } = useDensity()

<div {...containerProps}>  {/* setter data-density automatisk */}
  <OrderTable density={density} />
</div>
```

| Modus | Rad-høyde | Bruk |
|-------|-----------|------|
| `comfortable` | 56px | Standard (dashboard, admin) |
| `compact` | 44px | Side-ved-side paneler, KDS prep |
| `ultra` | 36px | Utskrift, høy-volum rapporter |
