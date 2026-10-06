"""Rebuild the committed CV from the same content as the website.
Requires reportlab and DejaVu fonts; not needed to build or serve the website.
"""
import json, os, sys
from html import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

content=json.load(sys.stdin)
font_dir=os.environ.get('CV_FONT_DIR', '/usr/share/fonts/truetype/dejavu/')
if not font_dir.endswith('/'): font_dir += '/'
for name,file in [('Regular','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Italic','DejaVuSerif.ttf')]:
    pdfmetrics.registerFont(TTFont(name,font_dir+file))
pdfmetrics.registerFontFamily('Regular',normal='Regular',bold='Bold',italic='Italic')
ink=HexColor('#12372d'); muted=HexColor('#506353'); plum=HexColor('#610d3d'); rule=HexColor('#c5ccba')
styles={
 'name':ParagraphStyle('name',fontName='Bold',fontSize=25,leading=29,textColor=ink,spaceAfter=7),
 'role':ParagraphStyle('role',fontName='Regular',fontSize=11,leading=15,textColor=ink,spaceAfter=8),
 'body':ParagraphStyle('body',fontName='Regular',fontSize=8.6,leading=12.4,textColor=ink,spaceAfter=4),
 'small':ParagraphStyle('small',fontName='Regular',fontSize=7.8,leading=11.4,textColor=muted,spaceAfter=7),
 'label':ParagraphStyle('label',fontName='Bold',fontSize=8.1,leading=12,textColor=plum,spaceBefore=11,spaceAfter=7),
 'title':ParagraphStyle('title',fontName='Bold',fontSize=10,leading=13.5,textColor=ink,spaceAfter=3),
 'quote':ParagraphStyle('quote',fontName='Italic',fontSize=8.1,leading=12,textColor=muted,spaceAfter=6)
}
def P(text,kind='body',raw=False):return Paragraph(text if raw else escape(text).replace('—','-').replace('–','-'),styles[kind])
def footer(c,doc):
 c.setStrokeColor(rule);c.line(42,40,A4[0]-42,40);c.setFont('Regular',7.5);c.setFillColor(muted)
 c.drawString(42,26,'miguelalmeida.is-a.dev  /  Berlin, Germany')
 c.linkURL('https://miguelalmeida.is-a.dev',(42,22,290,36),relative=0,thickness=0)
 c.setTitle('Miguel Almeida - Frontend Developer & Design Engineer');c.setAuthor('Miguel Almeida')

site=content['site'];doc=SimpleDocTemplate(sys.argv[1],pagesize=A4,rightMargin=42,leftMargin=42,topMargin=35,bottomMargin=53)
header=[P(site['name'],'name'),P('Frontend developer & design engineer','role'),P(f'<a href="mailto:{site["email"]}">{site["email"]}</a>  ·  Berlin, Germany','small',True),P('<a href="https://www.linkedin.com/in/miguelalmeida1/">LinkedIn</a>  /  <a href="https://github.com/miguelalmeida0">GitHub</a>  /  <a href="https://miguelalmeida.is-a.dev">Portfolio & case studies</a>','small',True),Spacer(1,5),P(content['cvBio']),Spacer(1,5)]
left=[P('EXPERIENCE','label')]
for job in content['cvExperience']:
 left += [P(job['role'],'title'),P(f'{job["company"]} · {job["location"]} · {job["years"]}','small')]
 for bullet in job['bullets']:left.append(P('• '+bullet))
 left.append(Spacer(1,5))
left.append(P('SELECTED WORK','label'))
for project in content['cvProjects']:
 left += [P(f'<a href="https://miguelalmeida.is-a.dev{project["href"]}">{escape(project["name"])}</a>','title',True),P(project['pdfDescription'],'small')]
 if project.get('live'):
  url=escape(project['live'],quote=True)
  left.append(P(f'<a href="{url}">{url}</a>','small',True))
r=content['professionalRecommendation']
right=[P('CORE SKILLS','label'),P('React · Svelte · TypeScript<br/>Tailwind CSS · Playwright<br/>Product UI · Design systems<br/>Accessibility · Figma',raw=True),P('EDUCATION','label')]
for education in content['cvEducation']:
 right += [P(education['year'],'small'),P(education['title'],'title'),P(education['place'],'small'),Spacer(1,8)]
right.append(P('LANGUAGES','label'))
right += [P(language,'small') for language in content['cvLanguages']]
right += [P('RECOMMENDATION','label'),P('“'+r['quote']+'”','quote'),P(r['name']+' · '+r['role'],'small')]
columns=Table([[left,'',right]],colWidths=[327,25,A4[0]-84-352])
columns.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
doc.build(header+[columns],onFirstPage=footer,onLaterPages=footer)
print('Generated '+sys.argv[1])
