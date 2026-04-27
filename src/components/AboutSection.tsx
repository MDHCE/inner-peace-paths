import { motion } from "framer-motion";
import { Shield, Award, Clock, Heart, Star, Sparkles, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/context/SiteContent";

const iconMap: Record<string, LucideIcon> = { Shield, Award, Clock, Heart, Star, Sparkles };

const defaultHighlights = [
  { icon: "Shield", label: "NEAK szám", value: "513289" },
  { icon: "Award", label: "Szakmai tapasztalat", value: "15+ év" },
  { icon: "Clock", label: "Nyitvatartás", value: "H-P 8-20, Sz 8-15" },
];

const AboutSection = () => {
  const { about } = useSiteContent();
  const kicker = about?.kicker ?? "Rólunk";
  const heading = about?.heading ?? "Professzionális segítség, bizalmas környezetben";
  const paragraphs = about?.paragraphs?.length
    ? about.paragraphs
    : [
        "A Zuglói Pszichológiai Központ létrehozásával célunk egy komplex, magas színvonalú ellátást biztosító rendelő volt, ahol felnőtteket, gyerekeket, serdülőket, párokat és családokat fogadunk.",
        "Kollégáink széles körű módszerspecifikus tapasztalatokkal rendelkeznek. Csecsemőkori problémáktól a felnőttkori pszichoterápiáig, pszichodiagnosztikától a tanácsadásig teljes körű ellátást kínálunk.",
      ];
  const highlights = about?.highlights?.length ? about.highlights : defaultHighlights;

  return (
    <section id="rolunk" className="py-24 lg:py-32 bg-background leaf-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3 font-medium">{kicker}</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              {heading}
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid gap-5"
          >
            {highlights.map((h, i) => {
              const Icon = iconMap[h.icon || ""] ?? Shield;
              return (
                <div
                  key={(h.label || "hl") + i}
                  className="flex items-center gap-5 bg-card rounded-xl p-6"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{h.label}</p>
                    <p className="font-display text-2xl font-semibold text-foreground">{h.value}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
