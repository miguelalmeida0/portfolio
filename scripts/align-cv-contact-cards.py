"""Reposition the supplied CV's contact artwork and links without regenerating it.

Usage: uv run --with pypdf==6.19.0 python scripts/align-cv-contact-cards.py SOURCE OUTPUT
The source hash deliberately guards against applying this document-specific edit
to a revised PDF or shifting the same file twice.
"""
import hashlib
from pathlib import Path
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, FloatObject, NameObject


source, output = map(Path, sys.argv[1:])
assert hashlib.sha256(source.read_bytes()).hexdigest() == (
    "034569afa586050d2e0dc293190c6c492650a315c63a15c0c5b21530323f8dfa"
), "Expected the original 6 October supplied CV"

reader = PdfReader(source)
writer = PdfWriter(clone_from=reader)
page = writer.pages[0]
content = page.get_contents().get_data()
start = b".207843 .345098 .298039 rg 1 1 1 RG/gRLs0 gs .5 w n 438 767.8898 m"
end = b"1 .992157 .972549 rg .835294 .831373 .792157 RG .5 w n 40 586.8898 m"
assert content.count(start) == content.count(end) == 1
first, last = content.index(start), content.index(end)
assert first < last
# Four 39pt cards and three 6pt gaps occupy 174pt of the 205pt header.
# Center that stack: (205 - 174) / 2 = 15.5pt. Original top inset was 35pt.
stream = DecodedStreamObject()
stream.set_data(content[:first] + b"q 1 0 0 1 0 19.5 cm\n"
                + content[first:last] + b"\nQ\n" + content[last:])
page[NameObject('/Contents')] = writer._add_object(stream)

contacts = {
    "https://www.linkedin.com/in/miguelalmeida1/",
    "https://github.com/miguelalmeida0/",
    "https://miguelalmeida.is-a.dev/",
    "mailto:miguelalmeida1592@gmail.com",
}
moved = set()
for reference in page['/Annots']:
    annotation = reference.get_object()
    uri = annotation.get('/A', {}).get('/URI')
    if uri in contacts:
        rect = annotation['/Rect']
        for index in (1, 3):
            rect[index] = FloatObject(float(rect[index]) + 19.5)
        moved.add(uri)
assert moved == contacts
output.parent.mkdir(parents=True, exist_ok=True)
writer.write(output)

result = PdfReader(output)
assert len(result.pages) == len(reader.pages) == 1
assert result.pages[0].extract_text() == reader.pages[0].extract_text()
assert [a.get_object()['/A']['/URI'] for a in result.pages[0]['/Annots']] == [
    a.get_object()['/A']['/URI'] for a in reader.pages[0]['/Annots']
]
print(f"Aligned four cards; preserved all text and seven destinations: {output}")
