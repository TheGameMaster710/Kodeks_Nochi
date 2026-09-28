# Мастерский слой (§1.3.4): макет Firestore с правилом gmlayer read/write: isMaster()
import os
from playwright.sync_api import sync_playwright
MOCK=r"""
window.__gm=null;
window.firebase=window.firebase||{};window.firebase.firestore={FieldValue:{serverTimestamp:function(){return {toDate:function(){return new Date();}};}}};
var L=[];
function isM(){return SESSION&&(SESSION.role==='master'||SESSION.role==='admin');}
function fire(){L.forEach(function(e){ if(!isM()){var er=new Error('perm');er.code='permission-denied';e.err&&e.err(er);return;}
  e.cb({exists:!!window.__gm,data:function(){return window.__gm;}});});}
function gmDoc(){return {
  onSnapshot:function(cb,err){var e={cb:cb,err:err};L.push(e);fire();return function(){L=L.filter(function(x){return x!==e;});};},
  set:function(d){if(!isM()){var er=new Error('perm');er.code='permission-denied';return Promise.reject(er);}window.__gm=d;setTimeout(fire,0);return Promise.resolve();}
};}
window.fbDb={collection:function(n){return {doc:gmDoc,where:function(){return this;},onSnapshot:function(){return function(){};}};}};
"""
LAYER=open('gm-layer.json').read()
import json
_L=json.loads(LAYER)
# тексты тайн берём из самого слоя — чтобы этот (публичный) тест их не содержал
_k=[n for n in _L['notes'] if n['id']=='kurt'][0]
SEC=_k['blocks'][1]['text'][:18]; SEC_T0=_k['blocks'][0]['t']; SEC_T1=_k['blocks'][1]['t']; SEC_TIE=_k['ties'][0][-25:]
_f=[n for n in _L['notes'] if n['id']=='flamor'][0]['blocks'][0]; F_AFTER=_f['after']; F_T=_f['t']
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1200,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.add_init_script("window.name='KODEKS_TEST_BYPASS'")
    pg.goto('file://'+os.path.abspath('kodeks-nochi.html'));pg.wait_for_timeout(400)
    pg.evaluate(MOCK)
    T=lambda:pg.evaluate("document.getElementById('app').innerText")
    # игрок
    pg.evaluate("SESSION={username:'anna',role:'player',displayName:'Анна'};renderUserBadge();startGmLayer();location.hash='#/person/kurt'");pg.wait_for_timeout(300)
    print('player: no toggle', pg.locator('.gmtog').count()==0, '| no secret', SEC not in T(), '| no badge link', pg.locator('#badgeGm').count()==0)
    pg.evaluate("location.hash='#/master/gm'");pg.wait_for_timeout(200)
    print('player: gm page redirected', 'Мастерский слой' not in T())
    # мастер, слой ещё не загружен
    pg.evaluate("SESSION={username:'gm',role:'master',displayName:'ГМ'};renderUserBadge();startGmLayer();location.hash='#/master/gm'");pg.wait_for_timeout(300)
    print('master empty:', 'ни разу не загружали' in T())
    # загрузка файла
    open('/tmp/claude-0/-home-claude/3865939a-1335-5841-92fc-bbfd7bb0473a/scratchpad/gm-layer.json','w').write(LAYER)
    pg.set_input_files('#gmFile','/tmp/claude-0/-home-claude/3865939a-1335-5841-92fc-bbfd7bb0473a/scratchpad/gm-layer.json')
    pg.click('#gmUp');pg.wait_for_timeout(500)
    print('after upload:', T().split('\n')[4:8])
    pg.evaluate("location.hash='#/person/flamor'");pg.wait_for_timeout(300)
    t=T();i=t.find(F_AFTER);j=t.find(F_T);k=t.find('Что выводит её из себя')
    print('flamor gm block in order:', 0<i<j<k)
    pg.evaluate("location.hash='#/person/kurt'");pg.wait_for_timeout(300)
    print('kurt secrets:', SEC in T(), SEC_T0 in T(), SEC_TIE in T())
    print('graph gm edge:', pg.evaluate("graphData().edges.some(function(e){return e.gm})"))
    pg.click('[data-gmv="0"]');pg.wait_for_timeout(200)
    print('toggle player view hides:', SEC not in T())
    pg.click('[data-gmv="1"]')
    # повторная загрузка не дублирует
    pg.evaluate("location.hash='#/master/gm'");pg.wait_for_timeout(200)
    pg.set_input_files('#gmFile','/tmp/claude-0/-home-claude/3865939a-1335-5841-92fc-bbfd7bb0473a/scratchpad/gm-layer.json');pg.click('#gmUp');pg.wait_for_timeout(500)
    print('no duplicates:', pg.evaluate("PEOPLE.filter(function(x){return x.id==='kurt'})[0].blocks.filter(function(b){return b.t==='"+SEC_T1+"'}).length"), pg.evaluate("RELATIONS.filter(function(r){return r._gml}).length"))
    # плохой файл
    open('/tmp/claude-0/-home-claude/3865939a-1335-5841-92fc-bbfd7bb0473a/scratchpad/bad.json','w').write('{"x":1}')
    pg.set_input_files('#gmFile','/tmp/claude-0/-home-claude/3865939a-1335-5841-92fc-bbfd7bb0473a/scratchpad/bad.json');pg.click('#gmUp');pg.wait_for_timeout(300)
    print('bad file error:', pg.evaluate("document.getElementById('gmErr').textContent"))
    # мастер вышел, зашёл игрок — тайны должны исчезнуть после отказа
    pg.evaluate("SESSION={username:'anna',role:'player',displayName:'Анна'};startGmLayer();removeGmLayer();location.hash='#/person/kurt'");pg.wait_for_timeout(300)
    print('player after master:', SEC not in T())
    print('ERR',errs);b.close()
