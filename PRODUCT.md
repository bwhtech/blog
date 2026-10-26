# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** leaders at small and mid-size Indian nonprofits: executive directors, programme heads, MEL and operations managers. Their data lives in Excel sheets, Google Forms, WhatsApp groups and scripts that someone wrote once. They want one system their team can run, and they judge a partner on whether it listens and on proof from organisations like theirs.
- **Secondary:** CSR teams and funders who pay for technology for their grantees, and who want one view across a portfolio.
- The Frappe developer community reads the blog and the YouTube channel. The landing page does not target it.

## Product Purpose

BWH (legal name BWH Technologies) is a team of problem solvers in Jagdalpur, Chhattisgarh. It builds systems for organisations in the impact space: MIS, dashboards, beneficiary and case management, field data collection, M&E and donor reporting, HR and payroll, accounts and grants. It also trains the client's team to run those systems ("train the trainer").

Success for the landing page: a nonprofit leader understands within seconds that BWH turns scattered tools into one system the team owns, and tells BWH their problem through the intake form or books a call at `/meet`.

## Positioning

"Problem solvers, for the problem solvers." Tell us the problem; we work out the solution with you, and we listen first. The difference from other vendors:

- The team are core contributors to the open-source stack they build on (Frappe Framework, ERPNext, Frappe HR). As of 2026-10-26 the team has 1,043 merged pull requests in `frappe/*` repositories.
- Train the trainer: the client's own staff learn to run and extend the system. BWH is an official Frappe School partner (source: the BWH blog only; Frappe's partner directory does not list it yet).
- BWH runs CS17 itself, a training programme for young women in Jagdalpur.

The page leads with outcomes and mentions the open-source stack (Frappe, ERPNext) as proof, not as the offer.

## Operating Context

Nonprofit teams report to boards and funders, run field teams with patchy connectivity, and fill logframes and theory-of-change diagrams for proposals. Many have had a volunteer or vendor build something that nobody can maintain.

## Capabilities and Constraints

- Offers, in priority order: systems (MIS, dashboards, case management, field data, M&E, Frappe HR and ERPNext rollouts); capacity building (train the trainer, Frappe School trainings, see `/train-your-team`); AI for education and training, with CS17 as the proof.
- No offer is ruled out by the stack.
- Seva, the AI app builder for nonprofits, is not public. Do not mention it.
- The intake form is front end only until a winner is picked; it falls back to `/meet`.
- The site is Astro 7 on Netlify, Tailwind 3 with the frappe-ui preset. Tailwind cannot move to v4 until frappe-ui supports it.

## Brand Commitments

- Header shows "BWH". Footer shows the legal name "BWH Technologies".
- Existing lines: "Bunch of Problem Solvers." and "We solve it, with Frappe."
- Colours come from frappe-ui tokens. The user asked for blue and violet as accents and green for live status.
- Type: Inter (frappe-ui) for text, Geist Mono for data.
- Voice: plain, warm, direct. Sentence case. No hype.

## Evidence on Hand

Verified on 2026-10-26:

- 1,043 merged PRs in `frappe/*` by the `bwhtech` team (Frappe 488, Wiki 220, Press 115, Changemakers 56, LMS 29, ERPNext 25). The members' GitHub memberships are private: show the team total, name nobody without consent.
- BuildWithHussain on YouTube: 10.9K subscribers, 241 videos, 1.02M views.
- Frappe School: "Full-stack App Development with Frappe Framework" 18,608 enrolments; "VueJS, TailwindCSS & FrappeUI" 1,996; "SQL Querying Essentials" 1,504; "Frappe Framework and Apps for Everyone" (Hindi) 540. Do not add these together.
- 48 public, non-fork repositories under `github.com/bwhtech` (Buzz, Nano Press, Commera, Forms Pro, Batwara).
- Frappe Changemakers (`github.com/frappe/changemakers`, AGPL-3.0, repository created 2022-10-12): beneficiary management for Azim Premji Foundation's homeless care programme in Bengaluru and Chennai, "used to manage thousands of beneficiaries" (BWH blog, July 2025). Built by the founder with Umair while at Frappe, before BWH. Do not name Umair on the page without consent.
- CS17: 18-month residential programme for young women in Jagdalpur, 100% scholarship, CS50-based curriculum, Frappe Framework, IGNOU BCA, 6-month internship. Campus by Bastar Sevak Mandal, funded by Azim Premji Foundation.
- Partners named by the user: Azim Premji Foundation; CMID (Centre for Migration and Inclusive Development, Ernakulam); ILF (full name unknown); Dhwani RIS (Gurugram); KMVS (Kutch Mahila Vikas Sangathan, Bhuj); ASHA, the Alliance for Sustainable & Holistic Agriculture (Kisan Swaraj Sammelan); OASIS Network; one more organisation the user has not named yet.

Absent, and not to be invented: what BWH built for each partner other than Azim Premji Foundation, outcomes, testimonials, photographs, client logos, team size today, prices and timelines. Show these as visible `TBD` placeholders.

## Product Principles

1. Listen first: the visitor's problem leads, the stack follows.
2. Prove, don't claim: every number is sourced and dated, and gaps stay visibly open.
3. The team owns the system: training is part of the work, not an add-on.
4. Open source by default: no per-seat licences, and code the client can take anywhere.

## Accessibility & Inclusion

WCAG AA contrast in light and dark themes. Motion respects `prefers-reduced-motion`. The first readers include people on low-end Android phones and slow connections: the page must work on a 390px screen.
