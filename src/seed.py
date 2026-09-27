import re
s=open('/home/claude/v5/kodeks-nochi.html').read()
# Each entry prepends a test record as the FIRST element of the array,
# so this keeps working even after an array already holds real content
# (matches only the array's opening bracket, not a full empty-array literal).
# ВАЖНО (см. баг v1.35 при внедрении живых листов персонажей): ключи ниже
# намеренно начинаются с "\n" — реальное объявление вида "var PCS=[" всегда
# стоит в начале строки в p2_data.html, а голая строка без "\n" может
# случайно совпасть с упоминанием того же кода ВНУТРИ прозы документации
# в p0_comment.html (например «...ПУСТ (var PCS=[];)...» в §1.3.1) — тогда
# .replace(k,v,1) молча портит комментарий вместо настоящих данных, а
# реальный массив остаётся пустым. Никогда не убирать "\n" здесь без
# крайней необходимости; assert ниже дополнительно проверяет ровно одно
# совпадение АНКЕРЕННОГО ключа перед заменой, чтобы такая коллизия падала
# явной ошибкой, а не тихо ломала тестовые данные.
R={
"\nvar DISCIPLINES=[":"""\nvar DISCIPLINES=[{id:'dominate',name:'Доминирование',kind:'Ментальная',resonance:'Флегматическая',powers:[{lvl:1,name:'Забудь',cost:'проверка пробуждения',pool:'пул 6 / сл. 3',text:'Стирает минуту.'},{lvl:2,name:'Внушение',cost:'—',pool:'Харизма + Доминирование',text:'x'}]},""",
"\nvar RITUALS=[":"""\nvar RITUALS=[{id:'ward',name:'Оберег',kind:'Ритуал',lvl:1,cost:'проверка пробуждения',pool:'пул 5',text:'Защищает. Урон 2к10+1.'},""",
"\nvar MERITS=[":"""\nvar MERITS=[{id:'rich',name:'Богатство',kind:'Предыстория',dots:'•••',text:'Деньги.'},""",
"\nvar LORESHEETS=[":"""\nvar LORESHEETS=[{id:'l1',name:'Наследие Картаго',short:'лоршит',levels:[[1,'Слух','...'],[2,'Знание','...']]},""",
"\nvar SECTS=[":"""\nvar SECTS=[{id:'cam',name:'Камарилья',short:'Башня'},""",
"\nvar PLAYERS=[":"""\nvar PLAYERS=[{id:'vlad',name:'Влад',short:'рассказчик в отпуске',note:'играет редко'},""",
"\nvar PCS=[":"""\nvar PCS=[{id:'anna',player:'vlad',name:'Анна Ливен',short:'адвокат ночи',clan:'Вентру',sect:'Камарилья',gen:12,bp:1,sire:'Граф Мелдерис',predator:'Сирена',status:{'Камарилья':1},convictions:[['Не предавать клиентов','Марта Озола']],disciplines:[['Доминирование',2]],track:{healthMax:6,wpMax:5,humanity:7,hunger:2},playlist:{calm:'https://open.spotify.com/playlist/x',fight:'Боевой: техно'},concept:[['Образ','Холодная. Видела [[Князь Эрик|Князя]].']]},""",
"\nvar PEOPLE=[":"""\nvar PEOPLE=[{id:'meld',name:'Граф Мелдерис',clan:'Вентру',sect:'Камарилья',gen:9,role:'Сенешаль',status:{'Камарилья':3},short:'старый сир'},{id:'erik',name:'Князь Эрик',aliases:['Эрик'],clan:'Вентру',sect:'Камарилья',gen:8,track:{healthMax:8},short:'князь'},{id:'marta',name:'Марта Озола',short:'смертная, Якорь',role:'Якорь'},""",
"\nvar PLACES=[":"""\nvar PLACES=[{id:'old',name:'Старый город',short:'центр',ghosts:['Подвалы'],domain:'d1'},{id:'ely',name:'Элизиум Оперы',parent:'old',short:'нейтральная территория'},""",
"\nvar DOMAINS=[":"""\nvar DOMAINS=[{id:'d1',name:'Старая Рига',holder:'Князь Эрик',kind:'elysium',threat:1,shape:'300,200 500,180 540,360 320,380'},{id:'d2',name:'Московский форштадт',holder:'',kind:'contested',threat:4,shape:'560,380 760,360 800,520 580,540'},""",
"\nvar THREATS=[":"""\nvar THREATS=[{id:'inq',name:'Ячейка Инквизиции',kind:'Охотник',stat:[['Пул атаки','7']],short:'группа'},""",
"\nvar BOONS=[":"""\nvar BOONS=[{id:'b1',debtor:'Анна Ливен',creditor:'Граф Мелдерис',level:'minor',status:'open',why:'укрытие',n:1},{id:'b2',debtor:'Эрик',creditor:'Анна Ливен',level:'trivial',status:'paid',why:'слух',n:2},""",
"\nvar BONDS=[":"""\nvar BONDS=[{thrall:'Анна Ливен',regnant:'Граф Мелдерис',level:2,note:'дважды'},""",
"\nvar RELATIONS=[":"""\nvar RELATIONS=[{a:'Анна Ливен',b:'Князь Эрик',type:'rival',note:'спор'},""",
"\nvar CHRON=[":"""\nvar CHRON=[{kind:'night',when:'Ночь 1',title:'Приезд',text:'Анна прибыла. [[Анна Ливен]]'},{kind:'memoriam',when:'1905',title:'Обращение',text:'x'},""",
"\nvar SESSIONS=[":"""\nvar SESSIONS=[{n:1,items:['Начало с [[Князь Эрик]].',{t:'Анна выступила на Элизиуме.',status:{who:'Анна Ливен',sect:'Камарилья',delta:1}},{t:'Видео в сети.',masq:2}]},{n:2,items:[{t:'Долг',boon:'b1',bond:'Анна → Граф, 2'},{t:'Позор',status:{who:'Граф Мелдерис',sect:'Камарилья',delta:-1},masq:1}]},""",
"\nvar ACTIVE_SESSION={\n n:null,":"\nvar ACTIVE_SESSION={\n n:3,flow:[{t:'Сцена в [[Элизиум Оперы]] пул 4',kids:[{t:'альт',cls:'alt'}]}],name:'Опера',",
}
for k,v in R.items():
    n=s.count(k)
    assert n==1, "ожидали ровно 1 совпадение %r, нашли %d — проверь, не появился ли такой же текст в комментарии p0_comment.html" % (k,n)
    s=s.replace(k,v,1)
s=s.replace("title:'',                /* название хроники","title:'Ночи Риги',                /* название хроники")
open('/home/claude/v5/seeded.html','w').write(s)
print('ok')
