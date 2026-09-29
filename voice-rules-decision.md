# Voice-rules decisions — what the audit actually enforces

The repo's gate is `scripts/audit_voice_rules.py`. It is CI-ready and is the
command the project's test runner executes:

```
python scripts/audit_voice_rules.py
```

It exits `0` with `PASS — {N} pages audited, 0 voice-rule violations.` when the
site is clean and exits `1` with a numbered `VIOLATIONS (n):` list when it is
not. `EXPECTED_PAGES = 27` at the v3 baseline (was 23 in v1).

This document describes that gate. Its previous revision described a gate that
did not exist; the correction is recorded below rather than inherited.

## Rules the audit enforces

| ID | Rule | Why it is enforced |
|----|------|--------------------|
| A1 | No trial or free-access framing (`free download`, `start free trial`, `try it free`, `freemium`, `free tier`, `uncapped`, `uncrippled`, `base product is free`, `perpetual`, `lifetime license`, …) | Founder decision 1; blueprint Part 7 and §6.1 — there is no public free trial. |
| A2 | No fixed-millisecond latency claim (`under \d+ ms`, any `\d+ ms`, `sub-second`, `low latency`, `instant response`) | Founder decision 1; blueprint §4.8 / R5 — latency is a website performance topic, not a product promise. |
| A3 | No hype words (`revolutionary`, `game-changing`, `next-gen`, `ai-powered`, `unleash`, `10x`, `best-in-class`, `seamless`, `effortless`, `world-class`, …) | Founder decision 1; blueprint §6.1 unsupported absolutes. Enforced on every page, with no page exception. |
| A4 | No unsupported absolutes (`100% local`, `no cloud round-trip`, `never forgets`, `zero retention`, `entirely offline`, `nothing leaves your computer`, `enterprise-grade`, `guaranteed income`, `unlimited API`, …) | Founder decision 1; blueprint §6.1 and Part 7, and the standing honest-media rules. |
| A5 | No exclamation marks in visible copy | Founder decision 1 keeps this rule; approved copy contains none. |
| A6 | No invented metrics or fabricated proof (any percentage, `Nx`, counts of customers/users/members/installs/downloads, `testimonial`, `star rating`, `trusted by`, hours-saved claims) | Founder decision 1; blueprint §5.2 and §6.2. A documented amendment exempts the programme's own cap — see below. |
| A7 | No subscription noun, on any page, with no allowance | Blueprint Part 3 §04: the word does not appear in approved copy, which says recurring charge or monthly licence instead. |
| A8 | Forbidden markup: `<video>`, `<source>`, `poster=`, `<iframe>`, `<embed>`, `<object>`, media file extensions, YouTube/Vimeo/Wistia/Loom, `<form>`, `<input>`, `<textarea>`, `<select>`, `mailto:`, `tel:`, `href="#"`, `href=""`, `javascript:`, `<style`, ` style=` | Founder decisions 1 and 4; blueprint §4.6, §5.2, Part 7. It is the mechanical expression of "no fabricated media", "no fake UI capture", "no dead form or button destination", and one design system with no page-local styling. |
| A9 | Every referenced local asset (`src`/`href` ending in an image, font, media, CSS or JS extension, excluding remote URLs and `assets/js/vendor/`) must exist on disk | Same clauses: a page may not reference media that is not present. This is what makes "no fabricated screenshots" checkable. |
| A10 | Required head and structure on every page: `<html lang="en">`, a non-empty `<title>`, a non-empty `meta name="description"`, `rel="canonical"` on `https://blue-spark.io`, `name="viewport"`, `id="main"`, `href="/assets/css/styles.css"`; and the HTML page count must equal 27 | Protects the canonical/SEO work in blueprint §6.3 and makes an accidental deletion or an unrewritten page fail loudly. |

A10 page-count value. At the v3 baseline (`4f96aba` carried the v1 value of 23), the page-count value rises to `EXPECTED_PAGES = 27` to account for the four new `/legal/<x>` sub-routes. The `collect_pages()` glob is widened to also include `legal/*.html` so the audit scans the new files. Both edits are additive; the check is otherwise unchanged.
| A11 | Retired CTA labels must not appear (`Request a private demonstration`, `Apply for a guided pilot`, `Request access for your team`, `Book a workflow clinic`, `Submit a workflow`, `Speak with the founder`, `Join the professional waitlist`, `Install free`, `Start for free`, `Upgrade from free`, `Unlimited free`) | Founder decision 1 replaces the old CTA whitelist with the blueprint's action-label set. The negative list is the part that can be machine-enforced honestly. |
| A12 | Every `$` figure must have `currency`, `taxes`, `usage allowance` or `checkout` within 200 characters after it | Founder decision 4 and blueprint §Pricing editor notes: the currency/tax/allowance gap stays explicit, and a bare `$120` cannot ship. |

Two scan views make this possible. `RAW` is the file as read and carries the
markup rules (A8, A9, A10). `TEXT` is `RAW` with `<script>`, `<style>` and HTML
comments removed and all tags stripped, plus the concatenated values of
`<title>`, every `meta[name=description]` and `meta[property^=og:]` content,
every `alt` attribute and every `aria-label`; the prose rules (A1-A7, A11, A12)
run against `TEXT`.

### Rule amendment — A6 and the programme's own cap

A6's count pattern (`N customers|users|members|…`) also matched the founding
programme's own cap, in the two places the blueprint pins verbatim: Part 3 §05
"The first 500 members form Blue Spark's founding community", and the approved
Home section heading "The first 500 will help shape what comes next." Blueprint
3.4.5 states that "500 is a programme cap and not evidence of 500 customers",
and AC 5 requires those headings character-for-character, so the rule as
literally written could not be satisfied by the copy the same blueprint
approves.

The amendment is narrow and recorded here as required: the exemption covers
only `the first 500`, `the first 500 members` and `founding 500`. Any other
count of customers, users, members, installs, downloads, businesses, clients,
subscribers or companies still fails, as does any other proof claim in the
rule. Clause: blueprint §3.6 A6, with Part 3 §05 and §3.4.5.

The exemption is anchored, not a free pass on the phrase. It is implemented as
a negative lookahead (`A6_EXEMPT` in `scripts/audit_voice_rules.py`), so the
exempt phrase is blanked only where a counted noun does not follow it directly.
`The first 500 will help shape what comes next.` and `The first 500 members
form Blue Spark's founding community.` are exempt; `The first 500 customers
have signed up.` is not, and fails A6 on the count noun exactly as any other
invented metric would. The bare form `first 500` is no longer exempt on its own
— only the two programme forms the blueprint pins.

## Rules retired

Each retired rule is deleted outright, together with any allowance that
existed only to service it.

| Retired rule | Where it lived | Superseding clause |
|--------------|----------------|--------------------|
| Prohibited word list `still`, `journey`, `soul` | `scripts/audit_voice_rules.py` (baseline lines 55-57) | Blueprint Part 3 §01 ("part of the day still disappears") and §06 ("still being developed"); founder decision 1. No replacement list. |
| Bright-line mystical list with the `about.html`-only allowance | Baseline lines 51-54 and 72-73 | Blueprint Part 3 §08 editor notes ("Remove public lists of prohibited words") and §14 editor notes ("without mystical origin material"). The prohibition is editorial; the copy contains no such material, so the gate has nothing to enforce. |
| Hype-word allowance on `product.html` | Baseline lines 75-76 | Blueprint Part 3 §02 editor notes: the public "Words we don't" list is removed, so A3 applies to every page with no exceptions. |
| `one-time` allowance on `marketplace.html` | Baseline lines 78-79 | Blueprint Part 3 §06 editor notes: fixed fees and payout specifics are removed. Every page is now subject to A1 and A11. |
| `subscription` noun machinery and its two allowances | Baseline lines 60-61 and 82-98 | Blueprint Part 3 §04: the word does not appear in approved copy. Replaced by unconditional A7. |
| `perpetual`, `one-time purchase`, `lifetime license`, `$120 flat` as perpetual-era pricing language | Baseline lines 39-41 | Blueprint Part 3 §04 and §06. `perpetual`, `lifetime license` and `one-time purchase` move into A1; `$120 flat` is replaced by the stronger A12 qualifier rule. |
| The documented positive CTA whitelist | `voice-rules-decision.md` §8 and §14 (documentation only) | Founder decision 1. Not implemented as a positive whitelist — see the correction below. Replaced by A11 plus the editorial label set in blueprint §3.4.0. |
| Historical/superseded-language allowance | Baseline documentation §"Audit allowances" | Blueprint Part 3 and §6.1 remove the material that needed it; no page carries historical framing blocks after the rewrite. |

## Correction — the CTA-whitelist overclaim

The previous revision of this file stated, in §8 and §14, that "the audit
script enforces this list against every page", referring to the brand-bible
§C4.7 CTA whitelist.

**That was inaccurate.** `scripts/audit_voice_rules.py` contained no code path
that read, listed or matched a positive CTA whitelist. The claim described an
intention, not the file.

What is true now:

- The blueprint's action-label set is an **editorial** rule. It is specified in
  `blueprint.md` §3.4.0 (the action resolution table) and is reviewed by reading
  the pages; it is not machine-enforced as a whitelist.
- The **machine-enforced** part is the negative list A11, which fails the build
  if a retired CTA label appears anywhere.
- This file no longer claims enforcement that does not exist.

## Known limits of this gate

- It reads **text and markup only**. It cannot confirm that a destination
  exists, that a form works, that a figure is true, or that a rendered page is
  legible.
- It cannot verify that a redirect resolves at the edge, that an action label
  matches the destination the action resolution table names, or that a state
  chip is correct for its subject. Those are the Inspector's checks (blueprint
  Section 8, AC 6-9 and AC 18).
- It cannot measure contrast, keyboard order, reflow or reduced-motion
  behaviour. Those are covered by AC 11, AC 12, AC 14 and AC 16.
- It scans `*.html` at the repo root plus `journal/*.html`. A new page added in
  a new directory would not be audited until the glob is extended, but the page
  count check (A10) fails first, which is the intended alarm.

## Superseded site-side answers

Each answer below was written under the retired regime and is now superseded.
The last one still stands.

| Former answer | Status | Clause that replaced it |
|---------------|--------|--------------------------|
| Hero challenger line: `/` uses "Clarity, on your machine." with "Less cloud. More clarity." held in reserve | Superseded | Blueprint Part 3 §01 pins the H1 "You lead. Blue Spark gets to work." |
| Pratfall placement: "If you want ChatGPT, use ChatGPT." on `/about` only | Superseded | Blueprint Part 3 §08 editor notes remove the dismissive competitor exit line. |
| Medallion usage: tier-1 medallion on the `/` and `/about` heroes | Superseded | Blueprint §4.5 forbids falling back to an older medallion, and §3.4.1 replaces the hero visual with a designed honest state. `medallion.png` is referenced by no page. |
| Latency: "low latency, scaled to your local hardware" | Superseded | Blueprint §4.8 / R5 make latency a website performance topic; A2 now bans latency promises outright. |
| Pricing framing: Pro is "the cost of keeping your spark bright", not a subscription | Superseded | Blueprint Part 3 §04 states the offer plainly as `$120 per month`, a paid monthly licence, with the published price terms not yet finalised. A7 bans the noun unconditionally; A12 requires the qualifier. |
| Dashboard placeholders: "publishes with the first reporting cycle" | Superseded | Blueprint §3.4.10 retires the metrics wall entirely; `/dashboard` becomes `/transparency` with no metric values at all. |
| Founder access description: structured office hours, clinics, track sessions, selected one-to-one calls | Superseded | Blueprint Part 3 §05 describes founder-led interaction as structured group sessions, and states what membership does not promise. |
| Footer credit "by ben" as a subordinate, lowercase founder credit | **Standing** | Blueprint §4.5 keeps the founder credit subordinate and out of the core mark, which is what the footer does. |
| Home-page and global `.nav-action` primary CTA as `Apply for Founding 500` → `/founding-500` | **Superseded** | Blueprint §3.3.3 (Action Resolution Table): v3 retires `Apply for Founding 500` from the home hero and from every global `.nav-action`. The label survives deliberately on `/founding-500`, the two Pricing offer cards, and the `/work` closing. Every `.nav-action` (27 places) becomes `Get Blue Spark → /pricing`. |

## Brand-bible allowances that no longer exist

The following were the audit's permissions under brand bible v1.2. None of them
is present in the current script, and none is needed: the copy that required
them was removed by the rewrite rather than being allowed through the gate.

- Bright-line words on `about.html` — the published don't-use list is gone.
- Hype words on `product.html` — the "Words we don't" list is gone.
- `one-time purchase` and marketplace pricing models on `marketplace.html` —
  no prices, fees or payout terms are published on that page.
- The quoted FAQ question "Is this a subscription?" on `pricing.html` — the
  question is now "Is this a recurring charge?"
- Audience-rejection subscription phrases on `index.html` — removed.
- CSS `--d:NNNms` reveal delays and the `<!DOCTYPE html>` exclamation — no
  longer relevant; the tag-strip removes markup before the prose scan, and the
  stylesheet declares no reveal delays.
- The `[INTERNAL DRAFT SPECIFICATION]` block — no page ships one.

Everything not listed as enforced above is a build failure with a non-zero
exit.
