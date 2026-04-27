import { useSiteContent } from "@/context/SiteContent";

const Footer = () => {
  const { footer } = useSiteContent();
  const intro = footer?.intro ?? "Komplex pszichológiai és pszichiáter szakorvosi járóbeteg ellátás Budapest XIV. kerületében.";
  const operatorHeading = footer?.operator_heading ?? "Üzemeltető";
  const operatorLines = footer?.operator_lines?.length ? footer.operator_lines : [
    "M10 Kft.",
    "1118 Budapest, Ménesi út 10. 1. em. 2.",
    "Adószám: 26511995-2-43",
    "Cégjegyzékszám: 01-09-329532",
  ];
  const followHeading = footer?.follow_heading ?? "Követés";
  const facebookUrl = footer?.facebook_url ?? "https://www.facebook.com/gellerthegyirendelo/";
  const instagramUrl = footer?.instagram_url ?? "https://www.instagram.com/zugloirendelo/";
  const neakNumber = footer?.neak_number ?? "NEAK szám: 513289";

  return (
    <footer className="bg-foreground text-primary-foreground/70 py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
              Zuglói Pszichológiai Központ
            </h3>
            <p className="text-sm leading-relaxed">{intro}</p>
          </div>
          <div>
            <h4 className="font-medium text-primary-foreground mb-3">{operatorHeading}</h4>
            <div className="text-sm space-y-1">
              {operatorLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-primary-foreground mb-3">{followHeading}</h4>
            <div className="flex gap-4 text-sm">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                  Facebook
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Zuglói Pszichológiai Központ. Minden jog fenntartva.</p>
          {neakNumber && <p className="mt-1">{neakNumber}</p>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
