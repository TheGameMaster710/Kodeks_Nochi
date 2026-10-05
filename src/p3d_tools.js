
/* ================= ОБЩЕЕ ДЛЯ ИНСТРУМЕНТОВ ================= */
function toolShell(t,lede,inner){
  setTheme(t.theme);crumb([['Инструменты','#/tools'],[t.name]]);
  app.innerHTML='<section class="sec"><div class="wrap rise"><a class="back" href="#/">← к титулу</a>'+
    '<div class="sec-head" style="margin-top:22px"><h2>'+esc(t.name)+'</h2><span class="eyebrow">инструмент рассказчика</span></div>'+
    '<p class="lede" style="margin:0 0 30px">'+lede+'</p>'+inner+'</div></section>';
}
function sessRange(){var ns=SESSIONS.map(function(s){return s.n;});return ns.length?[Math.min.apply(null,ns),Math.max.apply(null,ns)]:null;}

/* ================= СТАТУС ================= */
function statusEvents(){var out=[];SESSIONS.forEach(function(s){s.items.forEach(function(it){
  if(it&&it.status) out.push({n:s.n,who:it.status.who,sect:it.status.sect||'',delta:+it.status.delta||0});});});return out;}
function statusNow(who,sect,base){var v=+base||0;statusEvents().forEach(function(e){if(same(e.who,who)&&e.sect===sect)v+=e.delta;});return Math.max(0,v);}
function statusSeries(){
  var keys={},order=[];
  function add(who,sect,base){var k=(hrefOf(who)||who)+'|'+sect;if(!keys[k]){keys[k]={who:who,sect:sect,base:+base||0};order.push(k);}}
  allPeople().forEach(function(p){if(p.status)Object.keys(p.status).forEach(function(s){add(p.name,s,p.status[s]);});});
  statusEvents().forEach(function(e){add(e.who,e.sect,0);});
  return order.map(function(k){return keys[k];});
}
var PAL=['#E0142F','#D4AF37','#8FB8DE','#B98CFF','#6FCF8E','#E0812E','#D1436A','#7FB5A8','#F2C14E','#9FB9D1'];
function lineChart(series,yLabel){
  var rg=sessRange();if(!rg||!series.length)return '';
  var W=900,H=280,L=46,Rr=20,T=20,B=40,n0=rg[0]-1,n1=rg[1];
  var all=[];series.forEach(function(s){all=all.concat(s.pts.map(function(p){return p[1];}));});
  var mn=Math.min(0,Math.min.apply(null,all)),mx=Math.max(5,Math.max.apply(null,all));
  function X(n){return L+(n-n0)/Math.max(1,n1-n0)*(W-L-Rr);} function Y(v){return T+(mx-v)/Math.max(1,mx-mn)*(H-T-B);}
  var g='';for(var v=mn;v<=mx;v++) g+='<line x1="'+L+'" x2="'+(W-Rr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="rgba(255,255,255,.07)"/><text x="'+(L-10)+'" y="'+(Y(v)+4)+'" text-anchor="end" font-size="11" fill="#A38F8C" font-family="JetBrains Mono">'+v+'</text>';
  for(var n=n0;n<=n1;n++) g+='<text x="'+X(n)+'" y="'+(H-14)+'" text-anchor="middle" font-size="11" fill="#A38F8C" font-family="JetBrains Mono">'+(n===n0?'старт':'С'+n)+'</text>';
  series.forEach(function(s){g+='<polyline fill="none" stroke="'+s.color+'" stroke-width="2.5" points="'+s.pts.map(function(p){return X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1);}).join(' ')+'"/>'+
    s.pts.map(function(p){return '<circle cx="'+X(p[0]).toFixed(1)+'" cy="'+Y(p[1]).toFixed(1)+'" r="4" fill="'+s.color+'"><title>'+esc(s.name)+': '+p[1]+'</title></circle>';}).join('');});
  return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(yLabel)+'">'+g+'</svg><div class="legend">'+series.map(function(s){
    return '<span class="legend-item"><i style="background:'+s.color+'"></i>'+esc(s.name)+'<b>'+s.pts[s.pts.length-1][1]+'</b></span>';}).join('')+'</div></div>';
}
function statusChart(){
  var rg=sessRange();if(!rg)return '';
  var ser=statusSeries().map(function(s,i){var v=s.base,pts=[[rg[0]-1,v]];
    for(var n=rg[0];n<=rg[1];n++){statusEvents().forEach(function(e){if(e.n===n&&same(e.who,s.who)&&e.sect===s.sect)v+=e.delta;});pts.push([n,Math.max(0,v)]);}
    var sc=null;SECTS.forEach(function(x){if(x.name===s.sect&&x.acc)sc=x.acc;});
    return {name:s.who+(s.sect?' · '+s.sect:''),color:PAL[i%PAL.length]||sc,pts:pts};});
  return lineChart(ser,'Статус по сессиям');
}

/* ================= ДВОР ================= */
function courtOf(sect){for(var i=0;i<COURT.length;i++)if(COURT[i].sect===sect)return COURT[i];return null;}
/* v1.59 — карточка поста: только звание и ссылки на личностей (сказано
   рассказчиком). Посты одного яруса с одинаковым званием сливаются в одну
   карточку (лейтенанты, одно поколение). note/text в данных остаются как
   справка, на карточке не выводятся. holders:[…] — несколько имён сразу. */
function courtHtml(g){
  var tiers={},order=[];
  g.seats.forEach(function(s){var t=s.tier||9;if(!tiers[t]){tiers[t]=[];order.push(t);}
    var row=tiers[t],m=null;row.forEach(function(q){if(q.title===s.title)m=q;});
    var names=(s.holders||[]).concat(s.holder?[s.holder]:[]);
    if(m){names.forEach(function(n){if(m.names.indexOf(n)<0)m.names.push(n);});m.grp=m.grp||!!s.text;}
    else row.push({title:s.title,names:names,grp:!!s.text});});
  return '<div class="court">'+order.sort(function(a,b){return a-b;}).map(function(t){
    return '<div class="row">'+tiers[t].map(function(s){var has=s.names.length;
      return '<div class="seat'+(has||s.grp?'':' vac')+(s.grp&&!has?' grp':'')+'"><div class="ti">'+esc(s.title)+'</div>'+
        (has?'<div class="ho">'+s.names.map(nameLink).join('<br>')+'</div>':s.grp?'':'<div class="ho"><span style="opacity:.5">вакантно</span></div>')+'</div>';}).join('')+'</div>';}).join('')+'</div>';
}
function viewCourt(t){
  var all=COURT.concat(typeof CLAN_COURT!=='undefined'?CLAN_COURT:[]);
  function tab(g,i){return '<button class="mini'+(i===0?' on':'')+'" data-tab="'+i+'">'+esc(g.clan?g.clan+' · '+g.sect:g.sect)+'</button>';}
  var tabs=COURT.map(tab).join('')+(all.length>COURT.length?'<span class="tabs-lbl">кланы</span>'+all.slice(COURT.length).map(function(g,j){return tab(g,COURT.length+j);}).join(''):'');
  var panes=all.map(function(g,i){return '<div class="cpane" data-pane="'+i+'"'+(i?' hidden':'')+'>'+courtHtml(g)+'</div>';}).join('');
  var st=statusSeries(),rows=st.map(function(s){return [s.who?'[['+s.who+']]':'—',s.sect||'—',String(s.base),String(statusNow(s.who,s.sect,s.base))];});
  var inner=section('Иерархия города',COURT.length+' '+plural(COURT.length,'секта','секты','сект'),
      (COURT.length?'<div class="tabs">'+tabs+'</div>'+panes:emptyBox('Двор не описан','Иерархия города появится здесь.')))+
    section('Статус','точки 0–5',st.length?tableHtml({head:['Кто','Секта','База','Сейчас'],rows:rows}).replace(/<td>(\d)<\/td><\/tr>/g,function(_,v){return '<td>'+dots(+v)+'</td></tr>';})
      :emptyBox('Статус пока никому не выдан','Точки Статуса персонажей и личностей появятся здесь.'))+
    section('Динамика Статуса','по сессиям',statusChart()||emptyBox('Нет изменений','График появится, когда Статус начнёт меняться от сессии к сессии.'));
  toolShell(t,'Кто сидит на каком посту и какой вес у каждого голоса. Пустые посты — вакансии или то, чего котерия ещё не знает.',inner);
  [].forEach.call(app.querySelectorAll('[data-tab]'),function(b){b.addEventListener('click',function(){
    [].forEach.call(app.querySelectorAll('[data-tab]'),function(x){x.classList.toggle('on',x===b);});
    [].forEach.call(app.querySelectorAll('[data-pane]'),function(p){p.hidden=p.getAttribute('data-pane')!==b.getAttribute('data-tab');});});});
}

/* ================= ДОЛГИ ================= */
function viewBoons(t){
  var open=BOONS.filter(gmOk).filter(function(b){return b.status==='open'||!b.status;});
  var sum='<div class="facts" style="margin:0 0 26px">'+Object.keys(BOON_LEVELS).map(function(k){
    var n=open.filter(function(b){return b.level===k;}).length;
    return '<div class="fact"><div class="num">'+BOON_LEVELS[k][1]+'</div><h3>'+BOON_LEVELS[k][0]+'</h3><p>'+n+' '+plural(n,'непогашенный','непогашенных','непогашенных')+'</p></div>';}).join('')+'</div>';
  var ppl={};BOONS.forEach(function(b){[b.debtor,b.creditor].forEach(function(n){if(n&&!ppl[n])ppl[n]={owes:0,owed:0};});
    if(b.status==='open'||!b.status){if(ppl[b.debtor])ppl[b.debtor].owes++;if(ppl[b.creditor])ppl[b.creditor].owed++;}});
  var bal=Object.keys(ppl).map(function(n){return ['[['+n+']]',String(ppl[n].owes),String(ppl[n].owed)];});
  function rowsOf(list){return list.map(function(b){var L=BOON_LEVELS[b.level]||['?','?'];
    return ['[['+b.debtor+']]','[['+b.creditor+']]',L[0]+' '+L[1],BOON_STATUS[b.status||'open']||b.status,b.why||'',b.n!=null?'С'+b.n:''];});}
  var head=['Должник','Кредитор','Вес','Статус','За что','Сессия'];
  var inner=BOONS.length?sum+
    '<div class="addrow" style="max-width:420px;margin-bottom:14px"><input id="boonQ" type="search" placeholder="Фильтр по имени"></div>'+
    '<div id="boonT">'+tableHtml({cap:'Непогашенные',head:head,rows:rowsOf(open)})+
    tableHtml({cap:'Погашенные и нарушенные',head:head,rows:rowsOf(BOONS.filter(function(b){return b.status&&b.status!=='open';}))})+'</div>'+
    section('Баланс',bal.length,tableHtml({head:['Кто','Должен','Должны ему'],rows:bal}))
    :emptyBox('Долгов пока нет','Никто никому ничего не должен. Пока.');
  toolShell(t,'Валюта Сородичей. Тривиальный долг — мелкая услуга, жизненный — жизнь за жизнь. Здесь видно, кто кому должен и какой вес у каждого одолжения.',inner);
  var q=document.getElementById('boonQ');
  if(q) q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();
    [].forEach.call(document.querySelectorAll('#boonT tbody tr'),function(tr){tr.hidden=v&&tr.textContent.toLowerCase().indexOf(v)<0;});});
}

/* ================= ГРАФ СВЯЗЕЙ ================= */
function graphData(){
  var nodes={},list=[],edges=[];
  function node(n){var k=hrefOf(n)||n;if(!nodes[k]){var pc=PCS.some(function(p){return same(p.name,n);}),pe=PEOPLE.some(function(p){return same(p.name,n);});
    var who=null;allPeople().forEach(function(p){if(!who&&same(p.name,n))who=p;});
    var gmeta=(typeof GHOST_META!=='undefined'&&GHOST_META[n])||{};
    nodes[k]={id:k,name:n,href:hrefOf(n),kind:pc?'pc':pe?'person':'other',clan:who?who.clan||'':gmeta.clan||'',sect:who?who.sect||'':''};list.push(nodes[k]);}return nodes[k];}
  function edge(a,b,type,note,gm,noteB){if(!a||!b)return;edges.push({a:node(a),b:node(b),type:REL_TYPES[type]?type:'other',note:note||'',noteB:noteB||'',gm:!!gm});}
  /* gm-рёбра (с v1.42, §1.3.4) — только при виде «Мастер» */
  /* одна пара и тот же тип — одно ребро (v1.52): тайная часть дописывается
     к открытой заметке ребра, а не рисуется поверх второй линией */
  RELATIONS.filter(gmOk).forEach(function(r){
    if(r.gm){var t=REL_TYPES[r.type]?r.type:'other',host=null;
      edges.forEach(function(e){if(!host&&!e.gm&&e.type===t&&((e.a===node(r.a)&&e.b===node(r.b))||(e.a===node(r.b)&&e.b===node(r.a))))host=e;});
      if(host){host.note=(host.note?host.note+' · ':'')+'[для мастера] '+(r.note||'');return;}}
    edge(r.a,r.b,r.type,r.note,r.gm,r.noteB);});
  BONDS.filter(gmOk).forEach(function(b){edge(b.thrall,b.regnant,'bond','ступень '+b.level+(b.note?' · '+b.note:''));});
  BOONS.filter(gmOk).filter(function(b){return b.status==='open'||!b.status;}).forEach(function(b){edge(b.debtor,b.creditor,'debt',(BOON_LEVELS[b.level]||['долг'])[0]+' долг');});
  allPeople().forEach(function(p){if(p.sire)edge(p.sire,p.name,'sire','');});
  PCS.forEach(function(p){(p.convictions||[]).forEach(function(c){if(c[1])edge(p.name,c[1],'touch',c[0]);});});
  return {nodes:list,edges:edges,node:node,edge:edge};
}
/* v1.78 — слой упоминаний: ссылки [[…]] из блоков «Связи» всех заметок и
   принадлежность клану/секте. Включается переключателем, по умолчанию выключен. */
function addLinkLayer(G){
  function has(a,b){return G.edges.some(function(e){return (e.a===a&&e.b===b)||(e.a===b&&e.b===a);});}
  allEntries().forEach(function(en){var x=en.x;if(!x||!x.name||!x.ties)return;
    x.ties.filter(gmOk).forEach(function(t){var txt=typeof t==='string'?t:(t.text||''),m,re=/\[\[([^\]|]+)/g;
      while((m=re.exec(txt))){var n=m[1].trim();if(same(n,x.name))continue;var a=G.node(x.name),b=G.node(n);if(!has(a,b))G.edge(x.name,n,'link','',typeof t!=='string'&&t.gm);}});});
  allPeople().forEach(function(p){['clan','sect'].forEach(function(f){if(p[f]&&LINKS[p[f]]){var a=G.node(p.name),b=G.node(p[f]);if(!has(a,b))G.edge(p.name,p[f],'link','');}});});
}
/* цвета ромбов-заметок в графах; подобраны так, чтобы не совпадать с кланами */
var NOTE_COLORS={loresheets:'#F2E3B3',merits:'#7FE0C4',places:'#5C8DF0',domains:'#3F9FA8',clans:'#FF5A6E',sects:'#C9CED6',
  disciplines:'#C9A2F2',rituals:'#F0C75E',predators:'#F08A5D',threats:'#9FB9D1',players:'#E8B04B'};
function clanColor(c){return (typeof CLAN_COLORS!=='undefined'&&CLAN_COLORS[c])||'#9A93A6';}
var WEB_OFF={},WEB_LINKS=false,WEB_COLOR='clan',WEB_GROUP='',WEB_PATH={a:'',b:''};
var WEB_DBG=null; /* для тестов: последние узлы/рёбра графа и place() */
var WEB_VB=null; /* {x,y,w,h} — текущая видимая область графа (масштаб/панорама),
  в координатах симуляции 0..1000 × 0..640; null = сброшена, вид «по размеру».
  Сохраняется между перерисовками (переключение фильтров), чтобы масштаб не
  сбрасывался при клике по фильтру типа связи. */
function webPath(G,a,b){
  var A=null,B=null;G.nodes.forEach(function(n){if(n.name===a)A=n;if(n.name===b)B=n;});
  if(!A||!B||A===B)return null;
  var prev=new Map(),q=[A];prev.set(A,null);
  while(q.length){var cur=q.shift();if(cur===B)break;
    G.edges.forEach(function(e){var o=e.a===cur?e.b:e.b===cur?e.a:null;if(o&&!prev.has(o)){prev.set(o,{n:cur,e:e});q.push(o);}});}
  if(!prev.has(B))return {nodes:[],edges:[]};
  var ns=[B],es=[],c=B;while(prev.get(c)){es.unshift(prev.get(c).e);c=prev.get(c).n;ns.unshift(c);}
  return {nodes:ns,edges:es};
}
function viewWeb(t){
  var G=graphData();
  if(WEB_LINKS)addLinkLayer(G);
  var types=Object.keys(REL_TYPES).filter(function(k){return k!=='link';});
  var filt='<div class="filt">'+types.map(function(k){var n=G.edges.filter(function(e){return e.type===k;}).length;
    return '<button class="mini'+(WEB_OFF[k]?' off':'')+'" data-f="'+k+'"><i style="background:'+REL_TYPES[k][1]+'"></i>'+REL_TYPES[k][0]+' '+n+'</button>';}).join('')+'</div>';
  /* слои и цвет — переключатели: всё сразу не включено */
  var layers='<div class="filt"><span class="filt-l">слои</span>'+
    '<button class="mini'+(WEB_LINKS?'':' off')+'" data-w="links"><i style="background:'+REL_TYPES.link[1]+'"></i>Упоминания</button>'+
    '<span class="filt-l">цвет узлов</span>'+
    '<button class="mini'+(WEB_COLOR==='clan'?'':' off')+'" data-w="cclan">по клану</button>'+
    '<button class="mini'+(WEB_COLOR==='kind'?'':' off')+'" data-w="ckind">по роли</button></div>';
  var clans=[],sects=[];G.nodes.forEach(function(n){if(n.clan&&clans.indexOf(n.clan)<0)clans.push(n.clan);if(n.sect&&sects.indexOf(n.sect)<0)sects.push(n.sect);});
  clans.sort();sects.sort();
  if(WEB_GROUP&&clans.indexOf(WEB_GROUP)<0&&sects.indexOf(WEB_GROUP)<0)WEB_GROUP='';
  var groups='<div class="filt"><span class="filt-l">показать</span><button class="mini'+(WEB_GROUP?' off':'')+'" data-g="">всех</button>'+
    clans.map(function(c){return '<button class="mini'+(WEB_GROUP===c?'':' off')+'" data-g="'+esc(c)+'"><i style="background:'+clanColor(c)+'"></i>'+esc(c)+'</button>';}).join('')+
    sects.map(function(c){return '<button class="mini'+(WEB_GROUP===c?'':' off')+'" data-g="'+esc(c)+'">'+esc(c)+'</button>';}).join('')+'</div>';
  if(WEB_GROUP&&G.node)allPeople().forEach(function(p){if(p.clan===WEB_GROUP||p.sect===WEB_GROUP)G.node(p.name);});
  if(WEB_GROUP){var keep=G.nodes.filter(function(n){return n.clan===WEB_GROUP||n.sect===WEB_GROUP;});
    G={nodes:keep,edges:G.edges.filter(function(e){return keep.indexOf(e.a)>-1&&keep.indexOf(e.b)>-1;})};}
  var vis={nodes:G.nodes,edges:G.edges.filter(function(e){return !WEB_OFF[e.type];})};
  var names=G.nodes.map(function(n){return n.name;}).sort(function(a,b){return a.localeCompare(b,'ru');});
  function opts(cur){return '<option value="">— кто —</option>'+names.map(function(n){return '<option'+(n===cur?' selected':'')+'>'+esc(n)+'</option>';}).join('');}
  var path=WEB_PATH.a&&WEB_PATH.b?webPath(vis,WEB_PATH.a,WEB_PATH.b):null,pathTxt='';
  if(path){pathTxt=path.nodes.length?path.nodes.map(function(n,i){var e=path.edges[i];
      return nameLink(n.name)+(e?' <span class="pstep" style="color:'+REL_TYPES[e.type][1]+'">— '+esc(REL_TYPES[e.type][0].toLowerCase())+' —</span> ':'');}).join('')
    :'Между ними нет цепочки связей (с учётом выключенных слоёв и фильтров).';}
  var pathUi='<div class="filt webpath"><span class="filt-l">путь</span><select id="wpA">'+opts(WEB_PATH.a)+'</select><span class="filt-l">→</span><select id="wpB">'+opts(WEB_PATH.b)+'</select>'+
    (WEB_PATH.a||WEB_PATH.b?'<button class="mini" data-w="pclear">сбросить</button>':'')+'</div>'+(pathTxt?'<div class="web-info on">'+pathTxt+'</div>':'');
  var VB=BONDS.filter(gmOk);
  var bonds=VB.length?tableHtml({head:['Раб уз','Регнант','Ступень','Заметка'],rows:VB.map(function(b){return ['[['+b.thrall+']]','[['+b.regnant+']]','•'.repeat(b.level||1),b.note||''];})}).replace(/<td>(•+)<\/td>/g,function(_,v){return '<td>'+dots(v.length,3)+'</td>';})
    :emptyBox('Кровных уз пока нет','Ничья кровь ещё никого не держит.');
  var inner=(canGm()?'<div class="gmrow">'+gmToggleHtml()+'</div>':'')+filt+layers+groups+pathUi+
    (G.nodes.length?'<div class="web'+(path&&path.nodes.length?' haspath':'')+'" id="web"></div><div class="web-info" id="webInfo"></div><p class="hint">Тяните узлы. Нажмите на узел, чтобы открыть заметку, на линию — чтобы прочитать, что это за связь. Колесо мыши или кнопки в углу — масштаб; перетаскивание фона — панорама.</p>'
      :emptyBox('Граф пуст','Отношения, кровные узы, долги, сиры и Якоря персонажей сложатся здесь в сеть.'))+
    section('Кровные узы',VB.length,bonds+'<div class="note"><b>Ступени</b>Первый глоток — симпатия. Второй — сильная привязанность. Третий — полные узы: регнант становится центром жизни раба. Узы слабеют, если не пить из регнанта долгое время.</div>');
  toolShell(t,'Кто кого любит, кто кому служит и чья кровь держит кого на поводке. Граф собирается из всех данных кодекса.',inner);
  if(G.nodes.length) drawWeb(G,{path:path&&path.nodes.length?path:null,info:document.getElementById('webInfo')});
  [].forEach.call(app.querySelectorAll('[data-f]'),function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-f');WEB_OFF[k]=!WEB_OFF[k];viewWeb(t);});});
  [].forEach.call(app.querySelectorAll('[data-w]'),function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-w');
    if(k==='links')WEB_LINKS=!WEB_LINKS;else if(k==='cclan')WEB_COLOR='clan';else if(k==='ckind')WEB_COLOR='kind';else if(k==='pclear')WEB_PATH={a:'',b:''};viewWeb(t);});});
  [].forEach.call(app.querySelectorAll('[data-g]'),function(b){b.addEventListener('click',function(){WEB_GROUP=b.getAttribute('data-g');viewWeb(t);});});
  ['wpA','wpB'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('change',function(){WEB_PATH[id==='wpA'?'a':'b']=el.value;viewWeb(t);});});
}
/* v1.77 — drawWeb(G,opt): opt.box — куда рисовать (по умолчанию #web),
   opt.local — малый граф внутри заметки: свой масштаб, без фильтров и без
   зума колесом (страница должна прокручиваться), opt.center — узел заметки,
   закреплён в центре и выделен. */
function drawWeb(G,opt){
  opt=opt||{};
  var box=opt.box||document.getElementById('web');
  if(!box)return;
  var W=1000,H=640,SPR=190;
  /* малый граф подгоняет сцену под свой блок: на узком экране единица сцены
     ≈ пиксель, иначе подписи узлов становятся нечитаемо мелкими */
  var cw=box.clientWidth||1000,ch=opt.local?(box.clientHeight||Math.min(window.innerHeight*.6,520)):Math.min(window.innerHeight*.7,640);
  var narrow=opt.local||cw<700;
  if(narrow){W=Math.max(520,Math.min(1000,cw*1.4));H=Math.max(360,W*ch/cw);SPR=Math.min(190,W*.3);}
  /* v1.86 — сцена больше окна. Окно графа прежнего размера и по умолчанию
     показывает середину сцены (вид 1:1), а сама сцена растёт с числом узлов:
     около 24 000 кв. единиц на узел. Граф можно отдалить дальше 1:1 — до
     всей сцены (zoomAt). X0..X1, Y0..Y1 — границы сцены. */
  var K=Math.min(3.5,Math.sqrt(Math.max(1,G.nodes.length*(opt.local?24000:44000)/(W*H))));
  var X0=W/2-W*K/2,X1=W/2+W*K/2,Y0=H/2-H*K/2,Y1=H/2+H*K/2;
  var edges=opt.local?G.edges.slice():G.edges.filter(function(e){return !WEB_OFF[e.type];});
  var N=G.nodes;N.forEach(function(n,i){var a=i/N.length*Math.PI*2;n.x=W/2+Math.cos(a)*W*.22;n.y=H/2+Math.sin(a)*H*.31;n.vx=0;n.vy=0;});
  var asp=H/W,gx=asp>1?Math.min(4,asp*asp):1,gy=asp>1?1/Math.min(4,asp*asp):1;
  /* v1.87 — в большом графе узлы расталкиваются сильнее (сказано рассказчиком:
     со слоем упоминаний было слишком кучно). Отталкивание растёт с числом
     узлов, притяжение к центру слабеет, а пунктирные связи-упоминания тянут
     втрое слабее настоящих и держат узлы на большем расстоянии. Малый граф
     в заметке раскладывается по-прежнему. */
  var big=opt.local?0:Math.max(0,N.length-14),REP=9000*(1+big/9),GRAV=.004/(1+big/22),LKS=opt.local?.02:.006,LKL=opt.local?1:1.5;
  for(var it=0;it<(big?620:420);it++){
    for(var i=0;i<N.length;i++)for(var j=i+1;j<N.length;j++){var a=N[i],b=N[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy+.01,f=REP/d2,dd=Math.sqrt(d2);
      a.vx+=f*dx/dd;a.vy+=f*dy/dd;b.vx-=f*dx/dd;b.vy-=f*dy/dd;}
    edges.forEach(function(e){var dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,dd=Math.sqrt(dx*dx+dy*dy)+.01,lk=e.type==='link',f=(dd-(lk?SPR*LKL:SPR))*(lk?LKS:.02);
      e.a.vx+=f*dx/dd;e.a.vy+=f*dy/dd;e.b.vx-=f*dx/dd;e.b.vy-=f*dy/dd;});
    /* вытянутая сцена: к центру по узкой оси тянет сильнее, по длинной слабее;
       подпись узла не выходит за край сцены */
    N.forEach(function(n){n.vx+=(W/2-n.x)*GRAV*gx;n.vy+=(H/2-n.y)*GRAV*gy;n.x+=n.vx*.5;n.y+=n.vy*.5;n.vx*=.6;n.vy*=.6;
      var hw=Math.min(W/2-4,Math.max(60,String(n.name).length*4.3+8));
      n.x=Math.max(X0+hw,Math.min(X1-hw,n.x));n.y=Math.max(Y0+40,Math.min(Y1-40,n.y));});
    if(opt.center){opt.center.x=W/2;opt.center.y=H/2;opt.center.vx=0;opt.center.vy=0;}
  }
  /* v1.80 — узлы различаются и цветом, и формой. Личность — круг (цвет клана
     или роли). Заметка другого раздела — ромб цвета своего раздела
     (NOTE_COLORS). Запись без заметки — пустой пунктирный круг. Под графом
     выводится легенда только из тех видов узлов, что есть на экране. */
  var col={pc:'#E8B04B',person:'#D0243F',other:'#8FB8DE'};
  function ncat(n){if(n._cat!==undefined)return n._cat;var m=/^#\/([a-z]+)\//.exec(n.href||''),c=null;
    if(m)CATS.forEach(function(x){if(x.route===m[1])c=x;});return n._cat=c;}
  function isNote(n){return n.kind==='other'&&!!n.href;}
  function isGhost(n){return !n.href;}
  function ncol(n){
    if(isNote(n)){var c=ncat(n);return c?(NOTE_COLORS[c.id]||c.c):col.other;}
    if(n.kind==='other')return '#8A8494';
    return WEB_COLOR==='clan'?clanColor(n.clan):col[n.kind];}
  function shape(n,me,c){
    if(isNote(n)){var r=me?16:10;return '<rect x="'+(-r)+'" y="'+(-r)+'" width="'+2*r+'" height="'+2*r+'" rx="2.5" transform="rotate(45)" fill="'+c+'" stroke="#000" stroke-width="2"/>';}
    if(isGhost(n))return '<circle r="'+(me?17:n.kind==='other'?9:12)+'" fill="#0B090C" stroke="'+c+'" stroke-width="2.4" stroke-dasharray="4 3"/>';
    return '<circle r="'+(me?17:13)+'" fill="'+c+'" stroke="'+(n.kind==='pc'&&WEB_COLOR==='clan'?'#E8B04B':'#000')+'" stroke-width="2"/>';}
  var pathE=opt.path?opt.path.edges:[],pathN=opt.path?opt.path.nodes:[];
  var defs='<defs>'+Object.keys(REL_TYPES).map(function(k){return '<marker id="ar-'+k+'" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+REL_TYPES[k][1]+'"/></marker>';}).join('')+'</defs>';
  var dir={bond:1,debt:1,sire:1,serve:1,touch:1};
  /* v1.88 — вид «1:1» динамический и равен максимуму отдаления (сказано
     рассказчиком): это рамка вокруг всех узлов с подписями, не меньше окна,
     в пропорциях окна. Граф открывается в этом виде, «1:1» возвращает к нему,
     дальше него отдалить нельзя. */
  var FIT=(function(){var a=1e9,b=-1e9,c=1e9,d=-1e9;N.forEach(function(n){var hw=String(n.name).length*4.3+8;
      a=Math.min(a,n.x-hw);b=Math.max(b,n.x+hw);c=Math.min(c,n.y-40);d=Math.max(d,n.y+26);});
    if(!N.length){a=0;b=W;c=0;d=H;}
    var w=Math.max(W,b-a+40),h=Math.max(H,d-c+40);if(h/w<H/W)h=w*H/W;else w=h*W/H;
    return {x:(a+b)/2-w/2,y:(c+d)/2-h/2,w:w,h:h};})();
  var sig=[W,H,FIT.x,FIT.y,FIT.w].map(Math.round).join(',');
  if(!opt.local&&(!WEB_VB||WEB_VB.sig!==sig)) WEB_VB={x:FIT.x,y:FIT.y,w:FIT.w,h:FIT.h,sig:sig};
  var vb=opt.local?{x:FIT.x,y:FIT.y,w:FIT.w,h:FIT.h}:WEB_VB;
  var s='<svg viewBox="'+vb.x.toFixed(1)+' '+vb.y.toFixed(1)+' '+vb.w.toFixed(1)+' '+vb.h.toFixed(1)+'">'+defs;
  var pairN={};edges.forEach(function(e){var k=[e.a.id,e.b.id].sort().join('~');e.k=pairN[k]=(pairN[k]||0)+1;e.flip=e.a.id>e.b.id;});
  edges.forEach(function(e,i){s+='<path class="edge'+(e.dim?' dim':'')+(pathE.indexOf(e)>-1?' path':'')+'" fill="none" data-e="'+i+'" stroke="'+REL_TYPES[e.type][1]+'" stroke-width="2.2"'+(dir[e.type]?' marker-end="url(#ar-'+e.type+')"':'')+
    (e.type==='touch'?' stroke-dasharray="5 5"':e.gm?' stroke-dasharray="2 4"':e.type==='link'?' stroke-dasharray="1 5" stroke-linecap="round"':'')+'><title>'+esc((e.gm?'[для мастера] ':'')+REL_TYPES[e.type][0]+(e.note?': '+e.note:''))+'</title></path>';});
  /* широкая невидимая полоса поверх каждой линии — чтобы в неё можно было попасть пальцем */
  edges.forEach(function(e,i){s+='<path class="ehit" fill="none" stroke="transparent" stroke-width="18" data-e="'+i+'"/>';});
  N.forEach(function(n,i){var me=n===opt.center,c=ncol(n);s+='<g class="node'+(me?' me':'')+(pathN.indexOf(n)>-1?' path':'')+'" data-n="'+i+'">'+(me?'<circle r="24" fill="none" stroke="'+c+'" stroke-opacity=".5" stroke-width="2"/>':'')+shape(n,me,c)+
    '<text y="-18" text-anchor="middle">'+esc(n.name)+'</text></g>';});
  var zoomHtml='<div class="zoomctl"><button type="button" data-zoom="in" title="Приблизить" aria-label="Приблизить">+</button>'+
    '<button type="button" data-zoom="out" title="Отдалить" aria-label="Отдалить">−</button>'+
    '<button type="button" data-zoom="reset" class="rst" title="Показать весь граф" aria-label="Показать весь граф">1:1</button></div>';
  box.innerHTML=s+'</svg>'+zoomHtml;
  (function(){var key=[],seen={};function add(k,h){if(!seen[k]){seen[k]=1;key.push(h);}}
    var dot=function(c){return '<i class="k-dot" style="background:'+c+'"></i>';},dia=function(c){return '<i class="k-dia" style="background:'+c+'"></i>';};
    N.forEach(function(n){var c=ncol(n);
      if(isNote(n)){var ct=ncat(n);add('n'+(ct?ct.id:''),dia(c)+esc(ct?ct.name:'Заметка'));}
      else if(isGhost(n))add('g','<i class="k-ghost"></i>Заметки пока нет');
      else if(WEB_COLOR==='clan')add('c'+n.clan,dot(c)+esc(n.clan||'Без клана'));
      else add('k'+n.kind,dot(c)+(n.kind==='pc'?'Котерия':'Личность'));});
    var old=box.nextElementSibling;if(old&&old.classList.contains('web-key'))old.remove();
    var d=document.createElement('div');d.className='web-key';d.innerHTML=key.map(function(h){return '<span>'+h+'</span>';}).join('');
    box.parentNode.insertBefore(d,box.nextSibling);})();
  var svg=box.querySelector('svg'),lines=svg.querySelectorAll('.edge'),hits=svg.querySelectorAll('.ehit'),gs=svg.querySelectorAll('.node');
  var info=opt.info||null,dirT={bond:1,debt:1,sire:1,serve:1,touch:1};
  function showEdge(e){if(!info)return;var T=REL_TYPES[e.type],h='<b style="color:'+T[1]+'">'+esc(T[0])+'</b> · '+nameLink(e.a.name)+(dirT[e.type]?' → ':' — ')+nameLink(e.b.name)+(e.gm?' '+gmBadge():'');
    if(e.type==='link')h+='<div class="wi-l">Упомянуто в блоке «Связи» или связано принадлежностью. Подробности — в самих заметках.</div>';
    if(e.note)h+='<div class="wi-l"><i>'+esc(e.a.name)+':</i> '+inl(e.note)+'</div>';
    if(e.noteB)h+='<div class="wi-l"><i>'+esc(e.b.name)+':</i> '+inl(e.noteB)+'</div>';
    info.innerHTML=h;info.classList.add('on');
    /* выбранная связь остаётся яркой вместе со своими двумя узлами, остальное гаснет */
    box.classList.add('hassel');
    [].forEach.call(lines,function(l,i){l.classList.toggle('sel',edges[i]===e);});
    [].forEach.call(gs,function(g,i){g.classList.toggle('seln',N[i]===e.a||N[i]===e.b);});}
  function clearSel(){box.classList.remove('hassel');
    [].forEach.call(lines,function(l){l.classList.remove('sel');});[].forEach.call(gs,function(g){g.classList.remove('seln');});
    if(info)info.classList.remove('on');}
  /* Раскладка стрелок (v1.52): после того как узлы встали (или при перетаскивании)
     стрелки проверяют себя. 1) Две стрелки РАЗНЫХ пар, лежащие почти на одной
     прямой и перекрывающиеся по длине (угол < ~10°, расстояние < 18px, общий
     отрезок ≥ 24px), разводятся изгибом в противоположные стороны — параллельно
     одна стрелка не закроет другую. Пересечение под углом допустимо и не
     трогается. 2) Стрелка, проходящая вплотную к чужому узлу, огибает его.
     Параллельные связи одной пары разводятся, как и раньше, по номеру k. */
  function pairKey(e){return e.a.id<e.b.id?e.a.id+'~'+e.b.id:e.b.id+'~'+e.a.id;}
  function layoutBends(){
    var off=edges.map(function(e){return e.k===1?0:(e.k%2?1:-1)*Math.ceil((e.k-1)/2)*34*(e.flip?-1:1);}),M=30,EPS=.17;
    for(var i=0;i<edges.length;i++)for(var j=i+1;j<edges.length;j++){
      var A=edges[i],B=edges[j];if(pairKey(A)===pairKey(B))continue;
      var ax=A.b.x-A.a.x,ay=A.b.y-A.a.y,La=Math.sqrt(ax*ax+ay*ay)||1,bx=B.b.x-B.a.x,by=B.b.y-B.a.y,Lb=Math.sqrt(bx*bx+by*by)||1;
      if(Math.abs(ax*by-ay*bx)/(La*Lb)>EPS)continue;
      var d1=(ax*(B.a.y-A.a.y)-ay*(B.a.x-A.a.x))/La,d2=(ax*(B.b.y-A.a.y)-ay*(B.b.x-A.a.x))/La;
      if(Math.abs(d1)>18||Math.abs(d2)>18)continue;
      var t1=((B.a.x-A.a.x)*ax+(B.a.y-A.a.y)*ay)/La,t2=((B.b.x-A.a.x)*ax+(B.b.y-A.a.y)*ay)/La;
      if(Math.min(La,Math.max(t1,t2))-Math.max(0,Math.min(t1,t2))<24)continue;
      var side=(d1+d2)/2,s=Math.abs(side)<1?1:(side>0?1:-1),same_dir=(ax*bx+ay*by)>0?1:-1;
      off[i]-=M*s;off[j]+=M*s*same_dir;
    }
    edges.forEach(function(e,i){
      var dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,L2=dx*dx+dy*dy||1,L=Math.sqrt(L2);
      N.forEach(function(n){if(n===e.a||n===e.b)return;
        var t=((n.x-e.a.x)*dx+(n.y-e.a.y)*dy)/L2;if(t<.04||t>.96)return;
        var dv=(dx*(n.y-e.a.y)-dy*(n.x-e.a.x))/L;if(Math.abs(dv)<22)off[i]+=(dv>0?-1:1)*34;});
    });
    return off.map(function(v){return Math.max(-110,Math.min(110,v));});
  }
  function place(){var bend=layoutBends();edges.forEach(function(e,i){var dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,L=Math.sqrt(dx*dx+dy*dy)||1,off=bend[i],
      cx=(e.a.x+e.b.x)/2-dy/L*off,cy=(e.a.y+e.b.y)/2+dx/L*off;
    var d='M'+e.a.x.toFixed(1)+' '+e.a.y.toFixed(1)+'Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+e.b.x.toFixed(1)+' '+e.b.y.toFixed(1);
    lines[i].setAttribute('d',d);hits[i].setAttribute('d',d);});
    N.forEach(function(n,i){gs[i].setAttribute('transform','translate('+n.x.toFixed(1)+','+n.y.toFixed(1)+')');});}
  if(!opt.local)WEB_DBG={N:N,edges:edges,place:place};
  place();
  function pt(ev){var p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
  /* Масштаб/панорама: viewBox — «камера» над сценой; предел отдаления — рамка FIT,
     позиции узлов и путей не трогает. zoomAt держит точку (px,py) на месте
     под курсором/центром при изменении масштаба (как в картах). */
  function applyVB(){svg.setAttribute('viewBox',vb.x.toFixed(1)+' '+vb.y.toFixed(1)+' '+vb.w.toFixed(1)+' '+vb.h.toFixed(1));}
  var PAD=60;
  function clampVB(){var fx1=FIT.x+FIT.w,fy1=FIT.y+FIT.h;
    vb.x=vb.w>=FIT.w?FIT.x:Math.max(FIT.x-PAD,Math.min(fx1-vb.w+PAD,vb.x));
    vb.y=vb.h>=FIT.h?FIT.y:Math.max(FIT.y-PAD,Math.min(fy1-vb.h+PAD,vb.y));}
  function zoomAt(px,py,f){
    var nw=Math.max(140,Math.min(FIT.w,vb.w*f)),nh=nw*(H/W);
    var nx=px-(px-vb.x)*(nw/vb.w),ny=py-(py-vb.y)*(nh/vb.h);
    vb.w=nw;vb.h=nh;vb.x=nx;vb.y=ny;clampVB();
  }
  [].forEach.call(box.querySelectorAll('[data-zoom]'),function(b){b.addEventListener('click',function(ev){
    ev.preventDefault();var k=b.getAttribute('data-zoom');
    if(k==='reset'){vb.x=FIT.x;vb.y=FIT.y;vb.w=FIT.w;vb.h=FIT.h;}
    else zoomAt(vb.x+vb.w/2,vb.y+vb.h/2,k==='in'?1/1.4:1.4);
    applyVB();});});
  if(!opt.local)svg.addEventListener('wheel',function(ev){ev.preventDefault();var p=pt(ev);zoomAt(p.x,p.y,ev.deltaY<0?1/1.15:1.15);applyVB();},{passive:false});
  /* v1.79 — нажатие отличаем от перетаскивания по сдвигу: палец на экране
     всегда чуть дрожит, и раньше любое дрожание считалось перетаскиванием —
     на телефоне узел не открывал заметку. Порог — 8 пикселей. */
  var drag=null,moved=false,pan=null,tapE=null,down=null;
  function far(ev){return down&&(Math.abs(ev.clientX-down.x)>8||Math.abs(ev.clientY-down.y)>8);}
  function openNode(n){
    if(n===opt.center)return;
    if(n.href){location.hash=n.href;return;}
    if(info){info.innerHTML='<b>'+esc(n.name)+'</b><div class="wi-l">Своей заметки у этой записи пока нет.</div>';info.classList.add('on');}}
  svg.addEventListener('pointerdown',function(ev){var g=ev.target.closest('.node');
    down={x:ev.clientX,y:ev.clientY};
    var eh=ev.target.closest('.ehit');tapE=eh?edges[+eh.getAttribute('data-e')]:null;
    if(g){drag=N[+g.getAttribute('data-n')];moved=false;svg.setPointerCapture(ev.pointerId);return;}
    pan={cx:ev.clientX,cy:ev.clientY,vx:vb.x,vy:vb.y};moved=false;svg.setPointerCapture(ev.pointerId);});
  svg.addEventListener('pointermove',function(ev){
    if(drag){if(!moved&&!far(ev))return;var p=pt(ev);drag.x=p.x;drag.y=p.y;moved=true;place();return;}
    if(pan){var rect=svg.getBoundingClientRect(),sx=vb.w/rect.width,sy=vb.h/rect.height,
        dx=(ev.clientX-pan.cx)*sx,dy=(ev.clientY-pan.cy)*sy,pad=60;
      if(!moved&&!far(ev))return;moved=true;
      vb.x=pan.vx-dx;vb.y=pan.vy-dy;clampVB();
      applyVB();return;}
    var g=ev.target.closest('.node');box.classList.toggle('hl',!!g);
    if(g){var n=N[+g.getAttribute('data-n')];[].forEach.call(gs,function(x,i){x.classList.toggle('on',N[i]===n||edges.some(function(e){return (e.a===n&&e.b===N[i])||(e.b===n&&e.a===N[i]);}));});
      [].forEach.call(lines,function(l,i){l.classList.toggle('on',edges[i].a===n||edges[i].b===n);});}});
  svg.addEventListener('pointerup',function(ev){var d0=drag;drag=null;pan=null;down=null;
    if(d0&&!moved){openNode(d0);return;}
    if(!d0&&!moved){if(tapE)showEdge(tapE);else if(box.classList.contains('hassel'))clearSel();}tapE=null;});
  /* на телефоне браузер может забрать жест под прокрутку (pointercancel) —
     тогда считаем это нажатием, если палец почти не сдвинулся */
  svg.addEventListener('pointercancel',function(){drag=null;pan=null;down=null;tapE=null;});
  svg.addEventListener('click',function(ev){var g=ev.target.closest('.node');
    if(g&&!moved){var n=N[+g.getAttribute('data-n')];if(n&&location.hash!==n.href)openNode(n);}});
  svg.addEventListener('pointerleave',function(){box.classList.remove('hl');});
}

/* ================= ГРАФ ЗАМЕТКИ (v1.77) =================
   Малый граф внизу каждой заметки: сама заметка в центре и всё, с чем она
   связана. Рёбра: типизированные связи из общего графа (RELATIONS, узы,
   долги, сиры, Якоря), ссылки [[…]] из блока «Связи» (пунктир, тип link),
   для кланов и сект — их члены. Связи соседей между собой показаны бледно. */
function localGraph(x,ring2){
  var G=graphData(),key=hrefOf(x.name)||x.name,nodes={},list=[],edges=[];
  function add(n){var k=hrefOf(n)||n;if(!nodes[k]){var o=null;G.nodes.forEach(function(q){if(q.id===k)o=q;});
      if(!o)o=G.node(n);
      nodes[k]={id:k,name:o.name,href:o.href,kind:o.kind,clan:o.clan,sect:o.sect};list.push(nodes[k]);}return nodes[k];}
  var me=add(x.name);
  G.edges.forEach(function(e){if(e.a.id===key||e.b.id===key)edges.push({a:add(e.a.name),b:add(e.b.name),type:e.type,note:e.note,noteB:e.noteB,gm:e.gm});});
  function linked(n){return edges.some(function(e){return (e.a===me&&e.b.id===(hrefOf(n)||n))||(e.b===me&&e.a.id===(hrefOf(n)||n));});}
  (x.ties||[]).filter(gmOk).forEach(function(t){var txt=typeof t==='string'?t:(t.text||''),m,re=/\[\[([^\]|]+)/g;
    while((m=re.exec(txt))){var n=m[1].trim();if(same(n,x.name)||linked(n))continue;edges.push({a:me,b:add(n),type:'link',note:'',gm:typeof t!=='string'&&t.gm});}});
  ['clan','sect'].forEach(function(f){allPeople().forEach(function(p){if(same(p[f],x.name)&&!linked(p.name))edges.push({a:add(p.name),b:me,type:'link',note:''});});});
  var first=list.slice();
  /* второй круг: связи соседей с теми, кого в графе ещё нет */
  if(ring2)G.edges.forEach(function(e){if(e.a.id===key||e.b.id===key)return;
    var ia=first.some(function(n){return n.id===e.a.id;}),ib=first.some(function(n){return n.id===e.b.id;});
    if(ia!==ib)edges.push({a:add(e.a.name),b:add(e.b.name),type:e.type,note:e.note,noteB:e.noteB,gm:e.gm,dim:true,far:true});});
  G.edges.forEach(function(e){if(e.a.id===key||e.b.id===key)return;
    if(first.some(function(n){return n.id===e.a.id;})&&first.some(function(n){return n.id===e.b.id;}))edges.push({a:nodes[e.a.id],b:nodes[e.b.id],type:e.type,note:e.note,noteB:e.noteB,gm:e.gm,dim:true});});
  return {nodes:list,edges:edges,me:me};
}
var LOCAL_WEB_SEQ=0,LOCAL_WEB={};
function localWebRender(id){
  var st=LOCAL_WEB[id],wrap=document.getElementById(id);if(!st||!wrap)return;
  var L=localGraph(st.x,st.ring2),used={};L.edges.forEach(function(e){if(!e.dim)used[e.type]=1;});
  var edges=L.edges.filter(function(e){return !st.off[e.type];});
  /* узлы, потерявшие все связи после выключения слоя, убираем — кроме самой заметки */
  var nodes=L.nodes.filter(function(n){return n===L.me||edges.some(function(e){return e.a===n||e.b===n;});});
  wrap.innerHTML='<div class="filt lweb-legend">'+Object.keys(REL_TYPES).filter(function(k){return used[k];}).map(function(k){
      return '<button type="button" class="mini'+(st.off[k]?' off':'')+'" data-lf="'+k+'"><i style="background:'+REL_TYPES[k][1]+'"></i>'+REL_TYPES[k][0]+'</button>';}).join('')+
    '<span class="filt-l">слои</span><button type="button" class="mini'+(st.ring2?'':' off')+'" data-lr="1">Второй круг</button></div>'+
    '<div class="web local"></div><div class="web-info"></div>';
  drawWeb({nodes:nodes,edges:edges},{box:wrap.querySelector('.web'),local:true,center:L.me,info:wrap.querySelector('.web-info')});
  [].forEach.call(wrap.querySelectorAll('[data-lf]'),function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-lf');st.off[k]=!st.off[k];localWebRender(id);});});
  wrap.querySelector('[data-lr]').addEventListener('click',function(){st.ring2=!st.ring2;localWebRender(id);});
}
function localWebHtml(x){
  var L=localGraph(x,false);if(L.nodes.length<2)return '';
  var id='lweb'+(++LOCAL_WEB_SEQ);LOCAL_WEB={};LOCAL_WEB[id]={x:x,off:{},ring2:false};
  setTimeout(function(){localWebRender(id);},0);
  return section('Граф связей',(L.nodes.length-1)+' '+plural(L.nodes.length-1,'заметка','заметки','заметок'),'<div id="'+id+'"></div>'+
    '<p class="hint">В центре эта заметка. Нажмите на узел, чтобы открыть его заметку, на линию — чтобы прочитать, что это за связь. Кнопки над графом включают и выключают слои. Весь город — в инструменте «<a href="#/tool/web">Связи и узы</a>».</p>');
}

/* ================= РОДОСЛОВНАЯ ================= */
function viewLineage(t){
  var ppl=allPeople();
  function kids(n){return ppl.filter(function(p){return same(p.sire,n);});}
  function row(p){return '<a class="lrow" href="'+personHref(p)+'"><span class="nm">'+(p.dead?'☾ ':'')+esc(p.name)+'</span><span class="ds">'+inl(p.short||'')+'</span>'+
    '<span class="meta">'+(p.gen?'<span class="chip hot">'+p.gen+'-е пок.</span>':'<span class="chip" style="opacity:.55" title="Поколение не указано">пок. ?</span>')+(p.clan?'<span class="chip">'+esc(p.clan)+'</span>':'')+'</span></a>';}
  function branch(p){var k=kids(p.name);return '<li>'+row(p)+(k.length?'<ul>'+k.map(branch).join('')+'</ul>':'')+'</li>';}
  var roots=ppl.filter(function(p){return !p.sire||!ppl.some(function(q){return same(q.name,p.sire);});});
  var ghostSires={},html='';
  roots.forEach(function(p){if(p.sire){(ghostSires[p.sire]=ghostSires[p.sire]||[]).push(p);}});
  var linked=roots.filter(function(p){return !p.sire&&(kids(p.name).length);});
  var loose=roots.filter(function(p){return !p.sire&&!kids(p.name).length;});
  linked.forEach(function(p){html+=branch(p);});
  Object.keys(ghostSires).forEach(function(s){var gm=(typeof GHOST_META!=='undefined'&&GHOST_META[s])||{};html+='<li><div class="lrow ghost"><span class="nm">'+esc(s)+'</span><span class="ds">сир без заметки</span><span class="meta">'+(gm.gen?'<span class="chip hot">'+gm.gen+'-е пок.</span>':'<span class="chip" style="opacity:.55">пок. ?</span>')+(gm.clan?'<span class="chip">'+esc(gm.clan)+'</span>':'')+'</span></div><ul>'+ghostSires[s].map(branch).join('')+'</ul></li>';});
  var inner=html?'<ul class="ltree">'+html+'</ul>':emptyBox('Родословных пока нет','Когда станут известны сиры, здесь вырастет древо. Сиры без заметки — пунктиром.');
  inner='<div class="panel" style="margin-bottom:22px"><h4>Как считаются поколения</h4>'+md('Поколение — число сиров между вампиром и Каином (сам Каин — нулевое), так что потомок всегда на одно поколение дальше сира. Самое младшее поколение, существующее во всех кланах, — 13-е; всё, что дальше, — тонкокровные, которых считают отдельным кланом.')+'</div>'+inner;
  if(loose.length) inner+=section('Без известного сира',loose.length,'<div class="subgrid">'+loose.map(personSub).join('')+'</div>');
  toolShell(t,'Кровь помнит, откуда пришла. Древо собирается из поля sire: у каждого — поколение и клан. «пок. ?» — поколение ещё не вписано (поле gen).',inner);
}

/* ================= МАСКАРАД ================= */
function masqEvents(){var out=[];SESSIONS.forEach(function(s){s.items.forEach(function(it){if(it&&it.masq)out.push({n:s.n,d:+it.masq,t:it.t});});});return out;}
function masqLive(){return +STORE.get('masqLive',0)||0;}
function masqNow(){var v=+MASQ.base||0;masqEvents().forEach(function(e){v+=e.d;});return Math.max(0,Math.min(10,v+masqLive()));}
function masqLevel(v){var L=MASQ.levels[0];MASQ.levels.forEach(function(l){if(v>=l[0])L=l;});return L;}
function masqGauge(v,sm){var s='<div class="gauge'+(sm?' sm':'')+'">';for(var i=1;i<=10;i++){var L=masqLevel(i);s+='<i class="'+(i<=v?'on':'')+'" style="--c:'+L[3]+'"></i>';}return s+'</div>';}
function viewMasq(t){
  var v=masqNow(),L=masqLevel(v),ev=masqEvents(),live=masqLive();
  var inner='<div class="panel" style="--c:'+L[3]+'"><div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap">'+
      '<div class="bignum">'+v+'</div><div style="flex:1;min-width:240px"><div class="eyebrow">текущий уровень</div><h3 style="font-size:40px;color:'+L[3]+'">'+esc(L[1])+'</h3><p style="color:var(--ink-dim);margin:4px 0 0">'+esc(L[2])+'</p></div></div>'+
      masqGauge(v)+'<div class="glabels">'+[1,2,3,4,5,6,7,8,9,10].map(function(i){return '<span>'+i+'</span>';}).join('')+'</div>'+
      '<div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px"><button class="mini" data-mq="-1">− 1</button><button class="mini pri" data-mq="1">+ 1 нарушение</button>'+
      '<button class="mini" data-mq="0">сбросить правки вечера</button><span class="tsub" style="align-self:center">'+(live?'правка за вечер: '+(live>0?'+':'')+live:'правки за вечер нет')+'</span></div></div>'+
    '<div class="lvl-list">'+MASQ.levels.map(function(l){return '<div class="lvl'+(l===L?' cur':'')+'" style="--c:'+l[3]+'"><b>от '+l[0]+'</b><h4>'+esc(l[1])+'</h4><p>'+esc(l[2])+'</p></div>';}).join('')+'</div>'+
    section('Нарушения и слухи',ev.length,ev.length?'<ul class="tl">'+ev.map(function(e){return '<li><b>Сессия '+e.n+' · '+(e.d>0?'+':'')+e.d+'</b>'+md(e.t)+'</li>';}).join('')+'</ul>'
      :emptyBox('Маскарад пока цел','Нарушения и слухи из журнала сессий появятся здесь.'));
  toolShell(t,'Насколько близко смертные подобрались к правде. Шкала складывается из нарушений в журнале сессий и правок за текущий вечер.',inner);
  [].forEach.call(app.querySelectorAll('[data-mq]'),function(b){b.addEventListener('click',function(){var d=+b.getAttribute('data-mq');
    STORE.set('masqLive',d===0?0:masqLive()+d);viewMasq(t);renderSession();});});
}

/* ================= ХРОНИКА НОЧЕЙ ================= */
function viewChron(t){
  var nights=CHRON.filter(function(c){return c.kind!=='memoriam';}),mem=CHRON.filter(function(c){return c.kind==='memoriam';});
  function li(c){return '<li><b>'+esc(c.when||'')+'</b>'+(c.title?'<h5>'+esc(c.title)+'</h5>':'')+md(c.text||'')+'</li>';}
  var inner='<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:34px">'+
    '<div>'+secHead('Ночи хроники',nights.length,'h3')+(nights.length?'<ul class="tl">'+nights.map(li).join('')+'</ul>':emptyBox('Ночей пока нет','Ночи хроники появятся здесь по порядку.'))+'</div>'+
    '<div>'+secHead('Мемориамы',mem.length,'h3')+(mem.length?'<ul class="tl mem">'+mem.map(li).join('')+'</ul>':emptyBox('Прошлое молчит','Сыгранные флешбеки в прошлое персонажей появятся здесь.'))+'</div></div>';
  toolShell(t,'Две линии времени: ночи самой хроники и мемориамы — сыгранные эпизоды из прошлого персонажей.',inner);
}

/* ================= МОЩЬ КРОВИ ================= */
var BP_SEL=1;
function viewBP(t){
  var head=['Ур.','Всплеск','Восстановление','Бонус к силе','Переброс пробуждения','Суровость проклятия','Штраф к кормлению'];
  var pcs=PCS.filter(function(x){return x.bp!=null;});
  var sel='<div class="tabs">'+BP_TABLE.map(function(r){return '<button class="mini'+(r[0]===BP_SEL?' on':'')+'" data-bp="'+r[0]+'">'+r[0]+'</button>';}).join('')+
    pcs.map(function(x){return '<button class="mini" data-bp="'+x.bp+'" title="Мощь крови персонажа">'+esc(x.name)+' · '+x.bp+'</button>';}).join('')+'</div>';
  var r=BP_TABLE[BP_SEL];
  var cards=defsHtml(head.slice(1).map(function(h,i){return [h,r[i+1]];}));
  var tbl='<div class="tbl-wrap"><table class="tbl"><thead><tr>'+head.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr></thead><tbody>'+
    BP_TABLE.map(function(x){return '<tr'+(x[0]===BP_SEL?' class="hit"':'')+'>'+x.map(function(c,i){return '<td'+(i===0?' class="n"':'')+'>'+esc(c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
  toolShell(t,'Густота крови с возрастом. Выберите уровень, чтобы увидеть всё, что он даёт и чего требует. Переброс пробуждения — право перебросить проверку при использовании дисциплин указанного уровня и ниже.',
    sel+section('Уровень '+BP_SEL,'',cards)+section('Вся таблица','0–10',tbl)+'<div class="note"><b>Сверка</b>Таблица по корбуку V5 (Renegade). При спорных случаях сверяйтесь с книгой.</div>');
  [].forEach.call(app.querySelectorAll('[data-bp]'),function(b){b.addEventListener('click',function(){BP_SEL=+b.getAttribute('data-bp');viewBP(t);});});
}

/* ================= РЕЗОНАНС ================= */
var RES_LAST=null;
function rollResonance(){
  var t1=d(10),t2=null,temp;
  if(t1<=5)temp=TEMPERAMENT[0];else if(t1<=8)temp=TEMPERAMENT[1];else{t2=d(10);temp=t2>=9?TEMPERAMENT[3]:TEMPERAMENT[2];}
  var r=d(10),hum=null;RESONANCE.forEach(function(x){if(x.roll&&r>=x.roll[0]&&r<=x.roll[1])hum=x;});
  var dys=temp===TEMPERAMENT[3]&&hum.dys.length?hum.dys[Math.floor(Math.random()*hum.dys.length)]:null;
  RES_LAST={t1:t1,t2:t2,temp:temp,r:r,hum:hum,dys:dys};
  pushLog('Резонанс','темп. ['+t1+(t2?'/'+t2:'')+'] · тип ['+r+']',temp===TEMPERAMENT[0]?'нет':temp[1]+' '+hum.name,'');
}
function viewResonance(t){
  var R0=RES_LAST,res='';
  if(R0){var none=R0.temp===TEMPERAMENT[0];
    res='<div class="panel" style="margin-bottom:20px"><div class="eyebrow">результат · темперамент к10: '+R0.t1+(R0.t2?' → '+R0.t2:'')+' · тип к10: '+R0.r+'</div>'+
      '<h3 style="font-size:40px;margin:8px 0">'+(none?'Без резонанса':esc(R0.temp[1])+' · '+esc(R0.hum.name))+'</h3>'+
      '<p style="color:var(--ink-dim)">'+esc(R0.temp[2])+'</p>'+
      (none?'':'<p>Дисциплины: <b>'+R0.hum.disc.map(esc).join(', ')+'</b>. Эмоции жертвы: '+esc(R0.hum.mood)+'.</p>')+
      (R0.dys?'<div class="note"><b>Дискразия</b>'+esc(R0.dys)+' — точный эффект задаёт рассказчик.</div>':'')+'</div>';}
  var temp=tableHtml({cap:'Темперамент — к10',head:['к10','Темперамент','Эффект'],rows:TEMPERAMENT.map(function(x){return [x[0]?x[0][0]+'–'+x[0][1]:'9–10 на втором к10',x[1],x[2]];})});
  var hum=tableHtml({cap:'Тип резонанса — к10',head:['к10','Резонанс','Дисциплины','Эмоции','Дискразии'],rows:RESONANCE.map(function(x){
    return [x.roll?x.roll[0]+'–'+x.roll[1]:'—',x.name,x.disc.join(', '),x.mood,x.dys.join(', ')||'—'];})});
  toolShell(t,'Кровь несёт эмоцию жертвы. Бросьте резонанс при кормлении: темперамент решает, есть ли эффект, тип — какие дисциплины он усиливает.',
    '<div class="tabs"><button class="mini pri" id="resRoll">Бросить резонанс</button></div>'+res+temp+hum);
  document.getElementById('resRoll').addEventListener('click',function(){rollResonance();viewResonance(t);});
}

/* ================= ОДЕРЖИМОСТИ ================= */
var COMP_LAST=null,COMP_CLAN='';
function viewCompulsions(t){
  var gen=COMPULSIONS.general,hit=null;
  if(COMP_LAST){gen.forEach(function(g){if(COMP_LAST>=g.roll[0]&&COMP_LAST<=g.roll[1])hit=g;});}
  var clanOpts='<option value="">— клан персонажа —</option>'+COMPULSIONS.clan.map(function(c){return '<option'+(c[0]===COMP_CLAN?' selected':'')+'>'+esc(c[0])+'</option>';}).join('');
  var res='';
  if(hit){var cl=null;if(hit.roll[0]===10&&COMP_CLAN)COMPULSIONS.clan.forEach(function(c){if(c[0]===COMP_CLAN)cl=c;});
    res='<div class="panel" style="margin-bottom:20px"><div class="eyebrow">к10: '+COMP_LAST+'</div><h3 style="font-size:40px;margin:8px 0">'+esc(cl?cl[1]:hit.name)+'</h3>'+
      '<p>'+esc(cl?cl[2]:hit.text)+'</p><p style="color:var(--ink-dim);margin:0">Заканчивается: '+esc(cl?cl[3]:hit.end)+'.</p></div>';}
  var gT='<div class="tbl-wrap"><table class="tbl"><caption>Общие одержимости — к10</caption><thead><tr><th>к10</th><th>Одержимость</th><th>Штраф</th><th>Конец</th></tr></thead><tbody>'+
    gen.map(function(g){return '<tr'+(g===hit?' class="hit"':'')+'><td class="n">'+g.roll[0]+(g.roll[1]!==g.roll[0]?'–'+g.roll[1]:'')+'</td><td>'+esc(g.name)+'</td><td>'+esc(g.text)+'</td><td>'+esc(g.end)+'</td></tr>';}).join('')+'</tbody></table></div>';
  var cT='<div class="tbl-wrap" style="margin-top:22px"><table class="tbl"><caption>Клановые одержимости</caption><thead><tr><th>Клан</th><th>Одержимость</th><th>Штраф</th><th>Конец</th></tr></thead><tbody>'+
    COMPULSIONS.clan.map(function(c){return '<tr'+(c[0]===COMP_CLAN&&hit&&hit.roll[0]===10?' class="hit"':'')+'><td>'+wikiTag(c[0],esc(c[0]))+'</td><td>'+esc(c[1])+'</td><td>'+esc(c[2])+'</td><td>'+esc(c[3])+'</td></tr>';}).join('')+'</tbody></table></div>';
  toolShell(t,'Когда Зверь берёт своё — после звериного провала, грязного крита или по решению рассказчика — персонаж получает одержимость. Бросьте к10 по общей таблице; на 10 срабатывает клановая.',
    '<div class="tabs"><select id="compClan">'+clanOpts+'</select><button class="mini pri" id="compRoll">Бросить одержимость</button></div>'+res+gT+cT);
  document.getElementById('compClan').addEventListener('change',function(e){COMP_CLAN=e.target.value;viewCompulsions(t);});
  document.getElementById('compRoll').addEventListener('click',function(){COMP_LAST=d(10);var h=null;gen.forEach(function(g){if(COMP_LAST>=g.roll[0]&&COMP_LAST<=g.roll[1])h=g;});
    pushLog('Одержимость','[к10 '+COMP_LAST+']',h.roll[0]===10&&COMP_CLAN?COMP_CLAN:h.name,'no');viewCompulsions(t);});
}
var TOOL_VIEWS={bp:viewBP,resonance:viewResonance,compulsions:viewCompulsions,court:viewCourt,boons:viewBoons,web:viewWeb,lineage:viewLineage,masq:viewMasq,chron:viewChron};
