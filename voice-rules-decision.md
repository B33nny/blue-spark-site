# Voice-rules decisions — site-side answers

Where the site itself settles open business-plan questions, and where the audit script's allowances come from. Last amended 2026-09-12 (paid-access amendment).

## Strict-mode answers

1. **Hero challenger line.** `/` uses "Clarity, on your machine." as the canonical headline (brand bible §A2). The challenger "Less cloud. More clarity." is reserved and not surfaced on v1 pages.
2. **Pratfall placement.** "If you want ChatGPT, use ChatGPT." appears on `/about` only, in its own full-bleed band. Enforced by the audit's structure (the phrase is on one page and nowhere else).
3. **Founder signature.** "by ben" ships as a footer credit (mono, lowercase, JetBrains Mono) on every page. No placement guess in nav/favicon/top bar — the deferral (BS-BP §10.2 #7) is honored, and `/about` §A7 names the reservation.
4. **Medallion usage.** Tier-1 medallion PNG on `/` hero and `/about` hero only. Ringless star in nav, favicon, footer. No rotation/skew of the medallion — float + glow pulse only. The v1 bronze JPG is not referenced anywhere.
5. **Latency.** Zero millisecond numbers anywhere; "low latency, scaled to your local hardware" only.
6. **Pricing framing.** Pro is "the cost of keeping your spark bright," not a subscription. Subscription *cadence* is disclosed where relevant (recurring billing, cancellation, refunds); the noun "subscription" as a label for Pro is avoided. The single historic "subscription" occurrence on `/pricing` (the FAQ question) is preserved per sitemap §4.7 — the question is quoted; the *answer* uses the official framing. The audience-rejection phrases ("Subscription-comfortable users", "monthly consumer subscription") on `/` come from the locked home draft and describe users we turn away — not a label for Pro.
7. **No invented numbers.** `/dashboard` shows "publishes with the first reporting cycle" placeholders and a placeholder launch-projection row (no specific 200/500/$24K/$60K headline). No counting animations on metrics — they land instantly.
8. **CTA whitelist.** Public CTAs must come from the brand-bible v1.2 §C4.7 whitelist. Approved CTAs: Apply for Founding 500 · Request a private demonstration · Apply for a guided pilot · Request access for your team · Book a workflow clinic · Submit a workflow · Speak with the founder · Join the professional waitlist. The audit script enforces this list against every page.
9. **Prohibited CTAs.** Install free · Start for free · Free access · Free trial · Upgrade from free · Freemium · Free base tier · Unlimited free · No-cost access · Free download · Start free trial · Uncrippled free. None of these may appear in copy, button labels, or hero text. The audit script enforces this list.
10. **Marketplace non-promises.** No phrase may imply a guaranteed creator income, guaranteed revenue share, guaranteed lifetime status, guaranteed marketplace listing, or fixed fee / payout schedule before founder decision §11 is approved (brand bible v1.2 §C4.9). The audit script enforces this list.
11. **Founder access.** Founder access in Founding 500 is described as structured (office hours, workflow clinics, track sessions, private community, selected one-to-one calls). "On-demand personal support" or "1:1 access" without qualification is prohibited.

## Audit allowances (scripts/audit_voice_rules.py)

| Allowance | Why |
|-----------|-----|
| Bright-line words on about.html | Required published don't-use list (sitemap §7.4) — the brand publishing its own guardrails |
| Hype words on product.html | Required "Words we don't" list (product draft §"The voice we use") |
| "one-time purchase" on marketplace.html | Creator skill pricing models (marketplace draft §M1), never applied to Pro (per brand bible v1.2 §C4.9) |
| "monthly rental" or similar on marketplace.html | Marketplace creator pricing models — never applied to Blue Spark Pro or team/firm plans |
| FAQ question "Is this a subscription?" on pricing.html | Sitemap §4.7 / §4.8 — the question is quoted; the answer uses the official framing |
| Audience-rejection subscription phrases on index.html | Locked home draft §1.4 verbatim (v1.2 + historical §HISTORICAL block) |
| CSS `--d:NNNms` reveal delays | Style attributes, not latency claims — stripped before scanning |
| `<!DOCTYPE html>` "!" | Markup declaration, not copy — stripped before scanning |
| "Founding 500" naming + "Founding 500" CTAs | Required brand-bible §C4.7 / §C4.8 language |
| "Submit a workflow" CTAs | Required brand-bible §C4.7 / §C4.8 intake language |
| "Apply for Founding 500" CTAs | Required brand-bible §C4.7 intake language |
| Historical framing paragraphs (clearly marked HISTORICAL or superseded) | The brand-bible v1.2 §C4.7 audit allowance permits historical / superseded language in clearly marked blocks. |

Everything else is a hard failure with a non-zero exit, CI-ready.

## Placeholder / draft-spec allowances (gating pages)

For pages that are `[INTERNAL DRAFT SPECIFICATION]` (e.g., `/pricing` until founder decisions clear), the audit script must enforce the same prohibitions even on placeholder content — until founder approval. A page may not ship with a `[INTERNAL DRAFT SPECIFICATION]` block on it; it must ship with the approved copy or not at all.

Every CTA on the live page must remain on the §C4.7 whitelist. Pricing Source of Truth records (Marketing OS §2.1) gate publishing of any commercial term as fact. The placeholder rows on `/dashboard` are clearly labeled with the live data path so the page never lies about a number it doesn't have.
