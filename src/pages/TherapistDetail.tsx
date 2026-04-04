import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Clock, User } from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center pt-16">
          <p className="text-muted-foreground">Betöltés...</p>
        </div>
      </>
    );
  }

  if (!therapist) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
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
      <main className="pt-16">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Link
              to="/#szakembereink"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Vissza a szakemberekhez
            </Link>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Photo */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-accent">
                  {therapist.image ? (
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-24 h-24 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
                  {therapist.name}
                </h1>
                <p className="text-primary text-lg font-medium mb-6">
                  {therapist.title}
                </p>

                {/* Specialties */}
                {therapist.specialties && (
                  <div className="mb-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
                      Szakterületek
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.split(",").map((s) => (
                        <span
                          key={s.trim()}
                          className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {therapist.description && (
                  <div className="mb-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
                      Bemutatkozás
                    </h2>
                    <p className="text-foreground text-lg leading-relaxed">
                      {therapist.description}
                    </p>
                  </div>
                )}

                {/* Education */}
                {therapist.education && (
                  <div className="mb-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
                      Végzettség
                    </h2>
                    <ul className="space-y-2">
                      {therapist.education.split(";").map((e) => (
                        <li key={e.trim()} className="flex items-start gap-2 text-foreground">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{e.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact info */}
                <div className="bg-card rounded-xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
                  <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium mb-4">
                    Elérhetőségek
                  </h2>
                  <div className="space-y-3">
                    {therapist.hours && (
                      <div className="flex items-center gap-3 text-foreground">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{therapist.hours}</span>
                      </div>
                    )}
                    {therapist.email && (
                      <div className="flex items-center gap-3 text-foreground">
                        <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                        <a
                          href={`mailto:${therapist.email}`}
                          className="hover:text-primary transition-colors"
                        >
                          {therapist.email}
                        </a>
                      </div>
                    )}
                    {therapist.phone && (
                      <div className="flex items-center gap-3 text-foreground">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <a
                          href={`tel:${therapist.phone.replace(/[^+\d]/g, "")}`}
                          className="hover:text-primary transition-colors"
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
