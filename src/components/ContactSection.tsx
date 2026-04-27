import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSiteContent } from "@/context/SiteContent";

const ContactSection = () => {
  const { contact } = useSiteContent();
  const kicker = contact?.kicker ?? "Kapcsolat";
  const heading = contact?.heading ?? "Vegye fel velünk a kapcsolatot";
  const subtitle = contact?.subtitle ?? "Forduljon hozzánk bizalommal. Előzetes bejelentkezés szükséges.";
  const phone = contact?.phone ?? "06 30 414 0029";
  const phoneSub = contact?.phone_subtitle ?? "H és Cs 9:00–15:00";
  const email = contact?.email ?? "info@zugloipszichologiaikozpont.hu";
  const address = contact?.address ?? "1142 Budapest, Kassai utca 76/2.";
  const addressSub = contact?.address_subtitle ?? "Bejárat a Kassai utca felől";
  const hours = contact?.hours ?? "H–P: 8:00–20:00";
  const hoursSub = contact?.hours_subtitle ?? "Szombat: 8:00–15:00";
  const transportPublicLabel = contact?.transport_public_label ?? "Tömegközlekedéssel";
  const transportPublic = contact?.transport_public ?? "62, 62A, 69-es villamosok, 5-ös busz (Fűrész utca megálló), 74, 74A troli (Nezsider park).";
  const transportCarLabel = contact?.transport_car_label ?? "Autóval";
  const transportCar = contact?.transport_car ?? "A rendelő előtt ingyenesen parkolhat.";

  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : undefined;

  return (
    <section id="kapcsolat" className="py-24 lg:py-32" style={{ background: "var(--section-gradient)" }}>
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
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {phone && <ContactCard icon={Phone} title="Telefon" detail={phone} subtitle={phoneSub} href={telHref} />}
            {email && <ContactCard icon={Mail} title="Email" detail={email} href={`mailto:${email}`} />}
            {address && <ContactCard icon={MapPin} title="Cím" detail={address} subtitle={addressSub} />}
            {hours && <ContactCard icon={Clock} title="Nyitvatartás" detail={hours} subtitle={hoursSub} />}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl overflow-hidden"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <iframe
              title="Zuglói Pszichológiai Központ helye"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.0!2d19.1143!3d47.5218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMxJzE4LjUiTiAxOcKwMDYnNTEuNSJF!5e0!3m2!1shu!2shu!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>

        {(transportPublic || transportCar) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-4xl mx-auto bg-background rounded-xl p-8"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Megközelítés</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
              {transportPublic && (
                <div>
                  <p className="font-medium text-foreground mb-1">{transportPublicLabel}</p>
                  <p>{transportPublic}</p>
                </div>
              )}
              {transportCar && (
                <div>
                  <p className="font-medium text-foreground mb-1">{transportCarLabel}</p>
                  <p>{transportCar}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

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
