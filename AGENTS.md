# Octaraa Admin — Agent Guide

React 19 + Vite + TypeScript + Tailwind v4 admin console for the Octaraa wealth platform.
Read this file before changing anything. Keep it updated when conventions change.

## Commands

| Command            | Purpose                                                   |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Vite dev server on http://localhost:5173                  |
| `npm run validate` | typecheck + lint + format check — must pass before commit |
| `npm run lint:fix` | oxlint autofix                                            |
| `npm run format`   | prettier write                                            |
| `npm run build`    | `tsc -b && vite build`                                    |

Node >= 20 (see `.nvmrc`), npm only. Husky runs lint-staged on commit.

## Folder map

```
src/
  api/          one module per backend domain (auth.ts, clients.ts, …). ONLY place that talks to data.
  assets/       logos (logo.svg, logo-light.svg, logo-mark.svg)
  components/
    ui/         generic primitives: Button, Input, Select, DataTable, Modal, Tabs, … (Tailwind + Radix)
    common/     app-aware shared pieces: PageHeader, states (Empty/Error/Offline), Toaster, FormError,
                Monogram (AMC/bank initials), RiskBadge, ReturnValue (signed % colouring)
  config/       env.ts (VITE_* vars), navigation.ts (sidebar items + breadcrumb labels)
  features/     one folder per flow: auth, dashboard, clients, transactions, explore
    <feature>/pages/       route components (default export, lazy loaded from App.tsx)
    <feature>/components/  feature-only components
  hooks/        useQuery, useMutation, useDebouncedValue, useMediaQuery/useIsMobile, useOnline, useCountdown
  layouts/      AppLayout (auth guard + shell), Sidebar, Topbar, MobileNav, AuthLayout
  lib/          utils.ts (cn, initialsOf, downloadCsv), format.ts (dates/currency), validation.ts
  mocks/        dummy data + `mock()` helper. Delete this folder once real APIs exist.
  store/        zustand stores: auth, theme, toast, ui, queryCache
  types/        domain types, one file per domain, re-exported from types/index.ts
```

## Data layer — how to replace mocks with real APIs

Every `src/api/<domain>.ts` exports plain async functions. Today they return `mock(data)`:

```ts
import { mock } from '@/mocks'
import { clients } from '@/mocks/clients'

export const clientsApi = {
  list: (request: ListRequest) => mock(paginate(clients, request.page, request.limit)),
}
```

To wire a real endpoint, replace the body with the axios client and keep the signature:

```ts
import { api } from '@/api/client'

export const clientsApi = {
  list: (request: ListRequest) =>
    api.get<Paginated<Client>>('/admin/clients', { params: request }).then((r) => r.data),
}
```

Nothing in `features/` changes. When all modules are wired, delete `src/mocks/`.

Mock behaviours to remember while the backend is not wired: any email/password logs in (`wrong` fails), OTP is
`123456` everywhere, bank account numbers ending in `0000` fail verification, and in-memory writes (onboarded
clients, cancelled orders, mandates) reset on reload.

Auth: `store/auth.ts` persists the bearer token in `localStorage` (`octaraa-auth`) for the mock. When the real
backend lands, prefer an HttpOnly session cookie and keep `token` out of the persisted state (`persist` `partialize`).

- `api/client.ts` normalises every failure into `ApiError { status, code, message, fieldErrors, isNetworkError }`
  and logs the user out on 401. `VITE_API_BASE_URL` sets the base URL (`.env.example`).
- Reads: `useQuery(key, fetcher)` → `{ data, error, loading, refetch }`. Keys are `'<domain>:<params>'`.
- Writes: `useMutation(fn)` → `{ mutate, loading, error }`; call `useInvalidate()('<domain>')` after success.
- Show `error` with `<ErrorState error onRetry />` (pages/tables) or `<FormError error />` (forms), and
  `error.fieldErrors[name]` on the matching `<Input error>`. Use `toast.success/error` for outcomes.

## UI conventions

- Mobile first. ~90% of traffic is mobile. Build the 390px layout first, then add `md:`/`lg:` overrides.
  Tables: use `DataTable` — pass `mobileCard` to render cards under `md`, or rely on horizontal scroll with a
  `sticky` first column. Modals become bottom sheets under `sm` automatically.
- Use tokens, never raw hex: `bg-surface`, `bg-surface-raised`, `bg-surface-sunken`, `border-border`,
  `text-text-primary|secondary|muted|placeholder`, `bg-brand`, `text-accent`, `bg-success-tint text-success`, etc.
  Tokens are defined once in `src/index.css` (`:root` light, `.dark` pure-black dark theme). Dark mode must
  stay neutral black/grey — no blue-tinted surfaces.
- Type scale is fixed in `index.css`: `text-2xs` 10, `text-xs` 12, `text-sm` 13, `text-base` 14, `text-md` 16,
  `text-lg` 18, `text-xl` 20, `text-2xl` 26, `text-3xl` 38. Font is Poppins everywhere.
- Radii: `rounded-control` (10px) for inputs/buttons, `rounded-card` (12px) for cards. `card` utility = card
  surface + border + radius.
- Dates via `formatDate` (dd MMM yyyy, en-IN), `formatDateTime`, `formatMonthYear`; API date payloads via
  `toIsoDate` (local calendar date, never `toISOString().slice(0, 10)` — it shifts a day in IST). Money via `formatCurrency` / `formatCompactCurrency` (₹, Cr/L).
  Percentages via `formatPercent`. Never hand-format these.
- Search inputs use `SearchInput` (debounced 350ms). Selects use `Select` (Radix). Status pills use
  `StatusBadge` / `Badge`. Page titles use `PageHeader` (breadcrumbs derive from `config/navigation.ts`).
- Prefer `Modal`/`ConfirmModal` for dialogs, `DropdownMenu` for row actions, `Tabs` for section switching,
  `SegmentedControl` for range pickers, `Stepper` for multi-step forms.
- Icons: `lucide-react` only. Charts: `recharts` with `--color-chart-*` tokens.
- Accessibility: every icon-only button has `aria-label` (use `IconButton`). Inputs get labels via `Field`.

## Code style

- TypeScript strict, no `any`, `import type` for types. Named exports for components (pages are default exports
  for lazy loading). Props interfaces live next to the component.
- Small, readable components. Extract to `features/<x>/components/` when a page passes ~150 lines.
- No comments unless the _why_ is non-obvious. No dead code, no TODO markers.
- Formatting is Prettier (100 cols, single quotes, no semicolons). Lint is oxlint. Run `npm run validate`.

## Adding a feature checklist

1. Types in `src/types/<domain>.ts`, exported from `types/index.ts`.
2. Mock data in `src/mocks/<domain>.ts` and API functions in `src/api/<domain>.ts`.
3. Page in `src/features/<domain>/pages/`, lazy route in `src/App.tsx`, nav/breadcrumb label in `config/navigation.ts`.
4. Mobile layout verified at 390px, dark theme verified, `npm run validate` green.
