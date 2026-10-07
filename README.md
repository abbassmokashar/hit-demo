# Helvetic Tech Static Prototype

Interactive multi-page prototype for a Swiss editorial technology-school direction.

## Included

- Homepage.
- Programs hub.
- Six local Bachelor and Master program pages.
- Admissions, Institute, Governance, Student, Financing, Contact, and Career Impact pages.
- Full-screen accordion navigation covering the complete published Helvetic Tech information architecture with local destinations throughout.
- Immediate page rendering with no first-visit loader or page-transition curtain.
- Responsive program filters, accordions, and restrained scroll reveals.
- Expandable, accessible section navigator pinned to the right edge with live section context and a progress bar.
- Unique photographic identities for the study programmes: full-bleed hero imagery per program, in-page overview imagery, and per-discipline images in the homepage program deck.
- Full-bleed photographic page headers; body sections keep their editorial text-beside-photography layout.
- Program pathways catalogue with a pointer-following image preview and level filters.
- Program pages structured around a text-and-image overview, a numbered learning-outcome grid, a module-based curriculum, and career chips.
- A modern "Visit Us" panel with icon tiles for the address and phone plus apply/brochure actions, alongside an interactive OpenStreetMap view of La Tour-de-Peilz.
- A scroll-driven editorial story section built from the official Career Outcomes page.
- Per-page compositions: split, editorial columns, pull quote, timeline, index list, card grid, media feature, policy index and an FAQ tab-and-accordion system.
- Low-power tuning: cursor and parallax effects switch off on small or constrained devices.
- Reduced-motion and no-JavaScript fallbacks.
- Automated local-link and content checks.
- Distinct card and accordion treatments (bordered, spaced items) instead of a flat document-style list.
- Swiss editorial grids, generous spacing, and interactive program and learning systems.
- Three connected HIT decision tools with distinct interfaces: Program Signal, Program Matrix, and Study Cost Model.
- Program Signal ranks the three appropriate Bachelor or Master options from academic-stage and technology-interest inputs without treating the result as an admissions decision.
- Program Matrix compares up to three programs and highlights differences in level, field, award, duration, credits, structure, format, tuition, and intakes.
- Study Cost Model combines published HIT tuition and admission fees with editable living-cost assumptions, recalculates instantly, and supports browser printing or Save as PDF without collecting personal data.
- No raster photograph is reused in a second placement anywhere in the generated site.
- A trust-led homepage with verified program facts, transparent fees, international-student support, admissions steps, and distinct Apply, brochure, and contact paths.
- Visible desktop navigation backed by the full-screen mobile and expanded navigation.
- Locally stored, optimized WebP imagery throughout; no JPEG, PNG, or AVIF page assets.

## Source rule

Institutional copy is sourced only from the current public pages on `helvetictech.ch`. Unsupported faculty, policy, editorial, contact, and program copy is excluded. Interface labels, accessibility instructions, the local-time display, and wayfinding labels are functional UI rather than institutional claims.

## Image sources

Official Helvetic Tech photography is paired with free-to-use stock photography. Decorative visuals do not make institutional claims, and descriptive captions are used instead of "illustrative image" labels. All raster files are converted to local WebP assets.

- Helvetic Tech official homepage photography: `helvetictech.ch`
- Lake Geneva photography: Igor Vieira and Jean-Paul Wettstein on Pexels
- Classroom and campus photography: Eduard Perez and RDNE Stock project on Pexels
- Student collaboration: Vitaly Gariev on Unsplash
- Technology photography: Daniil Komov, Kevin Ache, and Dawit on Unsplash
- Programme, discipline, policy, FAQ, contact, and student-community photography: StockSnap and RawPixel via the Openverse API (CC0 / public domain).

## Third-party embeds

The contact page embeds the OpenStreetMap viewer (`openstreetmap.org`) for the campus location. It is lazy-loaded, so it does not block first render. Attribution to OpenStreetMap contributors is required wherever the map is shown and must be reviewed before launch.

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
- `/tools/program-signal/`
- `/tools/program-matrix/`
- `/tools/study-cost-model/`

The prototype currently contains 27 local routes. Every destination in the full-screen menu stays inside the prototype.

The prototype uses only material published on the current Helvetic Tech website. The Faculty page carries only publicly published names and titles; unconfirmed biographies and portraits remain excluded.

## Pre-launch checklist

- Replace stock photography with verified photography of the real campus, rooms, faculty, students, and alumni.
- Obtain institutional approval for all recognition, accreditation, partnership, and outcome claims.
- Separate and brand the hosted Apply, brochure, and contact forms.
- Remove `noindex, nofollow` only when the production domain, canonical URLs, privacy controls, analytics, sitemap, and robots file are ready.
- Complete keyboard, 200% text-resize, mobile-network, and target-country performance testing.
- Review and sign off the claims in `CLAIMS-REGISTER.md`.
- Confirm the contact-page map pin and OpenStreetMap attribution, or replace the embed with a self-hosted map.
