"""Build the three autumn companions without regenerating existing guides.

Uses the established GrowGuide typography and page furniture. Research notes
are kept in docs/provenance/autumn-guides-2026-09-26.md.
"""
from pathlib import Path
import importlib.util
import json
import shutil

spec = importlib.util.spec_from_file_location('guides', Path(__file__).with_name('build-resource-guides.py'))
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)
Page, CW, M, H = g.Page, g.CW, g.M, g.H


def checklist(p, items):
    for item in items:
        y = p.y
        p.c.setStrokeColor(g.HexColor(g.MOSS))
        p.c.setLineWidth(.7)
        p.c.rect(M, H-y-11, 9, 9, stroke=1, fill=0)
        height = p.para(item, x=M+19, y=y, w=CW-19, size=10.2, leading=14)
        p.y = y+height+12


def related(p, slug, text):
    p.para(f'<link href="https://growguideuk.co.uk/resources/{slug}" color="{g.INK}"><u>{text}</u></link>', size=9.5, leading=13)


def clearing():
    c = g.new_pdf('autumn-plot-clear-up', 'Autumn plot clear-up')
    p = Page(c, '05', 'Clear with care.', 'An autumn tidy-up for UK vegetable plots, beds and containers', 1, 'September-November / keep what is useful')
    p.para('Clear in stages as crops finish. A productive autumn plot can still hold winter vegetables, flowering plants and shelter for wildlife. Start with one bed and leave yourself an easy route to the crops you are still picking.')
    p.heading('Keep, clear or set aside?')
    p.table(['WHAT YOU FIND', 'YOUR NEXT MOVE'], [
        ['<b>Crops still producing</b>', 'Keep harvesting while quality holds. Check your local frost forecast before leaving tender crops out. Use the vegetable-storage guide to sort the final harvest.'],
        ['<b>Established winter crops</b>', 'Leave healthy leeks, kale, sprouts and winter cabbage in place. Remove fallen, rotting leaves and check supports. These crops should already be established; most are not September sowings for this winter.'],
        ['<b>Finished, healthy annuals</b>', 'Remove ties and labels, then cut up bulky stems for the compost heap. Healthy pea and bean roots can stay in the soil; they are not a complete feed for the next crop.'],
        ['<b>Weeds and suspect plants</b>', 'Remove weeds before they shed seed. Keep persistent roots and suspect diseased material separate from ordinary compost until you know how to handle them.'],
        ['<b>Seedheads and quiet corners</b>', 'Retain some healthy standing stems and leaf litter away from crop rows and paths. Check for wildlife before moving piles or cutting long growth.'],
    ], [139, CW-139], size=10, pad=9)
    p.note('Let the ground decide', 'Work from paths. If soil sticks heavily to your boots or tools, postpone digging and clearing that needs you to stand on it. Choose a dry-storage or tool-cleaning job instead.', g.PALE)
    p.end()

    p = Page(c, '05', 'One bed at a time.', 'A manageable checklist for the end of a growing season', 2, 'Autumn plot / sort, record, cover')
    p.heading('Sort the clear-up as you go')
    p.cols([
        ('For the compost heap', 'Mix soft crop remains with dry, woody material or torn plain cardboard. Chop tough stems. Remove plastic twine, clips and labels before adding anything.'),
        ('Keep separate', 'A cool home heap may not destroy weed seeds, persistent roots or every disease. Identify the problem and check disease-specific advice and your council\'s green-waste rules.'),
    ])
    p.note('If roots look diseased', 'Unusual swollen brassica roots or rotting allium roots need a closer look. Do not spread suspect roots or their soil around the plot. Record the bed and crop before removing material; an ordinary rotation may not control a persistent soil disease.')
    p.heading('Your next plot visit')
    checklist(p, [
        'Pick what is ready and separate produce for immediate use from sound crops suitable for storage.',
        'Mark the crops staying through winter. Take a photo of the bed and note any disease or poor growth.',
        'Clear one finished section, collecting supports and sorting the plant material.',
        'Remove weeds, then choose a suitable surface mulch or timely green manure for the empty area.',
        'Clear the access path; leave a quiet wildlife corner undisturbed.',
    ])
    p.para('<b>My next bed:</b> ____________________   <b>Next visit:</b> ____________________', size=10)
    related(p, 'vegetable-storage', 'Next: Vegetable storage - keep more of your harvest')
    p.end(); c.save()


def soil():
    c = g.new_pdf('winter-soil-care', 'Winter soil care')
    p = Page(c, '06', 'Cover for winter.', 'Mulch, green manures and leafmould for your vegetable beds', 1, 'September-November / look after the soil')
    p.para('As beds empty, decide how each one will spend winter. A living crop or suitable surface cover can protect the soil. Match the choice to your next planting date, the material you have and how wet your plot becomes.')
    p.heading('Choose a cover that fits')
    p.table(['YOUR BED', 'A PRACTICAL CHOICE'], [
        ['<b>Still growing vegetables</b>', 'Keep the crop in place and remove competing weeds. Leave room around stems and crowns if adding a mulch; do not bury the plants.'],
        ['<b>Empty and ready for mulch</b>', 'Weed first. Apply a roughly 5cm layer of well-rotted garden compost or leafmould to moist, unfrozen soil. Leave it on the surface; do not spread onto waterlogged ground.'],
        ['<b>Empty with time to grow cover</b>', 'Choose a hardy green manure within its sowing window. Allow time to establish it now and clear it before the next crop. A packet suited to August may not suit late October.'],
        ['<b>Too wet to work</b>', 'Keep off the bed and wait. Make notes on where water collects. Mulch is not a cure for persistent waterlogging; investigate the cause before planting.'],
    ], [139, CW-139], size=10.2, pad=10)
    p.heading('Make your materials go further')
    p.para('Prioritise exposed, empty beds. Leafmould is useful when you mainly want cover and organic matter; it is not a strong fertiliser. Save woody chips for paths rather than digging fresh chips into vegetable soil.')
    p.note('Measure before you order', 'Length x width x depth gives the volume. A 1m x 2m bed covered 5cm deep needs 0.1 cubic metres, or about <b>100 litres</b>. Measure only the area you intend to cover.')
    p.end()

    p = Page(c, '06', 'Grow it. Gather it.', 'Two autumn options, plus a short winter check', 2, 'Winter soil / plan the next crop too')
    p.heading('Green manures for autumn')
    p.table(['COVER CROP', 'TYPICAL UK SOWING WINDOW', 'BEFORE CHOOSING'], [
        ['Winter field beans', 'September-November', 'A legume: include it in your pea and bean rotation.'],
        ['Grazing rye', 'August-November', 'Hardy cover, but strong roots take work to clear. Plan ahead.'],
        ['Winter tares / vetch', 'July-September', 'A legume. Late September is the end of the usual window.'],
    ], [130, 159, CW-289], size=9.6, pad=8)
    p.para('These are broad windows, not a guarantee. Follow the seed supplier\'s depth and rate, and sow only when conditions allow establishment. Colder or exposed plots may need an earlier finish. Mustard belongs to the brassica rotation.', size=10)
    p.para('Cut before seed sets. If digging green manure in, allow about a month before sowing or planting the next crop. For no-dig beds, choose a species and a removal method you can manage; cutting alone does not reliably stop every species regrowing.', size=10)
    p.heading('Turn autumn leaves into leafmould')
    p.para('Gather fallen leaves from paths into a ventilated container or reused bag with air holes. Dampen dry leaves, label the date and leave them to break down. Check occasionally for moisture. Expect roughly one to two years, sometimes longer for tough leaves; this autumn\'s batch is for a future season.')
    p.para('Leave some leaves in quiet corners for wildlife. Keep litter and plastic out of your collection, and do not rake every sheltered patch bare.', size=10)
    p.heading('A quick winter check')
    checklist(p, [
        'After wind or heavy rain: check covers, paths and standing water.',
        'Before spring sowing: confirm when the cover crop needs removing.',
    ])
    related(p, 'crop-rotation', 'Next: Crop rotation - plan where next year\'s crops will go')
    p.end(); c.save()


def cleaning():
    c = g.new_pdf('autumn-tools-and-greenhouse', 'Autumn tools and greenhouse care')
    p = Page(c, '07', 'Clean. Dry. Put away.', 'Autumn care for tools, pots, supports and the greenhouse', 1, 'September-November / equipment that lasts')
    p.para('Choose a mild, dry day, and tackle one group of equipment at a time. Set out three places: ready to store, still drying and needs repair. Keep tools you use for winter harvests easy to reach.')
    p.heading('A simple end-of-season routine')
    p.table(['ITEM', 'CLEAN AND CHECK', 'STORE READY TO USE'], [
        ['<b>Spades, forks and hoes</b>', 'Brush or wash off soil. Inspect handles, joints and metal for damage. Dry thoroughly.', 'Use a light protective oil on suitable metal parts, following the maker\'s advice. Store under cover with sharp edges protected.'],
        ['<b>Secateurs and cutters</b>', 'Remove sap and debris. Check the blade and moving parts. Sharpen only with a suitable tool and the correct method.', 'Dry and lubricate as directed. Lock closed. Put damaged tools aside for repair rather than back into use.'],
        ['<b>Pots and seed trays</b>', 'Empty, brush out and wash with warm soapy water. Rinse well, including drainage holes.', 'Let them dry before stacking. Keep frost-vulnerable empty pots under cover.'],
        ['<b>Canes, ties and netting</b>', 'Remove soil and old ties. Check for cracks, sharp ends and trapped wildlife before folding.', 'Dry and bundle canes. Fold netting into a labelled bag so it cannot trail or entangle wildlife.'],
    ], [100, 210, CW-310], size=9.7, pad=8)
    p.note('Cleaning comes before disinfecting', 'Routine dirt removal and drying matter. If a known plant disease calls for disinfection, follow advice for that disease and a suitable product\'s label. Do not improvise chemical mixtures or use a stronger dilution.', g.PALE)
    related(p, 'seed-storage-and-lifespan', 'Next: Seed storage &amp; lifespan - sort your seed packets too')
    p.end()

    p = Page(c, '07', 'Let the light in.', 'A greenhouse reset after the summer crops have finished', 2, 'Autumn greenhouse / clean between crops')
    p.para('Wait until the crop has finished, or work section by section. Give any plants moved out a sheltered place and return them before they become chilled. Choose weather that suits the plants you grow, not simply a date in the diary.')
    p.heading('Work from empty space to clean space')
    checklist(p, [
        '<b>Empty and sort.</b> Remove finished crops, spare pots and ties; separate suspect plant material.',
        '<b>Brush first.</b> Collect loose debris from the floor, staging and frame corners.',
        '<b>Wash the glazing.</b> Use warm water and a soft cloth inside and out. Avoid abrasive tools, especially on plastic panels.',
        '<b>Clean staging and pots.</b> Scrub the shelves; wash pots and propagation equipment separately, then rinse.',
        '<b>Clear reachable gutters.</b> Remove leaves and check that downpipes are not blocked.',
        '<b>Dry and inspect.</b> Ventilate while drying. Check panes, fixings, doors and vents before moving equipment back.',
    ])
    p.note('Keep the clean-up within reach', 'Never lean your weight on greenhouse glazing or over its roof. Use suitable long-handled tools from a stable position. Arrange help for damaged panes or work you cannot safely reach.')
    p.heading('Leave yourself a spring-ready shelf')
    p.para('Group clean trays and pots by size. Put readable labels, a pencil and usable ties together. Keep a short repair list so a split handle or faulty vent does not get forgotten over winter.')
    p.para('<b>Repair or replace:</b> __________________________________________________', size=10)
    p.para('<b>Ready for next season:</b> _______________________________________________', size=10)
    p.end(); c.save()


if __name__ == '__main__':
    g.OUT.mkdir(parents=True, exist_ok=True)
    clearing(); soil(); cleaning()
    output = g.ROOT / 'output/pdf'
    output.mkdir(parents=True, exist_ok=True)
    for slug in ('autumn-plot-clear-up', 'winter-soil-care', 'autumn-tools-and-greenhouse'):
        shutil.copy2(g.OUT / f'growguide-uk-{slug}.pdf', output)
    print(json.dumps(g.manifest, indent=2))
