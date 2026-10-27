---
version: 1
slug: "src-pages-lab-intake-astro"
primary_target: "src/pages/lab/intake.astro"
related_targets: []
---

Scope: /lab/intake, landing page variant 4 of 4. Visitor mode: Persuade.
Audience and action: as /lab/mis. Same constraints. Directions pinned by the user; no concept roll ran.

## Direction contract
THESIS: The landing page is the request form: the visitor states the problem first and sees the system that would fix it. Refuses a pitch before listening.
OWN-WORLD: A helpdesk ticket: header with "New request" and a live status pill (Draft, N problems, Ready to send, Sent); toggle chips; a deep-blue field holding a frappe-ui app window titled "Your system" whose sidebar gains a part per problem; a kanban board of the process with the visitor's ticket in it.
STORY: Pick what is breaking, watch the system assemble with sample content and the closest real work we have done, see where the request goes, see who we are, then send the request.
FIRST VIEWPORT: Left: H1 at 54px, lede, "What's breaking?" with eight chips. Right: the blue field with the app window in its empty state. Header holds the status pill and "Send request".
FORM: Intake desk, the user's fourth pick of four. seed: none (unavailable). Signature interaction: each chip adds a module to the window and switches the preview; status pill and ticket card update live; the form at the end carries the picks.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
