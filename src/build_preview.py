# Копия для телефона (§1.3.4): без Firebase, вход пропущен, портреты встроены.
import base64,glob,re
s=open('kodeks-nochi.html').read()
assert s.count('var KODEKS_PREVIEW=false;')==1
s=s.replace('var KODEKS_PREVIEW=false;','var KODEKS_PREVIEW=true;')
# SDK Firebase в предпросмотре не нужен — не тянем его из сети
s,k=re.subn(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\n?','',s)
assert k==3,k
for f in glob.glob('images/*.jpg'):
    s=s.replace("'"+f+"'","'data:image/jpeg;base64,"+base64.b64encode(open(f,'rb').read()).decode()+"'")
for f in glob.glob('images/*.svg'):
    s=s.replace("'"+f+"'","'data:image/svg+xml;base64,"+base64.b64encode(open(f,'rb').read()).decode()+"'")
# мастерский слой встраиваем целиком — файл личный, для телефона рассказчика
import json
L=json.load(open('gm-layer.json'))
assert s.count('var GM_LAYER_EMBED=null;')==1
s=s.replace('var GM_LAYER_EMBED=null;','var GM_LAYER_EMBED='+json.dumps(L,ensure_ascii=False)+';')
v=re.search(r'Шаблон (v[0-9.]+)',s).group(1)
out='/mnt/user-data/outputs/kodeks-nochi-'+v+'.html'
open(out,'w').write(s); print(out)
