import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TherapistsSection from "@/components/TherapistsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SITE_URL = "https://zugloipszichologiaikozpont.hu";
const OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fc40060c-0301-4391-9c06-da5008f0d815/id-preview-9a801c4b--498bb07e-0335-4a27-9ded-e80b46b6c738.lovable.app-1775252443182.png";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  name: "Zuglói Pszichológiai Központ",
  description: "Komplex pszichológiai ellátás Budapesten: felnőtt terápia, gyermekterápia, párterápia, családterápia.",
  url: SITE_URL,
  image: OG_IMAGE,
  telephone: "+36-1-000-0000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Budapest XIV. kerület",
    addressLocality: "Budapest",
    postalCode: "1142",
    addressCountry: "HU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.5142,
    longitude: 19.0954,
  },
  areaServed: {
    "@type": "City",
    name: "Budapest",
  },
  medicalSpecialty: "Psychiatry",
  availableService: [
    { "@type": "MedicalTherapy", name: "Egyéni pszichoterápia" },
    { "@type": "MedicalTherapy", name: "Párterápia" },
    { "@type": "MedicalTherapy", name: "Családterápia" },
    { "@type": "MedicalTherapy", name: "Gyermekterápia" },
  ],
  sameAs: [
    "https://www.facebook.com/zugloipszichologiaikozpont",
    "https://www.instagram.com/zugloipszichologiaikozpont",
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
    <AboutSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;
