import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Therapist {
  slug: string;
  name: string;
  title: string;
  image: string;
  description: string;
  specialties: string;
  email: string;
  phone: string;
  hours: string;
}

const emptyTherapist: Therapist = {
  slug: "",
  name: "",
  title: "",
  image: "",
  description: "",
  specialties: "",
  email: "",
  phone: "",
  hours: "",
};

const Admin = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [editing, setEditing] = useState<Therapist | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTherapists = () =>
    fetch("/api/therapists")
      .then((r) => r.json())
      .then(setTherapists)
      .catch(() => {});

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const url = isNew ? "/api/therapists" : `/api/therapists/${editing.slug}`;
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
    const res = await fetch(`/api/therapists/${slug}`, { method: "DELETE" });
    if (res.ok) fetchTherapists();
  };

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
            Szakemberek kezelése
          </h1>
        </div>

        {/* Add button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Szakembereink ({therapists.length})
          </h2>
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
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Slug
                  </label>
                  <Input
                    value={editing.slug}
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                    disabled={!isNew}
                    placeholder="pl. nagy-anna"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Név
                  </label>
                  <Input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    placeholder="pl. Nagy Anna"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Titulus
                </label>
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="pl. Klinikai szakpszichológus"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Leírás
                </label>
                <Textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Rövid bemutatkozás"
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Szakterületek
                </label>
                <Input
                  value={editing.specialties}
                  onChange={(e) =>
                    setEditing({ ...editing, specialties: e.target.value })
                  }
                  placeholder="pl. Sématerápia, családterápia, EMDR"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Kép URL
                  </label>
                  <Input
                    value={editing.image}
                    onChange={(e) =>
                      setEditing({ ...editing, image: e.target.value })
                    }
                    placeholder="/assets/foto.jpg vagy URL"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <Input
                    value={editing.email}
                    onChange={(e) =>
                      setEditing({ ...editing, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Telefon
                  </label>
                  <Input
                    value={editing.phone}
                    onChange={(e) =>
                      setEditing({ ...editing, phone: e.target.value })
                    }
                    placeholder="06-30/123-4567"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Rendelési idő
                  </label>
                  <Input
                    value={editing.hours}
                    onChange={(e) =>
                      setEditing({ ...editing, hours: e.target.value })
                    }
                    placeholder="pl. Hétfő 9:00-14:00"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  {saving ? "Mentés..." : "Mentés"}
                </Button>
                <Button
                  onClick={() => {
                    setEditing(null);
                    setIsNew(false);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Mégse
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-3">
          {therapists.map((t) => (
            <Card key={t.slug} className="border-border">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-accent" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing({ ...t });
                      setIsNew(false);
                    }}
                  >
                    <Pencil size={14} className="mr-1" /> Szerkesztés
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(t.slug)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} className="mr-1" /> Törlés
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {therapists.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Még nincsenek szakemberek felvéve.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
