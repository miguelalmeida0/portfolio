"""Derive only the existing headline's outlines; no replacement font or network input.
Run: PYTHONPATH=.cache/font-tools python3 scripts/build-headline-font.py
Source font remains licensed under static/fonts/antonio-OFL.txt.
"""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen

root = Path(__file__).resolve().parent.parent
font = TTFont(root / 'static/fonts/antonio-700-latin.woff2')
glyph_set = font.getGlyphSet()

class Outline(BasePen):
    def __init__(self):
        super().__init__(glyph_set)
        self.commands = []
    def add(self, command, *points):
        self.commands.extend([command, *(str(round(v, 4)) for p in points for v in p)])
    def _moveTo(self, p): self.add('m', p)
    def _lineTo(self, p): self.add('l', p)
    def _qCurveToOne(self, p1, p2): self.add('q', p2, p1)
    def _curveToOne(self, p1, p2, p3): self.add('b', p3, p1, p2)
    def _closePath(self): pass
    def _endPath(self): pass

glyphs = {}
for char in sorted(set('FRONTENDENGINEER')):
    name = font.getBestCmap()[ord(char)]
    pen = Outline()
    glyph_set[name].draw(pen)
    glyphs[char] = {'ha': font['hmtx'][name][0], 'o': ' '.join(pen.commands)}
data = {'familyName': 'Antonio Headline Subset', 'resolution': font['head'].unitsPerEm,
        'ascender': font['hhea'].ascent, 'descender': font['hhea'].descent,
        'boundingBox': {'yMin': font['head'].yMin, 'yMax': font['head'].yMax},
        'underlineThickness': 0, 'glyphs': glyphs}
(root / 'static/fonts/antonio-headline.json').write_text(json.dumps(data, separators=(',', ':')) + '\n')
