# Helvetic Tech Static Prototype

Interactive multi-page prototype for the “Precision in Motion” direction.

## Included

- Homepage.
- Programs hub.
- Bachelor in Artificial Intelligence detail page.
- Admissions, Institute, Contact, and Career Outcomes pages.
- Full-screen navigation covering the complete published Helvetic Tech information architecture; destinations without local templates continue to the corresponding official page.
- First-visit logo loader and animated logo curtain between internal pages.
- Responsive program filters, accordions, and scroll reveals.
- Scroll-linked floating chapter dock, cursor + magnetic hover interactions, and image parallax.
- The interactive, scroll-reactive signal field with per-discipline modes and smooth mode blending.
- A scroll-driven editorial story section built from the official Career Outcomes page.
- Per-page compositions: split, editorial columns, pull quote, timeline, index list, card grid, media feature, policy index and an FAQ tab-and-accordion system.
- Low-power tuning: the canvas, cursor and parallax drop quality or switch off on small or constrained devices.
- Reduced-motion and no-JavaScript fallbacks.
- Automated local-link and content checks.
- Swiss editorial grid, registration marks, local-time signal, and animated discipline bands.
- Student-focused hero actions with direct brochure, admissions, and program access.
- Responsive field explorer that keeps program links usable on tablet and mobile.

## Source rule

Institutional copy is sourced only from the current public pages on `helvetictech.ch`. Unsupported faculty, policy, editorial, contact, and program copy is excluded. Interface labels, accessibility instructions, the local-time display, and wayfinding labels are functional UI rather than institutional claims.

## Build

```powershell
node .\build-pages.mjs
node .\audit.mjs
```

Serve the `prototype` directory with any static web server. The HTML output is generated from `data/pages.mjs` and `lib/render.mjs`.

## Routes

- `/`
- `/programs/`
- `/programs/bachelor-in-artificial-intelligence/`
- `/admissions/`
- `/institute/`
- `/campus-life/`
- `/faculty/`
- `/policies/`
- `/faq/`
- `/contact/`
- `/career-impact/`

The prototype currently contains 11 local routes. Other official navigation destinations continue to their published Helvetic Tech source pages until those local templates are built.

Admissions, Institute, Campus, Faculty, Policies, FAQ and Insights omit time-sensitive and unconfirmed material (fees, deadlines, statistics, bios, portraits, partnerships) per `../planning/04-content-source-register.md`. The Faculty page carries only publicly published names and titles; individual biographies, portraits and the roster still require institutional confirmation.
