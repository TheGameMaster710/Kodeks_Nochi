
/* ================= ЖИВЫЕ ЛИСТЫ ПЕРСОНАЖЕЙ (Firestore, с v1.35) =================
   Первая функция из бэклога §1.2 «игровая механика». Track персонажа игрока
   (голод/здоровье/воля/человечность — тот же объект, что раньше жил только
   в localStorage, см. trkDefault/trkGet/trkSet в p3c_dice.js) для PCS-записи
   с полем owner теперь хранится в Firestore (pcstate/{id персонажа}) и виден
   всем залогиненным сразу, без обновления страницы у других участников.
   NPC и угрозы (PEOPLE/THREATS) НЕ трогаем — они как были, так и остаются
   только в localStorage: owner у них никогда не выставляется, значит
   isLivePc() для них всегда false, весь путь ниже для них не используется.

   PCS[].owner — логин (username) учётной записи Firestore, которой должен
   принадлежать этот персонаж. Поле выставляется мной (агентом) в данных по
   прямому указанию рассказчика — так же, как и все остальные поля PCS,
   рассказчик сам файл не редактирует (см. правила в начале файла). Если
   owner не задан — персонаж работает как раньше, чисто локально.

   ПРАВА РЕДАКТИРОВАНИЯ (см. предупреждение в firestore.rules у pcstate):
   мастер/админ — всегда; игрок — только если owner совпадает с его логином.
   Проверка — только на клиенте (canEditLivePc), правила Firestore пропускают
   запись от ЛЮБОГО игрока или мастера технически (модель доверия закрытой
   группы, та же, что и для паролей без соли — см. §1.3). Кнопки правки на
   чужом живом листе просто не рисуются (см. изменения в trkInner). */

var PCSTATE_CACHE={};  /* {trkKey: {...track...}|null} — последний снимок Firestore для персонажей PCS[], чья страница сейчас открыта (см. ниже — самостоятельные чарники x._liveKind==='pcs' эту кэш-таблицу не используют, у них снимок уже лежит прямо в самом объекте, см. p3h_coterie.js) */
var pcstateUnsub=null; /* отписка от текущего onSnapshot — вызывается при уходе со страницы персонажа, см. dispatch() в p3e_home.js */

/* С v1.37 «живой лист» бывает ДВУХ видов — важно не путать (см. §1.3.2 в
   комментарии):
   1) СТАРЫЙ (с v1.35): запись в статичном PCS[] с полем owner — полную
      анкету по-прежнему пишет рассказчик (агент) по надиктовке, живой
      только track (голод/здоровье/воля/человечность), см. pcstate/{id}
      ниже. Мастер/админ могут править ЛЮБОЙ такой лист.
   2) НОВЫЙ (с v1.37): персонаж, которого игрок/мастер завёл САМ прямо на
      сайте (вкладка Котерия) — вся анкета целиком живёт в Firestore
      (коллекция pcs), не только track. Такие объекты помечены полем
      x._liveKind==='pcs' (проставляется в p3h_coterie.js при получении
      снимка коллекции). Здесь правило ИНАЧЕ: править может ТОЛЬКО
      владелец — даже мастер и админ такой лист не редактируют, только
      просматривают (см. панель мастера/просмотр админа в p3h_coterie.js;
      сказано рассказчиком явно, v1.37). */
function pcOwnerOf(x){return x&&x.owner?String(x.owner).toLowerCase():null;}
function isLivePc(x){return !!x && !!fbDb && (x._liveKind==='pcs' || (PCS.indexOf(x)>-1 && !!pcOwnerOf(x)));}
function canEditLivePc(x){
  if(!SESSION) return false;
  if(x._liveKind==='pcs') return pcOwnerOf(x)===SESSION.username; /* самостоятельный чарник — без исключений для мастера/админа */
  if(SESSION.role==='admin'||SESSION.role==='master') return true;
  return pcOwnerOf(x)===SESSION.username;
}

function stopPcSync(){ if(pcstateUnsub){pcstateUnsub();pcstateUnsub=null;} }

/* Вызывается из viewPC() при открытии страницы персонажа — если это живой
   персонаж, подписываемся на его документ; иначе просто убеждаемся, что
   старая подписка (с предыдущей страницы) снята. */
function startPcSyncIfLive(x){
  stopPcSync();
  if(!isLivePc(x)) return;
  var key=trkKey(x),id=x.id;
  pcstateUnsub=fbDb.collection('pcstate').doc(id).onSnapshot(function(doc){
    PCSTATE_CACHE[key]=doc.exists?doc.data():trkDefault(x);
    refreshTrackers(key);
  },function(){
    /* нет сети / нет прав на чтение — остаёмся без живых данных,
       trkGet() сам откатится на localStorage/дефолты (см. p3c_dice.js) */
  });
}

function pcSyncWrite(x,st){
  if(!isLivePc(x)||!canEditLivePc(x)) return;
  var data={};for(var k in st) data[k]=st[k];
  data.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
  data.updatedBy=SESSION.username;
  /* самостоятельный чарник (x._liveKind==='pcs') хранит track ПРЯМО в своём
     документе pcs/{id} вместе с анкетой — merge:true, чтобы не затереть
     остальные поля анкеты; старый механизм пишет в отдельный pcstate/{id},
     там merge не нужен, но и не мешает. */
  var col=x._liveKind==='pcs'?'pcs':'pcstate';
  fbDb.collection(col).doc(x.id).set(data,{merge:true}).catch(function(){
    /* офлайн/ошибка сети — локальная копия в STORE (см. trkSet) уже сохранена,
       при следующем подключении onSnapshot подтянет актуальную версию сервера */
  });
}
