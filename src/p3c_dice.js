
/* ================= ТРЕКЕРЫ ПЕРСОНАЖЕЙ ================= */
var TRK_OBJ={};
function trkKey(x){return (x._liveKind==='pcs'?'lpc:':PCS.indexOf(x)>-1?'pc:':PEOPLE.indexOf(x)>-1?'person:':'threat:')+x.id;}
function trkDefault(x){var t=x.track||{};
  return {hunger:t.hunger!=null?t.hunger:1,hMax:t.healthMax||7,hSup:0,hAgg:0,wMax:t.wpMax||5,wSup:0,wAgg:0,
    hum:t.humanity!=null?t.humanity:7,stains:0};}
function trkGet(key){var x=TRK_OBJ[key];if(!x)return null;
  var d=trkDefault(x);
  if(x._liveKind==='pcs'){
    /* самостоятельный чарник — снимок Firestore лежит прямо в x (см. p3h_coterie.js) */
    ['hunger','hMax','hSup','hAgg','wMax','wSup','wAgg','hum','stains'].forEach(function(k){if(x[k]!=null)d[k]=x[k];});
  } else if(isLivePc(x)){
    var live=PCSTATE_CACHE[key];
    if(live) for(var k in d) if(live[k]!=null) d[k]=live[k];
  } else {
    var s=STORE.get('trk:'+key,null);
    if(s) for(var k2 in d) if(s[k2]!=null) d[k2]=s[k2];
  }
  d.hMax=(x.track&&x.track.healthMax)||d.hMax;d.wMax=(x.track&&x.track.wpMax)||d.wMax;
  if(x._liveKind==='pcs'&&x.attrs){var dv=pcDerived(x);d.hMax=dv.hMax;d.wMax=dv.wMax;} /* интерактивный чарник: из атрибутов, p3j_sheet.js */
  return d;}
function trkSet(key,st){
  var x=TRK_OBJ[key];
  if(isLivePc(x)&&!canEditLivePc(x)){refreshTrackers(key);return;} /* нет прав на этот живой лист — откатываем показ к последнему известному состоянию */
  st.hunger=Math.max(0,Math.min(5,st.hunger));st.hum=Math.max(0,Math.min(10,st.hum));st.stains=Math.max(0,Math.min(10,st.stains));
  ['h','w'].forEach(function(p){var mx=st[p+'Max'];st[p+'Agg']=Math.max(0,Math.min(mx,st[p+'Agg']));st[p+'Sup']=Math.max(0,Math.min(mx-st[p+'Agg'],st[p+'Sup']));});
  STORE.set('trk:'+key,st); /* локальная копия всегда — офлайн-страховка, а для NPC/угроз это и есть единственное хранилище */
  if(x&&x._liveKind==='pcs') for(var sk in st) x[sk]=st[sk]; /* свой лист: сразу в объект — бросок видит новый Голод до ответа сервера, а предпросмотр без сервера вообще только так и работает */
  if(isLivePc(x)){if(x._liveKind!=='pcs')PCSTATE_CACHE[key]=st;pcSyncWrite(x,st);}
  refreshTrackers(key);}
function damage(st,p,kind,sign){
  var mx=st[p+'Max'];
  if(sign<0){if(kind==='s')st[p+'Sup']--;else st[p+'Agg']--;return;}
  var free=mx-st[p+'Sup']-st[p+'Agg'];
  if(kind==='s'){if(free>0)st[p+'Sup']++;else if(st[p+'Sup']>0){st[p+'Sup']--;st[p+'Agg']++;}}
  else{if(free>0)st[p+'Agg']++;else if(st[p+'Sup']>0){st[p+'Sup']--;st[p+'Agg']++;}}
}
function boxes(max,agg,sup){var s='';for(var i=0;i<max;i++){
  var c=i<agg?'a':i<agg+sup?'s':'';s+='<span class="box '+c+'" style="display:inline-grid;place-items:center;cursor:default">'+(c==='a'?'✕':c==='s'?'╱':'')+'</span>';}return s;}
function trkInner(key){
  var x=TRK_OBJ[key],live=isLivePc(x);
  if(live&&x._liveKind!=='pcs'&&!(key in PCSTATE_CACHE)) return '<div class="trk"><div class="tsync load">Загрузка живого листа…</div></div>';
  var st=trkGet(key);if(!st)return '';
  var editable=!live||canEditLivePc(x);
  function ctl(html){return editable?html:'';}
  var hFull=st.hSup+st.hAgg>=st.hMax,wFull=st.wSup+st.wAgg>=st.wMax;
  var pips='';for(var i=1;i<=5;i++){var on=i<=st.hunger;
    pips+=editable?('<button class="pip'+(on?' on':'')+'" type="button" data-act="hun" data-v="'+i+'" title="Голод '+i+'"></button>')
                  :('<span class="pip'+(on?' on':'')+'" style="cursor:default" title="Голод '+i+'"></span>');}
  var hum='';for(var j=0;j<10;j++){var filled=j<st.hum,stn=j>=10-st.stains;
    hum+='<span class="box'+(filled?' h':'')+(stn?' st':'')+'" style="display:inline-grid;place-items:center;cursor:default">'+(stn?'╱':'')+'</span>';}
  var remorseDice=Math.max(1,10-st.hum-st.stains);
  var sync=live?('<div class="tsync">● живой лист'+(editable?' — правки видят все за столом':' игрока @'+esc(x.owner)+' — только просмотр')+'</div>'):'';
  return sync+'<div class="trk">'+
   '<div class="tbox"><div class="th"><b>Голод</b><span class="val">'+st.hunger+'</span></div><div class="pips">'+pips+'</div>'+
     ctl('<div class="ctl"><button class="mini" data-act="hun0">сбросить в 0</button><button class="mini pri" data-act="rouse">Пробуждение</button></div>')+
     (st.hunger>=5?'<div class="warn">Голод 5: проверки пробуждения невозможны, Зверь у самой поверхности.</div>':'')+'</div>'+
   '<div class="tbox"><div class="th"><b>Здоровье</b><span class="val">'+(st.hMax-st.hSup-st.hAgg)+'/'+st.hMax+'</span></div><div class="pips">'+boxes(st.hMax,st.hAgg,st.hSup)+'</div>'+
     ctl('<div class="ctl"><button class="mini" data-act="d" data-p="h" data-k="s">+ ╱</button><button class="mini" data-act="d" data-p="h" data-k="a">+ ✕</button>'+
     '<button class="mini" data-act="h" data-p="h" data-k="s">− ╱</button><button class="mini" data-act="h" data-p="h" data-k="a">− ✕</button></div>')+
     (st.hAgg>=st.hMax?'<div class="warn">Все клетки тяжёлые: торпор.</div>':hFull?'<div class="warn">Ослаблен: −2 к физическим пулам.</div>':'')+'</div>'+
   '<div class="tbox"><div class="th"><b>Сила воли</b><span class="val">'+(st.wMax-st.wSup-st.wAgg)+'/'+st.wMax+'</span></div><div class="pips">'+boxes(st.wMax,st.wAgg,st.wSup)+'</div>'+
     ctl('<div class="ctl"><button class="mini" data-act="d" data-p="w" data-k="s">+ ╱</button><button class="mini" data-act="d" data-p="w" data-k="a">+ ✕</button>'+
     '<button class="mini" data-act="h" data-p="w" data-k="s">− ╱</button><button class="mini" data-act="h" data-p="w" data-k="a">− ✕</button></div>')+
     (wFull?'<div class="warn">Ослаблен: −2 к социальным и ментальным пулам.</div>':'')+'</div>'+
   '<div class="tbox"><div class="th"><b>Человечность</b><span class="val">'+st.hum+'</span></div><div class="pips">'+hum+'</div>'+
     ctl('<div class="ctl"><button class="mini" data-act="hum" data-v="-1">− Чел.</button><button class="mini" data-act="hum" data-v="1">+ Чел.</button>'+
     '<button class="mini" data-act="stn" data-v="1">+ Скверна</button><button class="mini" data-act="stn" data-v="-1">− Скверна</button>'+
     '<button class="mini pri" data-act="remorse" title="Кубов: '+remorseDice+'">Раскаяние ('+remorseDice+'к)</button></div>')+
     (st.stains>10-st.hum?'<div class="warn">Скверна залезла на Человечность: персонаж ослаблен, деградация.</div>':'')+
     '<div class="tsub">Проверка раскаяния — в конце сессии, если есть Скверна.</div></div>'+
   '</div>'+ctl('<div class="ctl" style="margin-top:8px"><button class="mini" data-act="reset" title="Вернуть стартовые значения персонажа">Сброс к стартовым</button></div>');
}
function trackerHtml(x){var key=trkKey(x);TRK_OBJ[key]=x;return '<div class="trkwrap" data-trk="'+key+'">'+trkInner(key)+'</div>';}
function refreshTrackers(key){
  [].forEach.call(document.querySelectorAll('[data-trk="'+key+'"]'),function(el){el.innerHTML=trkInner(key);});
  [].forEach.call(document.querySelectorAll('[data-mini="'+key+'"]'),function(el){el.innerHTML=miniPips(key);});
  if(dkPc&&dkPc.value===key) dkHun.value=trkGet(key).hunger;
}
function remorse(key){
  var x=TRK_OBJ[key],st=trkGet(key);
  if(!st.stains){pushLog('Раскаяние · '+x.name,'Скверны нет — проверка не нужна','—','');return;}
  var n=Math.max(1,10-st.hum-st.stains),r=[],ok=false;
  for(var i=0;i<n;i++){var v=d(10);r.push(v);if(v>=6)ok=true;}
  if(ok){st.stains=0;}else{st.hum-=1;st.stains=0;}
  trkSet(key,st);
  pushLog('Раскаяние · '+x.name,'['+r.join(' ')+']',ok?'Сохранил':'−1 Чел.',ok?'ok':'no');
  openDock();
}
function onTrk(e){
  var b=e.target.closest('[data-act]');if(!b)return;
  var w=b.closest('[data-trk],[data-mini]');if(!w)return;
  var key=w.getAttribute('data-trk')||w.getAttribute('data-mini'),st=trkGet(key),a=b.getAttribute('data-act'),v=+b.getAttribute('data-v');
  if(a==='hun'){st.hunger=(st.hunger===v)?v-1:v;}
  else if(a==='hun0') st.hunger=0;
  else if(a==='d') damage(st,b.getAttribute('data-p'),b.getAttribute('data-k'),1);
  else if(a==='h') damage(st,b.getAttribute('data-p'),b.getAttribute('data-k'),-1);
  else if(a==='hum') st.hum+=v;
  else if(a==='stn') st.stains+=v;
  else if(a==='remorse'){remorse(key);return;}
  else if(a==='rouse'){rouseFor(key,false);return;}
  else if(a==='reset'){
    var x2=TRK_OBJ[key];
    if(isLivePc(x2)&&!canEditLivePc(x2)){refreshTrackers(key);return;}
    STORE.del('trk:'+key);
    if(isLivePc(x2)){var d0=trkDefault(x2);if(x2._liveKind!=='pcs')PCSTATE_CACHE[key]=d0;pcSyncWrite(x2,d0);}
    refreshTrackers(key);return;
  }
  else return;
  trkSet(key,st);
}
function wireTrackers(){}  /* делегирование висит на document — см. initDock() */
function miniPips(key){var st=trkGet(key),s='';
  for(var i=1;i<=5;i++) s+='<button class="pip'+(i<=st.hunger?' on':'')+'" type="button" data-act="hun" data-v="'+i+'"></button>';
  return '<div class="pips">'+s+'</div>';}

/* ================= КОСТИ V5 ================= */
function d(n){return 1+Math.floor(Math.random()*n);}
var LOG=[],LAST=null,dock,dkPc,dkHun,dkPool,dkDif,dkOut,dkLog,dkWp;
function pushLog(label,detailText,total,cls){
  LOG.unshift({l:label,d:detailText,t:total,c:cls||''});if(LOG.length>40)LOG.pop();
  dkLog.innerHTML=LOG.slice(0,20).map(function(e){return '<li><span class="f">'+esc(e.l)+' · '+esc(e.d)+'</span><span class="t '+e.c+'">'+esc(String(e.t))+'</span></li>';}).join('');
  document.getElementById('dkLast').textContent=label+' → '+total;
}
function openDock(){dock.classList.remove('min');document.getElementById('dkHint').textContent='свернуть';}
function evalPool(r){
  var succ=0,tens=0,hTen=false,hOne=false;
  r.dice.forEach(function(x){if(x.v>=6)succ++;if(x.v===10){tens++;if(x.h)hTen=true;}if(x.h&&x.v===1)hOne=true;});
  var pairs=Math.floor(tens/2);succ+=pairs*2;
  var crit=pairs>0,messy=crit&&hTen,D=r.dif,v={succ:succ,crit:crit,messy:messy,hOne:hOne};
  if(D>0){
    var win=succ>=D;v.cls=win?(messy?'messy':'win'):(hOne?'bestial':'fail');
    v.title=win?(messy?'Грязный крит':crit?'Критический успех':'Успех'):(hOne?'Звериный провал':succ===0?'Полный провал':'Провал');
    v.text=succ+' усп. против сложности '+D+(win?' · перевес '+(succ-D):' · не хватило '+(D-succ));
    if(win&&messy) v.text+=' · успех, но Зверь берёт своё: одержимость или последствия по решению рассказчика';
    if(!win&&hOne) v.text+=' · провал с участием Зверя: одержимость или иная беда';
  }else{
    v.cls=messy?'messy':'win';v.title=succ+' '+plural(succ,'успех','успеха','успехов');
    var f=[];if(crit)f.push(messy?'грязный крит (если бросок успешен)':'критический успех (если бросок успешен)');
    if(hOne)f.push('звериный провал, если бросок провален');if(!succ)f.push('ни одного успеха');
    v.text=f.join(' · ')||'сложность не задана — сравните с ней сами';
  }
  return v;
}
function renderRoll(){
  var r=LAST,v=evalPool(r);
  dkOut.innerHTML='<div class="dice">'+r.dice.map(function(x,i){
    var c='die'+(x.h?' h':'')+(x.v>=6?' succ':'')+(x.v===10?' ten':'')+(x.h&&x.v===1?' one':'')+(x.sel?' sel':'')+(x.rr?' rr':'');
    return '<button type="button" class="'+c+'" data-i="'+i+'" title="'+(x.h?'кость Голода':'обычная кость')+'">'+x.v+'</button>';}).join('')+'</div>'+
    '<div class="verdict '+v.cls+'"><h5>'+v.title+'</h5>'+esc(v.text)+'</div>';
  dkWp.disabled=r.wpUsed||!r.dice.some(function(x){return !x.h;});
  return v;
}
function rollPool(pool,hunger,dif,label){
  pool=Math.max(1,Math.min(30,+pool||1));hunger=Math.max(0,Math.min(5,+hunger||0));
  var h=Math.min(hunger,pool),dice=[];
  for(var i=0;i<pool;i++) dice.push({v:d(10),h:i>=pool-h});
  LAST={dice:dice,dif:+dif||0,pool:pool,hunger:h,wpUsed:false,label:label||'Пул '+pool};
  var v=renderRoll();
  pushLog(LAST.label+' · Голод '+h+(LAST.dif?' · сл. '+LAST.dif:''),dice.map(function(x){return (x.h?'h':'')+x.v;}).join(' '),v.title,
    v.cls==='win'?'ok':(v.cls==='fail'||v.cls==='bestial')?'no':'');
  openDock();
}
function wpReroll(){
  if(!LAST||LAST.wpUsed)return;
  var sel=LAST.dice.filter(function(x){return x.sel&&!x.h;});
  if(!sel.length) sel=LAST.dice.filter(function(x){return !x.h&&x.v<6;}).slice(0,3);
  if(!sel.length){pushLog('Переброс СВ','нечего перебрасывать — провалов на обычных костях нет','—');return;}
  LAST.dice.forEach(function(x){x.rr=false;});
  sel.slice(0,3).forEach(function(x){x.v=d(10);x.sel=false;x.rr=true;});
  LAST.wpUsed=true;
  var key=dkPc.value;if(key&&TRK_OBJ[key]){var st=trkGet(key);damage(st,'w','s',1);trkSet(key,st);}
  var v=renderRoll();
  pushLog('Переброс СВ ('+sel.length+')'+(key&&TRK_OBJ[key]?' · −1 СВ '+TRK_OBJ[key].name:''),LAST.dice.map(function(x){return (x.h?'h':'')+x.v;}).join(' '),v.title,
    v.cls==='win'?'ok':(v.cls==='fail'||v.cls==='bestial')?'no':'');
}
function rouseFor(key,twice){
  var x=key?TRK_OBJ[key]:null,st=x?trkGet(key):null;
  if(st&&st.hunger>=5){pushLog('Пробуждение · '+x.name,'Голод 5 — проверка невозможна','Голод 5','no');openDock();return;}
  var a=d(10),b=twice?d(10):null,ok=a>=6||(b!=null&&b>=6);
  if(st&&!ok){st.hunger+=1;trkSet(key,st);}
  pushLog('Пробуждение'+(twice?' с перебросом':'')+(x?' · '+x.name:''),'['+a+(b!=null?' / '+b:'')+']',ok?'Голод тот же':'+1 Голод',ok?'ok':'no');
  if(!x&&!ok){dkHun.value=Math.min(5,(+dkHun.value||0)+1);}
  openDock();
}

/* текстовые формулы → кнопки: «пул 6», «пул 6 / сл. 3», «проверка пробуждения», «2к10+1» */
var ROLL_RE=/(пул\s+(\d{1,2})(?:\s*[\/,;]\s*сл\.?\s*(\d{1,2}))?)|(проверк[аеуи]\s+пробуждения)|((\d{0,2})[кК](\d{1,3})(?:\s*([+−–-])\s*(\d{1,3}))?)/gi;
function activateRolls(root){
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),skip={BUTTON:1,SCRIPT:1,STYLE:1,A:1,TEXTAREA:1,INPUT:1,SELECT:1,OPTION:1},targets=[],node;
  while((node=walker.nextNode())){var par=node.parentNode;
    if(!par||skip[par.nodeName]||(par.closest&&par.closest('a,button,svg,.srch-res,.dock')))continue;
    ROLL_RE.lastIndex=0;if(ROLL_RE.test(node.nodeValue))targets.push(node);}
  targets.forEach(function(n){
    var txt=n.nodeValue,frag=document.createDocumentFragment(),last=0,m,made=0;ROLL_RE.lastIndex=0;
    while((m=ROLL_RE.exec(txt))){
      var prev=m.index>0?txt.charAt(m.index-1):'';
      if(/[0-9A-Za-zА-Яа-яЁё]/.test(prev))continue;
      var b=document.createElement('button');b.type='button';b.className='roll';b.textContent=m[0];
      if(m[1]){b.dataset.pool=m[2];if(m[3])b.dataset.dif=m[3];}
      else if(m[4]){b.dataset.rouse='1';}
      else{var sides=+m[7],cnt=m[6]?+m[6]:1;if([2,3,4,6,8,10,12,20,100].indexOf(sides)<0||cnt<1||cnt>30)continue;
        b.dataset.n=cnt;b.dataset.s=sides;b.dataset.m=m[9]?(m[8]==='+'?1:-1)*(+m[9]):0;}
      if(m.index>last)frag.appendChild(document.createTextNode(txt.slice(last,m.index)));
      frag.appendChild(b);last=m.index+m[0].length;made++;}
    if(!made)return;
    if(last<txt.length)frag.appendChild(document.createTextNode(txt.slice(last)));
    n.parentNode.replaceChild(frag,n);});
}
function onRollClick(e){
  var die=e.target.closest('.die');
  if(die&&LAST&&!LAST.wpUsed){var x=LAST.dice[+die.dataset.i];
    if(x&&!x.h){var n=LAST.dice.filter(function(y){return y.sel;}).length;if(x.sel||n<3)x.sel=!x.sel;renderRoll();}return;}
  var btn=e.target.closest('.roll');if(!btn)return;
  e.preventDefault();
  if(btn.dataset.pool){dkPool.value=btn.dataset.pool;dkDif.value=btn.dataset.dif||0;rollPool(dkPool.value,dkHun.value,dkDif.value,btn.textContent);return;}
  if(btn.dataset.rouse){rouseFor(dkPc.value||null,false);return;}
  var tot=0,rs=[];for(var i=0;i<+btn.dataset.n;i++){var v=d(+btn.dataset.s);rs.push(v);tot+=v;}tot+=+btn.dataset.m;
  var nx=btn.nextSibling;if(nx&&nx.nodeType===1&&nx.classList.contains('rollres'))nx.remove();
  var s=document.createElement('span');s.className='rollres';s.textContent=tot;btn.parentNode.insertBefore(s,btn.nextSibling);
  pushLog(btn.textContent,'['+rs.join(' ')+']',tot);
}
function fillPcSelect(){
  var opts='<option value="">— вручную —</option>';
  PCS.forEach(function(x){var k=trkKey(x);TRK_OBJ[k]=x;opts+='<option value="'+k+'">'+esc(x.name)+'</option>';});
  LIVE_PCS.forEach(function(x){var k=trkKey(x);TRK_OBJ[k]=x;opts+='<option value="'+k+'">'+esc(x.name)+' (свой лист)</option>';});
  PEOPLE.concat(THREATS).filter(function(x){return x.track;}).forEach(function(x){var k=trkKey(x);TRK_OBJ[k]=x;opts+='<option value="'+k+'">'+esc(x.name)+' (РС)</option>';});
  dkPc.innerHTML=opts;
}
/* Вызывается из p3h_coterie.js при каждом обновлении LIVE_PCS (onSnapshot) —
   пересобирает список дока костей, не теряя текущий выбор пользователя. */
function refreshPcSelectAfterSync(){
  if(!dkPc) return;
  var prev=dkPc.value;
  fillPcSelect();
  if(prev && TRK_OBJ[prev]) dkPc.value=prev;
  if(dkPc.value) dkHun.value=trkGet(dkPc.value).hunger;
}
function initDock(){
  dock=document.getElementById('dock');dkPc=document.getElementById('dkPc');dkHun=document.getElementById('dkHun');
  dkPool=document.getElementById('dkPool');dkDif=document.getElementById('dkDif');dkOut=document.getElementById('dkOut');
  dkLog=document.getElementById('dkLog');dkWp=document.getElementById('dkWp');
  fillPcSelect();
  var last=STORE.get('dock',null);if(last){dkPool.value=last.p||5;dkDif.value=last.d||0;if(last.k&&TRK_OBJ[last.k])dkPc.value=last.k;}
  if(dkPc.value) dkHun.value=trkGet(dkPc.value).hunger;
  function save(){STORE.set('dock',{p:dkPool.value,d:dkDif.value,k:dkPc.value});}
  [dkPool,dkDif].forEach(function(i){i.addEventListener('change',save);});
  dkPc.addEventListener('change',function(){if(dkPc.value)dkHun.value=trkGet(dkPc.value).hunger;save();});
  dkHun.addEventListener('change',function(){var k=dkPc.value;if(k){var st=trkGet(k);st.hunger=+dkHun.value;trkSet(k,st);}});
  document.getElementById('dkHead').addEventListener('click',function(){dock.classList.toggle('min');
    document.getElementById('dkHint').textContent=dock.classList.contains('min')?'развернуть':'свернуть';});
  document.getElementById('dkRoll').addEventListener('click',function(){rollPool(dkPool.value,dkHun.value,dkDif.value,dkPc.value?TRK_OBJ[dkPc.value].name+' · пул '+dkPool.value:null);});
  document.getElementById('dkRouse').addEventListener('click',function(){rouseFor(dkPc.value||null,false);});
  document.getElementById('dkRouse2').addEventListener('click',function(){rouseFor(dkPc.value||null,true);});
  dkWp.addEventListener('click',wpReroll);
  document.getElementById('dkClear').addEventListener('click',function(){LOG=[];LAST=null;dkLog.innerHTML='';dkOut.innerHTML='';dkWp.disabled=true;
    document.getElementById('dkLast').textContent='пул · голод · сложность';});
  document.addEventListener('click',onRollClick);
  document.addEventListener('click',onTrk);
}
