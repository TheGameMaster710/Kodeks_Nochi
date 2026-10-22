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

var FAMILY={person:'dossier',player:'dossier',threat:'dossier',lore:'chronicle',item:'vitrine',place:'city',domain:'city',
  clan:'heraldry',sect:'heraldry',merit:'reference',disc:'reference',ritual:'reference',predator:'reference'};
var ACCENT={'place/eden':'eden','predator/stray-cat':'alley','item/seymour-painting':'gallery','item/payne-diary':'grimoire','sect/anarchs':'riot'};
var GLYPH={'sparrow-ring':'sparrow','seymour-painting':'frame','payne-diary':'book',tremere:'tremere',brujah:'brujah',nosferatu:'bat',camarilla:'rose',anarchs:'fist'};
var CREST={tremere:'#9B4DD6',brujah:'#D7263D',nosferatu:'#7E9B5A',camarilla:'#C9A44C'};
var TEST_ONLY=false;
var TEST=[['','Титул','лента сцен'],['cat/people','Списки разделов','каталожный ящик'],['person/heinz','Личности','досье'],
  ['domain/brownsville','Домены и локации','уличный указатель'],['place/eden','Ключевая запись','личный акцент'],['lore/hecate-war','Лоршиты','летопись'],
  ['item/sparrow-ring','Предметы','витрина'],['clan/tremere','Кланы и секты','геральдика'],['merit/war-legacy','Механика','справочник'],['tool/masq','Инструменты','без изменений']];
var TEST_SET={};TEST.forEach(function(x){TEST_SET[x[0]]=1;});
function normH(h){return (h==null?location.hash:h).replace(/^#\/?/,'').replace(/\?.*$/,'');}
function kindOf(h){h=normH(h);if(h===''||h==='world'||h==='cons'||h==='tools'||h==='cats')return 'home';
  if(/^cat\//.test(h))return 'list';if(/^(tool|pc|coterie|player|master|admin)\//.test(h))return 'work';
  if(/^[\w-]+\/[\w-]+$/.test(h))return 'note';return 'other';}
var FONTQ={'Playfair Display SC':'Playfair+Display+SC:wght@400;700','Marck Script':'Marck+Script','PT Mono':'PT+Mono',
  'Old Standard TT':'Old+Standard+TT:ital,wght@0,400;0,700;1,400','Forum':'Forum',
  'Oswald':'Oswald:wght@500;600','Prata':'Prata','Rubik Burned':'Rubik+Burned','Bad Script':'Bad+Script','Kurale':'Kurale','PT Serif':'PT+Serif:ital,wght@0,400;0,700;1,400'};
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
  'crest-camarilla':function(){return SCENES.banners()+sil('rose','s-crest-camarilla-1')+sil('rose','s-crest-camarilla-2')+sil('rose','s-crest-camarilla-3');},
  riot:function(){return '<div class="smoke a"></div><div class="smoke b"></div><div class="glow"></div>'+sil('crowd','s-riot-1');},
  vitrine:function(){return '<div class="velvet"></div><div class="spot"></div>'+sil('sparrow','s-vitrine-1');}
};

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
  if(kind==='embers'||kind==='sparks')return {x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*1.8+.6,vy:-(Math.random()*.6+.25),vx:(Math.random()-.5)*.3,ph:Math.random()*6.28,life:Math.random()};
  return {x:Math.random()*(W+200)-100,y:init?Math.random()*H:-20,l:Math.random()*14+8,v:Math.random()*4+7};}
function draw(dt){var g=FX.ctx,W=innerWidth,H=innerHeight;g.clearRect(0,0,W,H);
  FX.parts.forEach(function(p,i){
    if(FX.kind==='embers'||FX.kind==='sparks'){var sp=FX.kind==='sparks';p.ph+=.03*dt;p.x+=(p.vx+Math.sin(p.ph)*.25)*dt;p.y+=p.vy*(sp?1.8:1)*dt;
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
  if(cur!==t.key){cur=t.key;buildScene(t,deco,instant);}
}
function buildScene(t,deco,instant){
  try{if(curScene===t.o.sc)return;curScene=t.o.sc;
    var html='<div class="sc sc-'+t.o.sc+'">'+(SCENES[t.o.sc]?SCENES[t.o.sc]():'')+'</div>';
    var olds=[].slice.call(deco.children),nw=document.createElement('div');nw.className='sc-wrap';nw.innerHTML=html;
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
  fade:function(W,fn){var d=div(W,'inset:0;background:#08050A;opacity:0');
    return seq([[d,[{opacity:0},{opacity:1}],220,'ease-in']],fn,[[d,[{opacity:1},{opacity:0}],260,'ease-out']]);}
};
var WIPE_OF={alley:'blood',home:'ash',eden:'curtain',dossier:'folder',chronicle:'ink',vitrine:'vitrine',city:'subway',heraldry:'banner',reference:'dots',gallery:'brush',grimoire:'page',riot:'flag'};
var lastNav=0;
function wipeKind(href){
  var to=routeKey(href),kt=kindOf(href),kf=kindOf();
  if(running.length&&Date.now()-lastNav<700)return null;
  if(kt==='home'&&kf!=='home')return 'ash';
  if(kt==='note'&&(kf==='home'||kf==='list')&&to&&WIPE_OF[to])return WIPE_OF[to];
  return null;}
function div(W,st){var d=document.createElement('div');d.style.cssText='position:absolute;'+st;W.appendChild(d);return d;}
var GLYPH_IMG={rose:1};
function glyph(W,name,col){var g=div(W,'');
  if(GLYPH_IMG[name])g.className='glyph silimg-'+name;else{g.className='glyph sil-'+name;g.style.background=col;}
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
window.RD_TEST={TH:TH,applyTheme:applyTheme,decorate:decorate,wipeTo:wipeTo};
})();
