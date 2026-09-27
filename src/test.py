import sys, os
from playwright.sync_api import sync_playwright
f=sys.argv[1]; tag=sys.argv[2]
routes=['','cat/clans','cat/disciplines','cat/rituals','cat/predators','cat/merits','cat/loresheets','cat/sects','cat/players','cat/people',
 'cat/places','cat/domains','cat/threats','cat/items','tool/bp','tool/resonance','tool/compulsions','tool/court','tool/boons','tool/web',
 'tool/lineage','tool/masq','tool/chron','world','cons']
if tag=='seed': routes+=['clan/brujah','disc/dominate','ritual/ward','lore/l1','sect/cam','player/vlad','pc/anna','person/meld','person/erik',
 'person/boulder','place/old','place/ely','domain/d1','threat/inq']
shots=set(sys.argv[3].split(',')) if len(sys.argv)>3 else set()
os.makedirs('shots',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':1400,'height':900})
    errs=[]
    pg.on('pageerror',lambda e: errs.append(('PAGEERR',str(e))))
    pg.on('console',lambda m: errs.append(('CONSOLE',m.text)) if m.type=='error' else None)
    pg.add_init_script("window.name='KODEKS_TEST_BYPASS'")  # см. bootAuth() в p3f_auth.js — обходит вход при тестах, Firebase недоступен из песочницы
    pg.goto('file://'+os.path.abspath(f)); pg.wait_for_timeout(500)
    for r in routes:
        n=len(errs)
        pg.evaluate("h=>{location.hash='#/'+h}",r); pg.wait_for_timeout(250)
        t=pg.evaluate("document.getElementById('app').innerText.length")
        if len(errs)>n or t<50: print('ROUTE',r,'len',t,errs[n:])
        if r in shots: pg.screenshot(path='shots/%s_%s.png'%(tag,r.replace('/','_') or 'home'),full_page=False)
    # interactions
    pg.evaluate("location.hash='#/tool/resonance'"); pg.wait_for_timeout(200); pg.click('#resRoll'); pg.wait_for_timeout(100)
    pg.evaluate("location.hash='#/tool/compulsions'"); pg.wait_for_timeout(200); pg.click('#compRoll')
    pg.click('#dkHead'); pg.click('#dkRoll'); pg.wait_for_timeout(100); pg.click('#dkWp'); pg.click('#dkRouse')
    if tag=='seed':
        pg.evaluate("location.hash='#/pc/anna'"); pg.wait_for_timeout(300)
        pg.click('[data-act="stn"][data-v="1"]'); pg.click('[data-act="remorse"]'); pg.click('.pip >> nth=3'); pg.click('[data-act="d"][data-p="h"][data-k="s"]')
        pg.click('button.roll >> nth=0') if pg.locator('button.roll').count() else None
    if not pg.evaluate("document.body.classList.contains('sess-open')"): pg.click('#sessTab')
    pg.wait_for_timeout(300)
    pg.evaluate("[].forEach.call(document.querySelectorAll('#sessBody details'),function(d){d.open=true})")
    pg.click('[data-nt="60"]'); pg.fill('#odN','Анна'); pg.fill('#odV','5'); pg.click('[data-oa="add"]'); pg.click('[data-oa="next"]')
    pg.fill('#q','кла'); pg.wait_for_timeout(200)
    pg.screenshot(path='shots/%s_panel.png'%tag)
    pg.keyboard.press('Escape')
    print('dock:',pg.evaluate("document.getElementById('dkLog').innerText")[:300])
    print('ERRORS',errs)
    b.close()
