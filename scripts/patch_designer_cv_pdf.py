from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "src" / "lib" / "assets" / "miguel-almeida-cv.pdf"


def replace_required(data: str, old: str, new: str) -> str:
    if old not in data:
        raise ValueError(f"Expected PDF fragment not found: {old!r}")
    return data.replace(old, new, 1)


def replace_optional(data: str, old: str, new: str) -> str:
    if old not in data:
        return data
    return data.replace(old, new, 1)


def replace_education_place(data: str) -> str:
    start_marker = "BT 1 0 0 1 396 200.8898 Tm /F2+0 7.5 Tf 9 TL (S) Tj T* ET\n"
    end_marker = ".094118 .086275 .078431 rg\nBT 1 0 0 1 396 180.8898 Tm /F4+0 18 Tf 21.6 TL (2020) Tj T* ET"
    start = data.find(start_marker)
    end = data.find(end_marker)
    if start == -1 or end == -1 or start >= end:
        return data

    replacement = """BT 1 0 0 1 396 200.8898 Tm /F2+0 7.5 Tf 9 TL (C) Tj T* ET
BT 1 0 0 1 401.7 200.8898 Tm /F2+0 7.5 Tf 9 TL (a) Tj T* ET
BT 1 0 0 1 407.4 200.8898 Tm /F2+0 7.5 Tf 9 TL (r) Tj T* ET
BT 1 0 0 1 413.1 200.8898 Tm /F2+0 7.5 Tf 9 TL (e) Tj T* ET
BT 1 0 0 1 418.8 200.8898 Tm /F2+0 7.5 Tf 9 TL (e) Tj T* ET
BT 1 0 0 1 424.5 200.8898 Tm /F2+0 7.5 Tf 9 TL (r) Tj T* ET
BT 1 0 0 1 430.2 200.8898 Tm /F2+0 7.5 Tf 9 TL (F) Tj T* ET
BT 1 0 0 1 435.9 200.8898 Tm /F2+0 7.5 Tf 9 TL (o) Tj T* ET
BT 1 0 0 1 441.6 200.8898 Tm /F2+0 7.5 Tf 9 TL (u) Tj T* ET
BT 1 0 0 1 447.3 200.8898 Tm /F2+0 7.5 Tf 9 TL (n) Tj T* ET
BT 1 0 0 1 453 200.8898 Tm /F2+0 7.5 Tf 9 TL (d) Tj T* ET
BT 1 0 0 1 458.7 200.8898 Tm /F2+0 7.5 Tf 9 TL (r) Tj T* ET
BT 1 0 0 1 464.4 200.8898 Tm /F2+0 7.5 Tf 9 TL (y) Tj T* ET
"""
    return data[:start] + replacement + data[end:]


def replace_intro_block(data: str) -> str:
    old = """BT 1 0 0 1 48 585.8898 Tm /F5+0 10.5 Tf 12.6 TL (Aviation, then UX, then code. I build calm interfaces for products) Tj T* ET
BT 1 0 0 1 48 570.8898 Tm /F5+0 10.5 Tf 12.6 TL (people genuinely depend on \\001 currently at F24, helping ship) Tj T* ET
BT 1 0 0 1 48 555.8898 Tm /F5+0 10.5 Tf 12.6 TL (critical-communication software used by operators around the) Tj T* ET
BT 1 0 0 1 48 540.8898 Tm /F5+0 10.5 Tf 12.6 TL (world.) Tj T* ET"""
    new = """BT 1 0 0 1 48 585.8898 Tm /F5+0 10.5 Tf 12.6 TL (Early passion for technology, then UX, then code. I build) Tj T* ET
BT 1 0 0 1 48 570.8898 Tm /F5+0 10.5 Tf 12.6 TL (calm interfaces for products people genuinely depend on) Tj T* ET
BT 1 0 0 1 48 555.8898 Tm /F5+0 10.5 Tf 12.6 TL (\\001 currently at F24, helping ship critical-communication) Tj T* ET
BT 1 0 0 1 48 540.8898 Tm /F5+0 10.5 Tf 12.6 TL (software used by operators around the world.) Tj T* ET"""
    return replace_optional(data, old, new)


def main() -> None:
    reader = PdfReader(str(PDF_PATH))
    writer = PdfWriter(clone_from=str(PDF_PATH))
    if reader.metadata:
        writer.add_metadata(reader.metadata)

    for index, page in enumerate(writer.pages):
        if index == 0:
            content = page.get_contents().get_data().decode("latin-1", errors="ignore")

            content = replace_optional(
                content,
                "BT 1 0 0 1 48 725.8898 Tm /F3+0 18 Tf 21.6 TL (N\\001) Tj T* ET",
                "BT 1 0 0 1 48 725.8898 Tm /F3+0 18 Tf 21.6 TL () Tj T* ET",
            )
            content = replace_optional(
                content,
                "BT 1 0 0 1 68 725.8898 Tm /F4+0 18 Tf 21.6 TL (01) Tj T* ET",
                "BT 1 0 0 1 68 725.8898 Tm /F4+0 18 Tf 21.6 TL () Tj T* ET",
            )

            content = replace_optional(
                content,
                "BT 1 0 0 1 396 118.8898 Tm /F5+0 10 Tf 12 TL (Portuguese) Tj T* ET",
                "BT 1 0 0 1 396 999.9999 Tm /F5+0 10 Tf 12 TL (Portuguese) Tj T* ET",
            )
            content = replace_optional(
                content,
                "BT 1 0 0 1 396 105.8898 Tm /F5+0 10 Tf 12 TL (English) Tj T* ET",
                "BT 1 0 0 1 396 118.8898 Tm /F5+0 10 Tf 12 TL (English) Tj T* ET",
            )
            content = replace_optional(
                content,
                "BT 1 0 0 1 396 999.9999 Tm /F5+0 10 Tf 12 TL (Portuguese) Tj T* ET",
                "BT 1 0 0 1 396 105.8898 Tm /F5+0 10 Tf 12 TL (Portuguese) Tj T* ET",
            )

            top_positions = [
                "514.2756 118.8898",
                "519.9756 118.8898",
                "525.6756 118.8898",
                "531.3756 118.8898",
                "537.0756 118.8898",
                "542.7756 118.8898",
            ]
            bottom_positions = [
                "514.2756 105.8898",
                "519.9756 105.8898",
                "525.6756 105.8898",
                "531.3756 105.8898",
                "537.0756 105.8898",
                "542.7756 105.8898",
            ]

            for old in top_positions:
                content = replace_optional(content, old, old.replace("118.8898", "999.9999"))
            for old in bottom_positions:
                content = replace_optional(content, old, old.replace("105.8898", "118.8898"))
            for old in top_positions:
                content = replace_optional(
                    content,
                    old.replace("118.8898", "999.9999"),
                    old.replace("118.8898", "105.8898"),
                )

            content = replace_education_place(content)
            content = replace_intro_block(content)

            stream = DecodedStreamObject()
            stream.set_data(content.encode("latin-1"))
            page.replace_contents(stream)

    with PDF_PATH.open("wb") as handle:
        writer.write(handle)


if __name__ == "__main__":
    main()
