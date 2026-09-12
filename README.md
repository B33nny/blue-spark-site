# Blue Spark — Public Site

The Blue Spark marketing site. **Futuristic cockpit aesthetic, WebGL cosmos background, GSAP scroll choreography — zero framework, zero build, zero trackers.**

Deploy via **Cloudflare Pages** with these settings (no build step required):

| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | _(leave blank)_ |
| Build output directory | `.` (repo root) |
| Production branch | `main` |

The deployed output is `index.html` plus 14 sibling HTML files, `assets/` (CSS, JS, images), and this README. Open `index.html` in any modern browser and the page renders.

## Repo contents

- `index.html` and 14 sibling HTML files — the 11 primary routes plus 3 tonal-track hubs and a legal/security/status hub.
- `assets/css/styles.css` — design system (Deep Blue + Steel + Spark palette, Space Grotesk / Inter / JetBrains Mono).
- `assets/js/cosmos.js` — full-screen WebGL nebula + starfield; 2D canvas fallback for browsers without WebGL.
- `assets/js/main.js` — GSAP ScrollTrigger choreography, nav, reveals.
- `assets/js/scene-stars.js` — 240-star compass field on the About hero.
- `assets/js/vendor/` — GSAP 3.13 (ScrollTrigger, SplitText) vendored locally so the site works without a network on first paint.
- `scripts/audit_voice_rules.py` — voice-rules audit (CI-ready).
- `README.md` — this file.
- `stubs.md` — every planned surface and what triggers it.
- `voice-rules-decision.md` — audit allowances and site-side answers to open questions.

## Browser support

Modern Chrome / Edge / Firefox / Safari. View Transitions API is used for cross-route morphs (degrades gracefully). Under `prefers-reduced-motion`, every animation switches to fully readable static rendering. Under `prefers-reduced-data` or slow-2g, non-tier-1 images and decorative animations switch off.

## License

Internal. Pushed only to the verified Cloudflare Pages project.
