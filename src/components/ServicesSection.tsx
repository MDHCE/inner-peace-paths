import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Baby, Heart, Users, Brain, Laptop, Smile, BookOpen, Briefcase, Sparkles, ArrowRight, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/context/SiteContent";

// Icon name → component map. Add more as needed.
const iconMap: Record<string, LucideIcon> = {
  User, Baby, Smile, Heart, Users, Brain, Laptop, BookOpen, Briefcase, Sparkles,
};

const defaultTiles = [
  { icon: "User",   slug: "felnott-egyeni-terapia",      title: "Felnőtt egyéni terápia", description: "Klinikai szakpszichológia, pszichológiai tanácsadás, személyiségvizsgálat, autogén tréning és relaxáció." },
  { icon: "Smile",  slug: "gyermekterapia",              title: "Gyermekterápia",         description: "Nevelési tanácsadás, iskolaérettség vizsgálata, ADHD diagnosztika, viselkedéses zavarok kezelése." },
  { icon: "Heart",  slug: "parterapia",                  title: "Párterápia",             description: "Kommunikációs problémák, válságok feldolgozása, kapcsolati minták felismerése és átalakítása." },
  { icon: "Users",  slug: "csaladterapia",               title: "Családterápia",          description: "Gyermeknevelési problémák, családi kommunikáció, családi rendszerek vizsgálata és támogatása." },
  { icon: "Brain",  slug: "pszichodiagnosztika",         title: "Pszichodiagnosztika",    description: "Intelligencia- és személyiségtesztek, figyelemzavar vizsgálata, klinikai szakvélemény." },
  { icon: "Baby",   slug: "szulo-csecsemo-konzultacio",  title: "Szülő-csecsemő konzultáció", description: "Koragyermekkori regulációs zavarok, alvás-, evés-, sírás-problémák, kötődés támogatása 0–6 éves korban." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ServicesSection = () => {
  const { services } = useSiteContent();
  const kicker = services?.kicker ?? "Szolgáltatásaink";
  const heading = services?.heading ?? "Miben segíthetünk?";
  const subtitle = services?.subtitle ?? "Minden életkorban és élethelyzetben megbízható pszichológiai támogatást nyújtunk.";
  const linkLabel = services?.details_link_label ?? "Részletek";
  const tiles = services?.tiles?.length ? services.tiles : defaultTiles;

  return (
    <section id="szolgaltatasok" className="py-24 lg:py-32" style={{ background: "var(--section-gradient)" }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3 font-medium">{kicker}</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tiles.map((s, idx) => {
            const Icon = iconMap[s.icon || ""] ?? User;
            const hasDetails = !!s.slug;
            return (
              <motion.div
                key={(s.slug || s.title || "tile") + idx}
                variants={item}
                className="group bg-background rounded-xl p-8 transition-shadow duration-300 flex flex-col"
                style={{ boxShadow: "var(--card-shadow)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow)")}
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{s.description}</p>
                {hasDetails && (
                  <Link
                    to={`/szolgaltatasok/${s.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
                  >
                    {linkLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
