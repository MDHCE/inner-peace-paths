"""
Resize therapist portraits to fit the 3:4 tile aspect.

Reads from a source folder, applies EXIF auto-rotation, smart-crops to
3:4 portrait (with a slight upward bias so faces stay in the upper half),
resizes to 800x1067, and writes optimized progressive JPEGs to <src>/resized/.

Usage:
    python scripts/resize_therapist_photos.py "<src_dir>"
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

TARGET_W, TARGET_H = 800, 1067   # 3:4 portrait
TARGET_ASPECT = TARGET_W / TARGET_H
TOP_BIAS = 0.10                  # 10% of the excess height taken from top — keep faces high
JPEG_QUALITY = 88
ALLOWED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def smart_crop_to_aspect(img: Image.Image, target_aspect: float, top_bias: float) -> Image.Image:
    src_w, src_h = img.size
    src_aspect = src_w / src_h

    if abs(src_aspect - target_aspect) < 0.001:
        return img

    if src_aspect > target_aspect:
        # source wider than target → crop horizontally (centered)
        new_w = int(round(src_h * target_aspect))
        left = (src_w - new_w) // 2
        return img.crop((left, 0, left + new_w, src_h))

    # source taller than target → crop vertically with face-friendly upward bias
    new_h = int(round(src_w / target_aspect))
    top = int(round((src_h - new_h) * top_bias))
    return img.crop((0, top, src_w, top + new_h))


def process(src_path: Path, out_path: Path) -> tuple[int, int, int]:
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)
    if img.mode != "RGB":
        bg = Image.new("RGB", img.size, (245, 240, 230))
        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
            img = img.convert("RGBA")
            bg.paste(img, mask=img.split()[-1])
            img = bg
        else:
            img = img.convert("RGB")

    img = smart_crop_to_aspect(img, TARGET_ASPECT, TOP_BIAS)
    img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    img.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return img.size[0], img.size[1], out_path.stat().st_size


def main(src_dir: Path) -> None:
    if not src_dir.is_dir():
        sys.exit(f"Source folder not found: {src_dir}")
    out_dir = src_dir / "resized"
    out_dir.mkdir(exist_ok=True)

    files = [
        p for p in sorted(src_dir.iterdir())
        if p.is_file() and p.suffix.lower() in ALLOWED_EXTS
    ]
    if not files:
        sys.exit("No images found.")

    print(f"Resizing {len(files)} photo(s) to {TARGET_W}x{TARGET_H} (3:4)…\n")
    for src in files:
        out = out_dir / (src.stem + ".jpg")
        try:
            w, h, size = process(src, out)
        except Exception as e:
            print(f"  [SKIP] {src.name}: {e}")
            continue
        in_size = src.stat().st_size
        print(f"  {src.name}  ->  resized/{out.name}  ({w}x{h}, {size//1024}KB, was {in_size//1024}KB)")

    print(f"\nDone. Output in: {out_dir}")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else r"C:/Users/danie/Pictures/FOTÓK ZUGLÓI RENDELŐ"
    main(Path(src))
