import { useEffect } from "react";
import Lenis from "lenis";
import { Link } from "react-router-dom";
import { OutdoorootsHero } from "@/components/OutdoorootsHero";
import { StartJourneys, RegionGallery } from "@/components/StartJourneys";
import { OutdoorootsBuilder } from "@/components/OutdoorootsBuilder";
import { useLocale } from "@/hooks/useLocale";
import { usePackageBuilder } from "@/hooks/usePackageBuilder";
import { formatCurrency } from "@/data/destinations";

export default function Home() {
  const builder = usePackageBuilder();
  const { t, language, setLanguage } = useLocale();
  const start = (type) => {
    if (type !== "signature") builder.setBrief((prev) => ({ ...prev, trip_type: type }));
    document.getElementById(type === "signature" ? "signature-journeys" : "builder")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleExplore = (destId) => {
    builder.setActiveTab(destId);
    const sel = builder.selectedDestinations.find((d) => d.id === destId);
    if (sel && sel.days === 0) builder.handleDaysChange(destId, 3);
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="top" data-testid="home-page" className="min-h-screen bg-[#FDFBF7]">
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#FDFBF7]/80 border-b border-[#E6DFD5]/70">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" data-testid="nav-logo" className="font-serif text-2xl tracking-tight text-[#0B192C]">Outdooroots</a>
          <nav className="flex items-center gap-3 sm:gap-6 text-xs text-[#5C656E]">
            <a href="#builder" data-testid="nav-builder-link" className="hidden sm:block hover:text-[#0B192C]">{t("Design a trip", "Diseña tu viaje")}</a>
            <span data-testid="nav-price-badge" className="hidden md:block">EUR · {builder.brief.trip_type === "group" || !builder.grandTotal ? t("Quote required", "Cotización requerida") : formatCurrency(builder.grandTotal)}</span>
            <div className="flex gap-1" aria-label="Language"><button data-testid="language-toggle-en" aria-pressed={language === "en"} onClick={() => setLanguage("en")} className={`px-2 py-2 rounded ${language === "en" ? "bg-[#0B192C] text-white" : "hover:bg-[#F6F2EB]"}`}>EN</button><button data-testid="language-toggle-es" aria-pressed={language === "es"} onClick={() => setLanguage("es")} className={`px-2 py-2 rounded ${language === "es" ? "bg-[#0B192C] text-white" : "hover:bg-[#F6F2EB]"}`}>ES</button></div>
            <Link to="/admin" data-testid="nav-admin-link" className="hover:underline">{t("Team", "Equipo")}</Link>
          </nav>
        </div>
      </header>

      <OutdoorootsHero onStart={start} />
      <StartJourneys builder={builder} />
      <RegionGallery onExplore={handleExplore} />
      <OutdoorootsBuilder builder={builder} />

      <footer data-testid="footer" className="bg-[#0B192C] text-[#FDFBF7] mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20"><p className="eyebrow text-[#D4A373] mb-6">Aventura · Vida · Naturaleza</p><div className="font-serif text-5xl sm:text-7xl">En un nuevo viaje.</div><div className="mt-12 border-t border-white/20 pt-7 flex flex-wrap gap-6 justify-between"><span className="font-serif text-2xl">Outdooroots</span><p className="text-sm text-white/65 max-w-lg">{t("Personalized adventures in Chile. Every route, supplier and price is reviewed before a reservation is agreed.", "Aventuras personalizadas en Chile. Cada ruta, proveedor y precio se revisa antes de acordar una reserva.")}</p><a href="#builder" data-testid="footer-contact" className="text-sm underline">{t("Tell us your idea", "Cuéntanos tu idea")}</a></div></div>
      </footer>
    </div>
  );
}
