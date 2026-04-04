"""
Unify therapist profile photos:
- Detect face with OpenCV
- Crop to consistent portrait with face centered at ~30% from top
- Apply soft warm background matching the site palette
- Output 600x750 px JPEG
"""

import cv2
import numpy as np
from PIL import Image, ImageFilter
import os, sys

INPUT_DIR  = r"D:\GitHub\inner-peace-paths\public\therapists"
OUTPUT_DIR = r"D:\GitHub\inner-peace-paths\public\therapists\unified"
OUTPUT_W, OUTPUT_H = 600, 750          # portrait canvas
FACE_TOP_RATIO = 0.28                  # face center sits 28% from top
FACE_WIDTH_RATIO = 0.52               # face width is 52% of canvas width
# Warm cream bg matching --background: hsl(40 33% 97%) ≈ #F7F4EE
BG_COLOR = (247, 244, 238)

os.makedirs(OUTPUT_DIR, exist_ok=True)

cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detect_face(img_bgr):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=4, minSize=(60, 60))
    if len(faces) == 0:
        # try with equalized histogram for harder cases
        gray = cv2.equalizeHist(gray)
        faces = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(40, 40))
    return faces

def process(path, out_path):
    img_bgr = cv2.imread(path)
    if img_bgr is None:
        print(f"  SKIP: cannot read {path}")
        return

    h, w = img_bgr.shape[:2]
    faces = detect_face(img_bgr)

    if len(faces) == 0:
        print(f"  WARN: no face detected in {os.path.basename(path)}, using center crop")
        # fallback: assume face is in upper-center third
        cx = w // 2
        cy = h // 4
        face_w = w // 2
    else:
        # pick largest face
        fx, fy, fw, fh = max(faces, key=lambda f: f[2] * f[3])
        cx = fx + fw // 2
        cy = fy + fh // 2
        face_w = fw
        print(f"  Face: center=({cx},{cy}), size={fw}x{fh}")

    # Desired scale: face_w in source → FACE_WIDTH_RATIO * OUTPUT_W in output
    desired_face_px = FACE_WIDTH_RATIO * OUTPUT_W
    scale = desired_face_px / face_w

    # Resize source
    new_w = int(w * scale)
    new_h = int(h * scale)
    img_resized = cv2.resize(img_bgr, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

    # Scaled face center
    scx = int(cx * scale)
    scy = int(cy * scale)

    # Target position of face center in output canvas
    target_x = OUTPUT_W // 2
    target_y = int(OUTPUT_H * FACE_TOP_RATIO)

    # Crop origin
    crop_x = scx - target_x
    crop_y = scy - target_y

    # Build output canvas with bg color
    canvas = np.full((OUTPUT_H, OUTPUT_W, 3), BG_COLOR[::-1], dtype=np.uint8)  # BGR

    # Compute overlap region
    src_x1 = max(crop_x, 0)
    src_y1 = max(crop_y, 0)
    src_x2 = min(crop_x + OUTPUT_W, new_w)
    src_y2 = min(crop_y + OUTPUT_H, new_h)

    dst_x1 = src_x1 - crop_x
    dst_y1 = src_y1 - crop_y
    dst_x2 = dst_x1 + (src_x2 - src_x1)
    dst_y2 = dst_y1 + (src_y2 - src_y1)

    if src_x2 > src_x1 and src_y2 > src_y1:
        canvas[dst_y1:dst_y2, dst_x1:dst_x2] = img_resized[src_y1:src_y2, src_x1:src_x2]

    # Fill any empty columns by extending edge pixels horizontally
    for col in range(OUTPUT_W):
        if np.all(canvas[:, col] == BG_COLOR[::-1]):
            # find nearest filled column
            left  = col - 1
            right = col + 1
            while left >= 0 and np.all(canvas[:, left] == BG_COLOR[::-1]):
                left -= 1
            while right < OUTPUT_W and np.all(canvas[:, right] == BG_COLOR[::-1]):
                right += 1
            if left >= 0:
                canvas[:, col] = canvas[:, left]
            elif right < OUTPUT_W:
                canvas[:, col] = canvas[:, right]

    # Soft fade only at the bottom where the body ends
    mask = np.ones((OUTPUT_H, OUTPUT_W), dtype=np.float32)
    fade = 80  # px
    if dst_y2 < OUTPUT_H:
        for i in range(fade):
            row = dst_y2 - 1 - i
            if 0 <= row < OUTPUT_H:
                mask[row, :] = np.minimum(mask[row, :], i / fade)
        # zero below dst_y2
        if dst_y2 < OUTPUT_H:
            mask[dst_y2:, :] = 0

    mask3 = np.stack([mask] * 3, axis=2)
    bg = np.full((OUTPUT_H, OUTPUT_W, 3), BG_COLOR[::-1], dtype=np.float32)
    out = canvas.astype(np.float32) * mask3 + bg * (1 - mask3)
    out = out.astype(np.uint8)

    # Save via PIL
    pil = Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
    pil = pil.filter(ImageFilter.UnsharpMask(radius=1, percent=60, threshold=3))
    pil.save(out_path, "JPEG", quality=90)
    print(f"  saved {out_path}")


photos = [f for f in os.listdir(INPUT_DIR)
          if f.lower().endswith((".jpg", ".jpeg", ".png")) and os.path.isfile(os.path.join(INPUT_DIR, f))]

print(f"Processing {len(photos)} photos...\n")
for fname in photos:
    base = os.path.splitext(fname)[0] + ".jpg"
    src = os.path.join(INPUT_DIR, fname)
    dst = os.path.join(OUTPUT_DIR, base)
    print(f"[{fname}]")
    process(src, dst)

print("\nDone.")
