cd /home/claude/v5
# Публичные данные не должны содержать тайн — они живут в p2_gm.js (§1.3.4)
if grep -q "gm:true" p2_data.html; then echo "ОШИБКА: gm:true в p2_data.html — перенеси в p2_gm.js"; exit 1; fi
{ head -n1 p1_head.html; cat p0_comment.html; tail -n +2 p1_head.html; cat p2_data.html p3a_core.js p3b_pages.js p3c_dice.js p3d_tools.js p3f_auth.js p3g_pcsync.js p3h_coterie.js p3i_gm.js p3j_sheet.js p3e_home.js; } > kodeks-nochi.html
python3 -c "
s=open('kodeks-nochi.html').read()
open('check.js','w').write(s[s.rindex('<script>')+8:s.rindex('</script>')])"
node --check check.js && echo SYNTAX_OK
node make_gm_json.js
# Проверка текста (RULES.md, «Процесс работы»): утечки тайн и ссылки в никуда останавливают сборку
python3 check_text.py || { echo 'СБОРКА ОСТАНОВЛЕНА: исправь ошибки check_text'; exit 1; }
