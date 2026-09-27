cd /home/claude/v5
{ head -n1 p1_head.html; cat p0_comment.html; tail -n +2 p1_head.html; cat p2_data.html p3a_core.js p3b_pages.js p3c_dice.js p3d_tools.js p3f_auth.js p3g_pcsync.js p3e_home.js; } > kodeks-nochi.html
python3 -c "
s=open('kodeks-nochi.html').read()
open('check.js','w').write(s[s.rindex('<script>')+8:s.rindex('</script>')])"
node --check check.js && echo SYNTAX_OK
