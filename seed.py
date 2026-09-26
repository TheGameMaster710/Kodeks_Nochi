import re
s=open('/home/claude/v5/kodeks-nochi.html').read()
# Each entry prepends a test record as the FIRST element of the array,
# so this keeps working even after an array already holds real content
# (matches only the array's opening bracket, not a full empty-array literal).
R={
"var DISCIPLINES=[":"""var DISCIPLINES=[{id:'dominate',name:'Доминирование',kind:'Ментальная',resonance:'Флегматическая',powers:[{lvl:1,name:'Забудь',cost:'проверка пробуждения',pool:'пул 6 / сл. 3',text:'Стирает минуту.'},{lvl:2,name:'Внушение',cost:'—',pool:'Харизма + Доминирование',text:'x'}]},""",
"var RITUALS=[":"""var RITUALS=[{id:'ward',name:'Оберег',kind:'Ритуал',lvl:1,cost:'проверка пробуждения',pool:'пул 5',text:'Защищает. Урон 2к10+1.'},""",
"var MERITS=[":"""var MERITS=[{id:'rich',name:'Богатство',kind:'Предыстория',dots:'•••',text:'Деньги.'},""",
"var LORESHEETS=[":"""var LORESHEETS=[{id:'l1',name:'Наследие Картаго',short:'лоршит',levels:[[1,'Слух','...'],[2,'Знание','...']]},""",
"var SECTS=[":"""var SECTS=[{id:'cam',name:'Камарилья',short:'Башня'},""",
"var PLAYERS=[":"""var PLAYERS=[{id:'vlad',name:'Влад',short:'рассказчик в отпуске',note:'играет редко'},""",
"var PCS=[":"""var PCS=[{id:'anna',player:'vlad',name:'Анна Ливен',short:'адвокат ночи',clan:'Вентру',sect:'Камарилья',gen:12,bp:1,sire:'Граф Мелдерис',predator:'Сирена',status:{'Камарилья':1},convictions:[['Не предавать клиентов','Марта Озола']],disciplines:[['Доминирование',2]],track:{healthMax:6,wpMax:5,humanity:7,hunger:2},playlist:{calm:'https://open.spotify.com/playlist/x',fight:'Боевой: техно'},concept:[['Образ','Холодная. Видела [[Князь Эрик|Князя]].']]},""",
"var PEOPLE=[":"""var PEOPLE=[{id:'meld',name:'Граф Мелдерис',clan:'Вентру',sect:'Камарилья',gen:9,role:'Сенешаль',status:{'Камарилья':3},short:'старый сир'},{id:'erik',name:'Князь Эрик',aliases:['Эрик'],clan:'Вентру',sect:'Камарилья',gen:8,track:{healthMax:8},short:'князь'},{id:'marta',name:'Марта Озола',short:'смертная, Якорь',role:'Якорь'},""",
"var PLACES=[":"""var PLACES=[{id:'old',name:'Старый город',short:'центр',ghosts:['Подвалы'],domain:'d1'},{id:'ely',name:'Элизиум Оперы',parent:'old',short:'нейтральная территория'},""",
"var DOMAINS=[":"""var DOMAINS=[{id:'d1',name:'Старая Рига',holder:'Князь Эрик',kind:'elysium',threat:1,shape:'300,200 500,180 540,360 320,380'},{id:'d2',name:'Московский форштадт',holder:'',kind:'contested',threat:4,shape:'560,380 760,360 800,520 580,540'},""",
"var THREATS=[":"""var THREATS=[{id:'inq',name:'Ячейка Инквизиции',kind:'Охотник',stat:[['Пул атаки','7']],short:'группа'},""",
"var BOONS=[":"""var BOONS=[{id:'b1',debtor:'Анна Ливен',creditor:'Граф Мелдерис',level:'minor',status:'open',why:'укрытие',n:1},{id:'b2',debtor:'Эрик',creditor:'Анна Ливен',level:'trivial',status:'paid',why:'слух',n:2},""",
"var BONDS=[":"""var BONDS=[{thrall:'Анна Ливен',regnant:'Граф Мелдерис',level:2,note:'дважды'},""",
"var RELATIONS=[":"""var RELATIONS=[{a:'Анна Ливен',b:'Князь Эрик',type:'rival',note:'спор'},""",
"var CHRON=[":"""var CHRON=[{kind:'night',when:'Ночь 1',title:'Приезд',text:'Анна прибыла. [[Анна Ливен]]'},{kind:'memoriam',when:'1905',title:'Обращение',text:'x'},""",
"var SESSIONS=[":"""var SESSIONS=[{n:1,items:['Начало с [[Князь Эрик]].',{t:'Анна выступила на Элизиуме.',status:{who:'Анна Ливен',sect:'Камарилья',delta:1}},{t:'Видео в сети.',masq:2}]},{n:2,items:[{t:'Долг',boon:'b1',bond:'Анна → Граф, 2'},{t:'Позор',status:{who:'Граф Мелдерис',sect:'Камарилья',delta:-1},masq:1}]},""",
"var ACTIVE_SESSION={\n n:null,":"var ACTIVE_SESSION={\n n:3,flow:[{t:'Сцена в [[Элизиум Оперы]] пул 4',kids:[{t:'альт',cls:'alt'}]}],name:'Опера',",
}
for k,v in R.items():
    assert k in s, k
    s=s.replace(k,v,1)
s=s.replace("title:'',                /* название хроники","title:'Ночи Риги',                /* название хроники")
open('/home/claude/v5/seeded.html','w').write(s)
print('ok')
