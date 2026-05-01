import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Baby, Heart, Users, Brain, Laptop, Smile, BookOpen, Briefcase, Sparkles, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/context/SiteContent";

const iconMap: Record<string, LucideIcon> = {
  User, Baby, Smile, Heart, Users, Brain, Laptop, BookOpen, Briefcase, Sparkles,
};

// Same slug-from-title fallback used in ServicesSection so that tiles imported
// from admin without an explicit slug still resolve to a subpage by title.
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { services } = useSiteContent();
  const tiles = services?.tiles || [];
  // Match on explicit slug first, fall back to slugified title.
  const tile = tiles.find((t) => {
    const tileSlug = t.slug?.trim() || (t.title ? slugify(t.title) : "");
    return tileSlug === slug;
  });

  if (!tile) {
    return (
      <>
        <Navbar />
        <main
          className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4"
          style={{ background: "var(--subpage-gradient)" }}
        >
          <p className="text-muted-foreground text-lg">Szolgáltatás nem található.</p>
          <Link
            to="/#szolgaltatasok"
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Vissza a szolgáltatásokhoz
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = iconMap[tile.icon || ""] ?? User;
  const pageTitle = `${tile.title} | Zuglói Pszichológiai Központ`;
  const pageDescription = tile.description || `${tile.title} a Zuglói Pszichológiai Központban.`;
  const paragraphs = (tile.content || "").split(/\n\n+/).filter((p) => p.trim().length);

  // Suggest related services (everything except current). Use the same
  // slug-with-fallback rule so tiles without explicit slugs still get listed.
  const related = tiles
    .filter((t) => {
      const ts = t.slug?.trim() || (t.title ? slugify(t.title) : "");
      return ts && ts !== slug;
    })
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription.slice(0, 155)} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription.slice(0, 155)} />
      </Helmet>
      <Navbar />

      <main className="pt-16 relative overflow-hidden" style={{ background: "var(--subpage-gradient)" }}>
        {/* Decorative background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(168 35% 60%) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 -left-32 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(40 50% 75%) 0%, transparent 70%)" }}
        />

        {/* Header band */}
        <div className="relative" style={{ background: "var(--subpage-band-gradient)" }}>
          <div className="container mx-auto px-4 py-10 lg:py-14">
            <Link
              to="/#szolgaltatasok"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Vissza a szolgáltatásokhoz
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 max-w-3xl flex items-start gap-5"
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-xs uppercase tracking-[0.25em] font-medium mb-2">
                  Szolgáltatás
                </p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight">
                  {tile.title}
                </h1>
                {tile.description && (
                  <p className="text-primary-foreground/85 text-lg mt-3 font-light">
                    {tile.description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl p-7 md:p-10 relative overflow-hidden"
              style={{
                background: "var(--soft-card-gradient)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              <div
                aria-hidden
                className="absolute -top-1 left-0 w-32 h-1 rounded-b-full"
                style={{ background: "var(--photo-frame-gradient)" }}
              />
              {paragraphs.length > 0 ? (
                <div className="space-y-5 text-foreground text-lg leading-relaxed whitespace-pre-line">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Részletes leírás hamarosan. Kérjük, vegye fel velünk a kapcsolatot a {tile.title.toLowerCase()} kapcsán.
                </p>
              )}
            </motion.article>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 rounded-2xl p-7 md:p-9 relative overflow-hidden text-primary-foreground text-center"
              style={{
                background: "var(--subpage-band-gradient)",
                boxShadow: "var(--card-shadow-deep)",
              }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
                Vegye fel velünk a kapcsolatot
              </h2>
              <p className="text-primary-foreground/85 mb-6 max-w-xl mx-auto">
                Bejelentkezés és további információ a Kapcsolat menüpont alatt.
              </p>
              <Link
                to="/#kapcsolat"
                className="inline-flex items-center gap-2 bg-primary-foreground text-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Kapcsolat
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Related services */}
            {related.length > 0 && (
              <div className="mt-16">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-6">
                  További szolgáltatásaink
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((r, i) => {
                    const RelIcon = iconMap[r.icon || ""] ?? User;
                    const relSlug = r.slug?.trim() || (r.title ? slugify(r.title) : "");
                    return (
                      <Link
                        key={relSlug || i}
                        to={`/szolgaltatasok/${relSlug}`}
                        className="group rounded-xl p-5 bg-background hover:-translate-y-1 transition-transform"
                        style={{ boxShadow: "var(--card-shadow)" }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3">
                          <RelIcon className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <p className="font-display font-semibold text-foreground mb-1">{r.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                          Részletek
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ServiceDetail;
