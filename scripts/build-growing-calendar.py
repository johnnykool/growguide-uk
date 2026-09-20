"""Build the GrowGuide UK printable calendars. Requires reportlab.

Run from any directory: python3 scripts/build-growing-calendar.py
Uses the site's crop data, with documented print-edition clarifications.
"""
import json
import re
import shutil
from pathlib import Path

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import A3, A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf'
PUBLIC = ROOT / 'public/downloads'
ASSETS = Path(__file__).parent / 'calendar-assets'
INK = '#5F5746'
MOSS = '#8A8E75'
SAGE = '#B5C7AD'
CLAY = '#B18B7E'
STONE = '#D5C7AD'
PAPER = '#F1EAD8'
OAT = '#B7A071'
RULE = '#D8D5CA'
PALE = '#FAF9F5'

for family, filename in [('Body', 'DMSans-Regular.ttf'),
                         ('Strong', 'DMSans-Semibold.ttf'),
                         ('Display', 'DMSerifDisplay-Regular.ttf')]:
    pdfmetrics.registerFont(TTFont(family, str(ASSETS / filename)))


def crop_data():
    source = (ROOT / 'data/vegetables.ts').read_text()
    crops = []
    for block in re.findall(r'\{\s*id:.*?\n  \}', source, flags=re.S):
        def field(name):
            return re.search(rf'{name}: "(.*?)"', block).group(1)
        crop = {'id': field('id'), 'name': field('name')}
        for field_name in ['sowIndoors', 'sowOutdoors', 'transplant', 'harvest']:
            crop[field_name] = json.loads(re.search(rf'{field_name}: (\[.*?\])', block).group(1))
        if crop['id'] != 'rosemary':
            crops.append(crop)
    # The printable edition includes annual dill in place of rosemary.
    crops.append({'id': 'dill', 'name': 'Dill', 'sowIndoors': [],
                  'sowOutdoors': [4, 5, 6, 7], 'transplant': [],
                  'harvest': [6, 7, 8, 9, 10]})
    # Row and plant spacings in cm. An em dash is deliberately not used:
    # '-' means there is no single row distance in the site's crop guidance.
    spacing = {
        'aubergine': ('-', '50-60'), 'basil': ('-', '20-30'),
        'broad-bean': ('45', '20'), 'french-bean': ('45', '15'),
        'runner-bean': ('60*', '15-30'), 'beetroot': ('30', '10'),
        'broccoli': ('45', '30-45'), 'brussels-sprout': ('60', '60'),
        'butternut-squash': ('90-120', '90-120'), 'cabbage': ('-', '35-50'),
        'carrot': ('15-30', '5-8'), 'cauliflower': ('60', '60'),
        'chives': ('-', '23-30'), 'courgette': ('90', '90'),
        'cucumber': ('90', '90'), 'garlic': ('30', '15'),
        'kale': ('45', '45'), 'leek': ('30', '15'),
        'lettuce': ('-', '15-30'), 'onion': ('30', '10'),
        'parsley': ('-', '15-23'), 'parsnip': ('30', '10-15'),
        'pea': ('60-90', '5-7'), 'pepper': ('-', '45-50'),
        'potato': ('60-75', '30-37'), 'pumpkin': ('100-150', '100-150'),
        'radish': ('15', '2.5'), 'dill': ('30', '20'),
        'spinach': ('30', '7-15'), 'spring-onion': ('15', 'Thinly'),
        'tomato': ('75', '45-60'), 'turnip': ('23-30', '10-15'),
    }
    names = {
        'broad-bean': ('Beans, broad', 'Autumn sowing: mild sites'),
        'french-bean': ('Beans, French', 'Dwarf varieties'),
        'runner-bean': ('Beans, runner', 'Climbing varieties'),
        'broccoli': ('Broccoli', 'Calabrese / summer crop'),
        'brussels-sprout': ('Brussels sprouts', ''),
        'cabbage': ('Cabbage', 'Summer / autumn crop'),
        'cauliflower': ('Cauliflower', 'Summer / autumn varieties'),
        'cucumber': ('Cucumber', 'Outdoor ridge varieties'),
        'aubergine': ('Aubergine', 'Grow under glass'),
        'pepper': ('Pepper', 'Best under glass'),
        'lettuce': ('Lettuce', 'Spring / summer sowings'),
        'onion': ('Onion', 'Spring sets / seed'),
        'potato': ('Potato', 'Earlies / maincrop'),
        'chives': ('Chives', 'Harvest established clumps'),
        'dill': ('Dill', 'Sow direct in small batches'),
        'spinach': ('Spinach', 'True spinach'),
    }
    for crop in crops:
        key = crop['id']
        crop['rows'], crop['plants'] = spacing[key]
        crop['name'], crop['detail'] = names.get(key, (crop['name'].capitalize(), ''))
        # Plant tubers and cloves, rather than treating them as outdoor seed.
        if key in ['potato', 'garlic']:
            crop['transplant'] = crop['sowOutdoors']
            crop['sowOutdoors'] = []
        # Avoid combining incompatible variety cycles in one row.
        if key == 'cabbage':
            crop['sowOutdoors'] = [3, 4, 5]
            crop['transplant'] = [4, 5, 6]
        if key == 'lettuce':
            crop['sowIndoors'] = [2, 3]
            crop['transplant'] = [3, 4, 5, 6, 7, 8, 9]
        if key == 'cucumber':
            crop['sowIndoors'] = [4, 5]
            crop['transplant'] = [6]
        if key == 'onion':
            crop['transplant'] = [3, 4, 5]
    assert len(crops) == 32
    assert len({crop['id'] for crop in crops}) == 32
    assert 'dill' in {crop['id'] for crop in crops}
    assert 'rosemary' not in {crop['id'] for crop in crops}
    for crop in crops:
        for activity in ['sowIndoors', 'sowOutdoors', 'transplant', 'harvest']:
            assert all(1 <= m <= 12 for m in crop[activity])
    return sorted(crops, key=lambda crop: crop['name'])


class Page:
    def __init__(self, pdf, size):
        self.c = pdf
        self.w, self.h = size

    def text(self, x, y, text, size=9, font='Body', color=INK, align='left'):
        self.c.setFont(font, size)
        self.c.setFillColor(HexColor(color))
        fn = {'left': self.c.drawString, 'right': self.c.drawRightString,
              'center': self.c.drawCentredString}[align]
        fn(x, self.h-y, text)

    def rect(self, x, y, w, h, fill=None, stroke=None, width=.5):
        if fill:
            self.c.setFillColor(HexColor(fill))
        if stroke:
            self.c.setStrokeColor(HexColor(stroke))
        self.c.setLineWidth(width)
        self.c.rect(x, self.h-y-h, w, h, fill=bool(fill), stroke=bool(stroke))

    def line(self, x1, y1, x2, y2, color=RULE, width=.4):
        self.c.setStrokeColor(HexColor(color))
        self.c.setLineWidth(width)
        self.c.line(x1, self.h-y1, x2, self.h-y2)

    def wrapped(self, x, y, text, width, size=8, leading=11, font='Body'):
        words = text.split()
        line = ''
        for word in words:
            trial = (line+' '+word).strip()
            if pdfmetrics.stringWidth(trial, font, size) > width and line:
                self.text(x, y, line, size, font)
                y += leading
                line = word
            else:
                line = trial
        if line:
            self.text(x, y, line, size, font)
        return y+leading

    def marker(self, x, y, w, h, kind):
        if kind == 0:
            self.rect(x, y, w, h, SAGE)
        elif kind == 1:
            self.rect(x, y, w, h, CLAY)
            # A central tick distinguishes outdoor sowing in greyscale.
            self.line(x+w/2-1, y+h-.5, x+w/2+1, y+.5, INK, .45)
        elif kind == 2:
            self.rect(x+.2, y+.25, w-.4, h-.5, stroke=MOSS, width=.65)
        else:
            self.rect(x, y, w, h, OAT)
            self.c.setFillColor(HexColor(INK))
            self.c.circle(x+w/2, self.h-y-h/2, .65, fill=1, stroke=0)


def draw_page(pdf, size, crops, number, total):
    p = Page(pdf, size)
    large = size == A3
    margin = 38 if large else 30
    width = p.w-2*margin
    logo = 36 if large else 30
    # White paper with a restrained ivory masthead keeps home ink use low.
    p.rect(margin, 29, logo, logo, PAPER)
    pdf.drawImage(str(ROOT/'public/images/growguide-logo.jpg'), margin,
                  p.h-29-logo, logo, logo, mask='auto')
    p.text(margin+logo+10, 51, 'GrowGuide UK', 19 if large else 17, 'Display')
    p.text(p.w-margin, 42, 'THE KITCHEN GARDEN', 8, 'Strong', align='right')
    p.text(p.w-margin, 56, 'A year of growing, at a glance', 8, color=INK, align='right')
    p.line(margin, 79, p.w-margin, 79, STONE, .7)
    p.text(margin, 122 if large else 118, 'Sow. Plant. Harvest.', 42 if large else 35, 'Display')
    p.text(margin, 143 if large else 139,
           'A seasonal calendar for UK vegetable & herb growers', 11 if large else 9.5)
    if large:
        p.text(p.w-margin, 120, '32 CROPS', 10, 'Strong', align='right')
        p.text(p.w-margin, 139, 'Free growing guide', 9, align='right')

    legend_y = 166 if large else 161
    labels = [('I', 'Sow indoors'), ('O', 'Sow outdoors'), ('P', 'Plant / transplant'), ('H', 'Harvest')]
    step = width/4
    for i, (letter, label) in enumerate(labels):
        x = margin+i*step
        p.marker(x, legend_y-6, 18 if large else 14, 5, i)
        p.text(x+(24 if large else 20), legend_y, letter+'  '+label, 9 if large else 8, 'Strong')
    p.text(margin, legend_y+19,
           'Read each crop from top to bottom: I, O, P, H. Marks show possible months, not one sowing cycle.',
           8.5 if large else 7.3)

    head_y = 207 if large else 207
    chart_y = head_y+31
    row_h = 24 if large else 26
    crop_w = 170 if large else 130
    spacing_w = 62 if large else 48
    month_w = (width-crop_w-spacing_w*2)/12
    month_x = margin+crop_w
    spacing_x = month_x+12*month_w
    bottom = chart_y+row_h*len(crops)

    p.rect(margin, head_y, width, 31, PAPER)
    p.text(margin+7, head_y+20, 'CROP', 8, 'Strong')
    for i, month in enumerate(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']):
        p.text(month_x+(i+.5)*month_w, head_y+20, month,
               8.5 if large else 7, 'Strong', align='center')
    p.text(spacing_x+spacing_w, head_y+10, 'SPACING / cm', 7, 'Strong', align='center')
    p.text(spacing_x+spacing_w*.5, head_y+24, 'Rows', 8, 'Strong', align='center')
    p.text(spacing_x+spacing_w*1.5, head_y+24, 'Plants', 8, 'Strong', align='center')
    activities = ['sowIndoors','sowOutdoors','transplant','harvest']
    for j, crop in enumerate(crops):
        y = chart_y+j*row_h
        if j%2 == 0:
            p.rect(margin, y, width, row_h, PALE)
        if crop['detail']:
            p.text(margin+7, y+10.5, crop['name'], 10 if large else 9.3, 'Strong')
            p.text(margin+7, y+20.5, crop['detail'], 7.2 if large else 6.5)
        else:
            p.text(margin+7, y+row_h/2+3, crop['name'], 10 if large else 9.3, 'Strong')
        lane_h = 4
        for lane, activity in enumerate(activities):
            lane_y = y+(row_h-19)/2+lane*5
            p.text(month_x-7, lane_y+3.8, 'IOPH'[lane], 4.6, 'Strong', align='center')
            for month in crop[activity]:
                x = month_x+(month-1)*month_w+2
                p.marker(x, lane_y, month_w-4, lane_h, lane)
        p.text(spacing_x+spacing_w*.5, y+row_h/2+3, crop['rows'], 9 if large else 8, align='center')
        p.text(spacing_x+spacing_w*1.5, y+row_h/2+3, crop['plants'], 9 if large else 8, align='center')
        p.line(margin, y+row_h, p.w-margin, y+row_h)
    for i in range(13):
        p.line(month_x+i*month_w, head_y+31, month_x+i*month_w, bottom,
               STONE if i in [0,3,6,9,12] else RULE, .6 if i in [0,3,6,9,12] else .25)
    p.line(spacing_x+spacing_w, chart_y, spacing_x+spacing_w, bottom, RULE, .3)

    # Three compact editorial notes, separated by whitespace rather than cards.
    notes_y = bottom+26
    gap = 20 if large else 16
    note_w = (width-gap*2)/3
    note_size = 8.7 if large else 7.5
    leading = 12 if large else 10.5
    notes = [
        ('Follow your conditions',
         'These are broad UK windows. Follow the seed packet and local weather. Cold or exposed gardens start later; tender crops go outside only after the last frost. Harden off first.'),
        ('Think across seasons',
         'Winter harvests may come from the previous year\'s sowing. Autumn broad beans need hardy varieties and a mild site. Peppers and aubergines are best grown under glass.'),
        ('Give plants room',
         'P also means planting potato tubers, garlic cloves and onion sets. Spacings are a guide; check your variety. A dash means use the plant spacing / packet. *Runner beans: 60cm within a pair of rows; 150cm between pairs.'),
    ]
    for i, (title, text) in enumerate(notes):
        x = margin+i*(note_w+gap)
        p.text(x, notes_y, title, 10.5 if large else 9, 'Display')
        end = p.wrapped(x, notes_y+16, text, note_w, note_size, leading)
        assert end < p.h-61, (title, end, p.h)

    footer_y = p.h-43
    p.line(margin, footer_y-15, p.w-margin, footer_y-15, STONE, .7)
    p.text(margin, footer_y, 'growguideuk.co.uk', 10 if large else 9, 'Strong')
    pdf.linkURL('https://growguideuk.co.uk', (margin,p.h-footer_y-3,margin+120,p.h-footer_y+10), relative=0)
    p.text(p.w-margin, footer_y, 'GROWGUIDE UK  /  FREE PRINTABLE  /  '+str(number).zfill(2), 7.5, 'Strong', align='right')
    source_text = 'Compiled by GrowGuide UK. Edition 1 / September 2026.'
    p.text(margin, footer_y+15, source_text, 7 if large else 6.5)
    pdf.showPage()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    crops = crop_data()
    for label, size, chunks in [('a3', A3, [crops]), ('a4', A4, [crops[:16], crops[16:]])]:
        name = f'growguide-uk-growing-calendar-{label}.pdf'
        path = OUT/name
        pdf = canvas.Canvas(str(path), pagesize=size, pageCompression=1)
        pdf.setTitle('GrowGuide UK - Sow. Plant. Harvest. - '+label.upper())
        pdf.setAuthor('GrowGuide UK')
        pdf.setSubject('Free UK vegetable and herb sowing, planting and harvesting calendar')
        for i, group in enumerate(chunks):
            draw_page(pdf, size, group, i+1, len(chunks))
        pdf.save()
        shutil.copy2(path, PUBLIC/name)
        print(f'{path}: {len(chunks)} pages; {path.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
