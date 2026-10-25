# Editorial rebuild — 25 October 2026

## Why
User feedback: the old iteration felt out of place, visually inconsistent and like generic AI-generated design. This is a composition-level rebuild, not an additive visual-effects pass.

## Visual decisions
- **Reference:** the airy sky-blue, editorial hierarchy and warm paper feeling of Craft. Original HTML/CSS and BRAYRO-owned assets only; no Craft hotlinks or copied proprietary design assets.
- **Identity:** Manrope body, Space Grotesk headings, sparse Instrument italic; deep charcoal, mist blue, warm off-white and one coral detail.
- **Work:** the verified live FakhriMart screenshots are the primary visual proof. Lernio and BRACE are explicitly distinguished as internal experiments.
- **Motion:** one contained particle moment on the homepage, not a flashy global particle gimmick. Oversized footer wordmark retains the core BRAYRO identity but fits its grid.
- **Structure:** six pages rebuilt to use one navigation, one spacing rhythm, one footer, one button system and thoughtful mobile layouts.
- **Honesty:** no fake client counts, conversion metrics, testimonials or awards. Pricing retains independent original market-specific rates.
- **Performance and access:** self-hosted fonts, image dimensions, reduced motion, semantic landmarks, accessible menu, readable content with JS disabled, and no external dependencies.

## QA
Run `npm test` and `npm run test:browser` (GitHub workflows) on the PR; inspect the generated browser screenshots, especially at 320px and 390px. Vercel deployment only after merge.
