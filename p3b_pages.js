
/* ================= СТРАНИЦА ЗАПИСИ (общая) ================= */
function viewEntry(c,id){
  var x=findIn(c.arr,id);
  if(!x){location.hash='#/cat/'+c.id;return;}
  if(c.kind==='cards'){viewCards(c,id);return;}
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
    var mem=membersOf('clan',x);
    mid+=section('В городе',mem.length,mem.length?'<div class="subgrid">'+mem.map(personSub).join('')+'</div>'
      :emptyBox('Никого не записано','Члены клана, известные котерии, появятся здесь.'));
  }
  if(c.id==='disciplines'){
    strip=[['Тип',x.kind],['Резонанс',x.resonance],['Угроза Маскараду',x.threat]];
    var lv={};(x.powers||[]).forEach(function(p){(lv[p.lvl]=lv[p.lvl]||[]).push(p);});
    var inner=Object.keys(lv).sort().map(function(l){
      return '<div class="sec-head" style="margin:30px 0 12px"><h3>Уровень '+l+'</h3><span class="eyebrow">'+dots(+l)+'</span></div>'+
        '<div class="grid">'+lv[l].map(function(p){
          var par=[['Цена',p.cost],['Пул',p.pool],['Длительность',p.dur],['Амальгама',p.amalgam]].filter(function(q){return q[1];});
          return '<article class="card"><span class="tag">ур. '+p.lvl+'</span><h4>'+esc(p.name)+'</h4>'+
            (par.length?'<dl class="par">'+par.map(function(q){return '<dt>'+q[0]+'</dt><dd>'+inl(q[1])+'</dd>';}).join('')+'</dl>':'')+
            '<div class="eff">'+md(p.text||'')+'</div></article>';}).join('')+'</div>';}).join('');
    mid+=section('Силы',(x.powers||[]).length,inner||emptyBox('Сил пока нет','Силы появятся здесь, разложенные по уровням.'));
  }
  if(c.id==='loresheets'){
    mid+=section('Ступени',(x.levels||[]).length,(x.levels||[]).length?'<div class="grid">'+x.levels.map(function(l){
      return '<article class="card"><span class="tag">'+dots(l[0])+'</span><h4>'+esc(l[1])+'</h4><div class="eff">'+md(l[2]||'')+'</div></article>';}).join('')+'</div>'
      :emptyBox('Ступеней пока нет','Ступени лоршита появятся здесь.'));
  }
  if(c.id==='sects'){
    var cm=membersOf('sect',x),seats=courtOf(x.name);
    if(seats) mid+=section('Посты при Дворе','',courtHtml(seats));
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
    top+='<div class="chain"><span class="l">вложенность</span><a href="#/cat/places">Локации</a><span class="sep">›</span>'+
      anc.map(function(a){return '<a href="#/place/'+a.id+'">'+esc(a.name)+'</a><span class="sep">›</span>';}).join('')+
      '<span class="cur">'+esc(x.name)+'</span></div>';
    var dm=x.domain?findIn(DOMAINS,x.domain):null;
    if(dm) strip=[['Домен','<a class="wiki" href="#/domain/'+dm.id+'">'+esc(dm.name)+'</a>',1]];
    var kids=PLACES.filter(function(k){return k.parent===x.id;}),gh=x.ghosts||[];
    if(kids.length||gh.length) mid+=section('Вложенные локации',kids.length+gh.length,'<div class="subgrid">'+
      kids.map(function(k){return '<a class="subcard" href="#/place/'+k.id+'" style="--c:'+(k.acc||c.c)+'"><span class="k">подзона</span><h4>'+esc(k.name)+'</h4><div class="ds">'+inl(k.short||'')+'</div></a>';}).join('')+
      gh.map(function(g){return '<div class="subcard ghost"><span class="k">заметки нет</span><h4>'+esc(g)+'</h4></div>';}).join('')+'</div>');
  }
  if(c.id==='domains'){
    var K=DOMAIN_KINDS[x.kind]||['—','#888'];
    strip=[['Тип','<span style="color:'+K[1]+'">'+K[0]+'</span>',1],['Держатель',x.holder?nameLink(x.holder):'',1],
      ['Угроза Маскараду',x.threat!=null?dots(x.threat):'',1]];
    var inPl=PLACES.filter(function(p){return p.domain===x.id;});
    if(inPl.length) mid+=section('Локации домена',inPl.length,'<div class="subgrid">'+inPl.map(function(k){
      return '<a class="subcard" href="#/place/'+k.id+'"><span class="k">локация</span><h4>'+esc(k.name)+'</h4><div class="ds">'+inl(k.short||'')+'</div></a>';}).join('')+'</div>');
  }
  if(c.id==='threats'){
    strip=[['Вид',x.kind]].concat(x.stat||[]);
    if(x.track) top+=section('Трекеры','сохраняются в браузере',trackerHtml(x));
  }
  app.innerHTML='<div class="wrap rise"><a class="back" href="#/cat/'+c.id+'">← '+esc(c.name.toLowerCase())+'</a>'+
    (c.id==='places'?top:'')+jcard(x,eyebrow,strip)+(c.id!=='places'?top:'')+mid+commonTail(x)+'<div style="height:30px"></div></div>';
  wireTrackers(app);
}

/* ================= КОТЕРИЯ ================= */
function pcsOf(pid){return PCS.filter(function(x){return x.player===pid;});}
function viewPlayers(){
  var c=catById('players');setTheme('player');
  var cards=PLAYERS.map(function(pl){var list=pcsOf(pl.id);
    return '<a class="god-card" href="#/player/'+pl.id+'" style="--c:'+(pl.acc||c.c)+'"><span class="k">'+numOf(PLAYERS,pl)+' · ИГРОК</span>'+
      '<h3>'+esc(pl.name)+'</h3><p class="pr">'+inl(pl.short||'')+'</p><div class="foot">'+
      '<span class="chip hot">'+list.length+' '+plural(list.length,'персонаж','персонажа','персонажей')+'</span>'+
      list.map(function(x){return '<span class="chip">'+(x.dead?'✝ ':'')+esc(x.name)+'</span>';}).join('')+'</div></a>';}).join('');
  var orphans=PCS.filter(function(x){return !findIn(PLAYERS,x.player);});
  var inner=PLAYERS.length||PCS.length?'<div class="gods">'+cards+'</div>'+
    (orphans.length?'<div class="sec-head" style="margin:34px 0 14px"><h3>Без игрока</h3></div><div class="subgrid">'+orphans.map(personSub).join('')+'</div>':'')
    :emptyBox('Котерия ещё не собрана','Здесь появятся игроки и их персонажи — у каждого персонажа будет страница с трекерами.');
  listShell(c,inner,PLAYERS.length);
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
  var out='<div class="wrap rise"><a class="back" href="'+(pl?'#/player/'+pl.id:'#/cat/players')+'">← '+(pl?esc(pl.name.toLowerCase()):'котерия')+'</a>'+chain+
    jcard(x,'персонаж игрока'+(pl?' · '+esc(pl.name):''),strip)+
    section('Трекеры','сохраняются в браузере',trackerHtml(x));
  if(x.disciplines&&x.disciplines.length) out+=section('Дисциплины',x.disciplines.length,'<div class="defs">'+x.disciplines.map(function(d){
    return '<div class="def"><span class="l">'+wikiTag(d[0],esc(d[0]))+'</span><div class="v">'+dots(d[1])+'</div></div>';}).join('')+'</div>');
  if(x.convictions&&x.convictions.length) out+=section('Убеждения и Якоря',x.convictions.length,tableHtml({head:['Убеждение','Якорь'],
    rows:x.convictions.map(function(v){return [v[0],v[1]?'[['+v[1]+']]':'—'];})}));
  out+=politicsHtml(x)+commonTail(x);
  app.innerHTML=out+'<div style="height:30px"></div></div>';
  wireTrackers(app);
}

/* ================= ЛОКАЦИИ: ДЕРЕВО ================= */
function viewPlaces(){
  var c=catById('places');
  function row(p){return '<a class="lrow" href="#/place/'+p.id+'" style="--c:'+(p.acc||c.c)+'"><span class="nm">'+esc(p.name)+'</span>'+
    '<span class="ds">'+inl(p.short||'')+'</span><span class="meta"><span class="chip hot">'+
    (PLACES.filter(function(k){return k.parent===p.id;}).length+(p.ghosts||[]).length)+' подзон</span></span></a>';}
  function branch(p){var kids=PLACES.filter(function(k){return k.parent===p.id;}),gh=p.ghosts||[];
    return '<li>'+row(p)+(kids.length||gh.length?'<ul>'+kids.map(branch).join('')+gh.map(function(g){
      return '<li><div class="lrow ghost"><span class="nm">'+esc(g)+'</span><span class="ds">заметки нет</span></div></li>';}).join('')+'</ul>':'')+'</li>';}
  var roots=PLACES.filter(function(x){return !x.parent||!findIn(PLACES,x.parent);});
  var topGh=(GHOSTS.places||[]).filter(function(g){return !LINKS[g];});
  var topGhRows=topGh.map(function(g){return '<li><div class="lrow ghost"><span class="nm">'+esc(g)+'</span><span class="ds">заметки нет</span></div></li>';}).join('');
  listShell(c,(roots.length||topGh.length)?'<ul class="ltree">'+roots.map(branch).join('')+topGhRows+'</ul><p class="hint">Пунктиром — зоны и места без собственной заметки.</p>'
    :emptyBox('Локаций пока нет','Здесь вырастет дерево мест хроники: от района до отдельной комнаты.'));
}

/* ================= ДОМЕНЫ: КАРТА ================= */
function viewDomains(){
  var c=catById('domains');
  var W=CITY_MAP.w||1000,H=CITY_MAP.h||640;
  var shaped=DOMAINS.filter(function(d){return d.shape;});
  var svg='<svg viewBox="0 0 '+W+' '+H+'" id="mapsvg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">'+
    '<path d="M40 0H0V40" fill="none" stroke="rgba(224,129,46,.08)"/></pattern></defs>'+
    (CITY_MAP.img?'<image href="'+esc(CITY_MAP.img)+'" x="0" y="0" width="'+W+'" height="'+H+'" preserveAspectRatio="xMidYMid slice" opacity=".55"/>'
      :'<rect width="'+W+'" height="'+H+'" fill="url(#grid)"/>'+
       '<path d="M0 '+(H*.62)+' C'+(W*.25)+' '+(H*.5)+' '+(W*.45)+' '+(H*.8)+' '+(W*.7)+' '+(H*.66)+' S'+W+' '+(H*.5)+' '+W+' '+(H*.55)+'" stroke="rgba(92,134,192,.35)" stroke-width="18" fill="none"/>');
  shaped.forEach(function(d){var K=DOMAIN_KINDS[d.kind]||['','#888'];
    svg+='<polygon class="dom'+((d.threat||0)>=3?' threat':'')+'" data-id="'+esc(d.id)+'" points="'+esc(d.shape)+'" fill="'+K[1]+'" fill-opacity=".22" stroke="'+K[1]+'" stroke-width="2"/>';});
  if(!shaped.length) svg+='<text x="'+W/2+'" y="'+H/2+'" text-anchor="middle" fill="rgba(239,230,220,.4)" font-family="Cormorant Garamond,serif" font-size="30">Карта ждёт районов</text>'+
    '<text x="'+W/2+'" y="'+(H/2+30)+'" text-anchor="middle" fill="rgba(239,230,220,.3)" font-family="JetBrains Mono,monospace" font-size="12">районы появятся по мере того, как котерия узнаёт город</text>';
  svg+='</svg>';
  var legend='<div class="legend">'+Object.keys(DOMAIN_KINDS).map(function(k){var K=DOMAIN_KINDS[k];
    return '<span class="legend-item"><i style="background:'+K[1]+'"></i>'+K[0]+'<b>'+DOMAINS.filter(function(d){return d.kind===k;}).length+'</b></span>';}).join('')+'</div>';
  var gh=(GHOSTS.domains||[]).filter(function(n){return !LINKS[n];});
  var ghostCards=gh.map(function(n){return ghostCard('ДОМЕН',n,[],'');}).join('');
  var list=(DOMAINS.length||gh.length)?'<div class="gods" style="margin-top:26px">'+DOMAINS.map(function(x){return domainCard(c,x);}).join('')+ghostCards+'</div>'
    +(gh.length?'<p class="hint">Пунктирные карточки — упомянуты в заметках, но своей записи ещё нет; на карте не показаны, пока нет координат (shape).</p>':''):'';
  listShell(c,'<div class="map" id="map">'+svg+'<div class="maptip" id="maptip" hidden></div></div>'+legend+
    (shaped.length?'<p class="hint">Названия и подробности — при наведении на область карты, либо кнопкой «Показать на карте» в карточке ниже.</p>':'')+
    (CITY_MAP.note?'<div class="note"><b>Карта</b>'+md(CITY_MAP.note)+'</div>':'')+list);
  var map=document.getElementById('map'),tip=document.getElementById('maptip');
  map.addEventListener('mousemove',function(e){var pg=e.target.closest('.dom');if(!pg){tip.hidden=true;return;}
    var d=findIn(DOMAINS,pg.getAttribute('data-id')),K=DOMAIN_KINDS[d.kind]||['—'];
    tip.innerHTML='<b>'+esc(d.name)+'</b>'+K[0]+(d.holder?' · '+esc(d.holder):'')+(d.threat!=null?'<br>угроза '+d.threat+' / 5':'');
    var r=map.getBoundingClientRect();tip.hidden=false;
    tip.style.left=Math.min(e.clientX-r.left+14,r.width-270)+'px';tip.style.top=(e.clientY-r.top+14)+'px';});
  map.addEventListener('mouseleave',function(){tip.hidden=true;});
  map.addEventListener('click',function(e){var pg=e.target.closest('.dom');if(pg)location.hash='#/domain/'+pg.getAttribute('data-id');});
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
    '<span class="k">'+numOf(c.arr,x)+' · '+esc(c.one.toUpperCase())+(x.dead?' · ✝':'')+'</span><h3>'+esc(x.name)+'</h3>'+
    (x.short?'<p class="pr">'+inl(x.short)+'</p>':'')+
    '<div class="foot">'+ch.map(function(v,i){return '<span class="chip'+(i===0?' hot':'')+'">'+esc(v)+'</span>';}).join('')+'</div></a>'+
    (x.shape?'<button type="button" class="dc-showmap" data-id="'+esc(x.id)+'">Показать на карте</button>':'')+
    '</div>';
}
