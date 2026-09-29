# Blue Spark — public site

The blue-spark.io marketing site. **Static HTML, one stylesheet, vanilla plus
vendored GSAP. No framework, no bundler, no build step, no npm dependency.**

Deploy via **Cloudflare Pages** with these settings:

| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | _(leave blank)_ |
| Build output directory | `.` (repo root) |
| Production branch | `main` |

The deployed output is 23 HTML files, `assets/` (CSS, JS, images), `_redirects`,
`sitemap.xml`, `robots.txt` and this README. Open `index.html` in any modern
browser and the site renders.

## The design system, in three lines

1. **Paper is the default field; ink is earned.** Every readable surface is
   Paper `#FAFAF7`; Code Black `#06080F` appears once per page at most, where a
   claim needs separating from its evidence.
2. **One signal colour.** Deep Blue `#1E3A8A` is a link, a section rule or an
   active marker — never a glow, gradient or beam. Steel `#C5CCD8` is the only
   hairline on ink; Warm White `#FFF8E7` is the text on ink.
3. **States are a designed component.** `In production`, `Planned for 2027`,
   `Not yet published`, `Status unavailable` and the incident words render as
   text-bearing chips wherever evidence is missing. Nothing is faked to fill a
   gap.

Type: Space Grotesk for headings, Inter for body, JetBrains Mono for genuine
identifiers only (version strings, hashes, timestamps). Sentence case
throughout; there is no uppercase styling anywhere in the stylesheet. Motion is
one page-load moment on the Home headline and nothing else that a person did
not ask for.

## The gate

```
python scripts/audit_voice_rules.py
```

Expected on a clean tree:

```
PASS — 23 pages audited, 0 voice-rule violations.
```

Exit `0` when clean, `1` with a numbered `VIOLATIONS (n):` list otherwise. The
rules it enforces (A1-A12), the rules retired from the previous regime and the
gate's known limits are documented in `voice-rules-decision.md`.

## Routes

Twenty-two canonical surfaces, served extensionless, plus one error surface:

`/` · `/product` · `/technology` · `/pricing` · `/founding-500` · `/marketplace`
· `/roadmap` · `/about` · `/community` · `/transparency` · `/download` ·
`/learn` · `/work` · `/legal` · `/enterprise` · `/partners` · `/contact` ·
`/security` · `/status` · `/journal` · `/journal/perspectives` ·
`/journal/lighter-side`, and `404.html` for an unmatched address.

`_redirects` carries the eight 301s for the four renamed legacy paths
(`/useful` → `/work`, `/philosophical` → `/journal/perspectives`, `/comical` →
`/journal/lighter-side`, `/dashboard` → `/transparency`, each with and without
`/.html`) and the 22 explicit 200 rewrites that make every canonical path
resolve. `sitemap.xml` lists the 22 canonical URLs; `robots.txt` allows
everything and points at the sitemap.

## Repo contents

- 23 HTML files — 22 canonical surfaces plus `404.html`.
- `assets/css/styles.css` — the design system: tokens, type roles, layout,
  components, states and the accessibility floor.
- `assets/js/main.js` — the disclosure menus, the mobile menu, the current-page
  marker and the single headline moment.
- `assets/js/cosmos.js` — WebGL nebula and starfield with a 2D fallback, used
  only on `index.html`, `enterprise.html` and `404.html`.
- `assets/js/scene-stars.js` — retained on disk; no page references it.
- `assets/js/vendor/` — GSAP 3.13 (ScrollTrigger, SplitText), vendored so the
  site needs no network for its own scripts.
- `scripts/audit_voice_rules.py` — the gate.
- `voice-rules-decision.md` — what the gate enforces and what it cannot.
- `stubs.md` — what is genuinely outstanding, and what triggers it.

## Browser support and behaviour

Modern Chrome, Edge, Firefox and Safari. Under `prefers-reduced-motion`,
animations and transitions stop and every element renders in its final state.
Under the Save-Data client hint (and `prefers-reduced-data`, where a browser
implements it), the decorative canvas is not drawn. The nav
menus are native `<details>` disclosures, so they work with the keyboard and
with JavaScript disabled; focus is always visible; the skip link reaches the
main region on every page.

`README.md` describes the site as built, not as aspired to. Anything not yet
true is listed in `stubs.md` and rendered on the page as an honest state.

## License

Internal. Pushed only to the verified Cloudflare Pages project.
