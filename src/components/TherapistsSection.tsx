import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Users, Baby } from "lucide-react";
import { useSite } from "@/context/SiteContext";

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
  audience?: "adult" | "child" | "both";
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TherapistsSection = () => {
  const { apiBase, therapistRoute } = useSite();
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/therapists`)
      .then((r) => r.json())
      .then(setTherapists)
      .catch(() => {});
  }, []);

  if (therapists.length === 0) return null;

  const adults = therapists.filter(
    (t) => !t.audience || t.audience === "adult" || t.audience === "both",
  );
  const children = therapists.filter(
    (t) => t.audience === "child" || t.audience === "both",
  );

  return (
    <section id="szakembereink" className="py-24 lg:py-32 bg-accent/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3 font-medium">
            Szakembereink
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Ismerje meg csapatunkat
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tapasztalt és elkötelezett szakembereink széles körű módszerspecifikus tudással várják pácienseinket.
          </p>
        </motion.div>

        {adults.length > 0 && (
          <TherapistGroup
            id="felnottek"
            title="Felnőttekkel foglalkozó szakembereink"
            icon={Users}
            therapists={adults}
            therapistRoute={therapistRoute}
          />
        )}

        {children.length > 0 && (
          <TherapistGroup
            id="gyermekek-serdulok"
            title="Gyermekekkel és serdülőkkel foglalkozó szakembereink"
            icon={Baby}
            therapists={children}
            therapistRoute={therapistRoute}
            className="mt-24"
          />
        )}
      </div>
    </section>
  );
};

const TherapistGroup = ({
  id,
  title,
  icon: Icon,
  therapists,
  therapistRoute,
  className = "",
}: {
  id: string;
  title: string;
  icon: typeof Users;
  therapists: Therapist[];
  therapistRoute: string;
  className?: string;
}) => (
  <div id={id} className={`scroll-mt-24 ${className}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 mb-12"
    >
      <div className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full px-5 py-2 shadow-sm">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">
          {therapists.length} szakember
        </span>
      </div>
      <div className="flex items-center gap-4 w-full">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground text-center">
          {title}
        </h3>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
      </div>
    </motion.div>

    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {therapists.map((t) => (
        <motion.div
          key={t.slug}
          variants={item}
          className="bg-card rounded-xl overflow-hidden group transition-shadow duration-300"
          style={{ boxShadow: "var(--card-shadow)" }}
          whileHover={{ y: -4 }}
        >
          <div className="aspect-[4/3] overflow-hidden bg-accent">
            {t.image ? (
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="p-6">
            <h4 className="font-display text-xl font-semibold text-foreground mb-1">
              {t.name}
            </h4>
            <p className="text-primary text-sm font-medium mb-3">{t.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {t.specialties}
            </p>

            <Link
              to={`${therapistRoute}/${t.slug}`}
              className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
            >
              Bővebben
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default TherapistsSection;
