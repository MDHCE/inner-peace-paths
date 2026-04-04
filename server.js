import express from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { createRequire } from "module";

// Load .env
const require = createRequire(import.meta.url);
try { require("dotenv").config(); } catch {}

const __dirname = dirname(fileURLToPath(import.meta.url));
const THERAPISTS_FILE       = join(__dirname, "data", "therapists.json");      // unified, has .sites[]
const SOCIAL_POSTS_FILE     = join(__dirname, "data", "social-posts.json");
const GELLERT_SOCIAL_POSTS_FILE = join(__dirname, "data", "gellert-social-posts.json");

const app = express();
app.use(express.json());

// --- Auth: reverse-proxy user (admin UI write ops) ---
function requireAuth(req, res, next) {
  const user = req.headers["x-forwarded-user"] || req.headers["x-forwarded-preferred-username"];
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// --- Auth: agent key (social agent POST) ---
function requireAgentKey(req, res, next) {
  const secret = process.env.AGENT_SECRET || "dev-secret";
  if (req.headers["x-agent-key"] !== secret)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

// --- Version endpoint ---
app.get("/api/version", (_req, res) => {
  res.json({ version: process.env.BUILD_VERSION || "dev" });
});

// --- Serve Vite build output in production ---
const DIST_DIR = join(__dirname, "dist");
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// --- Generic helpers ---
function readJSON(file) {
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf-8"));
}
function writeJSON(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── Therapists (unified store, filtered by site) ────────────────────────────

function makeTherapistRoutes(router, siteKey) {
  // GET all for this site (public)
  router.get("/therapists", (_req, res) => {
    const all = readJSON(THERAPISTS_FILE);
    res.json(all.filter((t) => (t.sites || []).includes(siteKey)));
  });

  // GET single (public — any site can fetch by slug)
  router.get("/therapists/:slug", (req, res) => {
    const therapist = readJSON(THERAPISTS_FILE).find((t) => t.slug === req.params.slug);
    if (!therapist) return res.status(404).json({ error: "Therapist not found" });
    res.json(therapist);
  });
}

makeTherapistRoutes(app.route ? { get: (...a) => app.get(...a) } : app, "zuglo");

// Zugló public routes use /api prefix (already on app)
app.get("/api/therapists", (_req, res) => {
  res.json(readJSON(THERAPISTS_FILE).filter((t) => (t.sites || []).includes("zuglo")));
});
app.get("/api/therapists/:slug", (req, res) => {
  const t = readJSON(THERAPISTS_FILE).find((t) => t.slug === req.params.slug);
  if (!t) return res.status(404).json({ error: "Therapist not found" });
  res.json(t);
});

// Gellérthegyi public routes
app.get("/api/gellert/therapists", (_req, res) => {
  res.json(readJSON(THERAPISTS_FILE).filter((t) => (t.sites || []).includes("gellert")));
});
app.get("/api/gellert/therapists/:slug", (req, res) => {
  const t = readJSON(THERAPISTS_FILE).find((t) => t.slug === req.params.slug);
  if (!t) return res.status(404).json({ error: "Therapist not found" });
  res.json(t);
});

// Admin: all therapists regardless of site (CRUD)
app.get("/api/admin/therapists", requireAuth, (_req, res) => {
  res.json(readJSON(THERAPISTS_FILE));
});

app.post("/api/admin/therapists", requireAuth, (req, res) => {
  const therapists = readJSON(THERAPISTS_FILE);
  const { slug, name } = req.body;
  if (!slug || !name) return res.status(400).json({ error: "slug and name are required" });
  if (therapists.find((t) => t.slug === slug))
    return res.status(409).json({ error: "Slug already exists" });
  const therapist = {
    slug, name,
    title: req.body.title || "", image: req.body.image || "",
    description: req.body.description || "", specialties: req.body.specialties || "",
    education: req.body.education || "", email: req.body.email || "",
    phone: req.body.phone || "", hours: req.body.hours || "",
    sites: req.body.sites || ["zuglo"],
  };
  therapists.push(therapist);
  writeJSON(THERAPISTS_FILE, therapists);
  res.status(201).json(therapist);
});

app.put("/api/admin/therapists/:slug", requireAuth, (req, res) => {
  const therapists = readJSON(THERAPISTS_FILE);
  const idx = therapists.findIndex((t) => t.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Therapist not found" });
  therapists[idx] = { ...therapists[idx], ...req.body, slug: req.params.slug };
  writeJSON(THERAPISTS_FILE, therapists);
  res.json(therapists[idx]);
});

app.delete("/api/admin/therapists/:slug", requireAuth, (req, res) => {
  const therapists = readJSON(THERAPISTS_FILE);
  const idx = therapists.findIndex((t) => t.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Therapist not found" });
  therapists.splice(idx, 1);
  writeJSON(THERAPISTS_FILE, therapists);
  res.status(204).end();
});

// ─── Social Posts ─────────────────────────────────────────────────────────────

// GET /api/social-posts?status=pending
app.get("/api/social-posts", (_req, res) => {
  let posts = readJSON(SOCIAL_POSTS_FILE);
  const { status } = _req.query;
  if (status) posts = posts.filter((p) => p.status === status);
  res.json(posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

// POST /api/social-posts — agent submits a new proposal
app.post("/api/social-posts", requireAgentKey, (req, res) => {
  const posts = readJSON(SOCIAL_POSTS_FILE);
  const post = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    type: req.body.type || "research",
    topic: req.body.topic || "",
    sources: req.body.sources || [],
    fb_caption: req.body.fb_caption || "",
    ig_caption: req.body.ig_caption || "",
    hashtags: req.body.hashtags || [],
    image_prompt: req.body.image_prompt || "",
    status: "pending",
    posted_fb_at: null,
    posted_ig_at: null,
  };
  posts.unshift(post);
  writeJSON(SOCIAL_POSTS_FILE, posts);
  res.status(201).json(post);
});

// PUT /api/social-posts/:id — edit caption/hashtags
app.put("/api/social-posts/:id", requireAuth, (req, res) => {
  const posts = readJSON(SOCIAL_POSTS_FILE);
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });
  const allowed = ["fb_caption", "ig_caption", "hashtags", "image_prompt", "topic", "status"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) posts[idx][key] = req.body[key];
  }
  writeJSON(SOCIAL_POSTS_FILE, posts);
  res.json(posts[idx]);
});

// DELETE /api/social-posts/:id
app.delete("/api/social-posts/:id", requireAuth, (req, res) => {
  const posts = readJSON(SOCIAL_POSTS_FILE);
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });
  posts.splice(idx, 1);
  writeJSON(SOCIAL_POSTS_FILE, posts);
  res.status(204).end();
});

// POST /api/social-posts/:id/post — publish to Facebook and/or Instagram
app.post("/api/social-posts/:id/post", requireAuth, async (req, res) => {
  const posts = readJSON(SOCIAL_POSTS_FILE);
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });

  const post = posts[idx];
  const { platforms = ["facebook", "instagram"] } = req.body;
  const results = { facebook: null, instagram: null, errors: [] };

  // ── Facebook ──────────────────────────────────────────────────────────────
  if (platforms.includes("facebook") && process.env.FB_PAGE_ACCESS_TOKEN && process.env.FB_PAGE_ID) {
    try {
      const fbText = `${post.fb_caption}\n\n${post.hashtags.join(" ")}`;
      const fbRes = await fetch(
        `https://graph.facebook.com/v21.0/${process.env.FB_PAGE_ID}/feed`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: fbText,
            access_token: process.env.FB_PAGE_ACCESS_TOKEN,
          }),
        }
      );
      const fbData = await fbRes.json();
      if (fbData.id) {
        results.facebook = fbData.id;
        posts[idx].posted_fb_at = new Date().toISOString();
      } else {
        results.errors.push(`Facebook: ${fbData.error?.message || "Unknown error"}`);
      }
    } catch (e) {
      results.errors.push(`Facebook: ${e.message}`);
    }
  }

  // ── Instagram (requires public image URL) ─────────────────────────────────
  if (
    platforms.includes("instagram") &&
    process.env.FB_PAGE_ACCESS_TOKEN &&
    process.env.IG_BUSINESS_ACCOUNT_ID &&
    req.body.image_url
  ) {
    try {
      const igText = `${post.ig_caption}\n\n${post.hashtags.join(" ")}`;
      const igId = process.env.IG_BUSINESS_ACCOUNT_ID;
      const token = process.env.FB_PAGE_ACCESS_TOKEN;

      // Step 1: create media container
      const containerRes = await fetch(
        `https://graph.facebook.com/v21.0/${igId}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: req.body.image_url,
            caption: igText,
            access_token: token,
          }),
        }
      );
      const containerData = await containerRes.json();

      if (containerData.id) {
        // Step 2: publish
        const publishRes = await fetch(
          `https://graph.facebook.com/v21.0/${igId}/media_publish`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              creation_id: containerData.id,
              access_token: token,
            }),
          }
        );
        const publishData = await publishRes.json();
        if (publishData.id) {
          results.instagram = publishData.id;
          posts[idx].posted_ig_at = new Date().toISOString();
        } else {
          results.errors.push(`Instagram publish: ${publishData.error?.message || "Unknown error"}`);
        }
      } else {
        results.errors.push(`Instagram container: ${containerData.error?.message || "Unknown error"}`);
      }
    } catch (e) {
      results.errors.push(`Instagram: ${e.message}`);
    }
  }

  // Update status
  if (results.facebook || results.instagram) {
    posts[idx].status = "posted";
  }
  writeJSON(SOCIAL_POSTS_FILE, posts);
  res.json({ post: posts[idx], results });
});

// POST /api/social-posts/generate — trigger agent manually from admin UI
app.post("/api/social-posts/generate", requireAuth, (_req, res) => {
  const agentPath = join(__dirname, "agents", "social_agent.py");
  execFile("python3", [agentPath], { timeout: 120000 }, (err, stdout, stderr) => {
    if (err) {
      console.error("Agent error:", stderr);
      return res.status(500).json({ error: "Agent failed", details: stderr });
    }
    res.json({ ok: true, output: stdout });
  });
});

// ─── Gellérthegyi social posts ────────────────────────────────────────────────

app.get("/api/gellert/social-posts", (_req, res) => {
  let posts = readJSON(GELLERT_SOCIAL_POSTS_FILE);
  const { status } = _req.query;
  if (status) posts = posts.filter((p) => p.status === status);
  res.json(posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post("/api/gellert/social-posts", requireAgentKey, (req, res) => {
  const posts = readJSON(GELLERT_SOCIAL_POSTS_FILE);
  const post = {
    id: randomUUID(), created_at: new Date().toISOString(),
    type: req.body.type || "research", topic: req.body.topic || "",
    sources: req.body.sources || [], fb_caption: req.body.fb_caption || "",
    ig_caption: req.body.ig_caption || "", hashtags: req.body.hashtags || [],
    image_prompt: req.body.image_prompt || "",
    status: "pending", posted_fb_at: null, posted_ig_at: null,
  };
  posts.unshift(post);
  writeJSON(GELLERT_SOCIAL_POSTS_FILE, posts);
  res.status(201).json(post);
});

app.put("/api/gellert/social-posts/:id", requireAuth, (req, res) => {
  const posts = readJSON(GELLERT_SOCIAL_POSTS_FILE);
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });
  posts[idx] = { ...posts[idx], ...req.body, id: req.params.id };
  writeJSON(GELLERT_SOCIAL_POSTS_FILE, posts);
  res.json(posts[idx]);
});

app.delete("/api/gellert/social-posts/:id", requireAuth, (req, res) => {
  const posts = readJSON(GELLERT_SOCIAL_POSTS_FILE);
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });
  posts.splice(idx, 1);
  writeJSON(GELLERT_SOCIAL_POSTS_FILE, posts);
  res.status(204).end();
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
if (existsSync(DIST_DIR)) {
  // Gellérthegyi SPA
  app.get("/gellert/{*path}", (_req, res) => {
    res.sendFile(join(DIST_DIR, "gellert", "index.html"));
  });
  // Zuglói SPA (catch-all)
  app.get("/{*path}", (_req, res) => {
    res.sendFile(join(DIST_DIR, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
