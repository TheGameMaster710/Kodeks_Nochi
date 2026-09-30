# Граф (v1.52): цвета типов различимы; параллельные стрелки не перекрывают друг друга
import sys,os,itertools,math
from playwright.sync_api import sync_playwright
f=sys.argv[1] if len(sys.argv)>1 else '/mnt/user-data/outputs/kodeks-nochi-v1.52.html'
JS_SAMPLE="""()=>[...document.querySelectorAll('#web path.edge')].map(p=>{const L=p.getTotalLength(),n=Math.max(12,Math.floor(L/6));const a=[];for(let i=0;i<=n;i++){const q=p.getPointAtLength(L*i/n);a.push([q.x,q.y]);}return a;})"""
def overlap(A,B,tol=5):
    # длина части B, лежащая в пределах tol от ломаной A (в px сцены)
    def dseg(p,a,b):
        dx,dy=b[0]-a[0],b[1]-a[1];L=dx*dx+dy*dy
        t=0 if L==0 else max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L))
        return math.hypot(a[0]+t*dx-p[0],a[1]+t*dy-p[1])
    n=0
    for p in B:
        if min(dseg(p,A[k],A[k+1]) for k in range(len(A)-1))<tol:n+=1
    return n
with sync_playwright() as pw:
    b=pw.chromium.launch();pg=b.new_page(viewport={'width':1200,'height':800})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+f);pg.wait_for_timeout(800)
    cols=pg.evaluate("Object.values(REL_TYPES).map(v=>v[1])")
    print('цвета уникальны:',len(set(cols))==len(cols),cols)
    pg.evaluate("location.hash='#/tool/web'");pg.wait_for_timeout(1500)
    edges=pg.evaluate("WEB_DBG.edges.map(e=>[e.a.id,e.b.id])")
    print('рёбер',len(edges))
    paths=pg.evaluate(JS_SAMPLE)
    pk=lambda e:tuple(sorted(e))
    bad=0
    for i,j in itertools.combinations(range(len(edges)),2):
        if pk(edges[i])==pk(edges[j]):continue
        # общий узел допускаем у самых концов: считаем только «длинные» совпадения
        ov=overlap(paths[i],paths[j])
        if ov>=8:bad+=1;print('перекрытие',edges[i],edges[j],ov)
    print('реальный граф: перекрытий',bad)
    # синтетика: две коллинеарные стрелки разных пар
    pair=None
    for i,j in itertools.combinations(range(len(edges)),2):
        if len({*edges[i],*edges[j]})==4:pair=(i,j);break
    print('синтетика на рёбрах',pair)
    pg.evaluate("""([i,j])=>{const E=WEB_DBG.edges;E[i].a.x=200;E[i].a.y=300;E[i].b.x=600;E[i].b.y=300;
      E[j].a.x=300;E[j].a.y=302;E[j].b.x=700;E[j].b.y=302;WEB_DBG.place();}""",list(pair))
    P=pg.evaluate(JS_SAMPLE);i,j=pair
    ov=overlap(P[i],P[j]);print('синтетика после раскладки: точек перекрытия',ov,'из',len(P[j]))
    # узел на пути стрелки
    pg.evaluate("""([i,j])=>{const E=WEB_DBG.edges,N=WEB_DBG.N;E[i].a.x=100;E[i].a.y=500;E[i].b.x=800;E[i].b.y=500;
      const n=N.find(x=>x!==E[i].a&&x!==E[i].b&&x!==E[j].a&&x!==E[j].b);n.x=450;n.y=502;N.forEach(m=>{if(m!==n&&m!==E[i].a&&m!==E[i].b&&Math.abs(m.y-500)<45)m.y=120;});WEB_DBG.place();}""",list(pair))
    P=pg.evaluate(JS_SAMPLE)
    nid=pg.evaluate("(()=>{const E=WEB_DBG.edges,N=WEB_DBG.N;return N.findIndex(x=>x.x==450&&x.y==502)})()")
    md=min(math.hypot(p[0]-450,p[1]-502) for p in P[pair[0]])
    print('минимальное расстояние стрелки до узла на пути: %.1f'%md)
    print('ошибки',errs)
    ok=bad==0 and ov<3 and md>12 and len(set(cols))==len(cols) and not errs
    print('OK' if ok else 'FAIL');sys.exit(0 if ok else 1)
