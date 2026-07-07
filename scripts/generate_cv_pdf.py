from __future__ import annotations

import os
from pathlib import Path

from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "lib" / "assets" / "miguel-almeida-cv.pdf"

SITE_URL = os.environ.get("PORTFOLIO_URL", "https://miguelalmeida.dev").strip()
SITE_LABEL = SITE_URL.removeprefix("https://").removeprefix("http://").upper()
LINKEDIN_PROFILE = "https://www.linkedin.com/in/miguelalmeida1/"
SITE_ORIGIN = os.environ.get("PORTFOLIO_SITE_ORIGIN", "").strip().rstrip("/")
LINKEDIN_URI = f"{SITE_ORIGIN}/out/linkedin" if SITE_ORIGIN else LINKEDIN_PROFILE

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 36

CREAM = Color(0.965, 0.948, 0.905)
INK = Color(0.102, 0.102, 0.102)
MUTED = Color(0.42, 0.42, 0.40)
HAIRLINE = Color(0.18, 0.18, 0.18)


def _find_font(patterns: list[str]) -> str | None:
    search_roots = [
        Path("/System/Library/Fonts"),
        Path("/Library/Fonts"),
        Path.home() / "Library" / "Fonts",
    ]
    for root in search_roots:
        if not root.exists():
            continue
        for pattern in patterns:
            match = next(root.rglob(pattern), None)
            if match:
                return str(match)
    return None


def register_fonts() -> dict[str, str]:
    fonts: dict[str, str] = {}
    candidates = {
        "Inter-Regular": [
            "Inter-Regular.ttf",
            "Inter-Regular.otf",
            "Inter_18pt-Regular.ttf",
            "Inter_24pt-Regular.ttf",
        ],
        "Inter-Medium": [
            "Inter-Medium.ttf",
            "Inter-Medium.otf",
            "Inter_18pt-Medium.ttf",
            "Inter_24pt-Medium.ttf",
        ],
        "Inter-Bold": [
            "Inter-Bold.ttf",
            "Inter-Bold.otf",
            "Inter_18pt-Bold.ttf",
            "Inter_24pt-Bold.ttf",
        ],
        "Inter-Black": [
            "Inter-Black.ttf",
            "Inter-Black.otf",
            "Inter_18pt-Black.ttf",
            "Inter_24pt-Black.ttf",
        ],
        "JetBrainsMono-Regular": [
            "JetBrainsMono-Regular.ttf",
            "JetBrainsMono-Regular.otf",
            "JetBrains Mono Regular.ttf",
        ],
    }

    for alias, patterns in candidates.items():
        path = _find_font(patterns)
        if path:
            pdfmetrics.registerFont(TTFont(alias, path))
            fonts[alias] = alias

    regular = fonts.get("Inter-Regular", "Helvetica")
    medium = fonts.get("Inter-Medium", fonts.get("Inter-Bold", regular))
    bold = fonts.get("Inter-Bold", "Helvetica-Bold")
    black = fonts.get("Inter-Black", bold)
    mono = fonts.get("JetBrainsMono-Regular", "Courier")

    return {
        "regular": regular,
        "medium": medium,
        "bold": bold,
        "black": black,
        "mono": mono,
    }


FONTS = register_fonts()


def measure_text(text: str, font: str, size: float, tracking: float = 0) -> float:
    return pdfmetrics.stringWidth(text, font, size) + (tracking * (len(text) - 1) if tracking else 0)


def draw_text(
    c: canvas.Canvas,
    x: float,
    y: float,
    text: str,
    *,
    font: str,
    size: float,
    color: Color = INK,
    tracking: float = 0,
    url: str | None = None,
) -> float:
    c.setFillColor(color)
    c.setFont(font, size)

    if tracking:
      cursor_x = x
      for ch in text:
          c.drawString(cursor_x, y, ch)
          cursor_x += pdfmetrics.stringWidth(ch, font, size) + tracking
      width = cursor_x - x - tracking
    else:
      c.drawString(x, y, text)
      width = pdfmetrics.stringWidth(text, font, size)

    if url:
        c.linkURL(url, (x, y - 2, x + width, y + size), relative=0)
    return width


def draw_right_text(
    c: canvas.Canvas,
    x: float,
    y: float,
    text: str,
    *,
    font: str,
    size: float,
    color: Color = INK,
    tracking: float = 0,
) -> float:
    width = measure_text(text, font, size, tracking)
    draw_text(c, x - width, y, text, font=font, size=size, color=color, tracking=tracking)
    return width


def draw_rule(c: canvas.Canvas, x1: float, y1: float, x2: float, y2: float, width: float = 0.5) -> None:
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def wrap_lines(text: str, font: str, size: float, max_width: float, tracking: float = 0) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if not current or measure_text(candidate, font, size, tracking) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_kv_row(c: canvas.Canvas, x: float, y: float, label: str, value: str, *, url: str | None = None) -> None:
    label_width = 82
    draw_text(c, x, y, label, font=FONTS["mono"], size=7.4, color=INK, tracking=0.6)
    draw_text(c, x + label_width, y, value, font=FONTS["medium"], size=9.0, color=INK, tracking=0.24, url=url)


def draw_entry(c: canvas.Canvas, x: float, y: float, line1: str, line2: str, date: str) -> None:
    draw_text(c, x, y, line1, font=FONTS["bold"], size=8.6, color=INK, tracking=0.24)
    draw_text(c, x, y - 11, line2, font=FONTS["regular"], size=8.2, color=MUTED, tracking=0.2)
    draw_right_text(c, PAGE_WIDTH - MARGIN, y, date, font=FONTS["mono"], size=7.6, color=INK, tracking=0.5)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Miguel Almeida — CV")
    c.setAuthor("Miguel Almeida")
    c.setSubject("Curriculum Vitae · 2026")
    c.setCreator("Codex")

    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    top_rule_y = PAGE_HEIGHT - MARGIN
    draw_rule(c, MARGIN, top_rule_y, PAGE_WIDTH - MARGIN, top_rule_y, width=0.6)

    top_meta_y = top_rule_y - 14
    draw_text(
        c,
        MARGIN,
        top_meta_y,
        f"PORTFOLIO:  {SITE_LABEL}",
        font=FONTS["mono"],
        size=7.2,
        color=INK,
        tracking=0.6,
        url=SITE_URL,
    )
    draw_right_text(c, PAGE_WIDTH - MARGIN, top_meta_y, "2026", font=FONTS["mono"], size=7.2, color=INK, tracking=0.6)

    contact_top_y = top_meta_y - 28
    col_a_x = MARGIN
    col_b_x = MARGIN + 280
    line_gap = 14

    draw_kv_row(c, col_a_x, contact_top_y, "[ROLE]", "SOFTWARE ENGINEER & DESIGNER")
    draw_kv_row(c, col_b_x, contact_top_y, "[STATUS]", "OPEN · MID-LEVEL")
    draw_kv_row(c, col_a_x, contact_top_y - line_gap, "[LOCATION]", "BERLIN, GERMANY")
    draw_kv_row(c, col_b_x, contact_top_y - line_gap, "[PHONE]", "+351 918 500 305", url="tel:+351918500305")
    draw_kv_row(
        c,
        col_a_x,
        contact_top_y - (line_gap * 2),
        "[MAIL]",
        "MIGUELALMEIDA1592@GMAIL.COM",
        url="mailto:miguelalmeida1592@gmail.com",
    )
    draw_kv_row(
        c,
        col_b_x,
        contact_top_y - (line_gap * 2),
        "[LINKEDIN]",
        "/IN/MIGUELALMEIDA1",
        url=LINKEDIN_URI,
    )

    name_baseline = contact_top_y - (line_gap * 2) - 70
    name = "MIGUEL ALMEIDA"
    headline_tracking = -3.0
    max_name_width = PAGE_WIDTH - (MARGIN * 2) - 8
    name_size = 200
    while name_size > 30 and measure_text(name, FONTS["black"], name_size, headline_tracking) > max_name_width:
        name_size -= 1

    draw_text(
        c,
        MARGIN,
        name_baseline,
        name,
        font=FONTS["black"],
        size=name_size,
        color=INK,
        tracking=headline_tracking,
    )

    spine_rule_y = name_baseline - 14
    draw_rule(c, MARGIN, spine_rule_y, PAGE_WIDTH - MARGIN, spine_rule_y, width=0.6)

    body_top_y = spine_rule_y - 22
    left_x = MARGIN
    right_x = MARGIN + 200
    left_width = 178

    bio = (
        "EARLY PASSION FOR TECHNOLOGY, THEN UX, THEN CODE. "
        "I BUILD CALM INTERFACES FOR PRODUCTS PEOPLE GENUINELY DEPEND ON — "
        "CURRENTLY AT F24, SHIPPING CRITICAL-COMMUNICATION SOFTWARE "
        "USED BY THOUSANDS OF USERS WORLDWIDE."
    )
    bio_y = body_top_y
    for line in wrap_lines(bio, FONTS["medium"], 9.5, left_width, 0.22):
        draw_text(c, left_x, bio_y, line, font=FONTS["medium"], size=9.5, color=INK, tracking=0.22)
        bio_y -= 13.5

    left_y = bio_y - 22
    draw_text(c, left_x, left_y, "[SOFTWARE]", font=FONTS["mono"], size=7.4, color=INK, tracking=0.6)
    left_y -= 12
    for item in [
        "JAVASCRIPT",
        "SVELTE",
        "TYPESCRIPT",
        "REACT",
        "TAILWIND CSS",
        "FIGMA",
        "DESIGN SYSTEMS",
        "ACCESSIBILITY",
        "+",
    ]:
        draw_text(c, left_x, left_y, item, font=FONTS["medium"], size=8.4, color=INK, tracking=0.28)
        left_y -= 11

    left_y -= 16
    draw_text(c, left_x, left_y, "[LANGUAGES]", font=FONTS["mono"], size=7.4, color=INK, tracking=0.6)
    left_y -= 12
    for item in [
        "ENGLISH  —  FLUENT",
        "PORTUGUESE  —  NATIVE",
        "GERMAN  —  WORKING",
    ]:
        draw_text(c, left_x, left_y, item, font=FONTS["medium"], size=8.4, color=INK, tracking=0.28)
        left_y -= 11

    left_y -= 16
    draw_text(c, left_x, left_y, "[AVAILABILITY]", font=FONTS["mono"], size=7.4, color=INK, tracking=0.6)
    left_y -= 12
    for item in [
        "PRESENTIAL  —  BERLIN",
        "HYBRID",
        "REMOTE",
    ]:
        draw_text(c, left_x, left_y, item, font=FONTS["medium"], size=8.4, color=INK, tracking=0.28)
        left_y -= 11

    right_y = body_top_y
    draw_text(c, right_x, right_y, "[WORK  PLACES]", font=FONTS["mono"], size=7.4, color=INK, tracking=0.6)
    right_y -= 18
    work_entries = [
        ("F24", "SOFTWARE ENGINEER  ·  MID-LEVEL", "2026 — NOW"),
        ("F24", "FRONTEND ENGINEER  ·  PRODUCT LEAD", "2023 — 2025"),
        ("F24", "FRONTEND ENGINEER", "2022 — 2023"),
        ("INDEPENDENT", "FREELANCE FRONTEND DEVELOPER", "2021 — 2022"),
        ("AVIATION", "PREVIOUS CHAPTER", "—   2020"),
    ]
    for company, role, date in work_entries:
        draw_entry(c, right_x, right_y, company, role, date)
        right_y -= 30

    right_y -= 8
    draw_text(c, right_x, right_y, "[STUDIES]", font=FONTS["mono"], size=7.4, color=INK, tracking=0.6)
    right_y -= 18
    studies = [
        ("CAREERFOUNDRY", "FULL-STACK WEB DEVELOPMENT", "2021 — 2021"),
        ("UX DESIGN INSTITUTE", "PROFESSIONAL DIPLOMA — UX DESIGN", "2020 — 2020"),
        ("ESTORIL HIGHER INSTITUTE", "BACHELOR — HOTEL MANAGEMENT", "2014 — 2017"),
    ]
    for school, program, date in studies:
        draw_entry(c, right_x, right_y, school, program, date)
        right_y -= 30

    bottom_y = MARGIN + 30
    draw_rule(c, MARGIN, bottom_y + 8, PAGE_WIDTH - MARGIN, bottom_y + 8, width=0.4)
    draw_text(c, MARGIN, bottom_y - 4, "© MMXXVI  ·  M. ALMEIDA", font=FONTS["mono"], size=6.8, color=INK, tracking=0.7)

    center_colophon = "CURRICULUM VITAE  ·  EDITION Nº 04  ·  04 / 2026"
    center_width = measure_text(center_colophon, FONTS["mono"], 6.8, 0.7)
    draw_text(
        c,
        (PAGE_WIDTH - center_width) / 2,
        bottom_y - 4,
        center_colophon,
        font=FONTS["mono"],
        size=6.8,
        color=INK,
        tracking=0.7,
    )
    draw_right_text(
        c,
        PAGE_WIDTH - MARGIN,
        bottom_y - 4,
        "BERLIN  ·  DE  ·  52.5°N",
        font=FONTS["mono"],
        size=6.8,
        color=INK,
        tracking=0.7,
    )

    c.showPage()
    c.save()

    print(f"OK -> {OUTPUT}")


if __name__ == "__main__":
    main()
