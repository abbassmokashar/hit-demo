# HIT WordPress package

The HIT prototype uses the same update-safe architecture as HBS:

- `hit-theme` — presentation, navigation, templates, motion and public assets.
- `hit-child` — deployment-specific overrides that survive parent-theme updates.
- `hit-core` — editable page sections, structured program/intake data, starter-content import, decision-tool data and the complete admissions enquiry workflow.

No page builder or separate forms/enquiries plugin is required.

## Install

1. Install `dist/hit-theme.zip` under **Appearance → Themes**. Do not activate it yet.
2. Install `dist/hit-child.zip`, then activate **HIT Child**.
3. Install and activate `dist/hit-core.zip` under **Plugins**.
4. Core imports the 27 approved prototype pages, six programs and three intakes, and sets the homepage.
5. Open **HIT website** and confirm the import counts.
6. Open **Appearance → Menus** to review the editable header and full-screen menus.
7. Open **Enquiries → Settings**, choose the Admissions recipient and send a test email.
8. Choose **Post name** under **Settings → Permalinks** and save once.

If the earlier experimental **HIT Enquiries** plugin is installed, deactivate it before installing HIT Core and remove it after Core is active. Core migrates its recipient address and uses the same private enquiry records and endpoint.

## Editing model

Pages are ordinary WordPress pages. Each visual section is a native **HIT page section** block. Editors can edit text, links and images, hide a section, and reorder sections. Programs and intakes are structured records; changes to program facts flow into Program Signal, Program Matrix and the server-verified Study Cost Model.

The **Refresh HIT starter content** action updates only Core-managed pages and records. It preserves unrelated WordPress content, but replaces manual edits inside managed pages with the approved package version.

## Rebuild after prototype changes

```powershell
node wordpress/tools/export-starter-data.mjs
powershell -ExecutionPolicy Bypass -File wordpress/build-packages.ps1
```

The exporter converts the generated prototype into WordPress-safe starter content. The packaging script creates generic and versioned ZIP files in `wordpress/dist`.

## Ownership boundary

- Shared design or frontend behavior: `hit-theme`.
- Site-specific overrides: `hit-child`.
- Content models, imports, tools, enquiries, PDFs and email: `hit-core`.

