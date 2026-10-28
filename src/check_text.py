#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Проверка текста «Кодекса Ночи». Запускается из build.sh после сборки.

ОШИБКИ (сборка останавливается, код возврата 1):
  1. Утечка тайны: фраза из gm_secrets.txt найдена в открытом файле
     (index.html, data.js, style.css, RULES.md, CHANGELOG.md).
  2. Ссылка [[...]] ведёт в никуда: нет ни записи, ни заготовки, ни
     справочника с таким именем.

ПРЕДУПРЕЖДЕНИЯ (показываются только новые, сборку не останавливают):
  3. Кусок текста из мастерского слоя (7 слов подряд) дословно стоит в
     открытых данных: либо утечка, либо законный повтор открытой версии.
  4. Слово повторено в абзаце три раза и больше.
  5. Запрещённые слова и слова, склеенные дефисом.
  6. У записи меньше 4 или больше 8 тегов.
  7. Рядом с названием события стоит год, не совпадающий с каноном.
  8. Естественность (с v2.11): книжные и канцелярские обороты (КНИЖНО),
     предложения длиннее 30 слов (ДЛИННО), цепочки отглагольных
     существительных (КАНЦЕЛЯРИТ), предложения без подлежащего (БЕЗ
     ПОДЛЕЖАЩЕГО), «Сам он / Сама она» в начале предложения (САМ ОН).

  python3 check_text.py --style    — показать ВСЕ находки естественности
                                     по всему документу, включая принятые

  python3 check_text.py            — проверить
  python3 check_text.py --accept   — принять текущие предупреждения
                                     (записать в lint_baseline.json)
"""
import re, sys, json, os, hashlib

HERE = os.path.dirname(os.path.abspath(__file__))
def rd(name):
    p = os.path.join(HERE, name)
    return open(p, encoding='utf-8').read() if os.path.exists(p) else ''

data = rd('data.js')
gm = rd('p2_gm.js')
gm = gm[gm.index('var GM_LAYER'):] if 'var GM_LAYER' in gm else gm
public_files = {n: rd(n) for n in ('index.html', 'data.js', 'style.css', 'RULES.md', 'CHANGELOG.md')}
a, b = data.index('var CLANS=['), data.index('var CITY_MAP=')
notes = data[a:b]

errors, warns = [], []
STR = re.compile(r"'((?:[^'\\]|\\.)*)'")
def plain(t):
    t = re.sub(r"\[\[([^\]|]*\|)?([^\]]*)\]\]", r"\2", t)
    return t.replace('\\n', ' ').replace('**', '')
def words(t):
    return re.findall(r"[А-Яа-яЁёA-Za-z0-9−]+", t)

# ---------- 1. тайны по списку ----------
secrets = [l.strip() for l in rd('gm_secrets.txt').split('\n') if l.strip() and not l.startswith('#')]
for name, text in public_files.items():
    low = text.lower()
    for s in secrets:
        if s.lower() in low:
            errors.append('УТЕЧКА: «%s» найдено в %s' % (s, name))

# ---------- 2. дословные куски мастерского слоя ----------
pub_norm = ' '.join(w.lower() for w in words(plain(notes)))
seen = set()
for m in STR.finditer(gm):
    t = m.group(1)
    if len(t) < 60:
        continue
    for para in t.split('\\n\\n'):
        ws = [w.lower() for w in words(plain(para))]
        for i in range(0, max(0, len(ws) - 6)):
            sh = ' '.join(ws[i:i + 7])
            if sh in pub_norm and sh not in seen:
                seen.add(sh)
                warns.append('ДОСЛОВНО: кусок мастерского слоя стоит и в открытых данных: «…%s…»' % sh)
                break

# ---------- 3. ссылки в никуда ----------
names = set(re.findall(r"name:'([^']+)'", data))
for al in re.findall(r"aliases:\[([^\]]*)\]", data):
    names |= set(re.findall(r"'([^']+)'", al))
gh = data[data.index('var GHOSTS='):] if 'var GHOSTS=' in data else ''
gh = gh[:gh.index('};') + 1] if gh else ''
names |= set(re.findall(r"'([^']+)'", gh))
# справочники системы: названия кланов и дисциплин в любых массивах данных
names |= set(re.findall(r"\['([А-ЯЁ][А-Яа-яё ]+)',", data))
names |= set(re.findall(r"disciplines:\[([^\]]*)\]", data) and
             re.findall(r"'([^']+)'", ' '.join(re.findall(r"disciplines:\[([^\]]*)\]", data))))
names |= set(re.findall(r"clan:'([^']+)'", data)) | set(re.findall(r"n:'([^']+)'", data))
extra = [l.strip() for l in rd('lint_links_ok.txt').split('\n') if l.strip()]
names |= set(extra)
for src_name, src in (('p2_data.html', notes), ('p2_gm.js', gm)):
    for target in set(re.findall(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", src)):
        if target.strip() not in names:
            errors.append('ССЫЛКА В НИКУДА: [[%s]] в %s' % (target, src_name))

# ---------- 4. повторы ----------
STOP = {'котор', 'когда', 'чтобы', 'только', 'этого', 'него', 'если', 'были', 'была', 'было',
        'после', 'также', 'может', 'могут', 'свою', 'своей', 'своих', 'своим', 'свои', 'этом',
        'этой', 'этих', 'более', 'около', 'между', 'перед', 'через', 'точки', 'точку', 'точек'}
def entry_of(pos, src):
    m = None
    for m in re.finditer(r"\{id:'([^']+)'", src[:pos]):
        pass
    return m.group(1) if m else '?'
for src_name, src in (('p2_data', notes), ('p2_gm', gm)):
    for m in STR.finditer(src):
        t = m.group(1)
        if len(t) < 60:
            continue
        for para in t.split('\\n\\n'):
            c = {}
            for w in re.findall(r"[А-Яа-яЁё]{4,}", plain(para)):
                k = w.lower()[:5] if len(w) > 5 else w.lower()
                c[k] = c.get(k, 0) + 1
            bad = sorted(k for k, v in c.items() if v >= 3 and k not in STOP)
            if bad:
                warns.append('ПОВТОР (%s/%s): %s — «%s…»' % (src_name, entry_of(m.start(), src), ', '.join(bad), plain(para)[:70]))

# ---------- 4б. близкий повтор (сказано рассказчиком 22.10.2026) ----------
# Одно слово не повторяется в пределах одного-двух соседних предложений.
# Не считаются: жирные метки, ссылка-метка в начале строки связей, ссылки в скобках,
# названия в «ёлочках», термины механики и имена из NEAR_OK.
NEAR_STOP = STOP | set('тольк либо этот эти этим того тому тоже всех всего весь всем даже ними своё свой своег своем такой такие такая такое один одна одно одни одного есть быть будет него неё сама само сами самы самог где тот той там тут здесь потом пока ещё уже лишь очень почти себе себя собой чего чему кого кому каждый каждо каждая этому этими всеми всё все вся всю'.split())
NEAR_OK = {'стату', 'голод', 'пяти', 'дэвид', 'сигар'}
def near_stems(s):
    out = []
    for w in re.findall(r"[А-Яа-яЁё]{4,}", s):
        k = w.lower()[:5] if len(w) > 5 else w.lower()
        if k not in NEAR_STOP and k not in NEAR_OK:
            out.append(k)
    return out
for src_name, src in (('p2_data', notes), ('p2_gm', gm)):
    for m in STR.finditer(src):
        t = m.group(1)
        if len(t) < 40:
            continue
        for para in t.split('\\n\\n'):
            q = re.sub(r"\*\*[^*]+\*\*", "", para)
            q = re.sub(r"^(\[\[[^\]]+\]\](,| и)? ?)+ — ", "", q)
            q = re.sub(r"\s*\(\[\[[^\]]+\]\]\)", "", q)
            q = re.sub(r"«[^»]*»", "", q)
            sents = [x for x in re.split(r"(?<=[.!?…])\s+", plain(q)) if x]
            seen = set()
            for i in range(len(sents)):
                c = {}
                for k in near_stems(' '.join(sents[i:i + 2])):
                    c[k] = c.get(k, 0) + 1
                bad = sorted(k for k, v in c.items() if v >= 2 and k not in seen)
                if bad:
                    seen |= set(bad)
                    warns.append('БЛИЗКО (%s/%s): %s — «%s…»' % (src_name, entry_of(m.start(), src), ', '.join(bad), ' '.join(sents[i:i + 2])[:70]))

# ---------- 5. запрещённые слова ----------
BANNED = [(r'днева[тл]', 'слова «дневать» нет: «проводить день»'),
          (r'окончательн\w+ смерт', '«окончательная смерть» не пишется'),
          (r'бесталанн', 'официальный термин — Непризнанные'),
          (r'игрокам не раскрыва', 'команды мастеру в тексте не пишутся')]
HY_OK = re.compile(r"^(кто|что|где|как|когда|какой|какая|какое|какие|какого|какую|чей|чего|кого|кому|чем|куда|откуда|почему|зачем)-(то|нибудь|либо)$|"
                   r"^\w+-(то|нибудь|либо)$|^(из-за|из-под|всё-таки|все-таки|по-\w+|во-первых|во-вторых|кое-\w+|-то|готик-рок|нью-йорк\w*|стейтен-айленд\w*|фреш-киллс|проспект-парк\w*)$")
for src_name, src in (('p2_data', notes), ('p2_gm', gm)):
    for m in STR.finditer(src):
        t = plain(m.group(1))
        if len(t) < 20:
            continue
        for rx, why in BANNED:
            if re.search(rx, t, re.I):
                warns.append('СЛОВО (%s/%s): %s — «%s…»' % (src_name, entry_of(m.start(), src), why, t[:60]))
        for h in re.findall(r"[А-Яа-яЁё]{3,}-[А-Яа-яЁё]{2,}", t):
            if not HY_OK.match(h.lower()):
                warns.append('ДЕФИС (%s/%s): «%s»' % (src_name, entry_of(m.start(), src), h))

# ---------- 5б. естественность (сказано рассказчиком 28.10.2026) ----------
# Текст должен звучать разговорно, как рассказ мастера, а не как роман или
# канцелярия. Список ловит типичные книжные обороты; решение за человеком.
BOOKISH = [
    (r'\bвпрочем\b', '«впрочем» — книжно: «но», «правда»'),
    (r'\bтаков(ой|ым|ая|ую|ое|ого|ых)\b', '«таковой» — книжно: «им», «такой»'),
    (r'\b(оный|оная|оное|оного)\b', '«оный» — архаизм'),
    (r'\bко(его|ей|их|ему)\b', '«коего» — архаизм: «которого»'),
    (r'\bдабы\b', '«дабы» — архаизм: «чтобы»'),
    (r'\bибо\b', '«ибо» — книжно: «потому что»'),
    (r'\b(сей|сия|сие|сего|сему|сим)\b', '«сей» — архаизм: «этот»'),
    (r'\bвесьма\b', '«весьма» — книжно: «очень»'),
    (r'\bданн(ый|ая|ое|ого|ом|ой|ую|ых)\b', '«данный» — канцелярит: «этот»'),
    (r'\bявля(е|ю)тся\b', '«является» — канцелярит: «это», «служит»'),
    (r'\bосуществля', '«осуществлять» — канцелярит: «делать», «вести»'),
    (r'\bпосредством\b', '«посредством» — канцелярит: «через», «с помощью»'),
    (r'\bв рамках\b', '«в рамках» — канцелярит'),
    (r'\b(ввиду|вследствие)\b', '«ввиду», «вследствие» — канцелярит: «из-за»'),
    (r'\bв целях\b', '«в целях» — канцелярит: «чтобы»'),
    (r'\bимеет место\b', '«имеет место» — канцелярит: «бывает», «есть»'),
    (r'\bв качестве\b', '«в качестве» — канцелярит: «как»'),
    (r'\bнадлежит\b', '«надлежит» — книжно: «должен»'),
    (r'\bотнюдь\b', '«отнюдь» — книжно: «вовсе»'),
    (r'\b(доселе|поныне|отныне|засим|посему)\b', 'архаизм'),
    (r'\bвышеупомянут|\bнижеследующ', 'канцелярит'),
    (r'\bсколь\b|\bстоль\b', '«столь», «сколь» — книжно: «так», «настолько»'),
    (r'\bни для кого не секрет\b', 'штамп: «все знают»'),
    (r'\bнасколько бы\b', 'книжная конструкция «насколько бы … ни»'),
    (r'\b(подписывают|выдаёт|сделала|решает|ведёт)\b[^.]{0,40}\bсам(а|и)? (он|она|они)\b', '«сам он» в середине фразы — запутанно, назови кого'),
    (r'\bсказанн(ое|ого|ым)\b', '«сказанное» — книжно'),
    (r'\bнеко(ему|ему|ей)\b', 'книжно'),
]
NO_SUBJ = re.compile(r"^(Был|Была|Были|Родом|Родил(ся|ась)|Выучил(ся|ась)|Славится|Управляет|Зарабатывал[аи]?|Ведёт|Любит|Пафос\w+|Высокомер\w+|Аристократич\w+|Крайне|Силён|Сильна|Опытн\w+|Серьёзн\w+|Глубок\w+|Могуществ\w+|Всегда|Обычно)\s+(?!(он|она|они|на|в|ещё|у|её|его|их|всё|все|это)\b|\[\[|[А-ЯЁ])")
SAM = re.compile(r"(^|[.!?]\s+)Сам(а|и)? (он|она|они)\b")
NOUNISH = re.compile(r"[А-Яа-яЁё]{4,}(?:ние|ния|нию|нием|нии|ций|ция|ции|цию|цией|ство|ства|ству|ством|стве)\b", re.I)
style = []
for src_name, src in (('p2_data', notes), ('p2_gm', gm)):
    for m in STR.finditer(src):
        t = plain(m.group(1))
        if len(t) < 20:
            continue
        for rx, why in BOOKISH:
            for mm in re.finditer(rx, t, re.I):
                a0 = max(0, mm.start() - 30)
                style.append('КНИЖНО (%s/%s): %s — «…%s…»' % (src_name, entry_of(m.start(), src), why, t[a0:mm.end() + 30]))
        for mm in SAM.finditer(t):
            style.append('САМ ОН (%s/%s): «%s…» — назови по имени' % (src_name, entry_of(m.start(), src), t[mm.start():mm.start() + 50].strip()))
        for sent in re.split(r"(?<=[.!?…])\s+", t):
            if not re.search(r"[А-Яа-яЁё]{3}", sent):
                continue
            n = len(words(sent))
            if n > 30:
                style.append('ДЛИННО (%s/%s): %d слов — «%s…»' % (src_name, entry_of(m.start(), src), n, sent[:70]))
            if NO_SUBJ.match(sent.strip()):
                style.append('БЕЗ ПОДЛЕЖАЩЕГО (%s/%s): «%s…» — назови, о ком речь' % (src_name, entry_of(m.start(), src), sent.strip()[:60]))
            k = NOUNISH.findall(sent)
            if len(k) >= 4:
                style.append('КАНЦЕЛЯРИТ (%s/%s): %s — «%s…»' % (src_name, entry_of(m.start(), src), ', '.join(k[:5]), sent[:70]))
if '--style' in sys.argv:
    for w in style:
        print(w)
    print('естественность: находок %d' % len(style))
    sys.exit(0)
warns += style

# ---------- 6. теги ----------
for m in re.finditer(r"\{id:'([^']+)', name:'([^']+)'", notes):
    chunk = notes[m.start():m.start() + 1500]
    nxt = chunk.find("{id:'", 5)
    head = chunk[:nxt] if nxt > 0 else chunk
    tg = re.search(r"tags:\[([^\]]*)\]", head)
    n = len(re.findall(r"'[^']+'", tg.group(1))) if tg else 0
    if not (4 <= n <= 8):
        warns.append('ТЕГИ: у записи «%s» тегов %d (нужно 4–8)' % (m.group(2), n))

# ---------- 7. канон: год рядом с названием события ----------
try:
    canon = json.loads(rd('canon.json') or '{}')
except Exception as e:
    canon = {}
    errors.append('canon.json не читается: %s' % e)
for ev in canon.get('events', []):
    rx = re.compile(r"(?:%s)\W{0,3}(?:в |от |года? )?(\d{4})(?!-)" % ev['match'])
    for src_name, src in (('p2_data', notes), ('p2_gm', gm)):
        for m in rx.finditer(plain(src)):
            y = int(m.group(1))
            if y != ev['year'] and 1000 < y < 2100:
                warns.append('КАНОН (%s): «%s» — год %d, по канону %d' % (src_name, m.group(0)[:60], y, ev['year']))

# ---------- итог ----------
base_path = os.path.join(HERE, 'lint_baseline.json')
def h(s):
    return hashlib.md5(s.encode('utf-8')).hexdigest()[:12]
if '--accept' in sys.argv:
    json.dump(sorted(set(h(w) for w in warns)), open(base_path, 'w'))
    print('Принято предупреждений: %d' % len(warns))
base = set(json.load(open(base_path))) if os.path.exists(base_path) else set()
new = [w for w in warns if h(w) not in base]
for e in errors:
    print('ОШИБКА  ' + e)
for w in new:
    print('ново    ' + w)
print('check_text: ошибок %d, новых предупреждений %d (принятых ранее %d)' % (len(errors), len(new), len(warns) - len(new)))
sys.exit(1 if errors else 0)
