# Stubs — what is genuinely outstanding

Every entry below is something the site does **not** have yet, what triggers it,
and where the relevant state currently sits. Nothing in this list is faked on a
page: items with a reserved panel render as a designed state, and the rest are
simply absent until the real thing exists.

## Release and verification

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| The released installer and its published fields (version, date, file size, publisher, SHA-256) | `/download` — no release table is rendered yet; the page describes the access routes | Publication of the actual distributed artifact |
| A public installation route once an artifact exists | `/download` | Same artifact, plus a decision to serve it publicly |
| Supported Windows versions and requirements for the current release | Not published anywhere | Verification against the release that is actually distributed |

## Product evidence

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Interface capture | No reserved panel is rendered; the home opening carries the Blue Spark star mark instead | A real capture from the current UI, with its release caption |
| Readable example outputs | No reserved panel is rendered | A real output that can be shown at normal size |
| The workflow film and its written transcript | No reserved panel is rendered | A recorded demonstration, with a transcript, published with the customer release |

## People and identity

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Founder portrait | No portrait is published and no reserved field renders yet | An approved portrait |
| Founder biography (background, credentials) beyond the note on `/about` | Not written anywhere | Details supplied and approved by the founder |
| Partner introduction (name, role, credentials) | Mentioned as "our partner" on `/about`, `/community`, `/founding-500`; no introduction is published | The partner introduction being supplied |
| Approved logo master | The nav uses `assets/img/mark-128.png` and the home opening uses `assets/img/star-704.webp` (the star master downscaled to its display size); the full-size `assets/img/star.png` and `assets/img/medallion.png` are referenced by no page | Founder-approved artwork |

## Intake and contact routes

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Founding 500 application form (name, email, professional role, optional company, one workflow) | `/founding-500` — the fields are published as a static specification, `Not yet published` | An operational intake route and its tooling |
| Distribution enquiry route | `/partners#enquiry` routes discussion to the contact route, which is not open yet | An operational enquiry route |
| Contact routes and their destinations | `/contact#enquiry` — the enquiry routes are described; the destination block is `Not yet published` | Real, verified destinations, published before any address is printed |
| Support and enterprise destinations | `/contact` | Same |
| Security disclosure route | `/security#disclosure` — no report control is rendered; the route text directs to the contact route | A verified, monitored disclosure address |

## Service truth

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Status monitoring or a maintained incident feed | `/status` — reads `Status unavailable`; no uptime figure appears | A real monitoring source; the page states that categories publish once they are connected to monitoring |
| A real last-confirmed-update timestamp | `/status` — no timestamp is rendered yet | The same monitoring source, with a time zone per entry |

## Commercial and legal

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| The four legal documents (terms, privacy notice, licence, professional-use notice) — now honest-state pages at `/legal/terms`, `/legal/privacy`, `/legal/licence`, `/legal/professional-use` | Each sub-route — `Not yet published` with the supplier identity / jurisdiction sentence | Supplier identity and jurisdiction, then the final document text |
| Currency, tax treatment and the included usage allowance for the monthly licence | `/pricing` and `/founding-500` — the amount is published with its qualifier clause: "Currency, taxes and included usage are confirmed at the offer before payment." | The published price terms |
| Checkout and purchase controls | Not rendered anywhere | A complete offer, with currency, taxes and allowance stated before checkout |
| Creator marketplace | `/marketplace` — the whole surface is `Planned for 2027` | The planned 2027 marketplace and its published terms |

## Editorial

| Stub | Where the state sits | What triggers it |
|------|----------------------|------------------|
| Further Learn lessons beyond the published guide | `/learn` — carries one complete guide; no reserved states render for further lessons | Each further lesson being complete |
| Further Perspectives articles | `/journal/perspectives` — carries the published piece "Ambition needs room."; no reserved states render | Further articles being written and approved |
| Further pieces on The lighter side | `/journal/lighter-side` — carries a published piece; no reserved states render | Further pieces being produced |
| Journal category "From the team" | Not present on `/journal` yet | Approved product news |
| A newsletter | Not present anywhere | Explicit opt-in plus a real delivery and unsubscribe path |

## Deliberately not built

- No customer account portal, and no sign-in link (blueprint §2.1: show one
  only when it reaches a functioning account destination).
- No analytics or tracking scripts.
- No separate application or build pipeline for any of the above.
