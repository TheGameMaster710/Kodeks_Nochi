# Интерактивный чарник (§1.3.5): макет Firestore, который, как настоящий,
# отвергает массивы внутри массивов и применяет правила pcs.
import os, json
from playwright.sync_api import sync_playwright
MOCK=r"""
window.__pcs={};var PL=[];
window.firebase=window.firebase||{};window.firebase.firestore={FieldValue:{serverTimestamp:function(){return '__ts';}}};
function nested(v,inArr){if(Array.isArray(v)){if(inArr)return true;return v.some(function(e){return nested(e,true);});}
  if(v&&typeof v==='object'){for(var k in v)if(nested(v[k],false))return true;}return false;}
function isM(){return SESSION.role==='master'||SESSION.role==='admin';}
function emit(){PL.forEach(function(e){
  if(!isM()&&e.w!==SESSION.username){var er=new Error('perm');er.code='permission-denied';e.err&&e.err(er);return;}
  var docs=Object.keys(__pcs).filter(function(id){return e.w==null||__pcs[id].owner===e.w;}).map(function(id){var d=JSON.parse(JSON.stringify(__pcs[id]));return {id:id,data:function(){return d;}};});
  e.cb({forEach:function(f){docs.forEach(f);}});});}
function col(w){return {
  where:function(f,o,v){return col(v);},
  onSnapshot:function(cb,err){var e={cb:cb,err:err,w:w==null?null:w};PL.push(e);emit();return function(){PL=PL.filter(function(x){return x!==e;});};},
  add:function(d){if(nested(d,false))return Promise.reject(new Error('Nested arrays are not supported'));
    if(d.owner!==SESSION.username)return Promise.reject(new Error('perm'));var id='p'+Date.now();__pcs[id]=JSON.parse(JSON.stringify(d));setTimeout(emit,0);return Promise.resolve({id:id});},
  doc:function(id){return {set:function(d,o){if(nested(d,false))return Promise.reject(new Error('Nested arrays are not supported'));
      var cur=__pcs[id];if(!cur||cur.owner!==SESSION.username){var er=new Error('perm');er.code='permission-denied';return Promise.reject(er);}
      for(var k in d)cur[k]=JSON.parse(JSON.stringify(d[k]));setTimeout(emit,0);return Promise.resolve();},
    delete:function(){delete __pcs[id];setTimeout(emit,0);return Promise.resolve();}};}
};}
window.fbDb={collection:function(n){return n==='pcs'?col(null):{where:function(){return {onSnapshot:function(cb){cb({forEach:function(){}});return function(){};}};},doc:function(){return {onSnapshot:function(){return function(){};}};}};}};
"""
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1300,'height':1000})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('dialog',lambda d:d.accept())
    pg.add_init_script("window.name='KODEKS_TEST_BYPASS'")
    pg.goto('file://'+os.path.abspath('kodeks-nochi.html'));pg.wait_for_timeout(400)
    pg.evaluate(MOCK)
    T=lambda:pg.evaluate("document.getElementById('app').innerText")
    pg.evaluate("SESSION={username:'anna',role:'player',displayName:'Анна'};startCoterieSync();location.hash='#/cat/players'");pg.wait_for_timeout(200)
    pg.click('#pcNewBtn');pg.wait_for_timeout(100)
    print('clan options:', pg.eval_on_selector_all('#pcf_clan option','e=>e.length'), '| sect:', pg.eval_on_selector_all('#pcf_sect option','e=>e.map(o=>o.textContent).join(",")'), '| pred:', pg.eval_on_selector_all('#pcf_pred option','e=>e.length'))
    pg.fill('#pcf_name','Анна Тест');pg.select_option('#pcf_clan','Тремер');pg.fill('#pcf_cL0','Возраст');pg.fill('#pcf_cT0','30');pg.fill('#pcf_bB0','Не убивать детей');pg.fill('#pcf_bA0','Сестра')
    pg.click('[data-pcf="save"]');pg.wait_for_timeout(300)
    print('save err:', pg.evaluate("(document.getElementById('pcfErr')||{}).textContent"))
    pid=pg.evaluate("Object.keys(__pcs)[0]"); print('created:', pid, '| concept stored as:', json.dumps(pg.evaluate("__pcs[Object.keys(__pcs)[0]].concept"),ensure_ascii=False))
    print('on sheet page:', 'Атрибуты' in T(), '| concept shown:', 'Возраст' in T(), '| conviction:', 'Не убивать детей' in T())
    print('derived health 1+3:', pg.evaluate("trkGet(trkKey(findLivePc('%s'))).hMax"%pid))
    pg.click('[data-sh="edit"]');pg.wait_for_timeout(100)
    pg.click('[data-sh="dot"][data-k="a:sta"][data-v="3"]');pg.click('[data-sh="dot"][data-k="a:str"][data-v="4"]')
    pg.click('[data-sh="dot"][data-k="s:bra"][data-v="3"]');pg.click('[data-sh="dot"][data-k="a:com"][data-v="3"]');pg.click('[data-sh="dot"][data-k="a:res"][data-v="2"]')
    pg.click('[data-sh="dadd"]');pg.wait_for_timeout(50)
    pg.select_option('[data-shf="dn"][data-i="0"]','Магия крови');pg.click('[data-sh="dot"][data-k="d:0"][data-v="2"]')
    pg.fill('[data-shf="dp"][data-i="0"]','Первая сила\nВторая сила')
    pg.click('[data-sh="aadd"]');pg.wait_for_timeout(50);pg.select_option('[data-shf="an"][data-i="0"]','Наследие войны');pg.wait_for_timeout(50)
    pg.click('[data-sh="dot"][data-k="v:0"][data-v="4"]');pg.wait_for_timeout(50)
    print('adv picker: kind tag =',pg.inner_text('.sh-arow .tag'),'| dots buttons =',pg.eval_on_selector_all('.sh-arow .sd','e=>e.length'))
    pg.select_option('[data-shf="huntA"]','cha');pg.select_option('[data-shf="huntS"]','sub')
    pg.fill('#sh_specs','Драка (ножи)');pg.fill('[data-shf="xpTotal"]','12');pg.fill('[data-shf="notes"]','Рыжая, в очках')
    pg.wait_for_timeout(1100)
    d=pg.evaluate("__pcs['%s']"%pid)
    print('saved attrs:', d.get('attrs'), '| skills:', d.get('skills'), '| disc:', json.dumps(d.get('disciplines'),ensure_ascii=False), '| adv:', json.dumps(d.get('advantages'),ensure_ascii=False))
    print('saved hunt/specs/xp/notes:', d.get('huntA'), d.get('huntS'), d.get('specs'), d.get('xpTotal'), d.get('notes'), '|', pg.evaluate("document.getElementById('shSaved').textContent"))
    print('derived health 3+3, wp 3+2:', pg.evaluate("var s=trkGet(trkKey(findLivePc('%s')));[s.hMax,s.wMax]"%pid))
    pg.click('[data-sh="edit"]');pg.wait_for_timeout(100)
    print('adv desc in view:', 'Легенда той ночи' in pg.inner_text('.sh-adv'), '| dimmed levels:', pg.eval_on_selector_all('.sh-adv .sh-alv.off','e=>e.length'), '| locked saved:', pg.evaluate("findLivePc('%s').advantages[0][4]"%pid))
    pg.click('[data-sh="edit"]');pg.wait_for_timeout(100)
    print('locked row: select gone =', pg.eval_on_selector_all('[data-shf="an"]','e=>e.length')==0, '| lock label =', pg.eval_on_selector_all('.sh-alock','e=>e.length'), '| dots editable =', pg.eval_on_selector_all('.sh-arow .sd','e=>e.length'))
    pg.click('[data-sh="dot"][data-k="v:0"][data-v="2"]');pg.wait_for_timeout(50);print('dots after lock:', pg.evaluate("findLivePc('%s').advantages[0][1]"%pid))
    pg.click('[data-sh="dot"][data-k="v:0"][data-v="4"]');pg.wait_for_timeout(50)
    pg.click('[data-sh="edit"]');pg.wait_for_timeout(1000);print('fs lock flag:', json.dumps(pg.evaluate("__pcs['%s'].advantages"%pid),ensure_ascii=False))
    t=T();print('view: powers listed', 'Вторая сила' in t, '| hunt pool', 'Обаяние + Хитрость = 1' in t, '| xp avail 12', 'Доступно' in t, '| clan disc tag', 'КЛАНОВАЯ' in t.upper())
    # бросок
    pg.click('[data-sh="pick"][data-k="a:str"]');pg.click('[data-sh="pick"][data-k="s:bra"]');pg.wait_for_timeout(50)
    print('pool text:', pg.evaluate("document.querySelector('.sh-total').innerText"))
    pg.evaluate("var x=findLivePc('%s');var st=trkGet(trkKey(x));st.hunger=3;trkSet(trkKey(x),st);"%pid);pg.wait_for_timeout(100)
    pg.click('[data-sh="roll"]');pg.wait_for_timeout(100)
    print('dice rolled:', pg.evaluate("LAST.dice.length"), 'hunger dice:', pg.evaluate("LAST.dice.filter(function(d){return d.h}).length"), '| dock pc:', pg.evaluate("dkPc.value"), '| log:', pg.evaluate("LOG[0].l"))
    # ослабление: здоровье полное → −2 к физическому
    pg.evaluate("var x=findLivePc('%s');var st=trkGet(trkKey(x));st.hSup=st.hMax;trkSet(trkKey(x),st);"%pid);pg.wait_for_timeout(100);pg.evaluate("location.hash='#/cat/players';");pg.wait_for_timeout(50);pg.evaluate("location.hash='#/coterie/%s'"%pid);pg.wait_for_timeout(150)
    print('impaired pool:', pg.evaluate("document.querySelector('.sh-total').innerText"))
    pg.click('[data-sh="hunt"]');pg.wait_for_timeout(50);print('hunt roll:', pg.evaluate("LOG[0].l"))
    # анкета не затирает дисциплины
    pg.click('#pcEditBtn');pg.wait_for_timeout(100);pg.fill('#pcf_short','обновлено');pg.click('[data-pcf="save"]');pg.wait_for_timeout(300)
    print('after form save disc kept:', json.dumps(pg.evaluate("__pcs['%s'].disciplines"%pid),ensure_ascii=False)[:60], '| short:', pg.evaluate("__pcs['%s'].short"%pid))
    # мастер: просмотр, бросок есть, правки нет
    pg.evaluate("SESSION={username:'gm',role:'master',displayName:'ГМ'};startCoterieSync();location.hash='#/cat/players'");pg.wait_for_timeout(100)
    pg.evaluate("location.hash='#/coterie/%s'"%pid);pg.wait_for_timeout(200)
    print('master: edit btn', pg.locator('[data-sh="edit"]').count(), '| roll btn', pg.locator('[data-sh="roll"]').count(), '| dots clickable', pg.locator('button.sd').count())
    pg.screenshot(path='shots/sheet_master.png',full_page=False)
    print('ERR',errs);b.close()
