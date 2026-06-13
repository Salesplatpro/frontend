# Design System Architecture

This document describes how the frontend's design tokens, component
structure, and theming mechanism fit together after the architecture
cleanup. It is descriptive, not aspirational — everything here exists in
the codebase today.

## Token layers

All design values live in `src/styles/tokens.css` as CSS custom properties
on `:root`. There are two layers:

1. **Primitives** — raw values named by scale, e.g. `--color-brand-500`,
   `--color-grey-300`, `--space-4`, `--text-lg`. Primitives are never
   referenced directly from components or pages.
2. **Semantic** — purpose-named aliases that reference primitives, e.g.
   `--color-primary: var(--color-brand-500)`, `--color-text-heading`,
   `--color-border`, `--color-bg-subtle`. Components, SCSS modules, and the
   Tailwind theme consume semantic tokens (or primitives where no semantic
   alias exists yet, e.g. `--color-grey-900` used directly for headings).

Token categories in `tokens.css`:

- **Color** — brand scale, grey scale, status colors (danger/accent/success/info),
  semantic text/background/border/focus colors.
- **Typography** — `--font-heading` / `--font-body` / `--font-accent`,
  `--text-xs` … `--text-4xl`, `--leading-*`, `--weight-*`.
- **Spacing** — 4px-based scale, `--space-1` … `--space-16`.
- **Radii** — `--radius-sm` … `--radius-full`.
- **Shadows** — `--shadow-sm` / `--shadow-md` / `--shadow-lg` / `--shadow-glow`
  (ported from the old `tailwind.config.js` custom box shadows).
- **Z-index** — a registry of layering values (see below).
- **Motion** — `--duration-*` and `--ease-*`.

## How tokens reach components

- **SCSS modules** reference tokens directly: `color: var(--color-text-heading)`.
- **Tailwind** is wired to the same tokens via `tailwind.config.js`
  `theme.extend.colors` (e.g. `primary`, `grey.900`, `danger`, `accent`,
  `success`, `info`, `brand.*`) and `boxShadow`/`zIndex` extensions. A class
  like `text-primary` or `bg-grey-50` resolves to `var(--color-primary)` /
  `var(--color-grey-50)` — there is no second source of truth for color
  values.
- **`src/index.scss`** Sass variables that used to hold literal hex values
  now reference `var(--*)` tokens, except where a Sass color function
  (`color.adjust`, `darken`, etc.) needs a literal value to operate on —
  those stay as local Sass variables (see Conventions).

## Theming (dark mode)

`tokens.css` is structured so theming is **architectural but not yet
designed**:

- `:root` sets `color-scheme: light` so native UA controls (scrollbars,
  form widgets) don't flip to dark for users with a dark OS preference,
  since no dark palette exists yet.
- `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }`
  overrides the *semantic* tokens (never primitives) for users whose OS
  prefers dark. Today these overrides mirror the light values 1:1 — they
  exist so a future dark palette only needs to change values inside this
  block.
- `[data-theme='dark'] { ... }` is an explicit override hook for a future
  manual theme toggle (e.g. setting `data-theme="dark"` on `<html>`). It
  also currently mirrors light.

When a real dark palette is designed, only these two blocks (plus the
primitive values they reference) need new values — component code does not
change, because components only ever consume semantic tokens.

## Folder structure

```
src/components/
  ui/          generic, reusable, token-driven primitives
    Badge/      StatusBadge, CountBadge
    Button/     single Button (variant + size)
    EmptyState/ empty list/table placeholder
    ErrorState/ DisplayError
    Spinner/    single Spinner (size + fullPage)
    Typography/ Heading (h1-h6) + Text (size/color/weight/as)
    Uploader/
  forms/       form inputs and field wrappers
    Roles/      role-select variants
    CheckBox, PhoneNumberInput, RadioFieldGroup, RichTextEditor,
    SearchBox, SelectItem, TextField, TextInput
  layout/      app shell — Navbar, Footer, Menu, sidebar/, PageHeaderTitle,
               lists/
  routing/     ProtectedRoute
  features/    feature-scoped UI, grouped by domain
    landing/   marketing site sections
    jobs/      job browsing/detail components shared across talent+recruiter
    talent/    talent-dashboard-only components
    recruiter/ recruiter-dashboard-only components
    shared/    cross-feature pieces (global/, ShareOption)
  index.ts     re-exports ui/ + forms/ + layout/ (features import directly)
```

**Where new code goes:** see [conventions.md](./conventions.md).

## Z-index registry

`tokens.css` documents the layering contract:

| Token | Value | Notes |
|---|---|---|
| `--z-sticky` | 100 | sticky headers/columns |
| `--z-dropdown` | 1000 | menus, popovers |
| `--z-drawer` | 1200 | slide-out panels |
| `--z-modal` | 1400 | above MUI's `Modal` (1300) |
| `--z-tooltip` | 1500 | |
| `--z-toast` | 9999 | matches `react-toastify` default |

New overlay layers must pick a value consistent with this table rather than
inventing ad-hoc numbers — MUI components default to 1300 and
`react-toastify` to 9999, and both are baked into this registry so future
overlays don't collide with them.

## Documentation (Storybook)

Component documentation lives in Storybook, with stories **outside**
`src/` in the top-level `stories/` directory (mirroring `src/components/ui`
and `src/components/forms`), importing components via the `@/` alias:

```
stories/
  tokens.stories.tsx   color/spacing/type-scale/shadow/radius swatches
  ui/*.stories.tsx
  forms/*.stories.tsx
```

Run `yarn storybook` for the dev server or `yarn build-storybook` for a
static build (output: `storybook-static/`, gitignored). Storybook is not
part of the Husky pre-push gate.
