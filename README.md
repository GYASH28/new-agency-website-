# BRAYRO AI — Art-directed agency website

A separate creative-technology studio website for **BRAYRO AI**.
Six responsive pages, native agency identity, actual client imagery and a focused motion system.
This is **original BRAYRO work**, influenced by reference principles rather than copied visual assets, source, awards or fabricated case studies.

## Open the preview

**[BRAYRO agency preview](https://brayro-new-agency-preview.vercel.app/)**  
Vercel project: `brayro-new-agency-preview`  
Working repository: `GYASH28/new-agency-website-`, default branch `main`.

The separate preview has deployed successfully through Vercel; this does not mean every browser or viewport has yet been visually approved.

### Safety boundary

- **Do not modify** the original production repository `GYASH28/BRAYROAI-`.
- **Do not modify** the original live project/domain `https://brayroai.vercel.app/`.
- Keep the new preview in its own Vercel project until it passes final visual review and receives explicit approval.
- All first-party screenshots, fonts and brand assets remain local in this repository.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Studio statement, FakhriMart preview, independent work, services, process and particle signature |
| `/work` | Actual client case, interactive desktop/mobile project viewer, independent Lernio AI and BRACE explorations |
| `/services` | Web experiences, applied AI and creative direction, plus the studio process |
| `/plans` | Market-specific website and AI pricing, with plain-language FAQ |
| `/studio` | Real founder story, local portrait and principles |
| `/contact` | User-initiated email/WhatsApp brief. No backend claim or silently collected lead data |

The work makes the boundary between client work and self-initiated projects explicit. Prices retain the approved India, UAE and Australia figures and are not mechanically converted currencies.

## Visual & interaction architecture

- `styles/site.css`: baseline layout, typography, responsive treatment.
- `styles/art-direction.css`: high-level BRAYRO art direction, work/gallery composition and shared design system.
- `scripts/site.js`: navigation, consent-first enquiry, regional pricing, BRAYRO canvas particles and restrained scroll depth.
- `scripts/art-direction.js`: page highlights, portfolio view toggles, accessible experimental project gestures and editorial entrance timing.

Motion respects reduced-motion preferences, and decorative effects are toned down on touch/mobile devices. The site intentionally avoids heavy remote motion libraries and fake UI screenshots.

Design research, mappings and QA caveats: [docs/ART_DIRECTION_RESEARCH.md](docs/ART_DIRECTION_RESEARCH.md).

## Run locally

```bash
python3 scripts/preview.py
# http://127.0.0.1:4173
```

```bash
npm run check
# Browser test requires Playwright + installed Chromium:
npm run test:browser
```

The `.github/workflows/quality.yml` workflow runs source checks and Playwright responsive browser tests on pushes and pull requests. Browser tests exercise 320, 390, 768 and 1440 widths and save inspection screenshots as a CI artifact. A running CI workflow is not a claim of passing results.

## Final review still required

Inspect every page on real desktop and mobile screens; compare actual screenshots rather than CSS alone. Look closely at text clipping, image quality/crops, nav overlays, mixed font loading, particles/performance, keyboard navigation, and region-selected pricing. Approve deployment to the original agency domain only after that review and explicit authorization.

## Assets, provenance & REA

The optional MIT-licensed REA toolkit is for learning from observable web behaviors, not for copying third-party code or branding. See `docs/REA_WORKFLOW.md`, `docs/ASSET_PROVENANCE.md`, and the research log for evidence limits.
