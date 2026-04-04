import express from "express";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THERAPISTS_FILE = join(__dirname, "data", "therapists.json");

const app = express();
app.use(express.json());

// --- Auth middleware: require X-Forwarded-User header on write operations ---
function requireAuth(req, res, next) {
  const user = req.headers["x-forwarded-user"] || req.headers["x-forwarded-preferred-username"];
  if (!user) return res.status(401).json({ error: "Unauthorized" });
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
  return JSON.parse(readFileSync(file, "utf-8"));
}

function writeJSON(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- Therapists ---

app.get("/api/therapists", (_req, res) => {
  res.json(readJSON(THERAPISTS_FILE));
});

app.get("/api/therapists/:slug", (req, res) => {
  const therapist = readJSON(THERAPISTS_FILE).find((t) => t.slug === req.params.slug);
  if (!therapist) return res.status(404).json({ error: "Therapist not found" });
  res.json(therapist);
});

app.post("/api/therapists", requireAuth, (req, res) => {
  const therapists = readJSON(THERAPISTS_FILE);
  const { slug, name } = req.body;
  if (!slug || !name) return res.status(400).json({ error: "slug and name are required" });
  if (therapists.find((t) => t.slug === slug)) {
    return res.status(409).json({ error: "Therapist with this slug already exists" });
  }
  const therapist = {
    slug,
    name,
    title: req.body.title || "",
    image: req.body.image || "",
    description: req.body.description || "",
    specialties: req.body.specialties || "",
    education: req.body.education || "",
    email: req.body.email || "",
    phone: req.body.phone || "",
    hours: req.body.hours || "",
  };
  therapists.push(therapist);
  writeJSON(THERAPISTS_FILE, therapists);
  res.status(201).json(therapist);
});

app.put("/api/therapists/:slug", requireAuth, (req, res) => {
  const therapists = readJSON(THERAPISTS_FILE);
  const idx = therapists.findIndex((t) => t.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Therapist not found" });
  therapists[idx] = { ...therapists[idx], ...req.body, slug: req.params.slug };
  writeJSON(THERAPISTS_FILE, therapists);
  res.json(therapists[idx]);
});

app.delete("/api/therapists/:slug", requireAuth, (req, res) => {
  const therapists = readJSON(THERAPISTS_FILE);
  const idx = therapists.findIndex((t) => t.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Therapist not found" });
  therapists.splice(idx, 1);
  writeJSON(THERAPISTS_FILE, therapists);
  res.status(204).end();
});

// --- SPA fallback: serve index.html for any non-API route ---
if (existsSync(DIST_DIR)) {
  app.get("/{*path}", (_req, res) => {
    res.sendFile(join(DIST_DIR, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
