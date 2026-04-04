import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  const scrollTo = () => {
    document.querySelector("#szolgaltatasok")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08) 0%, hsl(var(--background)) 60%)" }}
    >
      <div className="container mx-auto px-4 text-center z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-medium"
        >
          Budapest XI. kerület · Gellért-hegy
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight mb-6"
        >
          Gellérthegyi{" "}
          <br />
          <span className="font-semibold text-primary">Pszichológiai Rendelő</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Forduljon hozzánk bizalommal — egyéni- és párterápiák szakmai
          színvonalon, csendes, zöld környezetben.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="tel:+36304140029"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-medium hover:opacity-90 transition-opacity"
          >
            Bejelentkezés: +36 30 414 00 29
          </a>
          <button
            onClick={() => document.querySelector("#szakembereink")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 rounded-xl text-base font-medium text-foreground hover:bg-accent transition-colors"
          >
            Kollégáink
          </button>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollTo}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Görgetés le"
      >
        <ArrowDown className="w-6 h-6 animate-bounce" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
