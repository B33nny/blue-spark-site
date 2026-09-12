#!/usr/bin/env python3
"""Blue Spark — voice-rules audit.

Scans every built HTML page for the hard rules from BUILD_PROMPT.md
(bright-line words, banned CTA labels, trial framing, ms latency claims,
hype words, subscription-noun usage, exclamation marks).

Exit 0 = clean. Exit 1 = violations found (CI-ready).

Allowances (documented in voice-rules-decision.md):
  - Bright-line words are allowed ONLY on about.html, where the brand
    publishes its own don't-use list (sitemap §7.4).
  - The exact phrase "Is this a subscription?" is allowed ONLY on
    pricing.html, inside the FAQ (sitemap §4.7); the ANSWER uses the
    official framing.
  - "one-time" is allowed ONLY for add-on pricing ("$25 one-time"),
    never as "one-time purchase" / "lifetime license" for Pro.
"""
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent

def visible_text(html: str) -> str:
    """Strip scripts/styles/doctype and tags — audit visible copy only."""
    html = re.sub(r"<!DOCTYPE[^>]*>", " ", html, flags=re.I)
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    html = re.sub(r"\s(?:style|data-[a-z-]+)=\"[^\"]*\"", " ", html, flags=re.I)
    return html

RULES = [
    ("Banned CTA / trial framing", [
        r"free\s+download", r"start\s+(your\s+)?free\s+trial", r"try\s+it\s+free",
        r"try\s+free", r"get\s+it\s+free", r"free\s+install",
    ]),
    ("Perpetual-era pricing language", [
        r"perpetual", r"one[- ]time\s+purchase", r"lifetime\s+license", r"\$120\s+flat",
    ]),
    ("Fixed-millisecond latency claim", [
        r"under\s+\d+\s*ms", r"\b\d{2,4}\s*ms\b(?![^<]*monospace)",
    ]),
    ("Hype words", [
        r"revolutionary", r"game[- ]changing", r"next[- ]gen", r"ai[- ]powered",
        r"\b10\s*[x×]\b", r"unleash", r"transform\s+your\s+workflow", r"fastest",
        r"benchmark[- ]leading", r"smartest", r"best[- ]in[- ]class",
        r"most\s+powerful", r"largest\s+context\s+window",
    ]),
    ("Bright-line words (allowed on about.html only)", [
        r"\blotus\b", r"\bflame\b", r"\baura\b", r"\bmandala\b", r"\bawakening\b",
        r"\billumination\b", r"\bstillness\b", r"\benlightenment\b", r"\bsacred\b", r"\bdivine\b",
    ]),
    ("Forbidden elsewhere", [
        r"\bjourney\b", r"\bsoul\b", r"\bstill\b",
    ]),
]

SUBSCRIPTION_NOUN = r"\bsubscription\b"
FAQ_ALLOWANCE = "is this a subscription?"

def audit(path: Path) -> list[str]:
    problems = []
    text = visible_text(path.read_text(encoding="utf-8"))
    low = text.lower()
    name = path.name

    for label, patterns in RULES:
        for pat in patterns:
            for m in re.finditer(pat, low, flags=re.I):
                # Bright-line words: allowed ONLY on about.html (published don't-use list)
                if label.startswith("Bright-line") and name == "about.html":
                    continue
                # Hype words: allowed ONLY on product.html ("Words we don't" list — required content)
                if label == "Hype words" and name == "product.html":
                    continue
                # "one-time purchase": allowed ONLY on marketplace.html (creator skill pricing, not Pro)
                if name == "marketplace.html" and "one[- ]time" in pat:
                    continue
                # subscription noun: audience-rejection phrases from the locked drafts
                if re.search(r"subscription[- ]comfortable|monthly consumer subscription", low):
                    continue
                ctx = text[max(0, m.start() - 40): m.end() + 40].replace("\n", " ")
                problems.append(f"{name}: [{label}] ...{ctx}...")

    if re.search(SUBSCRIPTION_NOUN, low):
        # Allowed usages:
        #  1. the exact FAQ question on pricing.html ("Is this a subscription?")
        #  2. audience-rejection phrases from the locked drafts ("Subscription-comfortable
        #     users", "monthly consumer subscription") — these describe users we turn
        #     away, never label Pro.
        clean = re.sub(r"subscription[- ]comfortable|monthly consumer subscription", " ", low)
        if name == "pricing.html":
            clean = clean.replace(FAQ_ALLOWANCE, " ")
        for m in re.finditer(SUBSCRIPTION_NOUN, clean):
            ctx = text[max(0, m.start() - 40): m.end() + 40].replace("\n", " ")
            problems.append(f"{name}: [subscription noun] ...{ctx}...")

    # Exclamation marks in visible copy (site rule: zero anywhere)
    for m in re.finditer(r"!", text):
        ctx = text[max(0, m.start() - 30): m.end() + 30].replace("\n", " ")
        problems.append(f"{name}: [exclamation mark] ...{ctx}...")

    return problems

def main() -> int:
    pages = sorted(SITE.glob("*.html"))
    if not pages:
        print("No HTML pages found.")
        return 1
    all_problems: list[str] = []
    for page in pages:
        all_problems.extend(audit(page))
    if all_problems:
        print(f"VIOLATIONS ({len(all_problems)}):")
        for p in all_problems:
            print("  -", p)
        return 1
    print(f"PASS — {len(pages)} pages audited, 0 voice-rule violations.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
