
function viewEntry(c,id){
  var x=findIn(c.arr,id);
  if(!x){location.hash='#/cat/'+c.id;return;}
  if(c.kind==='cards'&&!c.full){viewCards(c,id);return;}
  setTheme(c.theme,x.acc);
  crumb([[c.name,'#/cat/'+c.id],[x.name]]);
  var eyebrow='запись '+numOf(c.arr,x)+' · '+esc(c.name.toLowerCase());
  var strip=[],mid='',top='';
  if(c.id==='clans'){
    strip=[['Дисциплины',(x.disciplines||[]).map(function(d){return wikiTag(d,esc(d));}).join(' '),1]];
    var pan='';
    if(x.bane) pan+='<div class="panel"><h4>Проклятие</h4>'+md(x.bane)+'</div>';
    if(x.compulsion) pan+='<div class="panel"><h4>Одержимость'+(x.compulsion.name?': '+esc(x.compulsion.name):'')+'</h4>'+md(x.compulsion.text||'')+'</div>';
    if(pan) mid+=section('Кровь клана','',pan);
    var cc=(typeof CLAN_COURT!=='undefined'?CLAN_COURT:[]).filter(function(g){return g.clan===x.name;});
    if(cc.length) mid+=section('Иерархия клана',cc.length+' '+plural(cc.length,'ветвь','ветви','ветвей'),cc.map(function(g){
      return '<div class="u-m22-0-12 sec-head"><h3>'+esc(g.sect)+'</h3>'+(g.note?'<span class="eyebrow">'+inl(g.note)+'</span>':'')+'</div>'+courtHtml(g);}).join(''));
    var mem=membersOf('clan',x);
    mid+=section('В городе',mem.length,mem.length?'<div class="subgrid">'+mem.map(personSub).join('')+'</div>'
      :emptyBox('Никого не записано','Члены клана, известные котерии, появятся здесь.'));
  }
  if(c.id==='disciplines'){
    strip=[['Тип',x.kind],['Резонанс',x.resonance],['Угроза Маскараду',x.threat]];
    var lv={};(x.powers||[]).forEach(function(p){(lv[p.lvl]=lv[p.lvl]||[]).push(p);});
    var inner=Object.keys(lv).sort().map(function(l){
      return '<div class="u-m30-0-12 sec-head"><h3>Уровень '+l+'</h3><span class="eyebrow">'+dots(+l)+'</span></div>'+
        '<div class="grid">'+lv[l].map(function(p){
          var par=[['Цена',p.cost],['Пул',p.pool],['Длительность',p.dur],['Амальгама',p.amalgam]].filter(function(q){return q[1];});
          return '<article class="card"><span class="tag">ур. '+p.lvl+'</span><h4>'+esc(p.name)+'</h4>'+
            (par.length?'<dl class="par">'+par.map(function(q){return '<dt>'+q[0]+'</dt><dd>'+inl(q[1])+'</dd>';}).join('')+'</dl>':'')+
            '<div class="eff">'+md(p.text||'')+'</div></article>';}).join('')+'</div>';}).join('');
    mid+=section('Силы',(x.powers||[]).length,inner||emptyBox('Сил пока нет','Силы появятся здесь, разложенные по уровням.'));
  }
  if(c.id==='predators'){strip=[['Пул охоты',x.pool],['Даёт',(x.gains||[]).length?'<ul class="gains">'+x.gains.map(function(g){var i=g.indexOf(': ');return '<li>'+(i>0?'<b>'+esc(g.slice(0,i))+'</b>'+inl(g.slice(i+2)):inl(g))+'</li>';}).join('')+'</ul>':'',1]];}
  if(c.id==='merits'){strip=[['Вид',x.kind],['Точки',x.dots]];
    if(x.text) mid+=section(/•–|–•/.test(x.dots||'')?'Ступени':'Описание','','<div class="panel">'+md(x.text)+'</div>');}
  if(c.id==='loresheets'&&x.year!=null) strip=[['Год',String(x.year)]];
  if(c.id==='loresheets'&&(x.levels||[]).length){
    mid+=section('Ступени',(x.levels||[]).length,(x.levels||[]).length?'<div class="grid">'+x.levels.map(function(l){
      return '<article class="card"><span class="tag">'+dots(l[0])+'</span><h4>'+esc(l[1])+'</h4><div class="eff">'+md(l[2]||'')+'</div></article>';}).join('')+'</div>'
      :emptyBox('Ступеней пока нет','Ступени лоршита появятся здесь.'));
  }
  if(c.id==='sects'){
    var cm=membersOf('sect',x),seats=courtOf(x.name);
    if(seats) mid+=section(seats.head||'Посты при Дворе','',courtHtml(seats));
    mid+=section('Члены',cm.length,cm.length?'<div class="subgrid">'+cm.map(personSub).join('')+'</div>'
      :emptyBox('Никого не записано','Известные члены секты появятся здесь.'));
  }
  if(c.id==='people'){
    strip=[['Клан',x.clan?wikiTag(x.clan,esc(x.clan)):'',1],['Секта',x.sect?wikiTag(x.sect,esc(x.sect)):'',1],['Поколение',x.gen],
      ['Мощь крови',x.bp],['Роль',x.role],['Сир',x.sire?nameLink(x.sire):'',1]];
    if(x.track) top+=section('Трекеры','сохраняются в браузере',trackerHtml(x));
    mid+=politicsHtml(x);
  }
  if(c.id==='places'){
    var anc=[],p=x;while(p.parent){p=findIn(PLACES,p.parent);if(!p)break;anc.unshift(p);}
    if(anc.length) top+='<div class="chain"><span class="l">вложенность</span><a href="#/cat/places">Локации</a><span class="sep">›</span>'+
      anc.map(function(a){return '<a href="#/place/'+a.id+'">'+esc(a.name)+'</a><span class="sep">›</span>';}).join('')+
      '<span class="cur">'+esc(x.name)+'</span></div>';
    var dm=x.domain?findIn(DOMAINS,x.domain):null,PK=x.kind?DOMAIN_KINDS[x.kind]:null;
    strip=[['Тип',PK?'<span style="color:'+PK[1]+'">'+PK[0]+'</span>':'',1],['Владелец',x.holder?nameLink(x.holder):'',1],
      ['Домен',dm?'<a class="wiki" href="#/domain/'+dm.id+'">'+esc(dm.name)+'</a>':'',1],['Район',x.area?esc(x.area):'',1]];
    var kids=PLACES.filter(function(k){return k.parent===x.id;}),gh=x.ghosts||[];
    if(kids.length||gh.length) mid+=section('Вложенные локации',kids.length+gh.length,'<div class="subgrid">'+
      kids.map(function(k){return '<a class="subcard" href="#/place/'+k.id+'" style="--c:'+(k.acc||c.c)+'"><span class="k">подзона</span><h4>'+esc(k.name)+'</h4><div class="ds">'+inl(k.short||'')+'</div></a>';}).join('')+
      gh.map(function(g){return '<div class="subcard ghost"><span class="k">заметки нет</span><h4>'+esc(g)+'</h4></div>';}).join('')+'</div>');
  }
  if(c.id==='domains'){
    var K=DOMAIN_KINDS[x.kind]||['—','#888'];
    strip=[['Тип','<span style="color:'+K[1]+'">'+K[0]+'</span>',1],['Держатель',x.holder?nameLink(x.holder):'',1],
      ['Угроза Маскараду',x.threat!=null?dots(x.threat):'',1]];
    var outer=x.domain?findIn(DOMAINS,x.domain):null;
    strip.push(['Внутри домена',outer?'<a class="wiki" href="#/domain/'+outer.id+'">'+esc(outer.name)+'</a>':'',1],['Район',x.area?esc(x.area):'',1]);
    var inPl=PLACES.filter(function(p){return p.domain===x.id;}),inDm=DOMAINS.filter(function(d){return d.domain===x.id;});
    if(inPl.length||inDm.length) mid+=section('Что внутри домена',inPl.length+inDm.length,'<div class="subgrid">'+inPl.map(function(k){
      return '<a class="subcard" href="#/place/'+k.id+'"><span class="k">локация</span><h4>'+esc(k.name)+'</h4><div class="ds">'+inl(k.short||'')+'</div></a>';}).join('')+
      inDm.map(function(k){return '<a class="subcard" href="#/domain/'+k.id+'"><span class="k">домен</span><h4>'+esc(k.name)+'</h4><div class="ds">'+inl(k.short||'')+'</div></a>';}).join('')+'</div>');
  }
  if(c.id==='threats'){
    strip=[['Вид',x.kind]].concat(x.stat||[]);
    if(x.track) top+=section('Трекеры','сохраняются в браузере',trackerHtml(x));
  }
  app.innerHTML='<div class="wrap rise"><a class="back" href="#/cat/'+c.id+'">← '+esc(c.name.toLowerCase())+'</a>'+gmToggleHtml()+
    (c.id==='places'?top:'')+jcard(x,eyebrow,strip,'',/^(people|threats)$/.test(c.id)?numOf(c.arr,x):null)+(c.id!=='places'?top:'')+mid+commonTail(x)+'<div class="u-h30"></div></div>';
  wireTrackers(app);
}

function pcsOf(pid){return PCS.filter(function(x){return x.player===pid;});}
function viewPlayers(){
  var c=catById('players');setTheme('player');
  var cards=PLAYERS.map(function(pl){var list=pcsOf(pl.id);
    return '<a class="god-card" href="#/player/'+pl.id+'" style="--c:'+(pl.acc||c.c)+'"><span class="k">'+numOf(PLAYERS,pl)+' · ИГРОК</span>'+
      '<h3>'+esc(pl.name)+'</h3><p class="pr">'+inl(pl.short||'')+'</p><div class="foot">'+
      '<span class="chip hot">'+list.length+' '+plural(list.length,'персонаж','персонажа','персонажей')+'</span>'+
      list.map(function(x){return '<span class="chip">'+(x.dead?'☾ ':'')+esc(x.name)+'</span>';}).join('')+'</div></a>';}).join('');
  var orphans=PCS.filter(function(x){return !findIn(PLAYERS,x.player);});
  var inner=PLAYERS.length||PCS.length?'<div class="gods">'+cards+'</div>'+
    (orphans.length?'<div class="u-m34-0-14 sec-head"><h3>Без игрока</h3></div><div class="subgrid">'+orphans.map(personSub).join('')+'</div>':'')
    :emptyBox('Котерия ещё не собрана','Здесь появятся игроки и их персонажи — у каждого персонажа будет страница с трекерами.');
  inner+=coterieLiveHtml();
  listShell(c,inner,PLAYERS.length);
  wireCoterieLive(app);
}
function viewPlayer(id){
  var pl=findIn(PLAYERS,id);if(!pl){location.hash='#/cat/players';return;}
  setTheme('player',pl.acc);crumb([['Котерия','#/cat/players'],[pl.name]]);
  var list=pcsOf(pl.id);
  app.innerHTML='<div class="wrap rise"><a class="back" href="#/cat/players">← котерия</a>'+
    jcard({name:pl.name,short:pl.note||pl.short},'игрок '+numOf(PLAYERS,pl))+
    section('Персонажи',list.length,list.length?'<div class="subgrid">'+list.map(personSub).join('')+'</div>':emptyBox('Персонажей пока нет','Персонажи игрока появятся здесь.'))+'</div>';
}
function viewPC(id){
  var x=findIn(PCS,id);if(!x){location.hash='#/cat/players';return;}
  var pl=findIn(PLAYERS,x.player);
  setTheme('player',x.acc);crumb([['Котерия','#/cat/players']].concat(pl?[[pl.name,'#/player/'+pl.id]]:[]).concat([[x.name]]));
  var chain='<div class="chain"><span class="l">котерия</span><a href="#/cat/players">Игроки</a><span class="sep">›</span>'+
    (pl?'<a href="#/player/'+pl.id+'">'+esc(pl.name)+'</a><span class="sep">›</span>':'')+'<span class="cur">'+esc(x.name)+'</span></div>';
  var strip=[['Клан',x.clan?wikiTag(x.clan,esc(x.clan)):'',1],['Секта',x.sect?wikiTag(x.sect,esc(x.sect)):'',1],
    ['Поколение',x.gen],['Мощь крови',x.bp!=null?String(x.bp):''],['Тип хищника',x.predator?wikiTag(x.predator,esc(x.predator)):'',1],
    ['Сир',x.sire?nameLink(x.sire):'',1]];
  var out='<div class="wrap rise"><a class="back" href="'+(pl?'#/player/'+pl.id:'#/cat/players')+'">← '+(pl?esc(pl.name.toLowerCase()):'котерия')+'</a>'+gmToggleHtml()+chain+
    jcard(x,'персонаж игрока'+(pl?' · '+esc(pl.name):''),strip)+
    section('Трекеры',isLivePc(x)?'живой лист — Firestore':'сохраняются в браузере',trackerHtml(x));
  if(x.disciplines&&x.disciplines.length) out+=section('Дисциплины',x.disciplines.length,'<div class="defs">'+x.disciplines.map(function(d){
    return '<div class="def"><span class="l">'+wikiTag(d[0],esc(d[0]))+'</span><div class="v">'+dots(d[1])+'</div></div>';}).join('')+'</div>');
  if(x.convictions&&x.convictions.length) out+=section('Убеждения и Якоря',x.convictions.length,tableHtml({head:['Убеждение','Якорь'],
    rows:x.convictions.map(function(v){return [v[0],v[1]?'[['+v[1]+']]':'—'];})}));
  out+=politicsHtml(x)+commonTail(x);
  app.innerHTML=out+'<div class="u-h30"></div></div>';
  wireTrackers(app);
  startPcSyncIfLive(x);
}

function viewPlaces(){
  var c=catById('places'),dc=catById('domains');
  function kindChip(x){return x.kind&&DOMAIN_KINDS[x.kind]?'<span class="chip hot">'+esc(DOMAIN_KINDS[x.kind][0])+'</span>':'';}
  function placeRow(p){return '<li><a class="lrow" href="#/place/'+p.id+'" style="--c:'+(p.acc||c.c)+'"><span class="nm">'+esc(p.name)+'</span>'+
    '<span class="ds">'+inl(p.short||'')+'</span><span class="meta">'+kindChip(p)+'</span></a></li>';}
  function domRow(d){
    var inner=PLACES.filter(function(p){return p.domain===d.id;}).map(placeRow).join('')+DOMAINS.filter(function(x){return x.domain===d.id;}).map(domRow).join('');
    return '<li><a class="lrow dom" href="#/domain/'+d.id+'" style="--c:'+dc.c+'"><span class="nm">'+esc(d.name)+'</span>'+
      '<span class="ds">'+inl(d.short||'')+'</span><span class="meta"><span class="chip">домен</span>'+kindChip(d)+'</span></a>'+(inner?'<ul>'+inner+'</ul>':'')+'</li>';}
  var areas=(CITY_MAP.areas||[]).slice();
  PLACES.concat(DOMAINS).forEach(function(x){if(x.area&&areas.indexOf(x.area)<0)areas.push(x.area);});
  var tree=areas.map(function(a){
    var pl=PLACES.filter(function(p){return p.area===a&&!(p.domain&&findIn(DOMAINS,p.domain));}),
      dm=DOMAINS.filter(function(d){return d.area===a&&!(d.domain&&findIn(DOMAINS,d.domain));});
    var n=PLACES.filter(function(p){return p.area===a;}).length,nd=DOMAINS.filter(function(d){return d.area===a;}).length;
    return '<li><div class="lrow area"><span class="nm">'+esc(a)+'</span><span class="ds">'+(n||nd?'':'Здесь пока ничего не отмечено')+'</span><span class="meta">'+
      (n?'<span class="chip">'+n+' '+plural(n,'локация','локации','локаций')+'</span>':'')+(nd?'<span class="chip">'+nd+' '+plural(nd,'домен','домена','доменов')+'</span>':'')+'</span></div>'+
      (pl.length||dm.length?'<ul>'+pl.map(placeRow).join('')+dm.map(domRow).join('')+'</ul>':'')+'</li>';}).join('');
  var loose=PLACES.filter(function(p){return !p.area;});
  var topGh=(GHOSTS.places||[]).filter(function(g){return !LINKS[g];});
  var rest=loose.map(placeRow).join('')+topGh.map(function(g){return '<li><div class="lrow ghost"><span class="nm">'+esc(g)+'</span><span class="ds">заметки нет</span></div></li>';}).join('');
  listShell(c,(PLACES.length||topGh.length)?'<ul class="ltree">'+tree+(rest?'<li><div class="lrow area"><span class="nm">Район не указан</span></div><ul>'+rest+'</ul></li>':'')+'</ul>'+
    '<p class="hint">Районы — как на карте города. Внутри района сначала здания вне чьих-либо доменов, потом домены, а в доменах — здания, которые стоят на их территории. Домены открываются своими страницами.</p>'
    :emptyBox('Локаций пока нет','Здесь появятся здания хроники: клубы, убежища, места сбора.'));
}
function viewDomains(){
  var c=catById('domains');
  var W=CITY_MAP.w||1000,H=CITY_MAP.h||640;
  var shaped=DOMAINS.filter(function(d){return d.shape||d.point;}),pins=PLACES.filter(function(p){return p.point;});
  var svg='<svg viewBox="0 0 '+W+' '+H+'" id="mapsvg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">'+
    '<path d="M40 0H0V40" fill="none" stroke="rgba(224,129,46,.08)"/></pattern></defs>'+
    (CITY_MAP.img?'<image href="'+esc(CITY_MAP.img)+'" x="0" y="0" width="'+W+'" height="'+H+'" preserveAspectRatio="xMidYMid slice" opacity=".55"/>'
      :'<rect width="'+W+'" height="'+H+'" fill="url(#grid)"/>'+
       '<path d="M0 '+(H*.62)+' C'+(W*.25)+' '+(H*.5)+' '+(W*.45)+' '+(H*.8)+' '+(W*.7)+' '+(H*.66)+' S'+W+' '+(H*.5)+' '+W+' '+(H*.55)+'" stroke="rgba(92,134,192,.35)" stroke-width="18" fill="none"/>');
  shaped.filter(function(d){return d.shape;}).forEach(function(d){var K=DOMAIN_KINDS[d.kind]||['','#888'];
    svg+='<polygon class="dom'+((d.threat||0)>=3?' threat':'')+'" data-id="'+esc(d.id)+'" points="'+esc(d.shape)+'" fill="'+K[1]+'" fill-opacity=".22" stroke="'+K[1]+'" stroke-width="2"/>';});
  shaped.filter(function(d){return !d.shape&&d.point;}).forEach(function(d){var K=DOMAIN_KINDS[d.kind]||['','#888'];
    var xy=String(d.point).split(',').map(parseFloat);
    svg+='<g class="dom pt'+((d.threat||0)>=3?' threat':'')+'" data-id="'+esc(d.id)+'" transform="translate('+xy[0]+' '+xy[1]+')">'+
      '<circle r="9" fill="transparent"/><circle class="dot" r="3.2" fill="'+K[1]+'" stroke="#07080C" stroke-width="1.2"/></g>';});
  pins.forEach(function(p){var K=DOMAIN_KINDS[p.kind]||['','#888'],xy=String(p.point).split(',').map(parseFloat);
    svg+='<g class="dom pt place" data-place="'+esc(p.id)+'" transform="translate('+xy[0]+' '+xy[1]+')">'+
      '<circle r="9" fill="transparent"/><rect class="dot" x="-3.4" y="-3.4" width="6.8" height="6.8" fill="'+K[1]+'" stroke="#07080C" stroke-width="1.2"/></g>';});
  if(!shaped.length&&!pins.length) svg+='<text x="'+W/2+'" y="'+H/2+'" text-anchor="middle" fill="rgba(239,230,220,.4)" font-family="Cormorant Garamond,serif" font-size="30">Карта ждёт районов</text>'+
    '<text x="'+W/2+'" y="'+(H/2+30)+'" text-anchor="middle" fill="rgba(239,230,220,.3)" font-family="JetBrains Mono,monospace" font-size="12">районы появятся по мере того, как котерия узнаёт город</text>';
  svg+='</svg>';
  var legend='<div class="legend">'+Object.keys(DOMAIN_KINDS).map(function(k){var K=DOMAIN_KINDS[k];
    var n=DOMAINS.concat(pins).filter(function(d){return d.kind===k;}).length;
    return n?'<span class="legend-item"><i style="background:'+K[1]+'"></i>'+K[0]+'<b>'+n+'</b></span>':'';}).join('')+
    (pins.length?'<span class="legend-item">● зона домена · ■ здание-локация</span>':'')+'</div>';
  var gh=(GHOSTS.domains||[]).filter(function(n){return !LINKS[n];});
  var ghostCards=gh.map(function(n){return ghostCard('ДОМЕН',n,[],'');}).join('');
  function dgroup(title,color,n,cards){return '<details class="dgroup" open style="--c:'+color+'"><summary><i></i><span>'+esc(title)+'</span><b>'+n+'</b></summary><div class="gods">'+cards+'</div></details>';}
  var groups=Object.keys(DOMAIN_KINDS).map(function(k){var arr=DOMAINS.filter(function(d){return d.kind===k;});
    return arr.length?dgroup(DOMAIN_KINDS[k][0],DOMAIN_KINDS[k][1],arr.length,arr.map(function(x){return domainCard(c,x);}).join('')):'';}).join('');
  var rest=DOMAINS.filter(function(d){return !DOMAIN_KINDS[d.kind];});
  if(rest.length) groups+=dgroup('Прочее','#7E7A8A',rest.length,rest.map(function(x){return domainCard(c,x);}).join(''));
  if(gh.length) groups+=dgroup('Без записи','#7E7A8A',gh.length,ghostCards);
  var list=(DOMAINS.length||gh.length)?'<div class="u-mt26">'+groups+'</div>'
    +(gh.length?'<p class="hint">Пунктирные карточки — упомянуты в заметках, но своей записи ещё нет; на карте их пока нет.</p>':''):'';
  listShell(c,'<div class="map" id="map">'+svg+'<div class="maptip" id="maptip" hidden></div></div>'+legend+
    (shaped.length||pins.length?'<p class="hint">Названия и подробности — при наведении на область или точку карты, либо кнопкой «Показать на карте» в карточке ниже. Квадраты — здания из раздела «Локации».</p>':'')+
    (CITY_MAP.note?'<div class="note"><b>Карта</b>'+md(CITY_MAP.note)+'</div>':'')+list);
  var map=document.getElementById('map'),tip=document.getElementById('maptip');
  function domOf(pg){return pg.hasAttribute('data-place')?findIn(PLACES,pg.getAttribute('data-place')):findIn(DOMAINS,pg.getAttribute('data-id'));}
  map.addEventListener('mousemove',function(e){var pg=e.target.closest('.dom');if(!pg){tip.hidden=true;return;}
    var d=domOf(pg),K=DOMAIN_KINDS[d.kind]||['—'];
    tip.innerHTML='<b>'+esc(d.name)+'</b>'+K[0]+(d.holder?' · '+esc(d.holder):'')+(d.threat!=null?'<br>угроза '+d.threat+' / 5':'');
    var r=map.getBoundingClientRect();tip.hidden=false;
    tip.style.left=Math.min(e.clientX-r.left+14,r.width-270)+'px';tip.style.top=(e.clientY-r.top+14)+'px';});
  map.addEventListener('mouseleave',function(){tip.hidden=true;});
  map.addEventListener('click',function(e){var pg=e.target.closest('.dom');if(pg)location.hash=pg.hasAttribute('data-place')?'#/place/'+pg.getAttribute('data-place'):'#/domain/'+pg.getAttribute('data-id');});
  app.querySelectorAll('.dc-showmap').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var id=btn.getAttribute('data-id'),pg=null;
      map.querySelectorAll('.dom').forEach(function(o){if(o.getAttribute('data-id')===id)pg=o;});
      if(!pg) return;
      map.querySelectorAll('.dom.flash').forEach(function(o){o.classList.remove('flash');});
      void pg.offsetWidth;
      pg.classList.add('flash');
      map.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(function(){pg.classList.remove('flash');},1650);
    });
  });
}
function domainCard(c,x){
  var ch=chipsFor(c,x);
  return '<div class="god-card'+(x.dead?' dead':'')+'" style="--c:'+(x.acc||c.c)+'">'+
    '<a class="dc-body" href="#/'+c.route+'/'+x.id+'">'+
    '<span class="k">'+numOf(c.arr,x)+' · '+esc(c.one.toUpperCase())+(x.dead?' · ☾ торпор':'')+'</span><h3>'+esc(x.name)+'</h3>'+
    (x.short?'<p class="pr">'+inl(x.short)+'</p>':'')+
    '<div class="foot">'+ch.map(function(v,i){return '<span class="chip'+(i===0?' hot':'')+'">'+esc(v)+'</span>';}).join('')+'</div></a>'+
    (x.shape||x.point?'<button type="button" class="dc-showmap" data-id="'+esc(x.id)+'">Показать на карте</button>':'')+
    '</div>';
}
