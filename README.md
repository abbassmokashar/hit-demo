# Helvetic Tech Static Prototype

Interactive multi-page prototype for a Swiss editorial technology-school direction.

## Included

- Homepage.
- Programs hub.
- Six local Bachelor and Master program pages.
- Admissions, Institute, Governance, Student, Financing, Contact, and Career Impact pages.
- Full-screen accordion navigation covering the complete published Helvetic Tech information architecture with local destinations throughout.
- First-visit logo loader and animated logo curtain between internal pages.
- Responsive program filters, accordions, and scroll reveals.
- Scroll-linked floating chapter dock, cursor + magnetic hover interactions, and image parallax.
- Discipline-specific program identities and Swiss modular hero compositions.
- A scroll-driven editorial story section built from the official Career Outcomes page.
- Per-page compositions: split, editorial columns, pull quote, timeline, index list, card grid, media feature, policy index and an FAQ tab-and-accordion system.
- Low-power tuning: cursor and parallax effects switch off on small or constrained devices.
- Reduced-motion and no-JavaScript fallbacks.
- Automated local-link and content checks.
- Swiss editorial grids, registration marks, local-time signals, and static discipline bands.
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
- `/programs/bachelor-in-cybersecurity/`
- `/programs/bachelor-in-blockchain/`
- `/programs/master-in-artificial-intelligence/`
- `/programs/master-in-cybersecurity/`
- `/programs/master-in-blockchain/`
- `/admissions/`
- `/institute/`
- `/campus-life/`
- `/faculty/`
- `/policies/`
- `/faq/`
- `/contact/`
- `/career-impact/`
- `/governance/`
- `/job-vacancies/`
- `/student-services/`
- `/students/`
- `/institutional-development/`
- `/alumni/`
- `/financing/fees-expenses/`
- `/financing/scholarships/`

The prototype currently contains 24 local routes. Every destination in the full-screen menu stays inside the prototype.

The prototype uses only material published on the current Helvetic Tech website. The Faculty page carries only publicly published names and titles; unconfirmed biographies and portraits remain excluded.
