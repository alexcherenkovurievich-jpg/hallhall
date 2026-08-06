#!/usr/bin/env python3
"""
Обработка фотографий «Юго-Запад Hall» под палитру сайта.

Одинаковый набор шагов для каждого кадра, чтобы галерея читалась
как один материал, а не как сборка из разных источников:

  1. autocontrast   — вытягиваем тёмные кадры, тон не ломаем
  2. тёплый баланс  — красный вверх, синий вниз (оливково-золотая тема)
  3. насыщенность   — сдержанно: кадры сняты в полдень и уже сочные,
                      сильный подъём уводит дерево в оранжевую кислоту
  4. контраст       — лёгкий
  5. яркость        — только если кадр реально тёмный
  6. unsharp mask   — резкость
  7. ресайз         — до 1600 px по длинной стороне, LANCZOS
  8. WebP + JPG     — три ширины под srcset

Исходники не трогаем: читаем из photos-src/, пишем в public/images/processed/.

Запуск:  python3 scripts/process-photos.py
"""

import os
import sys
from PIL import Image, ImageEnhance, ImageOps, ImageFilter, ImageStat

SRC_DIR = 'photos-src'
OUT_DIR = 'public/images/processed'
WIDTHS = (480, 800, 1200, 1600)

# --- параметры обработки (одни на все кадры) -------------------------
WARM_R      = 1.022   # усиление красного
WARM_B      = 0.978   # ослабление синего
SATURATION  = 1.06
CONTRAST    = 1.035
# Кадры уже пережаты один раз. Сначала слегка сглаживаем, чтобы шарп
# поднимал детали, а не артефакты предыдущего сжатия: без этого
# шага вес готового WebP вырастает почти вдвое на одной листве.
PRE_SMOOTH  = 0.5
SHARPEN     = dict(radius=1.0, percent=75, threshold=5)
DARK_LEVEL  = 108     # ниже этой средней яркости кадр считаем тёмным
BLUR_LEVEL  = 90      # ниже этого «резкость» считаем низкой

# Листва — худший случай для кодека, поэтому качество ниже
# обычного: на глаз разницы нет, вес падает в разы.
JPEG_Q = 78
WEBP_Q = 68


def luminance(img):
    """Средняя яркость 0..255."""
    return ImageStat.Stat(img.convert('L')).mean[0]


def sharpness(img):
    """
    Грубая оценка резкости без numpy: разброс яркости после свёртки
    ядром Лапласа. Больше — контрастнее границы — резче кадр.
    """
    small = img.convert('L')
    small.thumbnail((800, 800), Image.LANCZOS)
    lap = small.filter(ImageFilter.Kernel(
        (3, 3), [0, 1, 0, 1, -4, 1, 0, 1, 0], scale=1, offset=128))
    return ImageStat.Stat(lap).stddev[0] ** 2


def warm(img, r=WARM_R, b=WARM_B):
    """Сдвиг баланса белого в тепло по каналам."""
    R, G, B = img.split()
    R = R.point(lambda v: min(255, int(v * r)))
    B = B.point(lambda v: min(255, int(v * b)))
    return Image.merge('RGB', (R, G, B))


def process(path, name):
    src = Image.open(path)
    src = ImageOps.exif_transpose(src).convert('RGB')

    before = dict(size=src.size, lum=luminance(src), sharp=sharpness(src))

    img = ImageOps.autocontrast(src, cutoff=0.25, preserve_tone=True)
    img = warm(img)
    img = ImageEnhance.Color(img).enhance(SATURATION)
    img = ImageEnhance.Contrast(img).enhance(CONTRAST)

    # поднимаем яркость только тёмным кадрам, светлые не выбеливаем
    lum = luminance(img)
    if lum < DARK_LEVEL:
        img = ImageEnhance.Brightness(img).enhance(1 + (DARK_LEVEL - lum) / 255)

    if PRE_SMOOTH:
        img = img.filter(ImageFilter.GaussianBlur(PRE_SMOOTH))
    img = img.filter(ImageFilter.UnsharpMask(**SHARPEN))

    after = dict(lum=luminance(img), sharp=sharpness(img))

    os.makedirs(OUT_DIR, exist_ok=True)
    made = []
    # апскейл не делаем — деталей он не добавит; если исходник уже
    # ниже верхней ступени, добавляем его родную ширину как максимум
    widths = [w for w in WIDTHS if w <= img.width]
    if img.width < max(WIDTHS) and img.width not in widths:
        widths.append(img.width)
    for w in sorted(widths):
        h = round(img.height * w / img.width)
        v = img.resize((w, h), Image.LANCZOS)
        jpg = f'{OUT_DIR}/{name}-{w}.jpg'
        webp = f'{OUT_DIR}/{name}-{w}.webp'
        v.save(jpg, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True, subsampling=2)
        v.save(webp, 'WEBP', quality=WEBP_Q, method=6)
        made.append((w, h, os.path.getsize(webp), os.path.getsize(jpg)))

    return before, after, made


def main():
    if not os.path.isdir(SRC_DIR):
        sys.exit(f'нет папки {SRC_DIR}')

    files = sorted(f for f in os.listdir(SRC_DIR)
                   if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')))
    if not files:
        sys.exit(f'в {SRC_DIR} нет изображений')

    problems = []
    for f in files:
        name = os.path.splitext(f)[0]
        before, after, made = process(os.path.join(SRC_DIR, f), name)

        print(f'\n{f}  {before["size"][0]}×{before["size"][1]}')
        print(f'  яркость  {before["lum"]:.0f} → {after["lum"]:.0f}')
        print(f'  резкость {before["sharp"]:.0f} → {after["sharp"]:.0f}')
        for w, h, wb, jb in made:
            print(f'  {w}×{h}: webp {wb // 1024} KB, jpg {jb // 1024} KB')

        why = []
        if before['size'][0] < 1200:
            why.append(f'узкий исходник {before["size"][0]}px — на широких блоках будет мылить')
        if before['lum'] < 70:
            why.append(f'очень тёмный (яркость {before["lum"]:.0f})')
        if before['sharp'] < BLUR_LEVEL:
            why.append(f'мягкий фокус (резкость {before["sharp"]:.0f})')
        if why:
            problems.append((f, why))

    print('\n' + '=' * 60)
    if problems:
        print('ПРОБЛЕМНЫЕ КАДРЫ (обработаны, но лучше переснять):')
        for f, why in problems:
            print(f'  {f}: ' + '; '.join(why))
    else:
        print('Все кадры отработали штатно.')


if __name__ == '__main__':
    main()
