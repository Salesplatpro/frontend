# Auxhr Design System

Reusable marketing UI tokens and primitives for Auxhr.

**Agents must always read this file** before landing/marketing UI work, and must
use these tokens and primitives instead of the old design system, theme, or
color palette (`src/styles/tokens.css`, legacy landing SCSS modules, ad-hoc hex).

## Location

Canonical app copy: `frontend/design_system/`  
Repo artifact / source: `design_system/` (monorepo root)

```
design_system/
  tokens/           # colors, typography, spacing, effects
  primitives/       # buttons, pills, chips, cards, …
  components/       # how-it-works and composed CSS
  landing-page/     # visual source artifact (HTML)
  primitives.html
  AGENTS.md
```

## Landing page

Visual source: `landing-page/index.html`  
React implementation: `frontend/src/LandingPage.tsx` +  
`frontend/src/components/features/landing/landingPageComponents/`

Do **not** serve the HTML artifact as `/`.

After replacing code implementing something new (or any) UI, **always remove orphans** — unused
components, styles, exports, and dead imports.

## Brand rules

- Colors only from `tokens/colors.css` semantic vars (`--color-*`).
- No yellow / lime / terracotta accents.
- Theme via `data-theme="light|dark"` on **`.landing-root` only** (never `<html>`).
- Apply this system to the landing page; do not restyle other routes unless asked.
- Tokens/resets must be scoped under `.landing-root` so login, signup, solutions, pricing, privacy, and terms keep `src/styles/tokens.css`.

## Primitives

Prefer classes from `primitives/` and `components/` (e.g. `ds-btn`, `ds-pill`,
`ds-card`, `ds-how`, `ds-chip`). Extend tokens before inventing new hex values.
