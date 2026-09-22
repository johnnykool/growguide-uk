"""Build the approved GrowGuide UK printable resource guides."""
from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/downloads'
FONT = ROOT / 'scripts/calendar-assets'
W,H = A4
M = 36
CW = W-2*M
INK='#5F5746'; MOSS='#8A8E75'; SAGE='#B5C7AD'; CLAY='#B18B7E'
CREAM='#F1EAD8'; STONE='#D5C7AD'; PALE='#FAF9F5'; RULE='#D8D5CA'
for name,file in [('Body','DMSans-Regular.ttf'),('Strong','DMSans-Semibold.ttf'),('Display','DMSerifDisplay-Regular.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Strong',italic='Body',boldItalic='Strong')

# Retained as an unpublished record of where each guide's facts came from.
# The guides no longer print a 'Sources checked' line or inline markers.
SOURCES = {
 'R1': ('Garden Organic - Planning your planting','https://www.gardenorganic.org.uk/expert-advice/how-to-grow/how-to-grow-vegetables-and-herbs/planning-your-planting'),
 'R2': ('University of Minnesota - Healthy garden soil','https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/living-soil-healthy-garden'),
 'R3': ('AHDB - Clubroot and cropping','https://horticulture.ahdb.org.uk/knowledge-library/clubroot-management-in-oilseed-rape-cropping-factors'),
 'R4': ('AHDB - Allium white rot research','https://horticulture.ahdb.org.uk/fv-449-onions-investigation-into-the-control-of-white-rot-in-bulb-and-salad-onion-crops'),
 'R5': ('Garden Organic - Container growing','https://www.gardenorganic.org.uk/expert-advice/how-to-grow/how-to-grow-vegetables-and-herbs/container-growing'),
 'C1': ('Garden Organic - Companion or mixed planting','https://www.gardenorganic.org.uk/expert-advice/how-to-grow/how-to-grow-flowers/companion-or-mixed-planting'),
 'C2': ('Conboy et al. (2019) - French marigolds and whitefly','https://doi.org/10.1371/journal.pone.0213071'),
 'C3': ('Kew - French marigolds for companion planting','https://www.kew.org/sites/default/files/2024-06/15763-Growing-French-Marigolds-for-companion-planting_2pp_A5_Leaflet_JM_AW_accessible.pdf'),
 'C4': ('University of Minnesota - Companion planting','https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/companion-planting-in-home-gardens'),
 'V1': ('Garden Organic - Harvesting and storing vegetables','https://www.gardenorganic.org.uk/expert-advice/garden-management/harvesting-and-storage/harvesting-and-storing-vegetables'),
 'V2': ('Food Standards Agency - Chilling and freezing','https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely'),
 'V3': ('Food Standards Agency - Home food fact checker','https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker'),
 'V4': ('Love Food Hate Waste Canada - Produce shelf life','https://lovefoodhatewaste.ca/keep-it-fresh/shelf-life/'),
 'V5': ("Johnny's Selected Seeds - Storage crops",'https://www.johnnyseeds.com/growers-library/methods-tools-supplies/harvesting-handling-storage/storage-crops.html'),
 'V6': ('Love Food Hate Waste UK - Where to store food','https://staging.lovefoodhatewaste.com/blog/nine-foods-youve-been-storing-wrong-place'),
 'V7': ('University of Minnesota - Harvest and storage','https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/harvesting-and-storing-home-garden-vegetables'),
 'S1': ('Real Seeds (Wales) - Vegetable seed life','https://www.realseeds.co.uk/seedlife.html'),
 'S2': ("Johnny's Selected Seeds - Storage and viability",'https://www.johnnyseeds.com/growers-library/reference-documents/seed-storage-guidelines.html'),
 'S3': ('Iowa State University - Storage and germination tests','https://yardandgarden.extension.iastate.edu/how-to/how-store-seeds-and-test-germination-rates'),
 'S4': ('Colorado State University - Seed storage','https://extension.colostate.edu/resource/storing-vegetable-and-flower-seeds/'),
 'S5': ("Johnny's Selected Seeds - Priming",'https://www.johnnyseeds.com/growers-library/glossary.html'),
}

manifest=[]
class Page:
    def __init__(self,c,series,title,subtitle,number,eyebrow):
        self.c=c; self.title=title; self.n=number; self.y=178; self.blocks=[]
        self.text(M+42,52,'GrowGuide UK',18,'Display')
        c.drawImage(str(ROOT/'public/images/growguide-logo.jpg'),M,H-64,32,32)
        self.text(W-M,42,'THE KITCHEN GARDEN / '+series,7.7,'Strong',align='right')
        self.text(W-M,58,'FREE GROWING GUIDE',8,'Strong',align='right')
        self.line(M,79,W-M,79,STONE)
        self.text(M,105,eyebrow.upper(),8.3,'Strong')
        self.text(M,142,title,33,'Display')
        self.text(M,163,subtitle,10)

    def text(self,x,y,t,size=10,font='Body',color=INK,align='left'):
        self.c.setFont(font,size);self.c.setFillColor(HexColor(color))
        fn={'left':self.c.drawString,'right':self.c.drawRightString,'center':self.c.drawCentredString}[align]
        fn(x,H-y,t)
    def line(self,x1,y1,x2,y2,col=RULE):
        self.c.setStrokeColor(HexColor(col)); self.c.setLineWidth(.6)
        self.c.line(x1,H-y1,x2,H-y2)
    def rect(self,x,y,w,h,col):
        self.c.setFillColor(HexColor(col));self.c.rect(x,H-y-h,w,h,stroke=0,fill=1)
    def para(self,t,x=None,y=None,w=None,size=10.2,leading=14,gap=9,color=INK):
        x=M if x is None else x; w=CW if w is None else w
        auto=y is None; y=self.y if auto else y
        p=Paragraph(t,ParagraphStyle('p',fontName='Body',fontSize=size,leading=leading,textColor=HexColor(color)))
        _,ht=p.wrap(w,1000);p.drawOn(self.c,x,H-y-ht)
        self.blocks.append((y,y+ht))
        if auto:self.y=y+ht+gap
        return ht
    def heading(self,t):
        self.y+=5;self.text(M,self.y+15,t,18,'Display');self.y+=26
    def note(self,label,t,col=CREAM):
        p=Paragraph('<b>'+label+'</b><br/>'+t,ParagraphStyle('n',fontName='Body',fontSize=10.1,leading=14,textColor=HexColor(INK)))
        _,ht=p.wrap(CW-24,1000)
        self.rect(M,self.y,CW,ht+22,col);p.drawOn(self.c,M+12,H-self.y-11-ht)
        self.blocks.append((self.y,self.y+ht+22));self.y+=ht+33
    def table(self,headers,rows,widths,size=9.4,pad=8):
        st=ParagraphStyle('cell',fontName='Body',fontSize=size,leading=size+3,textColor=HexColor(INK))
        def cell(t):return Paragraph(str(t),st)
        data=[[cell('<b>'+h+'</b>') for h in headers]]+[[cell(v) for v in r] for r in rows]
        tab=Table(data,colWidths=widths,hAlign='LEFT')
        cmds=[('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),HexColor(CREAM)),('LEFTPADDING',(0,0),(-1,-1),pad),('RIGHTPADDING',(0,0),(-1,-1),pad),('TOPPADDING',(0,0),(-1,-1),pad),('BOTTOMPADDING',(0,0),(-1,-1),pad),('LINEBELOW',(0,0),(-1,0),.6,HexColor(STONE))]
        for r in range(1,len(data)):
            if r%2:cmds.append(('BACKGROUND',(0,r),(-1,r),HexColor(PALE)))
            cmds.append(('LINEBELOW',(0,r),(-1,r),.35,HexColor(RULE)))
        colours={'A':STONE,'B':SAGE,'C':CREAM,'D':'#E8D1C3'}
        if headers[0]=='YEAR' or headers[-1]=='GROUP*':
            for r,row in enumerate(rows,1):
                for col,value in enumerate(row):
                    if value in colours:
                        cmds.append(('BACKGROUND',(col,r),(col,r),HexColor(colours[value])))
        tab.setStyle(TableStyle(cmds));_,ht=tab.wrap(CW,1000)
        tab.drawOn(self.c,M,H-self.y-ht);self.blocks.append((self.y,self.y+ht));self.y+=ht+12
    def cols(self,items):
        gap=20;w=(CW-gap)/2;y=self.y;bottom=y
        for i,(label,t) in enumerate(items):
            x=M+i*(w+gap);self.text(x,y+15,label,17,'Display')
            ht=self.para(t,x=x,y=y+25,w=w,size=10,leading=14)
            bottom=max(bottom,y+25+ht)
        self.y=bottom+14
    def end(self):
        assert self.y<771, (self.title,self.n,self.y)
        self.line(M,783,W-M,783,STONE)
        self.text(M,800,'Compiled by GrowGuide UK.',8.2,'Strong')
        self.text(W-M,800,f'{self.n} / 2',8.2,align='right')
        self.text(M,815,'growguideuk.co.uk  /  Edition 1  /  September 2026',7.5)
        self.text(W-M,815,'A4 · Print at 100%',7.5,align='right')
        manifest.append({'title':self.title,'page':self.n,'content_bottom':round(self.y,1)})
        self.c.showPage()

def new_pdf(slug,title):
    c=canvas.Canvas(str(OUT/f'growguide-uk-{slug}.pdf'),pagesize=A4,pageCompression=1)
    c.setTitle(title+' | GrowGuide UK | Edition 1');c.setAuthor('GrowGuide UK')
    c.setSubject('UK kitchen garden guide. Compiled by GrowGuide UK.')
    return c

def rotation():
    c=new_pdf('crop-rotation','Crop rotation')
    p=Page(c,'01','Rotate. Record. Repeat.','Crop rotation for UK beds, allotments and containers',1,'Crop rotation / know your families')
    p.para('Move related annual crops around your growing space to reduce repeated pressure from some soil pests and diseases. A four-year cycle is a useful starting point: return in year five, after three intervening growing years.')
    p.heading('Start with the plant family')
    p.table(['FAMILY','COMMON CROPS','GROUP*'],[
      ['Potato family','Potato, tomato, pepper, aubergine','A'],
      ['Pea family','Peas; broad, French and runner beans','B'],
      ['Cucumber family','Cucumber, courgette, pumpkin, butternut squash','B'],
      ['Cabbage family','Broccoli, cabbage, cauliflower, kale, sprouts, radish, turnip, swede, rocket, pak choi','C'],
      ['Onion group (alliums)','Onion, garlic, leek, spring onion, shallot, chives','D'],
      ['Carrot family','Carrot, parsnip, celery, celeriac, parsley, dill, coriander','D'],
      ['Beet family','Beetroot, chard, true spinach','D'],
      ['Daisy family','Lettuce, chicory, endive','D'],
      ['Grass family','Sweetcorn','B'],
    ],[127,CW-182,55],size=9.5,pad=7)
    p.para('*Letters refer to the example on page 2. B and D combine different families in separate patches; they are planning groups, not botanical families. Choose the crops you actually grow.',size=9.2,leading=12.5)
    p.note('Two easy mistakes to avoid','Radish and turnip belong with brassicas, even though you harvest their roots. Potatoes and tomatoes share a family, even though one grows below ground and the other above it.')
    p.para('Keep established perennial crops, such as asparagus, rhubarb and chives, in permanent positions. Record annual herbs in the rotation; basil belongs to the mint family and can occupy a separate annual herb patch.',size=9.5,leading=13)
    p.end()
    p=Page(c,'01','A plan for your plot.','A flexible four-year example, plus advice for smaller spaces',2,'Crop rotation / put it into practice')
    p.para('Divide your annual growing area into four sections. Keep the families assigned to each group together as the groups move; within a mixed group, give each crop its own space. This example is a layout aid, not a required feeding sequence.')
    p.table(['YEAR','BED 1','BED 2','BED 3','BED 4'],[
      ['1','A','B','C','D'],['2','B','C','D','A'],['3','C','D','A','B'],['4','D','A','B','C'],
    ],[67]+[(CW-67)/4]*4,size=10.8,pad=8)
    p.para('<b>A</b> Potato family  ·  <b>B</b> Peas/beans, cucurbits and sweetcorn<br/><b>C</b> Brassicas  ·  <b>D</b> Alliums, carrots/related crops, beets and lettuce',size=9.5,leading=14)
    p.cols([
      ('Beds & allotments','Draw a map each season and record catch crops, overwintered crops and problems. Keep mustard green manure in the brassica group. Feed for the crop and soil condition; peas and beans do not provide a complete fertiliser programme.'),
      ('Raised beds & small plots','Use named sections if whole beds are impractical. A tiny move within shared soil gives limited separation. If the full cycle will not fit, avoid repeating susceptible families where possible and use pots to add space.'),
    ])
    p.cols([
      ('Pots & grow bags','Changing a pot\'s position does not change its compost history. For repeated tomatoes or potatoes, use clean containers and fresh suitable peat-free compost. Keep suspect compost away from susceptible crops.'),
      ('The UK winter','A winter leek or kale crop still occupies its group until cleared. Do not force a change on 1 January. Plan from actual harvests, and avoid working soil when waterlogged; wet ground is easily compacted.'),
    ])
    p.note('When rotation is not enough','Clubroot and allium white rot can survive much longer than four years. If either is suspected, identify the problem before replanting, avoid moving affected soil and get disease-specific advice. A routine rotation is not a cure.',PALE)
    p.end();c.save()

def companions():
    c=new_pdf('companion-planting','Companion planting')
    p=Page(c,'02','Good neighbours.','Companion planting for a useful, diverse UK kitchen garden',1,'Companion planting / evidence first')
    p.para('Start with space, light and healthy soil. Mixed planting can support useful insects and make a bed more productive, but no pairing guarantees a pest-free crop. The examples below separate practical uses from results shown in particular trials.')
    p.table(['PAIRING','WHY TRY IT?','HOW TO USE IT'],[
      ['<b>Lettuce + widely spaced brassicas</b><br/>Practical use of space','Harvest a quick salad crop while the larger plants are still small.','Keep the brassicas\' full spacing. Remove lettuce before leaves overlap heavily. Both crops still count in your rotation.'],
      ['<b>Vegetables + open flowers</b><br/>Habitat support','Flowering coriander, calendula and poached-egg plant provide food for useful insects.','Use an edge strip or nearby pots. Aim for flowers over several months. More insect visits do not automatically mean less crop damage.'],
      ['<b>Tomato + French marigold</b><br/>UK trial evidence','Glasshouse trials found slower population growth of glasshouse whitefly.','Grow Tagetes patula alongside tomatoes from early in the crop. This is specific evidence, not proof against all pests or a rescue for a heavy infestation.'],
      ['<b>Vegetables + flowering herbs</b><br/>Practical habitat','Nearby herb pots add flowers without taking space from crop roots.','Let some dill or coriander flower, and keep others for leaves. Put pots where they will not shade crops or block paths.'],
    ],[136,167,CW-303],size=9.6,pad=9)
    p.heading('Keep the basics working')
    p.para('<b>Room to grow:</b> allow mature crop spacing and good airflow, especially in damp weather. <b>Protection:</b> use suitable insect mesh where a crop needs it. <b>Observation:</b> check leaf undersides, new shoots and companion plants regularly.')
    p.note('Choose the right marigold','French marigold is Tagetes patula. Pot marigold is Calendula officinalis. Both can be useful garden plants, but the tomato-whitefly trial used French marigolds.')
    p.end()
    p=Page(c,'02','Useful, with limits.','Traditional pairings, practical layouts and a simple garden trial',2,'Companion planting / what to expect')
    p.table(['TRADITIONAL IDEA','WHAT THE EVIDENCE ALLOWS'],[
      ['<b>Carrots + onions</b><br/>"Stops carrot fly"','Results are inconsistent. Grow them together if the layout suits you, but use well-fitted insect mesh when protection matters.'],
      ['<b>Tomatoes + basil</b><br/>"Improves tomato flavour"','Treat this as a kitchen pairing, not a dependable flavour treatment. Both enjoy warmth; keep enough root space and light for each.'],
      ['<b>Beans + nasturtiums</b><br/>"Diverts blackfly from beans"','Trap planting is not a guarantee. Nasturtiums can host aphids too: inspect both plants and do not rely on diversion alone.'],
      ['<b>Sweetcorn + beans + squash</b><br/>The Three Sisters','A traditional system with crop, variety and timing requirements. It can be difficult in cool, short UK summers. Give climbing beans their own strong supports for a simpler first attempt.'],
    ],[178,CW-178],size=9.7,pad=8)
    p.heading('Three ways to start small')
    p.para('<b>Allotment:</b> keep a narrow flower strip beside your vegetable rows, with access for weeding, picking and netting.<br/><b>Raised bed:</b> use young lettuce in temporary gaps between larger crops; clear it before competition starts.<br/><b>Patio:</b> place separate herb or flower pots near the vegetables. Match watering needs if sharing a container, and keep drainage holes clear.')
    p.note('Try one change and keep a record','Compare similar plants of the same variety, with and without the companion. Keep watering, feeding and spacing similar. Each week, note pest numbers, damage and harvest. One good season suggests something to try again; it does not prove the pairing caused it.',PALE)
    p.para('<b>UK timing:</b> harden off tender plants and wait until frost risk has passed locally. In cool or exposed gardens, prioritise crop light and warmth over squeezing in extra neighbours. Keep flowers outside insect mesh so pollinators can reach them.',size=9.5,leading=13)
    p.end();c.save()

def storage():
    c=new_pdf('vegetable-storage','Vegetable storage')
    p=Page(c,'03','Keep the harvest.','Vegetable storage for UK homes, sheds and allotments',1,'Vegetable storage / the longer keepers')
    p.para('Store only sound produce. Separate anything damaged for prompt use if still safe, and discard mouldy or rotten vegetables. Harvest gently and label batches. The conditions matter more than a calendar date.')
    p.table(['CROP','PREPARE & STORE','KEEPING EXPECTATION'],[
      ['<b>Maincrop potatoes</b>','Let surfaces dry; brush off loose soil. Store in darkness in paper sacks or breathable bags, protected from frost.','Weeks to months, depending on variety and store. Check for rot and sprouts.'],
      ['<b>Onions, garlic & shallots</b>','Dry under cover with airflow until skins and necks are thoroughly dry. Store cool, dry and ventilated.','Storage varieties can last months. Use thick-necked or damaged bulbs first if sound.'],
      ['<b>Carrot, parsnip, beetroot, swede & turnip</b>','Remove tops without cutting the crown. Pack sound, unwashed roots in slightly damp sand or coir; keep very cool, about 0-4°C, without freezing.','Several weeks or longer in a suitable store. Check that packing is not wet and roots are not shrivelling.'],
      ['<b>Pumpkin & winter squash</b>','Harvest mature fruit before frost. Keep the stalk intact; cure skin in a warm, dry, airy place. Store around 10-15°C with fruits apart.','Often months when properly matured. Immature or frost-damaged fruit stores poorly.'],
      ['<b>Winter cabbage</b>','Choose firm storage varieties. Keep sound heads very cool, about 0-4°C, with airflow and frost protection.','Weeks to months. Spring cabbage and loose heads are for quicker use.'],
    ],[113,263,CW-376],size=9.4,pad=8)
    p.para('These are broad expectations for suitable varieties and good storage, not guaranteed shelf lives. The root-packing, bulb-drying and squash conditions are different: one damp shed corner will not suit them all.',size=9.2,leading=12.5)
    p.note('A UK shed is not automatically a safe store','Check actual temperatures with a min/max thermometer. Protect from rain, rodents and frost; avoid condensation. If your store is unsuitable, keep smaller batches in the house or fridge and freeze a glut.')
    p.end()
    p=Page(c,'03','Fresh for the week.','A fridge guide and simple habits that reduce waste',2,'Vegetable storage / everyday harvests')
    p.para('Keep the fridge at 0-5°C; check with a thermometer. The times below are approximate quality windows for fresh, whole produce in good condition. Cut produce needs prompt refrigeration; follow any use-by date.')
    p.table(['CROP','WHERE & HOW','USE AS A GUIDE'],[
      ['Lettuce, spinach, kale','Fridge; a container or bag limits wilting. Keep leaves from sitting in water.','3-5 days'],
      ['Broccoli, sprouts; peas','Fridge; cool promptly after picking.','3-5 days'],
      ['French / runner beans','Fridge; keep in a bag. Young, tender pods are best.','About 1 week'],
      ['Cauliflower, peppers, cucumber','Fridge; protect from drying out and use promptly.','About 1 week'],
      ['Courgette; aubergine','Fridge for short storage; use aubergines first.','3-5 days; 2-3 days'],
      ['Spring onion; soft herbs','Fridge; protect from wilting. Keep basil stems in water at room temperature and use promptly.','A few days'],
      ['Carrot, beetroot, radish','Fridge; remove leafy tops and bag roots.','1-2 weeks'],
      ['Ripe tomatoes','Refrigerate to slow deterioration; bring to room temperature to serve. Ripen unripe whole fruit indoors first.','Use within a few days'],
    ],[140,268,CW-408],size=9.2,pad=6.7)
    p.cols([
      ('Still in the ground?','Suitable winter leeks, parsnips and hardy brassicas can be harvested as needed. Lift a small supply before frozen ground makes access difficult. Waterlogging, pests and exposed sites can make outdoor storage unreliable.'),
      ('A glut to freeze','Freeze while quality is good. Most vegetables need blanching first; use a crop-specific method. Cool cooked food and refrigerate within 1-2 hours. Keep leftovers for no more than 48 hours, or freeze.'),
    ])
    p.para('<b>Potato check:</b> current UK advice allows fridge storage as well as a cool, dark, dry place. Remove sprouts and green portions; discard extensively green, bitter, mouldy or rotten potatoes. Wash all produce before preparing or eating it.',size=9.5,leading=13)
    p.end();c.save()

SEEDS=[
 ('Aubergine','2-4'),('Basil','3-5'),('Beans, broad','3-4'),('Beans, French','3-4'),('Beans, runner','3-4'),('Beetroot','2-4'),('Broccoli','3-5'),('Brussels sprouts','3-5'),('Butternut squash','2-4'),('Cabbage','3-5'),('Carrot','2-3'),('Cauliflower','4-5'),('Celeriac','3-5'),('Celery','3-5'),('Chard','2-4'),('Chives','1-3'),('Coriander','1-4'),('Courgette','2-4'),
 ('Cucumber','3-6'),('Dill','1-4'),('Kale','3-5'),('Leek','1-2'),('Lettuce','1-5'),('Onion','1-2'),('Parsley','1-3'),('Parsnip','1*'),('Pea','3-4'),('Pepper / chilli','2-3'),('Pumpkin','2-4'),('Radish','4-5'),('Spinach, true','1-3'),('Spring onion','1-2'),('Swede','3-5'),('Sweetcorn','1-2'),('Tomato','3-5'),('Turnip','4-5')
]
def seeds():
    c=new_pdf('seed-storage-and-lifespan','Seed storage and lifespan')
    p=Page(c,'04','Save for next season.','Seed storage, germination checks and a 36-crop lifespan chart',1,'Seed care / cool, dry and labelled')
    p.para('Seed is alive. Age, heat and moisture affect how well it germinates, and old seed can produce weaker seedlings. Good storage slows decline; it cannot restore damaged seed.')
    p.heading('A simple storage routine')
    p.table(['STEP','WHAT TO DO'],[
      ['<b>01 / Dry</b>','For home-saved seed, remove pulp and debris and dry thoroughly before sealing. Damp UK autumn air can make drying slow. Use gentle airflow indoors; avoid ovens, radiators and hot greenhouses.'],
      ['<b>02 / Label</b>','Keep the original packet. For saved seed, record crop, variety, harvest year and collection notes. For bought seed, record purchase year and sow-by date; the seed may already be a year old.'],
      ['<b>03 / Seal</b>','Put dry seed in labelled paper envelopes inside an airtight jar or box. Add a sealed silica-gel sachet, kept separate from seed. Paper envelopes alone do not exclude moisture.'],
      ['<b>04 / Keep cool</b>','Use a reliably cool, dry cupboard, or an airtight container in the fridge at about 4-5°C. A damp shed or greenhouse is a poor choice for long-term storage.'],
      ['<b>05 / Warm, then open</b>','After refrigeration, let the sealed container reach room temperature before opening, so moisture does not condense on the cold seed. Return only dry packets to storage.'],
    ],[96,CW-96],size=10,pad=8)
    p.heading('Test a packet before you rely on it')
    p.para('About a month before sowing, take <b>20 seeds at random</b> (or 10 if supplies are limited). Put them on damp kitchen paper in a covered container. Label the sample; use the crop\'s recommended germination temperature and light conditions. Keep damp, not waterlogged.')
    p.para('Check daily and allow the full expected germination time; parsley and parsnip can be slow. Count normal seedlings, not just split seed coats. <b>16 seedlings from 20 seeds = 80% germination.</b> A small test is an estimate; garden emergence can be lower.')
    p.note('Use the result to plan','If the result is poor or seedlings weak, fresh seed is usually the better use of limited space. If you keep the batch, sow extra and thin to the correct spacing. Never eat seeds sold for sowing; they may be treated.',PALE)
    p.end()
    p=Page(c,'04','How long do seeds last?','Approximate useful storage life for common vegetables and herbs',2,'Seed care / keep, test or replace')
    p.para('Years below are <b>rough planning ranges from harvest</b> for dry, mature, untreated seed kept consistently cool and dry. Bought seed is not necessarily new: do not add these years to a packet\'s sow-by date. Germination testing is more useful than age alone.')
    rows=[]
    for a,b in zip(SEEDS[:18],SEEDS[18:]):rows.append([a[0],a[1],b[0],b[1]])
    p.table(['CROP','YEARS','CROP','YEARS'],rows,[CW*.375,CW*.125,CW*.375,CW*.125],size=10,pad=3.4)
    p.para('<b>*Parsnip:</b> buy or save fresh seed each season for reliability. Some older seed can germinate, but test before committing a row. Prioritise fresh onion, spring onion and leek seed too.',size=9.5,leading=13)
    p.para('<b>These are not expiry dates.</b> Sources report different lifespans; the chart uses practical, generally cautious ranges. Some batches fail sooner and some last much longer. Heat or damp can shorten any range.',size=9.4,leading=13)
    p.para('<b>Exceptions:</b> pelleted or primed seed may store for less time; follow the supplier\'s advice. Potato tubers, garlic cloves and onion sets are planting material, not dry seeds, and are outside this chart.',size=9.4,leading=13)
    p.end();c.save()

if __name__=='__main__':
    OUT.mkdir(parents=True,exist_ok=True)
    rotation();companions();storage();seeds()
    
    print(json.dumps(manifest,indent=2))
