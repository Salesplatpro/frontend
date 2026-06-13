# Migration Notes

This is the running list of things the architecture cleanup deliberately
**did not** change, and why — so future work knows what's left and doesn't
re-litigate decisions that were already made.

## Remaining hardcoded colors (intentional one-offs)

The hardcoded-color sweep replaced every hex value that matched an existing
or newly-added design token with a `var(--color-*)` reference / Tailwind
token class. What's left is genuinely one-off colors — illustration
accents, status-pill backgrounds, and a few near-duplicates of token colors
that are *close but not identical* to a token (and changing them would be a
visual change, not a pure refactor).

### Tailwind arbitrary values (`text-[#...]`, `bg-[#...]`, etc.)

~90 occurrences across ~25 files. Notable repeats:

| Hex | Count | Where |
|---|---|---|
| `#434144` | ~8 | AiConfig, CreateJD, SearchTalent, LabelWithAstericks — body text color, near `--color-charcoal` (#4b4b4b) but not identical |
| `#F5F5F5` / `#E7E7E7` | 4 each | AiConfig — light panel backgrounds |
| `#A7B1B9` | 4 | Support — muted icon color |
| `#d7e8ff` / `#92bfff` | 2 each | PostJob, EditJob, AiConfig/QuestionGenerator — info-banner blues |
| `#4884DF` / `#4b82e1` | 1–2 | Pagination, Profile — near-duplicates of `--color-primary` (#4985df) |
| `#3C6FD4` | residual | a few spots still use the literal where the surrounding class list wasn't part of the swept pattern |
| `#E7E7E9` / `#e8eaee` / `#F3F6FC` | 1–4 | IndividualJob, JobsTable, JobDetail — subtle background tints |
| `#6941C6` | 2 | PricingSwitch — purple accent, no current token |
| `#241C15` / `#FF9500` / `#FFF8EF` | 1–2 | Pricing/ApplicationPipeline — warning/notice accents |

### SCSS literals

~40 occurrences across SCSS modules not touched by the sweep (because they
didn't match a token hex). Repeats: `#175cd3` / `#335bc2` (links/accents),
`#e7e7e9` / `#e7edf7` / `#f3f6fc` (tints), `#6941c6`, `#4884df`, `#4000e4`
(landing "tag" text color — also literal in `ui/Typography/Text.module.scss`'s
`.tag` class), `#3d3d4e`, plus single-use grays (`#fcfcfc`, `#eeeeee`,
`#ccc`, `#fff`).

### Inline style objects

~20 occurrences, mostly status/pill colors used in pairs (e.g.
`#175CD3`/`#EFF8FF`, `#C11574`, `#027A48`/`#edfeee`, `#7cc88f`, `#76c8bc`)
and one repeated `#333333` (5x) for MUI `sx` text colors.

**If you touch a file with one of these**: leave it as-is unless your
change is specifically about that color. If you need to reuse one of these
exact values elsewhere, copy the literal rather than introducing a new
near-duplicate — and if it starts appearing 3+ times, that's a signal it
should become a token (add it to `tokens.css` following the existing
primitive/semantic split).

## Arbitrary sizing values

Tailwind arbitrary *sizing* values (`text-[20px]`, `w-[42px]`,
`leading-[28px]`, etc.) were left alone. Some of these match the type scale
in `tokens.css` (`--text-xl` = 20px, etc.) and could become `ui/Typography`
usages or `text-xl`-style classes; most are one-off layout measurements that
aren't part of any scale. Follow-up: when touching a page, prefer
`ui/Typography` (`Text`/`Heading`) for text sizes that match the type
scale, and the Tailwind spacing scale for new layout dimensions — but no
bulk sweep is planned.

## MUI and CoreUI

- **MUI** (`@mui/material`, `@mui/icons-material`, etc.) — used in ~18
  files, mostly for `Table`/`TableCell`/`Box`/`Typography` in data-table
  heavy pages (RecruiterProfile dashboards, ApplicationPipeline) and a
  couple of form controls (`Select` via `react-select`-style wrappers).
  No exit plan exists; MUI's `Modal` z-index (1300) is accounted for in the
  `tokens.css` z-index registry so new custom overlays don't collide with
  it.
- **CoreUI** (`@coreui/coreui` CSS, `@coreui/react`) — used in 2 files.
  `main.tsx` imports `@coreui/coreui/dist/css/coreui.min.css` globally.
  Low usage; could likely be removed if/when those 2 call sites are
  rewritten with `ui/` components, but that's out of scope here.
- **`react-responsive-modal`** — used in 6 files for dialogs/confirmations.
  Per the "no new headless-UI deps" decision, any future custom `Modal` in
  `ui/` would need to either coexist with this or replace these 6 call
  sites; not attempted in this cleanup.

## Components intentionally not built

No new `Modal`, `Drawer`, `Tabs`, `Tooltip`, or `Select` were added to
`ui/` — there was nothing equivalent to consolidate *from* (existing usages
are page-specific or come from `react-responsive-modal` /
`react-tooltip` / `react-select`-family packages). If/when one of these
becomes a recurring pattern worth generalizing, build it in `ui/` following
[conventions.md](./conventions.md) — no new headless-UI dependency.

## Dark mode

`tokens.css` has the `prefers-color-scheme` / `[data-theme]` structure in
place (see [architecture.md](./architecture.md#theming-dark-mode)), but all
dark values currently mirror light. Designing an actual dark palette and
filling in those two blocks is future work; no component changes should be
needed when that happens since components only consume semantic tokens.
