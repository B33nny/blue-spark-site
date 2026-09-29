# Stubs — what is genuinely outstanding

Every entry below is something the site does **not** have yet, what triggers it,
and where the honest state currently sits. Nothing in this list is faked on a
page; each item is rendered as a designed state until the real thing exists.

## Release and verification

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| The released installer and its published fields (version, date, file size, publisher, SHA-256) | `/download#release` — `Not yet published` on every table row | Publication of the actual distributed artifact |
| A public installation route once an artifact exists | `/download#release` | Same artifact, plus a decision to serve it publicly |
| Supported Windows versions and requirements for the current release | Not published anywhere | Verification against the release that is actually distributed |

## Product evidence

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Interface captures (a capture is reserved on four surfaces) | Home opening, Product three-stage gallery, Work in practice, Transparency | Real captures from the current UI, each with its release caption |
| Readable example outputs | Home, Product, Work in practice | A real output that can be shown at normal size |
| The workflow film and its written transcript | Home, Product, Work in practice, The lighter side | A recorded demonstration, with a transcript, published with the customer release |

## People and identity

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Founder portrait | `/about` — `Not yet published` with the caption field reserved | An approved portrait |
| Founder profile and biography beyond "Ben is the founder" | Not written anywhere | Details supplied and approved by the founder |
| Partner introduction (name, role, credentials) | `/about`, `/community`, `/founding-500` — `Not yet published` | The partner introduction being supplied |
| Approved logo master | The nav uses the existing `assets/img/star.png` | Founder-approved artwork; `assets/img/medallion.png` is now referenced by no page |

## Intake and contact routes

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Founding 500 application form (name, email, professional role, optional company, one workflow) | `/founding-500` — the fields are published as a static specification, `Not yet published` | An operational intake route and its tooling |
| Distribution enquiry form (customer group, operating area, proposed role, optional forecast volume) | `/partners#enquiry` — static field list, `Not yet published` | An operational enquiry route |
| Contact routes and their destinations | `/contact` — the five routes are described; the destination block is `Not yet published` | Real, verified destinations, published before any address is printed |
| Support, press and enterprise destinations | `/contact` | Same |
| Security disclosure route | `/security#disclosure` — `Not yet published`; no report control is rendered | A verified, monitored disclosure address |

## Service truth

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Status monitoring or a maintained incident feed | `/status` — every category reads `Status unavailable`; no uptime figure appears | A real monitoring source; the page states that categories publish once they are connected to monitoring |
| A real last-confirmed-update timestamp | `/status` — `Last confirmed update: not yet published` | The same monitoring source, with a time zone per entry |

## Commercial and legal

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| The four legal documents (terms, privacy notice, licence, professional-use notice) — now honest-state pages at `/legal/terms`, `/legal/privacy`, `/legal/licence`, `/legal/professional-use` | Each sub-route — `Not yet published` with the supplier identity / jurisdiction sentence | Supplier identity and jurisdiction, then the final document text |
| Currency, tax treatment and the included usage allowance for the monthly licence | `/pricing` and `/founding-500` — the amount is published with its qualifier clause: "Currency, taxes and included usage are confirmed at the offer before payment." | The published price terms |
| Checkout and purchase controls | Not rendered anywhere | A complete offer, with currency, taxes and allowance stated before checkout |
| Creator marketplace | `/marketplace` — the whole surface is `Planned for 2027`, with one labelled illustrative concept | The planned 2027 marketplace and its published terms |

## Editorial

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| The four Learn guides | `/learn#guides` — each is `Not yet published` with its introduction published | Each lesson being complete |
| Perspectives articles | `/journal/perspectives` — three introductions, each `Not yet published` | Each article being written and approved |
| The lighter side pieces | `/journal/lighter-side` — three prompts, each `In production` | Each piece being produced |
| Journal category "From the team" | `/journal` — `Not yet published`, no destination | Approved product news |
| A newsletter | Not present anywhere | Explicit opt-in plus a real delivery and unsubscribe path |

## Deliberately not built

- No customer account portal, and no sign-in link (blueprint §2.1: show one
  only when it reaches a functioning account destination).
- No analytics or tracking scripts.
- No separate application or build pipeline for any of the above.
