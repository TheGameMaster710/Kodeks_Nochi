(function(){
'use strict';
var RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var ROOT=document.documentElement;

var TH={};
function TH_(key,mode,font,o){TH[key]={key:key,mode:mode,font:font,o:o||{}};}
TH_('home-hero','dark','Playfair Display SC',{sc:'none',fx:'embers',en:'ember',g:'crown'});
TH_('eden','dark','Marck Script',{sc:'club',en:'neon',wp:'curtain',ru:'Marck Script'});
TH_('dossier','light','PT Mono',{sc:'dossier',en:'type',wp:'folder',sk:'dossier'});
TH_('chronicle','light','Old Standard TT',{sc:'chronicle',en:'ink',wp:'ink',sk:'ledger'});
TH_('vitrine','dark','Forum',{sc:'vitrine',en:'engrave',wp:'vitrine',g:'sparrow',sk:'label'});
TH_('city','dark','Oswald',{sc:'street',fx:'rain',en:'sign',wp:'subway'});
TH_('heraldry','dark','Prata',{sc:'banners',en:'stamp',wp:'banner'});
TH_('reference','dark','PT Serif',{sc:'scales',en:'sign',wp:'dots'});
TH_('alley','dark','Oswald',{sc:'alley',fx:'rain',en:'sign',wp:'blood'});
TH_('gallery','dark','Bad Script',{sc:'gallery',en:'ink',wp:'brush'});
TH_('grimoire','dark','Kurale',{sc:'grimoire',en:'stamp',wp:'page'});
TH_('catalog','dark','Playfair Display SC',{sc:'drawer'});
TH_('riot','dark','Oswald',{sc:'riot',fx:'sparks',en:'coal',wp:'flag',ru:'Rubik Burned'});
TH_('ward','light','PT Sans',{sc:'none',en:'sign',wp:'ribbons'});
TH_('reading','dark','Cormorant Garamond',{sc:'none',en:'gilt',wp:'leaves'});

var FAMILY={person:'dossier',player:'dossier',threat:'dossier',lore:'chronicle',item:'vitrine',place:'city',domain:'city',
  clan:'heraldry',sect:'heraldry',merit:'reference',disc:'reference',ritual:'reference',predator:'reference'};
var ACCENT={'place/eden':'eden','predator/stray-cat':'alley','predator/bagger':'ward','place/library':'reading','item/seymour-painting':'gallery','item/payne-diary':'grimoire','sect/anarchs':'riot'};
var OVR={'person/vasiliu':{sc:'moonbeam',wp:'shroud',en:'ink'},'person/van-hart':{sc:'lamp',wp:'casefile'},'lore/great-fire':{sc:'ashfall',wp:'smoke',en:'burn',fx:'ash'},'merit/ash-child':{sc:'candles',wp:'candles',en:'smoke',fx:'ashlite'},'clan/gangrel':{en:'claw'},'clan/malkavian':{en:'shake'},'merit/fire-brand':{sc:'glowsnow',wp:'ice',en:'freeze',fx:'ash'}};
var GLYPH={'ash-child':'bowl','van-hart':'rose','sparrow-ring':'sparrow','seymour-painting':'frame','payne-diary':'book',tremere:'tremere',brujah:'brujah',nosferatu:'bat',camarilla:'rose',anarchs:'fist',gangrel:'eagle',malkavian:'ball'};
var CREST={tremere:'#9B4DD6',brujah:'#D7263D',nosferatu:'#7E9B5A',camarilla:'#C9A44C',gangrel:'#8C6A3F',malkavian:'#4FB3C8'};
var TEST_ONLY=false;
var TEST=[['','Титул','лента сцен'],['cat/people','Списки разделов','каталожный ящик'],['person/heinz','Личности','досье'],
  ['domain/brownsville','Домены и локации','уличный указатель'],['place/eden','Ключевая запись','личный акцент'],['lore/hecate-war','Лоршиты','летопись'],
  ['item/sparrow-ring','Предметы','витрина'],['clan/tremere','Кланы и секты','геральдика'],['merit/war-legacy','Механика','справочник'],['tool/masq','Инструменты','без изменений']];
var TEST_SET={};TEST.forEach(function(x){TEST_SET[x[0]]=1;});
function normH(h){return (h==null?location.hash:h).replace(/^#\/?/,'').replace(/\?.*$/,'');}
function kindOf(h){h=normH(h);if(h===''||h==='world'||h==='cons'||h==='tools'||h==='cats')return 'home';
  if(/^cat\//.test(h))return 'list';if(/^(tool|pc|coterie|player|master|admin)\//.test(h))return 'work';
  if(/^[\w-]+\/[\w-]+$/.test(h))return 'note';return 'other';}
var FONTQ={'Cormorant Garamond':'Cormorant+Garamond:wght@400;600;700','Playfair Display SC':'Playfair+Display+SC:wght@400;700','Marck Script':'Marck+Script','PT Mono':'PT+Mono',
  'Old Standard TT':'Old+Standard+TT:ital,wght@0,400;0,700;1,400','Forum':'Forum',
  'Oswald':'Oswald:wght@500;600','Prata':'Prata','Rubik Burned':'Rubik+Burned','Bad Script':'Bad+Script','Kurale':'Kurale','PT Serif':'PT+Serif:ital,wght@0,400;0,700;1,400','PT Sans':'PT+Sans:wght@400;700'};
function routeKey(h){h=normH(h);var k=kindOf(h);
  if(k==='home')return 'home';
  if(TEST_ONLY&&!TEST_SET[h])return null;
  if(ACCENT[h])return ACCENT[h];
  if(k==='list')return 'catalog';
  if(k==='note'){var m=/^([\w-]+)\//.exec(h);return FAMILY[m[1]]||null;}
  return null;}




function sil(name,c){return '<div class="sc-sil sil-'+name+' '+c+'"></div>';}
var SCENES={
  club:function(){return '<div class="beam a"></div><div class="beam b"></div><div class="haze"></div><div class="floor"></div>';},
  dossier:function(){return '<div class="paper"></div><div class="scorch"></div>';},
  chronicle:function(){return '<div class="fib"></div><div class="candle"></div><div class="vign"></div>'+
    sil('urn','s-chronicle-1')+sil('urn','s-chronicle-2')+sil('urn','s-chronicle-3');},
  street:function(){return '<div class="grid"></div><div class="pool a"></div><div class="pool b"></div>'+sil('skyline','s-street-1');},
  banners:function(){return '<div class="stone"></div><div class="pennant l"></div><div class="pennant r"></div>';},
  drawer:function(){return '<div class="wood"></div><div class="lamp"></div>';},
  none:function(){return '';},
  alley:function(){return '<div class="bricks l"></div><div class="bricks r"></div><div class="lamp"></div><div class="wet"></div>';},
  scales:function(){return '<div class="rows"></div>'+sil('scales','s-scales-1');},
  gallery:function(){return '<div class="wall"></div><div class="lamp"></div>'+sil('vortex','s-gallery-1');},
  grimoire:function(){return '<div class="leather"></div><div class="circ a"></div><div class="circ b"></div><div class="candle"></div>';},
  'crest-tremere':function(){return SCENES.banners()+'<div class="arc a"></div><div class="arc b"></div><div class="shelves"></div>';},
  'crest-brujah':function(){return SCENES.banners()+'<div class="fence"></div><div class="glow"></div>';},
  'crest-nosferatu':function(){return SCENES.banners()+'<div class="fog"></div>'+sil('tower','s-crest-nosferatu-1')+sil('greyhound','s-crest-nosferatu-2')+sil('greyhound','s-crest-nosferatu-3');},
  'crest-gangrel':function(){return SCENES.banners()+'<div class="moon"></div><div class="fog a"></div><div class="fog b"></div>';},
  'crest-malkavian':function(){return SCENES.banners()+'<div class="ray"></div><div class="shard a"></div><div class="shard b"></div><div class="shard c"></div><div class="shard d"></div><div class="shard e"></div><div class="fog a"></div>';},
  'crest-camarilla':function(){return SCENES.banners()+sil('rose','s-crest-camarilla-1')+sil('rose','s-crest-camarilla-2')+sil('rose','s-crest-camarilla-3');},
  riot:function(){return '<div class="smoke a"></div><div class="smoke b"></div><div class="glow"></div>'+sil('crowd','s-riot-1');},
  moonbeam:function(){return '<div class="beam"></div><div class="glass"></div>';},
  ashfall:function(){return '<div class="fib"></div><div class="haze"></div><div class="ruins"></div><div class="vign"></div>';},
  lamp:function(){return '<div class="paper"></div><div class="glow"></div><div class="vign"></div>';},
  candles:function(){return '<div class="flick a"></div><div class="flick b"></div><div class="flick c"></div><div class="vign"></div>';},
  glowsnow:function(){return '<div class="glow"></div><div class="ice"></div><div class="vign"></div>';},
  vitrine:function(){return '<div class="velvet"></div><div class="spot"></div>'+sil('sparrow','s-vitrine-1');}
};

var FX={cv:null,ctx:null,kind:null,parts:[],raf:0};
function fxSet(kind,t){
  try{
    if(!FX.cv){FX.cv=document.createElement('canvas');FX.cv.id='rdFx';FX.cv.setAttribute('aria-hidden','true');document.body.appendChild(FX.cv);FX.ctx=FX.cv.getContext('2d');
      addEventListener('resize',function(){if(FX.kind)fxSet(FX.kind,FX.t);});}
    var sparse=kind==='ashlite';if(sparse)kind='ash';
    cancelAnimationFrame(FX.raf);FX.kind=kind;FX.t=t;FX.parts=[];
    var c=FX.cv,dpr=Math.min(2,window.devicePixelRatio||1);c.width=innerWidth*dpr;c.height=innerHeight*dpr;FX.ctx.setTransform(dpr,0,0,dpr,0,0);
    FX.ctx.clearRect(0,0,innerWidth,innerHeight);
    if(!kind)return;
    var n=Math.min(70,Math.round(innerWidth*innerHeight/(kind==='rain'?16000:kind==='ash'?18000:22000)));if(sparse)n=Math.max(6,Math.round(n*.3));
    for(var i=0;i<n;i++)FX.parts.push(spawn(kind,true));
    var last=performance.now();
    function step(now){var dt=Math.min(50,now-last)/16.7;last=now;draw(dt);if(!RM)FX.raf=requestAnimationFrame(step);}
    if(RM)draw(0);else FX.raf=requestAnimationFrame(step);
  }catch(e){}
}
function spawn(kind,init){var W=innerWidth,H=innerHeight;
  if(kind==='ash')return {x:Math.random()*W,y:init?Math.random()*H:-10,r:Math.random()*2.2+.8,vy:Math.random()*.35+.18,ph:Math.random()*6.28,snow:Math.random()<.45};
  if(kind==='embers'||kind==='sparks')return {x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*1.8+.6,vy:-(Math.random()*.6+.25),vx:(Math.random()-.5)*.3,ph:Math.random()*6.28,life:Math.random()};
  return {x:Math.random()*(W+200)-100,y:init?Math.random()*H:-20,l:Math.random()*14+8,v:Math.random()*4+7};}
function draw(dt){var g=FX.ctx,W=innerWidth,H=innerHeight;g.clearRect(0,0,W,H);
  FX.parts.forEach(function(p,i){
    if(FX.kind==='ash'){p.ph+=.02*dt;p.y+=p.vy*dt;p.x+=Math.sin(p.ph)*.35*dt;
      g.fillStyle=p.snow?'rgba(255,255,255,.85)':'rgba(70,64,60,.45)';if(p.snow){g.shadowColor='rgba(60,50,40,.35)';g.shadowBlur=2;}else g.shadowBlur=0;
      g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill();g.shadowBlur=0;if(p.y>H+10)FX.parts[i]=spawn('ash');}
    else if(FX.kind==='embers'||FX.kind==='sparks'){var sp=FX.kind==='sparks';p.ph+=.03*dt;p.x+=(p.vx+Math.sin(p.ph)*.25)*dt;p.y+=p.vy*(sp?1.8:1)*dt;
      var a=.35+.45*Math.abs(Math.sin(p.ph*1.7));g.fillStyle=sp?'rgba(255,'+(100+Math.round(70*a))+',30,'+(a*.85).toFixed(2)+')':'rgba(240,'+(175+Math.round(45*a))+',80,'+(a*.8).toFixed(2)+')';
      g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill();if(p.y<-10)FX.parts[i]=spawn(FX.kind);}
    else{p.y+=p.v*dt;p.x-=p.v*.18*dt;g.strokeStyle='rgba(170,190,220,.16)';g.lineWidth=1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+p.l*.18,p.y-p.l);g.stroke();
      if(p.y>H+20)FX.parts[i]=spawn('rain');}
  });}

var cur=null,curScene=null,fontsDone={};
function loadFont(f){if(!f||fontsDone[f]||!FONTQ[f])return;fontsDone[f]=1;
  try{var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+FONTQ[f]+'&display=swap';document.head.appendChild(l);}catch(e){}}
function applyTheme(t,instant){
  var deco=document.getElementById('rdDeco');
  if(!t){ROOT.removeAttribute('data-rd');ROOT.removeAttribute('data-rds');ROOT.removeAttribute('data-mode');
    ROOT.removeAttribute('data-crest');
    cur=null;curScene=null;fxSet(null);return;}
  var base=t.key.indexOf('home-')===0?'home':t.key;
  ROOT.setAttribute('data-rd',base);ROOT.setAttribute('data-mode',t.mode);
  if(base==='home')ROOT.setAttribute('data-rds',t.key.slice(5));else ROOT.removeAttribute('data-rds');
  loadFont(t.font);if(t.o.ru)loadFont(t.o.ru);
  var ck=t.key+'/'+(t.o.sc||'');
  if(cur!==ck){cur=ck;buildScene(t,deco,instant);}
}
function buildScene(t,deco,instant){
  try{if(curScene===t.o.sc)return;curScene=t.o.sc;
    var html='<div class="sc sc-'+t.o.sc+'">'+(SCENES[t.o.sc]?SCENES[t.o.sc]():'')+'</div>';
    var olds=[].slice.call(deco.children),nw=document.createElement('div');nw.className='sc-wrap';nw.innerHTML=html;artScene(nw);
    if(instant){olds.forEach(function(o){deco.removeChild(o);});deco.appendChild(nw);}
    else{nw.className='sc-wrap fade';deco.appendChild(nw);requestAnimationFrame(function(){nw.style.opacity=1;});
      olds.forEach(function(o){o.setAttribute('data-gone','1');setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},750);});}
  }catch(e){}
  fxSet(t.o.fx||null,t);
}

var ENTER={
  ember:{kf:[{opacity:0,color:'#F2D27A',filter:'blur(6px)',textShadow:'0 0 24px #D4AF37'},{opacity:1,color:'#F2D27A',filter:'blur(0)',offset:.45},{opacity:1}],dur:1100,each:.06},
  neon:{kf:[{opacity:0},{opacity:1,offset:.1},{opacity:.2,offset:.18},{opacity:1,offset:.3},{opacity:.4,offset:.4},{opacity:1}],dur:900,each:.05},
  type:{kf:[{opacity:0},{opacity:0,offset:.99},{opacity:1}],dur:60,each:.07},
  ink:{kf:[{opacity:0,filter:'blur(8px)',transform:'scale(1.15)'},{opacity:1,filter:'blur(0)',transform:'scale(1)'}],dur:900,each:.06},
  sign:{kf:[{opacity:0,transform:'translateY(-40%)'},{opacity:1,transform:'none'}],dur:380,each:.03},
  stamp:{kf:[{opacity:0,transform:'scale(1.8)'},{opacity:1,transform:'scale(.96)',offset:.7},{opacity:1,transform:'scale(1)'}],dur:420,each:.06},
  coal:{kf:[{opacity:0,color:'#3A0E05',textShadow:'0 0 0 rgba(255,120,30,0)'},{opacity:1,color:'#FFE2A8',textShadow:'0 0 22px rgba(255,140,40,.95)',offset:.4},{opacity:1}],dur:1000,each:.05},
  gilt:{kf:[{opacity:0,color:'#5A4520',textShadow:'0 0 0 rgba(212,175,55,0)'},{opacity:1,color:'#FFF1B8',textShadow:'0 0 16px rgba(240,200,90,.95)',offset:.45},{opacity:1,color:'#D9B44A',textShadow:'0 1px 0 rgba(40,28,8,.9)'}],dur:1100,each:.05},
  burn:{kf:[{opacity:0,color:'#FFD48A',filter:'blur(3px)',textShadow:'0 0 18px rgba(255,120,30,.95)'},{opacity:1,color:'#E8641A',filter:'blur(0)',textShadow:'0 0 12px rgba(255,90,20,.8)',offset:.35},{opacity:1,color:'#7A2A10',textShadow:'0 0 4px rgba(200,60,10,.5)',offset:.7},{opacity:1,color:'#2A1C11',textShadow:'0 0 0 rgba(0,0,0,0)'}],dur:1300,each:.05},
  smoke:{kf:[{opacity:0,filter:'blur(10px)',transform:'translateY(-10px)',color:'#9A938C'},{opacity:.7,filter:'blur(4px)',transform:'translateY(-4px)',color:'#B9B2AA',offset:.5},{opacity:1,filter:'blur(0)',transform:'none'}],dur:1300,each:.05},
  freeze:{kf:[{opacity:0,color:'#FFD48A',textShadow:'0 0 18px rgba(255,130,40,.95)'},{opacity:1,color:'#FF9A3C',textShadow:'0 0 14px rgba(255,110,30,.9)',offset:.3},{opacity:1,color:'#CFE6F5',textShadow:'0 0 10px rgba(170,215,245,.85)',offset:.65},{opacity:1}],dur:1200,each:.05},
  claw:{kf:[{opacity:0,clipPath:'inset(0 100% 0 0)',transform:'skewX(-14deg) translateY(-6px)',color:'#F2E6CC',textShadow:'0 0 12px rgba(190,40,40,.85)'},{opacity:1,clipPath:'inset(0 0 0 0)',transform:'skewX(0) translateY(0)',color:'#F2E6CC',textShadow:'0 0 8px rgba(190,40,40,.6)',offset:.45},{opacity:1}],dur:520,each:.07},
  shake:{kf:[{opacity:0,transform:'translate(-7px,4px)',color:'#CFEFF6',textShadow:'4px 0 rgba(79,179,200,.8),-4px 0 rgba(190,40,60,.55)'},{opacity:1,transform:'translate(5px,-3px)',color:'#CFEFF6',textShadow:'-3px 0 rgba(79,179,200,.7),3px 0 rgba(190,40,60,.45)',offset:.3},{opacity:1,transform:'translate(-3px,2px)',color:'#CFEFF6',textShadow:'2px 0 rgba(79,179,200,.55),-2px 0 rgba(190,40,60,.35)',offset:.6},{opacity:1,transform:'translate(1px,-1px)',offset:.85},{opacity:1,transform:'none'}],dur:640,each:.06},
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
  try{var E=ENTER[kind];if(!E||!el||RM||el.getAttribute('data-rdsplit'))return;
    var html=el.innerHTML,label=el.textContent,L=splitLetters(el);if(!L.length)return;
    el.setAttribute('aria-label',label);
    var gap=Math.min(E.each,1.3/L.length)*1000,left=L.length,done=false;
    function restore(){if(done)return;done=true;el.innerHTML=html;el.removeAttribute('aria-label');}
    L.forEach(function(s,i){s.style.opacity=0;var a=s.animate(E.kf,{duration:E.dur,delay:i*gap,easing:'ease-out',fill:'forwards'});
      a.onfinish=function(){if(--left===0)restore();};});
    setTimeout(restore,E.dur+L.length*gap+1500);
  }catch(e){}
}

var SEEN={};
function decorate(){
  try{
    var k=routeKey();
    if(!k){applyTheme(null);var dd=document.getElementById('rdDeco');if(dd)dd.innerHTML='';return;}
    var app=document.getElementById('app');
    if(k==='home'){applyTheme(TH['home-hero'],true);enter(app.querySelector('.h-big'),'ember');return;}
    var h=normH(),t=TH[k];
    if(OVR[h]){t=JSON.parse(JSON.stringify(t));for(var ok in OVR[h])t.o[ok]=OVR[h][ok];}
    if(k==='heraldry'){var cid=h.split('/')[1];if(SCENES['crest-'+cid]){t=JSON.parse(JSON.stringify(t));t.o.sc='crest-'+cid;}}
    applyTheme(t,true);
    var cid2=h.split('/')[1];if(k==='heraldry'&&CREST[cid2])ROOT.setAttribute('data-crest',cid2);else ROOT.removeAttribute('data-crest');
    var first=!SEEN[h];SEEN[h]=1;
    if(first)enter(app.querySelector('.jcard h1'),t.o.en);
    if(k==='catalog'&&first&&!RM){[].slice.call(app.querySelectorAll('.god-card')).forEach(function(c,i){
      try{c.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:420,delay:Math.min(i*45,600),easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'});}catch(e){}});}
  }catch(e){try{console.warn('Оформление не применилось: '+e.message);}catch(_){}}
}

var WIPES={
  ash:function(W,fn){var d=div(W,'left:0;right:0;top:0;height:120vh;background:linear-gradient(180deg,#0B0706 80%,#E8772A 92%,rgba(200,16,46,0));transform:translateY(-120vh)');
    var g=glyph(W,'crown','#E8772A');
    return seq([[d,[{transform:'translateY(-120vh)'},{transform:'translateY(0)'}],420,'ease-in'],[g,[{opacity:0,transform:'scale(.8)'},{opacity:.9,transform:'scale(1)'}],220,'ease-out']],fn,
      [[d,[{transform:'translateY(0)'},{transform:'translateY(120vh)'}],480,'ease-out'],[g,[{opacity:.9},{opacity:0}],200,'linear']]);},
  curtain:function(W,fn){var fold='repeating-linear-gradient(90deg,#4A0716 0 18px,#6E0B22 18px 30px,#3A0511 30px 44px)';
    var l=div(W,'left:0;top:0;bottom:0;width:51vw;background:'+fold+';box-shadow:inset -20px 0 30px rgba(0,0,0,.5);transform:translateX(-100%)');
    var r=div(W,'right:0;top:0;bottom:0;width:51vw;background:'+fold+';box-shadow:inset 20px 0 30px rgba(0,0,0,.5);transform:translateX(100%)');
    return seq([[l,[{transform:'translateX(-100%)'},{transform:'translateX(0)'}],460,'cubic-bezier(.6,0,.4,1)'],[r,[{transform:'translateX(100%)'},{transform:'translateX(0)'}],460,'cubic-bezier(.6,0,.4,1)']],fn,
      [[l,[{transform:'translateX(0)'},{transform:'translateX(-100%)'}],560,'cubic-bezier(.6,0,.4,1)'],[r,[{transform:'translateX(0)'},{transform:'translateX(100%)'}],560,'cubic-bezier(.6,0,.4,1)']]);},
  casefile:function(W,fn){W.style.perspective='1800px';
    var d=div(W,'left:0;right:0;top:0;height:100vh;background:linear-gradient(135deg,#C9A877,#B48F5C);border-top:12px solid #A57E4C;box-shadow:0 -10px 30px rgba(0,0,0,.45);transform-origin:0 50%;transform:translateY(100%)');
    var g=glyph(W,W.dataset.glyph||'rose','#1E1A15');
    return seq([[d,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.3,.7,.3,1)'],[g,[{opacity:0,transform:'scale(.85)'},{opacity:.9,transform:'scale(1)'}],260,'ease-out']],fn,
      [[g,[{opacity:.9},{opacity:0}],160,'linear'],[d,[{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(-88deg)',opacity:.6}],520,'cubic-bezier(.55,0,.6,1)']]);},
  folder:function(W,fn){var d=div(W,'left:0;right:0;top:0;height:100vh;background:#E6DCC6;border-top:10px solid #C9B68C;box-shadow:0 -10px 30px rgba(0,0,0,.4);transform:translateY(100%)');
    return seq([[d,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.3,.7,.3,1)']],fn,[[d,[{transform:'translateY(0)'},{transform:'translateY(-105%)'}],460,'cubic-bezier(.6,0,.6,1)']]);},
  ink:function(W,fn,pt){var x=pt?pt.x:innerWidth/2,y=pt?pt.y:innerHeight/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))+20;
    var d=div(W,'inset:0;background:#2A1C11');
    return seq([[d,[{clipPath:'circle(0px at '+x+'px '+y+'px)'},{clipPath:'circle('+R+'px at '+x+'px '+y+'px)'}],520,'cubic-bezier(.5,0,.3,1)']],fn,
      [[d,[{opacity:1,background:'#2A1C11'},{opacity:0,background:'#E7DABB'}],520,'ease-out']]);},
  vitrine:function(W,fn){var v='#14050A';
    var t=div(W,'left:0;right:0;top:0;height:51vh;background:'+v+';border-bottom:1px solid #C9A44C;transform:translateY(-100%)');
    var b=div(W,'left:0;right:0;bottom:0;height:51vh;background:'+v+';border-top:1px solid #C9A44C;transform:translateY(100%)');
    var g=glyph(W,W.dataset.glyph||'sparrow','#C9A44C');
    return seq([[t,[{transform:'translateY(-100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.6,0,.4,1)'],[b,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],420,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:0},{opacity:.85}],200,'linear']],fn,
      [[t,[{transform:'translateY(0)'},{transform:'translateY(-100%)'}],500,'cubic-bezier(.6,0,.4,1)'],[b,[{transform:'translateY(0)'},{transform:'translateY(100%)'}],500,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:.85},{opacity:0}],160,'linear']]);},
  subway:function(W,fn){
    var tun=div(W,'inset:0;background:repeating-linear-gradient(90deg,transparent 0 220px,rgba(232,163,60,.10) 220px 226px),linear-gradient(180deg,#05070B,#0B0F16 45%,#05070B);opacity:0');
    var rail=div(W,'left:0;right:0;top:calc(50% + 118px);height:4px;background:linear-gradient(90deg,#3A4250,#7D8792,#3A4250);opacity:0');
    var H=Math.min(240,Math.max(150,innerHeight*.3)),carW=Math.max(520,innerWidth*.62),gap=14,n=3,TW=n*carW+(n-1)*gap;
    var tr=div(W,'left:0;top:calc(50% - '+(H/2)+'px);width:'+TW+'px;height:'+H+'px;transform:translateX('+(-TW)+'px) scaleX(-1)');
    for(var c=0;c<n;c++){
      var car=document.createElement('div');var x=c*(carW+gap);
      car.style.cssText='position:absolute;top:0;left:'+x+'px;width:'+carW+'px;height:'+H+'px;border-radius:'+(c===0?'46px 10px 10px 18px':'10px')+';'+
        'background:repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 2px,rgba(0,0,0,.06) 2px 9px),linear-gradient(180deg,#C9D0D8,#9AA3AE 55%,#6E7782);box-shadow:inset 0 -14px 0 #2A2F38,inset 0 3px 0 rgba(255,255,255,.4)';
      tr.appendChild(car);
      var sp=document.createElement('div');sp.className='tr-stripe';car.appendChild(sp);
      var units=6,uw=carW/units;
      for(var u=0;u<units;u++){
        var el=document.createElement('div');
        if(u%3===1){el.style.cssText='position:absolute;top:14%;height:72%;left:'+(u*uw+uw*.22)+'px;width:'+(uw*.56)+'px;border-radius:4px;background:linear-gradient(90deg,#808A95 0 49%,#2A2F38 49% 51%,#808A95 51%);box-shadow:inset 0 0 0 2px #59616C';
          var dw=document.createElement('div');dw.className='tr-win';el.appendChild(dw);}
        else{el.style.cssText='position:absolute;top:18%;height:36%;left:'+(u*uw+uw*.12)+'px;width:'+(uw*.76)+'px;border-radius:7px;background:linear-gradient(180deg,#FFE6A8,#E9B860);box-shadow:inset 0 0 0 3px #4A525C,0 0 18px rgba(246,213,140,.35)';
          if(c===0&&u===0){el.style.borderRadius='26px 7px 7px 7px';}}
        car.appendChild(el);
      }
      if(c===0){var hl=document.createElement('div');hl.className='tr-light';car.appendChild(hl);}
      [0.15,0.85].forEach(function(f){var w=document.createElement('div');w.style.cssText='position:absolute;bottom:-12px;left:'+(carW*f-34)+'px;width:68px;height:20px;border-radius:10px;background:#1B1F26';car.appendChild(w);});
    }
    var D=Math.max(1000,Math.min(1400,(innerWidth+TW)/2.4));
    var ta=tr.animate([{transform:'translateX('+(-TW)+'px) scaleX(-1)'},{transform:'translateX('+innerWidth+'px) scaleX(-1)'}],{duration:D,easing:'linear',fill:'forwards'});
    var tick=div(W,'width:0;height:0');
    var st=seq([[tun,[{opacity:0},{opacity:1}],220,'ease-in'],[rail,[{opacity:0},{opacity:1}],220,'ease-in'],[tick,[{opacity:0},{opacity:1}],D*.42,'linear']],fn,
      [[tick,[{opacity:1},{opacity:0}],D*.58-60,'linear'],[tun,[{opacity:1},{opacity:1,offset:.55},{opacity:0}],D*.58-60,'ease-out'],[rail,[{opacity:1},{opacity:1,offset:.55},{opacity:0}],D*.58-60,'ease-out']]);
    st.anims.push(ta);return st;},
  banner:function(W,fn){var c=W.dataset.crest||'#8E3BC4';
    var d=div(W,'left:0;right:0;top:0;height:118vh;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 3px,transparent 3px 90px),linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.5) 20%,rgba(0,0,0,.5) 80%,rgba(0,0,0,.7)),'+c+';clip-path:polygon(0 0,100% 0,100% 85%,50% 100%,0 85%);transform:translateY(-118vh)');
    d.dataset.c='1';
    var g=glyph(W,W.dataset.glyph||'crown','#C9A45C');
    return seq([[d,[{transform:'translateY(-118vh)'},{transform:'translateY(0)'}],440,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:0},{opacity:.8}],200,'linear']],fn,
      [[d,[{transform:'translateY(0)'},{transform:'translateY(-118vh)'}],460,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:.8},{opacity:0}],160,'linear']]);},
  dots:function(W,fn){var d=div(W,'inset:0;background:#0B0F0E;opacity:0'),ds=[];
    for(var i=0;i<5;i++){ds.push(div(W,'left:calc(50% + '+((i-2)*34-9)+'px);top:calc(50% - 9px);width:18px;height:18px;border-radius:50%;border:2px solid #C9A45C;opacity:0'));}
    var inA=[[d,[{opacity:0},{opacity:1}],200,'ease-in']].concat(ds.map(function(x,i){return [x,[{opacity:0,background:'transparent'},{opacity:1,background:'transparent',offset:.4},{opacity:1,background:'#C9A45C'}],120+i*60,'linear'];}));
    return seq(inA,fn,[[d,[{opacity:1},{opacity:0}],300,'ease-out']].concat(ds.map(function(x){return [x,[{opacity:1,background:'#C9A45C'},{opacity:0,background:'#C9A45C'}],200,'linear'];})));},
  brush:function(W,fn){var paint='repeating-linear-gradient(0deg,#0F2A2B 0 7px,#1B3D3C 7px 11px,#12302F 11px 19px,#244C4A 19px 21px)';
    var d=div(W,'left:-10vw;top:-10vh;width:120vw;height:120vh;background:'+paint+';border-radius:0 40vh 40vh 0;transform:translateX(-120%) skewX(-8deg)');
    var g=glyph(W,W.dataset.glyph||'frame','#D4AF37');
    return seq([[d,[{transform:'translateX(-120%) skewX(-8deg)'},{transform:'translateX(0) skewX(-8deg)'}],460,'cubic-bezier(.5,0,.3,1)'],[g,[{opacity:0},{opacity:.85}],220,'linear']],fn,
      [[d,[{transform:'translateX(0) skewX(-8deg)'},{transform:'translateX(120%) skewX(-8deg)'}],480,'cubic-bezier(.6,0,.6,1)'],[g,[{opacity:.85},{opacity:0}],160,'linear']]);},
  page:function(W,fn){W.style.perspective='1600px';
    var d=div(W,'inset:0;background:radial-gradient(ellipse at 30% 40%,#F1E3C8,#D9C49A 80%);transform-origin:0 50%;transform:rotateY(-95deg);box-shadow:inset 30px 0 60px rgba(60,30,10,.35)');
    var g=glyph(W,W.dataset.glyph||'book','#4E3519');
    return seq([[d,[{transform:'rotateY(-95deg)'},{transform:'rotateY(0deg)'}],480,'cubic-bezier(.4,0,.2,1)'],[g,[{opacity:0},{opacity:.8}],200,'linear']],fn,
      [[d,[{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(0deg)',opacity:0}],380,'ease-out'],[g,[{opacity:.8},{opacity:0}],160,'linear']]);},
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
  flag:function(W,fn){var box=div(W,'inset:0;overflow:hidden;clip-path:inset(0 0 0 0)'),pts=['0 0','100% 0'],n=24;
    for(var i=n;i>=0;i--)pts.push((i*100/n).toFixed(2)+'% '+(i%2?88+Math.random()*4:94+Math.random()*6).toFixed(1)+'%');
    var f=document.createElement('div');f.style.cssText='position:absolute;left:-2vw;right:-2vw;top:0;height:114vh;transform:translateY(-114vh);clip-path:polygon('+pts.join(',')+');'+
      'background:repeating-linear-gradient(90deg,rgba(0,0,0,.16) 0 4px,transparent 4px 70px),linear-gradient(180deg,#B4360A,#E8641A 40%,#F08A2C 78%,#B4360A)';box.appendChild(f);
    var g=glyph(W,'fist','#1A0A05');g.style.position='absolute';box.appendChild(g);
    var e=div(W,'left:-5vw;right:-5vw;top:-30px;height:60px;background:linear-gradient(180deg,rgba(255,120,30,0),rgba(255,214,140,.95) 45%,rgba(255,110,25,.85) 60%,rgba(120,20,5,0));filter:blur(5px);opacity:0;transform:translateY(100vh)');
    var tick=div(W,'width:0;height:0'),D=680,t0=0;
    function burn(now){if(!t0)t0=now;var k=Math.min(1,(now-t0)/D),H=innerHeight,y=H*(1-k);
      box.style.clipPath='inset(0 0 '+(k*100).toFixed(2)+'% 0)';e.style.transform='translateY('+y.toFixed(1)+'px)';e.style.opacity=k<.95?1:(1-k)*20;
      if(k<1)requestAnimationFrame(burn);}
    var st=seq([[f,[{transform:'translateY(-114vh)'},{transform:'translateY(0)'}],460,'cubic-bezier(.6,0,.4,1)'],[g,[{opacity:0},{opacity:.9}],220,'linear']],
      function(){fn();requestAnimationFrame(burn);},
      [[tick,[{opacity:0},{opacity:1}],D+20,'linear']]);
    return st;},
  shroud:function(W,fn){var pts=['0 0','100% 0'],n=22;
    for(var i=n;i>=0;i--)pts.push((i*100/n).toFixed(2)+'% '+(i%2?95+Math.random()*2:99+Math.random()*1).toFixed(1)+'%');
    var d=div(W,'left:-8vw;right:-8vw;top:0;height:132vh;transform-origin:50% 0;transform:translateY(-132vh);clip-path:polygon('+pts.join(',')+');'+
      'background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 8px,rgba(0,0,0,.34) 8px 24px,rgba(255,255,255,.025) 24px 46px,rgba(0,0,0,.2) 46px 62px),linear-gradient(180deg,#0A090B,#161216 55%,#0A090B)');
    return seq([[d,[{transform:'translateY(-132vh)'},{transform:'translateY(0)'}],420,'cubic-bezier(.55,0,.6,1)']],fn,
      [[d,[{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(-60vh) rotate(-1.5deg)',offset:.35},{transform:'translateY(-135vh) rotate(-6deg)'}],700,'cubic-bezier(.5,0,.8,.5)']]);},
  ribbons:function(W,fn){var n=11,els=[],band='linear-gradient(180deg,rgba(244,250,246,.9),rgba(205,230,216,.82))';
    var rail=div(W,'left:0;right:0;top:0;height:12px;background:linear-gradient(180deg,#9FB8AC,#7E9A8D);box-shadow:0 3px 8px rgba(0,0,0,.25);transform:translateY(-14px)');
    for(var i=0;i<n;i++){els.push(div(W,'left:'+(i*100/n).toFixed(2)+'%;width:'+(100/n+.6).toFixed(2)+'%;top:0;height:104vh;background:'+band+';'+
      'border-left:1px solid rgba(46,139,98,.28);border-right:1px solid rgba(255,255,255,.55);box-shadow:inset 0 -26px 22px -22px rgba(46,139,98,.28);transform:translateY(-106vh)'));}
    var inA=[[rail,[{transform:'translateY(-14px)'},{transform:'translateY(0)'}],160,'ease-out']],outA=[];
    els.forEach(function(e,i){inA.push([e,[{transform:'translateY(-106vh)'},{transform:'translateY(0)'}],300+(i%4)*60,'cubic-bezier(.4,0,.3,1)']);
      outA.push([e,[{transform:'translateY(0)'},{transform:'translateY(-106vh)'}],360+((i*3)%5)*50,'cubic-bezier(.5,0,.7,.6)']);});
    outA.push([rail,[{transform:'translateY(0)'},{transform:'translateY(-14px)'}],160,'ease-in']);
    return seq(inA,fn,outA);},
  leaves:function(W,fn){W.style.perspective='1800px';var n=6,els=[],inA=[],outA=[];
    var back=div(W,'inset:0;background:#0E120D;opacity:0');inA.push([back,[{opacity:0},{opacity:1}],260,'linear']);
    for(var i=0;i<n;i++){var e=div(W,'inset:0;transform-origin:0 50%;transform:rotateY(-100deg);'+
      'background:radial-gradient(ellipse at 35% 45%,#F3E6CB,#DCC79E 78%,#C9B07E);box-shadow:inset 26px 0 50px rgba(70,45,15,.35),-6px 0 18px rgba(0,0,0,.35);'+
      'border-right:1px solid rgba(120,90,40,.35)');els.push(e);
      inA.push([e,[{transform:'rotateY(-100deg)'},{transform:'rotateY(-100deg)',offset:i/(n+1)},{transform:'rotateY(0deg)'}],520+i*70,'cubic-bezier(.45,0,.25,1)']);}
    els.forEach(function(e,i){outA.push([e,[{transform:'rotateY(0deg)'},{transform:'rotateY(0deg)',offset:i/(n+2)},{transform:'rotateY(100deg)'}],460+i*70,'cubic-bezier(.6,0,.6,1)']);});
    outA.push([back,[{opacity:1},{opacity:1,offset:.6},{opacity:0}],620,'linear']);
    return seq(inA,fn,outA);},
  smoke:function(W,fn){var inA=[],outA=[],els=[],n=9,Wd=innerWidth,H=innerHeight,R0=Math.max(Wd,H);
    var base=div(W,'inset:0;background:#5E5852;opacity:0');inA.push([base,[{opacity:0},{opacity:0,offset:.3},{opacity:.92}],640,'ease-in']);
    for(var i=0;i<n;i++){var r=R0*(.3+Math.random()*.3),x=(i+.5)*Wd/n+(Math.random()-.5)*Wd/n,y=H*(.35+Math.random()*.7),g=Math.round(45+Math.random()*130);
      var e=div(W,'left:'+(x-r)+'px;top:'+(y-r)+'px;width:'+(2*r)+'px;height:'+(2*r)+'px;border-radius:50%;filter:blur(28px);background:radial-gradient(circle,rgba('+g+','+(g-4)+','+(g-8)+',.95),rgba('+g+','+(g-4)+','+(g-8)+',0) 70%);opacity:0;transform:scale(.4) translateY(45vh)');els.push(e);
      inA.push([e,[{opacity:0,transform:'scale(.4) translateY(45vh)'},{opacity:1,transform:'scale(1) translateY(0)',offset:.75},{opacity:1,transform:'scale(1.1) translateY(-4vh)'}],600+i*25,'cubic-bezier(.3,.6,.4,1)']);
      outA.push([e,[{opacity:1,transform:'scale(1.1) translateY(-4vh)'},{opacity:0,transform:'scale(1.4) translateY(-45vh)'}],700+i*30,'ease-out']);}
    outA.push([base,[{opacity:1},{opacity:0}],520,'ease-out']);
    return seq(inA,fn,outA);},
  candles:function(W,fn){var d=div(W,'inset:0;background:#0A0705;opacity:0'),g=glyph(W,W.dataset.glyph||'bowl','#8A7A66'),fl=[],inA,outA;
    var R=Math.min(110,innerWidth*.22),cx=innerWidth/2,cy=innerHeight/2,BIG=Math.hypot(innerWidth,innerHeight)+40;
    for(var i=0;i<5;i++){var a=-Math.PI/2+i*2*Math.PI/5,x=cx+R*Math.cos(a),y=cy+R*.62*Math.sin(a)+10;
      fl.push(div(W,'left:'+(x-6)+'px;top:'+(y-22)+'px;width:12px;height:22px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(circle at 50% 70%,#FFF4C8,#FFB347 45%,#E8641A 75%,rgba(232,100,26,0));box-shadow:0 0 18px 6px rgba(255,170,70,.45);opacity:0'));}
    var hole=div(W,'left:50%;top:50%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 '+BIG+'px #0A0705,inset 0 0 40px 20px #0A0705;opacity:0');
    inA=[[d,[{opacity:0},{opacity:1}],200,'ease-in'],[g,[{opacity:0},{opacity:0,offset:.3},{opacity:.75}],420,'linear']].concat(fl.map(function(f,i){
      return [f,[{opacity:0,transform:'scale(.3)'},{opacity:0,offset:Math.min(.9,(180+i*130)/900)},{opacity:1,transform:'scale(1)'}],900,'ease-out'];}));
    outA=[[hole,[{opacity:1,width:'0px',height:'0px'},{opacity:1,width:'0px',height:'0px',offset:.3},{opacity:1,width:(BIG*2)+'px',height:(BIG*2)+'px'}],820,'cubic-bezier(.5,0,.3,1)'],
      [d,[{opacity:1},{opacity:0,offset:.31},{opacity:0}],820,'linear'],[g,[{opacity:.75},{opacity:0,offset:.3},{opacity:0}],820,'linear']].concat(fl.map(function(f){
      return [f,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.2) translateY(-14px)',offset:.28},{opacity:0}],820,'ease-in'];}));
    return seq(inA,fn,outA);},
  ice:function(W,fn){var Wd=innerWidth,H=innerHeight,cx=Wd/2,cy=H*.48,ice='linear-gradient(160deg,rgba(214,234,246,.97),rgba(160,196,220,.97) 55%,rgba(196,222,240,.97))';
    var frost=div(W,'inset:0;box-shadow:inset 0 0 0 0 rgba(190,220,240,.97);background:transparent');
    var fill=div(W,'inset:0;background:'+ice+';opacity:0');
    var n=9,pts=[],per=2*(Wd+H);
    for(var i=0;i<n;i++){var u=(i+.3+Math.random()*.4)/n*per,x,y;
      if(u<Wd){x=u;y=0;}else if(u<Wd+H){x=Wd;y=u-Wd;}else if(u<2*Wd+H){x=Wd-(u-Wd-H);y=H;}else{x=0;y=H-(u-2*Wd-H);}pts.push([x,y]);}
    var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('width',Wd);svg.setAttribute('height',H);
    svg.style.cssText='position:absolute;left:0;top:0;opacity:0;filter:drop-shadow(0 0 4px rgba(255,120,30,1)) drop-shadow(0 0 12px rgba(255,90,20,.8))';W.appendChild(svg);
    var paths=[];pts.forEach(function(p){var d='M'+cx+' '+cy,k=6;for(var j=1;j<=k;j++){var t=j/k,jx=(j<k?(Math.random()-.5)*40:0),jy=(j<k?(Math.random()-.5)*40:0);
      d+=' L'+(cx+(p[0]-cx)*t+jx).toFixed(1)+' '+(cy+(p[1]-cy)*t+jy).toFixed(1);}
      var e=document.createElementNS(NS,'path');e.setAttribute('d',d);e.setAttribute('pathLength','1');e.setAttribute('fill','none');
      e.setAttribute('stroke','#FF7A1A');e.setAttribute('stroke-width','3.5');e.style.strokeDasharray='1';e.style.strokeDashoffset='1';svg.appendChild(e);paths.push(e);});
    var shards=[];pts.forEach(function(p,i){var q=pts[(i+1)%n],corners=[];
      [[0,0],[Wd,0],[Wd,H],[0,H]].forEach(function(c){var a0=Math.atan2(p[1]-cy,p[0]-cx),a1=Math.atan2(q[1]-cy,q[0]-cx),ac=Math.atan2(c[1]-cy,c[0]-cx),span=(a1-a0+2*Math.PI)%(2*Math.PI),off=(ac-a0+2*Math.PI)%(2*Math.PI);if(off>0&&off<span)corners.push([off,c]);});
      corners.sort(function(a,b){return a[0]-b[0];});
      var poly=[[cx,cy],p].concat(corners.map(function(c){return c[1];})).concat([q]).map(function(v){return v[0].toFixed(1)+'px '+v[1].toFixed(1)+'px';}).join(',');
      var sh=div(W,'inset:0;background:'+ice+';clip-path:polygon('+poly+');opacity:0');
      var mx=((p[0]+q[0])/2-cx),my=((p[1]+q[1])/2-cy),L=Math.hypot(mx,my)||1;sh._dx=mx/L*innerWidth*.5;sh._dy=my/L*innerHeight*.5+H*.3;sh._r=(Math.random()-.5)*30;shards.push(sh);});
    var inA=[[frost,[{boxShadow:'inset 0 0 0 0 rgba(190,220,240,.97)'},{boxShadow:'inset 0 0 0 '+Math.ceil(Math.max(Wd,H)*.6)+'px rgba(190,220,240,.97)'}],620,'cubic-bezier(.4,0,.6,1)'],
      [fill,[{opacity:0},{opacity:0,offset:.6},{opacity:1}],620,'linear'],[svg,[{opacity:0},{opacity:0,offset:.62},{opacity:1}],980,'linear']];
    paths.forEach(function(e,i){inA.push([e,[{strokeDashoffset:1},{strokeDashoffset:1,offset:.62},{strokeDashoffset:0}],980+i*20,'ease-out']);});
    var outA=[[frost,[{opacity:1},{opacity:0,offset:.02},{opacity:0}],700,'linear'],[fill,[{opacity:1},{opacity:0,offset:.02},{opacity:0}],700,'linear'],
      [svg,[{opacity:1},{opacity:0}],260,'ease-out']];
    shards.forEach(function(sh){outA.push([sh,[{opacity:1,transform:'none'},{opacity:1,offset:.15,transform:'none'},{opacity:0,transform:'translate('+sh._dx.toFixed(0)+'px,'+sh._dy.toFixed(0)+'px) rotate('+sh._r.toFixed(1)+'deg)'}],700,'cubic-bezier(.5,0,.8,.6)']);});
    return seq(inA,fn,outA);},
  fade:function(W,fn){var d=div(W,'inset:0;background:#08050A;opacity:0');
    return seq([[d,[{opacity:0},{opacity:1}],220,'ease-in']],fn,[[d,[{opacity:1},{opacity:0}],260,'ease-out']]);}
};
/*ART-BEGIN*/
/* ── Гравюры знаков (v2.21): тёмная заливка, контур, штриховка тени, линии деталей с прорисовкой ── */
function C_(x,y,r){return 'M'+(x-r)+' '+y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0Z';}
function MIR_(d){return d.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g,function(m,x,y){return (+(100-x).toFixed(2))+' '+y;});}
function RING_(cx,cy,R,n,r,skip){var s='';for(var i=0;i<n;i++){if(skip&&skip(i))continue;var a=i*2*Math.PI/n-Math.PI/2;s+=C_(+(cx+R*Math.cos(a)).toFixed(2),+(cy+R*Math.sin(a)).toFixed(2),r);}return s;}
var EAGLE_W='M45 31 C35 25 21 22 5 21 L12 27 L3 31 L13 35 L5 40 L16 43 L9 49 L21 50 L17 56 L29 54 L37 50 C41 46 44 41 45 36 Z';
var EAGLE_F='M40 35 L12 27 M40 38 L13 35 M39 41 L16 43 M38 44 L21 50 M36 47 L29 54';
var GART={
 crown:{b:'M16 72 L11 34 L29 52 L38 20 L50 46 L62 20 L71 52 L89 34 L84 72 Z M13 75 H87 V88 H13 Z'+C_(11,31,4.5)+C_(38,17,4.5)+C_(62,17,4.5)+C_(89,31,4.5)+C_(50,42,4),
  s:'M50 0 H100 V100 H50 Z M0 83 H100 V100 H0 Z',
  l:['M20 68 L17 44 L30 58 L39 30 L50 54 L61 30 L70 58 L83 44 L80 68 Z','M13 78 H87','M13 85 H87','M50 33 V38 M47.5 35.5 H52.5',
     'M27 81.5 L30 79.3 L33 81.5 L30 83.7 Z','M47 81.5 L50 79.3 L53 81.5 L50 83.7 Z','M67 81.5 L70 79.3 L73 81.5 L70 83.7 Z'],
  d:C_(29,64,1.6)+C_(50,64,2.4)+C_(71,64,1.6)},
 frame:{b:'M16 18 H84 V86 H16 Z',s:'M84 18 V86 H16 L27 75 H73 V29 Z',
  l:['M27 29 H73 V75 H27 Z','M21 23 H79 V81 H21 Z','M16 18 L27 29 M84 18 L73 29 M84 86 L73 75 M16 86 L27 75','M38 18 L50 7 L62 18',
     'M50 52 m-3 0 a3 3 0 1 1 6 0 a6 6 0 1 1 -12 0 a9 9 0 1 1 18 0 a12 12 0 1 1 -24 0 a15 15 0 1 1 30 0',
     'M30 75 V63 H34 V57 H37 V75 M63 75 V59 H66 V65 H70 V75'],
  d:C_(50,52,3.4)+C_(50,7,1.5)},
 book:{b:'M50 30 C40 22 24 19 9 22 L9 74 L6 75 L6 81 C24 77 40 79 50 86 C60 79 76 77 94 81 L94 75 L91 74 L91 22 C76 19 60 22 50 30 Z',
  s:'M38 0 H50 V100 H38 Z M0 77 H100 V100 H0 Z M91 0 H100 V100 H91 Z',
  l:['M50 30 V84','M9 74 C24 70 40 72 50 80 C60 72 76 70 91 74','M15 32 C25 29 35 30 44 34','M15 38 C25 35 35 36 44 40','M15 44 C25 41 35 42 44 46',
     'M15 50 C25 47 35 48 44 52','M15 56 C25 53 35 54 44 58','M15 62 C25 59 35 60 44 64','M56 34 C65 30 75 29 85 32','M56 40 C65 36 75 35 85 38',
     C_(70,51,7),'M70 44 V58 M63 51 H77 M65 46 L75 56 M75 46 L65 56','M56 64 C65 60 75 59 85 62','M53 84 L53 96 L55.5 93 L58 96 L58 83'],
  d:C_(70,51,1.6)},
 tremere:{r:1,b:'M50 6 L95 88 H5 Z M50 28 L76 76 H24 Z M34 62 Q50 47 66 62 Q50 74 34 62 Z',
  s:'M50 0 L100 100 H50 Z M0 80 H100 V100 H0 Z',
  l:['M50 17 L86 83 H14 Z',C_(50,61.5,6.5),'M50 44 V37 M42 47 L38 41 M58 47 L62 41','M38 63 C44 66 56 66 62 63'],
  d:C_(50,61.5,3)},
 brujah:{r:1,b:C_(50,50,44)+C_(50,50,35)+'M23 33 H77 L50 80 Z M35 40 H65 L50 66 Z',
  s:'M50 50 H100 V100 H50 Z M0 72 H100 V100 H0 Z',
  l:['M29 36.5 H71 L50 73 Z','M50 6 V14 M50 86 V94 M6 50 H14 M86 50 H94'],
  d:RING_(50,50,39.5,16,1.15,function(i){return i%4===0;})},
 bat:{b:'M50 36 C48 31 46 30 44.5 32 L42 26 L40.5 35 C33 32 24 29 13 31 C8 32 5 35 3 40 C8 38.5 12.5 40.5 14 45 C18.5 41.5 23.5 42.5 26 47 C30 43.5 35 44.5 37 50 C41 47 45.5 50.5 47 58 L50 67 L53 58 C54.5 50.5 59 47 63 50 C65 44.5 70 43.5 74 47 C76.5 42.5 81.5 41.5 86 45 C87.5 40.5 92 38.5 97 40 C95 35 92 32 87 31 C76 29 67 32 59.5 35 L58 26 L55.5 32 C54 30 52 31 50 36 Z',
  s:'M0 44 H100 V100 H0 Z',
  l:['M41 37 L13 32','M41 38.5 L14 44','M42 40 L26 46','M43.5 42 L37 49','M59 37 L87 32','M59 38.5 L86 44','M58 40 L74 46','M56.5 42 L63 49',
     'M50 39 V61','M46.5 44 L49 46.5 M53.5 44 L51 46.5 M46.5 50 L49 52.5 M53.5 50 L51 52.5'],
  d:C_(47.5,35.5,.9)+C_(52.5,35.5,.9)},
 sparrow:{b:'M18 70 C22 58 32 50 44 48 C48 39 56 34 64 36 C69 37 72 40 74 43 L84 45.5 L74 49 C73 57 68 63 60 66 C52 69 42 70 34 69 L12 79 L17 71 Z M6 83 C30 79 60 81 94 76 L95 80 C60 85 30 84 7 87 Z',
  s:'M0 60 H100 V100 H0 Z',
  l:['M38 52 C47 53 56 57 61 64','M36 56 C44 57 51 61 55 66','M33 60 C40 61 46 64 49 68','M50 41 C56 37 63 37 69 40',
     'M30 70 L14 77 M32 68 L18 72','M48 69 L46 81 M54 68 L55 80','M78 77 C82 72 86 70 90 70','M86 70 C90 66 95 67 96 69 C93 72 89 72 86 70'],
  d:C_(67,42,1.6)},
 bowl:{b:'M20 49 C22 40 30 37 37 41 C41 33 55 31 61 39 C67 35 78 39 80 49 Z M9 48 H91 C89 69 74 79 61 81 L65 92 H35 L39 81 C26 79 11 69 9 48 Z',
  s:'M50 48 H100 V100 H50 Z M0 72 H100 V100 H0 Z',
  l:['M9 48 C30 55 70 55 91 48','M15 61 C35 68 65 68 85 61','M19 67 C37 74 63 74 81 67','M37 86 H63',
     'M40 30 C35 24 45 21 40 14 C37 10 42 7 41 4','M58 29 C63 23 54 19 59 12','M30 44 C34 42 38 43 40 45 M48 38 C52 36 56 37 58 40 M64 44 C67 42 71 43 73 46'],
  d:C_(26,36,.9)+C_(70,33,.8)+C_(50,27,.9)+C_(33,30,.7)},
 eagle:{b:'M44 28 C42 40 41 52 44 62 L38 84 L46 77 L50 88 L54 77 L62 84 L56 62 C59 52 58 40 56 28 Z '+EAGLE_W+' '+MIR_(EAGLE_W)+' '+C_(50,20,7.5)+' M56 17 L67 20 L56 24 Z',
  s:'M0 48 H100 V100 H0 Z',
  l:[EAGLE_F,MIR_(EAGLE_F),'M45 40 L50 44 L55 40 M45 48 L50 52 L55 48 M45 56 L50 60 L55 56','M50 70 V86 M46 70 L42 80 M54 70 L58 80','M43 25 C46 29 54 29 57 25'],
  d:C_(52.5,18.5,1.4)},
 ball:{b:C_(50,40,29)+'M40 67 H60 V73 H40 Z M30 73 H70 L76 89 H24 Z',
  s:'M0 0 H100 V100 H0 Z'+C_(41,31,27),sr:1,
  l:['M52 11 L47 24 L55 32 L44 44','M55 32 L68 29 L77 33','M44 44 L31 50 L22 48','M44 44 L51 57 L47 68','M51 57 L63 60','M30 28 C33 20 40 15 48 14','M28 79 H72 M26 84 H74','M34 34 C35 31 37 29 39 28'],
  d:C_(62,22,1.2)+C_(36,52,.8)},
 fist:{b:'M27 30 C27 22 36 22 37 28 C37 19 47 19 48 26 C48 19 58 19 59 27 C60 21 70 21 70 30 L70 52 C70 59 66 63 60 65 L60 92 L37 92 L37 65 C31 61 27 55 27 48 Z',
  s:'M54 0 H100 V100 H54 Z M0 66 H100 V100 H0 Z',
  l:['M37 28 V42','M48 26 V42','M59 27 V42','M28 34 C30 36 34 36 36 34 M38 32 C41 34 45 34 47 32 M49 32 C52 34 56 34 58 32 M60 33 C63 35 67 35 69 33',
     'M27 46 C37 43 50 45 57 50 C52 55 41 56 31 55','M37 74 H60','M37 79 H60']},
 scales:{b:'M48 14 H52 V82 H48 Z M14 24 H86 V28 H14 Z'+C_(50,12,4)+'M34 82 H66 L70 90 H30 Z M6 58 H34 C34 66 28 70 20 70 C12 70 6 66 6 58 Z M66 58 H94 C94 66 88 70 80 70 C72 70 66 66 66 58 Z',
  s:'M0 62 H100 V100 H0 Z',
  l:['M16 28 L8 58 M16 28 L32 58 M84 28 L68 58 M84 28 L92 58','M14 26 H86','M45 40 H55 M45 44 H55','M32 86 H68','M6 58 C12 61 28 61 34 58 M66 58 C72 61 88 61 94 58'],
  d:C_(16,27,1.5)+C_(84,27,1.5)}
};
var gUID=0;
function engrave(name,ink,fill){var a=GART[name];if(!a)return '';var id='gx'+(++gUID),sw=a.w||1.7;
  var h='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
   '<pattern id="'+id+'h" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><line x1="0" y1="0" x2="0" y2="2.6" stroke="'+ink+'" stroke-width=".75"/></pattern>'+
   '<clipPath id="'+id+'c"><path d="'+a.b+'"'+(a.r?' clip-rule="evenodd"':'')+'/></clipPath></defs>'+
   '<path class="gl-base" d="'+a.b+'" fill="'+fill+'"'+(a.r?' fill-rule="evenodd"':'')+'/>'+
   '<g class="gl-sh" clip-path="url(#'+id+'c)"><path d="'+a.s+'" fill="url(#'+id+'h)"'+(a.sr?' fill-rule="evenodd"':'')+'/></g>'+
   '<path class="gl-ln" pathLength="1" d="'+a.b+'" fill="none" stroke="'+ink+'" stroke-width="'+sw+'" stroke-linejoin="round"/>';
  (a.l||[]).forEach(function(d,i){h+='<path class="gl-ln" pathLength="1" style="animation-delay:calc((var(--gd,0ms) + '+(.18+i*.06).toFixed(2)+'s) * var(--ts,1))" d="'+d+'" fill="none" stroke="'+ink+'" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>';});
  if(a.d)h+='<path class="gl-dt" d="'+a.d+'" fill="'+ink+'"/>';
  return h+'</svg>';}
function isDark(c){var m=/^#([0-9a-f]{6})$/i.exec(c||'');if(!m)return false;var n=parseInt(m[1],16);return ((n>>16)*.3+((n>>8)&255)*.59+(n&255)*.11)<90;}
/*ART-GLYPH-END*/
/* ── Фактуры шторок (v2.22): шум SVG как плитки фона; темп и пауза ── */
var TSc=1.3,HOLDc=250;
var HOLD_OF={ash:650,banner:700,vitrine:700,dots:650,brush:650,page:650,casefile:650,candles:600,flag:550,folder:450,ink:500,curtain:400,leaves:350,shroud:450};
function NZ(o){var s='<svg xmlns="http://www.w3.org/2000/svg" width="'+o.s+'" height="'+o.s+'"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="'+(o.t||'fractalNoise')+'" baseFrequency="'+o.f+'" numOctaves="'+(o.o||3)+'" seed="'+(o.seed||3)+'" stitchTiles="stitch"/>'+
  '<feColorMatrix values="0 0 0 0 '+o.r+' 0 0 0 0 '+o.g+' 0 0 0 0 '+o.b+' 0 0 0 '+o.k+' '+o.c+'"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';
  return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'") 0 0/'+o.s+'px '+o.s+'px';}
var TXC={};function TX(n,o){return TXC[n]||(TXC[n]=NZ(o));}
function spots(n,col,r0,r1){var a=[];for(var i=0;i<n;i++){var r=rn(r0,r1).toFixed(0);a.push('radial-gradient(circle at '+rn(5,95).toFixed(0)+'% '+rn(5,95).toFixed(0)+'%,'+col+' 0,rgba(0,0,0,0) '+r+'px)');}return a.join(',');}
var TEX={
  grain:function(){return {bg:TX('g',{f:.85,o:2,r:0,g:0,b:0,k:1.5,c:-.55,s:180}),op:.5};},
  paper:function(){return {bg:spots(4,'rgba(140,95,40,.16)',30,90)+','+TX('pg',{f:.75,o:3,r:.3,g:.2,b:.1,k:1.5,c:-.55,s:200})+','+TX('pm',{f:.02,o:3,r:.35,g:.24,b:.12,k:1.1,c:-.42,s:520,seed:7}),op:.6};},
  card:function(){var x=rn(55,80).toFixed(0),y=rn(15,40).toFixed(0);
    return {bg:'radial-gradient(circle at '+x+'% '+y+'%,rgba(0,0,0,0) 0 34px,rgba(110,70,30,.22) 35px 38px,rgba(110,70,30,.08) 39px 41px,rgba(0,0,0,0) 42px),'+spots(3,'rgba(120,80,30,.16)',40,110)+','+TX('pg',{f:.75,o:3,r:.3,g:.2,b:.1,k:1.5,c:-.55,s:200})+','+TX('pm',{f:.02,o:3,r:.35,g:.24,b:.12,k:1.1,c:-.42,s:520,seed:7}),op:.7,sh:'inset 0 0 40px rgba(90,55,20,.35)'};},
  parch:function(){return {bg:spots(5,'rgba(150,100,40,.18)',20,70)+','+TX('pg',{f:.75,o:3,r:.3,g:.2,b:.1,k:1.5,c:-.55,s:200})+','+TX('pm',{f:.02,o:3,r:.35,g:.24,b:.12,k:1.1,c:-.42,s:520,seed:7}),op:.7,sh:'inset 0 0 90px rgba(120,75,25,.4)'};},
  velvet:function(){return {bg:TX('vl',{f:.008,o:3,r:1,g:.85,b:.85,k:.4,c:-.16,s:700,seed:5})+','+TX('vd',{f:.55,o:3,r:0,g:0,b:0,k:1.5,c:-.5,s:220}),op:.75};},
  weave:function(){return {bg:TX('wh',{f:'0.9 0.06',o:2,r:0,g:0,b:0,k:1.3,c:-.45,s:200})+','+TX('wv',{f:'0.06 0.9',o:2,r:0,g:0,b:0,k:1.3,c:-.45,s:200,seed:9})+','+TX('wl',{f:.01,o:3,r:1,g:1,b:1,k:.6,c:-.22,s:600,seed:4}),op:.6};},
  metal:function(){return {bg:TX('ml',{f:'0.002 0.7',o:2,r:1,g:1,b:.9,k:1.2,c:-.35,s:400})+','+TX('md',{f:'0.002 0.7',o:2,r:0,g:0,b:0,k:1.2,c:-.4,s:400,seed:8}),op:.55};},
  canvas:function(){return {bg:TX('cs',{f:'0.002 0.3',o:3,r:0,g:0,b:0,k:1.6,c:-.55,s:600})+','+TX('cl',{f:'0.003 0.45',o:2,r:1,g:.85,b:.8,k:1,c:-.38,s:600,seed:6})+','+TX('wh',{f:'0.9 0.06',o:2,r:0,g:0,b:0,k:1.3,c:-.45,s:200}),op:.75};},
  leather:function(){return {bg:TX('lf',{f:.35,o:4,r:0,g:0,b:0,k:1.9,c:-.62,s:260})+','+TX('lm',{f:.03,o:3,r:.08,g:.03,b:0,k:1.2,c:-.4,s:520,seed:2})+','+TX('ll',{f:.02,o:2,r:1,g:.8,b:.6,k:.5,c:-.2,s:600,seed:11}),op:.75};},
  slate:function(){return {bg:TX('sl',{f:.4,o:4,r:.8,g:.85,b:.8,k:.8,c:-.32,s:300})+','+TX('sm',{f:.01,o:3,r:0,g:0,b:0,k:1,c:-.35,s:700,seed:12}),op:.45};},
  wax:function(){return {bg:TX('wx',{f:.15,o:2,r:.3,g:.2,b:.1,k:.9,c:-.3,s:120}),op:.55};},
  fog:function(){return {bg:TX('fg',{f:.006,o:4,r:.62,g:.6,b:.58,k:1.3,c:-.38,s:900}),op:1};},
  ember:function(){return {bg:TX('em',{f:.008,o:4,r:.25,g:.12,b:.08,k:1.3,c:-.38,s:900,seed:13}),op:1};},
  ink:function(){return {bg:TX('ik',{f:.9,o:2,r:.9,g:.8,b:.6,k:1,c:-.5,s:160})+','+TX('im',{f:.015,o:3,r:.2,g:.12,b:.05,k:1,c:-.35,s:600,seed:10}),op:.35};},
  gloss:function(){return {bg:TX('gl',{f:'0.004 0.05',o:3,r:1,g:.6,b:.6,k:.9,c:-.35,s:700,seed:14}),op:.5};}
};
function texIn(el,name){var t=TEX[name]&&TEX[name]();if(!t)return null;var d=document.createElement('div');
  d.style.cssText='position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:'+t.bg+';opacity:'+t.op+(t.sh?';box-shadow:'+t.sh:'');el.appendChild(d);return d;}
/* ── Шторки v2.21: многослойные сцены ── */
function dv(p,st,cls){var tn=null;st=st.replace(/tex:([a-z]+);/,function(_,n){tn=n;return '';});var d=document.createElement('div');d.style.cssText='position:absolute;'+st;if(cls)d.className=cls;p.appendChild(d);if(tn)texIn(d,tn);return d;}
function rn(a,b){return a+Math.random()*(b-a);}
function at(kf,dl,D){var o=Math.max(0,Math.min(.97,dl/D));if(!o)return kf;var has=kf.some(function(f){return f.offset!=null;}),m=kf.length-1,out=[kf[0]],k0={};
  for(var k in kf[0])if(k!=='offset')k0[k]=kf[0][k];k0.offset=o;out.push(k0);
  for(var i=1;i<=m;i++){var f={};for(var q in kf[i])f[q]=kf[i][q];
    if(f.offset!=null)f.offset=o+(1-o)*f.offset;else if(!has&&i<m)f.offset=o+(1-o)*i/m;out.push(f);}
  return out;}
function sparks(P,n,D,o){o=o||{};var L=[];for(var i=0;i<n;i++){
  var x=o.x!=null?o.x+rn(-o.w/2,o.w/2):rn(0,innerWidth),y=o.y!=null?(typeof o.y==='function'?0:o.y+rn(-20,20)):rn(innerHeight*.45,innerHeight+10),
      z=rn(2,o.big||5),t0=o.t?o.t(i):rn(0,o.spread==null?.55:o.spread),rise=rn(innerHeight*(o.r0||.2),innerHeight*(o.r1||.6)),dx=rn(-70,70);
  if(typeof o.y==='function')y=o.y(t0);
  var e=dv(P,'left:'+x.toFixed(0)+'px;top:'+y.toFixed(0)+'px;width:'+z.toFixed(1)+'px;height:'+z.toFixed(1)+'px;border-radius:50%;background:'+(o.c||'#FFC778')+';box-shadow:0 0 '+(z*2.4).toFixed(0)+'px '+(z*.7).toFixed(1)+'px '+(o.g||'rgba(255,110,30,.85)')+';opacity:0');
  var a=Math.min(.9,t0),b=Math.min(.96,a+.06);
  L.push([e,[{opacity:0,transform:'translate(0,0)'},{opacity:0,transform:'translate(0,0)',offset:a},{opacity:1,offset:b},{opacity:0,transform:'translate('+dx.toFixed(0)+'px,'+(-rise).toFixed(0)+'px) scale(.4)'}],D,'ease-out']);}
  return L;}
function motes(P,n,D,box,col){var L=[];for(var i=0;i<n;i++){var x=rn(box[0],box[2]),y=rn(box[1],box[3]),z=rn(1.5,3.2);
  var e=dv(P,'left:'+x+'px;top:'+y+'px;width:'+z+'px;height:'+z+'px;border-radius:50%;background:'+col+';opacity:0');
  L.push([e,at([{opacity:0,transform:'none'},{opacity:.9,offset:.4},{opacity:0,transform:'translate('+rn(-40,40).toFixed(0)+'px,'+rn(-60,-10).toFixed(0)+'px)'}],rn(0,D*.4),D),D,'ease-out']);}
  return L;}

/* Титул: пепел и угли, корона, пелена прогорает снизу вверх */
WIPES.ash=function(W,fn){var Wd=innerWidth,H=innerHeight,box=dv(W,'inset:0;overflow:hidden'),D=1300;
  var bg=dv(box,'inset:0;background:radial-gradient(ellipse at 50% 62%,#2E150C,#130907 58%,#060302);opacity:0');
  var glow=dv(box,'left:-10vw;right:-10vw;bottom:-25vh;height:65vh;background:radial-gradient(ellipse at 50% 100%,rgba(232,119,42,.5),rgba(232,119,42,0) 70%);opacity:0');
  var inA=[[bg,[{opacity:0},{opacity:1}],420,'ease-in'],[glow,[{opacity:0},{opacity:1},{opacity:.7},{opacity:1}],D,'ease-in-out']];
  for(var i=0;i<4;i++){var r=Math.max(Wd,H)*rn(.35,.55),s=dv(box,'left:'+(rn(0,Wd)-r).toFixed(0)+'px;top:'+(H*.65-r).toFixed(0)+'px;width:'+(2*r).toFixed(0)+'px;height:'+(2*r).toFixed(0)+'px;border-radius:50%;background:radial-gradient(circle,rgba(80,58,50,.5),rgba(80,58,50,0) 64%);opacity:0');
    inA.push([s,[{opacity:0,transform:'translateY(22vh) scale(.8)'},{opacity:1,transform:'translateY(-8vh) scale(1.12)'}],D,'ease-out']);}
  var fogA=dv(box,'left:-20%;top:-20%;width:140%;height:140%;tex:ember;opacity:0'),fogB=dv(box,'left:-20%;top:-20%;width:140%;height:140%;tex:fog;opacity:0;mix-blend-mode:screen');
  inA.push([fogA,[{opacity:0,transform:'translate(0,6vh)'},{opacity:.6,transform:'translate(-3vw,-4vh)'}],D,'ease-out'],[fogB,[{opacity:0,transform:'translate(0,8vh) scale(1.1)'},{opacity:.1,transform:'translate(4vw,-6vh) scale(1)'}],D,'ease-out']);
  var g=glyph(W,'crown','#EBA552','#170B06',176);box.appendChild(g);g.style.setProperty('--gd','420ms');
  inA.push([g,[{opacity:0,transform:'translateY(16px) scale(.9)'},{opacity:0,transform:'translateY(16px) scale(.9)',offset:.3},{opacity:1,transform:'none'}],D,'cubic-bezier(.2,.7,.3,1)']);
  inA=inA.concat(sparks(box,Math.round(Wd/20),D,{spread:.75}));
  var n=30,J=[];for(var k=0;k<=n;k++)J.push(rn(-1.2,1.2));
  function edge(y){var a=['0% 0%','100% 0%'];for(var k=n;k>=0;k--)a.push((k*100/n).toFixed(1)+'% '+(y+J[k]).toFixed(1)+'%');return 'polygon('+a.join(',')+')';}
  var ln=flameStrip(W,Wd),FB=ln._base;ln.style.opacity=0;
  var D2=1000,outA=[[box,[{clipPath:edge(105)},{clipPath:edge(-8)}],D2,'linear'],
    [ln,[{opacity:1,transform:'translateY('+(H*1.05-FB).toFixed(0)+'px)'},{opacity:1,transform:'translateY('+(-FB)+'px)',offset:.93},{opacity:0,transform:'translateY('+(-H*.08-FB).toFixed(0)+'px)'}],D2,'linear']];
  outA=outA.concat(sparks(W,Math.round(Wd/14),D2,{t:function(){return rn(.03,.88);},y:function(t){return H*(1.05-1.13*t);},r0:.06,r1:.2,big:4}));
  return seq(inA,fn,outA);};

/* Эден: ламбрекен, бархатные кулисы с неоновой кромкой, прожектор */
WIPES.curtain=function(W,fn){var D=1150;
  var vel='repeating-linear-gradient(90deg,#2E040D 0,#5A0A1C 10px,#8E1630 18px,#B42642 21px,#7A0F26 27px,#3A0511 40px)';
  var sh='linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 72%,rgba(0,0,0,.55))';
  function panel(s){var p=dv(W,(s<0?'left:0;':'right:0;')+'top:0;bottom:0;width:52vw;tex:velvet;background:'+sh+','+vel+';box-shadow:'+(s<0?'14px':'-14px')+' 0 30px rgba(0,0,0,.6);transform:translateX('+(s*100)+'%)');
    dv(p,(s<0?'right:0;':'left:0;')+'top:0;bottom:0;width:18px;background:linear-gradient(90deg,'+(s<0?'rgba(255,42,79,0),rgba(255,42,79,.55)':'rgba(255,42,79,.55),rgba(255,42,79,0)')+')');
    dv(p,'left:0;right:0;bottom:0;height:30px;border-top:3px solid #D9B65C;background:repeating-linear-gradient(90deg,#D9B65C 0 2px,#8A6A24 2px 4px,rgba(0,0,0,0) 4px 7px);-webkit-mask-image:linear-gradient(180deg,#000 60%,transparent);mask-image:linear-gradient(180deg,#000 60%,transparent)');
    return p;}
  var back=dv(W,'inset:0;background:#0A0206;opacity:0'),L=panel(-1),R=panel(1);
  var spot=dv(W,'left:50%;top:0;width:70vw;margin-left:-35vw;height:100vh;background:linear-gradient(180deg,rgba(255,220,232,.26),rgba(255,42,79,.06) 75%,rgba(255,42,79,0));clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);opacity:0');
  var seam=dv(W,'left:50%;top:15vh;bottom:0;width:3px;margin-left:-1.5px;background:#FF5A78;box-shadow:0 0 16px 5px rgba(255,42,79,.75);opacity:0;transform:scaleY(0);transform-origin:50% 0');
  var val=dv(W,'left:0;right:0;top:0;height:15vh;tex:velvet;background:linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,0) 70%),'+vel+';border-bottom:3px solid #D9B65C;box-shadow:0 10px 24px rgba(0,0,0,.6);transform:translateY(-130%)');
  dv(val,'left:0;right:0;bottom:-21px;height:20px;background:radial-gradient(circle at 50% 0,#6E0B22 0 15px,#D9B65C 15px 17px,rgba(0,0,0,0) 17.5px) 0 0/36px 36px repeat-x');
  var inA=[[back,[{opacity:0},{opacity:.85}],300,'ease-in'],[val,[{transform:'translateY(-130%)'},{transform:'translateY(4%)',offset:.8},{transform:'none'}],420,'cubic-bezier(.5,0,.3,1)'],
    [L,at([{transform:'translateX(-100%) skewX(0)'},{transform:'translateX(1.5%) skewX(-2deg)',offset:.8},{transform:'none'}],120,880),880,'cubic-bezier(.6,0,.35,1)'],
    [R,at([{transform:'translateX(100%) skewX(0)'},{transform:'translateX(-1.5%) skewX(2deg)',offset:.8},{transform:'none'}],120,880),880,'cubic-bezier(.6,0,.35,1)'],
    [seam,at([{opacity:0,transform:'scaleY(0)'},{opacity:1,transform:'scaleY(1)'}],820,D),D,'ease-out'],
    [spot,at([{opacity:0},{opacity:.9,offset:.5},{opacity:.35,offset:.62},{opacity:1}],760,D),D,'linear']];
  var outA=[[spot,[{opacity:1},{opacity:0}],220,'ease-out'],[seam,[{opacity:1},{opacity:0}],200,'ease-out'],
    [L,[{transform:'none'},{transform:'translateX(-50%) skewX(3deg)',offset:.5},{transform:'translateX(-104%)'}],760,'cubic-bezier(.55,0,.4,1)'],
    [R,[{transform:'none'},{transform:'translateX(50%) skewX(-3deg)',offset:.5},{transform:'translateX(104%)'}],760,'cubic-bezier(.55,0,.4,1)'],
    [val,at([{transform:'none'},{transform:'translateY(-130%)'}],520,880),880,'ease-in'],[back,at([{opacity:.85},{opacity:0}],300,880),880,'ease-out']];
  return seq(inA,fn,outA);};

/* Папка Шерифа: стол под лампой, папка со скрепкой, штамп, обложка распахивается */
WIPES.casefile=function(W,fn){W.style.perspective='1800px';var H=innerHeight,Wd=innerWidth,D=1350;
  var desk=dv(W,'inset:0;tex:grain;background:repeating-linear-gradient(92deg,rgba(255,255,255,.015) 0 3px,rgba(0,0,0,.05) 3px 9px),radial-gradient(ellipse at 50% 28%,#3E2D1C,#1B130C 62%,#0A0705);opacity:0');
  var lamp=dv(W,'left:50%;top:-35vh;width:110vw;height:100vh;margin-left:-55vw;border-radius:50%;background:radial-gradient(circle,rgba(255,214,140,.3),rgba(255,214,140,0) 62%);opacity:0');
  var fw=Math.min(Wd*.86,720),fh=Math.min(H*.8,860),fx=(Wd-fw)/2,fy=(H-fh)/2+12;
  var inner=dv(W,'left:'+fx+'px;top:'+fy+'px;width:'+fw+'px;height:'+fh+'px;tex:paper;background:linear-gradient(180deg,#F3ECDB,#E6DCC4);box-shadow:0 22px 46px rgba(0,0,0,.6);opacity:0');
  dv(inner,'left:9%;top:7%;width:44%;height:16px;background:#2B2620');
  for(var k=0;k<16;k++)dv(inner,'left:9%;top:'+(15+k*4.6)+'%;height:5px;width:'+rn(50,82).toFixed(0)+'%;background:rgba(43,38,32,'+rn(.3,.6).toFixed(2)+')');
  var cov=dv(W,'left:'+fx+'px;top:'+fy+'px;width:'+fw+'px;height:'+fh+'px;tex:card;border-radius:4px 10px 10px 4px;transform-origin:0 50%;transform:translateY('+H+'px) rotate(-4deg);'+
    'background:repeating-linear-gradient(115deg,rgba(255,255,255,.04) 0 2px,rgba(0,0,0,.035) 2px 5px),linear-gradient(135deg,#D6B57F,#B8935F 68%,#A07A48);box-shadow:0 26px 54px rgba(0,0,0,.7),inset 0 0 0 1px rgba(90,60,30,.45),inset 18px 0 24px -12px rgba(70,45,20,.45)');
  dv(cov,'right:9%;top:-27px;width:30%;height:29px;background:linear-gradient(180deg,#DCBE8A,#C9A46C);border-radius:9px 9px 0 0;box-shadow:inset 0 1px 0 rgba(255,255,255,.35)');
  dv(cov,'right:13%;top:-18px;width:20px;height:74px;border:3px solid #A7B0BA;border-bottom-color:#7D8792;border-radius:11px;transform:rotate(7deg)');
  dv(cov,'right:5%;top:50%;width:26px;height:26px;margin-top:-13px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#9A7A4C,#5A3F20);box-shadow:0 2px 4px rgba(0,0,0,.5)');
  dv(cov,'right:calc(5% + 13px);top:50%;width:34%;height:2px;background:#6B4E2A;transform:rotate(-14deg);transform-origin:100% 50%');
  var g=glyph(W,W.dataset.glyph||'rose','#C9A45C','#140A0D',132);cov.appendChild(g);g.style.opacity=1;g.style.setProperty('--gd','500ms');
  var st=dv(cov,'left:12%;bottom:13%;width:36%;height:62px;border:4px solid rgba(158,27,27,.85);border-radius:5px;transform:rotate(-9deg);opacity:0');
  dv(st,'left:9%;right:9%;top:14px;height:7px;background:rgba(158,27,27,.85)');dv(st,'left:18%;right:18%;top:30px;height:7px;background:rgba(158,27,27,.85)');
  var inA=[[desk,[{opacity:0},{opacity:1}],380,'ease-in'],[lamp,[{opacity:0},{opacity:1},{opacity:.75},{opacity:1}],D,'ease-in-out'],
    [inner,[{opacity:0},{opacity:0,offset:.9},{opacity:1}],760,'linear'],
    [cov,[{transform:'translateY('+H+'px) rotate(-4deg)'},{transform:'translateY(-12px) rotate(.8deg)',offset:.75},{transform:'none'}],760,'cubic-bezier(.3,.7,.3,1)'],
    [st,at([{opacity:0,transform:'rotate(-9deg) scale(2)'},{opacity:1,transform:'rotate(-11deg) scale(.96)',offset:.75},{opacity:1,transform:'rotate(-9deg) scale(1)'}],980,D),D,'cubic-bezier(.5,0,.6,1)']];
  var outA=[[cov,[{transform:'none',opacity:1},{transform:'rotateY(-80deg)',opacity:1,offset:.7},{transform:'rotateY(-108deg)',opacity:0}],720,'cubic-bezier(.55,0,.35,1)'],
    [inner,at([{transform:'none'},{transform:'translateY(-115vh) rotate(3deg)'}],380,1050),1050,'cubic-bezier(.55,0,.4,1)'],
    [desk,at([{opacity:1},{opacity:0}],600,1050),1050,'ease-out'],[lamp,at([{opacity:1},{opacity:0}],500,1050),1050,'ease-out']];
  return seq(inA,fn,outA);};

/* Досье: папка, три листа падают веером, фото со скрепкой и штамп */
WIPES.folder=function(W,fn){var H=innerHeight,Wd=innerWidth,D=1300;
  var bg=dv(W,'inset:0;tex:grain;background:radial-gradient(ellipse at 50% 40%,#2C251C,#100D0A 70%);opacity:0');
  var fw=Math.min(Wd*.84,700),fh=Math.min(H*.78,860),fx=(Wd-fw)/2,fy=(H-fh)/2+8;
  var back=dv(W,'left:'+(fx-16)+'px;top:'+(fy-8)+'px;width:'+(fw+32)+'px;height:'+(fh+22)+'px;tex:card;background:repeating-linear-gradient(115deg,rgba(255,255,255,.04) 0 2px,rgba(0,0,0,.03) 2px 5px),linear-gradient(160deg,#D2B57E,#B8975F);border-radius:6px;box-shadow:0 22px 50px rgba(0,0,0,.65);transform:translateY('+H+'px)');
  dv(back,'left:6%;top:-25px;width:28%;height:27px;background:#CBAC74;border-radius:9px 9px 0 0');
  var rot=[-3.5,2.6,-1],sheets=[],st=null,inA=[[bg,[{opacity:0},{opacity:1}],320,'ease-in'],[back,[{transform:'translateY('+H+'px)'},{transform:'translateY(-8px)',offset:.8},{transform:'none'}],560,'cubic-bezier(.3,.7,.3,1)']];
  for(var i=0;i<3;i++){var s=dv(W,'left:'+fx+'px;top:'+fy+'px;width:'+fw+'px;height:'+fh+'px;tex:paper;background:linear-gradient(180deg,#F5EFE0,#E8DFC9);box-shadow:0 8px 18px rgba(0,0,0,.35);transform:translateY('+(-H*1.15).toFixed(0)+'px) rotate('+(rot[i]*4)+'deg)');
    dv(s,'left:9%;top:7%;width:46%;height:15px;background:#2B2620');dv(s,'left:9%;top:calc(7% + 24px);width:30%;height:6px;background:rgba(43,38,32,.45)');
    var y0=i===2?46:20;for(var k=0;k<14;k++){var yy=y0+k*3.8;if(yy>90)break;dv(s,'left:9%;top:'+yy+'%;height:5px;width:'+rn(52,82).toFixed(0)+'%;background:rgba(43,38,32,'+rn(.3,.6).toFixed(2)+')');}
    if(i===2){var ph=dv(s,'right:9%;top:6%;width:27%;height:33%;background:linear-gradient(180deg,#8E8A82,#5C5852);box-shadow:inset 0 0 0 7px #F5EFE0,0 4px 8px rgba(0,0,0,.35);transform:rotate(3deg)');
      dv(ph,'left:50%;top:22%;width:30%;height:28%;margin-left:-15%;border-radius:50%;background:#34312C');dv(ph,'left:22%;right:22%;bottom:7px;height:32%;border-radius:50% 50% 0 0;background:#34312C');
      dv(ph,'right:16%;top:-17px;width:16px;height:54px;border:3px solid #A9B1BA;border-radius:9px');
      st=dv(s,'left:9%;top:23%;width:30%;height:44px;border:3px solid rgba(150,25,25,.8);border-radius:4px;transform:rotate(-6deg);opacity:0');dv(st,'left:10%;right:10%;top:15px;height:6px;background:rgba(150,25,25,.8)');}
    sheets.push(s);
    inA.push([s,at([{transform:'translateY('+(-H*1.15).toFixed(0)+'px) rotate('+(rot[i]*4)+'deg)'},{transform:'translateY(8px) rotate('+rot[i]+'deg)',offset:.8},{transform:'rotate('+rot[i]+'deg)'}],320+i*170,880+i*170),880+i*170,'cubic-bezier(.35,.6,.3,1)']);}
  inA.push([st,at([{opacity:0,transform:'rotate(-6deg) scale(1.9)'},{opacity:1,transform:'rotate(-6deg) scale(1)'}],1080,D),D,'cubic-bezier(.5,0,.6,1)']);
  var outA=[];sheets.slice().reverse().forEach(function(s,j){var i=2-j;outA.push([s,at([{transform:'rotate('+rot[i]+'deg)'},{transform:'translate('+((i-1)*90)+'px,-118vh) rotate('+(rot[i]*5)+'deg)'}],j*90,620+j*90),620+j*90,'cubic-bezier(.55,0,.5,1)']);});
  outA.push([back,at([{transform:'none'},{transform:'translateY(-120vh)'}],260,900),900,'cubic-bezier(.55,0,.5,1)'],[bg,at([{opacity:1},{opacity:0}],420,900),900,'ease-out']);
  return seq(inA,fn,outA);};

/* Летопись: чернильная клякса с брызгами, золотой росчерк пера, чернила уходят в точку */
WIPES.ink=function(W,fn,pt){var Wd=innerWidth,H=innerHeight,x=pt?pt.x:Wd/2,y=pt?pt.y:H/2,R=Math.hypot(Math.max(x,Wd-x),Math.max(y,H-y))+40,D=1300;
  var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('width',Wd);svg.setAttribute('height',H);svg.style.cssText='position:absolute;left:0;top:0;overflow:visible';W.appendChild(svg);
  function circ(cx,cy,r,f){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',cx.toFixed(0));c.setAttribute('cy',cy.toFixed(0));c.setAttribute('r',r.toFixed(0));c.setAttribute('fill',f||'#20150C');c.style.transformBox='fill-box';c.style.transformOrigin='center';c.style.transform='scale(0)';svg.appendChild(c);return c;}
  var inA=[];
  for(var i=0;i<26;i++){var a=rn(0,6.28),d=rn(70,Math.max(Wd,H)*.55),c=circ(x+Math.cos(a)*d,y+Math.sin(a)*d,rn(3,15));inA.push([c,at([{transform:'scale(0)'},{transform:'scale(1.25)',offset:.7},{transform:'scale(1)'}],rn(60,420),900),900,'ease-out']);}
  for(var j=0;j<12;j++){var a2=rn(0,6.28),d2=rn(30,R*.45),c2=circ(x+Math.cos(a2)*d2,y+Math.sin(a2)*d2,rn(40,R*.4));inA.push([c2,at([{transform:'scale(0)'},{transform:'scale(1)'}],rn(80,300),950),950,'cubic-bezier(.4,0,.3,1)']);}
  var main=circ(x,y,R);inA.push([main,[{transform:'scale(0)'},{transform:'scale(.07)',offset:.15},{transform:'scale(1)'}],950,'cubic-bezier(.55,0,.35,1)']);
  var sheen=dv(W,'inset:0;tex:ink;background:radial-gradient(circle at '+(x-70).toFixed(0)+'px '+(y-70).toFixed(0)+'px,rgba(255,236,200,.12),rgba(255,236,200,0) 38%),repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0 1px,transparent 1px 4px);opacity:0');
  inA.push([sheen,at([{opacity:0},{opacity:1}],700,D),D,'ease-out']);
  var Lw=Math.min(Wd*.72,640),sx=(Wd-Lw)/2,cy=H/2,amp=[-22,30,-16,26,-30,18,-24,12],dd='M'+sx.toFixed(0)+' '+cy;
  for(var k=1;k<=8;k++){var px=sx+Lw*k/8;dd+=' Q'+(px-Lw/16).toFixed(0)+' '+(cy+amp[k-1])+' '+px.toFixed(0)+' '+cy;}
  dd+=' C'+(sx+Lw+40).toFixed(0)+' '+(cy-30)+' '+(sx+Lw+10).toFixed(0)+' '+(cy-52)+' '+(sx+Lw-12).toFixed(0)+' '+(cy-26);
  var fl=document.createElementNS(NS,'path');fl.setAttribute('d',dd);fl.setAttribute('fill','none');fl.setAttribute('stroke','#D2AE5E');fl.setAttribute('stroke-width','2.6');fl.setAttribute('stroke-linecap','round');fl.setAttribute('pathLength','1');
  fl.style.strokeDasharray='1 1';fl.style.strokeDashoffset='1';fl.style.filter='drop-shadow(0 0 4px rgba(210,174,94,.7))';svg.appendChild(fl);
  inA.push([fl,at([{strokeDashoffset:1},{strokeDashoffset:0}],760,D),D,'cubic-bezier(.45,0,.3,1)']);
  var outA=[[fl,[{opacity:1},{opacity:0}],220,'ease-out'],[sheen,[{opacity:1},{opacity:0}],260,'ease-out'],
    [svg,[{clipPath:'circle('+R.toFixed(0)+'px at '+x.toFixed(0)+'px '+y.toFixed(0)+'px)'},{clipPath:'circle(0px at '+x.toFixed(0)+'px '+y.toFixed(0)+'px)'}],820,'cubic-bezier(.6,0,.4,1)']];
  return seq(inA,fn,outA);};

/* Витрина: бархатные створки с золотой кантовкой, прожектор, подушка, блик по стеклу */
WIPES.vitrine=function(W,fn){var D=1450;
  var vel='radial-gradient(ellipse at 50% 120%,rgba(130,24,46,.4),rgba(0,0,0,0) 60%),repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 1px,rgba(0,0,0,.05) 1px 3px),#1A060C';
  var t=dv(W,'left:0;right:0;top:0;height:51vh;tex:velvet;background:'+vel+';box-shadow:inset 0 -2px 0 #D9B65C,inset 0 -9px 0 #1A060C,inset 0 -10px 0 rgba(217,182,92,.55),0 8px 20px rgba(0,0,0,.6);transform:translateY(-100%)');
  var b=dv(W,'left:0;right:0;bottom:0;height:51vh;tex:velvet;background:'+vel+';box-shadow:inset 0 2px 0 #D9B65C,inset 0 9px 0 #1A060C,inset 0 10px 0 rgba(217,182,92,.55),0 -8px 20px rgba(0,0,0,.6);transform:translateY(100%)');
  var spot=dv(W,'left:50%;top:0;width:70vw;margin-left:-35vw;height:100vh;background:linear-gradient(180deg,rgba(255,236,190,.3),rgba(255,236,190,.06) 75%,rgba(255,236,190,0));clip-path:polygon(44% 0,56% 0,80% 100%,20% 100%);opacity:0');
  var pool=dv(W,'left:50%;top:50%;width:380px;height:90px;margin:66px 0 0 -190px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,226,160,.28),rgba(255,226,160,0) 70%);opacity:0');
  var cush=dv(W,'left:50%;top:50%;width:210px;height:48px;margin:60px 0 0 -105px;border-radius:50%;tex:velvet;background:radial-gradient(ellipse at 50% 32%,#8A1C36,#3A0814 72%);box-shadow:0 10px 18px rgba(0,0,0,.65),inset 0 -4px 8px rgba(0,0,0,.4);opacity:0');
  var g=glyph(W,W.dataset.glyph||'sparrow','#DDBB62');g.style.setProperty('--gd','560ms');
  var gl=dv(W,'left:0;top:-20vh;width:24vw;height:140vh;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14) 42%,rgba(255,255,255,.34) 50%,rgba(255,255,255,.14) 58%,rgba(255,255,255,0));transform:translateX(-40vw) skewX(-18deg)');
  var cl='cubic-bezier(.6,0,.4,1)',inA=[[t,[{transform:'translateY(-100%)'},{transform:'translateY(1.5%)',offset:.85},{transform:'none'}],520,cl],[b,[{transform:'translateY(100%)'},{transform:'translateY(-1.5%)',offset:.85},{transform:'none'}],520,cl],
    [spot,at([{opacity:0},{opacity:.7,offset:.4},{opacity:.3,offset:.55},{opacity:1}],480,D),D,'linear'],[pool,at([{opacity:0},{opacity:1}],520,D),D,'ease-out'],
    [cush,at([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],460,900),900,'ease-out'],
    [g,at([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'none'}],520,1000),1000,'ease-out'],
    [gl,at([{transform:'translateX(-40vw) skewX(-18deg)'},{transform:'translateX(130vw) skewX(-18deg)'}],860,D),D,'cubic-bezier(.45,0,.35,1)']];
  var outA=[[g,[{opacity:1},{opacity:0}],520,'ease-in-out'],[cush,[{opacity:1},{opacity:0}],220,'ease-out'],[pool,[{opacity:1},{opacity:0}],220,'ease-out'],[spot,[{opacity:1},{opacity:0}],260,'ease-out'],
    [t,at([{transform:'none'},{transform:'translateY(-100%)'}],140,700),700,cl],[b,at([{transform:'none'},{transform:'translateY(100%)'}],140,700),700,cl]];
  return seq(inA,fn,outA);};

/* Геральдика: золотое древко, полотно с вышитой каймой и кистью, знак проступает вышивкой */
WIPES.banner=function(W,fn){var c=W.dataset.crest||'#8E3BC4',H=innerHeight,Wd=innerWidth,D=1350;
  var bw=Math.min(Wd*.88,760),bx=(Wd-bw)/2,bh=H*1.02,NS='http://www.w3.org/2000/svg';
  var back=dv(W,'inset:0;tex:grain;background:radial-gradient(ellipse at 50% 40%,#1B1418,#07050A 75%);opacity:0');
  var ban=dv(W,'left:'+bx.toFixed(0)+'px;top:0;width:'+bw.toFixed(0)+'px;height:'+bh.toFixed(0)+'px;transform-origin:50% 0;transform:translateY('+(-bh-80).toFixed(0)+'px);filter:drop-shadow(0 14px 22px rgba(0,0,0,.7))');
  var cloth=dv(ban,'inset:0;tex:weave;clip-path:polygon(0 0,100% 0,100% 84%,50% 100%,0 84%);background:linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,.12) 16%,rgba(255,255,255,.07) 30%,rgba(0,0,0,.22) 46%,rgba(255,255,255,.06) 62%,rgba(0,0,0,.26) 80%,rgba(0,0,0,.6)),repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,rgba(0,0,0,.06) 1px 3px),'+c);
  var svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;overflow:visible';
  svg.innerHTML='<path d="M4.5 0 V82.3 L50 96.4 L95.5 82.3 V0" fill="none" stroke="#E2C266" stroke-width="2.2" vector-effect="non-scaling-stroke"/><path d="M7 0 V80.8 L50 94 L93 80.8 V0" fill="none" stroke="#E2C266" stroke-opacity=".55" stroke-width="1" vector-effect="non-scaling-stroke"/>'+
    '<path d="M0 84 L50 100 L100 84" fill="none" stroke="#C9A44C" stroke-width="7" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>';
  ban.appendChild(svg);
  var cord=dv(ban,'left:50%;top:100%;width:2px;height:16px;margin-left:-1px;background:#B68C34');
  var tas=dv(ban,'left:50%;top:calc(100% + 14px);width:18px;height:50px;margin-left:-9px;background:repeating-linear-gradient(90deg,#F0D27A 0 2px,#A8812C 2px 4px);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);border-top:8px solid #D9B65C');
  var rod=dv(W,'left:'+(bx-34).toFixed(0)+'px;width:'+(bw+68).toFixed(0)+'px;top:-2px;height:16px;border-radius:8px;tex:metal;background:linear-gradient(180deg,#F5DC94,#B68C34 55%,#6E5016);box-shadow:0 5px 10px rgba(0,0,0,.6);transform:translateY(-44px)');
  dv(rod,'left:-16px;top:-7px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFEBB0,#B68C34 60%,#5A3F10)');dv(rod,'right:-16px;top:-7px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FFEBB0,#B68C34 60%,#5A3F10)');
  var gn=W.dataset.glyph||'crown',g=glyph(W,gn,'#EBCB70','#0E0A0C',190);ban.appendChild(g);g.style.top='42%';g.style.opacity=1;g.style.setProperty('--gd','640ms');
  var inA=[[back,[{opacity:0},{opacity:1}],320,'ease-in'],[rod,[{transform:'translateY(-44px)'},{transform:'none'}],260,'cubic-bezier(.3,.7,.3,1)'],
    [ban,at([{transform:'translateY('+(-bh-80).toFixed(0)+'px) rotate(0deg)'},{transform:'translateY(16px) rotate(.9deg)',offset:.62},{transform:'translateY(-5px) rotate(-.55deg)',offset:.82},{transform:'none'}],140,1060),1060,'cubic-bezier(.5,0,.3,1)'],
    [cloth,[{backgroundPosition:'0 0,0 0,0 0'},{backgroundPosition:(bw*.35).toFixed(0)+'px 0,0 0,0 0'}],D,'ease-in-out'],
    [tas,at([{transform:'rotate(0deg)'},{transform:'rotate(9deg)',offset:.35},{transform:'rotate(-6deg)',offset:.65},{transform:'rotate(0deg)'}],700,D),D,'ease-in-out']];
  var outA=[[ban,[{transform:'none'},{transform:'translateY(12px) rotate(-.4deg)',offset:.16},{transform:'translateY('+(-bh-80).toFixed(0)+'px) rotate(.7deg)'}],700,'cubic-bezier(.6,0,.6,1)'],
    [rod,at([{transform:'none'},{transform:'translateY(-44px)'}],520,820),820,'ease-in'],[back,at([{opacity:1},{opacity:0}],300,820),820,'ease-out']];
  return seq(inA,fn,outA);};

/* Справочник: доска с сеткой, весы проступают гравюрой, пять точек наливаются золотом */
WIPES.dots=function(W,fn){var D=1350;
  var bg=dv(W,'inset:0;tex:slate;background:radial-gradient(ellipse at 50% 45%,#17211F,#0A0F0E 70%,#050707);opacity:0');
  var grid=dv(W,'inset:0;background:repeating-linear-gradient(0deg,rgba(201,164,92,.07) 0 1px,transparent 1px 32px),repeating-linear-gradient(90deg,rgba(201,164,92,.07) 0 1px,transparent 1px 32px);opacity:0');
  var g=glyph(W,'scales','#C9A45C',null,172);g.style.marginTop='-150px';g.style.setProperty('--gd','260ms');
  var rule=dv(W,'left:50%;top:calc(50% + 34px);width:280px;margin-left:-140px;height:1px;background:linear-gradient(90deg,rgba(201,164,92,0),#D9B65C,rgba(201,164,92,0));transform:scaleX(0)');
  var inA=[[bg,[{opacity:0},{opacity:1}],260,'ease-in'],[grid,[{opacity:0,transform:'scale(1.06)'},{opacity:1,transform:'none'}],700,'ease-out'],
    [g,at([{opacity:0},{opacity:1}],200,600),600,'ease-out'],[rule,at([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],320,900),900,'cubic-bezier(.5,0,.3,1)']],outA=[];
  for(var i=0;i<5;i++){var d=dv(W,'left:calc(50% + '+((i-2)*44-13)+'px);top:calc(50% + 54px);width:26px;height:26px;border-radius:50%;border:2px solid #C9A45C;box-shadow:inset 0 2px 5px rgba(0,0,0,.8),0 0 0 3px rgba(201,164,92,.08);opacity:0');
    var f=dv(d,'left:3px;top:3px;right:3px;bottom:3px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFEDB2,#DDBA60 45%,#8E6A24);box-shadow:0 0 14px rgba(235,195,95,.75);transform:scale(0)');
    inA.push([d,at([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],380+i*60,900),900,'ease-out']);
    inA.push([f,at([{transform:'scale(0)'},{transform:'scale(1.3)',offset:.65},{transform:'scale(1)'}],700+i*120,D),D,'ease-out']);
    outA.push([d,at([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-30px)'}],i*50,520+i*50),520+i*50,'ease-in']);}
  outA.push([g,[{opacity:1},{opacity:0}],520,'ease-in-out'],[rule,[{opacity:1},{opacity:0}],260,'ease-out'],[grid,at([{opacity:1},{opacity:0}],200,760),760,'ease-out'],[bg,at([{opacity:1},{opacity:0}],320,760),760,'ease-out']);
  return seq(inA,fn,outA);};

/* Галерея: кисть прописывает мазки по холсту, с брызгами; вихрь красного неба, рама проступает */
WIPES.brush=function(W,fn){var H=innerHeight,Wd=innerWidth,cols=['#2A0B0E','#7A0E14','#B3261E','#4A0A10','#1A0708','#8E1A16'],inA=[],outA=[],D=1650;
  var canv=dv(W,'inset:0;tex:canvas;background:#1A0D0B;opacity:0');inA.push([canv,[{opacity:0},{opacity:1}],380,'ease-out']);
  var n=6,MK='linear-gradient(90deg,transparent 0,transparent 31%,#000 35.5%,#000 64%,transparent 68.5%,transparent 100%)';
  for(var i=0;i<n;i++){var h=H/n+H*.17,top=i*H/n-H*.085,dir=i%2?-1:1,rot=rn(-3,3).toFixed(1),dl=i*150,dur=820;
    var pts=['0% 8%'];for(var k=1;k<40;k++)pts.push((k*2.5)+'% '+rn(2,11).toFixed(1)+'%');pts.push('100% 8%','100% 92%');for(var q=39;q>0;q--)pts.push((q*2.5)+'% '+rn(89,98).toFixed(1)+'%');pts.push('0% 92%');
    var s=dv(W,'left:-10vw;width:120vw;top:'+top.toFixed(0)+'px;height:'+h.toFixed(0)+'px;tex:canvas;transform:rotate('+rot+'deg);clip-path:polygon('+pts.join(',')+');'+
      'background:linear-gradient(180deg,rgba(0,0,0,.35),rgba(255,255,255,.08) 22%,rgba(255,255,255,0) 40%,rgba(0,0,0,.18) 70%,rgba(0,0,0,.4)),'+cols[i]+';'+
      '-webkit-mask-image:'+MK+';mask-image:'+MK+';-webkit-mask-size:300% 100%;mask-size:300% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:'+(dir>0?'100%':'0%')+' 0;mask-position:'+(dir>0?'100%':'0%')+' 0');
    var p0=dir>0?'100% 0':'0% 0',p1='50% 0',p2=dir>0?'0% 0':'100% 0';
    inA.push([s,at([{WebkitMaskPosition:p0,maskPosition:p0},{WebkitMaskPosition:p1,maskPosition:p1}],dl,dl+dur),dl+dur,'cubic-bezier(.45,0,.3,1)']);
    for(var j=0;j<5;j++){var fx=rn(.1,.9),x=dir>0?Wd*fx:Wd*(1-fx),y=top+(Math.random()<.5?rn(-25,0):h+rn(0,25)),z=rn(3,9);
      var sp=dv(W,'left:'+x.toFixed(0)+'px;top:'+y.toFixed(0)+'px;width:'+z.toFixed(0)+'px;height:'+z.toFixed(0)+'px;border-radius:50%;background:'+cols[i]+';opacity:0;transform:scale(0)');
      inA.push([sp,at([{opacity:0,transform:'scale(0)'},{opacity:1,transform:'scale(1.3)',offset:.5},{opacity:1,transform:'scale(1)'}],dl+dur*.45*(fx+.4),dl+dur+200),dl+dur+200,'ease-out']);outA.push([sp,[{opacity:1},{opacity:0}],400,'ease-out']);}
    outA.push([s,at([{WebkitMaskPosition:p1,maskPosition:p1},{WebkitMaskPosition:p2,maskPosition:p2}],(n-1-i)*90,(n-1-i)*90+760),(n-1-i)*90+760,'cubic-bezier(.5,0,.4,1)']);}
  var sw=dv(W,'left:50%;top:50%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(200,40,30,0) 0 9deg,rgba(200,40,30,.38) 14deg,rgba(80,10,14,0) 22deg);-webkit-mask-image:radial-gradient(circle,#000 20%,transparent 62%);mask-image:radial-gradient(circle,#000 20%,transparent 62%);opacity:0');
  var g=glyph(W,W.dataset.glyph||'frame','#DDB65C','#120607',176);g.style.setProperty('--gd','1050ms');
  inA.push([sw,at([{opacity:0,transform:'rotate(0deg)'},{opacity:1,transform:'rotate(35deg)'}],900,D),D,'ease-out'],[g,at([{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'none'}],1000,D+150),D+150,'ease-out']);
  outA.push([sw,[{opacity:1},{opacity:0}],420,'ease-in-out'],[g,[{opacity:1},{opacity:0}],520,'ease-in-out'],[canv,at([{opacity:1},{opacity:0}],400,1100),1100,'ease-out']);
  return seq(inA,fn,outA);};

/* Гримуар: кожаный переплёт с тиснением и застёжкой, свеча, книга раскрывается светом */
WIPES.page=function(W,fn){W.style.perspective='1800px';var H=innerHeight,Wd=innerWidth,D=1350;
  var bg=dv(W,'inset:0;tex:grain;background:radial-gradient(ellipse at 50% 60%,#2C1A0D,#0E0805 70%);opacity:0');
  var cw=Math.min(Wd*.8,620),ch=Math.min(H*.84,860),cx=(Wd-cw)/2,cy=(H-ch)/2;
  var pg=dv(W,'left:'+cx+'px;top:'+cy+'px;width:'+cw+'px;height:'+ch+'px;tex:parch;background:radial-gradient(ellipse at 40% 40%,#F7EBCF,#DCC59A 80%);box-shadow:0 0 70px rgba(255,200,120,.45);opacity:0');
  dv(pg,'left:11%;right:11%;top:10%;bottom:10%;background:repeating-linear-gradient(180deg,transparent 0 15px,rgba(80,50,20,.28) 15px 17px,transparent 17px 24px)');
  var cov=dv(W,'left:'+cx+'px;top:'+cy+'px;width:'+cw+'px;height:'+ch+'px;tex:leather;border-radius:4px 12px 12px 4px;transform-origin:0 50%;transform:rotateY(-110deg);'+
    'background:repeating-radial-gradient(circle at 30% 20%,rgba(255,255,255,.025) 0 2px,rgba(0,0,0,.06) 2px 4px),linear-gradient(135deg,#5E3519,#3A1E0C 60%,#2A1408);'+
    'box-shadow:inset 0 0 0 12px rgba(0,0,0,.25),inset 0 0 0 14px #B8923E,inset 0 0 0 22px rgba(0,0,0,.22),inset 0 0 0 23px rgba(184,146,62,.6),inset 16px 0 30px rgba(0,0,0,.55),0 24px 54px rgba(0,0,0,.75)');
  ['left:30px;top:30px','right:30px;top:30px','left:30px;bottom:30px','right:30px;bottom:30px'].forEach(function(p){dv(cov,p+';width:18px;height:18px;background:#C9A44C;transform:rotate(45deg);box-shadow:inset 0 0 0 4px #6E5016');});
  dv(cov,'left:0;top:0;bottom:0;width:28px;background:linear-gradient(90deg,#160904,rgba(0,0,0,0))');
  var g=glyph(W,'book','#D9B65C','#24110A',178);cov.appendChild(g);g.style.opacity=1;g.style.setProperty('--gd','760ms');
  var cl=dv(W,'left:'+(cx+cw-26)+'px;top:'+(cy+ch/2-27)+'px;width:62px;height:54px;border-radius:8px;background:linear-gradient(180deg,#F5DC94,#B68C34 55%,#6E5016);box-shadow:0 4px 8px rgba(0,0,0,.6);opacity:0');
  dv(cl,'right:11px;top:16px;width:22px;height:22px;border-radius:50%;border:3px solid #5A3F10;box-sizing:border-box');
  var light=dv(W,'left:-15vw;bottom:-25vh;width:80vw;height:80vh;border-radius:50%;background:radial-gradient(circle,rgba(255,170,80,.3),rgba(255,170,80,0) 64%);opacity:0');
  var inA=[[bg,[{opacity:0},{opacity:1}],320,'ease-in'],[light,[{opacity:0},{opacity:1},{opacity:.6},{opacity:.95},{opacity:.7},{opacity:1}],D,'linear'],
    [cov,at([{transform:'rotateY(-110deg)'},{transform:'rotateY(7deg)',offset:.78},{transform:'rotateY(0deg)'}],100,880),880,'cubic-bezier(.4,0,.2,1)'],
    [pg,[{opacity:0},{opacity:0,offset:.95},{opacity:1}],880,'linear'],[cl,at([{opacity:0,transform:'translateX(30px)'},{opacity:1,transform:'none'}],820,1100),1100,'ease-out']];
  var outA=[[cl,[{opacity:1,transform:'none'},{opacity:0,transform:'translateX(40px)'}],260,'ease-in'],
    [cov,at([{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(-85deg)',opacity:1,offset:.7},{transform:'rotateY(-118deg)',opacity:0}],180,880),880,'cubic-bezier(.55,0,.35,1)'],
    [pg,at([{opacity:1,filter:'brightness(1)'},{opacity:1,filter:'brightness(1.25)',offset:.4},{opacity:0,filter:'brightness(1.5)'}],520,1100),1100,'ease-out'],
    [bg,at([{opacity:1},{opacity:0}],600,1100),1100,'ease-out'],[light,at([{opacity:1},{opacity:0}],500,1100),1100,'ease-out']];
  return seq(inA,fn,outA);};

/* Бродячий кот: удар брызг сверху, вязкие потёки с утолщениями, лужа поднимается с волной и бликами, уходит вниз */
WIPES.blood=function(W,fn){var H=innerHeight,Wd=innerWidth,NS='http://www.w3.org/2000/svg',D=1350,inA=[],outA=[],parts=[];
  var n=Math.max(10,Math.min(22,Math.round(Wd/70)));
  var sv=document.createElementNS(NS,'svg');sv.setAttribute('width',Wd);sv.setAttribute('height',H);sv.style.cssText='position:absolute;left:0;top:0;overflow:visible';W.appendChild(sv);
  sv.innerHTML='<defs><linearGradient id="bdS" x1="0" x2="1"><stop offset="0" stop-color="#3E0308"/><stop offset=".35" stop-color="#8E0F1A"/><stop offset=".5" stop-color="#D23C48"/><stop offset=".62" stop-color="#8E0F1A"/><stop offset="1" stop-color="#3E0308"/></linearGradient>'+
    '<radialGradient id="bdB" cx=".38" cy=".38" r=".7"><stop offset="0" stop-color="#F07A84"/><stop offset=".18" stop-color="#B0141F"/><stop offset="1" stop-color="#4A040A"/></radialGradient></defs>';
  /* полоса удара: неровный край */
  var tp='M0 0 H'+Wd+' V'+(H*.05).toFixed(0);for(var k=24;k>=0;k--){var x=k*Wd/24;tp+=' Q'+(x+Wd/48).toFixed(0)+' '+(H*.05+rn(-6,26)).toFixed(0)+' '+x.toFixed(0)+' '+(H*.05+rn(0,14)).toFixed(0);}tp+=' Z';
  var top=document.createElementNS(NS,'path');top.setAttribute('d',tp);top.setAttribute('fill','url(#bdS)');top.style.transformOrigin='50% 0';top.style.transform='scaleY(0)';sv.appendChild(top);
  inA.push([top,[{transform:'scaleY(0)'},{transform:'scaleY(1.15)',offset:.7},{transform:'scaleY(1)'}],320,'ease-out']);
  /* брызги удара */
  for(var s=0;s<26;s++){var bx=rn(0,Wd),by=rn(H*.04,H*.26),br=rn(2,9),b=document.createElementNS(NS,'ellipse');b.setAttribute('cx',bx.toFixed(0));b.setAttribute('cy',by.toFixed(0));b.setAttribute('rx',br.toFixed(1));b.setAttribute('ry',(br*rn(.6,1.4)).toFixed(1));b.setAttribute('fill','url(#bdB)');
    b.style.transformBox='fill-box';b.style.transformOrigin='center';b.style.transform='scale(0)';sv.appendChild(b);parts.push(b);
    inA.push([b,at([{transform:'scale(0)'},{transform:'scale(1.3)',offset:.6},{transform:'scale(1)'}],rn(120,320),700),700,'ease-out']);}
  /* потёки: сужающееся тело и капля на конце, текут рывками */
  for(var i=0;i<n;i++){var x0=(i+.5)*Wd/n+rn(-.35,.35)*Wd/n,w=rn(6,15),len=H*rn(.28,.86),dl=rn(160,460),wb=rn(-6,6);
    var d='M'+(x0-w/2).toFixed(1)+' 0 C'+(x0-w/2).toFixed(1)+' '+(len*.4).toFixed(0)+' '+(x0-w*.25+wb).toFixed(1)+' '+(len*.7).toFixed(0)+' '+(x0-w*.22+wb).toFixed(1)+' '+(len-w).toFixed(0)+
      ' L'+(x0+w*.22+wb).toFixed(1)+' '+(len-w).toFixed(0)+' C'+(x0+w*.25+wb).toFixed(1)+' '+(len*.7).toFixed(0)+' '+(x0+w/2).toFixed(1)+' '+(len*.4).toFixed(0)+' '+(x0+w/2).toFixed(1)+' 0 Z';
    var g=document.createElementNS(NS,'g');g.style.transformOrigin='0 0';g.style.transform='scaleY(0)';
    var st=document.createElementNS(NS,'path');st.setAttribute('d',d);st.setAttribute('fill','url(#bdS)');g.appendChild(st);sv.appendChild(g);
    var hd=document.createElementNS(NS,'ellipse');hd.setAttribute('cx',(x0+wb*.9).toFixed(1));hd.setAttribute('cy','0');hd.setAttribute('rx',(w*.62).toFixed(1));hd.setAttribute('ry',(w*.82).toFixed(1));hd.setAttribute('fill','url(#bdB)');sv.appendChild(hd);
    var kf=[{transform:'scaleY(0)'},{transform:'scaleY(.38)',offset:.3},{transform:'scaleY(.44)',offset:.46},{transform:'scaleY(.82)',offset:.7},{transform:'scaleY(.86)',offset:.82},{transform:'scaleY(1)'}];
    var hk=kf.map(function(f){var y=parseFloat(/[\d.]+/.exec(f.transform)[0])*(len-w*.4),o={transform:'translateY('+y.toFixed(0)+'px) scale('+(.6+.4*Math.min(1,y/len*2)).toFixed(2)+')'};if(f.offset!=null)o.offset=f.offset;return o;});
    inA.push([g,at(kf,dl,D),D,'ease-in-out'],[hd,at(hk,dl,D),D,'ease-in-out']);parts.push(g,hd);}
  /* лужа с волной и бликами */
  var flood=dv(W,'left:-2vw;right:-2vw;bottom:0;height:0;tex:gloss;background:linear-gradient(180deg,#9A1320 0,#6E0912 18%,#45040A 55%,#260205)');
  var wv=document.createElementNS(NS,'svg');wv.setAttribute('viewBox','0 0 400 40');wv.setAttribute('preserveAspectRatio','none');wv.style.cssText='position:absolute;left:0;top:-26px;width:200%;height:30px;overflow:visible';
  var wd='M0 40 V22';for(var q=0;q<=16;q++)wd+=' Q'+(q*25+12.5)+' '+(q%2?30:12)+' '+(q*25+25)+' 22';wd+=' V40 Z';
  wv.innerHTML='<path d="'+wd+'" fill="#9A1320"/><path d="'+wd.replace(/ V40 Z$/,'')+'" fill="none" stroke="rgba(255,150,160,.55)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>';flood.appendChild(wv);
  var spec=dv(flood,'left:0;right:0;top:4px;height:40%;background:repeating-linear-gradient(90deg,rgba(255,170,175,0) 0 60px,rgba(255,170,175,.12) 90px,rgba(255,170,175,0) 130px);filter:blur(3px)');
  inA.push([flood,[{height:'0vh'},{height:'0vh',offset:.42},{height:'116vh'}],D,'cubic-bezier(.5,0,.6,1)'],[wv,[{transform:'translateX(0)'},{transform:'translateX(-25%)'}],D,'linear'],[spec,[{transform:'translateX(-60px)'},{transform:'translateX(60px)'}],D,'ease-in-out']);
  outA.push([flood,[{transform:'none'},{transform:'translateY(106%)'}],820,'cubic-bezier(.6,0,.6,1)'],[wv,[{transform:'translateX(-25%)'},{transform:'translateX(-50%)'}],820,'linear'],
    [top,[{transform:'scaleY(1)',opacity:1},{transform:'scaleY(0)',opacity:0}],480,'ease-in']);
  parts.forEach(function(p){outA.push([p,[{opacity:1},{opacity:0}],460,'ease-out']);});
  return seq(inA,fn,outA);};

/* Клеймо Дьявольского пожара: иней прорастает узорами с краёв, лёд заполняет экран, изнутри прожигают огненные трещины, лёд раскалывается на осколки с гранями */
TEX.frost=function(){return {bg:TX('fr',{f:.9,o:3,r:1,g:1,b:1,k:1.4,c:-.52,s:200})+','+TX('fs',{f:'0.02 0.45',o:2,r:.8,g:.9,b:1,k:1.1,c:-.38,s:520,seed:18})+','+TX('fm',{f:.012,o:3,r:.5,g:.65,b:.8,k:1,c:-.35,s:700,seed:19}),op:.75};};
WIPES.ice=function(W,fn){var Wd=innerWidth,H=innerHeight,cx=Wd/2,cy=H*.48,NS='http://www.w3.org/2000/svg',D=1500,inA=[],outA=[];
  var ice='linear-gradient(160deg,#D9ECF7,#A6C8DE 55%,#C6E0F1)';
  var fill=dv(W,'inset:0;tex:frost;background:'+ice+';opacity:0');
  var svg=document.createElementNS(NS,'svg');svg.setAttribute('width',Wd);svg.setAttribute('height',H);svg.style.cssText='position:absolute;left:0;top:0;overflow:visible';W.appendChild(svg);
  svg.innerHTML='<defs><filter id="icG" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  /* иней: ветвящиеся узоры от краёв */
  function fern(x,y,a,L,dep,out){var x2=x+Math.cos(a)*L,y2=y+Math.sin(a)*L;out.push('M'+x.toFixed(0)+' '+y.toFixed(0)+' L'+x2.toFixed(0)+' '+y2.toFixed(0));
    if(dep>0)for(var k=1;k<=3;k++){var t=k/4,bx=x+(x2-x)*t,by=y+(y2-y)*t;fern(bx,by,a+.7,L*.38,dep-1,out);fern(bx,by,a-.7,L*.38,dep-1,out);}}
  var ferns=[],per=2*(Wd+H);for(var f=0;f<18;f++){var u=rn(0,per),x,y,a;if(u<Wd){x=u;y=0;a=Math.PI/2;}else if(u<Wd+H){x=Wd;y=u-Wd;a=Math.PI;}else if(u<2*Wd+H){x=2*Wd+H-u;y=H;a=-Math.PI/2;}else{x=0;y=per-u;a=0;}
    var o=[];fern(x,y,a+rn(-.4,.4),rn(.18,.32)*Math.min(Wd,H),2,o);var p=document.createElementNS(NS,'path');p.setAttribute('d',o.join(' '));p.setAttribute('fill','none');p.setAttribute('stroke','rgba(255,255,255,.75)');p.setAttribute('stroke-width','1.3');p.setAttribute('stroke-linecap','round');
    p.setAttribute('pathLength','1');p.style.strokeDasharray='1 1';p.style.strokeDashoffset='1';svg.appendChild(p);ferns.push(p);inA.push([p,at([{strokeDashoffset:1},{strokeDashoffset:0}],rn(0,200),900),900,'ease-out']);}
  inA.push([fill,[{opacity:0},{opacity:0,offset:.18},{opacity:1,offset:.5},{opacity:1}],D,'ease-in']);
  /* огненное ядро и трещины с ответвлениями */
  var core=dv(W,'left:'+(cx-160)+'px;top:'+(cy-160)+'px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,170,60,.85),rgba(255,90,20,.35) 35%,rgba(255,90,20,0) 70%);mix-blend-mode:screen;opacity:0;transform:scale(.3)');
  inA.push([core,at([{opacity:0,transform:'scale(.3)'},{opacity:1,transform:'scale(1)',offset:.6},{opacity:.7,transform:'scale(.9)',offset:.8},{opacity:1,transform:'scale(1.05)'}],900,D),D,'ease-out']);
  var n=9,pts=[];for(var i=0;i<n;i++){var u2=(i+.3+Math.random()*.4)/n*per,px,py;if(u2<Wd){px=u2;py=0;}else if(u2<Wd+H){px=Wd;py=u2-Wd;}else if(u2<2*Wd+H){px=Wd-(u2-Wd-H);py=H;}else{px=0;py=H-(u2-2*Wd-H);}pts.push([px,py]);}
  var cracks=[];pts.forEach(function(p,i){var d='M'+cx.toFixed(0)+' '+cy.toFixed(0),k=8,br='';for(var j=1;j<=k;j++){var t=j/k,jx=(j<k?rn(-24,24):0),jy=(j<k?rn(-24,24):0),qx=cx+(p[0]-cx)*t+jx,qy=cy+(p[1]-cy)*t+jy;d+=' L'+qx.toFixed(0)+' '+qy.toFixed(0);
      if(j>1&&j<k&&Math.random()<.55){var ang=Math.atan2(p[1]-cy,p[0]-cx)+(Math.random()<.5?.8:-.8),L=rn(30,90);br+=' M'+qx.toFixed(0)+' '+qy.toFixed(0)+' l'+(Math.cos(ang)*L).toFixed(0)+' '+(Math.sin(ang)*L).toFixed(0);}}
    [[d,3.6,'#FF7A1A'],[d,1.2,'#FFE0A0'],[br,1.8,'#FF8A2A']].forEach(function(c,ci){if(!c[0])return;var e=document.createElementNS(NS,'path');e.setAttribute('d',c[0]);e.setAttribute('pathLength','1');e.setAttribute('fill','none');e.setAttribute('stroke',c[2]);e.setAttribute('stroke-width',c[1]);
      e.setAttribute('stroke-linecap','round');if(ci===0)e.setAttribute('filter','url(#icG)');e.style.strokeDasharray='1 1';e.style.strokeDashoffset='1';svg.appendChild(e);cracks.push(e);
      inA.push([e,at([{strokeDashoffset:1},{strokeDashoffset:0}],(ci===2?1220:1020)+i*25,D),D,'cubic-bezier(.3,.6,.4,1)']);});});
  for(var s=0;s<24;s++){var z=rn(2,4),gl=dv(W,'left:'+rn(0,Wd).toFixed(0)+'px;top:'+rn(0,H).toFixed(0)+'px;width:'+z+'px;height:'+z+'px;border-radius:50%;background:#fff;box-shadow:0 0 8px 3px rgba(220,240,255,.9);opacity:0');
    inA.push([gl,at([{opacity:0,transform:'scale(.3)'},{opacity:1,transform:'scale(1.4)',offset:.5},{opacity:.2,transform:'scale(.6)'}],rn(500,1100),D),D,'ease-in-out']);}
  /* осколки: лёд с фактурой, светлая грань, падают с вращением */
  var shards=[];pts.forEach(function(p,i){var q=pts[(i+1)%n],corners=[];
    [[0,0],[Wd,0],[Wd,H],[0,H]].forEach(function(c){var a0=Math.atan2(p[1]-cy,p[0]-cx),a1=Math.atan2(q[1]-cy,q[0]-cx),ac=Math.atan2(c[1]-cy,c[0]-cx),span=(a1-a0+2*Math.PI)%(2*Math.PI),off=(ac-a0+2*Math.PI)%(2*Math.PI);if(off>0&&off<span)corners.push([off,c]);});
    corners.sort(function(a,b){return a[0]-b[0];});
    var poly=[[cx,cy],p].concat(corners.map(function(c){return c[1];})).concat([q]).map(function(v){return v[0].toFixed(1)+'px '+v[1].toFixed(1)+'px';}).join(',');
    var sh=dv(W,'inset:0;tex:frost;background:linear-gradient('+rn(120,200).toFixed(0)+'deg,#E4F2FB,#9EC2DA 60%,#CFE6F4);clip-path:polygon('+poly+');opacity:0');
    dv(sh,'inset:0;background:linear-gradient('+rn(0,360).toFixed(0)+'deg,rgba(255,255,255,.35),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(255,255,255,.25))');
    var mx=((p[0]+q[0])/2-cx),my=((p[1]+q[1])/2-cy),L=Math.hypot(mx,my)||1;sh._dx=mx/L*Wd*.55;sh._dy=my/L*H*.5+H*.45;sh._r=rn(-35,35);shards.push(sh);});
  outA.push([fill,[{opacity:1},{opacity:0,offset:.02},{opacity:0}],820,'linear'],[svg,[{opacity:1},{opacity:0}],320,'ease-out'],[core,[{opacity:1,transform:'scale(1.05)'},{opacity:0,transform:'scale(1.8)'}],420,'ease-out']);
  shards.forEach(function(sh,i){outA.push([sh,[{opacity:1,transform:'none'},{opacity:1,offset:.12,transform:'none'},{opacity:0,transform:'translate('+sh._dx.toFixed(0)+'px,'+sh._dy.toFixed(0)+'px) rotate('+sh._r.toFixed(1)+'deg) scale(.9)'}],820+i*20,'cubic-bezier(.5,0,.8,.6)']);});
  outA=outA.concat(sparks(W,Math.round(Wd/14),900,{x:cx,w:120,y:cy,t:function(){return rn(0,.25);},r0:.15,r1:.45,big:4}));
  return seq(inA,fn,outA);};

/* Анархи: рваный флаг колышется, кулак-гравюра, флаг прогорает снизу с искрами */
WIPES.flag=function(W,fn){var H=innerHeight,Wd=innerWidth,box=dv(W,'inset:0;overflow:hidden;clip-path:inset(0 0 0 0)'),pts=['0 0','100% 0'],n=26;
  for(var i=n;i>=0;i--)pts.push((i*100/n).toFixed(2)+'% '+(i%2?87+Math.random()*4:93+Math.random()*6).toFixed(1)+'%');
  var f=dv(box,'left:-2vw;right:-2vw;top:0;height:114vh;tex:weave;transform:translateY(-114vh);clip-path:polygon('+pts.join(',')+');background:repeating-linear-gradient(90deg,rgba(0,0,0,.16) 0 4px,transparent 4px 70px),linear-gradient(180deg,#B4360A,#E8641A 40%,#F08A2C 78%,#B4360A)');
  var wave=dv(f,'inset:0;background:repeating-linear-gradient(100deg,rgba(0,0,0,.2) 0 50px,rgba(255,235,200,.08) 90px,rgba(0,0,0,.2) 140px)');
  var g=glyph(W,'fist','#F6B866','#1A0A05',196);box.appendChild(g);g.style.setProperty('--gd','480ms');
  var e=flameStrip(W,Wd),FB=e._base;e.style.opacity=0;e.style.transform='translateY(100vh)';
  var tick=dv(W,'width:0;height:0'),D=760,t0=0,DB=D*TSc;
  function burn(now){if(!t0)t0=now;var k=Math.min(1,(now-t0)/DB),y=H*(1-k);
    box.style.clipPath='inset(0 0 '+(k*100).toFixed(2)+'% 0)';e.style.transform='translateY('+(y-FB).toFixed(1)+'px)';e.style.opacity=k<.95?1:(1-k)*20;
    if(k<1)requestAnimationFrame(burn);}
  var inA=[[f,[{transform:'translateY(-114vh)'},{transform:'translateY(1.5vh)',offset:.8},{transform:'none'}],560,'cubic-bezier(.6,0,.4,1)'],
    [wave,[{backgroundPosition:'0 0'},{backgroundPosition:'280px 0'}],1050,'linear'],[g,at([{opacity:0,transform:'scale(.92)'},{opacity:1,transform:'none'}],380,1050),1050,'ease-out']];
  var outA=[[tick,[{opacity:0},{opacity:1}],D+20,'linear']].concat(sparks(W,Math.round(Wd/16),D+200,{t:function(){return rn(.02,.8);},y:function(t){return H*(1-t*1.2);},r0:.05,r1:.18,big:4}));
  return seq(inA,function(){fn();requestAnimationFrame(burn);},outA);};

/* Селена: чёрная кружевная вуаль с фестонами, лунный луч и пылинки */
WIPES.shroud=function(W,fn){var H=innerHeight,Wd=innerWidth,Hh=H*1.32,n=Math.max(14,Math.round(Wd/44)),w=100/n,pts=['0% 0%','100% 0%'],D=1150;
  for(var i=n-1;i>=0;i--)for(var k=0;k<=6;k++)pts.push(((i+1)*w-k*w/6).toFixed(2)+'% '+(95.6+2.6*Math.sin(Math.PI*k/6)).toFixed(2)+'%');
  var d=dv(W,'left:-8vw;right:-8vw;top:0;tex:weave;height:'+Hh.toFixed(0)+'px;transform-origin:50% 0;transform:translateY(-'+Hh.toFixed(0)+'px);clip-path:polygon('+pts.join(',')+');'+
    'background:radial-gradient(circle,rgba(255,255,255,.05) 0 1.5px,transparent 2px) 0 0/13px 13px,repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 8px,rgba(0,0,0,.34) 8px 24px,rgba(255,255,255,.025) 24px 46px,rgba(0,0,0,.2) 46px 62px),linear-gradient(180deg,#0A090B,#161216 55%,#0A090B)');
  dv(d,'left:0;right:0;bottom:0;height:12%;background:radial-gradient(circle,rgba(225,225,240,.2) 0 3px,transparent 3.5px) 0 0/18px 18px,radial-gradient(circle,rgba(225,225,240,.12) 0 6px,transparent 6.5px) 9px 9px/18px 18px;border-top:1px solid rgba(225,225,240,.25)');
  var beam=dv(W,'left:28%;top:-25vh;width:28vw;height:150vh;background:linear-gradient(90deg,rgba(205,218,255,0),rgba(205,218,255,.17) 50%,rgba(205,218,255,0));transform:rotate(16deg);opacity:0');
  var inA=[[d,[{transform:'translateY(-'+Hh.toFixed(0)+'px)'},{transform:'translateY(1.5vh)',offset:.78},{transform:'none'}],600,'cubic-bezier(.55,0,.4,1)'],
    [beam,at([{opacity:0},{opacity:1}],520,D),D,'ease-out']].concat(motes(W,22,D,[Wd*.25,H*.1,Wd*.75,H*.95],'rgba(225,232,255,.85)'));
  var outA=[[beam,[{opacity:1},{opacity:0}],240,'ease-out'],[d,[{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(-60vh) rotate(-1.5deg)',offset:.35},{transform:'translateY(-135vh) rotate(-6deg)'}],760,'cubic-bezier(.5,0,.8,.5)']];
  return seq(inA,fn,outA);};

/* Больница: одно полотно занавески со складками едет по карнизу на кольцах, мерцает лампа */
WIPES.ribbons=function(W,fn){var Wd=innerWidth,H=innerHeight,D=1250,n=16;
  var lamp=dv(W,'left:0;right:0;top:0;height:34vh;background:linear-gradient(180deg,rgba(236,255,246,.6),rgba(236,255,246,0));opacity:0;z-index:3');
  var tube=dv(W,'left:15vw;right:15vw;top:18px;height:5px;border-radius:3px;background:#F4FFF9;box-shadow:0 0 18px 6px rgba(220,255,240,.7);opacity:0;z-index:3');
  var rail=dv(W,'left:0;right:0;top:0;height:12px;tex:metal;background:linear-gradient(180deg,#D3DED8,#93AA9E 60%,#6E8A7D);box-shadow:0 3px 8px rgba(0,0,0,.25);transform:translateY(-14px);z-index:2');
  var fold='linear-gradient(90deg,#8FB0A2 0%,#DCEAE2 18%,#FAFDFB 38%,#EEF6F1 58%,#C3D9CE 80%,#8FB0A2 100%)';
  var cur=dv(W,'left:0;top:8px;height:calc(100vh - 8px);width:7vw;background:'+fold+';background-size:14px 100%;box-shadow:10px 0 26px rgba(0,0,0,.35);transform-origin:0 0');
  var tw=texIn(cur,'weave');tw.style.opacity=.14;
  dv(cur,'left:0;right:0;bottom:0;height:18px;background:rgba(46,139,98,.22);box-shadow:inset 0 2px 0 rgba(46,139,98,.35)');
  dv(cur,'left:0;right:0;bottom:-10px;height:12px;background:radial-gradient(ellipse at 50% 0,rgba(140,175,160,1) 0 45%,rgba(0,0,0,0) 46%) 0 0/40px 12px repeat-x');
  var edge=dv(cur,'right:0;top:0;bottom:0;width:22px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(70,110,95,.35))');
  var rings=[];for(var i=0;i<n;i++)rings.push(dv(cur,'left:'+((i+.5)*100/n).toFixed(2)+'%;top:-12px;width:13px;height:13px;margin-left:-6.5px;border:2px solid #8FA79B;border-radius:50%;box-sizing:border-box;background:rgba(255,255,255,.2)'));
  var E='cubic-bezier(.55,0,.25,1)',inA=[[rail,[{transform:'translateY(-14px)'},{transform:'none'}],220,'ease-out'],
    [cur,at([{width:'7vw',backgroundSize:'14px 100%',transform:'skewX(0deg)'},{width:'60vw',backgroundSize:'46px 100%',transform:'skewX(-2.5deg)',offset:.55},{width:'103vw',backgroundSize:'70px 100%',transform:'skewX(1deg)',offset:.88},{width:'101vw',backgroundSize:'68px 100%',transform:'skewX(0deg)'}],140,1050),1050,E],
    [edge,at([{opacity:1},{opacity:.6}],140,1050),1050,'linear'],
    [lamp,at([{opacity:0},{opacity:.9,offset:.2},{opacity:.15,offset:.32},{opacity:.85,offset:.45},{opacity:.3,offset:.52},{opacity:1}],820,D),D,'linear'],
    [tube,at([{opacity:0},{opacity:1,offset:.2},{opacity:.2,offset:.32},{opacity:1,offset:.45},{opacity:.4,offset:.52},{opacity:1}],820,D),D,'linear']];
  var outA=[[lamp,[{opacity:1},{opacity:0}],260,'ease-out'],[tube,[{opacity:1},{opacity:0}],260,'ease-out'],
    [cur,at([{left:'0vw',width:'101vw',backgroundSize:'68px 100%',transform:'skewX(0deg)'},{left:'45vw',width:'55vw',backgroundSize:'38px 100%',transform:'skewX(2.5deg)',offset:.55},{left:'101vw',width:'7vw',backgroundSize:'14px 100%',transform:'skewX(0deg)'}],80,980),980,E],
    [rail,at([{transform:'none'},{transform:'translateY(-14px)'}],880,1080),1080,'ease-in']];
  return seq(inA,fn,outA);};

/* Библиотека: страницы с текстом листаются под зелёной лампой, пылинки в луче */
WIPES.leaves=function(W,fn){W.style.perspective='1800px';var n=4,els=[],inA=[],outA=[],Wd=innerWidth,H=innerHeight;
  var back=dv(W,'inset:0;tex:grain;background:radial-gradient(ellipse at 50% 30%,#1C2618,#0B0F0A 70%);opacity:0');inA.push([back,[{opacity:0},{opacity:1}],260,'linear']);
  for(var i=0;i<n;i++){var e=dv(W,'inset:0;will-change:transform;backface-visibility:hidden;transform-origin:0 50%;transform:rotateY(-100deg);background:linear-gradient(90deg,rgba(70,45,15,.38),rgba(70,45,15,0) 9%),radial-gradient(ellipse at 35% 45%,#F3E6CB,#DCC79E 78%,#C9B07E);border-right:1px solid rgba(120,90,40,.35)');if(i===n-1)texIn(e,'parch');
    dv(e,'left:12%;right:12%;top:11%;bottom:11%;background:repeating-linear-gradient(180deg,transparent 0 15px,rgba(70,48,22,.3) 15px 17px,transparent 17px 24px)');
    if(i===n-1)dv(e,'left:12%;top:11%;width:62px;height:72px;background:radial-gradient(circle at 50% 50%,#7A2A16 0 40%,transparent 41%),#E9D9B4;box-shadow:inset 0 0 0 2px #7A5A2A');
    els.push(e);inA.push([e,[{transform:'rotateY(-100deg)'},{transform:'rotateY(-100deg)',offset:i/(n+1)},{transform:'rotateY(0deg)'}],560+i*80,'cubic-bezier(.45,0,.25,1)']);}
  var lamp=dv(W,'left:50%;top:-30vh;width:110vw;height:85vh;margin-left:-55vw;border-radius:50%;background:radial-gradient(circle,rgba(160,215,140,.32),rgba(160,215,140,0) 60%);opacity:0');
  inA.push([lamp,at([{opacity:0},{opacity:1}],700,1100),1100,'ease-out']);inA=inA.concat(motes(W,10,1100,[Wd*.2,H*.05,Wd*.8,H*.6],'rgba(255,248,220,.9)'));
  els.forEach(function(e,i){outA.push([e,[{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(0deg)',opacity:1,offset:i/(n+2)},{transform:'rotateY(80deg)',opacity:1,offset:.85},{transform:'rotateY(100deg)',opacity:0}],500+i*75,'cubic-bezier(.6,0,.6,1)']);});
  outA.push([lamp,[{opacity:1},{opacity:0}],300,'ease-out'],[back,[{opacity:1},{opacity:1,offset:.6},{opacity:0}],680,'linear']);
  return seq(inA,fn,outA);};

/* Великий пожар: дым клубится над заревом, сквозь него летят искры */
(function(){var base=WIPES.smoke;WIPES.smoke=function(W,fn){var H=innerHeight,Wd=innerWidth;
  var fog=dv(W,'left:-20%;top:-20%;width:140%;height:140%;tex:fog;opacity:0'),st=base(W,fn),glow=dv(W,'left:-10vw;right:-10vw;bottom:-30vh;height:80vh;background:radial-gradient(ellipse at 50% 100%,rgba(240,110,30,.6),rgba(200,70,20,.2) 45%,rgba(240,110,30,0) 72%);mix-blend-mode:screen;opacity:0'),ex=[[fog,[{opacity:0,transform:'translateY(10vh)'},{opacity:.85,transform:'translateY(-4vh)',offset:.45},{opacity:0,transform:'translateY(-20vh)'}],1700,'ease-in-out'],[glow,[{opacity:0},{opacity:1},{opacity:.65},{opacity:1},{opacity:.4},{opacity:0}],1500,'ease-in-out']].concat(sparks(W,Math.round(Wd/18),1300,{spread:.8}));
  ex.forEach(function(x){st.anims.push(x[0].animate(x[1],{duration:x[2]*TSc,easing:x[3],fill:'forwards'}));});return st;};})();

/* Свечи: восковые свечи вокруг чаши, пламя дрожит, гаснут с дымком */
WIPES.candles=function(W,fn){var Wd=innerWidth,H=innerHeight,D=1250;
  var d=dv(W,'inset:0;tex:grain;background:radial-gradient(ellipse at 50% 55%,#1A120B,#0A0705 70%);opacity:0');
  var g=glyph(W,W.dataset.glyph||'bowl','#C9A45C','#120B0D',150);g.style.setProperty('--gd','300ms');
  var R=Math.min(175,Wd*.36),cx=Wd/2,cy=H/2,BIG=Math.hypot(Wd,H)+40,fl=[],bits=[],smk=[];
  var inA=[[d,[{opacity:0},{opacity:1}],220,'ease-in'],[g,at([{opacity:0},{opacity:1}],180,600),600,'ease-out']];
  for(var i=0;i<5;i++){var a=-Math.PI/2+i*2*Math.PI/5,x=cx+R*Math.cos(a),y=cy+R*.82*Math.sin(a)-16,hg=rn(36,58),dl=180+i*130;
    var pool=dv(W,'left:'+(x-70).toFixed(0)+'px;top:'+(y-60).toFixed(0)+'px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(255,180,80,.28),rgba(255,180,80,0) 65%);opacity:0');
    var body=dv(W,'left:'+(x-9).toFixed(0)+'px;top:'+(y+2).toFixed(0)+'px;width:18px;height:'+hg.toFixed(0)+'px;tex:wax;border-radius:5px 5px 2px 2px;background:linear-gradient(90deg,#B5A07A,#F4E9D0 40%,#DCCAA6 70%,#A28A62);box-shadow:0 6px 10px rgba(0,0,0,.6);opacity:0');
    dv(body,'left:3px;top:0;width:5px;height:'+(hg*.45).toFixed(0)+'px;border-radius:0 0 3px 3px;background:#F7EEDA');
    var wick=dv(W,'left:'+(x-1).toFixed(0)+'px;top:'+(y-5).toFixed(0)+'px;width:2px;height:8px;background:#1A1410;opacity:0');
    var f=dv(W,'left:'+(x-7).toFixed(0)+'px;top:'+(y-28).toFixed(0)+'px;width:14px;height:26px;transform-origin:50% 100%;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(circle at 50% 72%,#FFF6D0,#FFB347 45%,#E8641A 75%,rgba(232,100,26,0));box-shadow:0 0 20px 7px rgba(255,170,70,.5);opacity:0');
    var sm=dv(W,'left:'+(x-6).toFixed(0)+'px;top:'+(y-60).toFixed(0)+'px;width:12px;height:60px;border-radius:50%;background:linear-gradient(0deg,rgba(170,160,150,.6),rgba(170,160,150,0));filter:blur(3px);opacity:0');
    inA.push([body,at([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],dl-120,700),700,'ease-out'],[wick,at([{opacity:0},{opacity:1}],dl,700),700,'linear'],
      [pool,at([{opacity:0},{opacity:1}],dl+60,D),D,'ease-out'],
      [f,at([{opacity:0,transform:'scale(.2)'},{opacity:1,transform:'scale(1)',offset:.3},{transform:'scale(1.1,.9) skewX(5deg)',offset:.45},{transform:'scale(.94,1.08) skewX(-4deg)',offset:.6},{transform:'scale(1.06,.95) skewX(3deg)',offset:.78},{transform:'scale(1)'}],dl,D),D,'ease-in-out']);
    fl.push(f);bits.push(body,wick,pool);smk.push(sm);}
  var hole=dv(W,'left:50%;top:50%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 '+BIG.toFixed(0)+'px #0A0705,inset 0 0 40px 20px #0A0705;opacity:0');
  var outA=[[hole,[{opacity:1,width:'0px',height:'0px'},{opacity:1,width:'0px',height:'0px',offset:.32},{opacity:1,width:(BIG*2).toFixed(0)+'px',height:(BIG*2).toFixed(0)+'px'}],900,'cubic-bezier(.5,0,.3,1)'],
    [d,[{opacity:1},{opacity:0,offset:.33},{opacity:0}],900,'linear'],[g,[{opacity:1},{opacity:0,offset:.3},{opacity:0}],900,'linear']];
  fl.forEach(function(f){outA.push([f,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.2,.5) translateY(-10px)',offset:.18},{opacity:0}],900,'ease-in']);});
  smk.forEach(function(s,i){outA.push([s,[{opacity:0,transform:'none'},{opacity:.9,transform:'translateY(-10px)',offset:.15},{opacity:0,transform:'translateY(-70px) scaleX(2)',offset:.45},{opacity:0}],900,'ease-out']);});
  bits.forEach(function(b){outA.push([b,[{opacity:1},{opacity:0,offset:.3},{opacity:0}],900,'linear']);});
  return seq(inA,fn,outA);};

/* ── Фоны, заголовки, частицы (v2.24): стандарт качества шторок ── */
GART.urn={b:'M38 10 H62 V16 H38 Z'+C_(50,7,3)+'M40 16 C40 22 30 26 28 38 C26 54 34 66 42 72 L40 80 H60 L58 72 C66 66 74 54 72 38 C70 26 60 22 60 16 Z M34 80 H66 V86 H34 Z M30 86 H70 V92 H30 Z',
  s:'M50 0 H100 V100 H50 Z M0 84 H100 V100 H0 Z',
  l:['M31 34 C42 38 58 38 69 34','M29 50 C42 55 58 55 71 50','M50 39 C45 42 45 47 50 49 C55 47 55 42 50 39','M30 30 C22 30 20 42 28 44','M70 30 C78 30 80 42 72 44','M34 83 H66']};
GART.tower={b:'M30 92 V40 H26 V30 H32 V24 H38 V30 H44 V24 H56 V30 H62 V24 H68 V30 H74 V40 H70 V92 Z',s:'M50 0 H100 V100 H50 Z',
  l:['M50 24 V10 L61 13 L50 16','M44 52 V45 C44 40 56 40 56 45 V52 Z','M37 70 V64 C37 60 44 60 44 64 V70 Z','M56 70 V64 C56 60 63 60 63 64 V70 Z','M44 92 V83 C44 76 56 76 56 83 V92',
     'M30 40 H70 M30 58 H70 M30 76 H70','M40 58 V64 M60 58 V64 M50 70 V76 M36 82 V88 M64 82 V88']};
GART.greyhound={b:'M10 52 C14 44 22 42 30 44 L52 42 C60 40 66 38 70 32 L74 24 L78 26 L80 22 L84 28 C90 30 94 34 94 36 L86 38 C82 40 80 44 76 48 C74 54 72 58 70 60 L72 80 L68 80 L64 62 C56 62 46 62 38 60 L32 80 L28 80 L30 58 C26 56 22 52 20 50 C16 54 10 60 6 62 C6 58 8 54 10 52 Z',
  s:'M0 50 H100 V100 H0 Z',l:['M44 46 C46 51 46 55 44 59','M50 45 C52 50 52 54 50 58','M56 44 C58 49 58 53 56 57','M78 26 L82 31','M70 34 L77 41','M26 48 C30 46 34 46 38 47'],d:C_(86,31,1)};
TEX.wood=function(){return {bg:TX('wd',{f:'0.006 0.18',o:4,r:.18,g:.1,b:.04,k:1.4,c:-.5,s:600})+','+TX('wg',{f:.8,o:2,r:0,g:0,b:0,k:1.2,c:-.45,s:160,seed:15}),op:.6};};
TEX.stone=function(){return {bg:TX('st',{f:.05,o:5,r:0,g:0,b:0,k:1.3,c:-.5,s:500,seed:16})+','+TX('sg',{f:.7,o:3,r:.9,g:.9,b:.9,k:.6,c:-.25,s:200,seed:17}),op:.55};};

/* Витраж Селены: стрельчатое окно, розетка и два ланцета с цветными стёклами в свинцовых переплётах */
SCENES.moonbeam=function(){var P=['rgba(150,28,52,.62)','rgba(34,110,78,.55)','rgba(206,160,46,.55)','rgba(44,66,140,.62)','rgba(112,44,126,.55)','rgba(180,190,220,.45)'],h='',cx=100,cy=104;
  function pc(){return P[Math.floor(Math.random()*P.length)];}
  for(var k=0;k<12;k++){var a0=k*Math.PI/6,a1=(k+1)*Math.PI/6;h+='<path d="M'+cx+' '+cy+' L'+(cx+58*Math.cos(a0)).toFixed(1)+' '+(cy+58*Math.sin(a0)).toFixed(1)+' A58 58 0 0 1 '+(cx+58*Math.cos(a1)).toFixed(1)+' '+(cy+58*Math.sin(a1)).toFixed(1)+' Z" fill="'+(k%2?P[0]:P[3])+'"/>';}
  for(var k2=0;k2<12;k2++){var b0=k2*Math.PI/6+.26;h+='<circle cx="'+(cx+40*Math.cos(b0)).toFixed(1)+'" cy="'+(cy+40*Math.sin(b0)).toFixed(1)+'" r="9" fill="'+P[2]+'"/>';}
  h+='<circle cx="'+cx+'" cy="'+cy+'" r="20" fill="rgba(225,232,255,.7)"/><circle cx="'+cx+'" cy="'+cy+'" r="12" fill="'+P[4]+'"/>';
  var lan='',lead='';[[22,96],[104,178]].forEach(function(r){var x0=r[0],x1=r[1],w=x1-x0;
    lan+='<clipPath id="ln'+x0+'"><path d="M'+x0+' 352 V196 C'+x0+' 176 '+(x0+w/2)+' 166 '+(x0+w/2)+' 166 C'+(x0+w/2)+' 166 '+x1+' 176 '+x1+' 196 V352 Z"/></clipPath><g clip-path="url(#ln'+x0+')">';
    for(var yy=166;yy<360;yy+=22)for(var xx=x0-11;xx<x1+11;xx+=22){var off=(Math.round((yy-166)/22)%2)*11;lan+='<path d="M'+(xx+off)+' '+yy+' l11 11 l-11 11 l-11 -11 Z" fill="'+pc()+'" stroke="#1C1418" stroke-width="2.2"/>';}
    lan+='</g>';lead+='<path d="M'+x0+' 352 V196 C'+x0+' 176 '+(x0+w/2)+' 166 '+(x0+w/2)+' 166 C'+(x0+w/2)+' 166 '+x1+' 176 '+x1+' 196 V352 Z" fill="none" stroke="#1C1418" stroke-width="4"/>';});
  var rays='';for(var q=0;q<12;q++){var c0=q*Math.PI/6;rays+='M'+(cx+20*Math.cos(c0)).toFixed(1)+' '+(cy+20*Math.sin(c0)).toFixed(1)+' L'+(cx+58*Math.cos(c0)).toFixed(1)+' '+(cy+58*Math.sin(c0)).toFixed(1)+' ';}
  var svg='<svg viewBox="0 0 200 360" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><defs><clipPath id="arch"><path d="M8 360 V120 C8 52 56 8 100 8 C144 8 192 52 192 120 V360 Z"/></clipPath></defs>'+
    '<g clip-path="url(#arch)"><rect width="200" height="360" fill="rgba(20,16,24,.35)"/>'+h+lan+'</g>'+lead+
    '<g fill="none" stroke="#1C1418"><circle cx="'+cx+'" cy="'+cy+'" r="58" stroke-width="4"/><circle cx="'+cx+'" cy="'+cy+'" r="20" stroke-width="3"/><path d="'+rays+'" stroke-width="2.4"/>'+
    '<path d="M8 360 V120 C8 52 56 8 100 8 C144 8 192 52 192 120 V360" stroke-width="7"/><path d="M8 168 H192 M100 166 V360" stroke-width="5"/></g></svg>';
  return '<div class="beam"></div><div class="glass sg">'+svg+'</div><div class="dust"></div>';};

var TEX_SC={dossier:'paper',chronicle:'parch',vitrine:'velvet',street:'stone',banners:'stone',drawer:'wood',alley:'stone',scales:'slate',gallery:'canvas',grimoire:'leather',club:'velvet',
  moonbeam:'grain',ashfall:'paper',lamp:'paper',candles:'grain',glowsnow:'stone',riot:'ember'};
function artScene(nw){try{var sc=nw.querySelector('.sc');if(!sc)return;var nm=(sc.className.match(/sc-([\w-]+)/)||[])[1]||'',tn=TEX_SC[nm]||(nm.indexOf('crest-')===0?'stone':null);
  if(tn){var t=texIn(sc,tn);if(t){t.classList.add('sc-tex');t.style.opacity=(parseFloat(t.style.opacity)*.65).toFixed(2);sc.insertBefore(t,sc.firstChild);}}
  [].slice.call(sc.querySelectorAll('.sc-sil')).forEach(function(el){var m=el.className.match(/sil-([\w-]+)/),n=m&&m[1];if(!n||!GART[n])return;
    el.classList.add('gx');el.innerHTML=engrave(n,'currentColor','rgba(0,0,0,.22)');});
}catch(e){}}

/* Заголовки: богаче и в 1,3 раза медленнее */
ENTER.type={kf:[{opacity:0,transform:'translateY(-3px)',filter:'blur(1.5px)',textShadow:'0 0 6px rgba(0,0,0,.5)'},{opacity:1,transform:'translateY(.5px)',filter:'blur(0)',offset:.6},{opacity:1,transform:'none',textShadow:'0 0 0 rgba(0,0,0,0)'}],dur:160,each:.07};
ENTER.sign={kf:[{opacity:0,transform:'translateY(-30%)'},{opacity:.85,transform:'none',offset:.18},{opacity:.12,offset:.28},{opacity:1,offset:.42},{opacity:.55,offset:.52},{opacity:1}],dur:760,each:.035};
ENTER.stamp={kf:[{opacity:0,transform:'scale(2) rotate(-6deg)',filter:'blur(4px)'},{opacity:1,transform:'scale(.93) rotate(1deg)',filter:'blur(0)',offset:.55},{opacity:1,transform:'scale(1.03)',offset:.78},{opacity:1,transform:'none'}],dur:620,each:.06};
ENTER.ink={kf:[{opacity:0,filter:'blur(10px)',transform:'scale(1.25)',textShadow:'0 0 16px rgba(20,12,6,.7)'},{opacity:.85,filter:'blur(2px)',transform:'scale(1.04)',offset:.5},{opacity:1,filter:'blur(0)',transform:'none',textShadow:'0 0 0 rgba(0,0,0,0)'}],dur:1150,each:.06};
ENTER.engrave={kf:[{opacity:0,transform:'translateY(8px)',color:'#FFF6D8',textShadow:'0 0 0 rgba(255,236,170,0)'},{opacity:1,transform:'none',color:'#FFF6D8',textShadow:'0 0 14px rgba(255,236,170,.8)',offset:.45},{opacity:1,textShadow:'0 0 0 rgba(255,236,170,0)'}],dur:1100,each:.05};
ENTER.ember={kf:[{opacity:0,color:'#F2D27A',filter:'blur(6px)',textShadow:'0 0 26px #D4AF37'},{opacity:1,color:'#FFE6A0',filter:'blur(0)',textShadow:'0 0 18px rgba(232,140,40,.9)',offset:.4},{opacity:.82,offset:.55},{opacity:1,offset:.7},{opacity:1}],dur:1200,each:.06};
for(var ek in ENTER)if(!ENTER[ek].__s){ENTER[ek].dur=Math.round(ENTER[ek].dur*1.3);ENTER[ek].__s=1;}

/* Частицы: угли и искры светятся и оставляют след, дождь в три плана с брызгами, пепел и снег мягкие */
spawn=function(kind,init){var W=innerWidth,H=innerHeight,z=Math.random();
  if(kind==='ash')return {x:Math.random()*W,y:init?Math.random()*H:-10,z:z,r:(z*2.2+.7),vy:z*.4+.15,ph:Math.random()*6.28,rot:Math.random()*6.28,snow:Math.random()<.45};
  if(kind==='embers'||kind==='sparks')return {x:Math.random()*W,y:init?Math.random()*H:H+10,z:z,r:z*1.9+.6,vy:-(z*.7+.22),vx:(Math.random()-.5)*.3,ph:Math.random()*6.28,px:0,py:0};
  if(kind==='splash')return null;
  return {x:Math.random()*(W+200)-100,y:init?Math.random()*H:-20,z:z,l:z*16+7,v:z*5+6,gy:H*(.55+Math.random()*.45)};};
var SPL=[];
draw=function(dt){dt=Math.max(0,dt||0);var g=FX.ctx,W=innerWidth,H=innerHeight;g.clearRect(0,0,W,H);
  FX.parts.forEach(function(p,i){
    if(FX.kind==='ash'){p.ph+=.02*dt;p.rot+=.01*dt;p.y+=p.vy*dt;p.x+=Math.sin(p.ph)*.35*dt;
      if(p.snow){var gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*1.8);gr.addColorStop(0,'rgba(255,255,255,'+(.55+p.z*.4).toFixed(2)+')');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,p.r*1.8,0,6.283);g.fill();}
      else{g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle='rgba(70,64,60,'+(.3+p.z*.3).toFixed(2)+')';g.beginPath();g.ellipse(0,0,p.r*1.3,p.r*.6,0,0,6.283);g.fill();g.restore();}
      if(p.y>H+10)FX.parts[i]=spawn('ash');}
    else if(FX.kind==='embers'||FX.kind==='sparks'){var sp=FX.kind==='sparks';p.ph+=.03*dt;var ox=p.x,oy=p.y;p.x+=(p.vx+Math.sin(p.ph)*.25)*dt;p.y+=p.vy*(sp?1.8:1)*dt;
      var a=.35+.5*Math.abs(Math.sin(p.ph*1.7)),col=sp?'255,'+(110+Math.round(70*a))+',40':'250,'+(170+Math.round(45*a))+',90';
      g.strokeStyle='rgba('+col+','+(a*.35).toFixed(2)+')';g.lineWidth=p.r*.9;g.beginPath();g.moveTo(ox,oy);g.lineTo(p.x-(p.x-ox)*6,p.y-(p.y-oy)*6);g.stroke();
      g.shadowColor='rgba('+col+',.9)';g.shadowBlur=6+p.r*4;g.fillStyle='rgba('+col+','+(a*.9).toFixed(2)+')';g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill();g.shadowBlur=0;
      if(p.y<-10)FX.parts[i]=spawn(FX.kind);}
    else{p.y+=p.v*dt;p.x-=p.v*.18*dt;g.strokeStyle='rgba(170,190,220,'+(.07+p.z*.16).toFixed(2)+')';g.lineWidth=.6+p.z*.8;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+p.l*.18,p.y-p.l);g.stroke();
      if(p.y>p.gy){if(p.z>.45&&SPL.length<40)SPL.push({x:p.x,y:p.y,t:0,z:p.z});FX.parts[i]=spawn('rain');}}
  });
  if(FX.kind==='rain'){for(var j=SPL.length-1;j>=0;j--){var s=SPL[j];s.t+=.06*dt;if(s.t>=1){SPL.splice(j,1);continue;}
    g.strokeStyle='rgba(170,190,220,'+((1-s.t)*.25).toFixed(2)+')';g.lineWidth=.8;g.beginPath();g.ellipse(s.x,s.y,2+s.t*9*s.z,.8+s.t*2.4*s.z,0,0,6.283);g.stroke();}}
  else if(SPL.length)SPL.length=0;};
/* ── v2.28: роза-гравюра, пламя на кромке, папка дела, гравюры фонов ── */
GART.rose={b:'M50 58 C38 57 27 50 25.5 38 C24.5 30 28 23 33.5 19 C31.5 25 35.5 29.5 40 31 C38.5 23 41.5 14.5 50 10 C58.5 14.5 61.5 23 60 31 C64.5 29.5 68.5 25 66.5 19 C72 23 75.5 30 74.5 38 C73 50 62 57 50 58Z M50 56 L39 64 L45.5 61.5 L50 67 L54.5 61.5 L61 64Z M48.6 62 C47.6 73 50.6 84 47.6 97 H52 C55 84 52 73 52.4 62Z M51.5 72 L58 68.5 L52.5 75Z M48.5 85 L42 82.5 L48 88Z M52.5 79 C58 71 70 68 78 72 C72 80 61 83 52.5 80Z M48 68 C42 61 30 60 24 64 C31 71 41 71 48 69.5Z',
  s:'M50 0 H100 V100 H50 Z M0 44 H100 V58 H0 Z',
  l:['M43.5 27 C43 20 56.5 19.5 56.5 26.5 C56.5 32 47 32.5 47 27.5 C47 24.5 52.5 24.5 52.5 27.5','M40 31 C44 34 56 34 60 31','M40 31 C40.5 40 44.5 47 50 49.5','M60 31 C59.5 40 55.5 47 50 49.5',
     'M33.5 19 C30.5 33 36 45 46 52.5','M66.5 19 C69.5 33 64 45 54 52.5','M55 76.5 C61 74 68 72 74 72','M45.5 66.5 C40 64.5 33 63.5 28 64'],
  p:'M67 41 C71 39 75 42 73 46 C71 49 67 47 67 41 Z'};


/* Гангрел (v2.29): белоголовый орёл в полёте, крылья подняты, маховые перья веером;
   белые голова и хвост — цветом чернил, глаз — цветом заливки */
(function(){function F(v){return v.toFixed(1);}
 function wing(bf,bb,c1,c2,ts,te,a0,a1,lens,wf,cv){var d='M'+F(bf[0])+' '+F(bf[1])+' C'+F(c1[0])+' '+F(c1[1])+' '+F(c2[0])+' '+F(c2[1])+' '+F(ts[0])+' '+F(ts[1]),
   n=lens.length,ex=te[0]-ts[0],ey=te[1]-ts[1],el=Math.hypot(ex,ey),ux=ex/el,uy=ey/el,ln=[],tips=[];
   for(var k=0;k<n;k++){var t=(k+.5)/n,cx=ts[0]+ex*t,cy=ts[1]+ey*t,a=(a0+(a1-a0)*k/(n-1))*Math.PI/180,dx=Math.cos(a),dy=Math.sin(a),L=lens[k],
     lx=cx-ux*wf/2,ly=cy-uy*wf/2,rx=cx+ux*wf/2,ry=cy+uy*wf/2,tx=cx+dx*L,ty=cy+dy*L;
     d+=' L'+F(lx)+' '+F(ly)+' L'+F(lx+dx*L*.8)+' '+F(ly+dy*L*.8)+' Q'+F(tx)+' '+F(ty)+' '+F(rx+dx*L*.8)+' '+F(ry+dy*L*.8)+' L'+F(rx)+' '+F(ry);
     tips.push([tx,ty]);ln.push('M'+F(cx-dx*6)+' '+F(cy-dy*6)+' L'+F(cx+dx*L*.82)+' '+F(cy+dy*L*.82));}
   d+=' L'+F(te[0])+' '+F(te[1])+' C'+F(cv[0][0])+' '+F(cv[0][1])+' '+F(cv[1][0])+' '+F(cv[1][1])+' '+F(bb[0])+' '+F(bb[1])+' Z';
   /* кроющие перья: две дуги поперёк крыла, «чешуя» на нижней */
   [.42,.68].forEach(function(f,m){var p0=[bf[0]+(ts[0]-bf[0])*f,bf[1]+(ts[1]-bf[1])*f],p1=[bb[0]+(te[0]-bb[0])*f,bb[1]+(te[1]-bb[1])*f],
     mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2;var q='M'+F(p0[0])+' '+F(p0[1]);
     if(m===0){for(var s2=1;s2<=5;s2++){var a2=s2/5,x2=p0[0]+(p1[0]-p0[0])*a2,y2=p0[1]+(p1[1]-p0[1])*a2,xm=p0[0]+(p1[0]-p0[0])*(a2-.1),ym=p0[1]+(p1[1]-p0[1])*(a2-.1);
       q+=' Q'+F(xm+(-(p1[1]-p0[1]))*.06)+' '+F(ym+(p1[0]-p0[0])*.06)+' '+F(x2)+' '+F(y2);}}
     else q+=' Q'+F(mx-(p1[1]-p0[1])*.12)+' '+F(my+(p1[0]-p0[0])*.12)+' '+F(p1[0])+' '+F(p1[1]);ln.push(q);});
   return {d:d,l:ln};}
 var far=wing([47,53],[33,57],[45,40],[40,27],[33,17],[10,29],-100,-158,[13,15,15,14,11],4.2,[[16,40],[26,50]]),
     near=wing([64,53],[50,55],[66,40],[68,26],[71,13],[46,9],-62,-112,[13,15,16,15,12],4.4,[[44,24],[46,42]]);
 var head='M66 52 C66 46 70 43 76 43 C80 43 83 45 85 48 C85 51 83 54 80 56 C76 58 71 58 68 57 C66 56 66 54 66 52 Z',
     tail='M32 57 L13 54 L10 57 L12 59.5 L9 61.5 L12 63.5 L10 66.5 L14 67.5 L32 66 Z';
 GART.eagle={b:far.d+' '+near.d+' M30 56 C40 50 56 50 66 52 C72 53 74 58 72 62 C64 67 46 68 32 66 C28 64 27 59 30 56 Z '+
   'M84 46.5 C88.5 46 92.5 48 93.5 51.5 C93.8 54.5 91.5 56 90 54 C89 52.8 87 53.8 84 55 Z M48 65 L50 73 L53.5 72.5 L55 65 Z '+head+' '+tail,
  s:'M0 0 H45 L51 56 H0 Z M0 61 H100 V100 H0 Z',w:1.5,
  l:far.l.concat(near.l,['M40 61 L44 58 L47 62 M48 58 L52 55 L55 59 M56 60 L60 57 L62 61','M49 73 L47.5 76.5 M51.5 73 L51.5 77 M53.5 72.5 L55.5 75.5','M85.5 52 C87.5 52.8 89.5 52.8 91.5 52']),
  d:head+' '+tail,e:C_(78,48.6,1.2)+' M73.5 46.4 C76 45.6 79 45.8 81.5 46.8 L81 47.6 C78.5 46.9 76 46.8 73.8 47.3 Z M81 48 L84.5 49.2 L81 49.3 Z'};})();

/* широкие гравюры фонов: viewBox своей формы */
function ART_W(vb,par,o){o.vb=vb;o.par=par;return o;}
(function(){var R=function(a,b){return a+Math.random()*(b-a);};
  /* горизонт Манхэттена: башни со ступенями, шпили, баки на крышах, ряды окон */
  var b='',s='',l=[],x=0;
  while(x<1000){var w=R(22,52),h=R(40,128),top=160-h;if(Math.random()<.08)h=R(132,150),top=160-h;
    b+='M'+x.toFixed(0)+' 160 V'+top.toFixed(0)+' H'+(x+w).toFixed(0)+' V160 Z ';s+='M'+(x+w*.62).toFixed(0)+' 160 V'+top.toFixed(0)+' H'+(x+w).toFixed(0)+' V160 Z ';
    if(h>110&&Math.random()<.6){var cx=x+w/2;b+='M'+(cx-w*.25).toFixed(0)+' '+top.toFixed(0)+' V'+(top-14).toFixed(0)+' H'+(cx+w*.25).toFixed(0)+' V'+top.toFixed(0)+' Z M'+(cx-2).toFixed(0)+' '+(top-14).toFixed(0)+' L'+cx.toFixed(0)+' '+(top-38).toFixed(0)+' L'+(cx+2).toFixed(0)+' '+(top-14).toFixed(0)+' Z ';}
    else if(Math.random()<.35){var tx=x+R(4,w-16);b+='M'+tx.toFixed(0)+' '+top.toFixed(0)+' V'+(top-9).toFixed(0)+' C'+tx.toFixed(0)+' '+(top-13).toFixed(0)+' '+(tx+12).toFixed(0)+' '+(top-13).toFixed(0)+' '+(tx+12).toFixed(0)+' '+(top-9).toFixed(0)+' V'+top.toFixed(0)+' Z ';l.push('M'+(tx+2).toFixed(0)+' '+top.toFixed(0)+' L'+(tx+4).toFixed(0)+' '+(top+4)+' M'+(tx+10).toFixed(0)+' '+top.toFixed(0)+' L'+(tx+8).toFixed(0)+' '+(top+4));}
    var wl='';for(var y=top+7;y<154;y+=7)wl+='M'+(x+4).toFixed(0)+' '+y.toFixed(0)+' H'+(x+w-4).toFixed(0)+' ';l.push({d:wl,dash:'2.2 2.6',w:1.4});
    x+=w+R(-4,3);}
  GART.skyline=ART_W('0 0 1000 160','xMidYMax slice',{b:b,s:s,l:l,w:1.2,hs:3.2});
  /* толпа со спины (v2.29): единый силуэт по огибающей; у переднего ряда головы на шеях, плечи, руки растут из плеч:
     кулаки вверх, свечи в поднятой руке, древко с полотнищем; кромка подсвечена заревом */
  (function(){var N=501,env=[],i,figs=[],cl=[],extra='';for(i=0;i<N;i++)env[i]=160;
    function fig(x,hy,hr,sh,row){var f={x:x,hy:hy,hr:hr,sh:sh,row:row,col:[]},sTop=hy+hr*.95+1.5;f.sTop=sTop;
      f.h=function(X){var y=160,dx=X-x;
        if(Math.abs(dx)<sh){var q=dx/sh;y=Math.min(y,sTop+16*(1-Math.sqrt(1-q*q))+(Math.abs(q)>.92?(Math.abs(q)-.92)*500:0));}
        if(Math.abs(dx)<hr*.55)y=Math.min(y,hy+hr*.6);
        if(Math.abs(dx)<hr)y=Math.min(y,hy-Math.sqrt(hr*hr-dx*dx)*1.12);
        f.col.forEach(function(c){if(X>=c[0]&&X<=c[1])y=Math.min(y,c[2](X));});return y;};
      figs.push(f);return f;}
    function arm(f,side,top,w,cap){var ax=f.x+side*f.sh*.42,x0=ax-w/2,x1=ax+w/2;
      f.col.push([x0,x1,function(){return top;}]);if(cap)f.col.push(cap);return ax;}
    /* задний ряд */
    for(var x=-20;x<1020;x+=R(30,40))fig(x+R(-4,4),R(54,64),R(7,9),R(24,30),0);
    /* передний ряд: фигуры не перекрывают друг друга */
    var xs=[];for(x=0;x<1010;){var sh=R(25,31);x+=sh;xs.push([x,sh]);x+=sh+R(2,8);}
    xs.forEach(function(p){var f=fig(p[0],R(70,82),R(8.5,11),p[1],1),u=Math.random(),side=Math.random()<.5?-1:1;
      if(u<.36){var top=f.hy-R(26,40),ax=arm(f,side,top+10,6.5);
        extra+='M'+(ax-5).toFixed(1)+' '+(top+10).toFixed(1)+' V'+(top+3).toFixed(1)+' C'+(ax-5).toFixed(1)+' '+(top-.5).toFixed(1)+' '+(ax+5).toFixed(1)+' '+(top-.5).toFixed(1)+' '+(ax+5).toFixed(1)+' '+(top+3).toFixed(1)+' V'+(top+10).toFixed(1)+' Z ';
        cl.push('M'+(ax-4.5).toFixed(1)+' '+(top+3).toFixed(1)+' H'+(ax+4.5).toFixed(1)+' M'+(ax-1.5).toFixed(1)+' '+(top+.5).toFixed(1)+' V'+(top+3).toFixed(1)+' M'+(ax+1.5).toFixed(1)+' '+(top+.5).toFixed(1)+' V'+(top+3).toFixed(1)+' M'+(ax-4.5).toFixed(1)+' '+(top+7).toFixed(1)+' C'+(ax-2).toFixed(1)+' '+(top+8.5).toFixed(1)+' '+(ax+2).toFixed(1)+' '+(top+8.5).toFixed(1)+' '+(ax+4.5).toFixed(1)+' '+(top+7).toFixed(1));}
      else if(u<.48){var hand=f.hy-R(2,10),ax2=arm(f,side,hand,6);
        f.col.push([ax2-1.6,ax2+1.6,function(){return hand-11;}]);
        cl.push({d:'M'+ax2.toFixed(1)+' '+(hand-11.5).toFixed(1)+' C'+(ax2-3).toFixed(1)+' '+(hand-15).toFixed(1)+' '+(ax2+2).toFixed(1)+' '+(hand-18).toFixed(1)+' '+ax2.toFixed(1)+' '+(hand-22).toFixed(1)+' C'+(ax2+3).toFixed(1)+' '+(hand-18).toFixed(1)+' '+(ax2+2).toFixed(1)+' '+(hand-14).toFixed(1)+' '+ax2.toFixed(1)+' '+(hand-11.5).toFixed(1),c:'#FFC060',w:1.3});
        cl.push('M'+(ax2-3).toFixed(1)+' '+(hand+1).toFixed(1)+' H'+(ax2+3).toFixed(1));}
      else if(u<.53){var px=f.x+side*f.sh*.35,pt=f.hy-R(56,66);f.col.push([px-1.3,px+1.3,function(){return pt;}]);
        var dir=side,fw=R(34,42),pts='M'+px.toFixed(1)+' '+(pt+1).toFixed(1)+' C'+(px+dir*fw*.35).toFixed(1)+' '+(pt+5).toFixed(1)+' '+(px+dir*fw*.65).toFixed(1)+' '+(pt-3).toFixed(1)+' '+(px+dir*fw).toFixed(1)+' '+(pt+3).toFixed(1)+' L'+(px+dir*(fw-2)).toFixed(1)+' '+(pt+24).toFixed(1)+' C'+(px+dir*fw*.65).toFixed(1)+' '+(pt+18).toFixed(1)+' '+(px+dir*fw*.35).toFixed(1)+' '+(pt+28).toFixed(1)+' '+px.toFixed(1)+' '+(pt+23).toFixed(1)+' Z ';
        extra+=pts;cl.push('M'+(px+dir*5).toFixed(1)+' '+(pt+9).toFixed(1)+' C'+(px+dir*fw*.4).toFixed(1)+' '+(pt+13).toFixed(1)+' '+(px+dir*fw*.65).toFixed(1)+' '+(pt+6).toFixed(1)+' '+(px+dir*(fw-4)).toFixed(1)+' '+(pt+11).toFixed(1));}
    });
    /* огибающая всей толпы = заливка; контуры переднего ряда целиком видны поверх */
    for(i=0;i<N;i++){var X=i*2;figs.forEach(function(f){if(Math.abs(X-f.x)<f.sh+12)env[i]=Math.min(env[i],f.h(X));});}
    var cb='M0 160';for(i=0;i<N;i++)cb+=' L'+(i*2)+' '+env[i].toFixed(1);cb+=' L1000 160 Z '+extra;
    figs.forEach(function(f){if(!f.row)return;var d='',X0=Math.floor((f.x-f.sh-10)/1)*1,X1=f.x+f.sh+10,first=true;
      for(var X=X0;X<=X1;X+=1){var y=f.h(X);if(y>=159.5){if(!first){d+=' L'+X+' 160';first=true;}continue;}d+=(first?' M'+X+' 160 L':' L')+X+' '+y.toFixed(1);first=false;}
      cl.unshift(d);
      cl.push({d:'M'+(f.x-f.hr*.7).toFixed(1)+' '+(f.hy+f.hr*.2).toFixed(1)+' C'+(f.x-f.hr*.3).toFixed(1)+' '+(f.hy+f.hr*.55).toFixed(1)+' '+(f.x+f.hr*.3).toFixed(1)+' '+(f.hy+f.hr*.55).toFixed(1)+' '+(f.x+f.hr*.7).toFixed(1)+' '+(f.hy+f.hr*.2).toFixed(1),w:.9,o:.7});});
    GART.crowd=ART_W('0 0 1000 160','xMidYMax slice',{b:cb,s:'M0 122 H1000 V160 H0 Z',l:cl,w:1.4,hs:3,ink:'#E8641A',fill:'#050202',op:.85});
  })();
  /* вихрь: спиральные рукава вокруг чёрного солнца */
  var vl=[];for(var k=0;k<6;k++){var a0=k*Math.PI/3,d='';for(var t=0;t<=1.0001;t+=.04){var r=10+t*88,a=a0+t*4.2;d+=(t?' L':'M')+(100+r*Math.cos(a)).toFixed(1)+' '+(100+r*Math.sin(a)).toFixed(1);}vl.push(d);}
  for(var k2=0;k2<6;k2++){var a1=k2*Math.PI/3+.45,d2='';for(var t2=0;t2<=1.0001;t2+=.05){var r2=16+t2*70,a2=a1+t2*3.6;d2+=(t2?' L':'M')+(100+r2*Math.cos(a2)).toFixed(1)+' '+(100+r2*Math.sin(a2)).toFixed(1);}vl.push({d:d2,w:.8});}
  GART.vortex=ART_W('0 0 200 200','xMidYMid meet',{b:C_(100,100,96),s:'M100 0 H200 V200 H100 Z',l:vl,d:C_(100,100,9),w:1,hs:3.4,op:.09});
  /* руины 1835 года: выгоревшие коробки домов, пустые окна, купол биржи с колоннами, дымы */
  var rb='',rl=[];x=0;
  while(x<1000){if(x>440&&x<470){rb+='M440 160 V96 H560 V160 Z M446 96 C452 60 548 60 554 96 Z ';var col='';for(var cx2=452;cx2<=548;cx2+=12)col+='M'+cx2+' 100 V156 ';rl.push(col,'M446 96 H554','M470 74 L478 88 L486 70 L494 84 L504 66 L512 80');x=560;continue;}
    var w2=R(30,60),h2=R(38,92),t0=160-h2,jag='';for(var j=0;j<=6;j++)jag+=' L'+(x+w2*j/6).toFixed(0)+' '+(t0+(j%2?R(4,16):R(-4,4))).toFixed(0);
    rb+='M'+x.toFixed(0)+' 160'+jag+' L'+(x+w2).toFixed(0)+' 160 Z ';
    var win='';for(var wy=t0+16;wy<150;wy+=16)for(var wx=x+6;wx<x+w2-10;wx+=11)win+='M'+wx.toFixed(0)+' '+wy.toFixed(0)+' h6 v9 h-6 Z ';rl.push({d:win,w:1});
    if(Math.random()<.3)rl.push({d:'M'+(x+w2/2).toFixed(0)+' '+(t0-4).toFixed(0)+' C'+(x+w2/2-10).toFixed(0)+' '+(t0-24).toFixed(0)+' '+(x+w2/2+12).toFixed(0)+' '+(t0-40).toFixed(0)+' '+(x+w2/2).toFixed(0)+' '+(t0-62).toFixed(0),w:1.6,o:.6});
    x+=w2+R(2,10);}
  GART.ruins=ART_W('0 0 1000 160','xMidYMax slice',{b:rb,s:'M0 110 H1000 V160 H0 Z',l:rl,w:1.3,hs:3});
  /* луна: моря, кратеры, штриховка тени */
  var ml=[C_(38,40,10),C_(62,58,14),C_(44,70,7),C_(68,30,6),C_(30,62,5),C_(55,40,4)].map(function(d){return {d:d,w:.9};});
  ml.push('M14 50 C20 30 34 18 50 14','M86 50 C80 70 66 82 50 86');
  GART.moon=ART_W('0 0 100 100','xMidYMid meet',{b:C_(50,50,42),s:'M58 0 H100 V100 H58 Z',l:ml,d:C_(38,40,2)+C_(62,58,3),w:1.1,hs:2.4});
})();

/* engrave с собственным viewBox, цветом и штрихом для отдельных линий */
engrave=function(name,ink,fill){var a=GART[name];if(!a)return '';var id='gx'+(++gUID),sw=a.w||1.7,hs=a.hs||2.6,vb=a.vb||'0 0 100 100',par=a.par||'xMidYMid meet';ink=a.ink||ink;fill=a.fill||fill;
  var h='<svg viewBox="'+vb+'" preserveAspectRatio="'+par+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
   '<pattern id="'+id+'h" width="'+hs+'" height="'+hs+'" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><line x1="0" y1="0" x2="0" y2="'+hs+'" stroke="'+ink+'" stroke-width="'+(hs*.29).toFixed(2)+'"/></pattern>'+
   '<clipPath id="'+id+'c"><path d="'+a.b+'"'+(a.r?' clip-rule="evenodd"':'')+'/></clipPath></defs>'+
   '<path class="gl-base" d="'+a.b+'" fill="'+fill+'"'+(a.r?' fill-rule="evenodd"':'')+'/>'+
   '<g class="gl-sh" clip-path="url(#'+id+'c)"><path d="'+a.s+'" fill="url(#'+id+'h)"'+(a.sr?' fill-rule="evenodd"':'')+'/></g>'+
   '<path class="gl-ln" pathLength="1" d="'+a.b+'" fill="none" stroke="'+ink+'" stroke-width="'+sw+'" stroke-linejoin="round"/>';
  (a.l||[]).forEach(function(L,i){var o=typeof L==='string'?{d:L}:L,dl='calc((var(--gd,0ms) + '+(.18+Math.min(i,24)*.04).toFixed(2)+'s) * var(--ts,1))';
    h+=o.dash?'<path class="gl-sh" d="'+o.d+'" fill="none" stroke="'+(o.c||ink)+'" stroke-width="'+(o.w||1.15)+'" stroke-dasharray="'+o.dash+'"/>':
      '<path class="gl-ln" pathLength="1" style="animation-delay:'+dl+'" d="'+o.d+'" fill="none" stroke="'+(o.c||ink)+'" stroke-opacity="'+(o.o||1)+'" stroke-width="'+(o.w||1.15)+'" stroke-linecap="round" stroke-linejoin="round"/>';});
  if(a.d)h+='<path class="gl-dt" d="'+a.d+'" fill="'+ink+'"/>';
  if(a.e)h+='<path class="gl-dt" d="'+a.e+'" fill="'+fill+'"/>';
  if(a.p)h+='<path class="gl-petal" d="'+a.p+'" fill="'+fill+'" stroke="'+ink+'" stroke-width="1"/>';
  return h+'</svg>';};

/* фоны: широкие гравюры вместо плоских силуэтов, руины и луна */
var artScene0=artScene;artScene=function(nw){artScene0(nw);try{var sc=nw.querySelector('.sc');if(!sc)return;
  [].slice.call(sc.querySelectorAll('.sc-sil.gx')).forEach(function(el){var m=el.className.match(/sil-([\w-]+)/),a=m&&GART[m[1]];if(a&&a.op!=null)el.style.setProperty('opacity',a.op,'important');if(a&&a.ink)el.style.color=a.ink;});
  [['.ruins','ruins','.5','#3A2614','rgba(58,38,20,.28)'],['.moon','moon','.4','rgba(240,232,210,.95)','rgba(240,232,210,.07)']].forEach(function(q){var el=sc.querySelector(q[0]);if(!el)return;
    el.style.background='none';el.style.clipPath='none';el.style.webkitClipPath='none';el.style.opacity=q[2];el.classList.add('gx');el.innerHTML=engrave(q[1],q[3],q[4]);});
}catch(e){}};

/* языки пламени вдоль кромки: внешнее пламя, ядро, обугленный край, отсвет */
function flameStrip(P,Wd){var NS='http://www.w3.org/2000/svg',H0=150,B=126,n=Math.max(16,Math.round(Wd/24)),s=document.createElementNS(NS,'svg');
  s.setAttribute('width',Wd+80);s.setAttribute('height',H0);s.style.cssText='position:absolute;left:-40px;top:0;overflow:visible;pointer-events:none';
  var h='<defs><linearGradient id="flO" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFB040"/><stop offset=".35" stop-color="#F06A1A"/><stop offset=".75" stop-color="#B8260A" stop-opacity=".75"/><stop offset="1" stop-color="#6A1005" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="flI" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".45" stop-color="#FFD670"/><stop offset="1" stop-color="#FF9A30" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="flC" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#140603" stop-opacity=".95"/><stop offset=".5" stop-color="#3A1206" stop-opacity=".55"/><stop offset="1" stop-color="#3A1206" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="flG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A30" stop-opacity=".6"/><stop offset="1" stop-color="#FF8A30" stop-opacity="0"/></linearGradient></defs>'+
    '<rect x="0" y="'+(B-36)+'" width="'+(Wd+80)+'" height="38" fill="url(#flC)"/><rect x="0" y="'+B+'" width="'+(Wd+80)+'" height="24" fill="url(#flG)"/>'+
    '<rect x="0" y="'+(B-2)+'" width="'+(Wd+80)+'" height="4" fill="#FFD27A" style="filter:blur(1.5px)"/>';
  for(var i=0;i<n;i++){var x=(i+.5)*(Wd+80)/n+(Math.random()-.5)*14,w=14+Math.random()*22,hh=40+Math.random()*80,tx=(Math.random()-.5)*w*.6,
      o='M'+(x-w/2).toFixed(1)+' '+B+' C'+(x-w/2).toFixed(1)+' '+(B-hh*.42).toFixed(1)+' '+(x-w*.1+tx*.4).toFixed(1)+' '+(B-hh*.7).toFixed(1)+' '+(x+tx).toFixed(1)+' '+(B-hh).toFixed(1)+' C'+(x+w*.2+tx*.4).toFixed(1)+' '+(B-hh*.62).toFixed(1)+' '+(x+w/2).toFixed(1)+' '+(B-hh*.4).toFixed(1)+' '+(x+w/2).toFixed(1)+' '+B+' Z',
      hi=hh*.55,wi=w*.5,c='M'+(x-wi/2).toFixed(1)+' '+B+' C'+(x-wi/2).toFixed(1)+' '+(B-hi*.45).toFixed(1)+' '+(x+tx*.3).toFixed(1)+' '+(B-hi*.75).toFixed(1)+' '+(x+tx*.5).toFixed(1)+' '+(B-hi).toFixed(1)+' C'+(x+wi*.2).toFixed(1)+' '+(B-hi*.6).toFixed(1)+' '+(x+wi/2).toFixed(1)+' '+(B-hi*.4).toFixed(1)+' '+(x+wi/2).toFixed(1)+' '+B+' Z',
      d=(.22+Math.random()*.3).toFixed(2),dl=(-Math.random()).toFixed(2);
    h+='<g class="fl" style="animation-duration:'+d+'s;animation-delay:'+dl+'s"><path d="'+o+'" fill="url(#flO)"/><path d="'+c+'" fill="url(#flI)"/></g>';}
  s.innerHTML=h;P.appendChild(s);s._base=B;return s;}

/* Досье: в точном месте и размере верхней папки заметки собирается её копия: задник, листы, обложка закрывается,
   фото на скрепке, имя, штамп с номером дела; затем папка ложится на заметку и подменяется настоящей */
HOLD_OF.folder=3600;
var SKIP_CSS=/^(animation|transition|will-change|view-transition)/;
function cssCopy(src,dst,pseudo){var cs=getComputedStyle(src,pseudo||null),t=dst.style;
  for(var i=0;i<cs.length;i++){var n=cs[i];if(SKIP_CSS.test(n))continue;t.setProperty(n,cs.getPropertyValue(n));}}
function pseudoEl(src,which){var cs=getComputedStyle(src,which),c=cs.getPropertyValue('content');
  if(!c||c==='none'||c==='normal')return null;var e=document.createElement('span');cssCopy(src,e,which);
  e.textContent=c.replace(/^["']|["']$/g,'').replace(/\\"/g,'"');return e;}
function deepClone(src){var c=src.cloneNode(false);if(src.nodeType!==1)return c;cssCopy(src,c);c.removeAttribute('id');
  var b=pseudoEl(src,'::before');if(b)c.appendChild(b);
  for(var k=src.firstChild;k;k=k.nextSibling)c.appendChild(deepClone(k));
  var a=pseudoEl(src,'::after');if(a)c.appendChild(a);
  if(b)b.setAttribute('data-ps','b');if(a)a.setAttribute('data-ps','a');return c;}
function settleApp(){try{document.getAnimations().forEach(function(a){var t=a.effect&&a.effect.target;
  if(!t||!t.closest||!t.closest('#app'))return;var it=a.effect.getTiming().iterations;if(it===Infinity)return;try{a.finish();}catch(e){}});}catch(e){}}
WIPES.folder=function(W,fn){var H=innerHeight,Wd=innerWidth;
  var bg=dv(W,'inset:0;tex:grain;background:radial-gradient(ellipse at 50% 40%,#2C251C,#100D0A 72%);opacity:0');
  var inA=[[bg,[{opacity:0},{opacity:1}],320,'ease-in']],outA=[];
  var A=function(el,kf,dl,du,ez){return el.animate(kf,{duration:du*TSc,delay:dl*TSc,easing:ez||'ease',fill:'both'});};
  var go=function(){fn();setTimeout(function(){
    settleApp();var src=document.querySelector('#app .jcard-id');var r=src&&src.getBoundingClientRect();
    if(!r||r.width<60||getComputedStyle(src).display==='contents'){outA.push([bg,[{opacity:1},{opacity:0}],600,'ease-out']);return;}
    /* корпус: обёртка с точным прямоугольником, слегка приподнята над заметкой */
    var lift='translateY(-14px) scale(1.035)',wr=dv(W,'left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;perspective:2200px;transform-origin:50% 60%;transform:'+lift);
    var rep=deepClone(src);
    /* настоящая папка прячется, пока копия не ляжет на её место */
    src.style.visibility='hidden';setTimeout(function(){src.style.visibility='';},Math.max(0,HOLDc-70)+900*TSc*.56);
    var ps=rep.querySelectorAll('[data-ps]');
    var tab=null,dash=null;for(var i=0;i<ps.length;i++){if(ps[i].parentNode!==rep)continue;if(ps[i].getAttribute('data-ps')==='b')tab=ps[i];else dash=ps[i];}
    var cs=rep.style;cs.position='absolute';cs.left='0';cs.top='0';cs.margin='0';cs.width=r.width+'px';cs.height=r.height+'px';cs.boxSizing='border-box';cs.transform='none';
    /* задник: та же папка без содержимого, к нему крепится ярлык «Архив Камарильи» */
    var back=document.createElement('div');back.style.cssText='position:absolute;left:0;top:0;width:'+r.width+'px;height:'+r.height+'px;box-sizing:border-box;'+
      'background:'+cs.background+';border:'+cs.border+';border-radius:'+cs.borderRadius+';box-shadow:0 26px 50px -10px rgba(0,0,0,.7);filter:brightness(.82)';
    wr.appendChild(back);if(tab){back.appendChild(tab);tab.style.filter='brightness(1.2)';}
    /* листы дела */
    var rot=[-2.6,1.9,-.8],sh=[];for(var j=0;j<3;j++){var s=dv(wr,'left:16px;top:14px;right:16px;bottom:14px;tex:paper;background:linear-gradient(180deg,#F5EFE0,#E8DFC9);box-shadow:0 6px 14px rgba(0,0,0,.3)');
      dv(s,'left:9%;top:7%;width:46%;height:12px;background:#2B2620');for(var k=0;k<14;k++){var yy=18+k*5;if(yy>90)break;dv(s,'left:9%;top:'+yy+'%;height:4px;width:'+rn(50,82).toFixed(0)+'%;background:rgba(43,38,32,'+rn(.25,.55).toFixed(2)+')');}
      sh.push(s);}
    /* обложка = сама копия папки */
    cs.transformOrigin='0 50%';cs.backfaceVisibility='visible';wr.appendChild(rep);
    var por=rep.querySelector('.portrait'),hh=rep.querySelector('h1'),cn=rep.querySelector('.case-no'),inner=[];
    for(var c=rep.firstChild;c;c=c.nextSibling)if(c.nodeType===1&&c!==tab)inner.push(c);
    inner.forEach(function(e){e.style.opacity='0';});
    /* сборка */
    A(back,[{transform:'translateY('+(H-r.top+40)+'px)'},{transform:'translateY(-6px)',offset:.82},{transform:'none'}],0,560,'cubic-bezier(.3,.7,.3,1)');
    sh.forEach(function(s,j){var d=-H*1.1-r.top;A(s,[{transform:'translateY('+d.toFixed(0)+'px) rotate('+(rot[j]*4)+'deg)',opacity:1},{transform:'translateY(6px) rotate('+rot[j]+'deg)',offset:.8,opacity:1},{transform:'rotate('+rot[j]+'deg)',opacity:1}],300+j*150,540,'cubic-bezier(.35,.6,.3,1)');});
    A(rep,[{transform:'rotateY(-178deg)',filter:'brightness(.7)',opacity:0},{opacity:1,offset:.08},{transform:'rotateY(4deg)',filter:'brightness(1)',opacity:1,offset:.86},{transform:'rotateY(0deg)',filter:'brightness(1)',opacity:1}],900,620,'cubic-bezier(.45,0,.25,1)');
    sh.forEach(function(s){A(s,[{opacity:1},{opacity:0}],1500,10,'linear');});
    if(dash)A(dash,[{opacity:0},{opacity:1}],1450,260,'linear');
    inner.forEach(function(e){if(e!==por&&e!==hh&&e!==cn&&e!==dash)A(e,[{opacity:0},{opacity:1}],1480,240,'linear');});
    if(por){var pt=por.style.transform&&por.style.transform!=='none'?por.style.transform:'';
      A(por,[{opacity:0,transform:'translateY(-46px) '+pt+' rotate(4deg)'},{opacity:1,transform:'translateY(4px) '+pt,offset:.75},{opacity:1,transform:'translateY(0) '+pt}],1480,380,'cubic-bezier(.3,.7,.3,1)');
      var clip=por.querySelector('[data-ps="b"]');if(clip)A(clip,[{opacity:0,transform:'translateY(-14px)'},{opacity:1,transform:'none'}],1780,180,'cubic-bezier(.3,.7,.3,1)');}
    if(hh)A(hh,[{opacity:1,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],1820,420,'steps(14,end)');
    if(cn){var ct=cn.style.transform&&cn.style.transform!=='none'?cn.style.transform:'';
      A(cn,[{opacity:0,transform:ct+' scale(2.4)'},{opacity:1,transform:ct+' scale(.94)',offset:.7},{opacity:1,transform:ct+' scale(1)'}],2160,260,'cubic-bezier(.5,0,.6,1)');
      A(wr,[{transform:lift},{transform:lift+' translateY(3px)',offset:.4},{transform:lift}],2330,160,'ease-out');}
    /* папка ложится на заметку: опускается, фон уходит, копия растворяется в настоящей */
    outA.push([wr,[{transform:lift,opacity:1},{transform:'none',opacity:1,offset:.55},{transform:'none',opacity:1,offset:.78},{transform:'none',opacity:0}],900,'cubic-bezier(.5,0,.3,1)'],
      [back,[{boxShadow:'0 26px 50px -10px rgba(0,0,0,.7)'},{boxShadow:'0 6px 10px -6px rgba(0,0,0,.4)',offset:.55},{boxShadow:'0 6px 10px -6px rgba(0,0,0,.4)'}],900,'ease'],
      [bg,[{opacity:1},{opacity:1,offset:.2},{opacity:0,offset:.6},{opacity:0}],900,'ease-out']);
  },70);};
  return seq(inA,go,outA);};
/*ART-END*/
var WIPE_OF={alley:'blood',home:'ash',eden:'curtain',dossier:'folder',chronicle:'ink',vitrine:'vitrine',city:'subway',heraldry:'banner',reference:'dots',gallery:'brush',grimoire:'page',riot:'flag',ward:'ribbons',reading:'leaves'};
var lastNav=0;
function wipeKind(href){
  var to=routeKey(href),kt=kindOf(href),kf=kindOf();
  if(running.length&&Date.now()-lastNav<700)return null;
  if(kt==='home'&&kf!=='home')return 'ash';
  if(kt==='note'&&(kf==='home'||kf==='list')&&to&&WIPE_OF[to]){var ov=OVR[normH(href)];return ov&&ov.wp?ov.wp:WIPE_OF[to];}
  return null;}
function div(W,st){var d=document.createElement('div');d.style.cssText='position:absolute;'+st;W.appendChild(d);return d;}
var GLYPH_IMG={};
function glyph(W,name,col,fill,size){var g=div(W,'');
  if(GLYPH_IMG[name]){g.className='glyph silimg-'+name;if(size){var y=Math.round(size*.82);g.style.width=g.style.height=y+'px';g.style.margin=(-y/2)+'px 0 0 '+(-y/2)+'px';g.style.backgroundSize='contain';}}
  else if(GART[name]){g.className='glyph gx';var dk=isDark(col);
    g.innerHTML=engrave(name,col,fill||(dk?'rgba(40,20,10,.08)':'#120B0D'));
    var z=size||150;g.style.width=g.style.height=z+'px';g.style.margin=(-z/2)+'px 0 0 '+(-z/2)+'px';
    if(!dk)g.style.filter='drop-shadow(0 0 9px '+col+'66) drop-shadow(0 5px 12px rgba(0,0,0,.65))';}
  else{g.className='glyph sil-'+name;g.style.background=col;}
  g.style.opacity=0;return g;}
var running=[];
function seq(inA,fn,outA){
  var st={anims:[],fn:fn,done:false,called:false,finish:null};
  function call(){if(st.called)return;st.called=true;try{fn();}catch(e){}}
  function play(list){return Promise.all(list.map(function(x){var a=x[0].animate(x[1],{duration:x[2]*TSc,easing:x[3],fill:'forwards'});st.anims.push(a);return a.finished.catch(function(){});}));}
  st.promise=play(inA).then(function(){if(st.done)return;call();return new Promise(function(r){setTimeout(r,HOLDc);});})
    .then(function(){if(st.done)return;return play(outA);});
  st.finish=function(){st.done=true;call();st.anims.forEach(function(a){try{a.cancel();}catch(e){}});};
  return st;
}
function flushWipes(){running.forEach(function(s){s.finish();});running=[];var W=document.getElementById('rdWipe');if(W)W.innerHTML='';}
function wipeTo(href,pt){
  flushWipes();
  var kind=wipeKind(href)||'fade';
  TSc=(kind==='subway'||kind==='fade')?1:1.3;HOLDc=(kind==='subway'||kind==='fade')?60:(HOLD_OF[kind]||250);
  var W=document.getElementById('rdWipe');
  var hid=normH(href).split('/')[1];
  if(W){W.dataset.crest=CREST[hid]||'#8E3BC4';W.dataset.glyph=GLYPH[hid]||'';W.style.perspective='';W.style.setProperty('--ts',TSc);W.dataset.hid=hid;}
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
  if(!kind)return;
  e.preventDefault();wipeTo(href,{x:e.clientX,y:e.clientY});lastNav=Date.now();
},true);

function init(){
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
window.RD_TEST={TH:TH,applyTheme:applyTheme,decorate:decorate,wipeTo:wipeTo,WIPES:WIPES,glyph:glyph,GART:GART};
})();
