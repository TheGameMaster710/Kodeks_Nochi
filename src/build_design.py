# Слой оформления p3k_design.js с v2.08 входит в основную сборку (build.sh).
# Этот скрипт оставлен для совместимости: просто собирает предпросмотр.
import subprocess
print(subprocess.check_output(['python3','build_preview.py'],text=True).strip())
