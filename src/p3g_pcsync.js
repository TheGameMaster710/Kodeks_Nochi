
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

var PCSTATE_CACHE={};  /* {trkKey: {...track...}|null} — последний снимок Firestore для персонажей, чья страница сейчас открыта */
var pcstateUnsub=null; /* отписка от текущего onSnapshot — вызывается при уходе со страницы персонажа, см. dispatch() в p3e_home.js */

function pcOwnerOf(x){return x&&x.owner?String(x.owner).toLowerCase():null;}
function isLivePc(x){return !!x && PCS.indexOf(x)>-1 && !!pcOwnerOf(x) && !!fbDb;}
function canEditLivePc(x){
  if(!SESSION) return false;
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
  fbDb.collection('pcstate').doc(x.id).set(data).catch(function(){
    /* офлайн/ошибка сети — локальная копия в STORE (см. trkSet) уже сохранена,
       при следующем подключении onSnapshot подтянет актуальную версию сервера */
  });
}
