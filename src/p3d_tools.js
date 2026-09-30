
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
    nodes[k]={id:k,name:n,href:hrefOf(n),kind:pc?'pc':pe?'person':'other'};list.push(nodes[k]);}return nodes[k];}
  function edge(a,b,type,note,gm){if(!a||!b)return;edges.push({a:node(a),b:node(b),type:REL_TYPES[type]?type:'other',note:note||'',gm:!!gm});}
  /* gm-рёбра (с v1.42, §1.3.4) — только при виде «Мастер» */
  /* одна пара и тот же тип — одно ребро (v1.52): тайная часть дописывается
     к открытой заметке ребра, а не рисуется поверх второй линией */
  RELATIONS.filter(gmOk).forEach(function(r){
    if(r.gm){var t=REL_TYPES[r.type]?r.type:'other',host=null;
      edges.forEach(function(e){if(!host&&!e.gm&&e.type===t&&((e.a===node(r.a)&&e.b===node(r.b))||(e.a===node(r.b)&&e.b===node(r.a))))host=e;});
      if(host){host.note=(host.note?host.note+' · ':'')+'[для мастера] '+(r.note||'');return;}}
    edge(r.a,r.b,r.type,r.note,r.gm);});
  BONDS.filter(gmOk).forEach(function(b){edge(b.thrall,b.regnant,'bond','ступень '+b.level+(b.note?' · '+b.note:''));});
  BOONS.filter(gmOk).filter(function(b){return b.status==='open'||!b.status;}).forEach(function(b){edge(b.debtor,b.creditor,'debt',(BOON_LEVELS[b.level]||['долг'])[0]+' долг');});
  allPeople().forEach(function(p){if(p.sire)edge(p.sire,p.name,'sire','');});
  PCS.forEach(function(p){(p.convictions||[]).forEach(function(c){if(c[1])edge(p.name,c[1],'touch',c[0]);});});
  return {nodes:list,edges:edges};
}
var WEB_OFF={};
var WEB_DBG=null; /* для тестов: последние узлы/рёбра графа и place() */
var WEB_VB=null; /* {x,y,w,h} — текущая видимая область графа (масштаб/панорама),
  в координатах симуляции 0..1000 × 0..640; null = сброшена, вид «по размеру».
  Сохраняется между перерисовками (переключение фильтров), чтобы масштаб не
  сбрасывался при клике по фильтру типа связи. */
function viewWeb(t){
  var G=graphData();
  var filt='<div class="filt">'+Object.keys(REL_TYPES).map(function(k){var n=G.edges.filter(function(e){return e.type===k;}).length;
    return '<button class="mini'+(WEB_OFF[k]?' off':'')+'" data-f="'+k+'"><i style="background:'+REL_TYPES[k][1]+'"></i>'+REL_TYPES[k][0]+' '+n+'</button>';}).join('')+'</div>';
  var VB=BONDS.filter(gmOk);
  var bonds=VB.length?tableHtml({head:['Раб уз','Регнант','Ступень','Заметка'],rows:VB.map(function(b){return ['[['+b.thrall+']]','[['+b.regnant+']]','•'.repeat(b.level||1),b.note||''];})}).replace(/<td>(•+)<\/td>/g,function(_,v){return '<td>'+dots(v.length,3)+'</td>';})
    :emptyBox('Кровных уз пока нет','Ничья кровь ещё никого не держит.');
  var inner=(canGm()?'<div class="gmrow">'+gmToggleHtml()+'</div>':'')+(G.nodes.length?filt+'<div class="web" id="web"></div><p class="hint">Тяните узлы мышью. Наведите — подсветятся связи. Клик — открыть заметку. Колесо мыши или кнопки в углу — масштаб; перетаскивание фона — панорама.</p>'
      :emptyBox('Граф пуст','Отношения, кровные узы, долги, сиры и Якоря персонажей сложатся здесь в сеть.'))+
    section('Кровные узы',VB.length,bonds+'<div class="note"><b>Ступени</b>Первый глоток — симпатия. Второй — сильная привязанность. Третий — полные узы: регнант становится центром жизни раба. Узы слабеют, если не пить из регнанта долгое время.</div>');
  toolShell(t,'Кто кого любит, кто кому служит и чья кровь держит кого на поводке. Граф собирается из всех данных кодекса.',inner);
  if(G.nodes.length) drawWeb(G);
  [].forEach.call(app.querySelectorAll('[data-f]'),function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-f');WEB_OFF[k]=!WEB_OFF[k];viewWeb(t);});});
}
function drawWeb(G){
  var W=1000,H=640,box=document.getElementById('web');
  var edges=G.edges.filter(function(e){return !WEB_OFF[e.type];});
  var N=G.nodes;N.forEach(function(n,i){var a=i/N.length*Math.PI*2;n.x=W/2+Math.cos(a)*220;n.y=H/2+Math.sin(a)*200;n.vx=0;n.vy=0;});
  for(var it=0;it<420;it++){
    for(var i=0;i<N.length;i++)for(var j=i+1;j<N.length;j++){var a=N[i],b=N[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy+.01,f=9000/d2,dd=Math.sqrt(d2);
      a.vx+=f*dx/dd;a.vy+=f*dy/dd;b.vx-=f*dx/dd;b.vy-=f*dy/dd;}
    edges.forEach(function(e){var dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,dd=Math.sqrt(dx*dx+dy*dy)+.01,f=(dd-190)*.02;
      e.a.vx+=f*dx/dd;e.a.vy+=f*dy/dd;e.b.vx-=f*dx/dd;e.b.vy-=f*dy/dd;});
    N.forEach(function(n){n.vx+=(W/2-n.x)*.004;n.vy+=(H/2-n.y)*.004;n.x+=n.vx*.5;n.y+=n.vy*.5;n.vx*=.6;n.vy*=.6;
      n.x=Math.max(60,Math.min(W-60,n.x));n.y=Math.max(40,Math.min(H-40,n.y));});
  }
  var col={pc:'#E8B04B',person:'#D0243F',other:'#8FB8DE'};
  var defs='<defs>'+Object.keys(REL_TYPES).map(function(k){return '<marker id="ar-'+k+'" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="'+REL_TYPES[k][1]+'"/></marker>';}).join('')+'</defs>';
  var dir={bond:1,debt:1,sire:1,serve:1,touch:1};
  if(!WEB_VB) WEB_VB={x:0,y:0,w:W,h:H};
  var vb=WEB_VB;
  var s='<svg viewBox="'+vb.x.toFixed(1)+' '+vb.y.toFixed(1)+' '+vb.w.toFixed(1)+' '+vb.h.toFixed(1)+'">'+defs;
  var pairN={};edges.forEach(function(e){var k=[e.a.id,e.b.id].sort().join('~');e.k=pairN[k]=(pairN[k]||0)+1;e.flip=e.a.id>e.b.id;});
  edges.forEach(function(e,i){s+='<path class="edge" fill="none" data-e="'+i+'" stroke="'+REL_TYPES[e.type][1]+'" stroke-width="2.2"'+(dir[e.type]?' marker-end="url(#ar-'+e.type+')"':'')+
    (e.type==='touch'?' stroke-dasharray="5 5"':e.gm?' stroke-dasharray="2 4"':'')+'><title>'+esc((e.gm?'[для мастера] ':'')+REL_TYPES[e.type][0]+(e.note?': '+e.note:''))+'</title></path>';});
  N.forEach(function(n,i){s+='<g class="node" data-n="'+i+'"><circle r="'+(n.kind==='other'?9:13)+'" fill="'+col[n.kind]+'" stroke="#000" stroke-width="2"/>'+
    '<text y="-18" text-anchor="middle">'+esc(n.name)+'</text></g>';});
  var zoomHtml='<div class="zoomctl"><button type="button" data-zoom="in" title="Приблизить" aria-label="Приблизить">+</button>'+
    '<button type="button" data-zoom="out" title="Отдалить" aria-label="Отдалить">−</button>'+
    '<button type="button" data-zoom="reset" class="rst" title="Сбросить масштаб" aria-label="Сбросить масштаб">1:1</button></div>';
  box.innerHTML=s+'</svg>'+zoomHtml;
  var svg=box.querySelector('svg'),lines=svg.querySelectorAll('.edge'),gs=svg.querySelectorAll('.node');
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
    lines[i].setAttribute('d','M'+e.a.x.toFixed(1)+' '+e.a.y.toFixed(1)+'Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+e.b.x.toFixed(1)+' '+e.b.y.toFixed(1));});
    N.forEach(function(n,i){gs[i].setAttribute('transform','translate('+n.x.toFixed(1)+','+n.y.toFixed(1)+')');});}
  WEB_DBG={N:N,edges:edges,place:place};
  place();
  function pt(ev){var p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
  /* Масштаб/панорама: viewBox — «камера» над неизменной сценой 1000×640,
     позиции узлов и путей не трогает. zoomAt держит точку (px,py) на месте
     под курсором/центром при изменении масштаба (как в картах). */
  function applyVB(){svg.setAttribute('viewBox',vb.x.toFixed(1)+' '+vb.y.toFixed(1)+' '+vb.w.toFixed(1)+' '+vb.h.toFixed(1));}
  function zoomAt(px,py,f){
    var nw=Math.max(140,Math.min(W,vb.w*f)),nh=nw*(H/W);
    var nx=px-(px-vb.x)*(nw/vb.w),ny=py-(py-vb.y)*(nh/vb.h),pad=60;
    vb.w=nw;vb.h=nh;
    vb.x=Math.max(-pad,Math.min(W-nw+pad,nx));
    vb.y=Math.max(-pad,Math.min(H-nh+pad,ny));
  }
  [].forEach.call(box.querySelectorAll('[data-zoom]'),function(b){b.addEventListener('click',function(ev){
    ev.preventDefault();var k=b.getAttribute('data-zoom');
    if(k==='reset'){vb.x=0;vb.y=0;vb.w=W;vb.h=H;}
    else zoomAt(vb.x+vb.w/2,vb.y+vb.h/2,k==='in'?1/1.4:1.4);
    applyVB();});});
  svg.addEventListener('wheel',function(ev){ev.preventDefault();var p=pt(ev);zoomAt(p.x,p.y,ev.deltaY<0?1/1.15:1.15);applyVB();},{passive:false});
  var drag=null,moved=false,pan=null;
  svg.addEventListener('pointerdown',function(ev){var g=ev.target.closest('.node');
    if(g){drag=N[+g.getAttribute('data-n')];moved=false;svg.setPointerCapture(ev.pointerId);return;}
    pan={cx:ev.clientX,cy:ev.clientY,vx:vb.x,vy:vb.y};moved=false;svg.setPointerCapture(ev.pointerId);});
  svg.addEventListener('pointermove',function(ev){
    if(drag){var p=pt(ev);drag.x=p.x;drag.y=p.y;moved=true;place();return;}
    if(pan){var rect=svg.getBoundingClientRect(),sx=vb.w/rect.width,sy=vb.h/rect.height,
        dx=(ev.clientX-pan.cx)*sx,dy=(ev.clientY-pan.cy)*sy,pad=60;
      if(Math.abs(ev.clientX-pan.cx)>2||Math.abs(ev.clientY-pan.cy)>2)moved=true;
      vb.x=Math.max(-pad,Math.min(W-vb.w+pad,pan.vx-dx));
      vb.y=Math.max(-pad,Math.min(H-vb.h+pad,pan.vy-dy));
      applyVB();return;}
    var g=ev.target.closest('.node');box.classList.toggle('hl',!!g);
    if(g){var n=N[+g.getAttribute('data-n')];[].forEach.call(gs,function(x,i){x.classList.toggle('on',N[i]===n||edges.some(function(e){return (e.a===n&&e.b===N[i])||(e.b===n&&e.a===N[i]);}));});
      [].forEach.call(lines,function(l,i){l.classList.toggle('on',edges[i].a===n||edges[i].b===n);});}});
  svg.addEventListener('pointerup',function(ev){var d0=drag;drag=null;pan=null;if(d0&&!moved&&d0.href)location.hash=d0.href;});
  svg.addEventListener('pointerleave',function(){box.classList.remove('hl');});
}

/* ================= РОДОСЛОВНАЯ ================= */
function viewLineage(t){
  var ppl=allPeople();
  function kids(n){return ppl.filter(function(p){return same(p.sire,n);});}
  function row(p){return '<a class="lrow" href="'+personHref(p)+'"><span class="nm">'+(p.dead?'✝ ':'')+esc(p.name)+'</span><span class="ds">'+inl(p.short||'')+'</span>'+
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
