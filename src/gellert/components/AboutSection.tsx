import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";

const highlights = [
  { icon: MapPin, label: "Helyszín", value: "Ménesi út 10., XI. ker." },
  { icon: Calendar, label: "Alapítva", value: "2018" },
  { icon: Clock, label: "Nyitvatartás", value: "H–Sz 9:00–21:00" },
];

const AboutSection = () => (
  <section id="rolunk" className="py-24 lg:py-32 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3 font-medium">Rólunk</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Csendes, zöld helyszín a város szívében
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              A Gellérthegyi Pszichológiai Rendelőt azzal a céllal hoztuk létre 2018-ban, hogy elérhető és magas szakmai színvonalú pszichológiai ellátást biztosítsunk felnőttek számára.
            </p>
            <p>
              Rendelőnk csendes, zöld környezetben, a Gellért-hegy lábánál található, ahol nyugodt légkörben foglalkozhatunk pácienseinkkel. Szakembereink sokéves klinikai tapasztalattal, többféle terápiás módszerben jártasan várják a hozzánk fordulókat.
            </p>
            <p>
              Testvérrendelőnk a XIV. kerületben, a Zuglói Pszichológiai Központban gyermek- és családterápiás ellátást is biztosít.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid gap-5"
        >
          {highlights.map((h) => (
            <div
              key={h.label}
              className="flex items-center gap-5 bg-card rounded-xl p-6"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <h.icon className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{h.label}</p>
                <p className="font-display text-2xl font-semibold text-foreground">{h.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
