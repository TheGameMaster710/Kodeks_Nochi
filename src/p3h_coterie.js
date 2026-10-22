

var LIVE_PCS=[];
var PLAYER_ACCOUNTS=[];
var livePcsUnsub=null,playersUnsub=null;
var COTERIE_PICK=null;

function startCoterieSync(){
  if(KODEKS_PREVIEW&&SESSION&&!LIVE_PCS.length){
    LIVE_PCS=[pcFromFs({id:'preview-demo',_liveKind:'pcs',owner:SESSION.username,name:'Пример персонажа',
      short:'Лист для проверки с телефона — правки не сохраняются после перезагрузки',clan:'Бруха',gen:12,bp:1,
      attrs:{str:3,dex:2,sta:3,cha:2,man:2,com:2,int:1,wit:3,res:2},skills:{bra:3,ath:2,itm:2,str2:2,ste:1,awa:1,dri:1},
      disciplines:[{n:'Могущество',d:2,p:''},{n:'Присутствие',d:1,p:''}],advantages:(typeof MERITS!=='undefined'&&MERITS.length?[{n:MERITS[0].name,d:3,k:'merit',t:'',l:true}]:[]),huntA:'str',huntS:'bra',xpTotal:0,xpSpent:0,
      hunger:1,hMax:6,hSup:0,hAgg:0,wMax:4,wSup:0,wAgg:0,hum:7,stains:0})];
    return;
  }
  if(!fbDb||!SESSION) return;
  if(livePcsUnsub) livePcsUnsub();
  var pcsCol=fbDb.collection('pcs');
  var pcsQuery=(SESSION.role==='master'||SESSION.role==='admin')?pcsCol:pcsCol.where('owner','==',SESSION.username);
  livePcsUnsub=pcsQuery.onSnapshot(function(qs){
    var fresh=[];
    qs.forEach(function(doc){var d=pcFromFs(doc.data());d.id=doc.id;d._liveKind='pcs';fresh.push(d);});
    LIVE_PCS=fresh;
    LIVE_PCS.forEach(function(x){TRK_OBJ[trkKey(x)]=x;});
    refreshPcSelectAfterSync();
    LIVE_PCS.forEach(function(x){refreshTrackers(trkKey(x));});
    rerenderCoterieIfOpen();
  },function(){LIVE_PCS=[];rerenderCoterieIfOpen();});
  if(playersUnsub){playersUnsub();playersUnsub=null;}
  if(SESSION.role==='master'){
    playersUnsub=fbDb.collection('users').where('role','==','player').onSnapshot(function(qs){
      var fresh=[];qs.forEach(function(doc){fresh.push({u:doc.id,name:doc.data().displayName||doc.id});});
      fresh.sort(function(a,b){return a.name<b.name?-1:1;});
      PLAYER_ACCOUNTS=fresh;
      rerenderCoterieIfOpen();
    },function(){PLAYER_ACCOUNTS=[];});
  }
}
function rerenderCoterieIfOpen(){
  var mount=document.getElementById('pcFormMount');
  if(mount&&mount.innerHTML.trim()) return;
  var h=location.hash.replace(/^#\/?/,''),m;
  if((m=/^coterie\/([\w-]+)$/.exec(h))&&SHEET_EDIT[m[1]]) return;
  if(h==='cat/players'){viewPlayers();return;}
  if((m=/^coterie\/([\w-]+)$/.exec(h))){viewLivePC(m[1]);return;}
}

function myLivePcs(){return SESSION?LIVE_PCS.filter(function(p){return p.owner===SESSION.username;}):[];}
function livePcsOf(u){return LIVE_PCS.filter(function(p){return p.owner===u;});}
function findLivePc(id){for(var i=0;i<LIVE_PCS.length;i++)if(LIVE_PCS[i].id===id)return LIVE_PCS[i];return null;}

function pcMiniList(list){
  if(!list.length) return '<div class="tsub">Пока никого.</div>';
  return '<div class="pc-mini-list">'+list.map(function(x){
    return '<div class="row"><a href="#/coterie/'+x.id+'">'+esc(x.name)+(x.dead?' ☾':'')+'</a>'+
      '<span class="tag">'+esc(x.clan||'—')+'</span></div>';}).join('')+'</div>';
}
function coterieLiveHtml(){
  if(!SESSION) return '';
  var role=SESSION.role,mine=myLivePcs();
  var out='<div class="pc-panel"><h3>Мои персонажи</h3><p class="sub">Заводите и правите прямо здесь — '+
    (role==='player'?'видят ещё мастер (через панель ниже) и админ':'видит ещё админ')+
    ', редактируете только вы, даже они.</p>'+
    pcMiniList(mine)+
    '<div class="u-mt12 ctl"><button class="mini pri" type="button" id="pcNewBtn">+ Создать персонажа</button></div>'+
    '<div id="pcFormMount"></div></div>';
  if(role==='master'){
    out+='<div class="pc-panel"><h3>Персонажи игроков</h3><p class="sub">Выберите игрока, чтобы заглянуть в его лист — правка недоступна, только просмотр.</p>'+
      '<div class="pc-pick"><select id="pcPickPlayer"><option value="">— выберите игрока —</option>'+
      PLAYER_ACCOUNTS.map(function(a){return '<option value="'+esc(a.u)+'"'+(COTERIE_PICK===a.u?' selected':'')+'>'+esc(a.name)+' (@'+esc(a.u)+')</option>';}).join('')+
      '</select></div>'+
      (COTERIE_PICK?pcMiniList(livePcsOf(COTERIE_PICK)):(PLAYER_ACCOUNTS.length?'':'<div class="tsub">Ни у одного игрока пока нет учётной записи — заведите через «пользователи».</div>'))+
      '</div>';
  } else if(role==='admin'){
    var others=LIVE_PCS.filter(function(x){return x.owner!==SESSION.username;});
    out+='<div class="pc-panel"><h3>Все чарники (админ)</h3><p class="sub">Видно автоматически, без выбора — просмотр, правка только у владельца.</p>'+
      (others.length?'<div class="pc-mini-list">'+others.map(function(x){return '<div class="row"><a href="#/coterie/'+x.id+'">'+esc(x.name)+'</a><span class="tag">@'+esc(x.owner)+'</span></div>';}).join('')+'</div>'
        :'<div class="tsub">Пока никто, кроме вас, персонажа не завёл.</div>')+
      '</div>';
  }
  return out;
}
function wireCoterieLive(container){
  if(!SESSION) return;
  var newBtn=container.querySelector('#pcNewBtn');
  if(newBtn) newBtn.addEventListener('click',function(){openPcForm(null,'pcFormMount');});
  var pick=container.querySelector('#pcPickPlayer');
  if(pick) pick.addEventListener('change',function(){COTERIE_PICK=pick.value||null;viewPlayers();});
}

function viewLivePC(id){
  var x=findLivePc(id);
  setTheme('player');
  if(!x){
    crumb([['Котерия','#/cat/players']]);
    app.innerHTML='<div class="wrap rise"><a class="back" href="#/cat/players">← котерия</a>'+
      emptyBox('Персонаж недоступен','Либо данные ещё загружаются, либо у вас нет прав его видеть, либо он удалён.')+'</div>';
    return;
  }
  TRK_OBJ[trkKey(x)]=x;
  crumb([['Котерия','#/cat/players'],[x.name]]);
  var editable=canEditLivePc(x);
  var strip=[['Клан',x.clan?wikiTag(x.clan,esc(x.clan)):'',1],['Секта',x.sect?wikiTag(x.sect,esc(x.sect)):'',1],
    ['Поколение',x.gen||''],['Мощь крови',x.bp!=null?String(x.bp):''],['Тип хищника',x.predator?wikiTag(x.predator,esc(x.predator)):'',1],
    ['Сир',x.sire?nameLink(x.sire):'',1]];
  var out='<div class="wrap rise"><a class="back" href="#/cat/players">← котерия</a>'+
    jcard(x,'персонаж игрока · @'+esc(x.owner)+(editable?'':' · только просмотр'),strip)+
    section('Трекеры','живой лист — Firestore',trackerHtml(x))+
    sheetHtml(x,editable);
  if(x.convictions&&x.convictions.length) out+=section('Убеждения и Якоря',x.convictions.length,tableHtml({head:['Убеждение','Якорь'],
    rows:x.convictions.map(function(v){return [v[0],v[1]?'[['+v[1]+']]':'—'];})}));
  if(x.concept&&x.concept.length) out+=section('Концепция','',defsHtml(x.concept));
  if(editable) out+='<div class="u-m18-0-0 ctl"><button class="mini pri" type="button" id="pcEditBtn">Анкета: имя, клан, поколение, Убеждения…</button></div><div id="pcFormMount"></div>';
  app.innerHTML=out+'<div class="u-h30"></div></div>';
  wireTrackers(app);
  if(editable){
    var eb=document.getElementById('pcEditBtn');
    if(eb) eb.addEventListener('click',function(){openPcForm(x,'pcFormMount');});
  }
}

function pcFormHtml(x){
  x=x||{};var tr=x.track||{};
  var concept=x.concept||[],conv=x.convictions||[];
  function rowConcept(i){var c=concept[i]||[];return '<div class="rep-row">'+growTa('pcf_cL'+i,c[0],'Например: Возраст')+growTa('pcf_cT'+i,c[1],'Текст')+'</div>';}
  function rowConv(i){var c=conv[i]||[];return '<div class="rep-row">'+growTa('pcf_bB'+i,c[0],'Убеждение')+growTa('pcf_bA'+i,c[1],'Якорь (имя)')+'</div>';}
  return '<div class="pc-form">'+
    '<label>Имя персонажа *</label>'+growTa('pcf_name',x.name)+
    '<label>Краткое описание</label>'+growTa('pcf_short',x.short)+
    '<div class="g2"><div><label>Клан</label><select id="pcf_clan">'+optList(allClanNames(),x.clan)+'</select></div>'+
    '<div><label>Секта</label><select id="pcf_sect">'+optList(allSectNames(),x.sect)+'</select></div></div>'+
    '<div class="g4"><div><label>Поколение</label><input id="pcf_gen" type="number" min="4" max="16" value="'+(x.gen!=null?x.gen:'')+'"></div>'+
    '<div><label>Мощь крови</label><input id="pcf_bp" type="number" min="0" max="10" value="'+(x.bp!=null?x.bp:0)+'"></div>'+
    '<div><label>Тип хищника</label><select id="pcf_pred">'+optList(allPredNames(),x.predator)+'</select></div>'+
    '<div><label>Сир</label>'+growTa('pcf_sire',x.sire)+'</div></div>'+
    '<div class="g4"><div><label>Человечность</label><input id="pcf_hum" type="number" min="0" max="10" value="'+(tr.humanity!=null?tr.humanity:7)+'"></div>'+
    '<div><label>Голод (стартовый)</label><input id="pcf_hun" type="number" min="0" max="5" value="'+(tr.hunger!=null?tr.hunger:1)+'"></div>'+
    '<div class="u-span2 u-as-e tsub">Здоровье и сила воли считаются сами из атрибутов на листе (Выносливость + 3, Самообладание + Решимость).</div></div>'+
    '<div class="rep-head">Концепция (по желанию — короткие факты о персонаже)</div>'+[0,1,2,3].map(rowConcept).join('')+
    '<div class="rep-head">Убеждения и Якоря (по желанию)</div>'+[0,1,2].map(rowConv).join('')+
    '<div class="err" id="pcfErr"></div>'+
    '<div class="actions"><button class="mini pri" type="button" data-pcf="save">'+(x.id?'Сохранить':'Создать персонажа')+'</button>'+
    '<button class="mini" type="button" data-pcf="cancel">Отмена</button>'+
    (x.id?'<button class="u-ml-auto u-c-bad mini" type="button" data-pcf="del">Удалить персонажа</button>':'')+
    '</div></div>';
}
function pcFormRead(){
  function v(id){var el=document.getElementById(id);return el?el.value.trim():'';}
  var name=v('pcf_name');
  if(!name) return {err:'Укажите имя персонажа.'};
  function rows(n,idA,idB){var out=[];for(var i=0;i<n;i++){var a=v(idA+i),b=v(idB+i);if(a||b)out.push([a,b]);}return out;}
  var data={
    name:name,short:v('pcf_short'),clan:v('pcf_clan'),sect:v('pcf_sect'),
    gen:v('pcf_gen')?+v('pcf_gen'):null,bp:v('pcf_bp')!==''?+v('pcf_bp'):0,
    predator:v('pcf_pred'),sire:v('pcf_sire'),
    concept:rows(4,'pcf_cL','pcf_cT'),
    convictions:rows(3,'pcf_bB','pcf_bA'),
    track:{humanity:v('pcf_hum')!==''?+v('pcf_hum'):7,hunger:v('pcf_hun')!==''?+v('pcf_hun'):1}
  };
  return {data:data};
}
function pcFormSave(existing){
  var r=pcFormRead(),err=document.getElementById('pcfErr');
  if(r.err){err.textContent=r.err;return;}
  if(!fbDb){err.textContent=KODEKS_PREVIEW?'В предпросмотре без сервера новые персонажи не сохраняются — посмотрите лист на готовом примере.':'Нет соединения с Firebase — обновите страницу и попробуйте ещё раз.';return;}
  var data=pcToFs(r.data),btn=document.querySelector('[data-pcf="save"]');
  if(btn){btn.disabled=true;btn.textContent='Сохранение…';}
  var p;
  if(existing&&existing.id){
    data.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
    data.updatedBy=SESSION.username;
    p=fbDb.collection('pcs').doc(existing.id).set(data,{merge:true}).then(function(){return existing.id;});
  } else {
    data.owner=SESSION.username;
    data.attrs={};data.skills={};data.disciplines=[];data.advantages=[];
    var dv=pcDerived(data);
    data.hunger=data.track.hunger;data.hMax=dv.hMax;data.hSup=0;data.hAgg=0;
    data.wMax=dv.wMax;data.wSup=0;data.wAgg=0;data.hum=data.track.humanity;data.stains=0;
    data.createdAt=firebase.firestore.FieldValue.serverTimestamp();
    data.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
    data.updatedBy=SESSION.username;
    p=fbDb.collection('pcs').add(data).then(function(ref){return ref.id;});
  }
  p.then(function(newId){
    closePcForm();
    location.hash='#/coterie/'+newId;
    if(location.hash==='#/coterie/'+newId) rerenderCoterieIfOpen();
  }).catch(function(e){
    if(btn){btn.disabled=false;btn.textContent=existing&&existing.id?'Сохранить':'Создать персонажа';}
    if(err) err.textContent=(e&&e.code==='permission-denied')
      ? 'Firestore отказал в доступе. Похоже, в Firebase Console ещё не опубликованы обновлённые правила (firestore.rules, коллекция pcs) — вставьте файл целиком в Firestore Database → Rules → Publish и попробуйте снова.'
      : 'Не получилось: '+esc(e.message||String(e));
  });
}
function openPcForm(existing,mountId){
  var box=document.getElementById(mountId);
  if(!box) return;
  box.innerHTML=pcFormHtml(existing||{});
  box.scrollIntoView({behavior:'smooth',block:'start'});
  [].forEach.call(box.querySelectorAll('[data-pcf]'),function(btn){
    btn.addEventListener('click',function(){
      var a=btn.getAttribute('data-pcf');
      if(a==='save') pcFormSave(existing);
      else if(a==='cancel'){box.innerHTML='';}
      else if(a==='del'){
        if(!existing||!existing.id) return;
        if(!confirm('Удалить персонажа «'+existing.name+'» без возможности восстановить?')) return;
        fbDb.collection('pcs').doc(existing.id).delete().then(function(){location.hash='#/cat/players';})
          .catch(function(e){alert('Не получилось: '+(e.message||e));});
      }
    });
  });
}
function closePcForm(){var box=document.getElementById('pcFormMount');if(box)box.innerHTML='';}
