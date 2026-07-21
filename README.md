# ARCH-COMP website

Source for <https://arch-comp.github.io/> — the international friendly competition on the
**Applied Verification of Continuous and Hybrid Systems** (ARCH-COMP), held annually since 2017 as
part of the [ARCH workshop](https://cps-vo.org/group/ARCH).

Static site (plain HTML/CSS/JS), published via GitHub Pages from the `main` branch root.

## Structure
- `index.html` — the single-page site
- `styles.css`, `script.js` — styling and interactions
- `logo.svg` (blue→teal gradient) / `logo-white.svg` (header) — the ARCH logo, recolored
- `favicon.*`, `apple-touch-icon.png`, `images/og-card.png` — icons and social card

## Local preview
Open `index.html` in a browser, or run `python -m http.server` in this directory and visit
<http://localhost:8000>.

## Editing content
All content lives in `index.html`. Brand colors are CSS variables at the top of `styles.css`
(`--brand` blue `#2563eb` → `--brand-dark` teal `#0d9488`, matching the submission platform).
