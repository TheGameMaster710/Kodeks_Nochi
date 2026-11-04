/* ═══ ПРИЛОЖЕНИЯ: КОСТИ И ПРОИГРЫВАТЕЛЬ (v2.15, 4 ноября 2026) ═══
   ТОЛЬКО ДЛЯ МАСТЕРОВ: музыка, проигрыватель и меню «Приложения» есть у роли master/admin
   (canGm()). Игроку кнопка остаётся прежней — «Кости», блока «Музыка» в заметках нет.
   Это скрытие интерфейса, а не защита: сами mp3 лежат на публичном адресе MUSIC_BASE.
   Музыка мира (опенинг, эндинг, районы — WORLD_MUSIC в data.js) всегда лежит в проигрывателе.
   Музыка локаций и доменов живёт в заметках: поле music у записи — категории по 2 трека
   ({id, name, mood:'calm'|'intrigue'|'battle', tracks:[{id,title,file,gain}]}).
   На странице заметки блок «Музыка»:
   · сэмпл трека перекрывает то, что играет, и звучит, пока читатель на этой
     заметке; при уходе с неё прежняя музыка возвращается с того же места;
   · «В плеер» сохраняет категорию или всю заметку целиком. Сохранённое
     лежит в localStorage этого браузера (kn-mp-saved) и играет в проигрывателе.
   Звук — два <audio> вне страниц сайта, поэтому переходы по заметкам, броски
   и закрытие окон его не прерывают. Режимы MP.mode: track — трек по кругу;
   cat — треки категории по очереди; preview — сэмпл из заметки.
   Между треками мягкий переход длиной MP.XF секунд.
   gain выравнивает громкость (замер LUFS, 4 ноября 2026). */
var MUSIC_BASE='https://kodeks-nochi-audio.vladpod1825.workers.dev/'; /* Cloudflare, статические файлы; пути треков — папка/файл */
var MUSIC_EMBED=null; /* {trackId:'data:audio/mpeg;base64,…'} — музыка внутри офлайн-файла для телефона */
var MP_MOODS={calm:'спокойная',intrigue:'интрига',battle:'боевая'};
/* цвет заметки в проигрывателе — её собственный (как на её странице), а не активной страницы */
var MP_NOTE_COLOR={'place/eden':'#FF2A4F'};
var MP_WORLD_COLOR={'Мир':'#D8B97A','Манхэттен':'#E8A33C','Бруклин':'#5C86C0'};
function mpColor(c,x){var k=c.route+'/'+x.id;return MP_NOTE_COLOR[k]||c.c||'#C9A45C';}
var MP={XF:5, a:[], cur:0, mode:null, cat:null, i:0, vol:.8, fading:false, t0:0, out:0,
  blob:{}, miss:{}, dur:{}, on:false, prev:null, pvRoute:null, saved:[]};

/* ── библиотека: все заметки с полем music ── */
function mpLib(){var L=[];
  if(typeof WORLD_MUSIC!=='undefined')WORLD_MUSIC.forEach(function(w){L.push({x:w,href:'',name:w.name,kind:w.kind||'мир',cats:w.music,world:true,color:MP_WORLD_COLOR[w.name]||'#C9A45C'});});
  CATS.forEach(function(c){(c.arr||[]).forEach(function(x){
  if(x.music&&x.music.length)L.push({x:x,href:'#/'+c.route+'/'+x.id,name:x.name,kind:c.one,cats:x.music,color:mpColor(c,x)});});});return L;}
function mpFindCat(id){var L=mpLib();for(var k=0;k<L.length;k++)for(var c=0;c<L[k].cats.length;c++)
  if(L[k].cats[c].id===id)return {lib:L[k],cat:L[k].cats[c]};return null;}
function mpFind(tid){var L=mpLib();for(var k=0;k<L.length;k++)for(var c=0;c<L[k].cats.length;c++){var C=L[k].cats[c];
  for(var j=0;j<C.tracks.length;j++)if(C.tracks[j].id===tid)return {lib:L[k],cat:C,t:C.tracks[j],i:j};}return null;}
function mpIsWorld(id){var f=mpFindCat(id);return !!(f&&f.lib.world);}
function mpIsSaved(id){return MP.saved.indexOf(id)>=0||mpIsWorld(id);}
function mpSaveIds(ids,on){ids=ids.filter(function(id){return !mpIsWorld(id);});ids.forEach(function(id){var k=MP.saved.indexOf(id);
    if(on&&k<0)MP.saved.push(id);if(!on&&k>=0)MP.saved.splice(k,1);});
  try{localStorage.setItem('kn-mp-saved',JSON.stringify(MP.saved));}catch(e){}
  if(!on&&MP.cat&&(MP.mode==='cat'||MP.mode==='track')&&ids.indexOf(MP.cat.id)>=0)MP.out=Date.now();
  mpProbe();mpUi();}

/* ── звук ── */
function mpSrcs(t){if(MP.blob[t.id])return [MP.blob[t.id]];
  var enc=function(f){return f.split('/').map(encodeURIComponent).join('/');},
    a=[MUSIC_BASE+enc(t.file)],us=t.file.replace(/ /g,'_');
  if(us!==t.file)a.push(MUSIC_BASE+enc(us));return a;}
function mpFmt(s){if(!isFinite(s))return '0:00';s=Math.floor(s);return Math.floor(s/60)+':'+('0'+s%60).slice(-2);}
function mpApply(el){if(!el._t)return;var v=MP.vol*el._t.gain*el._f;el.volume=Math.max(0,Math.min(1,v));}
function mpLoad(el,t,at){el._t=t;el._srcs=mpSrcs(t);el._k=0;el.src=el._srcs[0];
  if(at>0){var f=function(){el.removeEventListener('loadedmetadata',f);if(at<el.duration-MP.XF-1)el.currentTime=at;};
    el.addEventListener('loadedmetadata',f);}}
function mpOnErr(){var el=this;if(!el._t)return;
  if(el._k<el._srcs.length-1){el._k++;el.src=el._srcs[el._k];if(MP.on&&MP.a[MP.cur]===el)el.play().catch(function(){});return;}
  MP.miss[el._t.id]=true;mpMiss();
  if(MP.a[MP.cur]===el){MP.on=false;mpUi();}}

/* следующий трек: в режиме категории — по кругу, иначе тот же */
function mpNextTrack(){if(MP.mode==='cat')MP.i=(MP.i+1)%MP.cat.tracks.length;return MP.cat.tracks[MP.i];}

/* мягкий переход на трек t (с позиции at): новый звучит громче, старый затихает */
function mpCross(t,at){var o=MP.a[MP.cur],n=MP.a[1-MP.cur];
  if(MP.fading)n.pause();
  MP.out=0;mpLoad(n,t,at);n._f=0;mpApply(n);
  n.play().catch(function(){});
  MP.cur=1-MP.cur;MP.fading=!o.paused;MP.t0=Date.now();
  if(!MP.fading){n._f=1;mpApply(n);o.pause();}
  MP.on=true;mpMeta();mpUi();}

function mpTick(){var e=MP.a[MP.cur];
  if(MP.out){var q=Math.min(1,(Date.now()-MP.out)/1500);
    MP.a.forEach(function(el){if(!el.paused){el._f=Math.min(el._f,1-q);mpApply(el);}});
    if(q>=1)mpStop();return;}
  if(MP.fading){var o=MP.a[1-MP.cur],k=Math.min(1,(Date.now()-MP.t0)/(MP.XF*1000));
    e._f=k;o._f=1-k;mpApply(e);mpApply(o);if(k>=1){o.pause();MP.fading=false;}}
  else if(MP.on&&e.duration&&!e.paused&&e.duration-e.currentTime<=Math.min(MP.XF,e.duration/3))mpCross(mpNextTrack());
  mpProg();}

function mpPlayTrack(tid){var f=mpFind(tid);if(!f)return;MP.prev=null;MP.pvRoute=null;MP.mode='track';MP.cat=f.cat;MP.i=f.i;mpCross(f.t);}
function mpPlayCat(id){var f=mpFindCat(id);if(!f)return;MP.prev=null;MP.pvRoute=null;MP.mode='cat';MP.cat=f.cat;MP.i=0;mpCross(f.cat.tracks[0]);}
/* сэмпл из заметки: запоминает, что играло, чтобы вернуть это при уходе со страницы */
function mpPreview(tid,route){var f=mpFind(tid);if(!f)return;
  if(MP.mode!=='preview'){var e=MP.a[MP.cur];
    MP.prev=MP.on&&MP.mode&&e._t?{mode:MP.mode,cat:MP.cat,i:MP.i,t:e._t,at:e.currentTime}:null;}
  MP.mode='preview';MP.cat=f.cat;MP.i=f.i;MP.pvRoute=route;mpCross(f.t);}
function mpPreviewEnd(){if(MP.mode!=='preview')return;var p=MP.prev;MP.prev=null;MP.pvRoute=null;
  if(p){MP.mode=p.mode;MP.cat=p.cat;MP.i=p.i;mpCross(p.t,p.at);}
  else MP.out=Date.now();}
function mpToggle(){var e=MP.a[MP.cur];if(!MP.mode)return;
  if(MP.on){MP.on=false;MP.a[0].pause();MP.a[1].pause();
    if(MP.fading){MP.fading=false;e._f=1;mpApply(e);}}
  else{MP.on=true;e.play().catch(function(){});}
  mpUi();}
function mpStop(){MP.a.forEach(function(el){el.pause();el.removeAttribute('src');el.load();el._t=null;});
  MP.on=false;MP.mode=null;MP.cat=null;MP.fading=false;MP.out=0;MP.prev=null;MP.pvRoute=null;mpMeta();mpUi();}

/* ── проигрыватель ── */
function mpProg(){var e=MP.a[MP.cur],d=e.duration||0,c=e.currentTime||0;
  document.getElementById('mpFill').style.width=(d?c/d*100:0)+'%';
  document.getElementById('mpCur').textContent=mpFmt(c);
  document.getElementById('mpDur').textContent=mpFmt(d);}
function mpUi(){var e=MP.a[MP.cur],t=MP.mode?e._t:null,f=t?mpFindCat(MP.cat.id):null;
  document.body.classList.toggle('mp-on',MP.on);
  document.getElementById('mpNowCat').textContent=f?f.lib.name+' · '+f.cat.name:'Тишина';
  document.getElementById('mpNowTitle').textContent=t?t.title:'Ничего не играет';
  document.getElementById('mpNowMode').textContent=!t?'':MP.mode==='track'?'↻ трек по кругу':MP.mode==='cat'?'⇄ категория по очереди':'▶ сэмпл из заметки, пока ты на ней';
  var pl=document.getElementById('mpPlay');pl.disabled=!MP.mode;pl.textContent=MP.on?'❚❚ Пауза':'▶ Играть';
  document.getElementById('mpNext').disabled=MP.mode!=='cat'||MP.cat.tracks.length<2;
  document.getElementById('mpStop').disabled=!MP.mode;
  document.getElementById('appMusicSub').textContent=t?(MP.mode==='preview'?'Сэмпл: ':MP.on?'Играет: ':'Пауза: ')+t.title:'Музыка хроники';
  mpList();mnRefresh();mpProg();}
function mpTrackRow(t,btn){var cur=MP.mode?MP.a[MP.cur]._t:null,on=cur===t;
  return '<li class="'+(on?'on':'')+(MP.miss[t.id]?' miss':'')+'"><span class="mp-tt">'+esc(t.title)+(on?' <em>'+(MP.on?(MP.mode==='preview'?'сэмпл':'играет'):'пауза')+'</em>':'')+'</span>'
    +'<span class="mp-td">'+(MP.miss[t.id]?'нет файла':MP.dur[t.id]?mpFmt(MP.dur[t.id]):'')+'</span>'+btn+'</li>';}
function mpList(){var box=document.getElementById('mpList'),all=mpLib().filter(function(l){return l.cats.some(function(c){return mpIsSaved(c.id);});}),
  W=all.filter(function(l){return l.world;}),N=all.filter(function(l){return !l.world;});
  var cur=MP.mode?MP.a[MP.cur]._t:null,h='';
  function loc(l){var cs=l.cats.filter(function(c){return mpIsSaved(c.id);}),r='';
    r+='<section class="mp-loc" style="--lc:'+l.color+'"><div class="mp-lochead">'+(l.world?'<b>'+esc(l.name)+'</b>':'<a href="'+l.href+'" data-mpgo>'+esc(l.name)+'</a>')
      +'<span>'+esc(l.kind)+(l.world?'':' · '+cs.length+' из '+l.cats.length)+'</span>'
      +(l.world?'':'<button class="dk-x" type="button" data-mpdel="'+cs.map(function(c){return c.id;}).join(',')+'" title="Убрать всю заметку из проигрывателя" aria-label="Убрать заметку">✕</button>')+'</div><div class="mp-cats">';
    cs.forEach(function(c){var catOn=MP.mode==='cat'&&MP.cat===c;
      r+='<section class="mp-catbox mood-'+esc(c.mood||'calm')+(catOn?' on':'')+'"><div class="mp-cathead"><b>'+esc(c.name)+'</b><span>'+esc(MP_MOODS[c.mood]||'')+'</span>'
        +'<button class="mini'+(catOn?' pri':'')+'" type="button" data-mpcat="'+c.id+'">'+(catOn?(MP.on?'⇄ Играет':'⇄ Пауза'):'⇄ Категория')+'</button>'
        +(l.world?'':'<button class="dk-x" type="button" data-mpdel="'+c.id+'" title="Убрать категорию из проигрывателя" aria-label="Убрать категорию">✕</button>')+'</div><ol>';
      c.tracks.forEach(function(t){var lp=cur===t&&MP.mode==='track';
        r+=mpTrackRow(t,'<button class="mini'+(lp?' pri':'')+'" type="button" data-mptrack="'+t.id+'">'+(lp?(MP.on?'↻ Играет':'↻ Пауза'):'↻ Трек')+'</button>');});
      r+='</ol></section>';});
    return r+'</div></section>';}
  if(W.length){h+='<h3 class="mp-grp">Мир и районы</h3>';W.forEach(function(l){h+=loc(l);});}
  h+='<h3 class="mp-grp">Из заметок</h3>';
  if(!N.length)h+='<div class="mp-empty"><b>Из заметок пока ничего не сохранено</b>Открой заметку с музыкой, например «<a href="#/place/eden" data-mpgo>Эден</a>», и сохрани категорию или всю заметку целиком.</div>';
  else N.forEach(function(l){h+=loc(l);});
  box.innerHTML=h;}

/* ── блок «Музыка» на странице заметки ── */
function musicHtml(x){if(!canGm()||!x.music||!x.music.length)return '';
  var n=0;x.music.forEach(function(c){n+=c.tracks.length;});mpProbe();
  return section('Музыка',x.music.length+' категории · '+n+' треков','<div class="mn" id="mnBox" data-href="'+esc(location.hash)+'">'+mnInner(x)+'</div>');}
function mnInner(x){var all=x.music.every(function(c){return mpIsSaved(c.id);}),cur=MP.mode?MP.a[MP.cur]._t:null;
  var h='<div class="mn-top"><p>Сэмпл звучит, пока ты на этой странице, а потом вернётся то, что играло раньше. В проигрыватель сохраняется категория из двух треков или вся заметка целиком.</p>'
    +'<button class="mini'+(all?' pri':'')+'" type="button" data-mnsave="'+x.music.map(function(c){return c.id;}).join(',')+'" data-on="'+(all?0:1)+'">'+(all?'✓ Вся заметка в плеере':'+ Вся заметка в плеер')+'</button></div><div class="mn-grid">';
  x.music.forEach(function(c){var s=mpIsSaved(c.id);
    h+='<article class="mn-cat mood-'+esc(c.mood||'calm')+'"><header><b>'+esc(c.name)+'</b><span>'+esc(MP_MOODS[c.mood]||'')+'</span></header><ol>';
    c.tracks.forEach(function(t){var pv=MP.mode==='preview'&&cur===t&&MP.on;
      h+='<li class="'+(pv?'on':'')+'"><button class="mn-play" type="button" data-mnpv="'+t.id+'" aria-label="'+(pv?'Остановить сэмпл':'Сэмпл')+'">'+(pv?'■':'▶')+'</button>'
        +'<span class="t">'+esc(t.title)+'</span><span class="d">'+(MP.miss[t.id]?'нет файла':MP.dur[t.id]?mpFmt(MP.dur[t.id]):'')+'</span></li>';});
    h+='</ol><button class="mini'+(s?' pri':'')+'" type="button" data-mnsave="'+c.id+'" data-on="'+(s?0:1)+'" title="'+(s?'Нажми, чтобы убрать из проигрывателя':'Сохранить категорию в проигрыватель')+'">'+(s?'✓ В плеере':'+ В плеер')+'</button></article>';});
  return h+'</div>';}
function mnRefresh(){var box=document.getElementById('mnBox');if(!box)return;
  var L=mpLib();for(var k=0;k<L.length;k++)if(L[k].href===box.getAttribute('data-href')){box.innerHTML=mnInner(L[k].x);return;}}

function mpMiss(){var ids=Object.keys(MP.miss),box=document.getElementById('mpMiss');
  if(!ids.length){box.hidden=true;return;}
  var names=ids.map(function(id){var f=mpFind(id);return f?'«'+f.t.file+'»':'';});
  document.getElementById('mpMissText').textContent='Не удалось загрузить: '+names.join(', ')+'. Проверь интернет или укажи файлы вручную.';
  box.hidden=false;mpList();mnRefresh();}
/* длительности: музыку мира проверяем только при открытом проигрывателе (w), чтобы не грузить 21 файл на каждой заметке */
function mpProbe(w){mpLib().forEach(function(l){if(l.world&&!w)return;l.cats.forEach(function(c){c.tracks.forEach(function(t){
  if(MP.dur[t.id]||MP.miss[t.id]||t._probe)return;
  t._probe=1;var p=new Audio(),src=mpSrcs(t),k=0;p.preload='metadata';
  p.onloadedmetadata=function(){MP.dur[t.id]=p.duration;t._probe=0;p.removeAttribute('src');mpList();mnRefresh();};
  p.onerror=function(){if(k<src.length-1){k++;p.src=src[k];return;}t._probe=0;MP.miss[t.id]=true;mpMiss();};
  p.src=src[0];});});});}
/* ручной выбор файлов: подходит файл, в имени которого есть имя трека */
function mpPick(files){var norm=function(s){return s.toLowerCase().replace(/\.[a-z0-9]+$/,'').replace(/[^a-z0-9а-яё]/g,'');};
  var all=[];mpLib().forEach(function(l){l.cats.forEach(function(c){all=all.concat(c.tracks);});});
  Array.prototype.forEach.call(files,function(f){var nf=norm(f.name),best=null;
    all.forEach(function(t){var nt=norm(t.file);
      if((nf.indexOf(nt)>=0||nt.indexOf(nf)>=0)&&(!best||nt.length>norm(best.file).length))best=t;});
    if(best){MP.blob[best.id]=URL.createObjectURL(f);delete MP.miss[best.id];delete MP.dur[best.id];}});
  mpMiss();mpProbe();mpUi();}
function mpMeta(){if(!('mediaSession' in navigator))return;var t=MP.mode?MP.a[MP.cur]._t:null;
  try{navigator.mediaSession.metadata=t?new MediaMetadata({title:t.title,artist:'Кодекс Ночи',album:MP.cat.name}):null;}catch(e){}}
function mpEmbed(){if(!MUSIC_EMBED)return;Object.keys(MUSIC_EMBED).forEach(function(id){try{
  var d=MUSIC_EMBED[id],b=atob(d.slice(d.indexOf(',')+1)),u=new Uint8Array(b.length);
  for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  MP.blob[id]=URL.createObjectURL(new Blob([u],{type:'audio/mpeg'}));}catch(e){}});MUSIC_EMBED=null;}

/* ── меню приложений и окно проигрывателя ── */
function appMenu(open){document.body.classList.toggle('app-open',open);
  document.getElementById('dkFab').setAttribute('aria-expanded',open?'true':'false');}
function mpOpen(){appMenu(false);document.body.classList.add('mp-open');mpProbe(true);mpUi();}
function mpClose(){document.body.classList.remove('mp-open');}

function initMusic(){
  /* игрок: прежняя кнопка «Кости», ни проигрывателя, ни звука, ни меню */
  if(!canGm()){var f0=document.getElementById('dkFab');
    f0.innerHTML='Кости';f0.removeAttribute('aria-haspopup');f0.removeAttribute('aria-expanded');
    f0.addEventListener('click',openDock);
    ['appMenu','mpDock'].forEach(function(id){var e0=document.getElementById(id);if(e0)e0.remove();});
    return;}
  mpEmbed();
  try{MP.saved=JSON.parse(localStorage.getItem('kn-mp-saved')||'[]')||[];}catch(e){MP.saved=[];}
  for(var k=0;k<2;k++){var el=new Audio();el.preload='auto';el._f=1;el.addEventListener('error',mpOnErr);
    el.addEventListener('ended',function(){if(this===MP.a[MP.cur]&&MP.on&&!MP.fading)mpCross(mpNextTrack());});
    el.addEventListener('loadedmetadata',function(){if(this._t){MP.dur[this._t.id]=this.duration;}});
    MP.a.push(el);}
  try{var v=localStorage.getItem('kn-mp-vol');if(v!==null)MP.vol=+v;}catch(e){}
  var vol=document.getElementById('mpVol');vol.value=Math.round(MP.vol*100);
  vol.addEventListener('input',function(){MP.vol=vol.value/100;MP.a.forEach(mpApply);
    try{localStorage.setItem('kn-mp-vol',MP.vol);}catch(e){}});
  setInterval(mpTick,100);
  /* уход со страницы заметки заканчивает сэмпл */
  window.addEventListener('hashchange',function(){if(MP.mode==='preview'&&location.hash!==MP.pvRoute)mpPreviewEnd();});
  var fab=document.getElementById('dkFab');
  fab.addEventListener('click',function(e){e.stopPropagation();appMenu(!document.body.classList.contains('app-open'));});
  document.getElementById('appMenu').addEventListener('click',function(e){var b=e.target.closest('[data-app]');if(!b)return;
    if(b.dataset.app==='dice'){appMenu(false);openDock();}else mpOpen();});
  document.addEventListener('click',function(e){
    if(document.body.classList.contains('app-open')&&!e.target.closest('#appMenu'))appMenu(false);
    var b=e.target.closest('[data-mnpv],[data-mnsave]');if(!b||!e.target.closest('#mnBox'))return;
    if(b.dataset.mnpv){var cur=MP.a[MP.cur]._t;
      if(MP.mode==='preview'&&MP.on&&cur&&cur.id===b.dataset.mnpv)mpPreviewEnd();
      else mpPreview(b.dataset.mnpv,document.getElementById('mnBox').getAttribute('data-href'));}
    else mpSaveIds(b.dataset.mnsave.split(','),b.dataset.on==='1');});
  document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;appMenu(false);if(document.body.classList.contains('mp-open'))mpClose();});
  document.getElementById('mpClose').addEventListener('click',mpClose);
  document.getElementById('mpBack').addEventListener('click',mpClose);
  document.getElementById('mpPlay').addEventListener('click',mpToggle);
  document.getElementById('mpStop').addEventListener('click',mpStop);
  document.getElementById('mpNext').addEventListener('click',function(){if(MP.mode==='cat')mpCross(mpNextTrack());});
  document.getElementById('mpList').addEventListener('click',function(e){
    if(e.target.closest('[data-mpgo]')){mpClose();return;}
    var b=e.target.closest('[data-mpcat],[data-mptrack],[data-mpdel]');if(!b)return;
    if(b.dataset.mpdel)mpSaveIds(b.dataset.mpdel.split(','),false);
    else if(b.dataset.mpcat)mpPlayCat(b.dataset.mpcat);else mpPlayTrack(b.dataset.mptrack);});
  var bar=document.getElementById('mpBar');
  bar.addEventListener('click',function(e){var el=MP.a[MP.cur];if(!el.duration)return;
    if(MP.fading){MP.a[1-MP.cur].pause();MP.fading=false;el._f=1;mpApply(el);}
    var r=bar.getBoundingClientRect();el.currentTime=Math.max(0,Math.min(el.duration-MP.XF-1,(e.clientX-r.left)/r.width*el.duration));mpProg();});
  document.getElementById('mpPick').addEventListener('change',function(){mpPick(this.files);this.value='';});
  if('mediaSession' in navigator){try{
    navigator.mediaSession.setActionHandler('play',function(){if(!MP.on)mpToggle();});
    navigator.mediaSession.setActionHandler('pause',function(){if(MP.on)mpToggle();});
    navigator.mediaSession.setActionHandler('nexttrack',function(){if(MP.mode==='cat')mpCross(mpNextTrack());});
  }catch(e){}}
  mpUi();
}
