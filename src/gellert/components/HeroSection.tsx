import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import logoImg from "@/assets/gellert-logo-white.png";

const heroVideo = `${import.meta.env.BASE_URL}hero-video-v4-loop.mp4?v=3`;

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = () => {
    document.querySelector("#szolgaltatasok")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background with parallax */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.35}px)` }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[120%] object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/55" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary-foreground/70 text-sm uppercase tracking-[0.25em] mb-6 font-medium"
        >
          Budapest XI. kerület · Gellért-hegy
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4 md:gap-6 mb-6"
        >
          <img
            src={logoImg}
            alt="Gellérthegyi Pszichológiai Rendelő"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
          />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-tight text-left">
            Gellérthegyi
            <br />
            <span className="font-semibold">Pszichológiai Rendelő</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-primary-foreground/80 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10"
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
            className="bg-primary-foreground text-foreground px-8 py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Bejelentkezés: +36 30 414 00 29
          </a>
          <button
            onClick={() => document.querySelector("#szakembereink")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
          >
            Szakembereink
          </button>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollTo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 animate-bounce"
        aria-label="Görgessen lejjebb"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
