
/* ================= ИНТЕРАКТИВНЫЙ ЧАРНИК V5 (самостоятельные чарники, с v1.45) =================
   См. §1.3.5 в комментарии. Сказано рассказчиком: в Котерии должен быть
   полноценный интерактивный лист вампира — атрибуты, навыки, дисциплины,
   метод охоты и т.п., плюс встроенный бросок. Страница #/coterie/<id>
   (viewLivePC в p3h_coterie.js) рисует лист через sheetHtml(x).

   ДАННЫЕ в документе pcs/{id} (Firestore НЕ принимает массив внутри
   массива — поэтому строки хранятся объектами, а в памяти страницы
   переводятся в привычные [[…]] функциями pcFromFs/pcToFs ниже):
     attrs:{str,dex,sta,cha,man,com,int,wit,res}   1..5 (нет поля = 1)
     skills:{ath,…}                                0..5 (нет поля = 0)
     specs:'текст'          специализации, свободным текстом
     disciplines:[{n,d,p}]  название, точки, силы (строки через \n)
     advantages:[{n,d,k,t}] достоинства/недостатки/фоны: k = merit|flaw|bg
     predator, huntA, huntS тип хищника и пул охоты (ключ атрибута + навыка)
     xpTotal, xpSpent, notes, hBonus, wBonus
     concept:[{l,t}], convictions:[{c,a}]
   Здоровье = Выносливость+3(+hBonus), Сила воли = Самообладание+Решимость
   (+wBonus) — считает pcDerived(), трекер берёт отсюда (trkGet в p3c_dice.js).
   Правка — только владелец (правила pcs), в режиме «Правка листа»;
   сохранение само, с задержкой (sheetQueueSave). Бросок — у всех, кто
   видит лист: клик по атрибуту/навыку/дисциплине кладёт его в пул. */

var SHEET_ATTRS=[
 ['Физические',[['str','Сила'],['dex','Ловкость'],['sta','Выносливость']]],
 ['Социальные',[['cha','Обаяние'],['man','Манипуляция'],['com','Самообладание']]],
 ['Ментальные',[['int','Интеллект'],['wit','Сообразительность'],['res','Решимость']]]
];
var SHEET_SKILLS=[
 ['Физические',[['ath','Атлетика'],['bra','Драка'],['cra','Ремесло'],['dri','Вождение'],['fir','Стрельба'],['lar','Воровство'],['mel','Ближний бой'],['ste','Скрытность'],['sur','Выживание']]],
 ['Социальные',[['ani','Обращение с животными'],['eti','Этикет'],['ins','Проницательность'],['itm','Запугивание'],['lea','Лидерство'],['prf','Исполнение'],['prs','Убеждение'],['str2','Знание улиц'],['sub','Хитрость']]],
 ['Ментальные',[['aca','Гуманитарные науки'],['awa','Бдительность'],['fin','Финансы'],['inv','Расследование'],['med','Медицина'],['occ','Оккультизм'],['pol','Политика'],['sci','Наука'],['tec','Технологии']]]
];
/* типы хищника из книги — только названия; способы охоты хроники (PREDATORS)
   идут в списке первыми */
var PRED_REF=['Уличная кошка','Мешочник','Кровавая пиявка','Тесак','Консенсуалист','Фермер','Осирис','Песочный человек','Королева сцены','Сирена'];
var ADV_KINDS={merit:'Достоинство',flaw:'Недостаток',bg:'Фон'};
/* v1.64 — достоинства/недостатки на листе выбираются из MERITS сайта
   (сказано рассказчиком), а не вписываются руками. Вид (k) и допустимое
   число точек берутся из записи: kind → k, dots ('••' или '•–•••••') →
   диапазон. Старые, вписанные вручную строки сохраняются как «своё». */
var ADV_KIND_OF={'Достоинство':'merit','Недостаток':'flaw','Предыстория':'bg','Фон':'bg'};
function advFind(n){n=String(n||'').trim();if(!n)return null;for(var i=0;i<MERITS.length;i++)if(MERITS[i].name===n)return MERITS[i];return null;}
function advRange(n){var m=advFind(n);if(!m||!m.dots)return [0,5];
  var p=String(m.dots).split(/[–—-]/).map(function(q){return (q.match(/•/g)||[]).length;}).filter(function(q){return q>0;});
  if(!p.length)return [0,5];return [Math.min.apply(null,p),Math.max.apply(null,p)];}
function advOptions(cur){
  var groups={},order=[];MERITS.forEach(function(m){var g=m.kind||'Прочее';if(!groups[g]){groups[g]=[];order.push(g);}groups[g].push(m);});
  var h='<option value="">— выбрать —</option>';
  order.forEach(function(g){h+='<optgroup label="'+esc(g)+'">'+groups[g].map(function(m){
    return '<option value="'+esc(m.name)+'"'+(m.name===cur?' selected':'')+'>'+esc(m.name)+(m.dots?' ('+esc(m.dots)+')':'')+'</option>';}).join('')+'</optgroup>';});
  if(cur&&!advFind(cur)) h+='<optgroup label="Своё (нет на сайте)"><option value="'+esc(cur)+'" selected>'+esc(cur)+'</option></optgroup>';
  return h;}

/* v1.83 — описание преимущества прямо в листе. Берётся из заметки MERITS:
   краткая строка и ступени. Ступени выше набранных точек приглушены. */
function advDesc(name,dots){var m=advFind(name);if(!m)return '';
  var paras=String(m.text||'').split(/\n{2,}/).filter(function(p){return p.trim();});
  var body=paras.map(function(p){var lv=/^\*\*(•+)/.exec(p),n=lv?lv[1].length:0;
    return '<div class="sh-alv'+(n&&n>dots?' off':'')+'">'+md(p)+'</div>';}).join('');
  return '<div class="sh-adesc">'+(m.short?'<p class="sh-ashort">'+inl(m.short)+'</p>':'')+
    (body?'<details><summary>'+(/^\*\*•/.test(paras[0]||'')?'Ступени':'Описание')+'</summary>'+body+
      '<p class="sh-amore"><a href="#/merit/'+m.id+'">Открыть заметку →</a></p></details>':'')+'</div>';}
var SHEET_EDIT={};  /* id → true, пока открыт режим «Правка листа» */
var SHEET_SEL={};   /* id → {t:['a:str','s:bra','d:0'], mod, dif, surge} — выбранный пул */
var SHEET_TIMER={};

/* ---------- формат Firestore ↔ память ---------- */
function pcFromFs(d){
  function rows(v,a,b){return (v||[]).map(function(r){return Array.isArray(r)?r:[r[a]||'',r[b]||''];});}
  d.concept=rows(d.concept,'l','t');
  d.convictions=rows(d.convictions,'c','a');
  d.disciplines=(d.disciplines||[]).map(function(r){return Array.isArray(r)?[r[0],+r[1]||0,r[2]||'']:[r.n||'',+r.d||0,r.p||''];});
  d.advantages=(d.advantages||[]).map(function(r){return Array.isArray(r)?r:[r.n||'',+r.d||0,r.k||'merit',r.t||'',!!r.l];});
  return d;
}
function pcToFs(data){
  var o={};for(var k in data)o[k]=data[k];
  if(o.concept) o.concept=o.concept.map(function(r){return {l:r[0]||'',t:r[1]||''};});
  if(o.convictions) o.convictions=o.convictions.map(function(r){return {c:r[0]||'',a:r[1]||''};});
  if(o.disciplines) o.disciplines=o.disciplines.map(function(r){return {n:r[0]||'',d:+r[1]||0,p:r[2]||''};});
  if(o.advantages) o.advantages=o.advantages.map(function(r){return {n:r[0]||'',d:+r[1]||0,k:r[2]||'merit',t:r[3]||'',l:!!r[4]};});
  return o;
}

/* ---------- значения и производные ---------- */
function sAttr(x,k){var v=(x.attrs||{})[k];return v==null?1:+v;}
function sSkill(x,k){return +((x.skills||{})[k]||0);}
function traitName(k){
  var p=k.split(':'),list=p[0]==='a'?SHEET_ATTRS:SHEET_SKILLS,out=k;
  if(p[0]==='d') return null;
  list.forEach(function(g){g[1].forEach(function(t){if(t[0]===p[1])out=t[1];});});return out;
}
function traitGroup(k){ /* 0 физ, 1 соц, 2 мент — для штрафа ослабления */
  var p=k.split(':'),list=p[0]==='a'?SHEET_ATTRS:p[0]==='s'?SHEET_SKILLS:null,g=-1;
  if(list) list.forEach(function(gr,i){gr[1].forEach(function(t){if(t[0]===p[1])g=i;});});return g;
}
function traitVal(x,k){
  var p=k.split(':');
  if(p[0]==='a') return sAttr(x,p[1]);
  if(p[0]==='s') return sSkill(x,p[1]);
  if(p[0]==='d'){var d=(x.disciplines||[])[+p[1]];return d?+d[1]||0:0;}
  return 0;
}
function traitLabel(x,k){var p=k.split(':');if(p[0]==='d'){var d=(x.disciplines||[])[+p[1]];return d?d[0]:'?';}return traitName(k);}
function pcDerived(x){
  return {hMax:Math.max(1,sAttr(x,'sta')+3+(+x.hBonus||0)),wMax:Math.max(1,sAttr(x,'com')+sAttr(x,'res')+(+x.wBonus||0))};
}
function bpRow(x){var b=Math.max(0,Math.min(10,+x.bp||0));return BP_TABLE[b]||BP_TABLE[0];}
function surgeDice(x){var m=/(\d+)/.exec(bpRow(x)[1]||'');return m?+m[1]:0;}

/* ---------- пул броска ---------- */
function sheetSel(x){return SHEET_SEL[x.id]||(SHEET_SEL[x.id]={t:[],mod:0,dif:0,surge:false});}
function sheetPool(x){
  var s=sheetSel(x),key=trkKey(x),st=trkGet(key),parts=[],sum=0;
  s.t.forEach(function(k){var v=traitVal(x,k);parts.push([traitLabel(x,k),v]);sum+=v;});
  var groups=s.t.map(traitGroup),pen=0,why=[];
  if(st&&st.hSup+st.hAgg>=st.hMax&&groups.indexOf(0)>-1){pen+=2;why.push('ослаблен здоровьем');}
  if(st&&st.wSup+st.wAgg>=st.wMax&&(groups.indexOf(1)>-1||groups.indexOf(2)>-1)){pen+=2;why.push('ослаблен волей');}
  var surge=s.surge?surgeDice(x):0;
  var total=Math.max(0,sum+(+s.mod||0)-pen+surge);
  return {parts:parts,sum:sum,mod:+s.mod||0,pen:pen,why:why,surge:surge,total:total,hunger:st?st.hunger:0};
}
function sheetRollHtml(x){
  var s=sheetSel(x),P=sheetPool(x);
  var chips=P.parts.length?P.parts.map(function(p,i){return '<button type="button" class="chip hot" data-sh="unpick" data-i="'+i+'">'+esc(p[0])+' '+p[1]+' ✕</button>';}).join(' ')
    :'<span class="tsub">Нажмите на атрибут, навык или дисциплину — они сложатся в пул.</span>';
  var brk=P.parts.map(function(p){return esc(p[0])+' '+p[1];}).join(' + ')+(P.mod?(P.mod>0?' + ':' − ')+Math.abs(P.mod):'')+
    (P.pen?' − '+P.pen+' ('+P.why.join(', ')+')':'')+(P.surge?' + '+P.surge+' (всплеск)':'');
  return '<div class="sh-roll">'+
    '<div class="sh-chips">'+chips+'</div>'+
    '<div class="sh-rctl">'+
     '<label>Модиф.<input type="number" id="shMod" value="'+(+s.mod||0)+'" min="-10" max="10"></label>'+
     '<label>Сложность<input type="number" id="shDif" value="'+(+s.dif||0)+'" min="0" max="15"></label>'+
     '<label class="chk"><input type="checkbox" id="shSurge"'+(s.surge?' checked':'')+'> Всплеск крови (+'+surgeDice(x)+', пробуждение)</label>'+
    '</div>'+
    '<div class="sh-total"><b>Пул '+P.total+'</b> · Голод '+P.hunger+(brk?'<span class="tsub"> = '+brk+'</span>':'')+'</div>'+
    '<div class="ctl"><button class="mini pri" type="button" data-sh="roll"'+(P.total<1?' disabled':'')+'>Бросить</button>'+
    '<button class="mini" type="button" data-sh="rouse">Проверка пробуждения</button>'+
    (x.huntA&&x.huntS?'<button class="mini" type="button" data-sh="hunt">Бросок охоты</button>':'')+
    '<button class="mini" type="button" data-sh="clear">Очистить пул</button></div></div>';
}

/* ---------- отрисовка ---------- */
function sDots(x,k,val,min,max,edit){
  var s='';for(var i=1;i<=max;i++){var on=i<=val;
    s+=edit?'<button type="button" class="sd'+(on?' on':'')+'" data-sh="dot" data-k="'+k+'" data-v="'+i+'" data-min="'+min+'" aria-label="'+i+'"></button>'
           :'<span class="sd'+(on?' on':'')+'"></span>';}
  return '<span class="sdots">'+s+'</span>';
}
function traitRow(x,k,label,val,min,edit){
  var sel=sheetSel(x).t.indexOf(k)>-1;
  return '<div class="sh-row'+(sel?' sel':'')+(val===0?' zero':'')+'"><button type="button" class="sh-name" data-sh="pick" data-k="'+k+'">'+esc(label)+'</button>'+sDots(x,k,val,min,5,edit)+'</div>';
}
function statsGrid(x,list,pref,min,edit){
  return '<div class="sh-grid">'+list.map(function(g){
    return '<div class="sh-col"><div class="sh-gh">'+g[0]+'</div>'+g[1].map(function(t){
      var k=pref+':'+t[0];return traitRow(x,k,t[1],pref==='a'?sAttr(x,t[0]):sSkill(x,t[0]),min,edit);}).join('')+'</div>';}).join('')+'</div>';
}
function optList(names,sel){
  var seen={},out='<option value=""'+(!sel?' selected':'')+'>—</option>';
  names.forEach(function(n){if(!n||seen[n])return;seen[n]=1;out+='<option'+(n===sel?' selected':'')+'>'+esc(n)+'</option>';});
  if(sel&&!seen[sel]) out+='<option selected>'+esc(sel)+'</option>';
  return out;
}
function allDiscNames(){return DISCIPLINES.map(function(d){return d.name;}).concat(DISC_REF.map(function(d){return d[0];}));}
function allClanNames(){return CLANS.map(function(c){return c.name;}).concat(CLAN_REF.map(function(c){return c[0];}));}
function allSectNames(){return SECTS.map(function(c){return c.name;}).concat(GHOSTS.sects||[]);}
function allPredNames(){return PREDATORS.map(function(c){return c.name;}).concat(PRED_REF);}
function clanDiscs(x){var r=null;CLAN_REF.forEach(function(c){if(c[0]===x.clan)r=c[1];});return r||[];}
function attrOpts(sel){var o='<option value="">—</option>';SHEET_ATTRS.forEach(function(g){g[1].forEach(function(t){o+='<option value="'+t[0]+'"'+(t[0]===sel?' selected':'')+'>'+t[1]+'</option>';});});return o;}
function skillOpts(sel){var o='<option value="">—</option>';SHEET_SKILLS.forEach(function(g){g[1].forEach(function(t){o+='<option value="'+t[0]+'"'+(t[0]===sel?' selected':'')+'>'+t[1]+'</option>';});});return o;}

function sheetHtml(x,editable){
  var edit=editable&&!!SHEET_EDIT[x.id],out='';
  out+='<div class="sheet" data-pc="'+esc(x.id)+'">';
  /* сказано рассказчиком (v1.47): кнопку правки листа тяжело заметить —
     теперь это крупная кнопка на всю ширину; в режиме правки панель липнет
     к верху экрана, чтобы «Готово» всегда было под рукой */
  if(editable) out+='<div class="sh-bar'+(edit?' editing':'')+'"><button type="button" class="sh-edit" data-sh="edit">'+
    (edit?'✓ Готово — закончить правку':'✎ Править лист персонажа')+'</button>'+
    '<span class="sh-hint" id="shSaved">'+(edit?'Нажимайте на точки, чтобы менять значения; всё сохраняется само.':'Здесь меняются атрибуты, навыки, дисциплины, охота, опыт и заметки.')+'</span></div>';
  out+=section('Бросок','',sheetRollHtml(x));
  out+=section('Атрибуты','',statsGrid(x,SHEET_ATTRS,'a',1,edit));
  out+=section('Навыки','',statsGrid(x,SHEET_SKILLS,'s',0,edit)+
    (edit?'<label class="sh-lab">Специализации</label><textarea id="sh_specs" rows="2" placeholder="Например: Драка (ножи), Оккультизм (Тремер)">'+esc(x.specs||'')+'</textarea>'
         :(x.specs?'<div class="panel" style="margin-top:12px"><b>Специализации:</b> '+esc(x.specs)+'</div>':'')));
  /* дисциплины */
  var disc=x.disciplines||[],cd=clanDiscs(x),dh;
  if(edit){
    dh='<div class="sh-disc-ed">'+disc.map(function(d,i){
      return '<div class="sh-drow"><select data-shf="dn" data-i="'+i+'">'+optList(allDiscNames(),d[0])+'</select>'+
        sDots(x,'d:'+i,+d[1]||0,0,5,true)+'<button type="button" class="mini" data-sh="ddel" data-i="'+i+'" title="Убрать">✕</button>'+
        '<textarea data-shf="dp" data-i="'+i+'" rows="2" placeholder="Силы — по одной на строку">'+esc(d[2]||'')+'</textarea></div>';}).join('')+
      '<button type="button" class="mini" data-sh="dadd">+ Дисциплина</button></div>';
  } else {
    dh=disc.length?'<div class="sh-disc">'+disc.map(function(d,i){
      var k='d:'+i,sel=sheetSel(x).t.indexOf(k)>-1,pw=(d[2]||'').split('\n').filter(function(s){return s.trim();});
      return '<div class="sh-dcard'+(sel?' sel':'')+'"><div class="sh-row"><button type="button" class="sh-name" data-sh="pick" data-k="'+k+'">'+esc(d[0]||'—')+
        (cd.indexOf(d[0])>-1?' <span class="tag">клановая</span>':'')+'</button>'+sDots(x,k,+d[1]||0,0,5,false)+'</div>'+
        (pw.length?'<ul>'+pw.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul>':'')+'</div>';}).join('')+'</div>'
      :emptyBox('Дисциплин пока нет',editable?'Откройте «Правка листа», чтобы добавить.':'Владелец листа ещё не выбрал дисциплины.');
  }
  if(cd.length) dh+='<div class="tsub" style="margin-top:8px">Клановые дисциплины: '+cd.map(esc).join(', ')+'</div>';
  out+=section('Дисциплины',disc.length,dh);
  /* охота */
  var hp=x.huntA&&x.huntS?sAttr(x,x.huntA)+sSkill(x,x.huntS):null,hn=x.huntA&&x.huntS?traitName('a:'+x.huntA)+' + '+traitName('s:'+x.huntS):'';
  out+=section('Охота','',edit?
    '<div class="g3"><div><label class="sh-lab">Тип хищника</label><select data-shf="pred">'+optList(allPredNames(),x.predator)+'</select></div>'+
    '<div><label class="sh-lab">Пул охоты: атрибут</label><select data-shf="huntA">'+attrOpts(x.huntA)+'</select></div>'+
    '<div><label class="sh-lab">навык</label><select data-shf="huntS">'+skillOpts(x.huntS)+'</select></div></div>'
    :'<div class="defs"><div class="def"><span class="l">Тип хищника</span><div class="v">'+(x.predator?wikiTag(x.predator,esc(x.predator)):'<span class="blank">не выбран</span>')+'</div></div>'+
     '<div class="def"><span class="l">Пул охоты</span><div class="v">'+(hp!=null?esc(hn)+' = '+hp:'<span class="blank">не задан</span>')+'</div></div></div>');
  /* мощь крови */
  var bp=bpRow(x);
  out+=section('Мощь крови',String(+x.bp||0),'<div class="defs">'+
    [['Всплеск крови',bp[1]],['Восстановление',bp[2]],['Бонус к силе дисциплин',bp[3]],['Переброс пробуждения',bp[4]],['Суровость проклятия',bp[5]],['Штраф к кормлению',bp[6]]]
    .map(function(r){return '<div class="def"><span class="l">'+r[0]+'</span><div class="v">'+esc(r[1])+'</div></div>';}).join('')+'</div>');
  /* достоинства и недостатки */
  var adv=x.advantages||[],ah;
  if(edit){
    ah='<div class="sh-adv-ed">'+adv.map(function(a,i){
      var rg=advRange(a[0]);
      /* закреплённое преимущество (a[4]) сменить нельзя — только удалить строку
         и добавить новую; точки и пояснение остаются редактируемыми */
      return '<div class="sh-arow">'+(a[4]&&a[0]?'<span class="sh-alock" title="Закреплено. Чтобы заменить, удалите строку и добавьте новую.">'+(advFind(a[0])?wikiTag(a[0],esc(a[0])):esc(a[0]))+' <i>закреплено</i></span>'
        :'<select data-shf="an" data-i="'+i+'">'+advOptions(a[0])+'</select>')+
        '<span class="tag">'+(ADV_KINDS[a[2]]||'')+'</span>'+
        sDots(x,'v:'+i,+a[1]||0,rg[0],rg[1],true)+'<button type="button" class="mini" data-sh="adel" data-i="'+i+'">✕</button>'+
        '<input data-shf="at" data-i="'+i+'" value="'+esc(a[3]||'')+'" placeholder="Пояснение (по желанию)">'+advDesc(a[0],+a[1]||0)+'</div>';}).join('')+
      (adv.some(function(a){return a[0]&&!a[4];})?'<p class="hint">После нажатия «Готово» выбранные преимущества закрепляются. Заменить закреплённое можно, только удалив строку и добавив новую. Точки менять можно всегда.</p>':'')+
      (MERITS.length?'<button type="button" class="mini" data-sh="aadd">+ Строка</button>':'<p class="hint">На сайте пока нет ни одного преимущества или недостатка — выбирать не из чего.</p>')+'</div>';
  } else {
    ah=adv.length?'<div class="sh-adv">'+adv.map(function(a){
      return '<div class="sh-row"><span class="sh-name static">'+(advFind(a[0])?wikiTag(a[0],esc(a[0])):esc(a[0]||'—'))+' <span class="tag">'+(ADV_KINDS[a[2]]||'')+'</span>'+(a[3]?'<span class="tsub"> — '+esc(a[3])+'</span>':'')+'</span>'+sDots(x,'',+a[1]||0,0,5,false)+advDesc(a[0],+a[1]||0)+'</div>';}).join('')+'</div>'
      :emptyBox('Пока пусто','Достоинства, недостатки и фоны появятся здесь.');
  }
  out+=section('Достоинства, недостатки, фоны',adv.length,ah);
  /* опыт и заметки */
  var xt=+x.xpTotal||0,xs=+x.xpSpent||0;
  out+=section('Опыт','',edit?
    '<div class="g3"><div><label class="sh-lab">Всего получено</label><input type="number" min="0" data-shf="xpTotal" value="'+xt+'"></div>'+
    '<div><label class="sh-lab">Потрачено</label><input type="number" min="0" data-shf="xpSpent" value="'+xs+'"></div>'+
    '<div><label class="sh-lab">Доп. здоровье / сила воли</label><div class="g2"><input type="number" data-shf="hBonus" value="'+(+x.hBonus||0)+'" title="К здоровью (Выносливость + 3)"><input type="number" data-shf="wBonus" value="'+(+x.wBonus||0)+'" title="К силе воли (Самообладание + Решимость)"></div></div></div>'
    :'<div class="defs"><div class="def"><span class="l">Всего</span><div class="v">'+xt+'</div></div><div class="def"><span class="l">Потрачено</span><div class="v">'+xs+'</div></div><div class="def"><span class="l">Доступно</span><div class="v"><b>'+(xt-xs)+'</b></div></div></div>');
  out+=section('Заметки','',edit?'<textarea data-shf="notes" rows="5" placeholder="Внешность, история, что угодно">'+esc(x.notes||'')+'</textarea>'
    :(x.notes?'<div class="panel">'+md(x.notes)+'</div>':emptyBox('Заметок нет','')));
  return out+'</div>';
}

/* ---------- правка и сохранение ---------- */
function sheetQueueSave(x){
  var el=document.getElementById('shSaved');if(el)el.textContent='Сохранение…';
  clearTimeout(SHEET_TIMER[x.id]);
  SHEET_TIMER[x.id]=setTimeout(function(){
    if(!fbDb){var ep=document.getElementById('shSaved');if(ep)ep.textContent='Предпросмотр: изменения живут только в этом окне.';return;}
    if(!canEditLivePc(x))return;
    var data=pcToFs({attrs:x.attrs||{},skills:x.skills||{},specs:x.specs||'',disciplines:x.disciplines||[],advantages:x.advantages||[],
      predator:x.predator||'',huntA:x.huntA||'',huntS:x.huntS||'',xpTotal:+x.xpTotal||0,xpSpent:+x.xpSpent||0,notes:x.notes||'',
      hBonus:+x.hBonus||0,wBonus:+x.wBonus||0});
    data.updatedAt=firebase.firestore.FieldValue.serverTimestamp();data.updatedBy=SESSION.username;
    fbDb.collection('pcs').doc(x.id).set(data,{merge:true}).then(function(){
      var e2=document.getElementById('shSaved');if(e2)e2.textContent='Сохранено.';
    }).catch(function(e){var e3=document.getElementById('shSaved');if(e3)e3.textContent='Не сохранилось: '+(e.message||e);});
  },700);
}
function sheetRedraw(x){
  var y=window.scrollY;viewLivePC(x.id);window.scrollTo(0,y);
}
function sheetPc(el){var w=el.closest('.sheet');return w?findLivePc(w.getAttribute('data-pc')):null;}
document.addEventListener('click',function(e){
  var b=e.target.closest?e.target.closest('[data-sh]'):null;if(!b)return;
  var x=sheetPc(b);if(!x)return;
  var a=b.getAttribute('data-sh'),s=sheetSel(x),key=trkKey(x),edit=canEditLivePc(x)&&SHEET_EDIT[x.id];
  if(a==='edit'){
    if(SHEET_EDIT[x.id]&&canEditLivePc(x)){var ch=false,keep=(x.advantages||[]).filter(function(r){return r[0];});
      if(keep.length!==(x.advantages||[]).length)ch=true;
      keep.forEach(function(r){if(!r[4]){r[4]=true;ch=true;}});x.advantages=keep;if(ch)sheetQueueSave(x);}
    SHEET_EDIT[x.id]=!SHEET_EDIT[x.id];sheetRedraw(x);return;}
  if(a==='pick'){var k=b.getAttribute('data-k'),i=s.t.indexOf(k);if(i>-1)s.t.splice(i,1);else s.t.push(k);sheetRedraw(x);return;}
  if(a==='unpick'){s.t.splice(+b.getAttribute('data-i'),1);sheetRedraw(x);return;}
  if(a==='clear'){s.t=[];s.mod=0;s.surge=false;sheetRedraw(x);return;}
  if(a==='roll'||a==='hunt'){
    var P,label;
    if(a==='hunt'){P={total:sAttr(x,x.huntA)+sSkill(x,x.huntS),hunger:trkGet(key).hunger};label=x.name+' · охота ('+traitName('a:'+x.huntA)+' + '+traitName('s:'+x.huntS)+')';}
    else{P=sheetPool(x);label=x.name+' · '+(P.parts.map(function(p){return p[0];}).join(' + ')||'пул');}
    if(dkPc){fillPcSelect();dkPc.value=key;}
    if(a==='roll'&&s.surge&&P.surge){rouseFor(key,false);P.hunger=trkGet(key).hunger;}
    rollPool(P.total,P.hunger,a==='roll'?(+s.dif||0):0,label);
    return;
  }
  if(a==='rouse'){if(dkPc){fillPcSelect();dkPc.value=key;}rouseFor(key,false);return;}
  if(!edit) return;
  if(a==='dot'){
    var kk=b.getAttribute('data-k'),v=+b.getAttribute('data-v'),mn=+b.getAttribute('data-min'),p=kk.split(':'),cur;
    if(p[0]==='a'){x.attrs=x.attrs||{};cur=sAttr(x,p[1]);x.attrs[p[1]]=Math.max(mn,cur===v?v-1:v);}
    else if(p[0]==='s'){x.skills=x.skills||{};cur=sSkill(x,p[1]);x.skills[p[1]]=Math.max(mn,cur===v?v-1:v);}
    else if(p[0]==='d'){var dd=x.disciplines[+p[1]];cur=+dd[1]||0;dd[1]=cur===v?v-1:v;}
    else if(p[0]==='v'){var aa=x.advantages[+p[1]],rg=advRange(aa[0]);cur=+aa[1]||0;aa[1]=Math.max(rg[0],Math.min(rg[1],cur===v?v-1:v));}
    refreshTrackers(key);sheetRedraw(x);sheetQueueSave(x);return;
  }
  if(a==='dadd'){x.disciplines=x.disciplines||[];x.disciplines.push(['',1,'']);sheetRedraw(x);sheetQueueSave(x);return;}
  if(a==='ddel'){x.disciplines.splice(+b.getAttribute('data-i'),1);s.t=s.t.filter(function(k){return k.indexOf('d:')!==0;});sheetRedraw(x);sheetQueueSave(x);return;}
  if(a==='aadd'){x.advantages=x.advantages||[];x.advantages.push(['',1,'merit','',false]);sheetRedraw(x);sheetQueueSave(x);return;}
  if(a==='adel'){x.advantages.splice(+b.getAttribute('data-i'),1);sheetRedraw(x);sheetQueueSave(x);return;}
});
function sheetField(e){
  var el=e.target;if(!el||!el.closest)return;
  var w=el.closest('.sheet');if(!w)return;
  var x=findLivePc(w.getAttribute('data-pc'));if(!x)return;
  var s=sheetSel(x);
  if(el.id==='shMod'){s.mod=+el.value||0;if(e.type==='change')sheetRedraw(x);return;}
  if(el.id==='shDif'){s.dif=+el.value||0;return;}
  if(el.id==='shSurge'){s.surge=el.checked;sheetRedraw(x);return;}
  if(!canEditLivePc(x)||!SHEET_EDIT[x.id])return;
  var f=el.getAttribute('data-shf'),i=+el.getAttribute('data-i');
  if(el.id==='sh_specs') x.specs=el.value;
  else if(f==='dn'){x.disciplines[i][0]=el.value;}
  else if(f==='dp'){x.disciplines[i][2]=el.value;}
  else if(f==='an'){var av=x.advantages[i],am=advFind(el.value),ar;if(av[4])return;av[0]=el.value;
    if(am){av[2]=ADV_KIND_OF[am.kind]||'merit';ar=advRange(el.value);av[1]=Math.max(ar[0],Math.min(ar[1],+av[1]||ar[0]));}
    sheetRedraw(x);}
  else if(f==='ak'){x.advantages[i][2]=el.value;}
  else if(f==='at'){x.advantages[i][3]=el.value;}
  else if(f==='pred'||f==='huntA'||f==='huntS'||f==='notes'){x[f==='pred'?'predator':f]=el.value;}
  else if(f==='xpTotal'||f==='xpSpent'||f==='hBonus'||f==='wBonus'){x[f]=+el.value||0;if(f==='hBonus'||f==='wBonus')refreshTrackers(trkKey(x));}
  else return;
  sheetQueueSave(x);
}
document.addEventListener('input',sheetField);
document.addEventListener('change',sheetField);
