const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/70 py-12">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <div>
          <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
            Zuglói Pszichológiai Központ
          </h3>
          <p className="text-sm leading-relaxed">
            Komplex pszichológiai és pszichiáter szakorvosi járóbeteg ellátás Budapest XIV. kerületében.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-primary-foreground mb-3">Üzemeltető</h4>
          <div className="text-sm space-y-1">
            <p>M10 Kft.</p>
            <p>1118 Budapest, Ménesi út 10. 1. em. 2.</p>
            <p>Adószám: 26511995-2-43</p>
            <p>Cégjegyzékszám: 01-09-329532</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-primary-foreground mb-3">Követés</h4>
          <div className="flex gap-4 text-sm">
            <a href="https://www.facebook.com/gellerthegyirendelo/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
              Facebook
            </a>
            <a href="https://www.instagram.com/zugloirendelo/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Zuglói Pszichológiai Központ. Minden jog fenntartva.</p>
        <p className="mt-1">NEAK szám: 513289</p>
      </div>
    </div>
  </footer>
);

export default Footer;
