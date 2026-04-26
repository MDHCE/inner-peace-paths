import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Clock, User, GraduationCap, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSite } from "@/context/SiteContext";

const SITE_URLS: Record<string, string> = {
  zuglo: "https://zugloipszichologiaikozpont.hu",
  gellert: "https://www.gellerthegyirendelo.hu",
};

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
}

const TherapistDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { apiBase, therapistRoute, key } = useSite();
  const SITE_URL = SITE_URLS[key];
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBase}/therapists/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setTherapist)
      .catch(() => setTherapist(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: "var(--subpage-gradient)" }}>
          <p className="text-muted-foreground">Betöltés...</p>
        </div>
      </>
    );
  }

  if (!therapist) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4"
          style={{ background: "var(--subpage-gradient)" }}
        >
          <p className="text-muted-foreground text-lg">Szakember nem található.</p>
          <Link
            to={`${therapistRoute === "/szakemberek" ? "/" : "/gellert/"}#szakembereink`}
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Vissza a szakemberekhez
          </Link>
        </div>
      </>
    );
  }

  const pageTitle = `${therapist.name} – ${therapist.title} | Zuglói Pszichológiai Központ`;
  const pageDescription = therapist.description
    ? therapist.description.slice(0, 155).trimEnd() + "…"
    : `${therapist.name} – ${therapist.title}. Zuglói Pszichológiai Központ, Budapest XIV. kerület.`;
  const canonicalUrl = `${SITE_URL}${therapistRoute}/${therapist.slug}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: therapist.name,
    jobTitle: therapist.title,
    url: canonicalUrl,
    ...(therapist.image ? { image: therapist.image.startsWith("http") ? therapist.image : `${SITE_URL}${therapist.image}` } : {}),
    ...(therapist.email ? { email: `mailto:${therapist.email}` } : {}),
    ...(therapist.phone ? { telephone: therapist.phone } : {}),
    worksFor: {
      "@type": "MedicalBusiness",
      name: "Zuglói Pszichológiai Központ",
      url: SITE_URL,
    },
    knowsAbout: therapist.specialties ? therapist.specialties.split(",").map((s) => s.trim()) : [],
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="profile" />
        {therapist.image && therapist.image.startsWith("http") && (
          <meta property="og:image" content={therapist.image} />
        )}
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
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
        <div
          className="relative"
          style={{ background: "var(--subpage-band-gradient)" }}
        >
          <div className="container mx-auto px-4 py-10 lg:py-14">
            <Link
              to="/#szakembereink"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Vissza a szakemberekhez
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 max-w-3xl"
            >
              <p className="text-primary-foreground/70 text-xs uppercase tracking-[0.25em] font-medium mb-3">
                Szakember bemutatása
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight">
                {therapist.name}
              </h1>
              <p className="text-primary-foreground/85 text-lg md:text-xl mt-3 font-light">
                {therapist.title}
              </p>
            </motion.div>
          </div>
        </div>

        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-14 items-start">
              {/* Photo with gradient frame */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1 lg:sticky lg:top-24"
              >
                <div
                  className="relative p-1.5 rounded-2xl"
                  style={{
                    background: "var(--photo-frame-gradient)",
                    boxShadow: "var(--card-shadow-deep)",
                  }}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-accent">
                    {therapist.image ? (
                      <img
                        src={therapist.image}
                        alt={therapist.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent to-secondary">
                        <User className="w-24 h-24 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-background flex items-center justify-center" style={{ boxShadow: "var(--card-shadow)" }}>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2 space-y-10"
              >
                {/* Specialties */}
                {therapist.specialties && (
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                      Szakterületek
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.split(",").map((s) => (
                        <span
                          key={s.trim()}
                          className="bg-gradient-to-br from-accent to-accent/60 text-accent-foreground px-3.5 py-1.5 rounded-full text-sm font-medium border border-primary/15"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {therapist.description && (
                  <div
                    className="rounded-2xl p-7 md:p-9 relative overflow-hidden"
                    style={{
                      background: "var(--soft-card-gradient)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute -top-1 left-0 w-24 h-1 rounded-b-full"
                      style={{ background: "var(--photo-frame-gradient)" }}
                    />
                    <h2 className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                      Bemutatkozás
                    </h2>
                    <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
                      {therapist.description}
                    </p>
                  </div>
                )}

                {/* Education */}
                {therapist.education && (
                  <div
                    className="rounded-2xl p-7 md:p-9 bg-background/70 backdrop-blur-sm border border-border/60"
                    style={{ boxShadow: "var(--card-shadow)" }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <h2 className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
                        Végzettség
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {therapist.education.split(";").map((e) => (
                        <li key={e.trim()} className="flex items-start gap-3 text-foreground">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="leading-relaxed">{e.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact info */}
                <div
                  className="rounded-2xl p-7 md:p-9 relative overflow-hidden text-primary-foreground"
                  style={{
                    background: "var(--subpage-band-gradient)",
                    boxShadow: "var(--card-shadow-deep)",
                  }}
                >
                  <h2 className="text-sm uppercase tracking-[0.2em] text-primary-foreground/80 font-semibold mb-5">
                    Elérhetőségek
                  </h2>
                  <div className="space-y-4">
                    {therapist.hours && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                        <span>{therapist.hours}</span>
                      </div>
                    )}
                    {therapist.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                        <a
                          href={`mailto:${therapist.email}`}
                          className="hover:underline transition-colors"
                        >
                          {therapist.email}
                        </a>
                      </div>
                    )}
                    {therapist.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                        <a
                          href={`tel:${therapist.phone.replace(/[^+\d]/g, "")}`}
                          className="hover:underline transition-colors"
                        >
                          {therapist.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TherapistDetail;
