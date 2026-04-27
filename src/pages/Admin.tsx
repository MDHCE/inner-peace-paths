import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, ArrowLeft, Send, X, RefreshCw, ExternalLink, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import type { SiteContent } from "@/context/SiteContent";

// ── Types ────────────────────────────────────────────────────────────────────

interface Therapist {
  slug: string;
  name: string;
  title: string;
  image: string;
  description: string;
  specialties: string;
  education: string;
  email: string;
  phone: string;
  hours: string;
  audience: "adult" | "child" | "both";
  sites: string[];
}

interface SocialPost {
  id: string;
  created_at: string;
  type: "research" | "myth" | "tip" | "quote";
  topic: string;
  sources: string[];
  fb_caption: string;
  ig_caption: string;
  hashtags: string[];
  image_prompt: string;
  status: "pending" | "posted" | "rejected";
  posted_fb_at: string | null;
  posted_ig_at: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const emptyTherapist: Therapist = {
  slug: "",
  name: "",
  title: "",
  image: "",
  description: "",
  specialties: "",
  education: "",
  email: "",
  phone: "",
  hours: "",
  audience: "adult",
  sites: ["zuglo"],
};

const AUDIENCE_LABELS: Record<Therapist["audience"], string> = {
  adult: "Felnőttek",
  child: "Gyermekek és serdülők",
  both: "Mindkettő",
};

const SITE_LABELS: Record<string, string> = {
  zuglo: "Zuglói Pszichológiai Központ",
  gellert: "Gellérthegyi Rendelő",
};

const TYPE_LABELS: Record<SocialPost["type"], string> = {
  research: "Kutatás",
  myth: "Mítosz",
  tip: "Tipp",
  quote: "Idézet",
};

const TYPE_COLORS: Record<SocialPost["type"], string> = {
  research: "bg-blue-100 text-blue-800",
  myth: "bg-orange-100 text-orange-800",
  tip: "bg-green-100 text-green-800",
  quote: "bg-purple-100 text-purple-800",
};

const STATUS_LABELS: Record<SocialPost["status"], string> = {
  pending: "Várakozik",
  posted: "Közzétéve",
  rejected: "Elutasítva",
};

// ── Admin ─────────────────────────────────────────────────────────────────────

const Admin = () => {
  const { apiBase } = useSite();
  const [tab, setTab] = useState<"therapists" | "content" | "posts">("therapists");

  // ── Therapists state ──────────────────────────────────────────────────────
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [editing, setEditing] = useState<Therapist | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [siteFilter, setSiteFilter] = useState("");
  const [uploading, setUploading] = useState(false);

  // ── Site content state ────────────────────────────────────────────────────
  const [siteContent, setSiteContent] = useState<SiteContent>({});
  const [contentSaving, setContentSaving] = useState(false);

  // ── Posts state ───────────────────────────────────────────────────────────
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [statusFilter, setStatusFilter] = useState<SocialPost["status"]>("pending");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [publishPlatforms, setPublishPlatforms] = useState<{ facebook: boolean; instagram: boolean }>({ facebook: true, instagram: true });
  const [publishImageUrl, setPublishImageUrl] = useState("");
  const [confirmingPost, setConfirmingPost] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchTherapists = () =>
    fetch("/api/admin/therapists")
      .then((r) => r.json())
      .then(setTherapists)
      .catch(() => {});

  const fetchPosts = () =>
    fetch(`${apiBase}/social-posts?status=${statusFilter}`)
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => {});

  const fetchSiteContent = () =>
    fetch(`${apiBase}/site-content`)
      .then((r) => r.json())
      .then(setSiteContent)
      .catch(() => {});

  useEffect(() => { fetchTherapists(); }, []);
  useEffect(() => { if (tab === "posts") fetchPosts(); }, [tab, statusFilter]);
  useEffect(() => { if (tab === "content") fetchSiteContent(); }, [tab]);

  // ── Site content handlers ────────────────────────────────────────────────
  const handleSaveContent = async () => {
    setContentSaving(true);
    const res = await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteContent),
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      alert(`Mentés sikertelen (${res.status}): ${msg.error || res.statusText}`);
    } else {
      alert("Tartalom mentve. A főoldal frissítése után láthatóvá válik.");
    }
    setContentSaving(false);
  };

  // ── Image upload handler (used by therapist edit form) ──────────────────
  const handleImageUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setEditing({ ...editing, image: data.url });
    } else {
      const msg = await res.json().catch(() => ({}));
      alert(`Feltöltés sikertelen (${res.status}): ${msg.error || res.statusText}`);
    }
    setUploading(false);
  };

  // ── Therapist handlers ────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const url = isNew ? "/api/admin/therapists" : `/api/admin/therapists/${editing.slug}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      fetchTherapists();
      setEditing(null);
      setIsNew(false);
    } else {
      const msg = await res.json().catch(() => ({}));
      alert(`Mentés sikertelen (${res.status}): ${msg.error || res.statusText}`);
    }
    setSaving(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Törli a szakembert: "${slug}"?`)) return;
    const res = await fetch(`/api/admin/therapists/${slug}`, { method: "DELETE" });
    if (res.ok) {
      fetchTherapists();
    } else {
      const msg = await res.json().catch(() => ({}));
      alert(`Törlés sikertelen (${res.status}): ${msg.error || res.statusText}`);
    }
  };

  // ── Post handlers ─────────────────────────────────────────────────────────

  const handleSavePost = async () => {
    if (!editingPost) return;
    const res = await fetch(`${apiBase}/social-posts/${editingPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fb_caption: editingPost.fb_caption,
        ig_caption: editingPost.ig_caption,
        hashtags: editingPost.hashtags,
        image_prompt: editingPost.image_prompt,
        topic: editingPost.topic,
      }),
    });
    if (res.ok) {
      setEditingPost(null);
      fetchPosts();
    }
  };

  const handleReject = async (id: string) => {
    await fetch(`${apiBase}/social-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    fetchPosts();
  };

  const handlePublish = async (post: SocialPost) => {
    setPublishing(post.id);
    const platforms: string[] = [];
    if (publishPlatforms.facebook) platforms.push("facebook");
    if (publishPlatforms.instagram) platforms.push("instagram");
    const body: Record<string, unknown> = { platforms };
    if (publishImageUrl) body.image_url = publishImageUrl;

    const res = await fetch(`${apiBase}/social-posts/${post.id}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setPublishing(null);
    setConfirmingPost(null);
    setPublishImageUrl("");
    if (data.results?.errors?.length) {
      alert("Hibák:\n" + data.results.errors.join("\n"));
    }
    fetchPosts();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await fetch(`${apiBase}/social-posts/generate`, { method: "POST" });
    setGenerating(false);
    if (res.ok) {
      fetchPosts();
    } else {
      const data = await res.json().catch(() => ({}));
      alert("Az agent futtatása sikertelen.\n" + (data.details || ""));
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Törli ezt a bejegyzést?")) return;
    await fetch(`${apiBase}/social-posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  // ── Filtered posts ────────────────────────────────────────────────────────
  const filteredPosts = posts.filter((p) => p.status === statusFilter);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Vissza a főoldalra
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Adminisztráció
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("therapists")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === "therapists"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Szakemberek
          </button>
          <button
            onClick={() => setTab("content")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === "content"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tartalom
          </button>
          <button
            onClick={() => setTab("posts")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === "posts"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bejegyzések
          </button>
        </div>

        {/* ── THERAPISTS TAB ───────────────────────────────────────────────── */}
        {tab === "therapists" && (
          <>
            {/* Add button + site filter */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Szakemberek ({therapists.length})
                </h2>
                <div className="flex gap-2">
                  {["", "zuglo", "gellert"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSiteFilter(f)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        siteFilter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground hover:bg-accent/80"
                      }`}
                    >
                      {f === "" ? "Összes" : SITE_LABELS[f]}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => {
                  setEditing({ ...emptyTherapist });
                  setIsNew(true);
                }}
                size="sm"
              >
                <Plus size={16} className="mr-2" /> Új szakember
              </Button>
            </div>

            {/* Edit form */}
            {editing && (
              <Card className="mb-8 border-primary/40">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isNew ? "Új szakember" : `Szerkesztés: ${editing.name}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Slug</label>
                      <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} disabled={!isNew} placeholder="pl. nagy-anna" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Név</label>
                      <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="pl. Nagy Anna" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Titulus</label>
                    <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="pl. Klinikai szakpszichológus" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Leírás</label>
                    <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Rövid bemutatkozás" rows={3} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Szakterületek</label>
                    <Input value={editing.specialties} onChange={(e) => setEditing({ ...editing, specialties: e.target.value })} placeholder="pl. Sématerápia, családterápia, EMDR" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Végzettség (pontosvesszővel elválasztva)</label>
                    <Textarea value={editing.education} onChange={(e) => setEditing({ ...editing, education: e.target.value })} placeholder="pl. Okleveles pszichológus – ELTE PPK; Sématerápiás konzultáns – MSE" rows={3} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Kép</label>
                      <div className="flex gap-2">
                        <Input
                          value={editing.image}
                          onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                          placeholder="/uploads/foto.jpg vagy URL"
                          className="flex-1"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium cursor-pointer whitespace-nowrap">
                          <Upload size={14} />
                          {uploading ? "Töltés..." : "Feltöltés"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            disabled={uploading}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleImageUpload(f);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                      {editing.image && (
                        <img src={editing.image} alt="" className="mt-2 h-16 w-16 rounded object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Email</label>
                      <Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Telefon</label>
                      <Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} placeholder="06-30/123-4567" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Rendelési idő</label>
                      <Input value={editing.hours} onChange={(e) => setEditing({ ...editing, hours: e.target.value })} placeholder="pl. Hétfő 9:00-14:00" />
                    </div>
                  </div>
                  {/* Audience radio */}
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Célcsoport</label>
                <div className="flex flex-wrap gap-4">
                  {(Object.entries(AUDIENCE_LABELS) as [Therapist["audience"], string][]).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="radio"
                        name="audience"
                        checked={(editing.audience || "adult") === key}
                        onChange={() => setEditing({ ...editing, audience: key })}
                        className="w-4 h-4"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sites checkboxes */}
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Megjelenés</label>
                <div className="flex gap-6">
                  {Object.entries(SITE_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={(editing.sites || []).includes(key)}
                        onChange={(e) => {
                          const sites = editing.sites || [];
                          setEditing({
                            ...editing,
                            sites: e.target.checked
                              ? [...sites, key]
                              : sites.filter((s) => s !== key),
                          });
                        }}
                        className="w-4 h-4"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} size="sm" disabled={saving}>{saving ? "Mentés..." : "Mentés"}</Button>
                    <Button onClick={() => { setEditing(null); setIsNew(false); }} variant="outline" size="sm">Mégse</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* List */}
            <div className="space-y-3">
              {therapists
                .filter((t) => !siteFilter || (t.sites || []).includes(siteFilter))
                .map((t) => (
                <Card key={t.slug} className="border-border">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-accent" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.title}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {(t.sites || []).map((s) => (
                            <span key={s} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              s === "zuglo" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }`}>
                              {s === "zuglo" ? "Zugló" : "Gellért"}
                            </span>
                          ))}
                          {t.audience && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              t.audience === "adult" ? "bg-amber-100 text-amber-800" :
                              t.audience === "child" ? "bg-pink-100 text-pink-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              {AUDIENCE_LABELS[t.audience]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing({ ...t }); setIsNew(false); }}>
                        <Pencil size={14} className="mr-1" /> Szerkesztés
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(t.slug)} className="text-destructive hover:text-destructive">
                        <Trash2 size={14} className="mr-1" /> Törlés
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {therapists.filter((t) => !siteFilter || (t.sites || []).includes(siteFilter)).length === 0 && (
                <p className="py-8 text-center text-muted-foreground">Nincs szakember ebben a szűrőben.</p>
              )}
            </div>
          </>
        )}

        {/* ── CONTENT TAB ─────────────────────────────────────────────────── */}
        {tab === "content" && (
          <SiteContentEditor
            value={siteContent}
            onChange={setSiteContent}
            onSave={handleSaveContent}
            saving={contentSaving}
          />
        )}

        {/* ── POSTS TAB ───────────────────────────────────────────────────── */}
        {tab === "posts" && (
          <>
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {/* Filter chips */}
              <div className="flex gap-2">
                {(["pending", "posted", "rejected"] as SocialPost["status"][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground hover:bg-accent/80"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              {/* Generate button */}
              <Button size="sm" onClick={handleGenerate} disabled={generating}>
                <RefreshCw size={14} className={`mr-2 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Generálás..." : "Generálás most"}
              </Button>
            </div>

            {/* Post list */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const isExpanded = expandedPost === post.id;
                const isEditing = editingPost?.id === post.id;
                const current = isEditing ? editingPost! : post;

                return (
                  <Card key={post.id} className="border-border">
                    {/* Card header row */}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[post.type]}`}>
                            {TYPE_LABELS[post.type]}
                          </span>
                          <div>
                            <p className="font-medium text-foreground leading-snug">{post.topic || "—"}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(post.created_at).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              {post.posted_fb_at && <span className="ml-2 text-green-600">FB: {new Date(post.posted_fb_at).toLocaleDateString("hu-HU")}</span>}
                              {post.posted_ig_at && <span className="ml-2 text-purple-600">IG: {new Date(post.posted_ig_at).toLocaleDateString("hu-HU")}</span>}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                          className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? "Összezárás" : "Kibontás"}
                        </button>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 space-y-4 border-t border-border pt-4">

                          {/* Facebook caption */}
                          <div>
                            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Facebook szöveg</label>
                            {isEditing ? (
                              <Textarea
                                value={current.fb_caption}
                                onChange={(e) => setEditingPost({ ...current, fb_caption: e.target.value })}
                                rows={6}
                              />
                            ) : (
                              <p className="whitespace-pre-wrap rounded-md bg-accent/40 p-3 text-sm text-foreground">{post.fb_caption}</p>
                            )}
                          </div>

                          {/* Instagram caption */}
                          <div>
                            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Instagram szöveg</label>
                            {isEditing ? (
                              <Textarea
                                value={current.ig_caption}
                                onChange={(e) => setEditingPost({ ...current, ig_caption: e.target.value })}
                                rows={4}
                              />
                            ) : (
                              <p className="whitespace-pre-wrap rounded-md bg-accent/40 p-3 text-sm text-foreground">{post.ig_caption}</p>
                            )}
                          </div>

                          {/* Hashtags */}
                          <div>
                            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Hashtagek</label>
                            {isEditing ? (
                              <Input
                                value={current.hashtags.join(" ")}
                                onChange={(e) => setEditingPost({ ...current, hashtags: e.target.value.split(/\s+/).filter(Boolean) })}
                                placeholder="#pszichológia #mentálhigiéné"
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground">{post.hashtags.join(" ")}</p>
                            )}
                          </div>

                          {/* Image prompt */}
                          <div>
                            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Képprompt (DALL-E / Midjourney)</label>
                            {isEditing ? (
                              <Input
                                value={current.image_prompt}
                                onChange={(e) => setEditingPost({ ...current, image_prompt: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm italic text-muted-foreground">{post.image_prompt}</p>
                            )}
                          </div>

                          {/* Sources */}
                          {post.sources?.length > 0 && (
                            <div>
                              <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Források</label>
                              <ul className="space-y-1">
                                {post.sources.map((src, i) => (
                                  <li key={i}>
                                    <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                      <ExternalLink size={11} />{src}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {post.status === "pending" && !isEditing && (
                              <>
                                <Button size="sm" onClick={() => setConfirmingPost(post.id)}>
                                  <Send size={13} className="mr-1.5" /> Közzétesz
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingPost({ ...post })}>
                                  <Pencil size={13} className="mr-1.5" /> Szerkesztés
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleReject(post.id)} className="text-destructive hover:text-destructive">
                                  <X size={13} className="mr-1.5" /> Elutasít
                                </Button>
                              </>
                            )}
                            {isEditing && (
                              <>
                                <Button size="sm" onClick={handleSavePost}>Mentés</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingPost(null)}>Mégse</Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleDeletePost(post.id)} className="ml-auto text-destructive hover:text-destructive">
                              <Trash2 size={13} className="mr-1.5" /> Törlés
                            </Button>
                          </div>

                          {/* Publish confirmation panel */}
                          {confirmingPost === post.id && (
                            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                              <p className="text-sm font-medium text-foreground">Melyik platformra tegyük közzé?</p>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={publishPlatforms.facebook}
                                    onChange={(e) => setPublishPlatforms((p) => ({ ...p, facebook: e.target.checked }))}
                                  />
                                  Facebook
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={publishPlatforms.instagram}
                                    onChange={(e) => setPublishPlatforms((p) => ({ ...p, instagram: e.target.checked }))}
                                  />
                                  Instagram
                                </label>
                              </div>
                              {publishPlatforms.instagram && (
                                <div>
                                  <label className="mb-1 block text-xs text-muted-foreground">Instagram kép URL (kötelező IG-hez)</label>
                                  <Input
                                    value={publishImageUrl}
                                    onChange={(e) => setPublishImageUrl(e.target.value)}
                                    placeholder="https://..."
                                  />
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handlePublish(post)} disabled={publishing === post.id}>
                                  {publishing === post.id ? "Közzétesz..." : "Megerősítés"}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setConfirmingPost(null)}>Mégse</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {filteredPosts.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  Nincs {STATUS_LABELS[statusFilter].toLowerCase()} bejegyzés.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Site Content Editor ────────────────────────────────────────────────────

const SiteContentEditor = ({
  value,
  onChange,
  onSave,
  saving,
}: {
  value: SiteContent;
  onChange: (v: SiteContent) => void;
  onSave: () => void;
  saving: boolean;
}) => {
  const set = <K extends keyof SiteContent>(section: K, patch: Partial<NonNullable<SiteContent[K]>>) => {
    onChange({ ...value, [section]: { ...(value[section] || {}), ...patch } });
  };

  const TARGET_TILE_COUNT = 6;
  const setTile = (idx: number, patch: Partial<NonNullable<SiteContent["services"]>["tiles"][number]>) => {
    const tiles = [...(value.services?.tiles || [])];
    tiles[idx] = { ...tiles[idx], ...patch };
    set("services", { tiles });
  };
  const addTile = () => {
    const tiles = [...(value.services?.tiles || [])];
    if (tiles.length >= TARGET_TILE_COUNT) return;
    tiles.push({ icon: "User", slug: "", title: "", description: "", content: "" });
    set("services", { tiles });
  };
  const removeTile = (idx: number) => {
    const tiles = (value.services?.tiles || []).filter((_, i) => i !== idx);
    set("services", { tiles });
  };
  const slugify = (s: string) => s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const setHighlight = (idx: number, patch: Partial<NonNullable<SiteContent["about"]>["highlights"][number]>) => {
    const hs = [...(value.about?.highlights || [])];
    hs[idx] = { ...hs[idx], ...patch };
    set("about", { highlights: hs });
  };

  const setParagraph = (idx: number, text: string) => {
    const ps = [...(value.about?.paragraphs || [])];
    ps[idx] = text;
    set("about", { paragraphs: ps });
  };
  const addParagraph = () => set("about", { paragraphs: [...(value.about?.paragraphs || []), ""] });
  const removeParagraph = (idx: number) => set("about", { paragraphs: (value.about?.paragraphs || []).filter((_, i) => i !== idx) });

  const setOperatorLine = (idx: number, text: string) => {
    const ls = [...(value.footer?.operator_lines || [])];
    ls[idx] = text;
    set("footer", { operator_lines: ls });
  };
  const addOperatorLine = () => set("footer", { operator_lines: [...(value.footer?.operator_lines || []), ""] });
  const removeOperatorLine = (idx: number) => set("footer", { operator_lines: (value.footer?.operator_lines || []).filter((_, i) => i !== idx) });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Főoldal tartalom szerkesztése</h2>
        <Button onClick={onSave} disabled={saving}>{saving ? "Mentés..." : "Összes mentése"}</Button>
      </div>

      {/* HERO */}
      <Card>
        <CardHeader><CardTitle className="text-base">Hero (felső blokk)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="Felső kis felirat (kicker)">
            <Input value={value.hero?.kicker || ""} onChange={(e) => set("hero", { kicker: e.target.value })} placeholder="Budapest XIV. kerület" />
          </Field>
          <Field label="Alcím / leírás">
            <Textarea value={value.hero?.subtitle || ""} onChange={(e) => set("hero", { subtitle: e.target.value })} rows={2} />
          </Field>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Elsődleges gomb felirata">
              <Input value={value.hero?.primary_cta || ""} onChange={(e) => set("hero", { primary_cta: e.target.value })} placeholder="Időpontot kérek" />
            </Field>
            <Field label="Másodlagos gomb felirata">
              <Input value={value.hero?.secondary_cta || ""} onChange={(e) => set("hero", { secondary_cta: e.target.value })} placeholder="Szolgáltatásaink" />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* SERVICES */}
      <Card>
        <CardHeader><CardTitle className="text-base">Szolgáltatások szekció</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Kicker">
              <Input value={value.services?.kicker || ""} onChange={(e) => set("services", { kicker: e.target.value })} />
            </Field>
            <Field label="Cím">
              <Input value={value.services?.heading || ""} onChange={(e) => set("services", { heading: e.target.value })} />
            </Field>
            <Field label="Alcím">
              <Input value={value.services?.subtitle || ""} onChange={(e) => set("services", { subtitle: e.target.value })} />
            </Field>
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">Szolgáltatás kártyák</p>
                <p className="text-xs text-muted-foreground">{(value.services?.tiles || []).length}/{TARGET_TILE_COUNT} (mindig 6 kártya)</p>
              </div>
              {(value.services?.tiles || []).length < TARGET_TILE_COUNT && (
                <Button size="sm" variant="outline" onClick={addTile}><Plus size={14} className="mr-1" /> Új kártya</Button>
              )}
            </div>
            <div className="space-y-4">
              {(value.services?.tiles || []).map((t, i) => {
                const tilesLen = (value.services?.tiles || []).length;
                const canRemove = tilesLen > TARGET_TILE_COUNT;
                return (
                  <div key={i} className="rounded-lg border border-border p-4 space-y-2 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Kártya #{i + 1}</p>
                      {canRemove ? (
                        <Button size="sm" variant="outline" onClick={() => removeTile(i)} className="text-destructive">
                          <Trash2 size={13} className="mr-1" /> Törlés
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Min. {TARGET_TILE_COUNT} kártya kötelező</span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-2">
                      <Field label="Ikon (User, Baby, Heart, Users, Brain, Laptop, Smile, BookOpen, Briefcase, Sparkles)">
                        <Input value={t.icon || ""} onChange={(e) => setTile(i, { icon: e.target.value })} placeholder="User" />
                      </Field>
                      <Field label="Cím">
                        <Input
                          value={t.title || ""}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            const patch: { title: string; slug?: string } = { title: newTitle };
                            // Auto-generate slug if empty
                            if (!t.slug) patch.slug = slugify(newTitle);
                            setTile(i, patch);
                          }}
                        />
                      </Field>
                      <Field label="URL slug (pl. felnott-egyeni-terapia)">
                        <Input value={t.slug || ""} onChange={(e) => setTile(i, { slug: e.target.value })} placeholder="auto a címből" />
                      </Field>
                    </div>
                    <Field label="Rövid leírás (a kártyán látszik)">
                      <Textarea value={t.description || ""} onChange={(e) => setTile(i, { description: e.target.value })} rows={2} />
                    </Field>
                    <Field label="Hosszú szöveg (az aloldalon — ÜRES sor új bekezdés)">
                      <Textarea
                        value={t.content || ""}
                        onChange={(e) => setTile(i, { content: e.target.value })}
                        rows={8}
                        placeholder="Részletes szolgáltatásleírás. Kettős sortöréssel új bekezdés."
                      />
                    </Field>
                    {t.slug && (
                      <p className="text-xs text-muted-foreground pt-1">
                        Aloldal URL: <code className="text-foreground">/szolgaltatasok/{t.slug}</code>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ABOUT */}
      <Card>
        <CardHeader><CardTitle className="text-base">Rólunk szekció</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Kicker">
              <Input value={value.about?.kicker || ""} onChange={(e) => set("about", { kicker: e.target.value })} />
            </Field>
            <Field label="Cím">
              <Input value={value.about?.heading || ""} onChange={(e) => set("about", { heading: e.target.value })} />
            </Field>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Bekezdések</p>
              <Button size="sm" variant="outline" onClick={addParagraph}><Plus size={14} className="mr-1" /> Új bekezdés</Button>
            </div>
            {(value.about?.paragraphs || []).map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Textarea value={p} onChange={(e) => setParagraph(i, e.target.value)} rows={3} className="flex-1" />
                <Button size="sm" variant="outline" onClick={() => removeParagraph(i)} className="text-destructive">
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <p className="text-sm font-medium mb-3">Kiemelt számadatok (3 db, label + érték)</p>
            <div className="space-y-2">
              {(value.about?.highlights || []).map((h, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-2">
                  <Input value={h.icon || ""} onChange={(e) => setHighlight(i, { icon: e.target.value })} placeholder="Ikon (Shield/Award/Clock)" />
                  <Input value={h.label || ""} onChange={(e) => setHighlight(i, { label: e.target.value })} placeholder="Felirat" />
                  <Input value={h.value || ""} onChange={(e) => setHighlight(i, { value: e.target.value })} placeholder="Érték" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONTACT */}
      <Card>
        <CardHeader><CardTitle className="text-base">Kapcsolat szekció</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Kicker"><Input value={value.contact?.kicker || ""} onChange={(e) => set("contact", { kicker: e.target.value })} /></Field>
            <Field label="Cím"><Input value={value.contact?.heading || ""} onChange={(e) => set("contact", { heading: e.target.value })} /></Field>
            <Field label="Alcím"><Input value={value.contact?.subtitle || ""} onChange={(e) => set("contact", { subtitle: e.target.value })} /></Field>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Telefon"><Input value={value.contact?.phone || ""} onChange={(e) => set("contact", { phone: e.target.value })} /></Field>
            <Field label="Telefon alfelirat"><Input value={value.contact?.phone_subtitle || ""} onChange={(e) => set("contact", { phone_subtitle: e.target.value })} /></Field>
            <Field label="Email"><Input value={value.contact?.email || ""} onChange={(e) => set("contact", { email: e.target.value })} /></Field>
            <Field label="Cím"><Input value={value.contact?.address || ""} onChange={(e) => set("contact", { address: e.target.value })} /></Field>
            <Field label="Cím alfelirat"><Input value={value.contact?.address_subtitle || ""} onChange={(e) => set("contact", { address_subtitle: e.target.value })} /></Field>
            <Field label="Nyitvatartás"><Input value={value.contact?.hours || ""} onChange={(e) => set("contact", { hours: e.target.value })} /></Field>
            <Field label="Nyitvatartás alfelirat"><Input value={value.contact?.hours_subtitle || ""} onChange={(e) => set("contact", { hours_subtitle: e.target.value })} /></Field>
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <p className="text-sm font-medium mb-3">Megközelítés</p>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Tömegközlekedés cím"><Input value={value.contact?.transport_public_label || ""} onChange={(e) => set("contact", { transport_public_label: e.target.value })} /></Field>
              <Field label="Autó cím"><Input value={value.contact?.transport_car_label || ""} onChange={(e) => set("contact", { transport_car_label: e.target.value })} /></Field>
              <Field label="Tömegközlekedés szöveg"><Textarea value={value.contact?.transport_public || ""} onChange={(e) => set("contact", { transport_public: e.target.value })} rows={2} /></Field>
              <Field label="Autó szöveg"><Textarea value={value.contact?.transport_car || ""} onChange={(e) => set("contact", { transport_car: e.target.value })} rows={2} /></Field>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <Card>
        <CardHeader><CardTitle className="text-base">Footer</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="Bemutatkozó szöveg">
            <Textarea value={value.footer?.intro || ""} onChange={(e) => set("footer", { intro: e.target.value })} rows={2} />
          </Field>

          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Üzemeltető cím"><Input value={value.footer?.operator_heading || ""} onChange={(e) => set("footer", { operator_heading: e.target.value })} /></Field>
            <Field label="Követés cím"><Input value={value.footer?.follow_heading || ""} onChange={(e) => set("footer", { follow_heading: e.target.value })} /></Field>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Üzemeltető sorok</p>
              <Button size="sm" variant="outline" onClick={addOperatorLine}><Plus size={14} className="mr-1" /> Új sor</Button>
            </div>
            {(value.footer?.operator_lines || []).map((line, i) => (
              <div key={i} className="flex gap-2">
                <Input value={line} onChange={(e) => setOperatorLine(i, e.target.value)} className="flex-1" />
                <Button size="sm" variant="outline" onClick={() => removeOperatorLine(i)} className="text-destructive">
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Facebook URL"><Input value={value.footer?.facebook_url || ""} onChange={(e) => set("footer", { facebook_url: e.target.value })} /></Field>
            <Field label="Instagram URL"><Input value={value.footer?.instagram_url || ""} onChange={(e) => set("footer", { instagram_url: e.target.value })} /></Field>
          </div>

          <Field label="NEAK szám sor">
            <Input value={value.footer?.neak_number || ""} onChange={(e) => set("footer", { neak_number: e.target.value })} />
          </Field>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={onSave} disabled={saving} size="lg">
          {saving ? "Mentés..." : "Összes mentése"}
        </Button>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);

export default Admin;
