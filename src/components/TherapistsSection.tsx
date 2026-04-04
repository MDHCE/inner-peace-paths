import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Clock, User, ArrowRight } from "lucide-react";
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

  return (
    <section id="szakembereink" className="py-24 lg:py-32 bg-accent/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {t.name}
                </h3>
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
    </section>
  );
};

export default TherapistsSection;
