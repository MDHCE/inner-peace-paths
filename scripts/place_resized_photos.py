"""
Copy resized therapist photos from <src>/resized/ into public/therapists/<slug>.jpg
and update data/therapists.json image fields. Run from repo root.
"""
import json
import shutil
import sys
import unicodedata
from pathlib import Path


def _norm(s: str) -> str:
    return unicodedata.normalize("NFC", s)

REPO_ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"C:\Users\danie\Pictures\FOTÓK ZUGLÓI RENDELŐ\resized")
DEST = REPO_ROOT / "public" / "therapists"
DATA = REPO_ROOT / "data" / "therapists.json"

MAPPING = {
    "alexandra.jpg":                                "kolyane-gabor-alexandra",
    "bence3.jpg":                                   "szucs-bence",
    "CSNportré (1).jpg":                            "csanyi-nikoletta",
    "Erdélyi-Balázs Szabina_profilkép (1).jpg":     "erdelyi-balazs-szabina",
    "IMG_0664 Copy (1).jpg":                        "laszlo-kinga",
    "IMG_1422-scaled.jpg":                          "bartok-luca",
    "IMG_20191015_122444-1-e1572958530962.jpg":     "lukacs-dora",
    "IMG_20220324_210201-scaled.jpg":               "laczko-laura",
    "IMG_8040-scaled.jpg":                          "koteles-anna",
    "SZA_kep.jpg":                                  "szeman-anita",
    "img_6057-001.jpg":                             "redei-brigitta",
    "juditannafejes-scaled.jpg":                    "fejes-judit-anna",
}


def main() -> None:
    if not SRC.is_dir():
        sys.exit(f"Source folder not found: {SRC}")
    DEST.mkdir(parents=True, exist_ok=True)

    # Build a normalized index of the source dir so we can match
    # regardless of NFC/NFD Unicode form differences (Windows uses NFC,
    # macOS/git often NFD).
    available = {_norm(p.name): p for p in SRC.iterdir() if p.is_file()}

    copied = 0
    missed = []
    for filename, slug in MAPPING.items():
        s = available.get(_norm(filename))
        d = DEST / f"{slug}.jpg"
        if s is None:
            missed.append((filename, slug))
            continue
        shutil.copy(s, d)
        print(f"  copied {s.name}  ->  public/therapists/{slug}.jpg ({d.stat().st_size//1024}KB)")
        copied += 1

    if missed:
        print("\nMISSED (source not found):")
        for filename, slug in missed:
            print(f"  - {filename}  (intended for {slug})")

    print(f"\nCopied {copied}/{len(MAPPING)}")

    # Update therapists.json — only for slugs whose local file now exists
    ts = json.loads(DATA.read_text(encoding="utf-8"))
    updated = 0
    for t in ts:
        slug = t.get("slug")
        local = DEST / f"{slug}.jpg"
        if not local.exists():
            continue
        new_url = f"/therapists/{slug}.jpg"
        if t.get("image") != new_url:
            t["image"] = new_url
            updated += 1
    DATA.write_text(json.dumps(ts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated image field for {updated} therapist(s) in data/therapists.json")

    # List orphan photos (in resized/ but not in MAPPING)
    print("\nORPHAN photos (in resized/ but not auto-assigned — assign manually via admin):")
    mapped_normalized = {_norm(k) for k in MAPPING.keys()}
    for p in sorted(SRC.iterdir()):
        if p.is_file() and _norm(p.name) not in mapped_normalized:
            print(f"  - {p.name} ({p.stat().st_size//1024}KB)")

    # List therapists still hotlinking external URLs
    print("\nTherapists still without LOCAL photo (hotlinked):")
    for t in ts:
        if "zuglo" in (t.get("sites") or []):
            img = t.get("image", "")
            if not img.startswith("/therapists/"):
                print(f"  - {t['slug']:30}  {t['name']:30}  ({img[:60]}…)")


if __name__ == "__main__":
    main()
