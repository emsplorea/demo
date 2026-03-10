# Pattern: Table Interactions

Plorea Design System v3.3

`OrderTable` is used on admin dashboards and KDS prep views. This pattern defines how it behaves — selection model, density, pagination, and actions — so that every team builds it the same way.

---

## Selection model

Single-row selection via `selectedId` + `onRowSelect`. There is no multi-select.

Rationale: bulk operations on orders are almost never needed. When they are (e.g. bulk mark-as-complete after a busy period), they are handled via the action menu on a filtered view — not via checkboxes on individual rows. Checkboxes add cognitive noise to a surface that staff scan at speed.

```tsx
<OrderTable
  rows={rows}
  selectedId={selectedOrderId}
  onRowSelect={id => setSelectedOrderId(id)}
  onRowClick={id => openOrderDetail(id)}
/>
```

`onRowSelect` fires when the row checkbox area is clicked. `onRowClick` fires when anywhere else on the row is clicked. They can be the same handler or different — `onRowSelect` is for selection state, `onRowClick` is for navigation/detail.

---

## Density modes

```
comfortable  — 56px row height, 16px vertical gap  — default
compact      — 44px row height, 12px vertical gap  — side-by-side panels
ultra        — 36px row height,  8px vertical gap  — print view, high volume
```

Density is set at the container level:
```html
<div data-density="compact">
  <OrderTable ... />
</div>
```

Or via the `density` prop directly on `OrderTable` when controlled externally:
```tsx
<OrderTable density="compact" showDensityToggle onDensityChange={setDensity} />
```

Do not set density per-row or per-column. Density is a layout concern, not a data concern.

---

## Column overflow

Long text in cells **always truncates** with `text-overflow: ellipsis`. Tables never expand column widths to fit content. Column widths are fixed (px) or proportional (flex) — never `auto` on a live data table.

A truncated cell should have `title={fullText}` on the cell element so the full value appears on hover.

---

## Empty state

Every table requires `emptyMessage`. Never render a blank table.

```tsx
<OrderTable
  rows={[]}
  emptyMessage="Ingen bestillinger ennå"
  emptyAction={{ label: "Legg til produkt", onClick: openMenu }}
/>
```

If there is a recoverable action, provide it. If the empty state is expected (e.g. no orders between shifts), the message should say so: "Ingen bestillinger i dette tidsrommet."

---

## Pagination

`OrderTable` supports server-side pagination via `page`, `totalPages`, and `onPageChange`. The component renders page controls — the data fetching is the caller's responsibility.

```tsx
<OrderTable
  rows={pageRows}
  totalRows={totalCount}
  page={currentPage}
  totalPages={pageCount}
  onPageChange={setPage}
/>
```

Do not pass all rows at once and paginate client-side. Large tables (> 200 rows) must be paginated server-side.

---

## Row actions

Row-level actions appear on hover or as a trailing cell. Use sparingly — maximum three actions per row.

```tsx
const actions = [
  { label: 'Se detaljer', onClick: id => openDetail(id) },
  { label: 'Merk ferdig', onClick: id => markComplete(id) },
]
<OrderTable rows={rows} actions={actions} />
```

Destructive actions (void, cancel) must open a confirmation dialog — never execute on direct tap.
