---
version: 1
slug: "src-pages-lab-sheet-astro"
primary_target: "src/pages/lab/sheet.astro"
related_targets: []
---

Scope: /lab/sheet, landing page variant 2 of 4. Visitor mode: Persuade.
Audience and action: as /lab/mis. Same constraints. Directions pinned by the user; no concept roll ran.

## Direction contract
THESIS: The page opens as the visitor's own spreadsheet, and scrolling turns it into a live dashboard of one system. Refuses describing "fragmentation" in prose: it shows the boring sheet, then the system it becomes.
OWN-WORLD: Before: a spreadsheet app (formula bar with name box and fx, column letters, row numbers, gridlines, a faint amber header row, red comment corners) whose data is deliberately quiet: 12px grey cells, notes only on hover, so the headline is the one loud thing. After: a frappe-ui dashboard on Desk Grey: a filter row (date range, village, case), a four-cell KPI strip, a visits area chart, a status donut, visits-by-village bars that also filter, and the beneficiary list. Charts use frappe-ui's chart ramp. Sheet tabs stay the page navigation.
STORY: Recognise the sheet (four spellings of "yes", a duplicate, a #VALUE!, a total that says 3); the form, chat and script turn up and merge into one source; the duplicate folds; one wipe turns the whole stage into the dashboard, which draws itself and then goes live for the visitor to filter. The rest of the page will be modern and dashboard-like; its sections are still to be decided with the user.
FIRST VIEWPORT: Title bar with the file name and the primary action; formula bar showing the A1 formula; merged A1:G5 cell with the selected-cell outline holding the H1 and lede; a quiet "Visited this month 3"; the quiet register; a caption pill; sheet tabs fixed at the bottom. The form, chat and terminal cards appear only once scrolling starts.
FORM: Sheet to Dashboard. The user picked the frappe-ui version of Sheet to System on 2026-10-27 and asked for a quiet sheet, a dashboard with filters and good charts, and a dashboard-like rest of the page. Signature interaction: a pinned, scroll-scrubbed wipe from sheet to dashboard, then working filters and cross-filtering village bars on sample data; the formula bar reads the cell under the pointer.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
