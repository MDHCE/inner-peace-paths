import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import TherapistsSection from "@/components/TherapistsSection";
import PricingSection from "../components/PricingSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const SITE_URL = "https://www.gellerthegyirendelo.hu";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  name: "Gellérthegyi Pszichológiai Rendelő",
  description: "Egyéni- és párterápia, pszichológiai konzultáció szakmai színvonalon. Csendes, zöld környezet a Gellért-hegy lábánál.",
  url: SITE_URL,
  telephone: "+36-30-414-0029",
  email: "andrea@andreamartonicz.com",
  foundingDate: "2018",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ménesi út 10. 1. em. 2.",
    addressLocality: "Budapest",
    postalCode: "1118",
    addressCountry: "HU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.4731,
    longitude: 19.0457,
  },
  areaServed: { "@type": "City", name: "Budapest" },
  medicalSpecialty: "Psychiatry",
  availableService: [
    { "@type": "MedicalTherapy", name: "Egyéni pszichoterápia" },
    { "@type": "MedicalTherapy", name: "Párterápia" },
    { "@type": "MedicalTherapy", name: "Katatím imaginatív terápia" },
    { "@type": "MedicalTherapy", name: "Autogén tréning" },
    { "@type": "MedicalTherapy", name: "Pszichodiagnosztika" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "21:00",
  },
  sameAs: [
    "https://www.facebook.com/gellerthegyirendelo/",
    "https://www.instagram.com/gellerthegyirendelo/",
  ],
};

const Index = () => (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <TherapistsSection />
    <PricingSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;
