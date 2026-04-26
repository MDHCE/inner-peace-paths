import { useState } from "react";
import { Menu, X, Mail, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/zugloi-logo.png";

const CONTACT_EMAIL = "info@zugloipszichologiaikozpont.hu";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "Főoldal", href: "#hero" },
  { label: "Szolgáltatások", href: "#szolgaltatasok" },
  {
    label: "Szakembereink",
    href: "#szakembereink",
    children: [
      { label: "Felnőttekkel foglalkozó szakembereink", href: "#felnottek" },
      { label: "Gyermekekkel és serdülőkkel foglalkozó szakembereink", href: "#gyermekek-serdulok" },
    ],
  },
  { label: "Rólunk", href: "#rolunk" },
  { label: "Kapcsolat", href: "#kapcsolat" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState<string | null>(null);

  const scrollTo = (href: string) => {
    setOpen(false);
    setMobileSubmenuOpen(null);
    setDesktopDropdownOpen(null);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-wide text-foreground">
          <img src={logoImg} alt="Logo" width={36} height={36} className="w-9 h-9" />
          Zuglói Pszichológiai Központ
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) =>
            l.children ? (
              <div
                key={l.href}
                className="relative"
                onMouseEnter={() => setDesktopDropdownOpen(l.href)}
                onMouseLeave={() => setDesktopDropdownOpen(null)}
              >
                <button
                  onClick={() => scrollTo(l.href)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {desktopDropdownOpen === l.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80"
                    >
                      <div
                        className="bg-background rounded-xl border border-border/60 overflow-hidden"
                        style={{ boxShadow: "var(--card-shadow)" }}
                      >
                        {l.children.map((c) => (
                          <button
                            key={c.href}
                            onClick={() => scrollTo(c.href)}
                            className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent/50 hover:text-primary transition-colors border-b border-border/40 last:border-b-0"
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {l.label}
              </button>
            ),
          )}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            Írjon nekünk
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Menü">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((l) =>
                l.children ? (
                  <div key={l.href} className="flex flex-col">
                    <button
                      onClick={() =>
                        setMobileSubmenuOpen(mobileSubmenuOpen === l.href ? null : l.href)
                      }
                      className="flex items-center justify-between text-left py-2 text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {l.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileSubmenuOpen === l.href ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileSubmenuOpen === l.href && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pl-3 border-l-2 border-primary/30 ml-1"
                        >
                          {l.children.map((c) => (
                            <button
                              key={c.href}
                              onClick={() => scrollTo(c.href)}
                              className="w-full text-left py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {c.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="text-left py-2 text-foreground font-medium hover:text-primary transition-colors"
                  >
                    {l.label}
                  </button>
                ),
              )}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-medium mt-3"
              >
                <Mail className="w-4 h-4" />
                Írjon nekünk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
