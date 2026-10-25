# BRAYRO AI — the new agency experience

A separate, Craft-*inspired* visual direction for **BRAYRO AI**, using the agency's own branding, assets, evidence and approved service prices. The interface is an original agency website, not a copy of Craft's branding or source.

## Safety boundary

- **Only working repository:** `GYASH28/new-agency-website-`
- **Original source (read-only):** `GYASH28/BRAYROAI-`
- **Original live site (untouched):** https://brayroai.vercel.app/
- This redesign is delivered in `feat/craft-inspired-brayro-redesign` for review. Do **not** connect this repo to the existing production Vercel project.
- If deploying a preview, create a **separate Vercel project** and verify the project/domain settings.

## Pages

`/` Home · `/work` Work · `/services` Services · `/plans` Plans · `/studio` Studio · `/contact` Contact.

The site is a lightweight, dependency-free static multi-page build using vanilla HTML, CSS, JS, locally copied agency media and fonts. No credentials, backend or deployment tokens are needed.

## Run locally

```bash
python3 scripts/preview.py
# open http://127.0.0.1:4173
```

```bash
npm test
```

The preview server resolves clean routes the same way as the included `vercel.json` rewrites. Regional pricing is selectable for India/UAE/Australia, retaining original independent offer prices. The contact form opens a **user-initiated** email or WhatsApp draft; it does not claim to submit leads to a backend.

## Review checklist

- Test all pages at 1440, 768, 390 and 320 CSS pixels.
- Test desktop navigation, mobile menu, Escape-close, project links and keyboard focus.
- Test regional price switching and offer-linked contact preselection.
- Confirm external projects and contact channels still belong to Brayro.
- Confirm reduced-motion accessibility and touch targets.
- Test cross-browser behavior before approving any public deployment.
- Retain the `robots.txt` prelaunch restriction until the new site's own domain is ready.

## Tooling and sources

`docs/REA_WORKFLOW.md` describes how the optional MIT-licensed [REA](https://github.com/morluto/rea) agent toolkit can help investigate observable web behaviors; no REA code or runtime ships to customers.

`docs/ASSET_PROVENANCE.md` lists exact source assets, licensing considerations, and evidence boundaries.

This review build is **not deployed**, and the original production website was not modified.
