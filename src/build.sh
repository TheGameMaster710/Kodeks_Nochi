cd /home/claude/v5
# Публичные данные не должны содержать тайн — они живут в p2_gm.js (§1.3.4)
if grep -q "gm:true" data.js; then echo "ОШИБКА: gm:true в data.js — перенеси в p2_gm.js"; exit 1; fi
V=$(sed -n 's/.*<meta name="version" content="v\([0-9.]*\)".*/\1/p' p1_head.html)
# Сайт = три файла рядом: index.html (страница и код), style.css (оформление), data.js (тексты хроники)
cat p1_style.css p3k_design.css p3z_util.css p3l_music.css > style.css
{ cat p1_head.html p2_body.html p3a_core.js p3b_pages.js p3c_dice.js p3d_tools.js p3f_auth.js p3g_pcsync.js p3h_coterie.js p3i_gm.js p3j_sheet.js p3k_design.js p3l_music.js p3e_home.js; } \
  | sed "s|href=\"style.css\"|href=\"style.css?v=$V\"|; s|src=\"data.js\"|src=\"data.js?v=$V\"|" > index.html
# kodeks-nochi.html — тот же сайт одним файлом (офлайн, проверки, тесты, предпросмотр)
python3 -c "
s=open('index.html').read();css=open('style.css').read();data=open('data.js').read()
import re
s,a=re.subn(r'<link rel=\"stylesheet\" href=\"style\.css[^\"]*\">',lambda m:'<style>\n'+css+'</style>',s)
s,b=re.subn(r'<script src=\"data\.js[^\"]*\"></script>',lambda m:'<script>\n'+data+'</script>',s)
assert a==1 and b==1,(a,b)
open('kodeks-nochi.html','w').write(s)
open('check.js','w').write(s[s.rindex('<script>')+8:s.rindex('</script>')])"
node --check data.js && node --check check.js && echo SYNTAX_OK
node make_gm_json.js
# Проверка текста (RULES.md, «Процесс работы»): утечки тайн и ссылки в никуда останавливают сборку
python3 check_text.py || { echo 'СБОРКА ОСТАНОВЛЕНА: исправь ошибки check_text'; exit 1; }
