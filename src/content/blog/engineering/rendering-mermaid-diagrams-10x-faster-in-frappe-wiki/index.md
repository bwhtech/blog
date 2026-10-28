---
title: "Rendering Mermaid diagrams 10x faster in Frappe Wiki"
description: "Mermaid is heavy and was fighting against our theme. Pele renders the same syntax up to 10× faster, inherits its colors from CSS, and switches to dark mode without redrawing a single diagram."
authors: [gajendra-nishad]
tags: [Engineering, Frappe Wiki, Performance]
pubDate: 2026-10-28
image: "./cover.jpg"
---

Boss sent me a link to [Pele](https://github.com/obsidianmd/pele), a new diagram renderer from the Obsidian team.

<figure style="max-width:600px; margin:1.5em auto;">

![Chat message with a link to obsidianmd/pele and the note "Benchmark if worth to replace in Wiki"](./boss-message.png)

</figure>

So I did. I ran both renderers on a real wiki page, checked every example in Mermaid's docs, and compared the numbers. It turned out to be worth it, and we recently replaced Mermaid with Pele in Frappe Wiki.

## Why replace Mermaid?

Mermaid is powerful, but it is heavy. It ships around 904 KB gzipped and gets noticeably slower on pages with many diagrams.

Making it match our theme was also hard. We had to write extra code just to pass our colors and fonts to Mermaid. And every time you switched to dark mode, every diagram on the page had to be drawn again.

## Why Pele?

Pele is an open-source diagram renderer from the Obsidian team. And don't worry, your existing Mermaid diagrams won't break 😅

Pele understands the same Mermaid syntax, so everything keeps working as before. How you write a diagram and how the wiki stores it did not change.

It is also much lighter, just 252 KB gzipped, and it renders diagrams almost instantly.

![Before and after: flowchart, sequence, class and state diagrams, Mermaid on the left and Pele on the right](./light-flow-seq-class-state.png)

## A taste of the Frappe ecosystem

One thing I really liked about Pele is that it takes its colors straight from CSS.

That made it easy to style everything with Frappe UI tokens:

- Pie and XY charts use the same colors as frappe-ui charts.
- ER diagrams look like the table cards in Frappe Insights.

![Before and after: ER diagram, Gantt chart and pie chart](./light-er-gantt-pie.png)

![Before and after: XY chart, quadrant chart and mind map](./light-xy-quadrant-mindmap.png)

Dark mode is handled entirely in CSS, so no diagram has to be redrawn when you switch themes.

![Dark mode: flowchart, ER diagram, pie chart and Gantt chart](./dark-flow-er-pie-gantt.png)

The editor uses the same renderer, so the preview matches what readers see. If you make a typo, the last good diagram stays on screen, dimmed, with the error below it.

<figure style="max-width:705px; margin:1.5em auto;">

![Live preview of a diagram in the wiki editor](./editor-preview.png)

</figure>

<figure style="max-width:705px; margin:1.5em auto;">

![A diagram with a syntax error: the last good render stays, dimmed, with the error message below](./editor-syntax-error.png)

</figure>

## The benchmark

We measured a real wiki page with 12 diagrams in Chrome, taking the median of 5 cold loads.

| | Mermaid | Pele |
|---|---|---|
| Load until all diagrams are drawn | 839 ms | 410 ms |
| Main thread blocked on load | 464 ms | 42 ms |
| Theme switch | 351 ms | 29 ms |
| Editor keystroke | 39 ms | 1 ms |
| 100-node flowchart | 285 ms | 20 ms |
| Memory (JS heap) | 13.5 MB | 5.9 MB |

On a slow computer, the page load drops from 3,071 ms to 1,040 ms, and a theme switch drops from 1,435 ms to 40 ms.

Pele rendered all 548 examples from Mermaid's own documentation that Mermaid itself renders, with zero regressions.

Sometimes the best optimization is removing the thing that was making everything harder.

So, Boss: yes, it was worth it.

Thanks to the Obsidian team for open-sourcing Pele ✌️

PR: [frappe/wiki#883](https://github.com/frappe/wiki/pull/883)
