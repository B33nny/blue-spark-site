# Stubs — what is deliberately not built yet

Every `[planned]` surface from the sitemap, with what triggers it. Nothing here is faked on the live pages.

| Stub | Where | What ships it |
|------|-------|---------------|
| GitHub org URL | all `https://github.com` links | Org publish |
| `/pricing` page (full draft) | `/pricing` | Pricing Source of Truth approved + `decisions/FOUNDER_DECISIONS_2026-09-12.md` Required Follow-Up Decisions §2, §3, §4, §5, §17 clear. **Status: `[INTERNAL DRAFT SPECIFICATION]` only.** |
| `/founding-500` page (full draft) | `/founding-500` | Founder decisions §7 (initial industry priority) + §9 (contributor IP terms) + form-tooling decision. **Status: spec-only.** |
| Live dashboard metrics | `/dashboard` §D1/D5 | First reporting cycle (payment-processor + Founding 500 application feed). No "free-tier installs" line — no public free tier exists. |
| SHA-256 hash value | `/download` §10.2 | Release artifact publication |
| Release notes page | `/download` changelog | v1.0.5 public release |
| Skill catalog grid | `/marketplace` §5.7 (stub slots render empty) | Q1 2027 launch with founding-community-informed rules (no specific date publicly committed until Prerequisites §11 cleared) |
| Marketplace plan deep-link | `/community` §C2, `/marketplace` §M3 | Preliminary plan publish, Nov 1, 2026 |
| Structured-feedback / working-group session calendar | `/community`, `/marketplace` | Nov 15, 2026 publish |
| Founding 500 application form | `/founding-500`, `/contact` | Qualification rule signed off + tooling chosen |
| Manifest full text | `/philosophical` | Sept 1, 2026 publish |
| Useful / Comical archives + RSS | `/useful`, `/comical` | Launch sequence, Sept–Oct 2026 |
| Live status page with history | `/legal.html#status` | Public launch |
| Full terms text | `/legal.html#terms` | v1.0.5 — Legal review per founder-decisions log Required Follow-Up Decisions §15 |
| Press-kit asset downloads | `/about` §A8 | Wordmark SVG + ringless-star SVG cut (brand bible §C6 #11, #12) |
| Level-3 subroutes | sitemap §3 (e.g. `/technology/memory`, `/pricing/pro`) | Post-V1; anchors exist in page sections where sensible |
| Founder signature placement | nav/favicon "by ben" — currently footer credit only | Founder decision (BS-BP §10.2 #7) |
| Discord / Telegram / Substack / YouTube links | `/community` §C5 | Channel openings per compliance ladder |

## Pages that must not ship until commercial terms are approved

The following pages are gated on founder-decisions log Required Follow-Up Decisions closing, and the Pricing Source of Truth (`marketing-os/BUILD_PROMPT.md` §2.1, `marketing-os/docs/IMPLEMENTATION_PLAN.md`) approving the field-by-field text:

- `/pricing`
- `/founding-500` (qualification form)
- `/download` (any commercial or refund framing)
- `/legal/terms`
- `/legal/refund` *(new — required for paid-access pages; not in v1)*
- Founder signature visibility (any placement decision)

Until then, each must carry either a placeholder CTA from the brand-bible §C4.7 whitelist or a `[INTERNAL DRAFT SPECIFICATION]` block per the sitemap.
