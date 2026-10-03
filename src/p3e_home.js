
/* ================= ЖУРНАЛ ПОСЛЕДСТВИЙ ================= */
function fxChips(it){
  var s='';
  if(it.status){var dl=+it.status.delta||0;s+='<span class="fxchip '+(dl>=0?'up':'down')+'">'+(dl>0?'+':'')+dl+' Статус · '+esc(it.status.who)+(it.status.sect?' ('+esc(it.status.sect)+')':'')+'</span>';}
  if(it.masq){var m=+it.masq;s+='<a class="fxchip '+(m>0?'down':'up')+'" href="#/tool/masq">Маскарад '+(m>0?'+':'')+m+'</a>';}
  if(it.boon){var b=findIn(BOONS,it.boon);s+='<a class="fxchip neu" href="#/tool/boons">Долг'+(b?': '+esc(b.debtor)+' → '+esc(b.creditor):'')+'</a>';}
  if(it.bond) s+='<a class="fxchip neu" href="#/tool/web">Узы: '+esc(it.bond)+'</a>';
  return s;
}
function journalHtml(){
  if(!SESSIONS.length) return emptyBox('Журнал пуст','Итоги сессий появятся здесь.');
  return '<div class="ses-grid">'+SESSIONS.map(function(s){
    return '<article class="ses"><span class="n">Сессия '+s.n+(s.date?' · '+esc(s.date):'')+(s.note?' · '+esc(s.note):'')+'</span><ul>'+
      s.items.map(function(x){return typeof x==='string'?'<li>'+md(x)+'</li>':'<li>'+md(x.t)+fxChips(x)+'</li>';}).join('')+'</ul></article>';}).join('')+'</div>';
}

/* ================= ТИТУЛ ================= */
function viewHome(anchor){
  setTheme(null);crumbs.innerHTML='/ титул';
  var C=CHRONICLE,v=masqNow(),L=masqLevel(v);
  var cats=CATS.slice().sort(function(a,b){return b.arr.length-a.arr.length;}).map(function(c){var n=c.arr.length,g=ghostCount(c);
    return '<a class="cat" href="#/cat/'+c.id+'" style="--c:'+c.c+'">'+icon(c.ico)+'<span class="badge'+(n?'':' zero')+'">'+n+' зап.</span>'+
      (g?'<span class="badge gh">'+g+' '+plural(g,'призрак','призрака','призраков')+'</span>':'')+
      '<span class="k">РАЗДЕЛ</span><h3>'+esc(c.name)+'</h3><div class="d">'+esc(c.d)+'</div><div class="arrow">ОТКРЫТЬ →</div></a>';}).join('');
  var tools=TOOLS.map(function(t){
    return '<a class="cat" href="#/tool/'+t.id+'" style="--c:'+t.c+'">'+icon(t.ico)+'<span class="k">ИНСТРУМЕНТ</span><h3>'+esc(t.name)+'</h3><div class="d">'+esc(t.d)+'</div><div class="arrow">ОТКРЫТЬ →</div></a>';}).join('');
  function fact(num,title,val,txt){return '<div class="fact"><div class="num">'+num+'</div><h3>'+(val?esc(val):'<span class="blank">'+title+'</span>')+'</h3><p>'+txt+'</p></div>';}
  var world=(C.premise.length||C.history.length)?
      (C.premise.length?defsHtml(C.premise):'')+
      (C.history.length?'<div class="sec-head" style="margin:40px 0 20px"><h3>Исторический фундамент</h3></div><ul class="tl">'+C.history.map(function(h){return '<li><b>'+esc(h[0])+'</b>'+md(h[1])+'</li>';}).join('')+'</ul>':'')
    :emptyBox('Заглавная заметка пуста','Образ города, расклад сил и история ночей появятся здесь.');
  app.innerHTML=
  '<section class="hero"><div class="wrap rise">'+
    '<div class="eyebrow">Хроника · Vampire: The Masquerade · 5-я редакция</div>'+
    '<h1><span class="h-small">КОДЕКС НОЧИ</span><span class="h-big'+(C.title?'':' blank')+'">'+esc(C.title||'Без имени')+'</span></h1>'+
    '<div class="h-sub">'+esc(C.tagline||[C.city,C.era].filter(Boolean).join(' · ')||'хроника ещё не названа')+'</div>'+
    '<p class="lede">'+(C.lede?inl(C.lede):'Рабочая энциклопедия хроники: кланы и дисциплины, Двор и долги, домены и Маскарад. '+
      'Всё, что нужно рассказчику за столом, — в одном файле. Имена внутри заметок — рабочие ссылки, формулы вида «пул 6» — кнопки бросков.')+'</p>'+
  '</div></section>'+
  '<div class="facts">'+
    fact('01 / ГОРОД','город не указан',C.city,'Где разворачивается хроника.')+
    fact('02 / ЭПОХА','эпоха не указана',C.era,'Когда идут ночи хроники.')+
    fact('03 / ВЛАСТЬ','власть не указана',C.power,'Кто держит город по праву крови.')+
    '<a class="fact" href="#/tool/masq" style="text-decoration:none;--c:'+L[3]+'"><div class="num">04 / МАСКАРАД</div><h3 style="color:'+L[3]+'">'+esc(L[1])+' · '+v+'</h3>'+masqGauge(v,true)+'</a>'+
  '</div>'+
  '<section class="sec" id="world" style="padding-bottom:0"><div class="wrap">'+secHead(C.city||'Город','заглавная заметка')+world+'</div></section>'+
  '<section class="sec" id="cats"><div class="wrap">'+secHead('Разделы кодекса',CATS.length+' разделов · '+totalNotes()+' '+plural(totalNotes(),'запись','записи','записей'))+'<div class="cats">'+cats+'</div></div></section>'+
  '<section class="sec" id="tools" style="padding-top:0"><div class="wrap">'+secHead('Инструменты рассказчика',TOOLS.length+' инструментов')+'<div class="cats">'+tools+'</div></div></section>'+
  '<section class="sec cons" id="cons"><div class="wrap">'+secHead('Последствия',SESSIONS.length+' '+plural(SESSIONS.length,'сессия','сессии','сессий')+' в журнале')+
    '<p class="lede" style="margin:0 0 24px">Что котерия натворила и чем это обернулось. Эффекты событий сразу двигают Статус, Маскарад, долги и узы.</p>'+
    journalHtml()+
    (statusSeries().length&&SESSIONS.length?'<div class="sec-head" style="margin:34px 0 16px"><h3>Динамика Статуса</h3><span class="eyebrow">по сессиям</span></div>'+statusChart():'')+
  '</div></section>';
  document.getElementById('footL').textContent='Кодекс Ночи'+(C.title?' — '+C.title:'')+' · рабочая энциклопедия хроники';
  if(anchor){var el=document.getElementById(anchor);if(el)requestAnimationFrame(function(){el.scrollIntoView({block:'start',behavior:'smooth'});});}
}
function totalNotes(){var n=PCS.length;CATS.forEach(function(c){n+=c.arr.length;});return n;}

/* ================= ПАНЕЛЬ АКТИВНОЙ СЕССИИ ================= */
function tmin(s){var m=/^(\d{1,2}):(\d{2})$/.exec(s||'');return m?(+m[1])*60+(+m[2]):null;}
function fmtT(m){m=((m%1440)+1440)%1440;return pad(Math.floor(m/60))+':'+pad(m%60);}
function nightState(){var N=ACTIVE_SESSION.night||{};var s=STORE.get('night',null)||{};
  return {sunset:s.sunset||N.sunset||'19:30',sunrise:s.sunrise||N.sunrise||'06:40',now:s.now||N.start||N.sunset||'21:00'};}
function nightHtml(){
  var n=nightState(),ss=tmin(n.sunset),sr=tmin(n.sunrise),nw=tmin(n.now);
  if(ss==null||sr==null||nw==null) return '<div class="warn">Время в формате ЧЧ:ММ</div>';
  var total=(sr-ss+1440)%1440||1440,el=(nw-ss+1440)%1440;if(el>total)el=total;
  var left=total-el,h=Math.floor(left/60),m=left%60;
  return '<div class="dawn-big'+(left<=60?' urgent':'')+'">'+(left<=0?'Рассвет':h+' ч '+pad(m)+' мин')+'</div>'+
    '<div class="tsub">'+(left<=0?'солнце встаёт — в убежище!':'до рассвета · сейчас '+fmtT(nw))+'</div>'+
    '<div class="dawn-bar"><i style="width:'+(el/total*100).toFixed(1)+'%"></i></div>'+
    '<div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap"><button class="mini" data-nt="-15">−15 м</button><button class="mini" data-nt="15">+15 м</button>'+
    '<button class="mini" data-nt="30">+ сцена 30 м</button><button class="mini pri" data-nt="60">+1 ч</button></div>'+
    '<div class="times"><label>Закат<input type="time" data-nf="sunset" value="'+n.sunset+'"></label><label>Рассвет<input type="time" data-nf="sunrise" value="'+n.sunrise+'"></label>'+
    '<label>Сейчас<input type="time" data-nf="now" value="'+n.now+'"></label></div>';
}
function orderState(){return STORE.get('order',null)||{list:[],cur:0,round:1};}
function orderHtml(){
  var o=orderState();
  return '<div class="tsub">Раунд '+o.round+(o.list.length?' · ходит: <b style="color:var(--acc)">'+esc((o.list[o.cur]||{}).n||'')+'</b>':'')+'</div>'+
    '<ul class="order">'+o.list.map(function(x,i){return '<li class="'+(i===o.cur?'cur':'')+'"><span class="v">'+esc(x.v)+'</span><span class="nm">'+esc(x.n)+'</span><button data-od="'+i+'" title="Убрать">✕</button></li>';}).join('')+'</ul>'+
    '<div class="addrow"><input id="odN" placeholder="Имя"><input id="odV" class="sm" type="number" placeholder="№"><button class="mini" data-oa="add">+</button></div>'+
    '<div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="mini pri" data-oa="next">Следующий ход</button><button class="mini" data-oa="sort">Сортировать</button>'+
    (PCS.length?'<button class="mini" data-oa="coterie">+ котерия</button>':'')+'<button class="mini" data-oa="clear">Очистить</button></div>'+
    '<div class="tsub">В V5 нет броска инициативы: порядок задаёт рассказчик (обычно по пулу действия или Сообразительности + Бдительности).</div>';
}
function sessFlow(nodes){return '<ul class="sflow">'+nodes.map(function(n){return '<li><span class="nd'+(n.cls?' '+n.cls:'')+'">'+md(n.t)+'</span>'+(n.kids?sessFlow(n.kids):'')+'</li>';}).join('')+'</ul>';}
function renderSession(){
  var S=ACTIVE_SESSION||{},filled=!!(S.n||(S.flow&&S.flow.length));
  document.getElementById('sessTitle').innerHTML=filled?'Сессия '+(S.n||'')+(S.name?' — '+(S.place?'<a href="'+esc(S.place)+'" style="color:var(--acc);text-decoration:none">'+esc(S.name)+'</a>':esc(S.name)):'')
    :'План не задан';
  document.getElementById('sessSub').textContent=filled?(S.sub||''):'Инструменты ночи работают и без плана';
  var h='<details class="sess-sec" open><summary>Ночь · до рассвета</summary><div class="in" id="nightBox">'+nightHtml()+'</div></details>';
  if(PCS.length) h+='<details class="sess-sec" open><summary>Голод котерии</summary><div class="in">'+PCS.map(function(x){var k=trkKey(x);TRK_OBJ[k]=x;
    return '<div class="coterie-row"><a class="nm" href="#/pc/'+x.id+'">'+esc(x.name)+'</a><div data-mini="'+k+'">'+miniPips(k)+'</div></div>';}).join('')+'</div></details>';
  h+='<details class="sess-sec"><summary>Очерёдность</summary><div class="in" id="orderBox">'+orderHtml()+'</div></details>';
  var v=masqNow(),L=masqLevel(v);
  h+='<details class="sess-sec"><summary>Маскарад · '+esc(L[1])+' '+v+'</summary><div class="in">'+masqGauge(v,true)+
    '<div class="ctl" style="display:flex;gap:6px;margin-top:10px"><button class="mini" data-sq="-1">−1</button><button class="mini pri" data-sq="1">+1 нарушение</button><a class="mini" href="#/tool/masq" style="text-decoration:none">шкала →</a></div></div></details>';
  if(!filled) h+='<div class="in" style="padding:16px"><div class="sess-note"><b>План пуст</b>Сцены, развилки, таблицы и плейлисты следующей сессии появятся здесь.</div></div>';
  else{
    if(S.flow&&S.flow.length) h+='<details class="sess-sec" open><summary>Структура сессии</summary><div class="in">'+sessFlow(S.flow)+(S.priority?'<div class="sess-note"><b>При нехватке времени</b>'+md(S.priority)+'</div>':'')+'</div></details>';
    if(S.decisions&&S.decisions.length) h+='<details class="sess-sec"><summary>Ключевые решения</summary><div class="in"><ul class="sess-list">'+S.decisions.map(function(x){return '<li>'+md(x)+'</li>';}).join('')+'</ul></div></details>';
    if(S.tables&&S.tables.length) h+='<details class="sess-sec"><summary>Таблицы</summary><div class="in">'+S.tables.map(function(t){
      return '<h4 style="font-size:19px;margin-top:10px">'+esc(t.name)+'</h4>'+(t.note?'<div class="sess-note">'+md(t.note)+'</div>':'')+(t.groups||[]).map(function(g){return (g.sub?'<div class="eyebrow" style="margin-top:8px">'+esc(g.sub)+'</div>':'')+tableHtml(g.table);}).join('');}).join('')+'</div></details>';
    if(S.afterLog&&S.afterLog.length) h+='<details class="sess-sec"><summary>После сессии — в журнал</summary><div class="in"><ul class="sess-list">'+S.afterLog.map(function(x){return '<li>'+md(x)+'</li>';}).join('')+'</ul></div></details>';
  }
  if(S.playlists&&S.playlists.length) h+='<details class="sess-sec"><summary>Плейлисты</summary><div class="in">'+S.playlists.map(function(p){
    return '<div class="sess-note"><b>'+esc(p[0])+'</b>'+(/^https?:\/\//.test(p[1])?'<a href="'+esc(p[1])+'" target="_blank" rel="noopener" style="color:var(--acc)">открыть ↗</a>':md(p[1]))+'</div>';}).join('')+'</div></details>';
  var body=document.getElementById('sessBody');
  var open={};[].forEach.call(body.querySelectorAll('details'),function(d,i){open[i]=d.open;});
  body.innerHTML=h;
  if(Object.keys(open).length)[].forEach.call(body.querySelectorAll('details'),function(d,i){if(open[i]!=null)d.open=open[i];});
  activateRolls(body);
}
function initSession(){
  var tab=document.getElementById('sessTab'),back=document.getElementById('sessBackdrop'),body=document.getElementById('sessBody');
  function setOpen(on){document.body.classList.toggle('sess-open',on);STORE.set('sessOpen',on);}
  tab.addEventListener('click',function(){setOpen(true);});
  document.getElementById('sessClose').addEventListener('click',function(){setOpen(false);});
  back.addEventListener('click',function(){setOpen(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('sess-open'))setOpen(false);});
  body.addEventListener('click',function(e){
    var b=e.target.closest('[data-nt]');
    if(b){var n=nightState();n.now=fmtT(tmin(n.now)+(+b.getAttribute('data-nt')));STORE.set('night',n);document.getElementById('nightBox').innerHTML=nightHtml();return;}
    var q=e.target.closest('[data-sq]');
    if(q){STORE.set('masqLive',masqLive()+(+q.getAttribute('data-sq')));renderSession();if(/^#\/tool\/masq/.test(location.hash))route();return;}
    var od=e.target.closest('[data-od]'),oa=e.target.closest('[data-oa]'),o=orderState();
    if(od){o.list.splice(+od.getAttribute('data-od'),1);if(o.cur>=o.list.length)o.cur=0;}
    else if(oa){var a=oa.getAttribute('data-oa');
      if(a==='add'){var nm=document.getElementById('odN').value.trim();if(!nm)return;o.list.push({n:nm,v:document.getElementById('odV').value||'—'});}
      else if(a==='next'){if(!o.list.length)return;o.cur++;if(o.cur>=o.list.length){o.cur=0;o.round++;}}
      else if(a==='sort'){o.list.sort(function(x,y){return (+y.v||0)-(+x.v||0);});o.cur=0;}
      else if(a==='coterie'){PCS.forEach(function(x){if(!o.list.some(function(y){return y.n===x.name;}))o.list.push({n:x.name,v:'—'});});}
      else if(a==='clear'){o={list:[],cur:0,round:1};}}
    else return;
    STORE.set('order',o);document.getElementById('orderBox').innerHTML=orderHtml();
    var inp=document.getElementById('odN');if(oa&&oa.getAttribute('data-oa')==='add'&&inp)inp.focus();
  });
  body.addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.target.id==='odN'||e.target.id==='odV')){var b=body.querySelector('[data-oa="add"]');if(b)b.click();}});
  body.addEventListener('change',function(e){var f=e.target.getAttribute('data-nf');if(!f)return;var n=nightState();n[f]=e.target.value;STORE.set('night',n);document.getElementById('nightBox').innerHTML=nightHtml();});
  renderSession();
  var pref=STORE.get('sessOpen',null);
  if(pref===true||(pref==null&&ACTIVE_SESSION&&ACTIVE_SESSION.n&&window.matchMedia('(min-width:1180px)').matches)) setOpen(true);
}

/* ================= ПОИСК ================= */
/* v1.76 — поиск по весам (сказано рассказчиком: запись должна идти выше,
   чем случайное совпадение слова в тексте). Слои, от сильного к слабому:
     имя (начало 100 / начало слова 90 / внутри 80) → алиасы 75 →
     теги 70 (ручные tags:[…] записи + авто: клан, секта, роль, вид,
     держатель) → короткое описание и заголовки блоков 40 → текст 10
     (+ до 5 за частоту). Заготовки без своей записи идут ниже настоящих.
   Запрос из нескольких слов: каждое слово должно найтись, очки складываются.
   Окончания: «Гекаты» находит «Геката» (слово без 1–2 последних букв, ×0.8). */
var IDX=null;
function plainText(t){return String(t||'').replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'$2').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/\*\*/g,'');}
function buildIndex(){
  IDX=allEntries().map(function(e){var x=e.x||{},tags=(x.tags||[]).slice(),heads=[];
    [x.clan,x.sect,x.role,x.holder,x.sire,x.predator].forEach(function(v){if(v&&typeof v==='string')tags.push(v);});
    if(x.kind){tags.push(typeof DOMAIN_KINDS!=='undefined'&&DOMAIN_KINDS[x.kind]?DOMAIN_KINDS[x.kind][0]:x.kind);}
    if(x.year!=null)tags.push(String(x.year));
    if(x.dead)tags.push('торпор');
    if(x.short)heads.push(x.short);
    (x.blocks||[]).forEach(function(b){if(b&&b.t&&(!b.gm||gmOn()))heads.push(b.t);});
    return {name:e.name||'',cat:e.cat,href:e.href,real:1,aliases:(x.aliases||[]).concat(x.full?[x.full]:[]),tags:tags,heads:plainText(heads.join(' · ')),text:plainText(strings(x).filter(function(t){return !(x.tags&&x.tags.indexOf(t)>-1)&&!/^(images\/|data:)/.test(t);}).join(' · '))};});
  function add(o){o.aliases=o.aliases||[];o.tags=o.tags||[];o.heads=o.heads||'';IDX.push(o);}
  CATS.forEach(function(c){add({name:c.name,cat:'раздел',href:'#/cat/'+c.id,real:1,text:c.d+' '+c.lede});});
  TOOLS.forEach(function(t){add({name:t.name,cat:'инструмент',href:'#/tool/'+t.id,real:1,text:t.d});});
  CLAN_REF.forEach(function(r){if(!LINKS[r[0]])add({name:r[0],cat:'клан · заготовка',href:'#/cat/clans',tags:r[1],text:r[1].join(', ')});});
  Object.keys(GHOSTS).forEach(function(id){var c=catById(id);if(!c)return;
    GHOSTS[id].forEach(function(n){if(!LINKS[n])add({name:n,cat:c.one+' · заготовка',href:'#/cat/'+id,text:'упомянуто в заметках, своей записи ещё нет'});});});
  COMPULSIONS.clan.forEach(function(c){add({name:c[1],cat:'одержимость',href:'#/tool/compulsions',real:1,tags:[c[0]],text:c[0]+' · '+c[2]});});
  IDX.forEach(function(e){e._n=e.name.toLowerCase();e._a=e.aliases.map(function(a){return String(a).toLowerCase();});
    e._g=e.tags.map(function(a){return String(a).toLowerCase();});e._h=e.heads.toLowerCase();e._t=e.text.toLowerCase();});
}
function wordStart(hay,w){var i=hay.indexOf(w);while(i>-1){if(i===0||/[^a-zа-яё0-9]/i.test(hay.charAt(i-1)))return true;i=hay.indexOf(w,i+1);}return false;}
function scoreWord(e,w){
  var s=0,why='';
  if(e._n.indexOf(w)===0)s=100;else if(wordStart(e._n,w))s=90;else if(e._n.indexOf(w)>-1)s=80;
  if(!s)for(var i=0;i<e._a.length;i++)if(e._a[i].indexOf(w)>-1){s=75;break;}
  if(!s)for(var k=0;k<e._g.length;k++)if(e._g[k].indexOf(w)>-1){s=e._g[k]===w?72:70;why=e.tags[k];break;}
  if(!s&&e._h.indexOf(w)>-1)s=wordStart(e._h,w)?40:35;
  var ti=e._t.indexOf(w);
  if(ti>-1){var n=0,p=ti;while(p>-1&&n<5){n++;p=e._t.indexOf(w,p+w.length);}if(!s)s=10;s+=n;}
  return {s:s,why:why,ti:ti};
}
function scoreEntry(e,words){
  var total=0,why='',ti=-1,hitW='';
  for(var i=0;i<words.length;i++){var w=words[i],r=scoreWord(e,w),f=1;
    /* лучший из трёх вариантов: слово как есть и без 1–2 последних букв (×0.8) */
    [1,2].forEach(function(cut){if(words[i].length<4+cut)return;var w2=words[i].slice(0,-cut),r2=scoreWord(e,w2);
      if(r2.s*.8>r.s*f){r=r2;f=.8;w=w2;}});
    if(!r.s)return null;
    total+=r.s*f;if(r.why&&!why)why=r.why;if(r.ti>-1&&ti<0){ti=r.ti;hitW=w;}}
  if(!e.real)total*=.6;
  return {e:e,s:total,why:why,ti:ti,w:hitW};
}
function searchHits(v){
  if(!IDX)buildIndex();
  var words=v.toLowerCase().split(/\s+/).filter(Boolean);if(!words.length)return [];
  return IDX.map(function(e){return scoreEntry(e,words);}).filter(Boolean)
    .sort(function(a,b){return b.s-a.s||a.e.name.length-b.e.name.length;}).slice(0,12);
}
function hl(s,q){var i=s.toLowerCase().indexOf(q);if(!q||i<0)return esc(s);return esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length));}
function initSearch(){
  var q=document.getElementById('q'),res=document.getElementById('qres'),sel=0,hits=[];
  function run(){
    var v=q.value.trim().toLowerCase();
    if(!v){res.hidden=true;return;}
    hits=searchHits(v);var w0=v.split(/\s+/)[0];
    sel=0;
    res.innerHTML=hits.length?hits.map(function(h,i){var sn='';
      if(h.ti>-1){var a=Math.max(0,h.ti-40);sn=(a?'…':'')+h.e.text.slice(a,h.ti+70)+'…';}
      return '<a href="'+h.e.href+'" class="'+(i===0?'on':'')+'"><span class="t">'+hl(h.e.name,w0)+'</span><span class="c">'+esc(h.e.cat)+'</span>'+
        (h.why?'<span class="g">'+esc(h.why)+'</span>':'')+
        (sn?'<span class="s">'+hl(sn,h.w||w0)+'</span>':'')+'</a>';}).join(''):'<div class="none">Ничего не найдено. Кодекс пока почти пуст — поиск оживёт вместе с заметками.</div>';
    res.hidden=false;
  }
  q.addEventListener('input',run);q.addEventListener('focus',run);
  q.addEventListener('keydown',function(e){var as=res.querySelectorAll('a');
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!as.length)return;as[sel].classList.remove('on');
      sel=(sel+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as[sel].classList.add('on');as[sel].scrollIntoView({block:'nearest'});}
    else if(e.key==='Enter'){if(as[sel]){location.hash=as[sel].getAttribute('href');res.hidden=true;q.blur();}}
    else if(e.key==='Escape'){res.hidden=true;q.blur();}});
  res.addEventListener('click',function(){res.hidden=true;q.value='';});
  document.addEventListener('click',function(e){if(!e.target.closest('.srch'))res.hidden=true;});
  document.addEventListener('keydown',function(e){if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();q.focus();}});
}

/* ================= РОУТЕР ================= */
function dispatch(){
  /* уходим со страницы — снимаем подписку на живой лист персонажа, если она
     была; если новый маршрут снова #/pc/<живой>, viewPC() откроет её заново
     (см. startPcSyncIfLive() в p3g_pcsync.js) */
  stopPcSync();
  var h=location.hash.replace(/^#\/?/,''),m;
  if(!h){viewHome();return 'top';}
  if(h==='world'||h==='cons'||h==='tools'||h==='cats'){viewHome(h);return 'anchor';}
  if((m=/^cat\/([\w-]+)$/.exec(h))){var c=catById(m[1]);if(c){viewList(c);return 'top';}}
  if((m=/^tool\/([\w-]+)$/.exec(h))){var t=toolById(m[1]);if(t){TOOL_VIEWS[t.id](t);return 'top';}}
  if((m=/^pc\/([\w-]+)$/.exec(h))){viewPC(m[1]);return 'top';}
  if((m=/^coterie\/([\w-]+)$/.exec(h))){viewLivePC(m[1]);return 'top';}
  if((m=/^player\/([\w-]+)$/.exec(h))){viewPlayer(m[1]);return 'top';}
  if(h==='master/gm'){if(canGm()){viewGmLayer();return 'top';}viewHome();return 'top';}
  if(h==='admin/users'){if(SESSION&&SESSION.role==='admin'){viewAdminUsers();return 'top';}viewHome();return 'top';}
  if((m=/^([\w-]+)\/([\w-]+)$/.exec(h))){var cc=catByRoute(m[1]);if(cc){viewEntry(cc,m[2]);return cc.kind==='cards'&&!cc.full?'keep':'top';}}
  viewHome();return 'top';
}
function route(){var r=dispatch();if(r==='top')window.scrollTo(0,0);activateRolls(app);}
window.addEventListener('hashchange',route);
/* Раньше здесь сразу вызывался route() — теперь всё приложение стартует только
   после успешного входа, см. bootAuth() в p3f_auth.js (§1.3 в комментарии). */
bootAuth(function(){
  initDock();
  initSearch();
  initSession();
  startCoterieSync(); /* см. p3h_coterie.js — самостоятельные чарники игроков, живая подписка на всю сессию, не только на страницу */
  startGmLayer(); /* p3i_gm.js — мастерский слой (туман войны): игроку ничего, мастеру тайны из Firestore */
  route();
});
</script>
</body>
</html>

