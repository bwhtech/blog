---
name: BWH Lab
description: Landing pages drawn as the working tools a nonprofit office already uses, in Frappe's desk language.
colors:
  desk-blue: "oklch(0.477 0.149 253.403)"
  desk-blue-deep: "oklch(0.396 0.113 250.204)"
  blue-wash: "oklch(0.96 0.021 241.348)"
  blue-ink: "oklch(0.477 0.149 253.403)"
  focus-blue: "oklch(0.73 0.121 245.297)"
  violet-solid: "oklch(0.356 0.139 285.299)"
  violet-wash: "oklch(0.943 0.031 297.722)"
  violet-ink: "oklch(0.356 0.139 285.299)"
  live-green: "oklch(0.57 0.119 158.092)"
  green-wash: "oklch(0.965 0.03 155.987)"
  green-ink: "oklch(0.425 0.101 155.32)"
  amber-wash: "oklch(0.967 0.045 91.733)"
  amber-ink: "oklch(0.472 0.124 46.689)"
  error-red: "oklch(0.595 0.208 26.283)"
  cyan-wash: "oklch(0.96 0.029 218.179)"
  cyan-ink: "oklch(0.443 0.077 224.37)"
  pink-wash: "oklch(0.952 0.028 340.005)"
  pink-ink: "oklch(0.408 0.155 348.063)"
  paper: "oklch(1 0 0)"
  desk-grey: "oklch(0.979 0 0)"
  control-grey: "oklch(0.964 0 0)"
  hairline: "oklch(0.946 0 0)"
  rule-grey: "oklch(0.913 0 0)"
  dash-grey: "oklch(0.83 0 0)"
  ink-heading: "oklch(0.168 0 0)"
  graphite: "oklch(0.205 0 0)"
  ink-secondary: "oklch(0.341 0 0)"
  ink-lede: "oklch(0.439 0 0)"
  ink-meta: "oklch(0.52 0 0)"
typography:
  display:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.02em"
  lede:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 420
    lineHeight: 1.5
    letterSpacing: "0.02em"
  body:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 420
    lineHeight: 1.5
    letterSpacing: "0.02em"
  body-sm:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 420
    lineHeight: 1.5
    letterSpacing: "0.015em"
  control:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0.02em"
  label:
    fontFamily: "InterVar, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 420
    lineHeight: 1.15
    letterSpacing: "0.02em"
  data-kpi:
    fontFamily: "GeistMono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "34px"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "'tnum' 1, 'zero' 0"
  data:
    fontFamily: "GeistMono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0em"
    fontFeature: "'tnum' 1, 'zero' 0"
rounded:
  xs: "4px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "32px"
  section-sm: "40px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.desk-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.desk-blue-deep}"
  button-primary-lg:
    backgroundColor: "{colors.desk-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-outline-hover:
    backgroundColor: "{colors.desk-grey}"
  button-ghost:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.control-grey}"
    textColor: "{colors.ink-heading}"
  button-violet:
    backgroundColor: "{colors.violet-solid}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  chip-problem:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
    height: "32px"
  chip-problem-selected:
    backgroundColor: "{colors.blue-wash}"
    textColor: "{colors.blue-ink}"
  input:
    backgroundColor: "{colors.control-grey}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
  input-focus:
    backgroundColor: "{colors.paper}"
  panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
  badge-live:
    backgroundColor: "{colors.green-wash}"
    textColor: "{colors.green-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 8px"
    height: "24px"
  status-pill:
    backgroundColor: "{colors.control-grey}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 8px"
    height: "24px"
  tbd-chip:
    backgroundColor: "{colors.desk-grey}"
    textColor: "{colors.ink-lede}"
    rounded: "{rounded.xs}"
    padding: "1px 6px"
  switcher-link-current:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "0 10px"
    height: "28px"
---

# Design System: BWH Lab

Scope: the landing page experiments under `/lab` only (`src/pages/lab/*`, `src/components/landing/*`, `src/styles/lab.css`, `LabLayout`). The blog's own pages (posts, tags, home, `/meet`, `/train-your-team`) are out of scope and keep their own styles. Tokens are frappe-ui's semantic variables; the OKLCH values above are their light-theme resolutions, and the sidecar carries the dark ones.

## Overview

**Creative North Star: "The Programme Office"**

Each page is a working instrument from a nonprofit's own office: the programme dashboard (MIS), the beneficiary spreadsheet, the theory of change and logframe, the helpdesk request form. The visitor reads our work in a format they already fill in every week. Every instrument is drawn in Frappe's desk language: grey work surfaces, hairline-bordered panels, small-type chrome, deep-blue actions, and numbers in a monospace face. The tool's own chrome (top bar, sidebar, formula bar, sheet tabs, ticket header) is the page's navigation. It is not decoration.

The density is a working tool's density, not a brochure's: 12 to 14px chrome, 44 to 48px bars, 8 to 16px gaps inside panels. The display headline is the one loud thing in each first viewport. Colour is semantic. Blue means act or "your system", violet means training and our home, and green means live. Missing facts stay visible as dashed TBD chips, never as invented filler.

Motion explains the transformation the page argues for. Arcs draw out from Jagdalpur, the sheet resolves into a list, the results chain draws itself, and the system assembles as problems are picked. Content is visible by default. Motion only runs when a flag says it may.

**Key Characteristics:**
- Frappe desk chrome as page structure: bars, sidebars, tabs and panels at their real-tool dimensions.
- Flat panels on 1px hairlines; shadow only on things that float.
- Two accents with fixed meanings (blue action, violet training), plus green for live state only.
- Inter for words, Geist Mono for numbers, IDs, dates and formulas.
- Visible TBD chips where partner-supplied content is missing.
- Exponential ease-out motion gated by a pre-paint flag, with a reduced-motion path for every scene.

## Colors

A neutral grey desk with two semantic accents and a reserved status green, all resolved from frappe-ui tokens so light and dark flip together.

### Primary
- **Desk Blue** (`surface-blue-9`): primary buttons ("Tell us the problem", "Send request"), the intake page's field behind the app window, and the "Save visit" button inside mock apps. Text on it is always `ink-base`. In dark mode the token resolves to a light blue with dark text; the intake field alone overrides to `surface-blue-2` so it stays deep.
- **Desk Blue Deep** (`surface-blue-10`): hover state of primary buttons.
- **Blue Wash** with **Blue Ink** (`surface-blue-2`, `ink-blue-8`): selected problem chips, "Systems" offer tags, partner map pins (`surface-blue-8`), and module icons in the mock app sidebar.
- **Focus Blue** (`outline-blue-4`): the 2px focus ring on chips. `ink-blue-6` is the text caret and the inset top line of the active sheet tab.

### Secondary
- **Violet Solid** (`surface-violet-9`): the violet button variant, kept for training and AI calls to action.
- **Violet Wash** with **Violet Ink** (`surface-violet-2`, `ink-violet-8`): training, Frappe School, AI and "Member" badges; the funder strip icon tile; the home pin for Jagdalpur on the MIS map (`surface-violet-8`); learner bars (`surface-violet-7`).

### Tertiary
Status and stage colours. They are not accents, and each has one job.
- **Live Green** (`surface-green-7`): the breathing live dot and status dots for "Live" and "In use" rows. **Green Wash** with **Green Ink** (`surface-green-2`, `ink-green-8`) draws the "Live", "In use" and "Visited" badges and the sent-request check.
- **Amber Wash** with **Amber Ink** (`surface-amber-2`, `ink-amber-8`): "Due" status, the spreadsheet's header fill (`surface-amber-1` for highlighted cells), "Risk" labels, and the Problem stage.
- **Error Red** (`ink-red-5`): `#VALUE!` cells, "Not linked" notes, and the required-field asterisk.
- **Cyan Wash / Cyan Ink** and **Pink Wash / Pink Ink**: theory-of-change stages only (Outputs and Impact).

### Neutral
- **Paper** (`surface-base`): panels, cards, the app window, chips at rest, focused inputs.
- **Desk Grey** (`surface-gray-1`): sidebar and stage backdrops, spreadsheet row and column heads, sheet tabs bar, TBD chip fill.
- **Control Grey** (`surface-gray-2`): text fields, subtle buttons, status pill at rest, ghost hover.
- **Hairline** (`outline-gray-1`): every panel border, panel-header rule, divider and gridline.
- **Rule Grey** (`outline-gray-2`): outline buttons, chips, the lab switcher, sheet tab separators.
- **Dash Grey** (`outline-gray-3`): dashed TBD borders, dot-matrix map dots, hovered chip borders.
- **Ink Heading** (`ink-gray-9`): headings, KPI numerals, current navigation.
- **Graphite** (`ink-gray-8` text, `surface-gray-10` fill): control text, field text, the solid button and the current lab-switcher link.
- **Ink Secondary** (`ink-gray-7`): navigation items, chip labels, body copy in rows.
- **Ink Lede** (`ink-gray-6`): ledes and section paragraphs.
- **Ink Meta** (`ink-gray-5`, lifted): captions, field labels, KPI labels, timestamps.

### Named Rules
**The Green Means Live Rule.** Green appears only for live, in-use, visited or sent state. It never decorates, and it is never a stage colour: the theory of change draws Impact in pink so green keeps its single meaning.

**The Two Accents Rule.** Blue is action and the visitor's system; violet is training, learning, AI and our home in Jagdalpur. Amber, red, cyan and pink are status or stage signals, never a third brand accent.

**The Lifted Meta Rule.** On lab pages `ink-gray-5` is lifted to `oklch(0.52 0 0)` in light and `oklch(0.63 0 0)` in dark, past 4.5:1, by `.lab` and `.lab-chrome` in `lab.css`. It is the lightest ink for readable text; `ink-gray-4` and `ink-gray-3` are for icons and separators only.

**The Stage Palette Rule.** A results chain uses six stages in a fixed order: amber Problem, grey Inputs, blue Activities, cyan Outputs, violet Outcomes, pink Impact. Each stage uses its `-2` band, `-1` tint, `-7` dot and `-8` ink, and these colours stay inside the theory-of-change world.

## Typography

**Display Font:** InterVar (with Inter, ui-sans-serif, system-ui)
**Body Font:** InterVar (frappe-ui's regular weight is 420)
**Label/Mono Font:** GeistMono (with ui-monospace, SFMono-Regular, monospace), through the `font-data` utility

**Character:** Inter carries every word at frappe-ui's product sizes, tightened only at display size. Geist Mono marks the facts: when a reader sees mono, they are looking at a number, ID, date or formula they can check.

### Hierarchy
- **Display** (600, 36–40px on phones rising to 52–68px at `sm`/`lg`, line-height 1.03–1.05, -0.035em): the single H1 of each variant. It uses `text-wrap: balance` and a 15–18ch measure.
- **Headline** (600, 28px rising to 34px, line-height 1.12–1.15, -0.02 to -0.025em): the closing "Tell us the problem." section and the theory-of-change stage panels (`clamp(24px, 3vw, 34px)`).
- **Title** (600, 18px, -0.01em): section titles inside the MIS report.
- **Title Small** (600, 14px): panel-header titles, row names, logo wordmark.
- **Lede** (420, 16px, line-height 1.5; 17–18px at 1.6 from `sm` on MIS and theory of change): first-viewport ledes and section intros, 48–64ch.
- **Body** (420, 14px, line-height 1.5): paragraphs inside panels and the funder strip, 48–62ch. Body Small (13px) sets chips and list rows.
- **Control** (500, 14px): button labels. Large buttons step to 16px.
- **Label** (420, 12–13px): field labels, KPI labels, legends, breadcrumbs, metadata, in Ink Meta. Sentence case, never uppercase-tracked.
- **Data** (Geist Mono, 11–13px for IDs, cell refs, dates and status-bar sums; 28–34px at 500 for KPI numerals): tabular figures, slashed zero off, zero letter-spacing.

### Named Rules
**The Data Face Rule.** Geist Mono is for numbers, IDs, dates, cell references and formulas only, always with tabular figures. Words, including metadata values that are prose, stay in Inter.

**The One Loud Line Rule.** Each first viewport has one display-size line. Everything else in the chrome stays at product sizes (12–14px) so the page still reads as a tool.

## Layout

Each variant takes a real tool's frame at its real dimensions. MIS: a 14rem sticky sidebar (from `lg`) and a 48px sticky top bar over a centred 1120px column. Sheet: a title bar, a formula bar, 30px rows (28px on phones) with a 2.5rem row-number gutter, and 36px sheet tabs fixed at the bottom. Theory of change: a 56px sticky bar holding the chain in miniature, over full-width sections. Intake: a 56px ticket header and a two-column 1280px grid (`0.92fr / 1.08fr`) whose right column holds the sticky blue field.

Spacing follows the 4px Tailwind scale. Inside components the gaps are 4, 8, 12 and 16px. Panels pad 16px, or 20px from `sm`. Panel headers are 44px high, with a hairline rule under them. Sections sit 40 to 56px apart, and pages pad 12 to 24px at the sides. Copy measures sit at 48–64ch.

Breakpoints are frappe-ui's: 640, 768, 1024 and 1280px. Every scene must work at 390px. The MIS sidebar becomes a horizontal tab row under the top bar. The KPI strip goes from four columns to two by two. The spreadsheet drops to three columns. The intake page adds a "View" tray when the field scrolls out of view. The lab switcher docks at the end of the page instead of floating.

**The Real Chrome Rule.** Bars, sidebars, tabs and rows keep the dimensions of the tool they imitate (48px top bar, 14rem sidebar, 44px panel head, 30px sheet row, 36px tab bar). They are navigation that works, not ornament.

## Elevation & Depth

The system is flat. Panels sit on Paper with a 1px Hairline border. Depth comes from tonal layering: Desk Grey backdrops, Paper panels, Control Grey controls. Shadows use frappe-ui's elevation scale and appear only on things that float over the page or answer a state.

### Shadow Vocabulary
- **Raised item** (`shadow-sm`, `var(--elevation-sm)`): the current sidebar item, a focused text field, the mobile "View" tray.
- **Lifted node** (`shadow-md`, `var(--elevation-md)`): a theory-of-change chain node on hover, with a -2px lift.
- **Floating chrome** (`shadow-lg` / `shadow-xl`): the lab switcher and its menu, the chip ghost that flies into the intake window.
- **Stage panel** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 12px 32px rgb(0 0 0 / 0.05)`): theory-of-change walk panels over the tinted stage.
- **App window** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 24px 48px -12px rgb(0 0 0 / 0.35)`): the "Your system" window on the intake's blue field.

### Named Rules
**The Flat Desk Rule.** Panels are flat at rest and separated by hairlines. A shadow means the element floats above the page (switcher, app window, flying chip ghost) or answers a pointer or focus state.

## Shapes

The corners are frappe-ui's, soft and small. Buttons, inputs, nav items and icon tiles use 8px (`rounded-4`, `md`). Panels, cards, menus and large buttons use 10px (`rounded-5`, `lg`). The intake field and the theory-of-change stage panels use 12px (`rounded-6`, `xl`). Chips, badges, status pills, the switcher and the live dot are fully round (999px). The TBD chip is the one 4px shape, and its 1px dashed border sets it apart from everything finished.

Lines are 1px everywhere: hairline panel borders, gridlines, dividers, map arcs. Dashed lines mean "not yet": TBD chips and photo placeholders. Map land is a dot matrix (1.25px dots on a 7px grid) in Dash Grey.

## Components

### Buttons
Quiet, compact, product-grade.
- **Shape:** gently rounded (8px; 10px for large).
- **Primary:** Desk Blue with `ink-base` text. 32px high with 12px side padding, or 40px with 16px for first-viewport and form-submit actions. Lucide arrow icons sit 6–8px after the label.
- **Hover / Focus:** a 150ms colour transition to Desk Blue Deep, and `opacity: 0.9` on press. Focus uses frappe-ui's global `:focus-visible` outline.
- **Outline:** Paper with a Rule Grey border, darkening on hover to `outline-gray-3` over Desk Grey. It is the secondary action ("Book a call", "Talk about a portfolio").
- **Ghost:** no fill, Ink Secondary text, Control Grey on hover. Used for Export, "Start over" and tertiary links.
- **Violet:** the same shape in Violet Solid, for training or AI actions. It is in the component API but no variant uses it yet.

### Chips
- **Problem chip:** a checkbox drawn as a pill. Paper fill, Rule Grey border, Ink Secondary text, 32px high (40px for the large size). A Lucide plus turns 90° and fades to a check over 150ms when selected.
- **Selected:** Blue Wash fill, `outline-blue-3` border, Blue Ink text. It scales to 0.98 on press, and keyboard focus draws a 2px Focus Blue ring with a 1px offset.
- **Status badges:** 24px pills in a status wash with its ink: green for Live, In use and Visited; amber for Due; blue for Follow up; violet for Member.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** Paper on a Desk Grey or Paper page.
- **Shadow Strategy:** none at rest (see Elevation & Depth).
- **Border:** 1px Hairline. Panel headers are 44px with a hairline rule beneath, a 14px semibold title on the left, and legend or meta on the right.
- **Internal Padding:** 16px, or 20px from `sm`. KPI strips divide cells with hairlines (`divide-x`) instead of gaps.

### Inputs / Fields
- **Style:** frappe-ui's subtle field: Control Grey fill, transparent border, 8px radius, 32px high, 10px side padding. Textareas pad 8px vertically and resize vertically. The label sits above in 12px Ink Meta.
- **Focus:** the fill turns Paper, the border becomes `outline-gray-4`, and the field gains `shadow-sm`. The caret is `ink-blue-6`.
- **Required:** an `ink-red-5` asterisk after the label.

### Navigation
- **Tool chrome as navigation:** the MIS sidebar items are 32px rows with 16px Lucide icons; the current item turns Paper with `shadow-sm`. On phones they become a 28px tab row. Sheet tabs are 36px cells with hairline separators; the current tab turns Paper with a 2px `ink-blue-6` inset top line. The theory-of-change mini chain lights the dot of the stage in view.
- **Lab switcher:** a floating pill (Paper elevation surface, Rule Grey border, `shadow-lg`) at the bottom right with 28px round links; the current one is Graphite with `ink-base` text. Below 640px it folds into one "current variant" button and docks at the page end.

### TBD Chip (signature)
Marks copy or photos that only a partner can supply. An inline 4px-radius chip with a 1px dashed Dash Grey border, Desk Grey fill, Geist Mono 11px in Ink Lede, reading "TBD · what is missing". Photo frames use the same dashed treatment as a full block. It is visible on purpose, and the hover title says what is owed.

### Live Dot (signature)
An 8px Live Green circle that breathes three times on arrival (`2.4s`, expanding a 6px halo), then stays still. With reduced motion it does not animate. It always sits next to a "Data checked" date.

### Motion
- **Easing:** one curve, `cubic-bezier(0.16, 1, 0.3, 1)` (`--lab-ease`, `EASE_OUT`), through Motion (motion.dev).
- **Entrance:** fade up 10px over 600ms with a 60ms stagger. Preview swaps fade up 6px over 300ms. KPI numerals count up over 1100ms when 60% in view, then restore the exact server text.
- **Gate:** `LabLayout` stamps `data-motion="on"` on `<html>` before paint unless reduced motion is set. Hidden starting states apply only under that flag, and a 2.5s timeout removes the flag if the page script never boots.
- **Reduced motion:** every scene has a static path. Pinned scroll scenes become ordinary flowing sections, arcs and chain lines show drawn, and loops do not run.

**The Visible By Default Rule.** Content renders visible. A hidden starting state exists only under `html[data-motion='on']`, and every scene must read completely without its script.

**The Three Breaths Rule.** Ambient loops (live dot, map ripples) run three times and stop. A loop that never ends is noise.

## Do's and Don'ts

### Do:
- **Do** use frappe-ui semantic tokens (`surface-*`, `ink-*`, `outline-*`) for every colour, so the light and dark themes flip together.
- **Do** put primary actions in Desk Blue (`surface-blue-9`) with `ink-base` text, 32px or 40px high, with 8px or 10px corners.
- **Do** separate panels with 1px Hairline borders and 44px panel headers instead of shadows.
- **Do** set numbers, IDs, dates and formulas in `font-data` (Geist Mono, tabular figures).
- **Do** mark missing partner content with the dashed TBD chip, saying what is missing.
- **Do** draw icons with Lucide through the `Icon` component at 1.75 stroke, 14–16px.
- **Do** gate entrance motion on `data-motion`, use the `cubic-bezier(0.16, 1, 0.3, 1)` ease, and give every scene a reduced-motion path.
- **Do** check every scene at 390px wide.

### Don't:
- **Don't** use green for anything except live, in-use, visited or sent state.
- **Don't** set words or prose in Geist Mono.
- **Don't** use stock `ink-gray-5` outside `.lab`, or `ink-gray-4` and lighter, for readable text.
- **Don't** add a third accent; amber, red, cyan and pink are status or stage signals only.
- **Don't** put a small label above a heading as an eyebrow, use gradient text, add coloured side-stripe borders to cards, or use Unicode glyphs as icons.
- **Don't** hide content in CSS unless the motion flag is on, and don't run ambient loops forever.
- **Don't** add shadows to panels at rest.
