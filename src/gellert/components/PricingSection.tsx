import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    title: "Egyéni terápia / konzultáció",
    duration: "45–50 perc",
    price: "16 000 – 20 000 Ft",
    features: [
      "Felnőtt egyéni pszichoterápia",
      "Pszichológiai konzultáció",
      "Katatím imaginatív terápia",
      "Autogén tréning",
    ],
  },
  {
    title: "Párterápia",
    duration: "90 perc",
    price: "35 000 Ft",
    highlight: true,
    features: [
      "Kettős terapeuta-vezetéssel",
      "Kapcsolati kríziskezelés",
      "Kommunikációfejlesztés",
      "Családterápia",
    ],
  },
  {
    title: "Pszichodiagnosztika",
    duration: "Egyéni megbeszélés",
    price: "Egyéni árajánlat",
    features: [
      "Személyiségvizsgálat",
      "Intelligenciatesztek",
      "Projektív tesztek",
      "Diagnosztikai vélemény",
    ],
  },
];

const PricingSection = () => (
  <section id="arak" className="py-24 lg:py-32 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3 font-medium">Díjszabás</p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
          Árak
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Átlátható díjszabás — előzetes bejelentkezés szükséges.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-8 flex flex-col ${
              p.highlight
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border"
            }`}
            style={!p.highlight ? { boxShadow: "var(--card-shadow)" } : {}}
          >
            <div className="mb-6">
              <p className={`text-sm font-medium mb-1 ${p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {p.duration}
              </p>
              <h3 className="font-display text-xl font-semibold mb-3">{p.title}</h3>
              <p className={`text-2xl font-bold ${p.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                {p.price}
              </p>
            </div>

            <ul className="space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlight ? "text-primary-foreground/70" : "text-primary"}`} />
                  <span className={`text-sm ${p.highlight ? "text-primary-foreground/90" : "text-muted-foreground"}`}>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="tel:+36304140029"
              className={`mt-8 block text-center py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 ${
                p.highlight
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              Bejelentkezés
            </a>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mt-8"
      >
        Bejelentkezés telefonon: <a href="tel:+36304140029" className="text-primary hover:underline">+36 30 414 00 29</a> — Hétfő és Csütörtök 9:00–15:00
      </motion.p>
    </div>
  </section>
);

export default PricingSection;
