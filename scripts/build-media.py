"""Готовит фото товаров для сайта: обрезает до 4:5 и сохраняет WebP в public/media/p/.

Запуск из корня репозитория:  python3 scripts/build-media.py
Нужен Pillow:                  pip install pillow

Источники:
- source/telegram-export/photos/ — фото из Telegram-канала (по номеру photo_NNN);
- source/stills/ — кадры, вырезанные из видео.

Кадры с надписью поверх одежды («FALL-WINTER' 27», «50%») не используются.
Чтобы заменить фото на оригинал без сжатия, положите файл и поправьте строку в SOURCES.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "source" / "telegram-export" / "photos"
STILLS = ROOT / "source" / "stills"
OUT = ROOT / "public" / "media" / "p"

FULL = (960, 1200)
SMALL = (480, 600)


def tg(number: int) -> Path:
    """Фото из экспорта Telegram по номеру."""
    matches = [p for p in PHOTOS.glob(f"photo_{number}@*.jpg") if "_thumb" not in p.name]
    if len(matches) != 1:
        raise SystemExit(f"photo_{number}: найдено {len(matches)} файлов")
    return matches[0]


def still(name: str) -> Path:
    return STILLS / f"{name}.jpg"


# имя на сайте: (файл, кадрирование)
# кадрирование: None — по центру до 4:5; ("y", доля) — вертикальный кадр, верх окна на этой доле
# свободного места; (x0, y0, x1, y1) — точная рамка в пикселях исходника.
SOURCES: dict[str, tuple[Path, object]] = {
    # Пиджаки
    "pidzhak-sg-1": (tg(162), None),
    "pidzhak-sg-2": (tg(161), None),
    "pidzhak-sg-3": (still("pidzhak-sg-v1"), ("y", 0.55)),
    "pidzhak-sg-4": (still("pidzhak-sg-v2"), ("y", 0.5)),
    "pidzhak-sg-5": (tg(163), None),
    "pidzhak-jersey-1": (tg(169), None),
    "pidzhak-jersey-2": (tg(168), None),
    "pidzhak-jersey-3": (tg(170), None),
    # Верхняя одежда
    "palto-haki-1": (tg(165), None),
    "palto-haki-2": (tg(166), None),
    "kurtka-navy-1": (tg(172), None),
    "kurtka-navy-2": (tg(173), None),
    "kurtka-navy-3": (tg(174), None),
    "bomber-1": (tg(184), None),
    "bomber-2": (still("bomber-v2"), ("y", 0.4)),
    "bomber-3": (still("bomber-v3"), ("y", 0.45)),
    "bomber-4": (still("bomber-v1"), ("y", 0.25)),
    "kurtka-bezh-1": (still("kurtka-bezh-v1"), ("y", 0.3)),
    "kurtka-bezh-2": (still("kurtka-bezh-v3"), ("y", 0.25)),
    "kurtka-bezh-3": (still("kurtka-bezh-v2"), ("y", 0.3)),
    # Трикотаж
    "zip-zelenyj-1": (tg(176), None),
    "zip-navy-1": (tg(179), None),
    "zip-navy-2": (tg(178), None),
    "zip-bordo-1": (tg(185), None),
    "zip-bordo-2": (tg(183), None),
    "zip-bordo-3": (still("bordo-v1"), ("y", 0.45)),
    "zip-bordo-4": (tg(186), None),
    "zip-taupe-1": (tg(190), None),
    "zip-taupe-2": (tg(188), None),
    "zip-taupe-3": (tg(189), None),
    "svitr-seryj-1": (tg(137), (30, 215, 690, 1040)),
    "svitr-seryj-2": (tg(181), None),
    "svitr-kofe-1": (still("svitr-kofe-v1"), ("y", 0.55)),
    "svitr-kofe-2": (still("svitr-kofe-v2"), ("y", 0.35)),
    "svitr-kofe-3": (tg(138), (30, 215, 690, 1040)),
    "svitr-kofe-4": (still("svitr-kofe-v3"), ("y", 0.45)),
    # Обувь и аксессуары
    "lofery-1": (tg(141), (20, 250, 580, 950)),
    "galstuki-1": (tg(149), None),
    # Распродажа
    "hudi-navy-1": (tg(145), None),
    "hudi-navy-2": (tg(144), None),
    "hudi-navy-3": (tg(147), None),
    "overshirt-1": (tg(152), None),
    "overshirt-2": (tg(154), None),
    "overshirt-3": (tg(153), None),
    "overshirt-4": (tg(155), None),
    "kurtka-black-1": (tg(159), None),
    "kurtka-black-2": (tg(157), None),
    "kurtka-black-3": (tg(158), None),
    "chinos-1": (tg(146), None),
}


def crop(image: Image.Image, spec: object) -> Image.Image:
    w, h = image.size
    target = FULL[0] / FULL[1]
    if isinstance(spec, tuple) and len(spec) == 4:
        return image.crop(spec)  # type: ignore[arg-type]
    if w / h > target:  # шире, чем 4:5 — режем по бокам
        nw = round(h * target)
        x = (w - nw) // 2
        return image.crop((x, 0, x + nw, h))
    nh = round(w / target)
    share = spec[1] if isinstance(spec, tuple) else 0.5
    y = round((h - nh) * share)
    return image.crop((0, y, w, y + nh))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (path, spec) in SOURCES.items():
        image = crop(Image.open(path).convert("RGB"), spec)
        image.resize(FULL, Image.LANCZOS).save(OUT / f"{name}.webp", quality=84, method=6)
        image.resize(SMALL, Image.LANCZOS).save(OUT / f"{name}-480.webp", quality=80, method=6)
    print(f"{len(SOURCES)} фото -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
