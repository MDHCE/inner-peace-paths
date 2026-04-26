import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
        style={{ background: "var(--subpage-gradient)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(168 35% 55%) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-32 w-[26rem] h-[26rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(40 50% 75%) 0%, transparent 70%)" }}
        />

        <div
          className="relative max-w-lg mx-4 rounded-2xl p-10 md:p-14 text-center"
          style={{
            background: "var(--soft-card-gradient)",
            boxShadow: "var(--card-shadow-deep)",
          }}
        >
          <p
            className="font-display text-7xl md:text-8xl font-semibold mb-4 bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--subpage-band-gradient)" }}
          >
            404
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Az oldal nem található
          </h1>
          <p className="text-muted-foreground mb-8">
            Az oldal, amit keres, eltűnhetett, megváltozhatott a címe, vagy soha nem is létezett.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={16} />
            Vissza a főoldalra
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
