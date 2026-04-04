"""
Zuglói Pszichológiai Központ — Daily Social Media Post Agent
============================================================
Researches psychotherapy trends, news and studies, then generates
an engaging Hungarian post proposal for Facebook and Instagram.
Saves the proposal to the server via POST /api/social-posts.

Run manually:  python agents/social_agent.py
Scheduled:     agents/schedule_agent.bat (Windows Task Scheduler)
"""

import os
import sys
import json
import logging
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(Path(__file__).parent.parent / ".env")

import anthropic

# ── Config ────────────────────────────────────────────────────────────────────
API_KEY      = os.environ.get("ANTHROPIC_API_KEY", "")
AGENT_SECRET = os.environ.get("AGENT_SECRET", "dev-secret")
SERVER_URL   = os.environ.get("SERVER_URL", "http://localhost:3001")
LOG_FILE     = Path(__file__).parent.parent / "logs" / "agent.log"

LOG_FILE.parent.mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)

# ── Content type rotation by weekday (0=Mon … 6=Sun) ──────────────────────────
CONTENT_TYPES = {
    0: "research",
    1: "myth",
    2: "tip",
    3: "quote",
    4: "research",
    5: "tip",
    6: "myth",
}

TYPE_LABELS = {
    "research": "kutatási eredmény",
    "myth":     "mítosz-bontás",
    "tip":      "gyakorlati tipp",
    "quote":    "inspiráló idézet",
}

COMPETITORS = [
    "ventus-pszichologia.hu",
    "zugloirendelo.hu",
    "neurologyközpont.hu",
    "pszichologuskereso.hu",
]

# ── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """Te a Zuglói Pszichológiai Központ közösségi média szakértője vagy.
Feladatod: napi egy izgalmas, szórakoztató és hasznos bejegyzést írni magyarul Facebook és Instagram oldalunkra.

STÍLUS SZABÁLYOK:
- Tegező, barátságos, melegszívű hang — soha nem klinikai vagy száraz
- Minden bejegyzés tartalmaz egy meglepő, váratlan horogmondatot az elején
- Maximum 3 emoji bejegyzésenként, helyesen és visszafogottan használva
- Kerüld a közhelyeket és a „Fontos, hogy..." kezdetű mondatokat
- Legyen konkrét, életszerű, ne elvont

FACEBOOK (fb_caption): 200–350 szó
  Szerkezet: erős horog → meglepő tény/sztori → mély betekintés → cselekvésre hívás
  Pl.: „Kövesd oldalunkat, időpontra jelentkezhetsz itt: [link]"

INSTAGRAM (ig_caption): max 150 szó
  Rövid, ütős, első sor kiemelkedő (az olvasó ezt látja csonkítva)
  Végén CTA + pont elválasztott hashtagek

HASHTAGEK: 8–12 db, vegyesen magyar és angol
  Kötelező: #pszichológia #mentálhigiéné #zuglóipszichológiaiközpont
  Kiegészítők a témától függően

IMAGE PROMPT: Rövid, angol nyelvű leírás egy képhez (Midjourney/DALL-E stílusban)
  Meleg, fényes, reményteli hangulatú — NEM klinikai, NEM steril
  Pl.: „Warm sunlit therapy room with soft armchairs, plants, golden afternoon light, photorealistic\"
"""

# ── Agent logic ───────────────────────────────────────────────────────────────

def get_content_type() -> str:
    return CONTENT_TYPES[datetime.now().weekday()]


def research_and_generate(client: anthropic.Anthropic, content_type: str) -> dict:
    """
    Two-phase approach:
    1. Research phase: web_search to gather fresh material
    2. Generation phase: produce the post from findings
    """
    type_label = TYPE_LABELS[content_type]
    today = datetime.now().strftime("%Y. %m. %d.")

    research_prompt = f"""Ma {today} van. A mai bejegyzés típusa: **{type_label}**.

FELADAT — KUTATÁS:
Keress friss, érdekes anyagot a következő témakörökben:
1. Legújabb pszichoterápiás kutatások, meta-elemzések (2024-2025)
2. Magyar mentálhigiénés trendek, hírek
3. Népszerű mítoszok a pszichológiáról amelyek terjengnek a közösségi médiában
4. Versenytársak posztjai és témái: {", ".join(COMPETITORS)}
5. Trending pszichológiai témák Instagramon és Facebookon

Keress legalább 3-4 különböző forrásból. Gyűjtsd össze a legérdekesebb, legmeglepőbb tényeket.
Adj összefoglalót: mi a legizgalmasabb téma amelyről ma posztolhatunk ("{type_label}" típusban)?
"""

    log.info("Phase 1: researching topics with web_search...")
    research_result = ""

    # Phase 1 — research with web_search tool (uses streaming for tool use)
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": research_prompt}],
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 8}],
    ) as stream:
        for event in stream:
            pass
        msg = stream.get_final_message()

    # Extract text from research response
    for block in msg.content:
        if hasattr(block, "text"):
            research_result += block.text

    if not research_result.strip():
        research_result = f"Téma: {type_label} — általános pszichoterápiás ismeretterjesztés"

    log.info("Phase 2: generating Hungarian post...")

    generation_prompt = f"""A kutatás eredménye:
{research_result}

Most írd meg a bejegyzést! Válaszolj KIZÁRÓLAG valid JSON formátumban, más szöveg nélkül:

{{
  "type": "{content_type}",
  "topic": "A bejegyzés témájának rövid leírása magyarul (1 mondat)",
  "sources": ["url1", "url2"],
  "fb_caption": "Teljes Facebook bejegyzés szövege (200-350 szó)",
  "ig_caption": "Teljes Instagram bejegyzés szövege (max 150 szó, hashtagek nélkül)",
  "hashtags": ["#pszichológia", "#mentálhigiéné", "#zuglóipszichológiaiközpont", "..."],
  "image_prompt": "English image description for DALL-E/Midjourney (warm, hopeful, non-clinical)"
}}

FONTOS: csak a JSON objektumot add vissza, semmilyen más szöveget!"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": research_prompt},
            {"role": "assistant", "content": msg.content},
            {"role": "user", "content": generation_prompt},
        ],
    )

    raw = ""
    for block in response.content:
        if hasattr(block, "text"):
            raw += block.text

    # Parse JSON — strip markdown fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip().rstrip("```").strip()

    post = json.loads(raw)
    return post


def save_to_server(post: dict) -> bool:
    """POST the proposal to the local Express server."""
    payload = json.dumps(post).encode("utf-8")
    req = urllib.request.Request(
        f"{SERVER_URL}/api/social-posts",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Agent-Key": AGENT_SECRET,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201):
                log.info("Post saved to server. Status: %d", resp.status)
                return True
            log.error("Unexpected status: %d", resp.status)
            return False
    except urllib.error.HTTPError as e:
        log.error("HTTP error saving post: %s %s", e.code, e.reason)
        return False
    except Exception as e:
        log.error("Failed to save post to server: %s", e)
        # Fallback: save to local file so nothing is lost
        fallback = Path(__file__).parent.parent / "logs" / f"post_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        fallback.write_text(json.dumps(post, ensure_ascii=False, indent=2), encoding="utf-8")
        log.info("Saved fallback to %s", fallback)
        return False


def main():
    if not API_KEY:
        log.error("ANTHROPIC_API_KEY is not set. Check your .env file.")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=API_KEY)
    content_type = get_content_type()
    log.info("Starting social agent. Content type today: %s", content_type)

    try:
        post = research_and_generate(client, content_type)
        log.info("Generated post topic: %s", post.get("topic", "?"))
        save_to_server(post)
        log.info("Agent run complete.")
    except json.JSONDecodeError as e:
        log.error("Failed to parse JSON from model: %s", e)
        sys.exit(1)
    except Exception as e:
        log.error("Unexpected error: %s", e, exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
