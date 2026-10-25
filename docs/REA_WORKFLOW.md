# REA-inspired reference investigation

## Source

- Public reverse-engineering toolkit: https://github.com/morluto/rea
- License: MIT © 2026 morluto
- Reference page: https://www.craft.do/
- This project's target repo: https://github.com/GYASH28/new-agency-website-

REA is **not** the website framework. It is an optional **development-only investigation tool** and is not installed or bundled in the production site. The shipped website uses ordinary HTML, CSS and JavaScript.

## Reproducible developer setup (not executed during this build)

Use a compatible Node runtime (REA currently declares `^22.23.4 || ^24.22.1 || >=26.12.1`), then from an independent developer workspace:

```sh
npx rea-agents setup
```

Give your REA-enabled agent a scoped, passive investigation:

> Observe the public Craft homepage at https://www.craft.do/ without logging in or bypassing access controls. Document observable page hierarchy, rounded navigation, editorial type scale, airy sky/paper layers, responsive floating document cards, interaction states, and reduced-motion behavior. Produce evidence with observed/assumed labels. Do not extract or reproduce Craft source, proprietary assets, logos, animations, private endpoints, or copyrighted text. Build original Brayro equivalents from Brayro's owned assets instead.

REA's README explicitly says it explains and evidences behavior, **not** that it automatically clones source code. No claim is made that its CLI performed a live capture in this ChatGPT session.

## Observed design grammar → original implementation

| Public reference trait | Original Brayro equivalent |
| --- | --- |
| Airy blue landscape and paper-like shapes | CSS gradients, procedural cloud shapes and paper-edge layers |
| Rounded floating header | Keyboard-accessible pill navigation and responsive drawer |
| Modular document previews | Brayro-specific studio workspace, service cards and project panels |
| Typographic calm | First-party Instrument Serif and Manrope fonts |
| Gentle card depth | Subtle elevation, hover response and reduced-motion fallback |
| Clear onboarding CTA | Project enquiry sheet that opens email or WhatsApp by user choice |

Preserve attribution for REA when copying substantial REA code. This project currently copies **no REA source code**.
