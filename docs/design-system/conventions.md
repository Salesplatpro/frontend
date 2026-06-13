# Conventions

Practical rules for adding to or modifying the design system. See
[architecture.md](./architecture.md) for the token/folder model these rules
sit on top of.

## Where new code goes

- **`src/components/ui/`** — a component goes here only if it is generic
  (no feature/domain knowledge) **and** used (or clearly reusable) across
  more than one feature area. When in doubt, leave it in `features/`; it's
  cheaper to promote a component later than to over-generalize early.
- **`src/components/forms/`** — input/field components and their thin
  Formik adapters.
- **`src/components/layout/`** — app-shell chrome: navbars, footers, menus,
  sidebars, page headers.
- **`src/components/routing/`** — routing guards/utilities.
- **`src/components/features/<domain>/`** — everything else, grouped by
  domain (`landing`, `jobs`, `talent`, `recruiter`, `shared`). `shared/` is
  for code used across multiple feature domains that is still too
  domain-flavored for `ui/`.
- Components imported from more than one page should be exported through
  the nearest barrel (`index.ts`) so call sites import from the folder, not
  a deep path.

## Component API conventions

- **Function components** with named exports (`export const Button = ...`),
  not default exports, except where a file already used a default export
  pattern consistently (some `forms/` and `features/` files) — don't mix
  styles within a file.
- **`forwardRef` + `ComponentPropsWithoutRef<'element'>`** for components
  that wrap a native element and may need a ref (see `ui/Button`):
  ```tsx
  type ButtonProps = {
    variant?: ButtonVariant
    size?: ButtonSize
  } & ComponentPropsWithoutRef<'button'>

  export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', className, ...rest }, ref) => (
      <button ref={ref} className={cn(styles.button, styles[variant], styles[size], className)} {...rest} />
    ),
  )
  Button.displayName = 'Button'
  ```
- **Variant/size props are string unions with sensible defaults**
  (`variant?: 'primary' | 'secondary' | 'outline' = 'primary'`), mapped to
  SCSS module classes by name: `styles[variant]`, `styles[size]`. Add a new
  variant by adding the union member and the matching class — never branch
  with conditionals on variant.
- **`className` is always merged last** via `cn(...)` (the `classnames`
  package, imported as `cn`) so consumers can override/extend styles:
  `cn(styles.root, styles[variant], className)`.
- **Native event handler signatures** — `onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void`,
  not custom callback shapes, so components work as direct Formik field
  adapters.
- **Polymorphic `as` prop** only where genuinely needed (see `ui/Typography/Text`'s
  `as?: 'div' | 'p' | 'span'`) — don't add it speculatively.

## Styling conventions

- **SCSS Modules** (`Component.module.scss`) for component-local styles;
  Tailwind utility classes for layout/spacing in page-level JSX. Don't mix
  a SCSS module's responsibility with inline Tailwind for the same concern
  (e.g. don't set color via Tailwind on a component that also sets color in
  its module).
- **All colors come from tokens.** Never write a new hex literal:
  - In SCSS: `color: var(--color-text-heading)`, not `color: #101828`.
  - In Tailwind: `text-primary`, `bg-grey-50`, `border-grey-300`, etc. —
    these resolve to the same `var(--*)` tokens. Don't use
    `text-[#4985df]`-style arbitrary values for a color that already has a
    token.
  - In inline style objects: `{ color: 'var(--color-grey-900)' }`.
  - **Exception**: a handful of genuinely one-off colors (social-brand
    colors, illustration accents, etc.) remain literal — see
    [migration.md](./migration.md). If you need one of those exact colors
    again, reuse the existing literal rather than re-deriving it, and
    consider whether it now warrants its own token.
- **SCSS color functions** (`color.adjust`, `darken`, `lighten`, `mix`,
  `scale-color`) cannot operate on `var()` CSS custom properties. If a
  derived color is needed, keep a local Sass variable with the literal
  value next to the function call (see
  `landingPageComponents/styles/_mixins.scss` /
  `LandingNavbar.module.scss`) and comment why it can't be a token.
- **Spacing/sizing**: prefer the `--space-*` scale (via Tailwind's spacing
  utilities, which already map to a 4px grid) over arbitrary pixel values
  for new code. Existing arbitrary sizing values were left alone in the
  cleanup — not a priority, but don't add more.
- **Z-index**: use the registry in `tokens.css` / architecture.md. Never
  invent a new ad-hoc z-index.

## Typography

Use `ui/Typography`'s `Heading` (level 1–6, maps to `h1`–`h6` with
token-driven size/weight/line-height) and `Text` (size/color/weight/`as`)
for new headings and body copy instead of raw `<h1>`/`<p>` with Tailwind
font utilities. `Text`'s `size` prop (`fs-xs`…`fs-5xl`) is responsive
(shrinks at the existing breakpoints) — prefer it over fixed pixel font
sizes.

## Empty/error states

- Use `ui/EmptyState` for any list/table that can render zero items —
  don't silently render nothing. Provide a `title`, and a `description`
  and/or `action` when there's a clear next step for the user.
- Use `ui/ErrorState` (`DisplayError`) for full-section error states.

## Testing

New `ui/` and `forms/` components should have a colocated
`Component.test.tsx` (Vitest + Testing Library) covering: renders children,
default variant/size, a non-default variant applies its class, `className`
passthrough, and `ref` forwarding where applicable. `afterEach(cleanup)` is
already wired in `src/test/setup.ts` (vitest globals are disabled).

## Storybook

Every `ui/` and `forms/` component should have a story in `stories/ui/` or
`stories/forms/` covering its variants/states (see existing stories for the
pattern). Stories import via the `@/` alias, same as application code.
Components that depend on Formik context (`PhoneNumberInput`,
`RadioFieldGroup`) wrap their story in a `<Formik>` decorator with sensible
`initialValues` and a no-op `onSubmit`.

## No new headless-UI dependencies

Per the original cleanup decision: complex interactive components (Modal,
Drawer, Tabs, Tooltip, Select, etc.) are built fully custom — no Radix,
Headless UI, or similar libraries. If a future component needs this kind of
behavior, build it in `ui/` following the conventions above; don't add a
new dependency without revisiting this decision.
