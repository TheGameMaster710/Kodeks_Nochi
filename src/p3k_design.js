/* ================= АВТОРСКИЙ ДИЗАЙН (скилл html-redesign) =================
   Отдельный слой поверх сайта (с v2.08 в основной сборке, см. RULES.md
   «АВТОРСКИЙ ДИЗАЙН»). Текст заметок не трогает: меняет оформление,
   фон, появление заголовка и переходы между страницами по типу страницы. */
(function(){
'use strict';
var RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var ROOT=document.documentElement;

/* ---------- темы: TH(key, mode, 'bg bg2 card fg mut line', 'a1 a2 a3', font, opts) ---------- */
var TH={};
function TH_(key,mode,cols,acc,font,o){var c=cols.split(' '),a=acc.split(' ');
  TH[key]={key:key,mode:mode,bg:c[0],bg2:c[1],card:c[2],fg:c[3],mut:c[4],line:c[5],a1:a[0],a2:a[1],a3:a[2],font:font,o:o||{}};}
/* титул «Пепел и корона»: четыре сцены ленты */
TH_('home-hero','dark','#0B0706 #140C09 #170E0B #F1E6D6 #B19C8A #4A3022','#E8772A #F2C14E #C8102E','Playfair Display SC',{sc:'ash',fx:'embers',en:'ember',g:'crown'});
TH_('home-world','dark','#06080C #0C1018 #0F1420 #E6E9EE #9AA3B2 #263247','#E0A04A #6D8FB5 #C8102E','Playfair Display SC',{sc:'city',fx:'rain'});
TH_('home-codex','dark','#0E0B07 #17120B #1B150D #EFE5D0 #AB9C82 #4A3C24','#D8B97A #B03A2E #7FB5A8','Playfair Display SC',{sc:'codex'});
TH_('home-cons','dark','#0D0507 #160A0D #1A0C10 #F0E2E2 #B39598 #4F1F27','#D0243F #C9A45C #E8772A','Playfair Display SC',{sc:'ledger'});
/* заметки */
TH_('eden','dark','#09030A #12060F #170812 #F6E7EE #BC9AAB #5A1630','#FF2A4F #FF8FB1 #B32BFF','Marck Script',{sc:'club',en:'neon',wp:'curtain',ru:'Marck Script'});
TH_('dossier','light','#E6DCC6 #DCD0B6 #F1EADB #1E1A15 #5E5547 #B8A98A','#B3261E #C9A227 #2C4A7A','PT Mono',{sc:'dossier',en:'type',wp:'folder',sk:'dossier'});
TH_('chronicle','light','#E7DABB #DCCBA4 #EFE5CB #2A1C11 #6A5238 #B49B70','#7A1C1C #9A7A2E #2E3B2A','Old Standard TT',{sc:'chronicle',en:'ink',wp:'ink',sk:'ledger'});
TH_('vitrine','dark','#14050A #1C0810 #200A12 #F4E9D6 #BFA88A #5B4220','#C9A44C #9B111E #EBD9A6','Forum',{sc:'vitrine',en:'engrave',wp:'vitrine',g:'sparrow',sk:'label'});
TH_('city','dark','#070A10 #0D121B #111824 #E8ECF1 #9AA6B6 #24324A','#E8A33C #1F6B45 #C8102E','Oswald',{sc:'street',fx:'rain',en:'sign',wp:'subway'});
TH_('heraldry','dark','#0C0710 #150C1A #1A0F20 #EFE6F2 #AD9BB4 #3E2A4A','#8E3BC4 #C9A45C #C8102E','Prata',{sc:'banners',en:'stamp',wp:'banner'});
TH_('reference','dark','#0B0F0E #111816 #141C1A #E7EEEB #A3B5AF #2A3B37','#7FB5A8 #C9A45C #D0243F','PT Serif',{sc:'scales',en:'sign',wp:'dots'});
TH_('alley','dark','#0A0806 #120D08 #16100A #F1E4CC #B9A587 #3E2C18','#E8A33C #9B111E #F2C14E','Oswald',{sc:'alley',fx:'rain',en:'sign',wp:'blood'});
TH_('gallery','dark','#0C1517 #12201F #152524 #ECE7DC #A7B2AC #2C4140','#D4AF37 #6FB7B1 #A45BD6','Bad Script',{sc:'gallery',en:'ink',wp:'brush'});
TH_('grimoire','dark','#140C07 #1E130B #24170D #F1E3C8 #B9A27E #4E3519','#C9A45C #B3261E #7A5BA8','Kurale',{sc:'grimoire',en:'stamp',wp:'page'});
TH_('catalog','dark','#0E0906 #17100B #1B130D #EFE6D8 #B2A28C #4A3826','#D8B97A #C8102E #7FB5A8','Playfair Display SC',{sc:'drawer'});

/* Тип страницы → семейство оформления. Одно семейство на группу записей одного типа,
   у ключевых записей — личный акцент (ACCENT). */
var FAMILY={person:'dossier',player:'dossier',threat:'dossier',lore:'chronicle',item:'vitrine',place:'city',domain:'city',
  clan:'heraldry',sect:'heraldry',merit:'reference',disc:'reference',ritual:'reference',predator:'reference'};
var ACCENT={'place/eden':'eden','predator/stray-cat':'alley','item/seymour-painting':'gallery','item/payne-diary':'grimoire'};
/* знак в центре шторки у предметов и гербов */
var GLYPH={'sparrow-ring':'sparrow','seymour-painting':'frame','payne-diary':'book',tremere:'tremere',brujah:'brujah',nosferatu:'bat',camarilla:'rose'};
/* цвета гербов: кланы и секты */
var CREST={tremere:'#9B4DD6',brujah:'#D7263D',nosferatu:'#7E9B5A',camarilla:'#C9A44C'};
/* ТЕСТ: оформление включено только на одном примере каждого типа */
var TEST_ONLY=false;
var TEST=[['','Титул','лента сцен'],['cat/people','Списки разделов','каталожный ящик'],['person/heinz','Личности','досье'],
  ['domain/brownsville','Домены и локации','уличный указатель'],['place/eden','Ключевая запись','личный акцент'],['lore/hecate-war','Лоршиты','летопись'],
  ['item/sparrow-ring','Предметы','витрина'],['clan/tremere','Кланы и секты','геральдика'],['merit/war-legacy','Механика','справочник'],['tool/masq','Инструменты','без изменений']];
var TEST_SET={};TEST.forEach(function(x){TEST_SET[x[0]]=1;});
function normH(h){return (h==null?location.hash:h).replace(/^#\/?/,'').replace(/\?.*$/,'');}
/* вид маршрута: титул, список, запись, рабочий инструмент */
function kindOf(h){h=normH(h);if(h===''||h==='world'||h==='cons'||h==='tools'||h==='cats')return 'home';
  if(/^cat\//.test(h))return 'list';if(/^(tool|pc|coterie|player|master|admin)\//.test(h))return 'work';
  if(/^[\w-]+\/[\w-]+$/.test(h))return 'note';return 'other';}
var FONTQ={'Playfair Display SC':'Playfair+Display+SC:wght@400;700','Marck Script':'Marck+Script','PT Mono':'PT+Mono',
  'Old Standard TT':'Old+Standard+TT:ital,wght@0,400;0,700;1,400','Forum':'Forum',
  'Oswald':'Oswald:wght@500;600','Prata':'Prata','Bad Script':'Bad+Script','Kurale':'Kurale','PT Serif':'PT+Serif:ital,wght@0,400;0,700;1,400'};
function routeKey(h){h=normH(h);var k=kindOf(h);
  if(k==='home')return 'home';
  if(TEST_ONLY&&!TEST_SET[h])return null;
  if(ACCENT[h])return ACCENT[h];
  if(k==='list')return 'catalog';
  if(k==='note'){var m=/^([\w-]+)\//.exec(h);return FAMILY[m[1]]||null;}
  return null;}

/* ---------- силуэты для масок (SVG в data-URI) ---------- */
function svgUri(body,vb){return 'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(vb||'0 0 100 100')+'">'+body+'</svg>')+'")';}
var SIL={
  crown:svgUri('<path d="M10 72 L6 34 L27 52 L38 20 L50 46 L62 20 L73 52 L94 34 L90 72 Z"/><circle cx="6" cy="30" r="4"/><circle cx="38" cy="16" r="4"/><circle cx="62" cy="16" r="4"/><circle cx="94" cy="30" r="4"/><rect x="10" y="77" width="80" height="7"/>'),
  frame:svgUri('<path fill-rule="evenodd" d="M10 18H90V90H10Z M21 29V79H79V29Z"/><path d="M50 3 L60 18 H40Z" fill="none" stroke="#000" stroke-width="3"/><path d="M30 70 C38 50 48 64 56 46 C62 56 68 52 72 70Z"/>'),
  book:svgUri('<path d="M47 24 C36 16 21 16 7 20 V82 C21 78 36 78 47 86Z M53 24 C64 16 79 16 93 20 V82 C79 78 64 78 53 86Z"/>'),
  tremere:svgUri('<path fill-rule="evenodd" d="M50 5 L97 89 H3Z M50 21 L83 81 H17Z"/><path fill-rule="evenodd" d="M27 63 C37 48 63 48 73 63 C63 78 37 78 27 63Z M50 55 A8 8 0 1 0 50.1 55Z M50 59 A4 4 0 1 1 49.9 59Z"/>'),
  brujah:svgUri('<path fill-rule="evenodd" d="M50 4 A46 46 0 1 1 49.9 4Z M50 11 A39 39 0 1 0 50.1 11Z"/><path fill-rule="evenodd" d="M17 29 H83 L50 86Z M29 36 H71 L50 72Z"/>'),
  bat:svgUri('<path d="M46 30 L48 35 L50 33 L52 35 L54 30 C56 33 57 37 55 40 C59 44 59 52 55 58 C53 62 51 65 50 67 C49 65 47 62 45 58 C41 52 41 44 45 40 C43 37 44 33 46 30Z"/><path d="M44 42 C35 31 19 26 3 30 C9 34 11 40 9 47 C15 45 20 47 22 53 C26 49 32 49 36 55 C38 49 41 47 44 49Z M56 42 C65 31 81 26 97 30 C91 34 89 40 91 47 C85 45 80 47 78 53 C74 49 68 49 64 55 C62 49 59 47 56 49Z"/>'),
  tower:svgUri('<path fill-rule="evenodd" d="M28 94 V40 H22 V22 H31 V29 H39 V22 H46 V29 H54 V22 H61 V29 H69 V22 H78 V40 H72 V94Z M44 94 V72 A6 6 0 0 1 56 72 V94Z M46 46 H54 V58 H46Z"/>'),
  rose:svgUri('<path d="M50 58 C38 57 27 50 25.5 38 C24.5 30 28 23 33.5 19 C31.5 25 35.5 29.5 40 31 C38.5 23 41.5 14.5 50 10 C58.5 14.5 61.5 23 60 31 C64.5 29.5 68.5 25 66.5 19 C72 23 75.5 30 74.5 38 C73 50 62 57 50 58Z"/><path d="M50 56 L39 64 L45.5 61.5 L50 67 L54.5 61.5 L61 64Z"/><path d="M48.6 62 C47.6 73 50.6 84 47.6 97 H52 C55 84 52 73 52.4 62Z"/><path d="M51.5 72 L58 68.5 L52.5 75Z M48.5 85 L42 82.5 L48 88Z"/><path d="M52.5 79 C58 71 70 68 78 72 C72 80 61 83 52.5 80Z"/><path d="M48 68 C42 61 30 60 24 64 C31 71 41 71 48 69.5Z"/>'),
  scales:svgUri('<path d="M48 8 H52 V84 H68 V90 H32 V84 H48Z M16 24 H84 V28 H16Z M24 28 L10 58 H38Z M76 28 L62 58 H90Z"/><circle cx="50" cy="20" r="5"/>'),
  vortex:svgUri('<path d="M50 50 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 0 12 -12 a18 18 0 1 1 -18 18 a24 24 0 1 0 24 -24 a30 30 0 1 1 -30 30 a36 36 0 1 0 36 -36" fill="none" stroke="#000" stroke-width="2.5"/>'),
  greyhound:svgUri('<path d="M8 60 C14 52 24 50 34 52 L62 52 C70 44 78 40 86 42 L94 44 L88 48 L84 52 C82 58 78 62 72 62 L74 82 H70 L66 64 L42 64 L36 82 H32 L32 64 C24 66 16 66 8 60Z M84 46 L90 36 L88 46Z"/>'),
  sparrow:svgUri('<ellipse cx="48" cy="56" rx="25" ry="15" transform="rotate(-12 48 56)"/><circle cx="71" cy="42" r="11"/><path d="M80 39 L93 43 L80 47 Z"/><path d="M28 60 L5 72 L9 77 L32 67 Z"/><path d="M30 52 C40 40 58 42 66 52 C54 50 42 54 30 60 Z" fill-opacity=".6"/><path d="M44 69 L41 84 H45 L48 70 M55 68 L56 84 H60 L59 68"/>'),
  urn:svgUri('<path d="M36 8 H64 V14 H60 C60 20 72 24 74 40 C76 60 66 76 58 82 H62 V90 H38 V82 H42 C34 76 24 60 26 40 C28 24 40 20 40 14 H36 Z"/>'),
  skyline:svgUri('<path d="M0 100 V70 H6 V58 H12 V70 H16 V40 H22 V30 H24 V40 H30 V66 H36 V52 H44 V64 H48 V20 H50 V10 H52 V20 H54 V60 H60 V46 H68 V62 H72 V36 H80 V58 H86 V48 H92 V68 H100 V100 Z"/>','0 0 100 100'),
  clip:svgUri('<path d="M30 6 a12 12 0 0 1 24 0 V70 a8 8 0 0 1 -16 0 V18" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>','0 -10 84 100')
};

/* ---------- стили слоя ---------- */
var CSS=[
'#rdDeco{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .5s}',
'html[data-rd] #rdDeco{opacity:1}',
'#rdFx{position:fixed;inset:0;z-index:2;pointer-events:none;width:100%;height:100%}',
'html[data-rd] #bgfx{opacity:0;transition:opacity .4s}',
'html[data-rd] body{background:var(--rbg);transition:background-color .6s}',
'html[data-rd] #app{--bg:var(--rbg);--bg-2:var(--rbg2);--panel:var(--rcard);--ink:var(--rfg);--ink-dim:var(--rmut);--line:var(--rline);',
'  --acc:var(--ra1);--acc-2:var(--ra2);--glow:var(--rglow);--acc-ink:var(--rbg);color:var(--rfg)}',
'html[data-rd] #app .jcard h1,html[data-rd] #app .sec-head h2,html[data-rd] #app .h-big,html[data-rd] #app .panel h4,html[data-rd] #app .cat h3,html[data-rd] #app .fact h3{font-family:var(--rfont),var(--serif)}',
'html[data-rd] #app .panel,html[data-rd] #app .def,html[data-rd] #app .card,html[data-rd] #app .ses{backdrop-filter:none}',
'.rdW{display:inline-block;white-space:nowrap}.rdL{display:inline-block}',
/* ===== титул ===== */
'html[data-rd="home"] #app .hero{background:none}',
'html[data-rd="home"] #app .h-big{letter-spacing:.01em;text-shadow:0 0 30px rgba(232,119,42,.25)}',
'html[data-rd="home"] #app .facts{background:var(--rline)}',
'html[data-rd="home"] #app .fact{background:var(--rbg2)}',
'html[data-rd="home"] #app .cat{background:var(--rbg2);border-radius:2px}',
'html[data-rds="cons"] #app .ses{border-left-color:var(--ra1)}',
/* ===== Эден: неон клуба ===== */
'html[data-rd="eden"] #app .jcard{background:linear-gradient(180deg,rgba(255,42,79,.06),transparent 40%),var(--rbg2);border-color:rgba(255,42,79,.35)}',
'html[data-rd="eden"] #app .jcard h1{font-family:"Marck Script",cursive;font-weight:400;font-size:clamp(64px,12vw,140px);color:#FFE3EA;',
'  text-shadow:0 0 4px #fff,0 0 12px #FF2A4F,0 0 28px #FF2A4F,0 0 60px rgba(255,42,79,.6)}',
'html[data-rd="eden"] #app .sec-head h2{font-family:"Marck Script",cursive;font-weight:400;color:#FFD2DC;text-shadow:0 0 10px rgba(255,42,79,.7)}',
'html[data-rd="eden"] #app .portrait{border:1px solid #FF2A4F;box-shadow:0 0 0 1px rgba(255,42,79,.25),0 0 40px rgba(255,42,79,.35)}',
'html[data-rd="eden"] #app .def{background:rgba(23,8,18,.92)}',
'html[data-rd="eden"] #app .defs{background:transparent;gap:1px}',
'html[data-rd="eden"] #app .def{outline:1px solid rgba(255,42,79,.28)}',
'html[data-rd="eden"] #app .panel{border-color:rgba(255,42,79,.3);border-left:2px solid #FF2A4F}',
/* ===== Ева Хайнц: досье ===== */
'html[data-rd="dossier"] #app .back,html[data-rd="dossier"] #app .eyebrow{color:#5E5547}',
'html[data-rd="dossier"] #app .jcard{background:#F4EEDF;border:1px solid #B8A98A;border-radius:0;box-shadow:6px 8px 0 -2px #CBBE9F;',
'  background-image:linear-gradient(90deg,transparent 46px,rgba(179,38,30,.35) 46px,rgba(179,38,30,.35) 47px,transparent 47px)}',
'html[data-rd="dossier"] #app .jcard::after{content:"";position:absolute;left:14px;top:90px;width:14px;height:14px;border-radius:50%;background:#DCD0B6;box-shadow:inset 1px 1px 2px rgba(0,0,0,.35),0 160px 0 #DCD0B6}',
'html[data-rd="dossier"] #app .jcard-top{padding-left:clamp(56px,7vw,80px)}',
'html[data-rd="dossier"] #app .jcard h1{font-family:"PT Mono",monospace;font-weight:700;text-transform:uppercase;letter-spacing:.04em;font-size:clamp(34px,6.4vw,74px);color:#1E1A15;text-shadow:none}',
'html[data-rd="dossier"] #app .jcard .princ{color:#3B352C;font-family:"PT Mono",monospace;font-size:clamp(14px,1.5vw,16.5px)}',
'html[data-rd="dossier"] #app .portrait{position:relative;overflow:visible;border-radius:0;background:#fff;padding:10px 10px 34px;transform:rotate(-1.6deg);box-shadow:0 10px 18px -8px rgba(30,26,21,.5)}',
'html[data-rd="dossier"] #app .portrait img{filter:grayscale(.15) contrast(1.05)}',
'html[data-rd="dossier"] #app .portrait::before{content:"";position:absolute;z-index:2;top:-30px;left:34px;width:34px;height:86px;background:#5C6670;-webkit-mask:'+SIL.clip+' center/contain no-repeat;mask:'+SIL.clip+' center/contain no-repeat}',
'html[data-rd="dossier"] #app .strip{background:#EAE1CC;border-top:1px dashed #B8A98A}',
'html[data-rd="dossier"] #app .strip div{border-right:1px dashed #B8A98A}',
'html[data-rd="dossier"] #app .sec-head h2{font-family:"PT Mono",monospace;text-transform:uppercase;letter-spacing:.06em;font-size:clamp(20px,2.8vw,28px);',
'  border-bottom:2px solid #1E1A15;padding-bottom:4px}',
'html[data-rd="dossier"] #app .panel,html[data-rd="dossier"] #app .def{background:#F4EEDF;border-radius:0}',
'html[data-rd="dossier"] #app .panel{border:1px solid #CBBE9F;background-image:repeating-linear-gradient(transparent 0 25px,rgba(44,74,122,.10) 25px 26px)}',
'html[data-rd="dossier"] #app .defs{background:#CBBE9F}',
'html[data-rd="dossier"] #app .def .l,html[data-rd="dossier"] #app .strip .l{font-family:"PT Mono",monospace;color:#B3261E}',
'html[data-rd="dossier"] #app .gm-block{border-left-color:#B3261E}',
'html[data-rd="dossier"] #app .wiki{color:#7E1A14;background:rgba(201,162,39,.22);border-color:rgba(179,38,30,.45)}',
/* ===== Война Гекаты: летопись 1784 года ===== */
'html[data-rd="chronicle"] #app .back,html[data-rd="chronicle"] #app .eyebrow{color:#6A5238}',
'html[data-rd="chronicle"] #app .jcard{background:rgba(239,229,203,.82);border:0;border-top:3px double #7A1C1C;border-bottom:3px double #7A1C1C;border-radius:0}',
'html[data-rd="chronicle"] #app .jcard h1{font-family:"Old Standard TT",serif;font-weight:700;font-style:italic;color:#2A1C11;text-shadow:none}',
'html[data-rd="chronicle"] #app .jcard .princ{font-family:"Old Standard TT",serif;color:#4A3826;font-size:clamp(16px,1.8vw,20px)}',
'html[data-rd="chronicle"] #app .strip{background:transparent;border-top:1px solid #B49B70}',
'html[data-rd="chronicle"] #app .sec-head h2{font-family:"Old Standard TT",serif;font-style:italic;color:#2A1C11}',
'html[data-rd="chronicle"] #app .sec-head{border-bottom:1px solid #B49B70;padding-bottom:6px}',
'html[data-rd="chronicle"] #app .defs{background:#B49B70}',
'html[data-rd="chronicle"] #app .def,html[data-rd="chronicle"] #app .panel,html[data-rd="chronicle"] #app .card{background:rgba(239,229,203,.9);border-radius:0}',
'html[data-rd="chronicle"] #app .def .l,html[data-rd="chronicle"] #app .card .tag{color:#7A1C1C;font-family:"Old Standard TT",serif;font-style:italic;letter-spacing:.08em;text-transform:none;font-size:13px}',
'html[data-rd="chronicle"] #app .card{border:1px solid #B49B70}',
'html[data-rd="chronicle"] #app .wiki{color:#6B1717;background:rgba(122,28,28,.08);border-color:rgba(122,28,28,.35)}',
'html[data-rd="chronicle"] #app .tl li::before{background:#E7DABB;border-color:#7A1C1C}',
'html[data-rd="chronicle"] #app .gm-block{border-left-color:#7A1C1C}',
/* ===== Кольцо клуба Воробья: витрина ===== */
'html[data-rd="vitrine"] #app .jcard{background:transparent;border:0}',
'html[data-rd="vitrine"] #app .jcard h1{font-family:Forum,serif;font-weight:400;letter-spacing:.06em;color:#EBD9A6;text-shadow:0 1px 0 #6B4F1C,0 0 30px rgba(201,164,76,.25);text-align:center}',
'html[data-rd="vitrine"] #app .jcard-top .eyebrow,html[data-rd="vitrine"] #app .jcard .princ{text-align:center;margin-left:auto;margin-right:auto}',
'html[data-rd="vitrine"] #app .portrait{border-radius:0;padding:14px;background:#0E0306;border:1px solid #C9A44C;outline:1px solid rgba(201,164,76,.35);outline-offset:6px;box-shadow:0 30px 60px -20px #000}',
'html[data-rd="vitrine"] #app .sec-head h2{font-family:Forum,serif;font-weight:400;letter-spacing:.04em;color:#EBD9A6}',
'html[data-rd="vitrine"] #app .panel,html[data-rd="vitrine"] #app .def{background:#1C0810;border-radius:0}',
'html[data-rd="vitrine"] #app .panel{border:1px solid rgba(201,164,76,.45);box-shadow:inset 0 0 0 4px #1C0810,inset 0 0 0 5px rgba(201,164,76,.25)}',
'html[data-rd="vitrine"] #app .defs{background:rgba(201,164,76,.35)}',
'html[data-rd="vitrine"] #app .def .l{color:#C9A44C;font-family:Forum,serif;letter-spacing:.18em;font-size:12px}',
'html[data-rd="vitrine"] #app .strip{background:#1C0810;border-top:1px solid rgba(201,164,76,.45)}',
/* ===== город: уличный указатель Нью-Йорка, сетка Манхэттена ===== */
'.sc-street .grid{position:absolute;inset:-50%;transform:rotate(29deg);background:repeating-linear-gradient(0deg,rgba(154,166,182,.07) 0 1px,transparent 1px 46px),repeating-linear-gradient(90deg,rgba(154,166,182,.11) 0 2px,transparent 2px 180px)}',
'.sc-street .pool{position:absolute;width:60vw;height:60vh;border-radius:50%;background:radial-gradient(closest-side,rgba(232,163,60,.16),transparent)}',
'.sc-street .pool.a{left:-15vw;bottom:-25vh}.sc-street .pool.b{right:-20vw;top:20vh;background:radial-gradient(closest-side,rgba(232,163,60,.09),transparent)}',
'html[data-rd="city"] #app .jcard{background:var(--rbg2);border-color:var(--rline);border-radius:2px}',
'html[data-rd="city"] #app .jcard h1{display:inline-block;background:#1F6B45;color:#fff;font-family:Oswald,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.04em;',
'  font-size:clamp(30px,5.6vw,68px);line-height:1.1;padding:.24em .62em .28em;margin:18px 0 22px 4px;border:3px solid #F4F4EE;border-radius:9px;box-shadow:0 0 0 4px #1F6B45,0 14px 30px -12px #000;text-shadow:none;max-width:calc(100% - 8px)}',
'html[data-rd="city"] #app .sec-head h2{font-family:Oswald,sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.06em;font-size:clamp(22px,3vw,32px)}',
'html[data-rd="city"] #app .panel{border-radius:2px;border-left:3px solid #E8A33C}',
'html[data-rd="city"] #app .def .l,html[data-rd="city"] #app .strip .l{color:#E8A33C}',
'html[data-rd="city"] #app .portrait{border-radius:2px;border:1px solid #24324A}',
/* ===== геральдика: знамёна клана ===== */
'.sc-banners .stone{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.018) 0 1px,transparent 1px 64px),repeating-linear-gradient(90deg,rgba(255,255,255,.012) 0 1px,transparent 1px 128px)}',
'.sc-banners .pennant{position:absolute;top:-2vh;width:min(9vw,110px);height:62vh;transform-origin:50% 0;clip-path:polygon(0 0,100% 0,100% 88%,50% 100%,0 88%);',
'  background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 30%,transparent 70%,rgba(0,0,0,.35)),var(--ra1);opacity:.22;animation:rdSway 7s ease-in-out infinite alternate}',
'.sc-banners .pennant.l{left:2.5vw}.sc-banners .pennant.r{right:2.5vw;animation-delay:-3s}',
'@keyframes rdSway{from{transform:rotate(-1.2deg)}to{transform:rotate(1.2deg)}}',
'html[data-rd="heraldry"] #app .jcard{background:var(--rbg2);border:1px solid var(--rline);border-top:4px solid var(--ra1);border-radius:0}',
'html[data-rd="heraldry"] #app .jcard h1{font-family:Prata,serif;font-weight:400;letter-spacing:.02em;text-shadow:0 0 30px rgba(var(--rglow),.35)}',
'html[data-rd="heraldry"] #app .sec-head h2{font-family:Prata,serif;font-weight:400}',
'html[data-rd="heraldry"] #app .sec-head h2::after{content:"";display:block;width:64px;height:5px;margin-top:8px;border-top:1px solid var(--ra2);border-bottom:1px solid var(--ra2)}',
'html[data-rd="heraldry"] #app .portrait{border-radius:0;border:1px solid var(--ra2);outline:1px solid rgba(201,164,92,.3);outline-offset:5px}',
'html[data-rd="heraldry"] #app .seat{border-radius:0;border-top-color:var(--ra1)}',
'html[data-rd="heraldry"] #app .wiki{color:color-mix(in srgb,var(--ra1) 50%,#fff)}',
'html[data-rd="heraldry"] #app .seat .ti,html[data-rd="heraldry"] #app .def .l{color:var(--ra2)}',
/* ===== справочник механики: ровно, читаемо, без движения ===== */
'html[data-rd="reference"] #app .jcard{background:var(--rbg2);border-radius:2px}',
'html[data-rd="reference"] #app .jcard h1{font-family:"PT Serif",serif;font-weight:700;letter-spacing:0;text-shadow:none}',
'html[data-rd="reference"] #app .sec-head h2{font-family:"PT Serif",serif;font-weight:700;font-size:clamp(24px,3vw,32px)}',
'html[data-rd="reference"] #app .panel{border-radius:2px;line-height:1.7}',
'html[data-rd="reference"] #app .panel strong,html[data-rd="reference"] #app .panel b{color:var(--ra1)}',
'html[data-rd="reference"] #app .def .l{color:var(--ra1)}',
/* ===== каталожные ящики: списки разделов ===== */
'.sc-drawer .wood{position:absolute;inset:0;background:repeating-linear-gradient(176deg,rgba(255,220,170,.025) 0 2px,transparent 2px 9px),repeating-linear-gradient(180deg,rgba(0,0,0,.15) 0 1px,transparent 1px 140px)}',
'.sc-drawer .lamp{position:absolute;left:50%;top:-35vh;width:110vw;height:90vh;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 35%,rgba(216,185,122,.12),transparent 62%)}',
'html[data-rd="catalog"] #app .sec-head h2{font-family:"Playfair Display SC",serif}',
'html[data-rd="catalog"] #app .sec-head h3{display:inline-block;font-family:"Playfair Display SC",serif;font-size:clamp(17px,2vw,21px);color:#2A1E10;',
'  background:linear-gradient(180deg,#E3C27A,#B48A3E);padding:4px 14px 5px;border-radius:2px;box-shadow:inset 0 1px 0 rgba(255,255,255,.45),0 2px 4px rgba(0,0,0,.5)}',
'html[data-rd="catalog"] #app .god-card:not(.ghost){--ink:#1E1A15;--ink-dim:#5E5547;--line:#C9BCA0;--acc:#8E1B14;--glow:142,27,20;color:#1E1A15;border:0;border-radius:2px;',
'  background:#EFE6D2 repeating-linear-gradient(transparent 0 25px,rgba(44,74,122,.13) 25px 26px);background-position:0 58px;box-shadow:0 8px 16px -10px #000}',
'html[data-rd="catalog"] #app .god-card:not(.ghost) h3{color:#1E1A15;border-bottom:1px solid rgba(179,38,30,.55);padding-bottom:6px}',
'html[data-rd="catalog"] #app .god-card:not(.ghost) .k{filter:brightness(.55) saturate(1.4)}',
'html[data-rd="catalog"] #app .god-card:not(.ghost)::before,html[data-rd="catalog"] #app .god-card:not(.ghost)::after{display:none}',
'html[data-rd="catalog"] #app .god-card.ghost{border-color:rgba(216,185,122,.35);background:rgba(0,0,0,.18)}',
/* ===== тестовая панель ===== */
'#rdTest{position:fixed;left:12px;bottom:12px;z-index:9000;font:500 12px/1.4 Manrope,system-ui,sans-serif;color:#EFE6DC;background:rgba(10,8,9,.92);border:1px solid rgba(201,164,92,.4);border-radius:4px;max-width:min(320px,calc(100vw - 24px))}',
'#rdTest summary{cursor:pointer;padding:8px 12px;font:700 10px/1 JetBrains Mono,monospace;letter-spacing:.18em;text-transform:uppercase;color:#C9A45C;list-style:none}',
'#rdTest summary::-webkit-details-marker{display:none}',
'#rdTest ol{margin:0;padding:0 12px 10px 30px;max-height:60vh;overflow:auto}',
'#rdTest li{margin:4px 0}#rdTest a{color:#EFE6DC;text-decoration:none}#rdTest a:hover{color:#C9A45C}#rdTest i{color:#A38F8C;font-style:normal}',
'@media print{#rdTest{display:none}}',
/* ===== справочник механики: весы достоинств и недостатков ===== */
'.sc-scales .rows{position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 37px,rgba(127,181,168,.06) 37px 38px)}',
'html[data-rd="reference"] #app .jcard{border-top:3px solid var(--ra2)}',
'html[data-rd="reference"] #app .jcard h1{font-family:"PT Serif",serif}',
'html[data-rd="reference"] #app .panel p strong:first-child,html[data-rd="reference"] #app .panel p b:first-child{color:var(--ra2);letter-spacing:.02em}',
'html[data-rd="reference"] #app .portrait{border-radius:2px;border:1px solid var(--ra2)}',
/* ===== картина Эвы Сэймур: галерея и воронка видений ===== */
'@keyframes rdSpin{to{transform:rotate(360deg)}}',
'.sc-gallery .wall{position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.012) 0 1px,transparent 1px 7px),#0C1517}',
'.sc-gallery .lamp{position:absolute;left:50%;top:-6vh;width:min(80vw,800px);height:70vh;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 0,rgba(255,226,160,.20),transparent 65%)}',
'html[data-rd="gallery"] #app .jcard{background:transparent;border:0}',
'html[data-rd="gallery"] #app .jcard h1{font-family:"Bad Script",cursive;font-weight:400;color:#F2E6C8;text-shadow:none;text-align:center}',
'html[data-rd="gallery"] #app .jcard h1{margin-top:18px;line-height:1.2}',
'html[data-rd="gallery"] #app .jcard-top .eyebrow,html[data-rd="gallery"] #app .jcard .princ{text-align:center;margin-left:auto;margin-right:auto}',
'html[data-rd="gallery"] #app .portrait{border-radius:0;border:16px solid transparent;border-image:linear-gradient(135deg,#8A6A1E,#E9CB6E 30%,#8A6A1E 55%,#D4AF37 80%,#6B4F12) 1;box-shadow:0 0 0 1px #3A2A08,0 30px 60px -20px #000,inset 0 0 0 1px rgba(0,0,0,.6)}',
'html[data-rd="gallery"] #app .sec-head h2{font-family:"Bad Script",cursive;font-weight:400;color:#F2E6C8}',
'html[data-rd="gallery"] #app .panel,html[data-rd="gallery"] #app .def{background:#132321;border-radius:0}',
'html[data-rd="gallery"] #app .def .l{color:#6FB7B1}',
'html[data-rd="gallery"] #app .strip{background:#12201F}',
/* ===== дневник Джоуэла Пэйна: гримуар в коже ===== */
'.sc-grimoire .leather{position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.25) 1px,transparent 1.5px) 0 0/5px 5px,radial-gradient(ellipse at 50% 40%,#2A1A0E,#140C07 75%)}',
'.sc-grimoire .circ{position:absolute;border-radius:50%;border:1px solid rgba(201,164,92,.10);animation:rdSpin 160s linear infinite}',
'.sc-grimoire .circ.a{width:110vmin;height:110vmin;left:50%;top:50%;margin:-55vmin 0 0 -55vmin;outline:1px dashed rgba(201,164,92,.07);outline-offset:-5vmin}',
'.sc-grimoire .circ.b{width:70vmin;height:70vmin;left:50%;top:50%;margin:-35vmin 0 0 -35vmin;border-style:dotted;animation-direction:reverse}',
'.sc-grimoire .candle{position:absolute;left:-15vw;bottom:-20vh;width:60vw;height:60vh;background:radial-gradient(circle,rgba(242,170,80,.16),transparent 60%);animation:rdFlick 3s ease-in-out infinite alternate}',
'html[data-rd="grimoire"] #app .jcard{background:#1E130B;border:1px solid #4E3519;box-shadow:inset 0 0 0 6px #1E130B,inset 0 0 0 7px rgba(201,164,92,.45)}',
'html[data-rd="grimoire"] #app .jcard h1{font-family:Kurale,serif;font-weight:400;color:#F1E3C8;text-shadow:0 0 22px rgba(179,38,30,.35)}',
'html[data-rd="grimoire"] #app .sec-head h2{font-family:Kurale,serif;font-weight:400}',
'html[data-rd="grimoire"] #app .panel,html[data-rd="grimoire"] #app .def{background:#24170D;border-radius:0}',
'html[data-rd="grimoire"] #app .panel{border:1px solid #4E3519;box-shadow:inset 0 0 0 3px #24170D,inset 0 0 0 4px rgba(201,164,92,.25)}',
'html[data-rd="grimoire"] #app .portrait{border-radius:0;border:1px solid rgba(201,164,92,.5)}',
/* ===== гербы: свой рисунок на фоне у каждого клана и секты ===== */
'.sc-crest-tremere .arc{position:absolute;border-radius:50%;border:1px solid rgba(155,77,214,.16);animation:rdSpin 140s linear infinite}',
'.sc-crest-tremere .arc.a{width:90vmin;height:90vmin;right:-25vmin;top:-20vmin;outline:1px dashed rgba(155,77,214,.10);outline-offset:-6vmin}',
'.sc-crest-tremere .arc.b{width:60vmin;height:60vmin;left:-18vmin;bottom:-18vmin;border-style:dotted;animation-direction:reverse}',
'.sc-crest-tremere .shelves{position:absolute;left:0;right:0;bottom:0;height:22vh;background:repeating-linear-gradient(90deg,rgba(201,164,92,.05) 0 10px,transparent 10px 13px,rgba(155,77,214,.05) 13px 21px,transparent 21px 26px);-webkit-mask:linear-gradient(0deg,#000,transparent);mask:linear-gradient(0deg,#000,transparent)}',
'.sc-crest-brujah .fence{position:absolute;inset:0;background:repeating-linear-gradient(45deg,rgba(220,220,220,.05) 0 2px,transparent 2px 34px),repeating-linear-gradient(-45deg,rgba(220,220,220,.05) 0 2px,transparent 2px 34px);-webkit-mask:linear-gradient(180deg,transparent 30%,#000);mask:linear-gradient(180deg,transparent 30%,#000)}',
'.sc-crest-brujah .glow{position:absolute;left:-10%;right:-10%;bottom:-20vh;height:50vh;background:radial-gradient(ellipse at 50% 100%,rgba(215,38,61,.18),transparent 65%)}',
'.sc-crest-nosferatu .fog{position:absolute;left:-20%;right:-20%;bottom:-5vh;height:45vh;background:radial-gradient(ellipse at 40% 90%,rgba(126,155,90,.12),transparent 60%);animation:rdDrift 40s linear infinite alternate}',
/* ===== Бродячий кот: подворотня под натриевым фонарём ===== */
'.sc-alley .bricks{position:absolute;top:0;bottom:0;width:min(16vw,200px);background:repeating-linear-gradient(0deg,rgba(0,0,0,.55) 0 2px,transparent 2px 22px),repeating-linear-gradient(90deg,rgba(0,0,0,.45) 0 2px,transparent 2px 46px),linear-gradient(90deg,#2A140C,#1A0C07);opacity:.55}',
'.sc-alley .bricks.l{left:0;-webkit-mask:linear-gradient(90deg,#000,transparent);mask:linear-gradient(90deg,#000,transparent)}',
'.sc-alley .bricks.r{right:0;-webkit-mask:linear-gradient(270deg,#000,transparent);mask:linear-gradient(270deg,#000,transparent)}',
'.sc-alley .lamp{position:absolute;left:50%;top:-10vh;width:70vw;height:80vh;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 10%,rgba(232,163,60,.22),transparent 60%);animation:rdFlick 4s ease-in-out infinite alternate}',
'.sc-alley .wet{position:absolute;left:0;right:0;bottom:0;height:24vh;background:linear-gradient(0deg,rgba(232,163,60,.08),transparent)}',
'html[data-rd="alley"] #app .jcard{background:var(--rbg2);border:1px solid var(--rline);border-radius:2px}',
'html[data-rd="alley"] #app .jcard h1{font-family:Oswald,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:#F2C14E;transform:skewX(-6deg);transform-origin:left;',
'  text-shadow:3px 3px 0 #120D08,5px 5px 0 rgba(155,17,30,.75)}',
'html[data-rd="alley"] #app .sec-head h2{font-family:Oswald,sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#F2C14E}',
'html[data-rd="alley"] #app .panel,html[data-rd="alley"] #app .def,html[data-rd="alley"] #app .card{background:#16100A;border-radius:2px}',
'html[data-rd="alley"] #app .panel{border-left:3px solid #9B111E}',
'html[data-rd="alley"] #app .def .l,html[data-rd="alley"] #app .strip .l{color:#E8A33C}',
'html[data-rd="alley"] #app .portrait{border-radius:2px;border:1px solid #3E2C18;box-shadow:0 20px 40px -18px #000}',
/* ===== сцены ===== */
'.sc{position:absolute;inset:0}',
'.sc-sil{position:absolute;background:var(--rfg);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center}',
/* пепел: тлеющая кромка снизу и корона в дыму */
'.sc-ash .smoulder{position:absolute;left:-10%;right:-10%;bottom:-30vh;height:60vh;background:radial-gradient(ellipse at 50% 100%,rgba(232,119,42,.32),rgba(200,16,46,.12) 40%,transparent 70%);animation:rdSmoulder 5s ease-in-out infinite alternate}',
'.sc-ash .smoke{position:absolute;inset:-20%;background:repeating-radial-gradient(circle at 30% 120%,rgba(255,255,255,.018) 0 40px,transparent 40px 90px);animation:rdDrift 40s linear infinite}',
'@keyframes rdSmoulder{from{opacity:.7}to{opacity:1;transform:scaleX(1.05)}}',
'@keyframes rdDrift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-6%,-8%,0)}}',
/* город: натриевый свет, силуэт Манхэттена */
'.sc-city .sodium{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 110%,rgba(224,160,74,.20),transparent 55%),radial-gradient(ellipse at 85% 105%,rgba(109,143,181,.16),transparent 55%)}',
'.sc-city .sky{position:absolute;left:0;right:0;bottom:0;height:42vh;opacity:.10}',
/* кодекс: обрезы страниц по краям */
'.sc-codex .edge{position:absolute;top:0;bottom:0;width:min(9vw,90px);background:repeating-linear-gradient(90deg,rgba(216,185,122,.10) 0 1px,transparent 1px 4px);opacity:.8}',
'.sc-codex .edge.l{left:0;-webkit-mask:linear-gradient(90deg,#000,transparent);mask:linear-gradient(90deg,#000,transparent)}',
'.sc-codex .edge.r{right:0;-webkit-mask:linear-gradient(270deg,#000,transparent);mask:linear-gradient(270deg,#000,transparent)}',
'.sc-codex .lamp{position:absolute;left:50%;top:-30vh;width:120vw;height:90vh;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 30%,rgba(216,185,122,.10),transparent 60%)}',
/* книга последствий: линовка гроссбуха */
'.sc-ledger .rule{position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 31px,rgba(208,36,63,.10) 31px 32px)}',
'.sc-ledger .margin{position:absolute;top:0;bottom:0;left:max(16px,calc(50% - 640px));width:6px;border-left:1px solid rgba(208,36,63,.35);border-right:1px solid rgba(208,36,63,.35)}',
/* клуб: лучи прожекторов и дым над танцполом */
'.sc-club .beam{position:absolute;top:-10vh;width:38vw;height:120vh;transform-origin:50% 0;clip-path:polygon(46% 0,54% 0,100% 100%,0 100%);',
'  background:linear-gradient(180deg,rgba(255,42,79,.30),rgba(255,42,79,.02) 80%);mix-blend-mode:screen}',
'.sc-club .beam.a{left:6vw;animation:rdSweepA 9s ease-in-out infinite alternate}',
'.sc-club .beam.b{right:6vw;background:linear-gradient(180deg,rgba(179,43,255,.24),rgba(179,43,255,.02) 80%);animation:rdSweepB 11s ease-in-out infinite alternate}',
'.sc-club .haze{position:absolute;left:-20%;right:-20%;bottom:-10vh;height:55vh;background:radial-gradient(ellipse at 30% 80%,rgba(255,143,177,.10),transparent 60%),radial-gradient(ellipse at 75% 90%,rgba(179,43,255,.08),transparent 60%);animation:rdDrift 30s linear infinite alternate}',
'.sc-club .floor{position:absolute;left:0;right:0;bottom:0;height:18vh;background:linear-gradient(0deg,rgba(255,42,79,.12),transparent)}',
'@keyframes rdSweepA{from{transform:rotate(-18deg)}to{transform:rotate(10deg)}}',
'@keyframes rdSweepB{from{transform:rotate(16deg)}to{transform:rotate(-12deg)}}',
/* досье: бумага, дырки скоросшивателя и подпалина в углу */
'.sc-dossier .paper{position:absolute;inset:0;background:radial-gradient(rgba(94,85,71,.06) 1px,transparent 1.2px) 0 0/6px 6px}',
'.sc-dossier .scorch{position:absolute;right:-12vw;bottom:-14vh;width:46vw;height:40vh;background:radial-gradient(ellipse at 70% 75%,rgba(40,24,10,.55),rgba(120,70,30,.25) 35%,rgba(201,162,39,.12) 55%,transparent 70%);filter:blur(2px)}',
/* летопись: пергамент, подпалённые края, урны */
'.sc-chronicle .vign{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 62%,rgba(106,70,30,.14) 88%,rgba(60,30,10,.24))}',
'.sc-chronicle .fib{position:absolute;inset:0;background:repeating-linear-gradient(8deg,rgba(106,82,56,.035) 0 2px,transparent 2px 7px)}',
'.sc-chronicle .candle{position:absolute;left:-20vw;top:-20vh;width:80vw;height:80vh;background:radial-gradient(circle,rgba(242,180,80,.22),transparent 60%);animation:rdFlick 3.2s ease-in-out infinite alternate}',
'@keyframes rdFlick{0%{opacity:.75}40%{opacity:1}60%{opacity:.85}100%{opacity:.95}}',
/* витрина: бархат, луч сверху, силуэт воробья на стене */
'.sc-vitrine .velvet{position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,rgba(255,255,255,.012) 2px 5px),linear-gradient(180deg,#22070E,#12040A)}',
'.sc-vitrine .spot{position:absolute;left:50%;top:-12vh;width:min(90vw,900px);height:110vh;transform:translateX(-50%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);',
'  background:linear-gradient(180deg,rgba(235,217,166,.16),rgba(235,217,166,.03) 75%,transparent)}',
/* граф связей на светлых страницах: светлая подложка, тёмные подписи с бумажной обводкой */
'html[data-mode="light"] #app .web{background:rgba(255,250,236,.55)}',
'html[data-mode="light"] #app .web .node text{fill:var(--rfg);stroke:var(--rcard);stroke-width:4px}',
'html[data-mode="light"] #app .web .node.me text{fill:var(--ra1)}',
'html[data-mode="light"] #app{--mute:var(--rmut)}',
'html[data-mode="light"] footer,html[data-mode="light"] footer *{color:var(--rmut)!important}',
'html[data-mode="light"] #app{--ok:#2E7D4F;--bad:#A8231B}',
'html[data-mode="light"] #app span[style*="color"]:not(.wiki){filter:brightness(.5) saturate(1.5)}',
'html[data-mode="light"] #app .zoomctl button{background:var(--rcard);color:var(--rfg);border-color:var(--rline)}',
'@media (prefers-reduced-motion: reduce){#rdDeco *{animation:none!important}.rdL{animation:none!important;opacity:1!important;filter:none!important;transform:none!important}}',
/* ===== переходы ===== */
'#rdWipe{position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden}',
'#rdWipe>div{position:absolute}',
'#rdWipe .glyph{left:50%;top:50%;width:120px;height:120px;margin:-60px 0 0 -60px;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}',
/* печать: без сцен */
'@media print{#rdDeco,#rdFx,#rdWipe{display:none!important}html[data-rd] body{background:#fff!important}}'
].join('\n');

/* ---------- сцены ---------- */
function sil(name,st){return '<div class="sc-sil" style="-webkit-mask-image:'+SIL[name].replace(/"/g,'&quot;')+';mask-image:'+SIL[name].replace(/"/g,'&quot;')+';'+st+'"></div>';}
var SCENES={
  ash:function(){return '<div class="smoulder"></div>'+sil('crown','right:6vw;top:14vh;width:min(26vw,300px);height:min(26vw,300px);opacity:.028');},
  city:function(){return '<div class="sodium"></div>'+sil('skyline','left:0;right:0;bottom:0;height:42vh;opacity:.12;-webkit-mask-size:100% 100%;mask-size:100% 100%');},
  codex:function(){return '<div class="lamp"></div><div class="edge l"></div><div class="edge r"></div>';},
  ledger:function(){return '<div class="rule"></div><div class="margin"></div>';},
  club:function(){return '<div class="beam a"></div><div class="beam b"></div><div class="haze"></div><div class="floor"></div>';},
  dossier:function(){return '<div class="paper"></div><div class="scorch"></div>';},
  chronicle:function(){return '<div class="fib"></div><div class="candle"></div><div class="vign"></div>'+
    sil('urn','left:3vw;bottom:4vh;width:70px;height:110px;opacity:.10')+sil('urn','left:calc(3vw + 60px);bottom:4vh;width:54px;height:86px;opacity:.08')+sil('urn','right:4vw;bottom:5vh;width:64px;height:100px;opacity:.09');},
  street:function(){return '<div class="grid"></div><div class="pool a"></div><div class="pool b"></div>'+sil('skyline','left:0;right:0;bottom:0;height:30vh;opacity:.10;-webkit-mask-size:100% 100%;mask-size:100% 100%');},
  banners:function(){return '<div class="stone"></div><div class="pennant l"></div><div class="pennant r"></div>';},
  drawer:function(){return '<div class="wood"></div><div class="lamp"></div>';},
  none:function(){return '';},
  alley:function(){return '<div class="bricks l"></div><div class="bricks r"></div><div class="lamp"></div><div class="wet"></div>';},
  scales:function(){return '<div class="rows"></div>'+sil('scales','right:3vw;top:18vh;width:min(26vw,300px);height:min(26vw,300px);opacity:.05');},
  gallery:function(){return '<div class="wall"></div><div class="lamp"></div>'+sil('vortex','left:50%;top:45%;width:120vmin;height:120vmin;margin:-60vmin 0 0 -60vmin;opacity:.05;animation:rdSpin 120s linear infinite');},
  grimoire:function(){return '<div class="leather"></div><div class="circ a"></div><div class="circ b"></div><div class="candle"></div>';},
  'crest-tremere':function(){return SCENES.banners()+'<div class="arc a"></div><div class="arc b"></div><div class="shelves"></div>';},
  'crest-brujah':function(){return SCENES.banners()+'<div class="fence"></div><div class="glow"></div>';},
  'crest-nosferatu':function(){return SCENES.banners()+'<div class="fog"></div>'+sil('tower','left:6vw;bottom:0;width:min(22vw,260px);height:min(30vw,340px);opacity:.07')+sil('greyhound','right:8vw;bottom:2vh;width:min(18vw,220px);height:min(12vw,140px);opacity:.07')+sil('greyhound','right:22vw;bottom:2vh;width:min(14vw,170px);height:min(9vw,110px);opacity:.05;transform:scaleX(-1)');},
  'crest-camarilla':function(){return SCENES.banners()+sil('rose','left:5vw;top:20vh;width:min(14vw,170px);height:min(14vw,170px);opacity:.06;transform:rotate(-14deg)')+sil('rose','right:6vw;bottom:8vh;width:min(18vw,220px);height:min(18vw,220px);opacity:.06;transform:rotate(12deg)')+sil('rose','right:28vw;top:10vh;width:min(8vw,100px);height:min(8vw,100px);opacity:.04');},
  vitrine:function(){return '<div class="velvet"></div><div class="spot"></div>'+sil('sparrow','left:4vw;top:16vh;width:min(22vw,240px);height:min(22vw,240px);opacity:.05');}
};

/* ---------- частицы ---------- */
var FX={cv:null,ctx:null,kind:null,parts:[],raf:0};
function fxSet(kind,t){
  try{
    if(!FX.cv){FX.cv=document.createElement('canvas');FX.cv.id='rdFx';FX.cv.setAttribute('aria-hidden','true');document.body.appendChild(FX.cv);FX.ctx=FX.cv.getContext('2d');
      addEventListener('resize',function(){if(FX.kind)fxSet(FX.kind,FX.t);});}
    cancelAnimationFrame(FX.raf);FX.kind=kind;FX.t=t;FX.parts=[];
    var c=FX.cv,dpr=Math.min(2,window.devicePixelRatio||1);c.width=innerWidth*dpr;c.height=innerHeight*dpr;FX.ctx.setTransform(dpr,0,0,dpr,0,0);
    FX.ctx.clearRect(0,0,innerWidth,innerHeight);
    if(!kind)return;
    var n=Math.min(70,Math.round(innerWidth*innerHeight/(kind==='rain'?16000:22000)));
    for(var i=0;i<n;i++)FX.parts.push(spawn(kind,true));
    var last=performance.now();
    function step(now){var dt=Math.min(50,now-last)/16.7;last=now;draw(dt);if(!RM)FX.raf=requestAnimationFrame(step);}
    if(RM)draw(0);else FX.raf=requestAnimationFrame(step);
  }catch(e){}
}
function spawn(kind,init){var W=innerWidth,H=innerHeight;
  if(kind==='embers')return {x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*1.8+.6,vy:-(Math.random()*.6+.25),vx:(Math.random()-.5)*.3,ph:Math.random()*6.28,life:Math.random()};
  return {x:Math.random()*(W+200)-100,y:init?Math.random()*H:-20,l:Math.random()*14+8,v:Math.random()*4+7};}
function draw(dt){var g=FX.ctx,W=innerWidth,H=innerHeight;g.clearRect(0,0,W,H);
  FX.parts.forEach(function(p,i){
    if(FX.kind==='embers'){p.ph+=.03*dt;p.x+=(p.vx+Math.sin(p.ph)*.25)*dt;p.y+=p.vy*dt;
      var a=.35+.45*Math.abs(Math.sin(p.ph*1.7));g.fillStyle='rgba(255,'+(120+Math.round(60*a))+',40,'+(a*.8).toFixed(2)+')';
      g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill();if(p.y<-10)FX.parts[i]=spawn('embers');}
    else{p.y+=p.v*dt;p.x-=p.v*.18*dt;g.strokeStyle='rgba(170,190,220,.16)';g.lineWidth=1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+p.l*.18,p.y-p.l);g.stroke();
      if(p.y>H+20)FX.parts[i]=spawn('rain');}
  });}

/* ---------- движок тем ---------- */
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
var cur=null,curScene=null,fontsDone={};
function loadFont(f){if(!f||fontsDone[f]||!FONTQ[f])return;fontsDone[f]=1;
  try{var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+FONTQ[f]+'&display=swap';document.head.appendChild(l);}catch(e){}}
function applyTheme(t,instant){
  var deco=document.getElementById('rdDeco');
  if(!t){ROOT.removeAttribute('data-rd');ROOT.removeAttribute('data-rds');ROOT.removeAttribute('data-mode');
    ['--rbg','--rbg2','--rcard','--rfg','--rmut','--rline','--ra1','--ra2','--ra3','--rglow','--rfont'].forEach(function(k){ROOT.style.removeProperty(k);});
    cur=null;curScene=null;fxSet(null);return;}
  var base=t.key.indexOf('home-')===0?'home':t.key;
  ROOT.setAttribute('data-rd',base);ROOT.setAttribute('data-mode',t.mode);
  if(base==='home')ROOT.setAttribute('data-rds',t.key.slice(5));else ROOT.removeAttribute('data-rds');
  var V={'--rbg':t.bg,'--rbg2':t.bg2,'--rcard':t.card,'--rfg':t.fg,'--rmut':t.mut,'--rline':t.line,'--ra1':t.a1,'--ra2':t.a2,'--ra3':t.a3,
    '--rglow':hex2rgb(t.a1).join(','),'--rfont':'"'+t.font+'"'};
  for(var k in V)ROOT.style.setProperty(k,V[k]);
  loadFont(t.font);if(t.o.ru)loadFont(t.o.ru);
  if(cur!==t.key){cur=t.key;buildScene(t,deco,instant);}
}
function buildScene(t,deco,instant){
  try{if(curScene===t.o.sc)return;curScene=t.o.sc;
    var html='<div class="sc sc-'+t.o.sc+'">'+(SCENES[t.o.sc]?SCENES[t.o.sc]():'')+'</div>';
    var olds=[].slice.call(deco.children),nw=document.createElement('div');nw.className='sc-wrap';nw.innerHTML=html;
    if(instant){olds.forEach(function(o){deco.removeChild(o);});nw.style.cssText='position:absolute;inset:0';deco.appendChild(nw);}
    else{nw.style.cssText='position:absolute;inset:0;opacity:0;transition:opacity .7s';deco.appendChild(nw);requestAnimationFrame(function(){nw.style.opacity=1;});
      olds.forEach(function(o){o.setAttribute('data-gone','1');setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},750);});}
  }catch(e){}
  fxSet(t.o.fx||null,t);
}

/* ---------- появление букв заголовка ---------- */
var ENTER={
  ember:{kf:[{opacity:0,color:'#FFB15A',filter:'blur(6px)',textShadow:'0 0 24px #E8772A'},{opacity:1,color:'#FFB15A',filter:'blur(0)',offset:.45},{opacity:1}],dur:1100,each:.06},
  neon:{kf:[{opacity:0},{opacity:1,offset:.1},{opacity:.2,offset:.18},{opacity:1,offset:.3},{opacity:.4,offset:.4},{opacity:1}],dur:900,each:.05},
  type:{kf:[{opacity:0},{opacity:0,offset:.99},{opacity:1}],dur:60,each:.07},
  ink:{kf:[{opacity:0,filter:'blur(8px)',transform:'scale(1.15)'},{opacity:1,filter:'blur(0)',transform:'scale(1)'}],dur:900,each:.06},
  sign:{kf:[{opacity:0,transform:'translateY(-40%)'},{opacity:1,transform:'none'}],dur:380,each:.03},
  stamp:{kf:[{opacity:0,transform:'scale(1.8)'},{opacity:1,transform:'scale(.96)',offset:.7},{opacity:1,transform:'scale(1)'}],dur:420,each:.06},
  engrave:{kf:[{opacity:0,transform:'translateY(8px)',color:'#FFF6D8'},{opacity:1,transform:'translateY(0)',color:'#FFF6D8',offset:.5},{opacity:1}],dur:1000,each:.05}
};
function splitLetters(el){
  if(!el||el.getAttribute('data-rdsplit'))return [];
  el.setAttribute('data-rdsplit','1');var out=[];
  var tn=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;while((n=w.nextNode()))tn.push(n);
  tn.forEach(function(t){var parts=t.nodeValue.split(/(\s+)/),frag=document.createDocumentFragment();
    parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return;}
      var wd=document.createElement('span');wd.className='rdW';
      for(var i=0;i<p.length;i++){var s=document.createElement('span');s.className='rdL';s.textContent=p[i];wd.appendChild(s);out.push(s);}
      frag.appendChild(wd);});
    t.parentNode.replaceChild(frag,t);});
  return out;
}
function enter(el,kind){
  try{var E=ENTER[kind];if(!E||!el)return;var L=splitLetters(el);if(!L.length||RM)return;
    var gap=Math.min(E.each,1.3/L.length)*1000;
    L.forEach(function(s,i){s.style.opacity=0;var a=s.animate(E.kf,{duration:E.dur,delay:i*gap,easing:'ease-out',fill:'forwards'});
      a.onfinish=function(){s.style.opacity='';try{a.cancel();}catch(e){}};});
  }catch(e){}
}

/* ---------- лента титула: тема меняется при входе раздела в экран ---------- */
var io=null;
function homeSections(){
  if(io){io.disconnect();io=null;}
  var app=document.getElementById('app');if(!app)return;
  var map=[['.hero','home-hero'],['.facts','home-world'],['#world','home-world'],['#cats','home-codex'],['#tools','home-codex'],['#cons','home-cons']];
  var els=[];map.forEach(function(m){var e=app.querySelector(m[0]);if(e){e.setAttribute('data-rdk',m[1]);els.push(e);}});
  if(!('IntersectionObserver' in window))return;
  io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&ROOT.getAttribute('data-rd')==='home')applyTheme(TH[e.target.getAttribute('data-rdk')]);});},{rootMargin:'-45% 0px -50% 0px'});
  els.forEach(function(e){io.observe(e);});
}

/* ---------- после отрисовки страницы ---------- */
var SEEN={};
function decorate(){
  try{
    var k=routeKey();
    if(!k){if(io){io.disconnect();io=null;}applyTheme(null);var dd=document.getElementById('rdDeco');if(dd)dd.innerHTML='';return;}
    var app=document.getElementById('app');
    if(k==='home'){applyTheme(TH['home-hero'],true);homeSections();enter(app.querySelector('.h-big'),'ember');return;}
    if(io){io.disconnect();io=null;}
    var h=normH(),t=TH[k];
    if(k==='heraldry'){var cid=h.split('/')[1];if(SCENES['crest-'+cid]){t=JSON.parse(JSON.stringify(t));t.o.sc='crest-'+cid;}}
    applyTheme(t,true);
    if(k==='heraldry'){var id=h.split('/')[1],c=CREST[id];if(c){ROOT.style.setProperty('--ra1',c);ROOT.style.setProperty('--rglow',hex2rgb(c).join(','));
      /* фон и линии в оттенке герба, а не общий фиолетовый */
      ROOT.style.setProperty('--rbg','color-mix(in srgb,'+c+' 6%,#08070A)');ROOT.style.setProperty('--rbg2','color-mix(in srgb,'+c+' 10%,#0E0C10)');
      ROOT.style.setProperty('--rcard','color-mix(in srgb,'+c+' 12%,#121015)');ROOT.style.setProperty('--rline','color-mix(in srgb,'+c+' 35%,#2A2630)');}}
    /* частый маршрут запись → запись: буквы собираются только при первом заходе на запись */
    var first=!SEEN[h];SEEN[h]=1;
    if(first)enter(app.querySelector('.jcard h1'),t.o.en);
    if(k==='catalog'&&first&&!RM){[].slice.call(app.querySelectorAll('.god-card')).forEach(function(c,i){
      try{c.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:420,delay:Math.min(i*45,600),easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'});}catch(e){}});}
  }catch(e){try{console.warn('Оформление не применилось: '+e.message);}catch(_){}}
}

/* ---------- переходы между страницами ---------- */
var WIPES={
  /* титул: занавес пепла с тлеющей кромкой падает сверху */
  ash:function(W,fn){var d=div(W,'left:0;right:0;top:0;height:120vh;background:linear-gradient(180deg,#0B0706 80%,#E8772A 92%,rgba(200,16,46,0));transform:translateY(-120vh)');
    var g=glyph(W,'crown','#E8772A');
    return seq([[d,[{transform:'translateY(-120vh)'},{transform:'translateY(0)'}],420,'ease-in'],[g,[{opacity:0,transform:'scale(.8)'},{opacity:.9,transform:'scale(1)'}],220,'ease-out']],fn,
      [[d,[{transform:'translateY(0)'},{transform:'translateY(120vh)'}],480,'ease-out'],[g,[{opacity:.9},{opacity:0}],200,'linear']]);},
  /* Эден: бархатный занавес сцены сходится и расходится */
  curtain:function(W,fn){var fold='repeating-linear-gradient(90deg,#4A0716 0 18px,#6E0B22 18px 30px,#3A0511 30px 44px)';
    var l=div(W,'left:0;top:0;bottom:0;width:51vw;background:'+fold+';box-shadow:inset -20px 0 30px rgba(0,0,0,.5);transform:translateX(-100%)');
    var r=div(W,'right:0;top:0;bottom:0;width:51vw;background:'+fold+';box-shadow:inset 20px 0 30px rgba(0,0,0,.5);transform:translateX(100%)');
    return seq([[l,[{transform:'translateX(-100%)'},{transform:'translateX(0)'}],460,'cubic-bezier(.6,0,.4,1)'],[r,[{transform:'translateX(100%)'},{transform:'translateX(0)'}],460,'cubic-bezier(.6,0,.4,1)']],fn,
      [[l,[{transform:'translateX(0)'},{transform:'translateX(-100%)'}],560,'cubic-bezier(.6,0,.4,1)'],[r,[{transform:'translateX(0)'},{transform:'translateX(100%)'}],560,'cubic-bezier(.6,0,.4,1)']]);},
  /* досье: лист из папки выезжает снизу и уходит вверх */
  folder:function(W,fn){var d=div(W,'left:0;right:0;top:0;height:100vh;background:#E6DCC6;border-top:10px solid #C9B68C;box-shadow:0 -10px 30px rgba(0,0,0,.4);transform:translateY(100%)');
    return seq([[d,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.3,.7,.3,1)']],fn,[[d,[{transform:'translateY(0)'},{transform:'translateY(-105%)'}],460,'cubic-bezier(.6,0,.6,1)']]);},
  /* летопись: чернильное пятно растекается от места клика */
  ink:function(W,fn,pt){var x=pt?pt.x:innerWidth/2,y=pt?pt.y:innerHeight/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))+20;
    var d=div(W,'inset:0;background:#2A1C11');
    return seq([[d,[{clipPath:'circle(0px at '+x+'px '+y+'px)'},{clipPath:'circle('+R+'px at '+x+'px '+y+'px)'}],520,'cubic-bezier(.5,0,.3,1)']],fn,
      [[d,[{opacity:1,background:'#2A1C11'},{opacity:0,background:'#E7DABB'}],520,'ease-out']]);},
  /* витрина: створки из бархата сходятся по золотому шву */
  vitrine:function(W,fn){var v='#14050A';
    var t=div(W,'left:0;right:0;top:0;height:51vh;background:'+v+';border-bottom:1px solid #C9A44C;transform:translateY(-100%)');
    var b=div(W,'left:0;right:0;bottom:0;height:51vh;background:'+v+';border-top:1px solid #C9A44C;transform:translateY(100%)');
    var g=glyph(W,W.dataset.glyph||'sparrow','#C9A44C');
    return seq([[t,[{transform:'translateY(-100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.6,0,.4,1)'],[b,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:0},{opacity:.85}],200,'linear']],fn,
      [[t,[{transform:'translateY(0)'},{transform:'translateY(-100%)'}],500,'cubic-bezier(.6,0,.4,1)'],[b,[{transform:'translateY(0)'},{transform:'translateY(100%)'}],500,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:.85},{opacity:0}],160,'linear']]);},
  /* город: мимо проносится вагон метро с горящими окнами */
  subway:function(W,fn){
    /* тёмный тоннель закрывает экран, через него проносится состав с горящими окнами */
    var tun=div(W,'inset:0;background:repeating-linear-gradient(90deg,transparent 0 220px,rgba(232,163,60,.10) 220px 226px),linear-gradient(180deg,#05070B,#0B0F16 45%,#05070B);opacity:0');
    var rail=div(W,'left:0;right:0;top:calc(50% + 118px);height:4px;background:linear-gradient(90deg,#3A4250,#7D8792,#3A4250);opacity:0');
    var H=Math.min(240,Math.max(150,innerHeight*.3)),carW=Math.max(520,innerWidth*.62),gap=14,n=3,TW=n*carW+(n-1)*gap;
    var tr=div(W,'left:0;top:calc(50% - '+(H/2)+'px);width:'+TW+'px;height:'+H+'px;transform:translateX('+innerWidth+'px)');
    for(var c=0;c<n;c++){
      var car=document.createElement('div');var x=c*(carW+gap);
      car.style.cssText='position:absolute;top:0;left:'+x+'px;width:'+carW+'px;height:'+H+'px;border-radius:'+(c===0?'46px 10px 10px 18px':'10px')+';'+
        'background:repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 2px,rgba(0,0,0,.06) 2px 9px),linear-gradient(180deg,#C9D0D8,#9AA3AE 55%,#6E7782);box-shadow:inset 0 -14px 0 #2A2F38,inset 0 3px 0 rgba(255,255,255,.4)';
      tr.appendChild(car);
      /* полоса вдоль вагона */
      var st=document.createElement('div');st.style.cssText='position:absolute;left:0;right:0;top:66%;height:7px;background:#E8A33C';car.appendChild(st);
      /* двери и окна */
      var units=6,uw=carW/units;
      for(var u=0;u<units;u++){
        var el=document.createElement('div');
        if(u%3===1){el.style.cssText='position:absolute;top:14%;height:72%;left:'+(u*uw+uw*.22)+'px;width:'+(uw*.56)+'px;border-radius:4px;background:linear-gradient(90deg,#808A95 0 49%,#2A2F38 49% 51%,#808A95 51%);box-shadow:inset 0 0 0 2px #59616C';
          var dw=document.createElement('div');dw.style.cssText='position:absolute;top:10%;height:34%;left:12%;right:12%;border-radius:3px;background:linear-gradient(90deg,#F6D58C 0 48%,transparent 48% 52%,#F6D58C 52%);opacity:.95';el.appendChild(dw);}
        else{el.style.cssText='position:absolute;top:18%;height:36%;left:'+(u*uw+uw*.12)+'px;width:'+(uw*.76)+'px;border-radius:7px;background:linear-gradient(180deg,#FFE6A8,#E9B860);box-shadow:inset 0 0 0 3px #4A525C,0 0 18px rgba(246,213,140,.35)';
          if(c===0&&u===0){el.style.borderRadius='26px 7px 7px 7px';}}
        car.appendChild(el);
      }
      if(c===0){var hl=document.createElement('div');hl.style.cssText='position:absolute;left:10px;top:70%;width:22px;height:12px;border-radius:50%;background:#FFF4CC;box-shadow:0 0 30px 12px rgba(255,230,160,.55),-60px 0 80px 30px rgba(255,230,160,.18)';car.appendChild(hl);}
      /* колёсные тележки */
      [0.15,0.85].forEach(function(f){var w=document.createElement('div');w.style.cssText='position:absolute;bottom:-12px;left:'+(carW*f-34)+'px;width:68px;height:20px;border-radius:10px;background:#1B1F26';car.appendChild(w);});
    }
    var D=Math.max(1000,Math.min(1400,(innerWidth+TW)/2.4));
    /* состав едет одной непрерывной анимацией: пока страница под тоннелем перерисовывается, он не замирает */
    var ta=tr.animate([{transform:'translateX('+innerWidth+'px)'},{transform:'translateX('+(-TW)+'px)'}],{duration:D,easing:'linear',fill:'forwards'});
    var tick=div(W,'width:0;height:0');
    var st=seq([[tun,[{opacity:0},{opacity:1}],220,'ease-in'],[rail,[{opacity:0},{opacity:1}],220,'ease-in'],[tick,[{opacity:0},{opacity:1}],D*.42,'linear']],fn,
      [[tick,[{opacity:1},{opacity:0}],D*.58-60,'linear'],[tun,[{opacity:1},{opacity:1,offset:.55},{opacity:0}],D*.58-60,'ease-out'],[rail,[{opacity:1},{opacity:1,offset:.55},{opacity:0}],D*.58-60,'ease-out']]);
    st.anims.push(ta);return st;},
  /* геральдика: знамя клана опускается сверху и поднимается обратно */
  banner:function(W,fn){var c=W.dataset.crest||'#8E3BC4';
    var d=div(W,'left:0;right:0;top:0;height:118vh;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 3px,transparent 3px 90px),linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.5) 20%,rgba(0,0,0,.5) 80%,rgba(0,0,0,.7)),'+c+';clip-path:polygon(0 0,100% 0,100% 85%,50% 100%,0 85%);transform:translateY(-118vh)');
    d.dataset.c='1';
    var g=glyph(W,W.dataset.glyph||'crown','#C9A45C');
    return seq([[d,[{transform:'translateY(-118vh)'},{transform:'translateY(0)'}],440,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:0},{opacity:.8}],200,'linear']],fn,
      [[d,[{transform:'translateY(0)'},{transform:'translateY(-118vh)'}],460,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:.8},{opacity:0}],160,'linear']]);},
  /* механика: чаша весов — пять точек ступеней загораются по очереди */
  dots:function(W,fn){var d=div(W,'inset:0;background:#0B0F0E;opacity:0'),ds=[];
    for(var i=0;i<5;i++){ds.push(div(W,'left:calc(50% + '+((i-2)*34-9)+'px);top:calc(50% - 9px);width:18px;height:18px;border-radius:50%;border:2px solid #C9A45C;opacity:0'));}
    var inA=[[d,[{opacity:0},{opacity:1}],200,'ease-in']].concat(ds.map(function(x,i){return [x,[{opacity:0,background:'transparent'},{opacity:1,background:'transparent',offset:.4},{opacity:1,background:'#C9A45C'}],120+i*60,'linear'];}));
    return seq(inA,fn,[[d,[{opacity:1},{opacity:0}],300,'ease-out']].concat(ds.map(function(x){return [x,[{opacity:1,background:'#C9A45C'},{opacity:0,background:'#C9A45C'}],200,'linear'];})));},
  /* галерея: широкий мазок масляной краски проходит по экрану */
  brush:function(W,fn){var paint='repeating-linear-gradient(0deg,#0F2A2B 0 7px,#1B3D3C 7px 11px,#12302F 11px 19px,#244C4A 19px 21px)';
    var d=div(W,'left:-10vw;top:-10vh;width:120vw;height:120vh;background:'+paint+';border-radius:0 40vh 40vh 0;transform:translateX(-120%) skewX(-8deg)');
    var g=glyph(W,W.dataset.glyph||'frame','#D4AF37');
    return seq([[d,[{transform:'translateX(-120%) skewX(-8deg)'},{transform:'translateX(0) skewX(-8deg)'}],460,'cubic-bezier(.5,0,.3,1)'],[g,[{opacity:0},{opacity:.85}],220,'linear']],fn,
      [[d,[{transform:'translateX(0) skewX(-8deg)'},{transform:'translateX(120%) skewX(-8deg)'}],480,'cubic-bezier(.6,0,.6,1)'],[g,[{opacity:.85},{opacity:0}],160,'linear']]);},
  /* гримуар: страница фолианта переворачивается */
  page:function(W,fn){W.style.perspective='1600px';
    var d=div(W,'inset:0;background:radial-gradient(ellipse at 30% 40%,#F1E3C8,#D9C49A 80%);transform-origin:0 50%;transform:rotateY(-95deg);box-shadow:inset 30px 0 60px rgba(60,30,10,.35)');
    var g=glyph(W,W.dataset.glyph||'book','#4E3519');
    return seq([[d,[{transform:'rotateY(-95deg)'},{transform:'rotateY(0deg)'}],480,'cubic-bezier(.4,0,.2,1)'],[g,[{opacity:0},{opacity:.8}],200,'linear']],fn,
      [[d,[{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(0deg)',opacity:0}],380,'ease-out'],[g,[{opacity:.8},{opacity:0}],160,'linear']]);},
  /* бродячий кот: сверху капает кровь, заливает экран и растворяется */
  blood:function(W,fn){var red='#6E0A12',parts=[],H=innerHeight,Wd=innerWidth,n=Math.max(9,Math.min(18,Math.round(Wd/90)));
    var flood=div(W,'left:0;right:0;bottom:0;height:0;background:linear-gradient(180deg,#8E0F1A,#4A0509);border-radius:46% 54% 0 0/26px 30px 0 0');
    var inA=[[flood,[{height:'0vh'},{height:'0vh',offset:.35},{height:'112vh'}],900,'cubic-bezier(.5,0,.6,1)']];
    for(var i=0;i<n;i++){var x=Math.round((i+.5)*Wd/n+(Math.random()-.5)*Wd/n*.7),w=6+Math.round(Math.random()*10),len=H*(.25+Math.random()*.55),dl=Math.round(Math.random()*260);
      var st=div(W,'left:'+(x-w/2)+'px;top:0;width:'+w+'px;height:'+len+'px;background:linear-gradient(180deg,'+red+',#9B111E);border-radius:0 0 '+w+'px '+w+'px;transform-origin:50% 0;transform:scaleY(0)');
      var dr=div(W,'left:'+(x-w*.8)+'px;top:'+(len-w)+'px;width:'+(w*1.6)+'px;height:'+(w*2.1)+'px;background:#9B111E;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;opacity:0');
      inA.push([st,[{transform:'scaleY(0)'},{transform:'scaleY(0)',offset:dl/900},{transform:'scaleY(1)'}],900,'cubic-bezier(.3,.6,.4,1)']);
      inA.push([dr,[{opacity:0,transform:'translateY(0)'},{opacity:0,offset:Math.min(.9,(dl+500)/900)},{opacity:1,transform:'translateY('+(H*.3)+'px)'}],900,'ease-in']);
      parts.push(st,dr);}
    var outA=[[flood,[{opacity:1,filter:'blur(0)'},{opacity:0,filter:'blur(10px)'}],560,'ease-out']].concat(parts.map(function(p){return [p,[{opacity:1},{opacity:0}],380,'ease-out'];}));
    return seq(inA,fn,outA);},
  /* выход на страницы без темы: короткое затемнение */
  fade:function(W,fn){var d=div(W,'inset:0;background:#08050A;opacity:0');
    return seq([[d,[{opacity:0},{opacity:1}],220,'ease-in']],fn,[[d,[{opacity:1},{opacity:0}],260,'ease-out']]);}
};
var WIPE_OF={alley:'blood',home:'ash',eden:'curtain',dossier:'folder',chronicle:'ink',vitrine:'vitrine',city:'subway',heraldry:'banner',reference:'dots',gallery:'brush',grimoire:'page'};
/* Политика переходов. Шторка только на редких, «входных» маршрутах:
   на титул; с титула или из списка в запись. Запись → запись по ссылке в тексте,
   инструменты, листы, кнопка «Назад» и быстрые повторные клики — без шторки. */
var lastNav=0;
function wipeKind(href){
  var to=routeKey(href),kt=kindOf(href),kf=kindOf();
  if(running.length&&Date.now()-lastNav<700)return null; /* шторка уже идёт — второй клик подряд без новой */
  if(kt==='home'&&kf!=='home')return 'ash';
  if(kt==='note'&&(kf==='home'||kf==='list')&&to&&WIPE_OF[to])return WIPE_OF[to];
  return null;}
function div(W,st){var d=document.createElement('div');d.style.cssText='position:absolute;'+st;W.appendChild(d);return d;}
var SIL_IMG={rose:svgUri('<g fill="#140A0D">'+'<path d="M50 58 C38 57 27 50 25.5 38 C24.5 30 28 23 33.5 19 C31.5 25 35.5 29.5 40 31 C38.5 23 41.5 14.5 50 10 C58.5 14.5 61.5 23 60 31 C64.5 29.5 68.5 25 66.5 19 C72 23 75.5 30 74.5 38 C73 50 62 57 50 58Z"/><path d="M50 56 L39 64 L45.5 61.5 L50 67 L54.5 61.5 L61 64Z"/><path d="M48.6 62 C47.6 73 50.6 84 47.6 97 H52 C55 84 52 73 52.4 62Z"/><path d="M51.5 72 L58 68.5 L52.5 75Z M48.5 85 L42 82.5 L48 88Z"/><path d="M52.5 79 C58 71 70 68 78 72 C72 80 61 83 52.5 80Z"/><path d="M48 68 C42 61 30 60 24 64 C31 71 41 71 48 69.5Z"/>'+'</g><g fill="none" stroke="#C9A45C" stroke-width="1.8" stroke-linecap="round">'+'<path d="M43.5 27 C43 20 56.5 19.5 56.5 26.5 C56.5 32 47 32.5 47 27.5 C47 24.5 52.5 24.5 52.5 27.5"/><path d="M40 31 C44 34 56 34 60 31"/><path d="M40 31 C40.5 40 44.5 47 50 49.5"/><path d="M60 31 C59.5 40 55.5 47 50 49.5"/><path d="M33.5 19 C30.5 33 36 45 46 52.5"/><path d="M66.5 19 C69.5 33 64 45 54 52.5"/><path d="M55 76.5 C61 74 68 72 74 72" stroke-width="1.4"/><path d="M45.5 66.5 C40 64.5 33 63.5 28 64" stroke-width="1.4"/>'+'</g>')};
function glyph(W,name,col){var g=div(W,'');g.className='glyph';
  if(SIL_IMG[name]){g.style.background=SIL_IMG[name]+' center/contain no-repeat';}
  else{g.style.background=col;g.style.webkitMaskImage=SIL[name];g.style.maskImage=SIL[name];}
  g.style.opacity=0;return g;}
var running=[];
function seq(inA,fn,outA){
  var st={anims:[],fn:fn,done:false,called:false,finish:null};
  function call(){if(st.called)return;st.called=true;try{fn();}catch(e){}}
  function play(list){return Promise.all(list.map(function(x){var a=x[0].animate(x[1],{duration:x[2],easing:x[3],fill:'forwards'});st.anims.push(a);return a.finished.catch(function(){});}));}
  st.promise=play(inA).then(function(){if(st.done)return;call();return new Promise(function(r){setTimeout(r,60);});})
    .then(function(){if(st.done)return;return play(outA);});
  st.finish=function(){st.done=true;call();st.anims.forEach(function(a){try{a.cancel();}catch(e){}});};
  return st;
}
function flushWipes(){running.forEach(function(s){s.finish();});running=[];var W=document.getElementById('rdWipe');if(W)W.innerHTML='';}
function wipeTo(href,pt){
  flushWipes();
  var kind=wipeKind(href)||'fade';
  var W=document.getElementById('rdWipe');
  var hid=normH(href).split('/')[1];
  if(W){W.dataset.crest=CREST[hid]||'#8E3BC4';W.dataset.glyph=GLYPH[hid]||'';W.style.perspective='';}
  var go=function(){location.hash=href.replace(/^#/,'');};
  if(RM||!W){go();return;}
  try{var s=WIPES[kind](W,go,pt);running.push(s);
    s.promise.then(function(){var i=running.indexOf(s);if(i>=0)running.splice(i,1);if(!running.length)W.innerHTML='';});
  }catch(e){go();}
}
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest&&e.target.closest('a[href^="#/"]');if(!a||a.target)return;
  var href=a.getAttribute('href');if(href===location.hash||('#'+location.hash.replace(/^#/,''))===href)return;
  var kind=wipeKind(href);
  if(!kind)return;                   /* без шторки: обычный переход сайта */
  e.preventDefault();wipeTo(href,{x:e.clientX,y:e.clientY});lastNav=Date.now();
},true);

/* ---------- запуск ---------- */
function init(){
  try{var st=document.createElement('style');st.id='rdCss';st.textContent=CSS;document.head.appendChild(st);}catch(e){}
  var d=document.createElement('div');d.id='rdDeco';d.setAttribute('aria-hidden','true');
  var bg=document.getElementById('bgfx');if(bg&&bg.parentNode)bg.parentNode.insertBefore(d,bg.nextSibling);else document.body.insertBefore(d,document.body.firstChild);
  var w=document.createElement('div');w.id='rdWipe';w.setAttribute('aria-hidden','true');document.body.appendChild(w);
  addEventListener('hashchange',function(){setTimeout(decorate,0);});
  try{if(typeof window.route==='function'&&!window.route._rd){var orig=window.route;window.route=function(){var r=orig.apply(this,arguments);setTimeout(decorate,0);return r;};window.route._rd=1;}}catch(e){}
  if(TEST_ONLY){try{var tp=document.createElement('details');tp.id='rdTest';
    tp.innerHTML='<summary>Тест дизайна · '+TEST.length+' примеров</summary><ol>'+TEST.map(function(x){return '<li><a href="#/'+x[0]+'">'+x[1]+'</a> <i>— '+x[2]+'</i></li>';}).join('')+'</ol>';
    document.body.appendChild(tp);}catch(e){}}
  decorate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.RD_TEST={TH:TH,applyTheme:applyTheme,decorate:decorate,wipeTo:wipeTo};
})();
