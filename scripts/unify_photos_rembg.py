"""
Unify therapist photos using AI background removal (rembg):
1. Detect face with OpenCV → consistent crop framing
2. Remove background with rembg
3. Composite onto warm cream background matching site palette
Output: 600x750 JPEG
"""

import cv2
import numpy as np
from PIL import Image, ImageFilter
from rembg import remove
import io, os

INPUT_DIR  = r"D:\GitHub\inner-peace-paths\public\therapists"
OUTPUT_DIR = r"D:\GitHub\inner-peace-paths\public\therapists\unified"
OUTPUT_W, OUTPUT_H = 600, 750
FACE_TOP_RATIO  = 0.28   # face center 28% from top
FACE_WIDTH_RATIO = 0.50  # face width 50% of canvas
BG_COLOR = (247, 244, 238)  # hsl(40 33% 97%) warm cream

os.makedirs(OUTPUT_DIR, exist_ok=True)
cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detect_face(img_bgr):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=4, minSize=(60, 60))
    if len(faces) == 0:
        gray = cv2.equalizeHist(gray)
        faces = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(40, 40))
    return faces

def process(path, out_path):
    print(f"  Loading {os.path.basename(path)}...")
    img_bgr = cv2.imread(path)
    if img_bgr is None:
        print("  SKIP: cannot read")
        return

    h, w = img_bgr.shape[:2]
    faces = detect_face(img_bgr)

    if len(faces) == 0:
        print("  WARN: no face detected, using upper-center fallback")
        cx, cy, face_w = w // 2, h // 4, w // 2
    else:
        fx, fy, fw, fh = max(faces, key=lambda f: f[2] * f[3])
        cx = fx + fw // 2
        cy = fy + fh // 2
        face_w = fw
        print(f"  Face: center=({cx},{cy}) size={fw}x{fh}")

    # Scale so face fills FACE_WIDTH_RATIO of output width
    scale = (FACE_WIDTH_RATIO * OUTPUT_W) / face_w
    new_w = int(w * scale)
    new_h = int(h * scale)

    # Rembg on original (high res = better mask)
    print("  Removing background...")
    pil_orig = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    # Downscale for rembg speed if very large
    max_dim = 1500
    if max(pil_orig.size) > max_dim:
        ratio = max_dim / max(pil_orig.size)
        small = pil_orig.resize((int(pil_orig.width * ratio), int(pil_orig.height * ratio)), Image.LANCZOS)
        mask_small = remove(small, only_mask=True)
        mask = mask_small.resize(pil_orig.size, Image.LANCZOS)
    else:
        mask = remove(pil_orig, only_mask=True)

    # Convert mask to numpy
    mask_np = np.array(mask)  # grayscale 0-255

    # Resize both image and mask to scaled size
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    img_resized   = cv2.resize(img_rgb,  (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    mask_resized  = cv2.resize(mask_np,  (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

    # Face center in scaled image
    scx = int(cx * scale)
    scy = int(cy * scale)

    # Target position in output canvas
    target_x = OUTPUT_W // 2
    target_y = int(OUTPUT_H * FACE_TOP_RATIO)

    crop_x = scx - target_x
    crop_y = scy - target_y

    # Overlap region
    src_x1 = max(crop_x, 0)
    src_y1 = max(crop_y, 0)
    src_x2 = min(crop_x + OUTPUT_W, new_w)
    src_y2 = min(crop_y + OUTPUT_H, new_h)

    dst_x1 = src_x1 - crop_x
    dst_y1 = src_y1 - crop_y
    dst_x2 = dst_x1 + (src_x2 - src_x1)
    dst_y2 = dst_y1 + (src_y2 - src_y1)

    # Build canvas
    bg = np.full((OUTPUT_H, OUTPUT_W, 3), BG_COLOR, dtype=np.uint8)
    canvas_img  = bg.copy()
    canvas_mask = np.zeros((OUTPUT_H, OUTPUT_W), dtype=np.float32)

    if src_x2 > src_x1 and src_y2 > src_y1:
        canvas_img[dst_y1:dst_y2, dst_x1:dst_x2]  = img_resized[src_y1:src_y2, src_x1:src_x2]
        canvas_mask[dst_y1:dst_y2, dst_x1:dst_x2] = mask_resized[src_y1:src_y2, src_x1:src_x2].astype(np.float32) / 255.0

    # Soft fade at bottom of subject
    fade_h = 100
    for i in range(fade_h):
        row = min(dst_y2 - 1 - i, OUTPUT_H - 1)
        if row >= 0:
            alpha = i / fade_h
            canvas_mask[row, :] *= alpha

    # Composite: subject over bg using mask
    mask3 = np.stack([canvas_mask] * 3, axis=2)
    out = (canvas_img.astype(np.float32) * mask3 + bg.astype(np.float32) * (1 - mask3))
    out = np.clip(out, 0, 255).astype(np.uint8)

    # Slight sharpening
    pil_out = Image.fromarray(out)
    pil_out = pil_out.filter(ImageFilter.UnsharpMask(radius=1, percent=50, threshold=3))
    pil_out.save(out_path, "JPEG", quality=92)
    print(f"  Saved {out_path}")


photos = [f for f in os.listdir(INPUT_DIR)
          if f.lower().endswith((".jpg", ".jpeg", ".png"))
          and os.path.isfile(os.path.join(INPUT_DIR, f))]

print(f"Processing {len(photos)} photos with AI background removal...\n")
for fname in photos:
    base = os.path.splitext(fname)[0] + ".jpg"
    src  = os.path.join(INPUT_DIR, fname)
    dst  = os.path.join(OUTPUT_DIR, base)
    print(f"[{fname}]")
    process(src, dst)
    print()

print("All done.")
