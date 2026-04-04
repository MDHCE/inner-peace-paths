"""
Process the Gellérthegyi logo:
- Auto-crop to just the icon symbol (drop the text portion)
- Remove white background → transparent
- Convert green dot to match the dark logo colour
- Save dark version (for light backgrounds) + white version (for dark backgrounds)
"""
from PIL import Image
import numpy as np
import os

SRC       = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "gellert-logo.png")
OUT_DARK  = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "gellert-logo-dark.png")
OUT_WHITE = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "gellert-logo-white.png")

img = Image.open(SRC).convert("RGBA")
data = np.array(img, dtype=np.float32)
r, g, b, a = data[..., 0], data[..., 1], data[..., 2], data[..., 3]

# --- 1. Find icon/text boundary using alpha channel ---
# The logo already has a transparent background.
# Find the first gap (all-transparent column) that comes AFTER some visible pixels.
has_visible = np.any(a > 10, axis=0)   # per column: True if any pixel is visible

seen_content = False
icon_right = 0
gap_start = -1
for x in range(data.shape[1]):
    if has_visible[x]:
        seen_content = True
        if gap_start >= 0 and (x - gap_start) >= 3:
            # We found a gap of 3+ transparent columns → icon ends at gap_start
            icon_right = gap_start
            break
        gap_start = -1
        icon_right = x + 1
    else:
        if seen_content and gap_start < 0:
            gap_start = x

print(f"Icon crop: 0..{icon_right} of {data.shape[1]} wide, height={data.shape[0]}")
icon_data = data[:, :icon_right, :].copy()

# --- 2. Background already transparent (alpha=0); nothing to strip ---
r2, g2, b2 = icon_data[...,0], icon_data[...,1], icon_data[...,2]
is_bg = icon_data[..., 3] < 10   # transparent pixels

# --- 3. Unify green dot to dark logo colour ---
is_green = (g2 > r2 + 30) & (g2 > b2 + 30) & (g2 > 120) & (~is_bg)
is_dark  = (~is_bg) & (~is_green) & (icon_data[..., 3] > 128)
if is_dark.any():
    dark_r = float(np.median(r2[is_dark]))
    dark_g = float(np.median(g2[is_dark]))
    dark_b = float(np.median(b2[is_dark]))
else:
    dark_r, dark_g, dark_b = 46, 48, 52
print(f"Dark colour: rgb({dark_r:.0f},{dark_g:.0f},{dark_b:.0f})")

icon_data[is_green & (icon_data[..., 3] > 0), 0] = dark_r
icon_data[is_green & (icon_data[..., 3] > 0), 1] = dark_g
icon_data[is_green & (icon_data[..., 3] > 0), 2] = dark_b

# --- 4. Pad to square so the icon sits centred ---
h, w = icon_data.shape[:2]
side = max(h, w)
square = np.zeros((side, side, 4), dtype=np.float32)
pad_x = (side - w) // 2
pad_y = (side - h) // 2
square[pad_y:pad_y+h, pad_x:pad_x+w] = icon_data

dark_img = Image.fromarray(np.clip(square, 0, 255).astype(np.uint8), "RGBA")
dark_img.save(OUT_DARK)
print(f"Saved: {OUT_DARK}  ({dark_img.size})")

# --- 5. White version ---
white = square.copy()
visible = white[..., 3] > 10
white[visible, 0] = 255
white[visible, 1] = 255
white[visible, 2] = 255
white_img = Image.fromarray(np.clip(white, 0, 255).astype(np.uint8), "RGBA")
white_img.save(OUT_WHITE)
print(f"Saved: {OUT_WHITE}  ({white_img.size})")
