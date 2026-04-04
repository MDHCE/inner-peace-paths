import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, ArrowLeft, Send, X, RefreshCw, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";

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
  sites: ["zuglo"],
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
  const [tab, setTab] = useState<"therapists" | "posts">("therapists");

  // ── Therapists state ──────────────────────────────────────────────────────
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [editing, setEditing] = useState<Therapist | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [siteFilter, setSiteFilter] = useState("");

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

  useEffect(() => { fetchTherapists(); }, []);
  useEffect(() => { if (tab === "posts") fetchPosts(); }, [tab, statusFilter]);

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
    }
    setSaving(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Törli a szakembert: "${slug}"?`)) return;
    const res = await fetch(`/api/admin/therapists/${slug}`, { method: "DELETE" });
    if (res.ok) fetchTherapists();
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
                      <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Kép URL</label>
                      <Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="/assets/foto.jpg vagy URL" />
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
                        <div className="flex gap-1 mt-1">
                          {(t.sites || []).map((s) => (
                            <span key={s} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              s === "zuglo" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }`}>
                              {s === "zuglo" ? "Zugló" : "Gellért"}
                            </span>
                          ))}
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

export default Admin;
