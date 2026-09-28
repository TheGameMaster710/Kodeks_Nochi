
/* ================= FIREBASE: КОНФИГ И ВХОД (с v1.31) =================
   Своя система логинов на Firestore (без Firebase Auth email/password —
   см. §1.3 в комментарии в начале файла). Анонимная авторизация Firebase
   используется только как «якорь сессии» (request.auth.uid для правил),
   сама проверка логин/пароль — через безопасные правила Firestore. */
var FIREBASE_CONFIG={
  apiKey:"AIzaSyB0jmd1yvFoyyMZx1vraB8JT1muorJU9bo",
  authDomain:"kodeks-nochi.firebaseapp.com",
  projectId:"kodeks-nochi",
  storageBucket:"kodeks-nochi.firebasestorage.app",
  messagingSenderId:"738762033182",
  appId:"1:738762033182:web:13f71cb8c86fceabb9c60f"
};
/* SDK грузится тремя <script src> в <head> (p1_head.html) — если сеть подвела
   (офлайн, блокировщик, недоступен CDN), typeof firebase может быть 'undefined';
   тогда просто не инициализируем — bootAuth() ниже покажет понятную ошибку
   вместо падения всего скрипта на ReferenceError. */
/* ПРЕДПРОСМОТР ДЛЯ ТЕЛЕФОНА (с v1.42, §1.3.4): build_preview.py подменяет
   false на true в копии для скачивания — тогда Firebase не трогаем вовсе,
   вход пропускается, сессия локальная с ролью мастера (виден переключатель
   «Вид: Игрок / Мастер»). В самом index.html для сайта здесь всегда false. */
var KODEKS_PREVIEW=false;
var fbApp=null,fbAuth=null,fbDb=null;
if(!KODEKS_PREVIEW&&typeof firebase!=='undefined'){
  fbApp=firebase.initializeApp(FIREBASE_CONFIG);
  fbAuth=firebase.auth();
  fbDb=firebase.firestore();
}

var SESSION=null; /* {uid, username, role, displayName} после успешного входа */
var ROLE_NAMES={admin:'админ',master:'мастер',player:'игрок'};

function sha256Hex(text){
  var enc=new TextEncoder().encode(text);
  return crypto.subtle.digest('SHA-256',enc).then(function(buf){
    return Array.prototype.map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,'0');}).join('');
  });
}

/* ================= ВХОД: ЗАПУСК ================= */
function bootAuth(cb){
  /* Обход входа для автотестов (test.py задаёт window.name ДО загрузки страницы) —
     Firebase недоступен из песочницы агента. Никаких реальных прав это не даёт:
     SESSION поддельная только на клиенте, любое чтение/запись в Firestore всё равно
     упрётся в правила безопасности без настоящей сессии — см. §1.3 в комментарии. */
  if(window.name==='KODEKS_TEST_BYPASS'){SESSION={uid:'test',username:'test',role:'admin',displayName:'Тест'};cb();return;}
  if(KODEKS_PREVIEW){SESSION={uid:'preview',username:'preview',role:'master',displayName:'Предпросмотр',preview:true};renderUserBadge();cb();return;}
  var gate=document.getElementById('authGate');
  gate.classList.remove('hidden');
  if(!fbAuth){
    gate.innerHTML='<div class="auth-card"><h2>Не удалось загрузить Firebase</h2>'+
      '<p class="note">Проверьте интернет-соединение (SDK грузится с www.gstatic.com) и обновите страницу. '+
      'Если это повторяется — возможно, блокировщик рекламы/скриптов режет Google-домены.</p></div>';
    return;
  }
  gate.innerHTML='<div class="auth-card"><p class="sub">Подключение…</p></div>';
  fbAuth.signInAnonymously().then(function(){
    return fbDb.collection('meta').doc('bootstrap').get();
  }).then(function(metaDoc){
    if(!metaDoc.exists){showBootstrapForm(cb);return;}
    var uid=fbAuth.currentUser.uid;
    fbDb.collection('sessions').doc(uid).get().then(function(sd){
      if(sd.exists){
        fbDb.collection('users').doc(sd.data().username).get().then(function(ud){
          if(ud.exists){
            SESSION={uid:uid,username:sd.data().username,role:ud.data().role,displayName:ud.data().displayName||sd.data().username};
            gate.classList.add('hidden');renderUserBadge();cb();
          } else {showLoginForm(cb,'Учётная запись была удалена — войдите заново.');}
        }).catch(function(){showLoginForm(cb);});
      } else {showLoginForm(cb);}
    }).catch(function(){showLoginForm(cb);});
  }).catch(function(e){
    gate.innerHTML='<div class="auth-card"><h2>Не удалось подключиться</h2>'+
      '<p class="note">Проверьте интернет-соединение и обновите страницу.<br>Техническое сообщение: '+esc(e.message||String(e))+'</p></div>';
  });
}

/* ================= ВХОД: ФОРМА ЛОГИНА ================= */
function showLoginForm(cb,note){
  var gate=document.getElementById('authGate');
  gate.innerHTML='<div class="auth-card">'+
    '<h2>Кодекс Ночи</h2><p class="sub">Вход для рассказчика и игроков</p>'+
    (note?'<p class="note">'+esc(note)+'</p>':'')+
    '<label for="authUser">Логин</label><input id="authUser" type="text" autocomplete="username" autocapitalize="off" autocorrect="off">'+
    '<label for="authPass">Пароль</label><input id="authPass" type="password" autocomplete="current-password">'+
    '<div class="err" id="authErr"></div>'+
    '<button class="mini pri" type="button" id="authGo">Войти</button>'+
    '<p class="sub switch">Ещё нет аккаунта? <a id="authToReg">Зарегистрироваться</a></p>'+
    '</div>';
  var user=document.getElementById('authUser'),pass=document.getElementById('authPass'),
      err=document.getElementById('authErr'),go=document.getElementById('authGo');
  function submit(){
    var u=user.value.trim().toLowerCase(),p=pass.value;
    err.textContent='';
    if(!u||!p){err.textContent='Заполните логин и пароль.';return;}
    go.disabled=true;go.textContent='Проверка…';
    sha256Hex(p).then(function(hash){
      var uid=fbAuth.currentUser.uid;
      return fbDb.collection('sessions').doc(uid).set({username:u,passwordHash:hash,createdAt:firebase.firestore.FieldValue.serverTimestamp()})
        .then(function(){return fbDb.collection('users').doc(u).get();});
    }).then(function(ud){
      var data=ud.data();
      SESSION={uid:fbAuth.currentUser.uid,username:u,role:data.role,displayName:data.displayName||u};
      gate.classList.add('hidden');renderUserBadge();cb();
    }).catch(function(){
      go.disabled=false;go.textContent='Войти';
      err.textContent='Неверный логин или пароль.';
    });
  }
  go.addEventListener('click',submit);
  pass.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
  document.getElementById('authToReg').addEventListener('click',function(){showRegisterForm(cb);});
  user.focus();
}

/* ================= ВХОД: САМОСТОЯТЕЛЬНАЯ РЕГИСТРАЦИЯ ИГРОКА (с v1.38) =================
   Сказано рассказчиком явно (v1.38): новых игроков больше не заводит админ руками
   через #/admin/users — они сами создают себе логин/пароль прямо на экране входа.
   Открыто полностью (спрошено явно) — без кода-приглашения, любой человек со
   ссылкой на сайт может завести себе аккаунт-игрока.
   Роль всегда 'player' — 'master'/'admin' по-прежнему заводит только сам админ
   (см. viewAdminUsers ниже), самостоятельная форма роль не спрашивает и в
   Firestore шлёт её жёстко зашитой, а не берёт с формы — правило create в
   firestore.rules отдельно перепроверяет, что это 'player', так что подделать
   роль через devtools не выйдет.
   «Логин не занят» не проверяется отдельным чтением заранее — правило read
   не пускает ещё не вошедшего читать чужой users/{u} (см. firestore.rules), а
   значит и не узнать заранее. Вместо этого сама попытка create — это и есть
   проверка: если документ с таким id уже существует, Firestore трактует
   запись как update (не create) независимо от того, что вызвал клиент, а
   правило update требует isAdmin() — значит попытка с занятым логином сама
   получит permission-denied, ровно нужное поведение, без гонки состояний. */
function showRegisterForm(cb){
  var gate=document.getElementById('authGate');
  gate.innerHTML='<div class="auth-card">'+
    '<h2>Кодекс Ночи</h2><p class="sub">Регистрация игрока</p>'+
    '<label for="regUser">Логин</label><input id="regUser" type="text" autocomplete="username" autocapitalize="off" autocorrect="off">'+
    '<label for="regPass">Пароль</label><input id="regPass" type="password" autocomplete="new-password">'+
    '<label for="regPass2">Повторите пароль</label><input id="regPass2" type="password" autocomplete="new-password">'+
    '<div class="err" id="regErr"></div>'+
    '<button class="mini pri" type="button" id="regGo">Зарегистрироваться</button>'+
    '<p class="sub switch">Уже есть аккаунт? <a id="regToLogin">Войти</a></p>'+
    '</div>';
  var user=document.getElementById('regUser'),pass=document.getElementById('regPass'),pass2=document.getElementById('regPass2'),
      err=document.getElementById('regErr'),go=document.getElementById('regGo');
  function submit(){
    var u=user.value.trim().toLowerCase(),p=pass.value,p2=pass2.value;
    err.textContent='';
    if(!u||!p){err.textContent='Заполните логин и пароль.';return;}
    if(!/^[a-z0-9_]+$/.test(u)){err.textContent='Логин — латиница, цифры и «_», без пробелов.';return;}
    if(p.length<4){err.textContent='Пароль слишком короткий (мин. 4 символа).';return;}
    if(p!==p2){err.textContent='Пароли не совпадают.';return;}
    go.disabled=true;go.textContent='Создание…';
    sha256Hex(p).then(function(hash){
      return fbDb.collection('users').doc(u).set({passwordHash:hash,role:'player',displayName:u,createdAt:firebase.firestore.FieldValue.serverTimestamp()})
        .catch(function(e){e.__step='create';throw e;})
        .then(function(){
          var uid=fbAuth.currentUser.uid;
          return fbDb.collection('sessions').doc(uid).set({username:u,passwordHash:hash,createdAt:firebase.firestore.FieldValue.serverTimestamp()})
            .catch(function(e){e.__step='session';throw e;});
        });
    }).then(function(){
      SESSION={uid:fbAuth.currentUser.uid,username:u,role:'player',displayName:u};
      gate.classList.add('hidden');renderUserBadge();cb();
    }).catch(function(e){
      go.disabled=false;go.textContent='Зарегистрироваться';
      err.textContent=(e&&e.__step==='session')
        ? 'Аккаунт создан, но не получилось сразу войти — обновите страницу и войдите с этим логином и паролем.'
        : 'Не получилось — возможно, такой логин уже занят. Попробуй другой.';
    });
  }
  go.addEventListener('click',submit);
  pass2.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
  document.getElementById('regToLogin').addEventListener('click',function(){showLoginForm(cb);});
  user.focus();
}

/* ================= ВХОД: ПЕРВЫЙ ЗАПУСК (СОЗДАНИЕ ПЕРВОГО АДМИНА) ================= */
function showBootstrapForm(cb){
  var gate=document.getElementById('authGate');
  gate.innerHTML='<div class="auth-card">'+
    '<h2>Первый запуск</h2><p class="sub">Учётных записей ещё нет — заведите первую, админскую</p>'+
    '<label for="bsUser">Логин</label><input id="bsUser" type="text" autocomplete="username" autocapitalize="off" autocorrect="off">'+
    '<label for="bsPass">Пароль</label><input id="bsPass" type="password" autocomplete="new-password">'+
    '<div class="err" id="bsErr"></div>'+
    '<button class="mini pri" type="button" id="bsGo">Создать админа и войти</button>'+
    '</div>';
  var user=document.getElementById('bsUser'),pass=document.getElementById('bsPass'),
      err=document.getElementById('bsErr'),go=document.getElementById('bsGo');
  go.addEventListener('click',function(){
    var u=user.value.trim().toLowerCase(),p=pass.value;
    err.textContent='';
    if(!u||!p){err.textContent='Заполните логин и пароль.';return;}
    if(p.length<4){err.textContent='Пароль слишком короткий (мин. 4 символа).';return;}
    go.disabled=true;go.textContent='Создание…';
    sha256Hex(p).then(function(hash){
      var uid=fbAuth.currentUser.uid;
      /* Не batch(): правила Firestore проверяют каждую запись batch по снимку
         базы ДО всего пакета, поэтому sessions/{uid} не увидел бы только что
         созданный в том же batch users/{u} (см. v1.34 в комментарии). Пишем
         последовательно — users сначала, meta/bootstrap последним, чтобы
         каждая следующая проверка правил видела уже сохранённый результат
         предыдущей записи. */
      return fbDb.collection('users').doc(u).set({passwordHash:hash,role:'admin',displayName:u,createdAt:firebase.firestore.FieldValue.serverTimestamp()})
        .then(function(){return fbDb.collection('sessions').doc(uid).set({username:u,passwordHash:hash,createdAt:firebase.firestore.FieldValue.serverTimestamp()});})
        .then(function(){return fbDb.collection('meta').doc('bootstrap').set({done:true,createdAt:firebase.firestore.FieldValue.serverTimestamp()});});
    }).then(function(){
      SESSION={uid:fbAuth.currentUser.uid,username:u,role:'admin',displayName:u};
      gate.classList.add('hidden');renderUserBadge();cb();
    }).catch(function(e){
      go.disabled=false;go.textContent='Создать админа и войти';
      err.textContent='Не получилось: '+esc(e.message||String(e));
    });
  });
  user.focus();
}

/* ================= БЕЙДЖ И ВЫХОД ================= */
function renderUserBadge(){
  var b=document.getElementById('userBadge');if(!b||!SESSION)return;
  if(SESSION.preview){b.innerHTML='<b>Предпросмотр</b> · без сервера';return;}
  b.innerHTML='<b>'+esc(SESSION.displayName)+'</b> · '+(ROLE_NAMES[SESSION.role]||SESSION.role)+
    (SESSION.role==='admin'?' · <a id="badgeAdmin">пользователи</a>':'')+
    (SESSION.role==='admin'||SESSION.role==='master'?' · <a id="badgeGm">тайны</a>':'')+
    ' · <a id="badgeOut">выйти</a>';
  var a1=document.getElementById('badgeAdmin');if(a1)a1.addEventListener('click',function(){location.hash='#/admin/users';});
  var a2=document.getElementById('badgeGm');if(a2)a2.addEventListener('click',function(){location.hash='#/master/gm';});
  document.getElementById('badgeOut').addEventListener('click',doLogout);
}
function doLogout(){
  if(!fbAuth.currentUser){location.reload();return;}
  fbDb.collection('sessions').doc(fbAuth.currentUser.uid).delete().catch(function(){}).then(function(){
    location.reload();
  });
}

/* ================= АДМИН: ПОЛЬЗОВАТЕЛИ (#/admin/users) ================= */
function viewAdminUsers(){
  setTheme('court');crumb([['Пользователи']]);
  app.innerHTML='<section class="sec"><div class="wrap rise"><a class="back" href="#/">← к титулу</a>'+
    '<div class="sec-head" style="margin-top:22px"><h2>Пользователи</h2><span class="eyebrow">только для админа</span></div>'+
    '<p class="lede" style="margin:0 0 20px">Роли и пароли учётных записей сайта. Пароль игрока не хранится в открытом виде — '+
    'при необходимости его можно только сбросить (задать новый), не посмотреть старый. Игроки с v1.38 заводят себе аккаунт '+
    'сами через форму на экране входа — сюда попадают, только если нужно поменять роль, сбросить пароль или удалить запись. '+
    'Роль admin/master по-прежнему заводится только здесь.</p>'+
    '<div id="adminUserList" class="empty"><b>Загрузка…</b></div>'+
    '<div class="addrow admin-new">'+
      '<div><label>Новый логин</label><input id="newUser" type="text" autocapitalize="off" autocorrect="off" style="width:150px"></div>'+
      '<div><label>Пароль</label><input id="newPass" type="text" style="width:150px"></div>'+
      '<div><label>Роль</label><select id="newRole"><option value="player">Игрок</option><option value="master">Мастер</option><option value="admin">Админ</option></select></div>'+
      '<button class="mini pri" type="button" id="newGo">Создать</button>'+
    '</div><div class="err" id="adminErr"></div>'+
    '</div></section>';
  loadAdminUsers();
  document.getElementById('newGo').addEventListener('click',function(){
    var u=document.getElementById('newUser').value.trim().toLowerCase(),
        p=document.getElementById('newPass').value,
        r=document.getElementById('newRole').value,
        err=document.getElementById('adminErr');
    err.textContent='';
    if(!u||!p){err.textContent='Заполните логин и пароль.';return;}
    fbDb.collection('users').doc(u).get().then(function(existing){
      if(existing.exists){err.textContent='Такой логин уже занят.';return;}
      return sha256Hex(p).then(function(hash){
        return fbDb.collection('users').doc(u).set({passwordHash:hash,role:r,displayName:u,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      }).then(function(){
        document.getElementById('newUser').value='';document.getElementById('newPass').value='';
        loadAdminUsers();
      });
    }).catch(function(e){err.textContent='Не получилось: '+esc(e.message||String(e));});
  });
}
function loadAdminUsers(){
  var box=document.getElementById('adminUserList');
  fbDb.collection('users').get().then(function(qs){
    if(qs.empty){box.className='empty';box.innerHTML='<b>Пусто</b><span>Учётных записей пока нет.</span>';return;}
    box.className='';
    var rows=[];
    qs.forEach(function(doc){rows.push({u:doc.id,role:doc.data().role,name:doc.data().displayName||doc.id});});
    rows.sort(function(a,b){return a.u<b.u?-1:1;});
    box.innerHTML=rows.map(function(r){
      return '<div class="admin-row" data-u="'+esc(r.u)+'">'+
        '<div class="who"><b>'+esc(r.name)+'</b><span>@'+esc(r.u)+'</span></div>'+
        '<select class="mini roleSel"'+(r.u===SESSION.username?' disabled title="Свою роль поменять нельзя — это защита от случайного понижения себя"':'')+'>'+['player','master','admin'].map(function(k){
          return '<option value="'+k+'"'+(k===r.role?' selected':'')+'>'+ROLE_NAMES[k]+'</option>';}).join('')+'</select>'+
        '<button class="mini" type="button" data-act="reset">Сбросить пароль</button>'+
        (r.u!==SESSION.username?'<button class="mini" type="button" data-act="del">Удалить</button>':'')+
        '</div>';
    }).join('');
    [].forEach.call(box.querySelectorAll('.admin-row'),function(row){
      var u=row.getAttribute('data-u');
      var rs=row.querySelector('.roleSel'),was=rs.value;
      rs.addEventListener('change',function(e){
        var nv=e.target.value;
        if(!confirm('Сменить роль «'+u+'» на «'+ROLE_NAMES[nv]+'»?')){rs.value=was;return;}
        fbDb.collection('users').doc(u).update({role:nv}).then(function(){was=nv;})
          .catch(function(er){rs.value=was;alert('Не получилось: '+(er.message||er));});
      });
      row.querySelector('[data-act="reset"]').addEventListener('click',function(){
        var np=prompt('Новый пароль для «'+u+'»:');
        if(!np)return;
        sha256Hex(np).then(function(hash){return fbDb.collection('users').doc(u).update({passwordHash:hash});})
          .then(function(){alert('Пароль обновлён.');});
      });
      var delBtn=row.querySelector('[data-act="del"]');
      if(delBtn)delBtn.addEventListener('click',function(){
        if(confirm('Удалить учётную запись «'+u+'»?'))fbDb.collection('users').doc(u).delete().then(loadAdminUsers);
      });
    });
  }).catch(function(e){box.innerHTML='<b>Ошибка загрузки</b><span>'+esc(e.message||String(e))+'</span>';});
}
