import os
from playwright.sync_api import sync_playwright

# This mock simulates Firestore's real "list query" rule-safety check:
# a query is only allowed if the security rule can be PROVEN true for every
# possible result using the query's own where-clauses -- it does NOT silently
# filter per-document like naive mocks (including my earlier one) assumed.
MOCK = r"""
window.__pcsStore = {};
window.__usersStore = [
  {id:'anna', data:{role:'player', displayName:'Анна'}},
  {id:'bob', data:{role:'player', displayName:'Bob'}},
];
window.firebase = window.firebase || {};
window.firebase.firestore = window.firebase.firestore || {};
window.firebase.firestore.FieldValue = {serverTimestamp: function(){return {__ts:Date.now()};}};

var pcsListeners = []; // {cb, errCb, whereOwner: string|null}
var usersListeners = [];

function isMasterRole(){ return window.SESSION && (window.SESSION.role==='master'||window.SESSION.role==='admin'); }

function notifyPcs(){
  pcsListeners.forEach(function(entry){
    // Simulate Firestore's static list-rule check:
    // allowed iff isMaster() OR the query is constrained to where('owner','==', <this session's own username>)
    var allowed = isMasterRole() || (entry.whereOwner !== null && entry.whereOwner === (window.SESSION && window.SESSION.username));
    if(!allowed){
      var e = new Error('Missing or insufficient permissions.'); e.code='permission-denied';
      entry.errCb && entry.errCb(e);
      return;
    }
    var docs = [];
    Object.keys(window.__pcsStore).forEach(function(id){
      var d = window.__pcsStore[id];
      if(entry.whereOwner !== null && d.owner !== entry.whereOwner) return; // where clause actually filters
      docs.push({id:id, data:function(){return d;}});
    });
    entry.cb({forEach:function(fn){docs.forEach(fn);}});
  });
}
function notifyUsers(){
  usersListeners.forEach(function(cb){
    var docs = window.__usersStore.map(function(u){return {id:u.id, data:function(){return u.data;}};});
    cb({forEach:function(fn){docs.forEach(fn);}});
  });
}

function pcsCollectionRef(whereOwner){
  return {
    doc: function(id){
      return {
        set: function(data, opts){
          var cur = window.__pcsStore[id] || {};
          if(opts && opts.merge){ for(var k in data) cur[k]=data[k]; } else { cur = data; }
          window.__pcsStore[id] = cur;
          notifyPcs();
          return Promise.resolve();
        },
        delete: function(){ delete window.__pcsStore[id]; notifyPcs(); return Promise.resolve(); }
      };
    },
    add: function(data){
      var id = 'pc'+(Object.keys(window.__pcsStore).length+1)+'_'+Date.now();
      window.__pcsStore[id] = data;
      notifyPcs();
      return Promise.resolve({id:id});
    },
    where: function(field, op, val){
      if(field==='owner' && op==='==') return pcsCollectionRef(val);
      return pcsCollectionRef(whereOwner); // ignore unsupported combos for this test
    },
    onSnapshot: function(cb, errCb){
      var entry = {cb:cb, errCb:errCb, whereOwner: whereOwner===undefined ? null : whereOwner};
      pcsListeners.push(entry);
      notifyPcs();
      return function(){ pcsListeners = pcsListeners.filter(function(x){return x!==entry;}); };
    }
  };
}

window.fbDb = {
  collection: function(name){
    if(name==='pcs') return pcsCollectionRef(null);
    if(name==='users'){
      return {
        where: function(){
          return {
            onSnapshot: function(cb){
              usersListeners.push(cb);
              notifyUsers();
              return function(){ usersListeners = usersListeners.filter(function(x){return x!==cb;}); };
            }
          };
        }
      };
    }
    return {onSnapshot:function(){return function(){};}};
  }
};
"""

f = os.path.abspath('kodeks-nochi.html')
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width':1400,'height':900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(('PAGEERR', str(e))))
    pg.on('console', lambda m: errs.append(('CONSOLE', m.text)) if m.type == 'error' else None)
    pg.add_init_script("window.name='KODEKS_TEST_BYPASS'")
    pg.goto('file://' + f)
    pg.wait_for_timeout(400)
    pg.evaluate(MOCK)

    # --- Anna (a plain player) logs in and creates a character ---
    pg.evaluate("window.SESSION={username:'anna',role:'player',displayName:'Анна'}; startCoterieSync();")
    pg.wait_for_timeout(150)
    pg.evaluate("location.hash='#/cat/players'")
    pg.wait_for_timeout(200)
    pg.click('#pcNewBtn')
    pg.wait_for_timeout(150)
    pg.fill('#pcf_name', 'Анна Тест')
    if pg.locator('#pcf_clan').count():
        opts = pg.eval_on_selector_all('#pcf_clan option', 'els=>els.map(e=>e.value)')
        real = [o for o in opts if o]
        if real: pg.select_option('#pcf_clan', real[0])
    pg.click('[data-pcf="save"]')
    pg.wait_for_timeout(300)

    newId = pg.evaluate("location.hash.replace('#/coterie/','')")
    print('created id:', newId, 'in store:', pg.evaluate("Object.keys(window.__pcsStore)"))
    txt = pg.evaluate("document.getElementById('app').innerText")
    print("owner sees own new character (not 'недоступен'):", 'Анна Тест' in txt)
    print("owner does NOT see 'Персонаж недоступен':", 'Персонаж недоступен' not in txt)
    print("LIVE_PCS as seen by owner:", pg.evaluate("LIVE_PCS.map(function(x){return x.name;})"))

    # navigate away and back, to make sure it's not just a one-off render
    pg.evaluate("location.hash='#/cat/players'")
    pg.wait_for_timeout(200)
    txt2 = pg.evaluate("document.getElementById('app').innerText")
    print("own list shows the new character (Мои персонажи):", 'Анна Тест' in txt2)
    print("own list does NOT say 'Пока никого'alone-for-mine:", txt2.count('Пока никого'))

    # --- master should still see everything fine (unconstrained query allowed) ---
    pg.evaluate("window.SESSION={username:'gm',role:'master',displayName:'ГМ'}; startCoterieSync();")
    pg.wait_for_timeout(200)
    pg.evaluate("location.hash='#/coterie/'+%r" % newId)
    pg.wait_for_timeout(200)
    txt3 = pg.evaluate("document.getElementById('app').innerText")
    print("master sees Anna's new character via direct link:", 'Анна Тест' in txt3)
    print("master has edit button (should be False):", pg.evaluate("!!document.getElementById('pcEditBtn')"))

    # master's player-picker panel
    pg.evaluate("location.hash='#/cat/players'")
    pg.wait_for_timeout(200)
    print('picker select present:', pg.locator('#pcPickPlayer').count() > 0)
    if pg.locator('#pcPickPlayer').count():
        pg.select_option('#pcPickPlayer', 'anna')
        pg.wait_for_timeout(200)
        txt4 = pg.evaluate("document.getElementById('app').innerText")
        print('after picking anna, master sees her char name:', 'Анна Тест' in txt4)

    # --- delete flow: back as owner, delete her own character ---
    pg.evaluate("window.SESSION={username:'anna',role:'player',displayName:'Анна'}; startCoterieSync();")
    pg.wait_for_timeout(200)
    pg.evaluate("location.hash='#/coterie/'+%r" % newId)
    pg.wait_for_timeout(200)
    if pg.locator('#pcEditBtn').count():
        pg.click('#pcEditBtn')
        pg.wait_for_timeout(150)
    delBtn = pg.locator('[data-pcf="del"]')
    print('delete button present:', delBtn.count() > 0)
    if delBtn.count():
        pg.once('dialog', lambda d: d.accept())
        delBtn.first.click()
        pg.wait_for_timeout(300)
        print('store after delete:', pg.evaluate("Object.keys(window.__pcsStore)"))
        print('hash after delete:', pg.evaluate("location.hash"))

    print('ERRORS', errs)
    b.close()
