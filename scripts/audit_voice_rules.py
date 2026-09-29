#!/usr/bin/env python3
"""Blue Spark — voice-rules audit (the repo's CI gate).

Run from the repo root:

    python scripts/audit_voice_rules.py

Exit 0 with ``PASS — {N} pages audited, 0 voice-rule violations.`` when clean.
Exit 1 with a numbered ``VIOLATIONS (n):`` list when not.

The rules below are the ones the current blueprint approves. They replace the
superseded brand-bible v1.2 regime (prohibited-word lists, a positive CTA
whitelist, free-tier allowances); the removals and the reasoning are recorded
in ``voice-rules-decision.md``.

Two scan views are used:

  RAW   — the file exactly as read. Attribute and markup rules run against it.
  TEXT  — RAW with <script>, <style> and HTML comments removed, then all tags
          removed, plus the concatenated values of <title>, every
          meta[name=description] and meta[property^=og:] content, every alt
          attribute and every aria-label. Prose rules run against TEXT.

Known limits, stated so the gate is not read as broader than it is: this
script reads text and markup only. It cannot confirm that a destination
exists, that a form works, or that a figure is true. Those are the Inspector's
checks (blueprint Section 8, AC 6-9).
"""
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent

EXPECTED_PAGES = 23

# --------------------------------------------------------------------------
# Rule definitions
# --------------------------------------------------------------------------

# A1 — no trial or free-access framing.
A1 = [
    r"free\s+download",
    r"start\s+(your\s+)?free\s+trial",
    r"try\s+it\s+free",
    r"try\s+free",
    r"get\s+it\s+free",
    r"free\s+install",
    r"freemium",
    r"free\s+base\s+tier",
    r"free\s+tier",
    r"free\s+plan",
    r"no-?cost\s+access",
    r"uncapped",
    r"uncrippled",
    r"base\s+product\s+is\s+free",
    r"perpetual",
    r"one[- ]time\s+purchase",
    r"lifetime\s+license",
]

# A2 — no fixed-millisecond latency claim.
A2 = [
    r"under\s+\d+\s*ms",
    r"\b\d{2,4}\s*ms\b",
    r"sub-second",
    r"millisecond",
    r"low\s+latency",
    r"instant(aneous)?\s+response",
]

# A3 — no hype words.
A3 = [
    r"revolutionary",
    r"game[- ]changing",
    r"next[- ]gen",
    r"ai[- ]powered",
    r"\b10\s*[x\u00d7]\b",
    r"unleash",
    r"transform\s+your\s+workflow",
    r"fastest",
    r"benchmark[- ]leading",
    r"smartest",
    r"best[- ]in[- ]class",
    r"most\s+powerful",
    r"largest\s+context\s+window",
    r"cutting[- ]edge",
    r"seamless(ly)?",
    r"effortless(ly)?",
    r"supercharge",
    r"turbocharge",
    r"world[- ]class",
]

# A4 — no unsupported absolutes.
A4 = [
    r"100%\s*local",
    r"100%\s*uptime",
    r"no\s+cloud\s+round-?trip",
    r"never\s+forgets",
    r"works\s+on\s+every\s+(office\s+)?computer",
    r"no\s+other\s+ai\s+has\s+initiative",
    r"guaranteed\s+income",
    r"unlimited\s+api",
    r"unlimited\s+usage",
    r"enterprise[- ]grade",
    r"zero\s+retention",
    r"entirely\s+offline",
    r"nothing\s+leaves\s+your\s+(device|computer)",
    r"no\s+one\s+can\s+access",
    r"military[- ]grade",
    r"bank[- ]level",
    r"bulletproof",
    r"flawless",
]

# A6 — no invented metrics or fabricated proof.
A6 = [
    r"\d+(?:\.\d+)?\s*%",
    r"\b\d+\s*[x\u00d7]\b",
    r"\b\d[\d,]*\s*\+?\s*(customers|users|installs|downloads|members|businesses|clients|subscribers|companies)\b",
    r"testimonial",
    r"star\s+rating",
    r"trusted\s+by",
    r"\d+\s*(hours?|minutes?|seconds?)\s*(saved|faster)",
]

# A6 amendment (recorded in voice-rules-decision.md): the programme's own cap
# is not a proof metric. Blueprint Part 3 §05 opening ("The first 500 members
# form Blue Spark's founding community") and the approved Home section heading
# ("The first 500 will help shape what comes next.") both name the programme
# cap in front of the word "members", and blueprint 3.4.5 states "500 is a
# programme cap and not evidence of 500 customers". Without this exemption the
# rule would fail the copy the same blueprint pins character-for-character in
# AC 5. The exemption is confined to those canonical programme forms, and the
# negative lookahead stops it swallowing an adjacent count noun: "the first 500
# customers" is NOT exempt and still fails. Any other count of customers, users,
# members, installs, downloads, businesses, clients, subscribers or companies
# fails as before.
A6_EXEMPT = (
    r"(?:the\s+first\s+500(?:\s+members)?|founding\s+500)"
    r"(?!\s*(?:customers|users|installs|downloads|businesses|clients|subscribers|companies)\b)"
)

# A7 — no subscription noun, on any page, with no allowance.
A7 = [r"\bsubscription\b"]

# A11 — retired CTA labels.
A11 = [
    r"request\s+a\s+private\s+demonstration",
    r"apply\s+for\s+a\s+guided\s+pilot",
    r"request\s+access\s+for\s+your\s+team",
    r"book\s+a\s+workflow\s+clinic",
    r"submit\s+a\s+workflow",
    r"speak\s+with\s+the\s+founder",
    r"join\s+the\s+professional\s+waitlist",
    r"install\s+free",
    r"start\s+for\s+free",
    r"upgrade\s+from\s+free",
    r"unlimited\s+free",
]

# A8 — forbidden markup (no fabricated media, no dead destinations, no
# page-local styling, no non-existent form controls).
A8 = [
    r"<video",
    r"<source",
    r"poster\s*=",
    r"<iframe",
    r"<embed",
    r"<object",
    r"\.(?:mp4|webm|mov|m4v|gif)\b",
    r"youtube\.com",
    r"youtu\.be",
    r"vimeo\.com",
    r"wistia",
    r"loom\.com",
    r"<form",
    r"mailto:",
    r"tel:",
    r'href\s*=\s*"#"',
    r"href\s*=\s*\"\"",
    r"href\s*=\s*'#'",
    r"javascript:",
    r"<style",
    r"\sstyle\s*=",
    r"<input",
    r"<textarea",
    r"<select",
]

PROSE_RULES = [
    ("A1", "No trial or free-access framing", A1),
    ("A2", "No fixed-millisecond latency claim", A2),
    ("A3", "No hype words", A3),
    ("A4", "No unsupported absolutes", A4),
    ("A6", "No invented metrics or fabricated proof", A6),
    ("A7", "No subscription noun", A7),
    ("A11", "Retired CTA label", A11),
]

RULE_LABELS = {
    "A1": "No trial or free-access framing",
    "A2": "No fixed-millisecond latency claim",
    "A3": "No hype words",
    "A4": "No unsupported absolutes",
    "A5": "No exclamation marks in visible copy",
    "A6": "No invented metrics or fabricated proof",
    "A7": "No subscription noun",
    "A8": "Forbidden markup",
    "A9": "Referenced local asset must exist",
    "A10": "Required head and structure",
    "A11": "Retired CTA label",
    "A12": "Price needs its qualifier",
}

STATIC_ASSET = re.compile(r"\.(?:png|jpg|jpeg|webp|avif|svg|ico|mp4|webm|woff2?|css|js)$", re.I)
VENDOR_PREFIX = "/assets/js/vendor/"

PRICE = re.compile(r"\$\d[\d,]*")
PRICE_QUALIFIERS = ("currency", "taxes", "usage allowance", "checkout")


# --------------------------------------------------------------------------
# Scan views
# --------------------------------------------------------------------------

def strip_to_text(raw):
    """RAW -> visible text: drop code blocks, comments and tags."""
    text = re.sub(r"<script\b[^>]*>.*?</script>", " ", raw, flags=re.S | re.I)
    text = re.sub(r"<style\b[^>]*>.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    text = re.sub(r"<[^>]*>", " ", text, flags=re.S)
    return text


def attr(tag, name):
    """Read one attribute value out of a raw tag string."""
    m = re.search(r'\b' + name + r'\s*=\s*"([^"]*)"', tag, flags=re.I)
    if m:
        return m.group(1)
    m = re.search(r"\b" + name + r"\s*=\s*'([^']*)'", tag, flags=re.I)
    return m.group(1) if m else ""


def text_view(raw):
    """TEXT = stripped prose plus the attribute/head values a reader sees."""
    parts = [strip_to_text(raw)]

    m = re.search(r"<title\b[^>]*>(.*?)</title>", raw, flags=re.S | re.I)
    if m:
        parts.append(m.group(1))

    for tag in re.findall(r"<meta\b[^>]*>", raw, flags=re.I):
        name = attr(tag, "name").strip().lower()
        prop = attr(tag, "property").strip().lower()
        if name == "description" or prop.startswith("og:"):
            parts.append(attr(tag, "content"))

    for tag in re.findall(r"<img\b[^>]*>", raw, flags=re.I):
        parts.append(attr(tag, "alt"))

    for tag in re.findall(r"<[a-zA-Z][^>]*>", raw):
        if "aria-label" in tag.lower():
            parts.append(attr(tag, "aria-label"))

    return " \n ".join(parts)


# --------------------------------------------------------------------------
# Per-page audit
# --------------------------------------------------------------------------

def snippet(text, start, end):
    before = text[max(0, start - 40):start]
    match = text[start:end]
    after = text[end:end + 40]
    clean = lambda s: re.sub(r"\s+", " ", s).strip()
    return "..." + clean(before) + clean(match) + clean(after) + "..."


def audit_page(path):
    raw = path.read_text(encoding="utf-8", errors="replace")
    text = text_view(raw)
    rel = path.relative_to(SITE).as_posix()
    problems = []

    # --- prose rules -------------------------------------------------------
    for rule_id, label, patterns in PROSE_RULES:
        subject = text
        if rule_id == "A6":
            # Blank the exempt phrases without changing any offsets, so the
            # reported context stays aligned with the sentence a reader sees.
            subject = re.sub(A6_EXEMPT, lambda m: " " * len(m.group(0)), text, flags=re.I)
        for pat in patterns:
            for m in re.finditer(pat, subject, flags=re.I):
                problems.append((rel, rule_id, label, snippet(text, m.start(), m.end())))

    # A5 — exclamation marks in visible copy.
    for m in re.finditer(r"!", text):
        problems.append((rel, "A5", RULE_LABELS["A5"], snippet(text, m.start(), m.end())))

    # A12 — every price figure carries its currency/tax/allowance qualifier.
    for m in re.finditer(PRICE, text):
        window = text[m.end():m.end() + 200].lower()
        if not any(q in window for q in PRICE_QUALIFIERS):
            problems.append((rel, "A12", RULE_LABELS["A12"], snippet(text, m.start(), m.end())))

    # --- markup rules ------------------------------------------------------
    for pat in A8:
        for m in re.finditer(pat, raw, flags=re.I):
            problems.append((rel, "A8", RULE_LABELS["A8"], snippet(raw, m.start(), m.end())))

    # A9 — every referenced local asset exists on disk.
    for m in re.finditer(r'(?:src|href)\s*=\s*"([^"]+)"', raw, flags=re.I):
        value = m.group(1).strip()
        if value.startswith(("http", "//", "#")) or value.startswith(VENDOR_PREFIX):
            continue
        if not STATIC_ASSET.search(value):
            continue
        target = SITE / value.lstrip("/")
        if not target.exists():
            problems.append((rel, "A9", RULE_LABELS["A9"],
                             "...missing asset %s..." % value))

    # A10 — required head and structure per page.
    required = [
        (re.search(r"<html\b[^>]*\blang\s*=\s*[\"']en[\"']", raw, re.I) is not None,
         'missing <html lang="en">'),
        (bool(re.search(r"<title\b[^>]*>\s*\S.*?</title>", raw, flags=re.S | re.I)),
         "missing or empty <title>"),
        (bool(re.search(r"<meta\b[^>]*\bname\s*=\s*[\"']description[\"'][^>]*\bcontent\s*=\s*[\"'][^\"']+[\"']",
                        raw, flags=re.I))
         or bool(re.search(r"<meta\b[^>]*\bcontent\s*=\s*[\"'][^\"']+[\"'][^>]*\bname\s*=\s*[\"']description[\"']",
                           raw, flags=re.I)),
         'missing meta name="description" with content'),
        (re.search(r"<link\b[^>]*\brel\s*=\s*[\"']canonical[\"'][^>]*https://bluespark\.io", raw, re.I) is not None,
         'missing rel="canonical" pointing at https://bluespark.io'),
        (re.search(r"<meta\b[^>]*\bname\s*=\s*[\"']viewport[\"']", raw, re.I) is not None,
         'missing name="viewport"'),
        (re.search(r'\bid\s*=\s*["\']main["\']', raw, re.I) is not None,
         'missing id="main"'),
        (re.search(r'href\s*=\s*"/assets/css/styles\.css"', raw, re.I) is not None,
         'missing href="/assets/css/styles.css"'),
    ]
    for ok, message in required:
        if not ok:
            problems.append((rel, "A10", RULE_LABELS["A10"], "..." + message + "..."))

    return problems


# --------------------------------------------------------------------------
# Entry point
# --------------------------------------------------------------------------

def collect_pages():
    pages = sorted(SITE.glob("*.html")) + sorted(SITE.glob("journal/*.html"))
    return pages


def main():
    # Page content may contain characters the console code page cannot map.
    # Never let an encoding error decide the exit code of the gate.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

    pages = collect_pages()
    all_problems = []
    for page in pages:
        all_problems.extend(audit_page(page))

    if len(pages) != EXPECTED_PAGES:
        all_problems.append((
            "(inventory)", "A10", RULE_LABELS["A10"],
            "...expected %d HTML pages, found %d..." % (EXPECTED_PAGES, len(pages)),
        ))

    all_problems.sort(key=lambda item: (item[0], item[1], item[3]))

    if all_problems:
        print("VIOLATIONS (%d):" % len(all_problems))
        for i, (path, rule_id, label, context) in enumerate(all_problems, start=1):
            print("  %d. %s: [%s %s] %s" % (i, path, rule_id, label, context))
        return 1

    print("PASS \u2014 %d pages audited, 0 voice-rule violations." % len(pages))
    return 0


if __name__ == "__main__":
    sys.exit(main())
