#!/usr/bin/env python3
"""
Уменьшённые копии фотографий ТОЛЬКО для однофайлового предпросмотра.

На сайт не влияет: боевые файлы в public/images/photos/ остаются как есть,
без обработки. Здесь копии нужны потому, что артефакт-ссылка — это один
HTML со всем внутри, а оригиналы весят 42 МБ и в лимит не проходят.

Запуск:  python3 scripts/preview-images.py
"""
import os
from PIL import Image

SRC = 'public/images/photos'
OUT = '/tmp/preview-images'
MAX_SIDE = 1100
QUALITY = 72

os.makedirs(OUT, exist_ok=True)
total_src = total_out = 0

for f in sorted(os.listdir(SRC)):
    if not f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        continue
    src = os.path.join(SRC, f)
    total_src += os.path.getsize(src)

    im = Image.open(src).convert('RGB')
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    dst = os.path.join(OUT, f)
    im.save(dst, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    total_out += os.path.getsize(dst)

print(f'{SRC}: {total_src / 1024 / 1024:.1f} MB  ->  {OUT}: {total_out / 1024 / 1024:.1f} MB')
