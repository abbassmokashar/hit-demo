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
- Expandable, accessible section navigator with live section context.
- Unique photographic program identities for the Bachelor degrees and code-native animated identities for the Master degrees.
- A scroll-driven editorial story section built from the official Career Outcomes page.
- Per-page compositions: split, editorial columns, pull quote, timeline, index list, card grid, media feature, policy index and an FAQ tab-and-accordion system.
- Low-power tuning: cursor and parallax effects switch off on small or constrained devices.
- Reduced-motion and no-JavaScript fallbacks.
- Automated local-link and content checks.
- Swiss editorial grids, generous spacing, and interactive program and learning systems.
- No raster photograph is reused in a second placement anywhere in the generated site.
- A trust-led homepage with verified program facts, transparent fees, international-student support, admissions steps, and distinct Apply, brochure, and contact paths.
- Visible desktop navigation backed by the full-screen mobile and expanded navigation.
- Locally stored, optimized WebP imagery throughout; no JPEG, PNG, or AVIF page assets.

## Source rule

Institutional copy is sourced only from the current public pages on `helvetictech.ch`. Unsupported faculty, policy, editorial, contact, and program copy is excluded. Interface labels, accessibility instructions, the local-time display, and wayfinding labels are functional UI rather than institutional claims.

## Image sources

Official Helvetic Tech photography is paired with free-to-use stock photography and clearly labelled editorial illustrations. Decorative visuals do not make institutional claims. All raster files are converted to local WebP assets.

- Helvetic Tech official homepage photography: `helvetictech.ch`
- Lake Geneva photography: Igor Vieira and Jean-Paul Wettstein on Pexels
- Classroom and campus photography: Eduard Perez and RDNE Stock project on Pexels
- Student collaboration: Vitaly Gariev on Unsplash
- Technology photography: Daniil Komov, Kevin Ache, and Dawit on Unsplash

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

## Pre-launch checklist

- Replace editorial illustrations with verified photography of the real campus, rooms, faculty, students, and alumni.
- Obtain institutional approval for all recognition, accreditation, partnership, and outcome claims.
- Separate and brand the hosted Apply, brochure, and contact forms.
- Remove `noindex, nofollow` only when the production domain, canonical URLs, privacy controls, analytics, sitemap, and robots file are ready.
- Complete keyboard, 200% text-resize, mobile-network, and target-country performance testing.
- Review and sign off the claims in `CLAIMS-REGISTER.md`.
