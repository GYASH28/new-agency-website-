# BRAYRO AI / Art-direction research and implementation log

_Date: 2026-10-25 · Working repository: GYASH28/new-agency-website-_

## Objective

A premium independent creative technology studio, not a generic AI landing page.
A coherent light-mode visual system, specific proof of work, persuasive hierarchy and
performance-aware motion. Avoid clone-like surfaces, fictitious clients, fake reviews,
unlicensed artwork, auto-playing heavy WebGL scenes and inaccessible scroll effects.

## References studied

| Reference | Pattern to learn from | BRAYRO implementation |
| --- | --- | --- |
| [Craft](https://www.craft.do/) | Roomy storytelling, credible product screenshots, deliberate content pacing | Genuine FakhriMart screenshots; quiet lead-in and clearer hierarchy |
| [Supaste](https://www.supaste.com/) | Real product views, visual contrast, functional feature narratives | Work desktop/mobile viewer using the real project assets |
| [Instrument](https://www.instrument.com/) | Typography and distinctive client work as central proof | Oversized serif/grotesk mix; project-first exhibition |
| [Locomotive](https://locomotive.ca/en) | Studio identity with editorial work and purposeful interactions | Independent studio voice, animated typography and image depths |
| [Hello Monday](https://www.hellomonday.com/) | Work-led browsing, categories and creative restraint | Client work clearly distinct from studio experiments |
| [Basement](https://basement.studio/) | Bold creative identity while maintaining commercial clarity | Strong typographic shapes, contrast and actionable paths |
| [Pentagram](https://www.pentagram.com/) | No invented proof; a confident grid hierarchy | Consistent label system, proven case imagery and typography |
| [Raycast](https://www.raycast.com/) | Product details which demonstrate actual capability | Precision device switcher and functional controls |
| [Linear](https://linear.app/) | Meticulous alignment, affordances, disciplined interaction detail | Controlled hover treatments, clear typography and state controls |
| [Awwwards: agencies](https://www.awwwards.com/websites/agency/) | Varied design approaches in high-caliber portfolios | Art direction, sectional storytelling and accessibility benchmarks |
| [CoolDock](https://cooldock.app/) | User-requested reference for depth and product-stage motion | Subtle framing and depth; not direct animation or asset reproduction |

## Deliberate design system

- Palette: deep slate ink, warm off-white paper, cool mineral surfaces, coral accent. Light presentation; deliberate dark sections only for contrast.
- Typography: local Space Grotesk, Manrope and Instrument Serif. No third-party font loading.
- Homepage: art-directed hero, honest image showcase, kinetic marquee, independent project exhibition, capabilities directory, process and particle signature.
- Work: one authentic client case, controlled desktop/mobile view, Lernio and BRACE represented as clearly labeled independent explorations.
- Services: three differentiated editorial spreads with restrained artwork and a transparent working process.
- Plans: no fake discounts, intact India/UAE/Australia approved prices and a plain-language native FAQ.
- Studio: a first-party portrait, real founder story and principles, no fictional team members.
- Contact: a user-initiated email/WhatsApp flow, rather than claiming backend submission.

## Behavior and QA

- Vanilla HTML/CSS/JS, no new runtime dependency.
- Interaction respects prefers-reduced-motion and touch devices.
- Existing navigation, regional prices, contact drafting and particle canvas retained.
- Source validation covers 6 pages: balanced markup, one H1 per route, motion stylesheet/script references and balanced CSS braces.
- Browser test file updated for new hero, portfolio device toggle and FAQ. Execute `npm test` and `npm run test:browser` in an environment with Playwright installed; verify widths 320/390/768/1440 and inspect the generated screenshots.
- Current limitation: a real visual screenshot inspection of the freshly deployed live site has not yet been completed from Chat mode. A READY Vercel deployment is not proof of pixel-perfect rendering.

## Guardrails

The original website repository GYASH28/BRAYROAI- and its brayroai.vercel.app deployment are untouched.
All work is contained in the separate GYASH28/new-agency-website- repository and the brayro-new-agency-preview Vercel project.
