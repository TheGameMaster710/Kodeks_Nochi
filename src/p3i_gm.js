
/* ================= МАСТЕРСКИЙ СЛОЙ: ТУМАН ВОЙНЫ (с v1.44, §1.3.4) =================
   Тайны «для мастера» НЕ лежат в index.html. Их источник — p2_gm.js вне
   репозитория → gm-layer.json → мастер загружает его здесь, на странице
   #/master/gm, в Firestore gmlayer/main. Правило firestore.rules пускает
   к этому документу только isMaster() (мастер или админ), так что игрок
   не получит тайны ни через интерфейс, ни через исходный код страницы,
   ни через прямой запрос к базе. Для мастера слой накладывается поверх
   публичных данных (applyGmLayer) и помечается gm:true — дальше работает
   прежний переключатель «Вид» из p3a_core.js. В предпросмотре для
   телефона build_preview.py подставляет слой прямо в GM_LAYER_EMBED. */
var GM_LAYER_EMBED=null;
var GM_STATE={source:null,updatedAt:null,by:null,count:0,miss:[],error:null};
var gmUnsub=null;

function gmTarget(cat,id){
  if(cat==='pcs') return findIn(PCS,id);
  var c=catById(cat);return c?findIn(c.arr,id):null;
}
function gmHosts(){
  var out=PCS.slice();
  CATS.forEach(function(c){(c.arr||[]).forEach(function(x){out.push(x);});});
  return out;
}
function dropGml(arr){if(!arr)return;for(var i=arr.length-1;i>=0;i--)if(arr[i]&&arr[i]._gml)arr.splice(i,1);}
function removeGmLayer(){
  gmHosts().forEach(function(x){dropGml(x.blocks);dropGml(x.ties);});
  dropGml(RELATIONS);dropGml(BONDS);dropGml(BOONS);
  GM_STATE.count=0;GM_STATE.miss=[];
}
function applyGmLayer(L){
  removeGmLayer();
  if(!L) return;
  var n=0,miss=[];
  (L.notes||[]).forEach(function(note){
    var x=gmTarget(note.cat,note.id);
    if(!x){miss.push((note.cat||'?')+' / '+(note.id||'?'));return;}
    (note.blocks||[]).forEach(function(b){
      var nb={};for(var k in b)if(k!=='after')nb[k]=b[k];nb.gm=true;nb._gml=true;
      x.blocks=x.blocks||[];
      var i=-1;if(b.after)for(var q=0;q<x.blocks.length;q++)if(x.blocks[q].t===b.after&&!x.blocks[q]._gml){i=q;break;}
      if(i<0)x.blocks.push(nb);
      else{var j=i+1;while(j<x.blocks.length&&x.blocks[j]._gml)j++;x.blocks.splice(j,0,nb);}
      n++;
    });
    (note.ties||[]).forEach(function(t){
      x.ties=x.ties||[];x.ties.push({text:typeof t==='string'?t:(t.text||''),gm:true,_gml:true});n++;
    });
  });
  [['relations',RELATIONS],['bonds',BONDS],['boons',BOONS]].forEach(function(p){
    (L[p[0]]||[]).forEach(function(r){var o={};for(var k in r)o[k]=r[k];o.gm=true;o._gml=true;p[1].push(o);n++;});
  });
  GM_STATE.count=n;GM_STATE.miss=miss;
}
function gmRerender(){
  IDX=null;
  if(!SESSION||!document.getElementById('app')) return;
  var y=window.scrollY;dispatch();window.scrollTo(0,y);activateRolls(app);
}
function startGmLayer(){
  if(gmUnsub){gmUnsub();gmUnsub=null;}
  if(GM_LAYER_EMBED){applyGmLayer(GM_LAYER_EMBED);GM_STATE.source='embed';return;}
  if(!fbDb||!canGm()) return;
  gmUnsub=fbDb.collection('gmlayer').doc('main').onSnapshot(function(d){
    if(!d.exists){removeGmLayer();GM_STATE.source='none';GM_STATE.error=null;}
    else{
      var v=d.data();
      try{applyGmLayer(JSON.parse(v.json||'{}'));GM_STATE.source='firestore';GM_STATE.error=null;
        GM_STATE.updatedAt=v.updatedAt&&v.updatedAt.toDate?v.updatedAt.toDate():null;GM_STATE.by=v.by||null;}
      catch(e){removeGmLayer();GM_STATE.error='Сохранённый слой не читается: '+(e.message||e);}
    }
    gmRerender();
  },function(e){GM_STATE.error=(e&&e.code==='permission-denied')
      ?'Firestore не пустил к мастерскому слою. Проверьте, что в консоли Firebase опубликованы правила с блоком gmlayer (файл firestore.rules целиком).'
      :'Не удалось загрузить мастерский слой: '+(e.message||e);
    gmRerender();});
}

/* ---------- страница «Мастерский слой» (#/master/gm) ---------- */
function gmValidate(L){
  if(!L||typeof L!=='object') return 'Это не файл мастерского слоя.';
  if(!Array.isArray(L.notes)||!Array.isArray(L.relations)) return 'В файле нет разделов notes и relations — это не gm-layer.json.';
  return '';
}
function viewGmLayer(){
  setTheme('court');crumb([['Мастерский слой']]);
  var st;
  if(GM_STATE.source==='embed') st='Предпросмотр: слой встроен прямо в этот файл.';
  else if(GM_STATE.error) st='<span style="color:var(--bad)">'+esc(GM_STATE.error)+'</span>';
  else if(GM_STATE.source==='firestore') st='Слой загружен: <b>'+GM_STATE.count+'</b> '+plural(GM_STATE.count,'тайна','тайны','тайн')+
    (GM_STATE.updatedAt?' · обновлён '+esc(GM_STATE.updatedAt.toLocaleString('ru-RU')):'')+(GM_STATE.by?' · загрузил '+esc(GM_STATE.by):'');
  else if(GM_STATE.source==='none') st='Слой ещё ни разу не загружали.';
  else st='Слой загружается…';
  var miss=GM_STATE.miss.length?'<div class="note"><b>Не нашлись заметки</b>Тайны для этих записей есть в слое, но самих записей на сайте нет — возможно, сайт старее слоя: '+esc(GM_STATE.miss.join(', '))+'</div>':'';
  var up=fbDb?'<div class="panel"><h4>Обновить слой</h4><p>Выберите файл <b>gm-layer.json</b> из папки Kodeks_Nochi_master на компьютере рассказчика. Он заменит весь слой целиком.</p>'+
      '<input type="file" id="gmFile" accept=".json,application/json"> <button class="mini pri" type="button" id="gmUp">Загрузить</button>'+
      '<div class="err" id="gmErr" style="margin-top:10px;color:var(--bad)"></div></div>':'';
  app.innerHTML='<section class="sec"><div class="wrap rise"><a class="back" href="#/">← к титулу</a>'+
    '<div class="sec-head" style="margin-top:22px"><h2>Мастерский слой</h2><span class="eyebrow">только для мастера</span></div>'+
    '<p class="lede" style="margin:0 0 20px">Тайны хроники, которые видит только мастер: скрытые блоки заметок, тайные связи и рёбра графа. Игрокам сервер их не отдаёт вовсе.</p>'+
    '<div class="panel"><p>'+st+'</p></div>'+miss+up+'</div></section>';
  var b=document.getElementById('gmUp');if(!b)return;
  b.addEventListener('click',function(){
    var f=document.getElementById('gmFile').files[0],err=document.getElementById('gmErr');err.textContent='';
    if(!f){err.textContent='Сначала выберите файл.';return;}
    if(f.size>900000){err.textContent='Файл слишком большой для одного документа Firestore.';return;}
    b.disabled=true;b.textContent='Загрузка…';
    f.text().then(function(txt){
      var L;try{L=JSON.parse(txt);}catch(e){throw new Error('Файл не читается как JSON.');}
      var v=gmValidate(L);if(v)throw new Error(v);
      return fbDb.collection('gmlayer').doc('main').set({json:txt,by:SESSION.username,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
    }).then(function(){b.disabled=false;b.textContent='Загрузить';})
    .catch(function(e){b.disabled=false;b.textContent='Загрузить';
      err.textContent=(e&&e.code==='permission-denied')?'Firestore отказал: проверьте, что правила с блоком gmlayer опубликованы в консоли Firebase.':(e.message||String(e));});
  });
}
