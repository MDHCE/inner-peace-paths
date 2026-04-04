import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactSection = () => (
  <section id="kapcsolat" className="py-24 lg:py-32" style={{ background: "var(--section-gradient)" }}>
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3 font-medium">Kapcsolat</p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
          Vegye fel velünk a kapcsolatot
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Forduljon hozzánk bizalommal. Előzetes bejelentkezés szükséges.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <ContactCard icon={Phone} title="Telefon" detail="+36 30 414 00 29" subtitle="H és Cs 9:00–15:00" href="tel:+36304140029" />
          <ContactCard icon={Mail} title="Email" detail="andrea@andreamartonicz.com" href="mailto:andrea@andreamartonicz.com" />
          <ContactCard icon={MapPin} title="Cím" detail="1118 Budapest, Ménesi út 10." subtitle="1. em., 2. kapucsengő (Martonicz)" />
          <ContactCard icon={Clock} title="Nyitvatartás" detail="H–Sz: 9:00–21:00" subtitle="Bejelentkezés: H és Cs 9:00–15:00" />
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl overflow-hidden"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <iframe
            title="Gellérthegyi Pszichológiai Rendelő helye"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2697.3!2d19.0457!3d47.4731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dce56d0d2b4b%3A0x0!2zTcOpbmVzaSB1dCAxMCwgQnVkYXBlc3QsIDExMTg!5e0!3m2!1shu!2shu!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 400 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>

      {/* Transport info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 max-w-4xl mx-auto bg-background rounded-xl p-8"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Megközelítés</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Tömegközlekedéssel</p>
            <p>61-es villamos (Budaörsi út), 27-es busz (Ménesi út megálló), 7-es és 107-es busz.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Autóval</p>
            <p>Korlátozott parkolási lehetőség az utcán. Ajánlott tömegközlekedéssel érkezni.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ContactCard = ({
  icon: Icon,
  title,
  detail,
  subtitle,
  href,
}: {
  icon: typeof Phone;
  title: string;
  detail: string;
  subtitle?: string;
  href?: string;
}) => {
  const Content = (
    <div
      className="flex items-start gap-4 bg-background rounded-xl p-5 transition-shadow duration-300"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-medium text-foreground">{detail}</p>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );

  return href ? <a href={href} className="block hover:opacity-90 transition-opacity">{Content}</a> : Content;
};

export default ContactSection;
