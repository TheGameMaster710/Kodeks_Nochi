
/* ================= СПИСОК РАЗДЕЛОВ ================= */
var CATS=[
 {id:'clans',arr:CLANS,route:'clan',name:'Кланы',one:'клан',theme:'clan',c:'#C8102E',ico:'fang',
  d:'Кровные линии: дисциплины, проклятия, одержимости и кто из них в городе.',
  lede:'Кланы, чья кровь течёт в этом городе. Пунктиром отмечены кланы без заметки — у них уже указаны клановые дисциплины из книги, остальное впишется по ходу хроники.'},
 {id:'disciplines',arr:DISCIPLINES,route:'disc',name:'Дисциплины',one:'дисциплина',theme:'disc',c:'#A45BD6',ico:'eye',
  d:'Силы крови по уровням, стоимость, пулы и амальгамы.',
  lede:'Сверхъестественные силы Сородичей. На странице дисциплины силы разложены по уровням с ценой, пулом и длительностью. Пунктиром — дисциплины без заметки, с резонансом, который их усиливает.'},
 {id:'rituals',arr:RITUALS,route:'ritual',name:'Ритуалы и формулы',one:'ритуал',theme:'ritual',c:'#D4AF37',ico:'star',kind:'cards',group:'kind',
  d:'Ритуалы Магии крови, церемонии Забвения и алхимия тонкокровных.',
  lede:'Всё, что требует времени, ингредиентов и крови. Записи сгруппированы по типу и уровню.'},
 {id:'predators',arr:PREDATORS,route:'predator',name:'Типы хищника',one:'тип хищника',theme:'predator',c:'#E0592A',ico:'claw',kind:'cards',
  d:'Как персонажи добывают кровь и что это им даёт.',
  lede:'Способы охоты, доступные в хронике: пул кормления, что получает хищник и чем платит.'},
 {id:'merits',arr:MERITS,route:'merit',name:'Преимущества и Недостатки',one:'запись',theme:'merit',c:'#7FB5A8',ico:'scale',kind:'cards',group:'kind',
  d:'Достоинства, недостатки и предыстории.',
  lede:'Механические преимущества и недостатки, которые реально встречаются у персонажей хроники.'},
 {id:'loresheets',arr:LORESHEETS,route:'lore',name:'Лоршиты',one:'лоршит',theme:'lore',c:'#D8B97A',ico:'book',
  d:'Связи с легендами мира: уровни от одного до пяти точек.',
  lede:'Лоршиты хроники. Каждый — лестница из пяти ступеней, от слуха до права голоса в легенде.'},
 {id:'sects',arr:SECTS,route:'sect',name:'Секты и фракции',one:'секта',theme:'sect',c:'#B22234',ico:'crown',
  d:'Камарилья, Анархи, независимые и те, кто на них охотится.',
  lede:'Политические силы Сородичей в городе: их доктрины, лица и позиции при Дворе.'},
 {id:'players',arr:PLAYERS,route:'player',name:'Котерия',one:'игрок',theme:'player',c:'#E8B04B',ico:'mask2',
  d:'Игроки за столом и их персонажи с трекерами.',
  lede:'Кто сидит за столом и кем играет. На странице персонажа — живые трекеры Голода, Здоровья, Силы воли и Человечности.'},
 {id:'people',arr:PEOPLE,route:'person',name:'Личности',one:'личность',theme:'person',c:'#D0243F',ico:'crown2',
  d:'Сородичи, гули и смертные, у которых есть имя.',
  lede:'Персонажи рассказчика: старейшины, соперники, гули, Якоря и все, с кем котерия имеет дело лично.'},
 {id:'places',arr:PLACES,route:'place',name:'Локации',one:'локация',theme:'place',c:'#E0812E',ico:'tower',kind:'tree',
  d:'Убежища, Элизиумы, клубы и их вложенные зоны.',
  lede:'Места хроники, вложенные друг в друга: от района до отдельной комнаты. На каждой странице — цепочка родителей и список подзон.'},
 {id:'domains',arr:DOMAINS,route:'domain',name:'Домены',one:'домен',theme:'map',c:'#E08A3C',ico:'map',kind:'map',
  d:'Карта города: чьи районы, где охотятся, где опасно.',
  lede:'Территории Сородичей на карте города. Цвет — тип территории, пульсирующий контур — высокая угроза Маскараду.'},
 {id:'threats',arr:THREATS,route:'threat',name:'Угрозы',one:'угроза',theme:'threat',c:'#9FB9D1',ico:'cross',
  d:'Охотники, гули, чужаки и всё, что охотится на охотников.',
  lede:'Вторая Инквизиция, охотники-одиночки, чужие Сородичи и прочие опасности ночи. У каждой записи — пулы и особенности.'},
 {id:'items',arr:ITEMS,route:'item',name:'Предметы',one:'предмет',theme:'item',c:'#C07A3E',ico:'key',
  d:'Реликвии, улики, оружие и то, что стоит украсть.',
  lede:'Всё, что можно унести, спрятать или потерять: реликвии, артефакты, улики и ценное снаряжение.'}
];
var TOOLS=[
 {id:'bp',name:'Мощь крови',theme:'blood',c:'#E0142F',ico:'drop',d:'Таблица уровней 0–10: всплеск, восстановление, перебросы, проклятие, кормление.'},
 {id:'resonance',name:'Резонанс',theme:'blood',c:'#F2C14E',ico:'wave',d:'Бросок резонанса и темперамента жертвы, дискразии и усиливаемые дисциплины.'},
 {id:'compulsions',name:'Одержимости',theme:'blood',c:'#FF5A36',ico:'claw',d:'Общая таблица на к10 и клановые одержимости с условиями окончания.'},
 {id:'court',name:'Двор и Статус',theme:'court',c:'#D4AF37',ico:'crown',d:'Иерархия города, вакансии и точки Статуса с графиком по сессиям.'},
 {id:'boons',name:'Долги',theme:'boon',c:'#C9A45C',ico:'scale',d:'Реестр одолжений: кто кому должен, какого веса, погашено ли.'},
 {id:'web',name:'Связи и узы',theme:'ties',c:'#D1436A',ico:'web',d:'Граф отношений и реестр кровных уз по ступеням.'},
 {id:'lineage',name:'Родословная',theme:'lineage',c:'#A8243F',ico:'tree',d:'Древо сир → потомок с поколениями и кланами.'},
 {id:'masq',name:'Маскарад',theme:'masq',c:'#8FB8DE',ico:'mask',d:'Шкала угрозы: нарушения, слухи и внимание Второй Инквизиции.'},
 {id:'chron',name:'Хроника ночей',theme:'chron',c:'#B9A7E0',ico:'moon',d:'Таймлайн хроники и отдельная ветка мемориамов.'}
];
var ICONS={
 fang:'<path d="M20 20h60l-8 22c-4 10-8 30-12 50-4-20-8-40-12-50l-4-10-4 10c-4 10-8 30-12 50-4-20-8-40-12-50z"/>',
 eye:'<path d="M6 50c14-22 30-32 44-32s30 10 44 32c-14 22-30 32-44 32S20 72 6 50z"/><circle cx="50" cy="50" r="14"/><circle cx="50" cy="50" r="5" fill="currentColor"/>',
 star:'<circle cx="50" cy="50" r="42"/><path d="M50 10l23 70-60-43h74l-60 43z"/>',
 claw:'<path d="M20 90C30 60 32 34 26 8M44 92c6-30 8-56 2-84M68 90c8-28 10-54 6-80"/>',
 scale:'<path d="M50 10v80M26 90h48M14 30h72M14 30l-10 28h20zM86 30l-10 28h20z"/>',
 book:'<path d="M10 18c16-6 30-4 40 6 10-10 24-12 40-6v66c-16-6-30-4-40 6-10-10-24-12-40-6z"/><path d="M50 24v66"/>',
 crown:'<path d="M12 78h76l6-50-22 18-22-30-22 30-22-18z"/><path d="M12 90h76"/>',
 crown2:'<circle cx="50" cy="38" r="20"/><path d="M14 94c4-24 18-34 36-34s32 10 36 34"/>',
 mask2:'<path d="M10 30c24-12 56-12 80 0-2 30-18 50-40 50S12 60 10 30z"/><path d="M28 42c6-4 12-4 16 0M56 42c4-4 10-4 16 0"/>',
 tower:'<path d="M30 94V30l20-20 20 20v64M30 50h40M42 94V70h16v24"/>',
 map:'<path d="M8 20l28-10 28 10 28-10v70l-28 10-28-10-28 10z"/><path d="M36 10v70M64 20v70"/>',
 cross:'<path d="M42 8h16v28h26v16H58v42H42V52H16V36h26z"/>',
 key:'<circle cx="30" cy="50" r="16"/><path d="M46 50h46M78 50v14M66 50v10"/>',
 drop:'<path d="M50 8C38 32 22 48 22 64a28 28 0 0 0 56 0c0-16-16-32-28-56z"/>',
 wave:'<path d="M4 50c12-20 22-20 32 0s20 20 32 0 20-20 28 0"/><path d="M4 70c12-20 22-20 32 0s20 20 32 0 20-20 28 0" opacity=".5"/>',
 web:'<circle cx="50" cy="20" r="8"/><circle cx="18" cy="72" r="8"/><circle cx="82" cy="72" r="8"/><circle cx="50" cy="54" r="6"/><path d="M50 28v20M24 67l20-9M76 67l-20-9M26 72h48M44 26L22 64M56 26l22 38"/>',
 tree:'<path d="M50 10v30M50 40L22 64M50 40l28 24M22 64v22M78 64v22M22 64L8 86M78 64l14 22"/><circle cx="50" cy="10" r="6"/>',
 mask:'<path d="M8 36c14-10 28-10 42 0 14-10 28-10 42 0-2 24-14 38-28 38-8 0-12-6-14-12-2 6-6 12-14 12C22 74 10 60 8 36z"/><path d="M22 46c6-4 12-4 16 0M62 46c4-4 10-4 16 0"/>',
 moon:'<path d="M66 12A40 40 0 1 0 88 70 32 32 0 1 1 66 12z"/>'
};
function icon(k,cls){return '<svg class="'+(cls||'ico')+'" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'+(ICONS[k]||'')+'</svg>';}

/* ================= УТИЛИТЫ ================= */
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function pad(n){return (n<10?'0':'')+n;}
function catById(id){for(var i=0;i<CATS.length;i++)if(CATS[i].id===id)return CATS[i];return null;}
function catByRoute(r){for(var i=0;i<CATS.length;i++)if(CATS[i].route===r)return CATS[i];return null;}
function toolById(id){for(var i=0;i<TOOLS.length;i++)if(TOOLS[i].id===id)return TOOLS[i];return null;}
function findIn(arr,id){for(var i=0;i<arr.length;i++)if(arr[i].id===id)return arr[i];return null;}
function numOf(arr,x){return pad(arr.indexOf(x)+1);}
function rgba(hex,a){var h=hex.replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');
  var n=parseInt(h,16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';}
function R(a,b){return a+Math.random()*(b-a);}
function plural(n,a,b,c){var m=n%10,h=n%100;if(m===1&&h!==11)return a;if(m>=2&&m<=4&&(h<12||h>14))return b;return c;}
function allPeople(){return PCS.concat(PEOPLE);}

/* ================= ВИКИ-ССЫЛКИ ================= */
var LINKS={};
function regLink(name,href){if(name&&!LINKS[name])LINKS[name]=href;}
CATS.forEach(function(c){c.arr.forEach(function(x){
  regLink(x.name,'#/'+c.route+'/'+x.id);(x.aliases||[]).forEach(function(a){regLink(a,'#/'+c.route+'/'+x.id);});});});
PCS.forEach(function(x){regLink(x.name,'#/pc/'+x.id);if(x.full)regLink(x.full,'#/pc/'+x.id);
  (x.aliases||[]).forEach(function(a){regLink(a,'#/pc/'+x.id);});});
if(CHRONICLE.city) regLink(CHRONICLE.city,'#/world');
TOOLS.forEach(function(t){regLink(t.name,'#/tool/'+t.id);});
regLink('Маскарад','#/tool/masq');

function wikiTag(target,label){
  var t=String(target).trim(),href=LINKS[t];
  return href?'<a class="wiki" href="'+href+'" title="Открыть заметку «'+esc(t)+'»">'+label+'</a>'
             :'<span class="wiki" title="Заметки пока нет">'+label+'</span>';
}
function inl(s){return esc(s)
  .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,function(_,t,l){return wikiTag(t,l);})
  .replace(/\[\[([^\]]+)\]\]/g,function(_,t){return wikiTag(t,t);})
  .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');}
function md(s){ if(s==null) return ''; var p=String(s).split(/\n{2,}/);
  return p.length>1?p.map(function(x){return '<p>'+inl(x).replace(/\n/g,'<br>')+'</p>';}).join(''):inl(s).replace(/\n/g,'<br>');}
function nameLink(n){return n?wikiTag(n,esc(n)):'<span class="blank">—</span>';}
function hrefOf(n){return n?LINKS[String(n).trim()]||null:null;}
function same(a,b){if(!a||!b)return false;if(a===b)return true;var ha=hrefOf(a);return !!ha&&ha===hrefOf(b);}
function dots(n,max){n=+n||0;max=max||5;var s='';for(var i=0;i<max;i++)s+=i<n?'●':'<i>●</i>';return '<span class="dots">'+s+'</span>';}

/* ================= ХРАНИЛИЩЕ (браузер) ================= */
var STORE={
  key:function(k){return 'v5codex:'+(CHRONICLE.id||'chronicle')+':'+k;},
  get:function(k,def){try{var v=localStorage.getItem(this.key(k));return v==null?def:JSON.parse(v);}catch(e){return def;}},
  set:function(k,v){try{localStorage.setItem(this.key(k),JSON.stringify(v));}catch(e){}},
  del:function(k){try{localStorage.removeItem(this.key(k));}catch(e){}}
};

/* ================= ФОНЫ ================= */
var bgfx=document.getElementById('bgfx');
function ash(n,color){var s='<div class="ash" style="position:absolute;inset:0;color:'+color+'">';
  for(var i=0;i<n;i++){var z=R(1,2.6);s+='<i style="left:'+R(0,100).toFixed(1)+'%;top:0;width:'+z.toFixed(1)+'px;height:'+z.toFixed(1)+
    'px;opacity:'+R(.2,.7).toFixed(2)+';animation-duration:'+R(14,30).toFixed(1)+'s;animation-delay:-'+R(0,30).toFixed(1)+'s"></i>';}
  return s+'</div>';}
function drips(color){var s='<svg class="drips" viewBox="0 0 1000 220" preserveAspectRatio="none" fill="'+color+'">';
  s+='<rect x="0" y="0" width="1000" height="8"/>';
  for(var i=0;i<22;i++){var x=R(0,1000),w=R(5,14),h=R(30,200);
    s+='<path class="drip" style="animation-delay:-'+R(0,9).toFixed(1)+'s" d="M'+(x-w).toFixed(0)+' 0 C'+(x-w).toFixed(0)+' '+(h*.5).toFixed(0)+' '+(x-w*.5).toFixed(0)+' '+(h-w).toFixed(0)+' '+x.toFixed(0)+' '+(h-w).toFixed(0)+' A'+w.toFixed(0)+' '+w.toFixed(0)+' 0 1 0 '+x.toFixed(0)+' '+(h+w*.6).toFixed(0)+' C'+(x+w*.6).toFixed(0)+' '+(h-w).toFixed(0)+' '+(x+w).toFixed(0)+' '+(h*.5).toFixed(0)+' '+(x+w).toFixed(0)+' 0Z"/>';}
  return s+'</svg>';}
var ROSETTE=(function(){var s='<svg class="rosette" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.2">'+
  '<circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="12"/>';
  for(var i=0;i<12;i++){var a=i*Math.PI/6,x=100+55*Math.cos(a),y=100+55*Math.sin(a);
    s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="25"/><path d="M100 100L'+(100+96*Math.cos(a)).toFixed(1)+' '+(100+96*Math.sin(a)).toFixed(1)+'"/>';}
  return s+'</svg>';})();
function skyline(color){var s='<svg class="skyline" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" fill="'+color+'">',x=0;
  var p='M0 300';while(x<1200){var w=R(30,90),h=R(60,240);p+=' L'+x.toFixed(0)+' '+(300-h).toFixed(0)+' L'+(x+w).toFixed(0)+' '+(300-h).toFixed(0);
    if(Math.random()<.18){p+=' L'+(x+w/2).toFixed(0)+' '+(300-h-R(30,70)).toFixed(0);} x+=w;}
  p+=' L1200 300Z';s+='<path d="'+p+'"/>';
  for(var i=0;i<70;i++) s+='<rect x="'+R(0,1200).toFixed(0)+'" y="'+R(120,290).toFixed(0)+'" width="3" height="4" fill="#E0A04E" opacity="'+R(.2,.8).toFixed(2)+'"/>';
  return s+'</svg>';}
var MASKSVG='<svg class="maskbg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4">'+ICONS.mask+
  '<path d="M50 36c0-10 6-20 18-26M50 36c0-10-6-20-18-26" opacity=".6"/></svg>';
function rootsSvg(){var s='<svg class="roots" viewBox="0 0 1000 500" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1.5">';
  function br(x,y,a,len,d){if(d>6)return;var x2=x+len*Math.cos(a),y2=y-len*Math.sin(a);
    s+='<path d="M'+x.toFixed(0)+' '+y.toFixed(0)+'Q'+((x+x2)/2+R(-20,20)).toFixed(0)+' '+((y+y2)/2).toFixed(0)+' '+x2.toFixed(0)+' '+y2.toFixed(0)+'" stroke-width="'+(4-d*.5).toFixed(1)+'"/>';
    br(x2,y2,a+R(.2,.6),len*.72,d+1);br(x2,y2,a-R(.2,.6),len*.72,d+1);}
  br(500,500,Math.PI/2,140,0);return s+'</svg>';}
function mist(){return '<div class="mist"></div>';}
function candles(){var s='<div class="candles">';for(var i=0;i<5;i++)s+='<div class="flame" style="left:'+(i*22-5)+'%;animation-delay:-'+R(0,3).toFixed(1)+'s"></div>';return s+'</div>';}
var BG={
 home:function(){return mist()+drips('rgba(120,8,24,.55)')+ash(40,'#C9A45C')+'<div style="position:absolute;inset:0;opacity:.35">'+skyline('#050306')+'</div>';},
 blood:function(){return mist()+drips('rgba(140,10,30,.6)')+ash(30,'#E0142F');},
 rosette:function(){return mist()+ROSETTE+candles()+ash(26,'#D4AF37');},
 city:function(){return mist()+'<div class="sodium"></div><div class="rain"></div>'+skyline('#030305');},
 mask:function(){return mist()+'<div class="search-beam"></div>'+MASKSVG+ash(20,'#8FB8DE');},
 roots:function(){return mist()+rootsSvg()+ash(22,'#D8B97A');},
 plain:function(){return mist()+ash(30,'#C9A45C');}
};
var THEME_BG={clan:'blood',person:'blood',sect:'blood',blood:'blood',boon:'blood',ties:'blood',
  disc:'rosette',ritual:'rosette',lore:'rosette',chron:'rosette',court:'rosette',
  place:'city',map:'city',threat:'mask',masq:'mask',lineage:'roots',player:'plain',item:'plain',merit:'plain',predator:'plain'};
function setTheme(theme,acc){
  if(theme) document.body.setAttribute('data-god',theme); else document.body.removeAttribute('data-god');
  document.body.removeAttribute('style');
  if(acc) document.body.style.setProperty('--acc',acc), document.body.style.setProperty('--glow',rgba(acc,1).replace(/rgba\(|,1\)/g,''));
  var k=theme?(THEME_BG[theme]||'plain'):'home';
  bgfx.innerHTML=BG[k]();
}
var crumbs=document.getElementById('crumbs'),app=document.getElementById('app');
function crumb(parts){crumbs.innerHTML='<a href="#/">титул</a>'+parts.map(function(p){
  return ' / '+(p[1]?'<a href="'+p[1]+'">'+esc(String(p[0]).toLowerCase())+'</a>':esc(String(p[0]).toLowerCase()));}).join('');}

/* ================= ОБЩИЕ БЛОКИ СТРАНИЦ ================= */
function emptyBox(title,text){return '<div class="empty"><b>'+esc(title)+'</b><span>'+text+'</span></div>';}
function secHead(t,eb,lvl){return '<div class="sec-head"><'+(lvl||'h2')+'>'+esc(t)+'</'+(lvl||'h2')+'>'+(eb!=null&&eb!==''?'<span class="eyebrow">'+esc(eb)+'</span>':'')+'</div>';}
function section(t,eb,inner){return '<section class="sec tight">'+secHead(t,eb)+inner+'</section>';}
function stripHtml(rows){rows=(rows||[]).filter(function(r){return r&&r[1]!=null&&r[1]!=='';});
  if(!rows.length) return '';
  return '<div class="strip">'+rows.map(function(x){return '<div><span class="l">'+esc(x[0])+'</span><span class="v">'+
    (x[2]?x[1]:inl(x[1]))+'</span></div>';}).join('')+'</div>';}
function defsHtml(list){return '<div class="defs">'+list.map(function(x){
  return '<div class="def"><span class="l">'+esc(x[0])+'</span><div class="v">'+md(x[1])+'</div></div>';}).join('')+'</div>';}
function tableHtml(t){
  return '<div class="tbl-wrap"><table class="tbl">'+(t.cap?'<caption>'+inl(t.cap)+'</caption>':'')+
    (t.head?'<thead><tr>'+t.head.map(function(h){return '<th>'+esc(h)+'</th>';}).join('')+'</tr></thead>':'')+
    '<tbody>'+t.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+md(c)+'</td>';}).join('')+'</tr>';}).join('')+
    '</tbody></table></div>';}
/* ================= СЛОЙ МАСТЕРА (с v1.42, §1.3.4 в комментарии) =================
   Любой блок (blocks[]), связь (ties[] — объект {text,gm:true} вместо строки),
   ребро RELATIONS/BONDS/BOONS с gm:true видны только мастеру/админу и только
   когда переключатель «Вид» стоит на «Мастер». Игрок не видит ни самого
   текста, ни следов: gm-части выпадают и из упоминаний, и из поиска
   (strings() ниже их пропускает). С v1.44 сами тайны в index.html не
   лежат: игроку сервер их не отдаёт, мастеру их накладывает p3i_gm.js из
   Firestore gmlayer/main (туман войны, §1.3.4). */
var GM_VIEW=true;
try{if(localStorage.getItem('kn_gmview')==='0')GM_VIEW=false;}catch(e){}
function canGm(){return !!(SESSION&&(SESSION.role==='master'||SESSION.role==='admin'));}
function gmOn(){return canGm()&&GM_VIEW;}
function gmOk(o){return !(o&&typeof o==='object'&&o.gm)||gmOn();}
function gmBadge(){return '<span class="gm-badge">для мастера</span>';}
function gmToggleHtml(){
  if(!canGm()) return '';
  return '<div class="gmtog" role="group" aria-label="Чья версия заметки"><span class="l">Вид</span>'+
    '<button type="button" data-gmv="0"'+(GM_VIEW?'':' class="on"')+'>Игрок</button>'+
    '<button type="button" data-gmv="1"'+(GM_VIEW?' class="on"':'')+'>Мастер</button></div>';
}
document.addEventListener('click',function(e){
  var b=e.target&&e.target.closest?e.target.closest('[data-gmv]'):null;if(!b)return;
  GM_VIEW=b.getAttribute('data-gmv')==='1';
  try{localStorage.setItem('kn_gmview',GM_VIEW?'1':'0');}catch(_){}
  gmRerender(); /* p3i_gm.js — сброс поиска и перерисовка без прыжка страницы */
});
function blockHtml(b){
  var inner='';
  if(b.text) inner+='<div class="panel">'+md(b.text)+'</div>';
  if(b.list) inner+='<div class="panel"><ul>'+b.list.map(function(x){return '<li>'+md(x)+'</li>';}).join('')+'</ul></div>';
  if(b.table) inner+=tableHtml(b.table);
  if(b.cards) inner+='<div class="grid">'+b.cards.map(function(c){
    return '<div class="card">'+(c.tag?'<span class="tag">'+esc(c.tag)+'</span>':'')+'<h4>'+wikiTag(c.name,esc(c.name))+'</h4><div class="eff">'+md(c.text)+'</div></div>';}).join('')+'</div>';
  if(b.gm) return '<div class="gm-block">'+section(b.t,'для мастера'+(b.note?' · '+b.note:''),inner)+'</div>';
  return section(b.t,b.note||'',inner);
}
function playlistHtml(p){
  if(!p||(!p.calm&&!p.fight)) return '';
  function one(v,cls,lab){if(!v)return '';
    return /^https?:\/\//.test(v)?'<a class="'+cls+'" href="'+esc(v)+'" target="_blank" rel="noopener"><i>'+lab+'</i>открыть ↗</a>'
      :'<span class="pl '+cls+'"><i>'+lab+'</i>'+inl(v)+'</span>';}
  return '<div class="plist"><span class="l">Плейлист</span>'+one(p.calm,'calm','мирный')+one(p.fight,'fight','боевой')+'</div>';
}
function jcard(x,eyebrow,strip,extraCls){
  return '<div class="jcard'+(x.dead?' dead':'')+(extraCls?' '+extraCls:'')+'"><div class="jcard-top">'+
    '<div class="eyebrow">'+eyebrow+'</div><h1>'+esc(x.name)+'</h1>'+
    (x.img?'<div class="portrait"><img src="'+esc(x.img)+'" alt="'+esc(x.name)+'" loading="lazy"'+(x.imgPos?' style="object-position:'+esc(x.imgPos)+'"':'')+'></div>':'')+
    (x.short?'<p class="princ">'+inl(x.short)+'</p>':'')+
    '</div>'+stripHtml((x.quick||[]).concat(strip||[]))+'</div>';
}
/* Одно имя — одна строка связи (v1.52): тайная связь с тем же персонажем, что
   и открытая, не даёт вторую строку, а дописывается к первой выделенной
   частью (.gm-inl). Ключ — первая [[ссылка]] строки; тайная строка без
   открытой пары выводится отдельно, как раньше. */
function tieKey(t){var s=typeof t==='string'?t:(t&&t.text)||'';var m=s.match(/^\s*\[\[([^\]|]+)/);return m?m[1].trim():null;}
function tieRows(ties){
  var rows=[];
  ties.forEach(function(t){
    var isGm=typeof t!=='string'&&t.gm,text=typeof t==='string'?t:(t.text||''),k=tieKey(t);
    if(isGm&&k){
      for(var i=0;i<rows.length;i++)if(!rows[i].gm&&rows[i].key&&same(rows[i].key,k)){
        rows[i].parts.push(text.replace(/^\s*\[\[[^\]]+\]\]\s*[—–-]\s*/,''));return;}
    }
    rows.push({key:k,gm:!!isGm,text:text,parts:[]});
  });
  return rows;
}
function commonTail(x){
  var out='';
  if(x.concept&&x.concept.length) out+=section('Концепция','',defsHtml(x.concept));
  (x.blocks||[]).filter(gmOk).forEach(function(b){out+=blockHtml(b);});
  var tr=tieRows((x.ties||[]).filter(gmOk));
  if(tr.length) out+=section('Связи',tr.length,'<div class="panel"><ul>'+tr.map(function(r){
    if(r.gm) return '<li class="gm-li">'+md(r.text)+' '+gmBadge()+'</li>';
    return '<li>'+md(r.text)+r.parts.map(function(p){return ' <span class="gm-inl">'+gmBadge()+' '+md(p)+'</span>';}).join('')+'</li>';}).join('')+'</ul></div>');
  out+=playlistHtml(x.playlist);
  out+=backlinksHtml(x);
  return out;
}

/* ================= УПОМИНАНИЯ (обратные ссылки) ================= */
function strings(o,acc){acc=acc||[];
  if(typeof o==='string') acc.push(o);
  else if(Array.isArray(o)) o.forEach(function(v){strings(v,acc);});
  else if(o&&typeof o==='object'){ if(o.gm&&!gmOn()) return acc; for(var k in o) if(k!=='id'&&k!=='acc'&&k!=='acc2'&&k!=='shape') strings(o[k],acc);}
  return acc;}
function allEntries(){
  var out=[];
  CATS.forEach(function(c){c.arr.forEach(function(x){out.push({x:x,href:'#/'+c.route+'/'+x.id,cat:c.one,name:x.name});});});
  PCS.forEach(function(x){out.push({x:x,href:'#/pc/'+x.id,cat:'персонаж',name:x.name});});
  SESSIONS.forEach(function(s){out.push({x:s,href:'#/cons',cat:'журнал',name:'Сессия '+s.n});});
  CHRON.forEach(function(c,i){out.push({x:c,href:'#/tool/chron',cat:c.kind==='memoriam'?'мемориам':'хроника',name:c.title||c.when||('Ночь '+(i+1))});});
  if(CHRONICLE.premise.length||CHRONICLE.history.length) out.push({x:CHRONICLE,href:'#/world',cat:'хроника',name:CHRONICLE.title||'Заглавная заметка'});
  return out;
}
function mentions(x){
  var names=[x.name].concat(x.aliases||[]).concat(x.full?[x.full]:[]);
  return allEntries().filter(function(e){
    if(e.x===x) return false;
    var txt=strings(e.x).join('\n');
    return names.some(function(n){return n&&(txt.indexOf('[['+n+']]')>-1||txt.indexOf('[['+n+'|')>-1);});
  });
}
function backlinksHtml(x){
  var m=mentions(x); if(!m.length) return '';
  return section('Упоминания',m.length,'<div class="filt">'+m.map(function(e){
    return '<a class="chip hot" href="'+e.href+'">'+esc(e.cat)+' · '+esc(e.name)+'</a>';}).join(' ')+'</div>');
}

/* ================= КАРТОЧКИ СПИСКОВ ================= */
function chipsFor(c,x){
  var ch=[];
  if(c.id==='clans'){(x.disciplines||[]).forEach(function(d){ch.push(d);});}
  else if(c.id==='disciplines'){if(x.kind)ch.push(x.kind);if(x.resonance)ch.push(x.resonance);ch.push((x.powers||[]).length+' сил');}
  else if(c.id==='loresheets'){ch.push((x.levels||[]).length+' ступеней');}
  else if(c.id==='sects'){var m=membersOf('sect',x);ch.push(m.length+' '+plural(m.length,'член','члена','членов'));}
  else if(c.id==='people'){[x.clan,x.sect,x.role,x.gen?x.gen+'-е пок.':''].forEach(function(v){if(v)ch.push(v);});}
  else if(c.id==='threats'){if(x.kind)ch.push(x.kind);}
  else if(c.id==='domains'){if(x.kind&&DOMAIN_KINDS[x.kind])ch.push(DOMAIN_KINDS[x.kind][0]);if(x.threat!=null)ch.push('угроза '+x.threat);}
  else (x.quick||[]).slice(0,3).forEach(function(q){ch.push(q[1]);});
  return ch;
}
function listCard(c,x){
  var ch=chipsFor(c,x);
  return '<a class="god-card'+(x.dead?' dead':'')+'" href="#/'+c.route+'/'+x.id+'" style="--c:'+(x.acc||c.c)+'">'+
    '<span class="k">'+numOf(c.arr,x)+' · '+esc(c.one.toUpperCase())+(x.dead?' · ✝':'')+'</span><h3>'+esc(x.name)+'</h3>'+
    (x.short?'<p class="pr">'+inl(x.short)+'</p>':'')+
    '<div class="foot">'+ch.map(function(v,i){return '<span class="chip'+(i===0?' hot':'')+'">'+esc(v)+'</span>';}).join('')+'</div></a>';
}
function ghostCard(label,name,chips,note){
  return '<div class="god-card ghost"><span class="k">'+esc(label)+' · ЗАМЕТКИ НЕТ</span><h3>'+esc(name)+'</h3>'+
    (note?'<p class="pr">'+esc(note)+'</p>':'')+
    '<div class="foot">'+(chips||[]).map(function(v){return '<span class="chip">'+esc(v)+'</span>';}).join('')+'</div></div>';
}
/* число активных заготовок-призраков раздела: CLAN_REF/DISC_REF для кланов
   и дисциплин (справочник книги), GHOSTS[c.id] для всех остальных разделов */
function ghostCount(c){
  if(c.id==='clans') return CLAN_REF.filter(function(r){return !LINKS[r[0]];}).length;
  if(c.id==='disciplines') return DISC_REF.filter(function(r){return !LINKS[r[0]];}).length;
  return (GHOSTS[c.id]||[]).filter(function(n){return !LINKS[n];}).length;
}
function listShell(c,inner,count){
  crumb([[c.name]]);
  app.innerHTML='<section class="sec"><div class="wrap rise"><a class="back" href="#/">← к титулу</a>'+
    '<div class="sec-head" style="margin-top:22px"><h2>'+esc(c.name)+'</h2><span class="eyebrow">'+
    (count==null?c.arr.length:count)+' '+plural(count==null?c.arr.length:count,'запись','записи','записей')+'</span></div>'+
    '<p class="lede" style="margin:0 0 30px">'+esc(c.lede)+'</p>'+inner+'</div></section>';
}

function viewList(c){
  setTheme(c.theme);
  if(c.kind==='cards') return viewCards(c,null);
  if(c.kind==='tree') return viewPlaces();
  if(c.kind==='map') return viewDomains();
  if(c.id==='players') return viewPlayers();
  if(c.id==='loresheets') return viewLoresheets(c);
  if(c.id==='people') return viewPeople(c);
  var cards=c.arr.map(function(x){return listCard(c,x);}).join('');
  var ghosts='',hint='';
  if(c.id==='clans'){ghosts=CLAN_REF.filter(function(r){return !LINKS[r[0]];}).map(function(r){
    return ghostCard('КЛАН',r[0],r[1],'');}).join('');hint='Пунктирные карточки — заготовки из книги. Как только появится запись с тем же именем, заготовка исчезнет.';}
  else if(c.id==='disciplines'){ghosts=DISC_REF.filter(function(r){return !LINKS[r[0]];}).map(function(r){
    return ghostCard('ДИСЦИПЛИНА',r[0],r[1]!=='—'?['резонанс: '+r[1]]:[],'');}).join('');hint='Пунктирные карточки — заготовки из книги. Как только появится запись с тем же именем, заготовка исчезнет.';}
  else if(GHOSTS[c.id]&&GHOSTS[c.id].length){ghosts=GHOSTS[c.id].filter(function(n){return !LINKS[n];}).map(function(n){
    return ghostCard(c.one.toUpperCase(),n,[],'');}).join('');hint='Пунктирные карточки — упомянуты в заметках, но своей записи ещё нет. Как только появится запись с тем же именем, заготовка исчезнет.';}
  var inner=(cards||ghosts)?'<div class="gods">'+cards+ghosts+'</div>':emptyBox('Записей пока нет','Раздел ждёт первых заметок хроники.');
  if(ghosts) inner+='<p class="hint">'+hint+'</p>';
  listShell(c,inner);
}

/* Личности — клан теперь полноценная категория раздела, а не просто ключ
   сортировки: список делится на подразделы с заголовком и счётчиком, по
   одному на клан (алфавит, ru), плюс «Без клана» в конце для записей без
   поля clan. Заготовки-призраки (GHOSTS.people) клана не имеют — своей
   записи ещё нет, поэтому они идут отдельным подразделом в самом конце,
   а не внутри клановых групп. */
function viewPeople(c){
  var groups={},order=[];
  c.arr.forEach(function(x){var g=x.clan||'Без клана';
    if(!groups[g]){groups[g]=[];order.push(g);}groups[g].push(x);});
  order.sort(function(a,b){if(a==='Без клана')return b==='Без клана'?0:1;
    if(b==='Без клана')return -1;return a.localeCompare(b,'ru');});
  var gh=(GHOSTS.people||[]).filter(function(n){return !LINKS[n];});
  var sections=order.map(function(g){
    var list=groups[g].slice().sort(function(a,b){return (a.name||'').localeCompare(b.name||'','ru');});
    return '<div class="sec-head" style="margin:34px 0 14px"><h3>'+esc(g)+'</h3><span class="eyebrow">'+list.length+' '+plural(list.length,'запись','записи','записей')+'</span></div>'+
      '<div class="gods">'+list.map(function(x){return listCard(c,x);}).join('')+'</div>';});
  var inner=sections.join('');
  if(gh.length) inner+='<div class="sec-head" style="margin:34px 0 14px"><h3>Клан неизвестен</h3><span class="eyebrow">'+gh.length+' '+plural(gh.length,'заготовка','заготовки','заготовок')+'</span></div>'+
    '<div class="gods">'+gh.map(function(n){return ghostCard('ЛИЧНОСТЬ',n,[],'');}).join('')+'</div>';
  if(!order.length&&!gh.length) inner=emptyBox('Записей пока нет','Раздел ждёт первых заметок хроники.');
  else if(gh.length) inner+='<p class="hint">Пунктирные карточки — упомянуты в заметках, но своей записи ещё нет (клан пока неизвестен). Как только появится запись с тем же именем, заготовка исчезнет.</p>';
  listShell(c,inner);
}

/* Лоршиты — события истории города: карточки идут в хронологическом
   порядке (по году), а не как обычно (сперва настоящие записи, потом
   заготовки). Год настоящей записи — LORESHEETS[].year; год заготовки —
   справочник LORE_YEARS в p2_data.html (не хранится в самой GHOSTS,
   чтобы не усложнять общий формат заготовок остальных разделов). Запись
   или заготовка без известного года уходит в конец списка. */
function viewLoresheets(c){
  var gh=(GHOSTS.loresheets||[]).filter(function(n){return !LINKS[n];});
  var items=c.arr.map(function(x){return {y:x.year,html:listCard(c,x)};})
    .concat(gh.map(function(n){return {y:(typeof LORE_YEARS!=='undefined'?LORE_YEARS[n]:null),html:ghostCard('ЛОРШИТ',n,[],'')};}));
  items.sort(function(a,b){var ay=a.y==null?Infinity:a.y,by=b.y==null?Infinity:b.y;return ay-by;});
  var inner=items.length?'<div class="gods">'+items.map(function(i){return i.html;}).join('')+'</div>'
    :emptyBox('Записей пока нет','Раздел ждёт первых заметок хроники.');
  if(gh.length) inner+='<p class="hint">Карточки идут в хронологическом порядке. Пунктирные — упомянуты в заметках, но своей записи ещё нет; как только появится запись с тем же именем, заготовка исчезнет.</p>';
  listShell(c,inner);
}

/* компактные разделы: все записи — полные карточки на одной странице */
function fullCard(c,x){
  var par=[];
  if(c.id==='rituals'){par=[['Тип',x.kind],['Уровень',x.lvl],['Цена',x.cost],['Пул',x.pool],['Ингредиенты',x.ingredients]];}
  if(c.id==='predators'){par=[['Пул охоты',x.pool],['Даёт',(x.gains||[]).join('; ')]];}
  if(c.id==='merits'){par=[['Вид',x.kind],['Точки',x.dots]];}
  par=par.filter(function(p){return p[1]!=null&&p[1]!=='';});
  return '<article class="card" id="c-'+c.route+'-'+x.id+'" style="--c:'+(x.acc||c.c)+'">'+
    '<span class="tag">'+esc(x.kind||c.one)+(x.lvl?' '+x.lvl:'')+'</span><h4>'+esc(x.name)+'</h4>'+
    (x.short?'<div class="tsub">'+inl(x.short)+'</div>':'')+
    (par.length?'<dl class="par">'+par.map(function(p){return '<dt>'+esc(p[0])+'</dt><dd>'+inl(String(p[1]))+'</dd>';}).join('')+'</dl>':'')+
    '<div class="eff">'+md(x.text||'')+'</div></article>';
}
function ghostFullCard(c,name){
  return '<article class="card ghost"><span class="tag">'+esc(c.one)+' · нет</span><h4>'+esc(name)+'</h4>'+
    '<div class="eff">Упомянуто в заметках, своей записи ещё нет.</div></article>';
}
function viewCards(c,focusId){
  setTheme(c.theme);
  var inner;
  var gh=(GHOSTS[c.id]||[]).filter(function(n){return !LINKS[n];});
  if(!c.arr.length&&!gh.length) inner=emptyBox('Записей пока нет','Здесь появятся карточки с полным текстом — чтобы читать за столом одним экраном.');
  else{
    var groups={},order=[];
    c.arr.forEach(function(x){var g=c.group?(x[c.group]||'Прочее'):'';if(!groups[g]){groups[g]=[];order.push(g);}groups[g].push(x);});
    inner=order.map(function(g){
      var list=groups[g].slice().sort(function(a,b){return (a.lvl||0)-(b.lvl||0);});
      return (g?'<div class="sec-head" style="margin:34px 0 14px"><h3>'+esc(g)+'</h3><span class="eyebrow">'+list.length+'</span></div>':'')+
        '<div class="grid">'+list.map(function(x){return fullCard(c,x);}).join('')+'</div>';}).join('');
    if(gh.length){inner+='<div class="grid">'+gh.map(function(n){return ghostFullCard(c,n);}).join('')+'</div>'+
      '<p class="hint">Пунктирные карточки — упомянуты в заметках, но своей записи ещё нет.</p>';}
  }
  listShell(c,inner);
  if(focusId){var el=document.getElementById('c-'+c.route+'-'+focusId);
    if(el) requestAnimationFrame(function(){el.scrollIntoView({block:'center',behavior:'smooth'});el.classList.add('flash');});}
}

/* ================= ЧЛЕНСТВО И ПОЛИТИКА ================= */
function membersOf(field,x){var names=[x.name].concat(x.aliases||[]);
  return allPeople().filter(function(p){return names.indexOf(p[field])>-1;});}
function personHref(p){return PCS.indexOf(p)>-1?'#/pc/'+p.id:'#/person/'+p.id;}
function personSub(p){return '<a class="subcard" href="'+personHref(p)+'" style="--c:'+(p.acc||'var(--acc)')+'">'+
  '<span class="k">'+(PCS.indexOf(p)>-1?'персонаж игрока':'личность')+(p.dead?' · ✝':'')+'</span><h4>'+esc(p.name)+'</h4>'+
  '<div class="ds">'+esc([p.clan,p.sect,p.role].filter(Boolean).join(' · ')||p.short||'')+'</div></a>';}
function politicsHtml(x){
  var n=x.name,out='';
  var bonds=BONDS.filter(gmOk).filter(function(b){return same(b.thrall,n)||same(b.regnant,n);});
  var boons=BOONS.filter(gmOk).filter(function(b){return same(b.debtor,n)||same(b.creditor,n);});
  var rel=RELATIONS.filter(gmOk).filter(function(r){return same(r.a,n)||same(r.b,n);});
  function gb(o){return o.gm?' '+gmBadge():'';}
  var sire=x.sire, childer=allPeople().filter(function(p){return same(p.sire,n);});
  var rows=[];
  if(sire) rows.push('<li>Сир: '+nameLink(sire)+'</li>');
  if(childer.length) rows.push('<li>Потомки: '+childer.map(function(p){return nameLink(p.name);}).join(', ')+'</li>');
  bonds.forEach(function(b){rows.push('<li>Кровные узы '+dots(b.level,3)+': '+nameLink(b.thrall)+' → '+nameLink(b.regnant)+(b.note?' — '+inl(b.note):'')+gb(b)+'</li>');});
  boons.forEach(function(b){var L=BOON_LEVELS[b.level]||['?',''];
    rows.push('<li>'+L[0]+' долг ('+(BOON_STATUS[b.status]||b.status)+'): '+nameLink(b.debtor)+' должен '+nameLink(b.creditor)+(b.why?' — '+inl(b.why):'')+gb(b)+'</li>');});
  /* одно имя — одна строка (v1.52): тайная связь с тем же персонажем
     дописывается к открытой выделенной частью, а не даёт вторую строку */
  var relRows=[];
  rel.forEach(function(r){var other=same(r.a,n)?r.b:r.a;
    if(r.gm)for(var i=0;i<relRows.length;i++)if(!relRows[i].r.gm&&same(relRows[i].other,other)){relRows[i].parts.push(r);return;}
    relRows.push({r:r,other:other,parts:[]});});
  relRows.forEach(function(w){var r=w.r,T=REL_TYPES[r.type]||REL_TYPES.other;
    rows.push('<li><span style="color:'+T[1]+'">'+T[0]+'</span>: '+nameLink(w.other)+(r.note?' — '+inl(r.note):'')+gb(r)+
      w.parts.map(function(p){var PT=REL_TYPES[p.type]||REL_TYPES.other,same_t=p.type===r.type;
        return ' <span class="gm-inl">'+gmBadge()+' '+(same_t?'':'<span style="color:'+PT[1]+'">'+PT[0]+'</span>'+(p.note?': ':''))+inl(p.note||'')+'</span>';}).join('')+'</li>');});
  if(x.status) Object.keys(x.status).forEach(function(s){rows.push('<li>Статус ('+esc(s)+'): '+dots(statusNow(n,s,x.status[s]))+'</li>');});
  if(rows.length) out=section('Положение среди Сородичей',rows.length,'<div class="panel"><ul>'+rows.join('')+'</ul></div>');
  return out;
}
