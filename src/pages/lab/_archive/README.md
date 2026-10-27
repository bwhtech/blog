# Archived landing variants

The other directions from the landing page lab. Sheet → System
(`src/pages/lab/sheet.astro`) was chosen; these stay here for reference.

Astro does not route files in a folder whose name starts with `_`, so none of
these pages are built. To look at one again, move it back up to
`src/pages/lab/` and change its `../../../` imports back to `../../`.

- `mis.astro`: Impact MIS, the page as a live dashboard.
- `theory-of-change.astro`: our work as a logframe.
- `intake.astro`: Intake desk, the request form as the hero.
- `flow-concepts*.astro`: sketches for the "We engineer processes" section;
  concept J became `src/components/landing/ProcessFlow.astro`.
