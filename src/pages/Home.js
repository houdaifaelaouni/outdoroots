import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { OutdoorootsHero } from "@/components/OutdoorootsHero";
import { StartJourneys, RegionGallery } from "@/components/StartJourneys";
import { OutdoorootsBuilder } from "@/components/OutdoorootsBuilder";
import { usePackageBuilder as useBuilder } from "@/hooks/usePackageBuilder";
import { IMAGES } from "@/data/destinations";

export default function Home() {
  const { t, language, setLanguage } = useLocale();
  const builder = useBuilder();
  const [mobileMenu, setMobileMenu] = useState(false);
  const builderRef = useRef(null);

  const scrollToBuilder = (mode) => {
    if (mode === "signature") {
      document.getElementById("signature-journeys")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setTimeout(() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div data-testid="home-page" className="min-h-screen bg-[#090A0C] text-white">
      {/* Header */}
      <header data-testid="main-header" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#090A0C]/85 border-b border-[#262B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold tracking-tight uppercase text-white" data-testid="brand-name">
              Outdooroots
            </span>
            <span className="hidden sm:block font-mono text-[9px] tracking-[.14em] uppercase text-[#9EA6B5]">
              Aventura · Vida · Naturaleza
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#signature-journeys" data-testid="nav-journeys-link" className="text-sm text-[#9EA6B5] hover:text-white transition-colors">
              {t("Journeys", "Viajes")}
            </a>
            <a href="#builder" data-testid="nav-builder-link" className="text-sm text-[#9EA6B5] hover:text-white transition-colors">
              {t("Trip Builder", "Creador de Viaje")}
            </a>
            <Link to="/chat" data-testid="nav-chat-link" className="text-sm text-[#9EA6B5] hover:text-white transition-colors">
              {t("AI Assistant", "Asistente IA")}
            </Link>
            <button
              data-testid="lang-toggle"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="inline-flex items-center gap-1.5 text-sm text-[#9EA6B5] hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === "en" ? "ES" : "EN"}
            </button>
            <button
              data-testid="nav-cta"
              onClick={() => scrollToBuilder("personal")}
              className="px-5 py-2 bg-[#FF3B30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#E02E24] transition-colors"
            >
              {t("Plan Trip", "Planear Viaje")}
            </button>
          </nav>

          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden text-white"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#262B35] bg-[#090A0C]/95 backdrop-blur-md overflow-hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-4">
                <a href="#signature-journeys" onClick={() => setMobileMenu(false)} className="py-3 text-sm text-[#9EA6B5] hover:text-white">
                  {t("Journeys", "Viajes")}
                </a>
                <a href="#builder" onClick={() => setMobileMenu(false)} className="py-3 text-sm text-[#9EA6B5] hover:text-white">
                  {t("Trip Builder", "Creador de Viaje")}
                </a>
                <Link to="/chat" className="py-3 text-sm text-[#9EA6B5] hover:text-white">
                  {t("AI Assistant", "Asistente IA")}
                </Link>
                <button onClick={() => setLanguage(language === "en" ? "es" : "en")} className="py-3 text-sm text-left text-[#9EA6B5] hover:text-white">
                  {language === "en" ? "Cambiar a Espanol" : "Switch to English"}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <OutdoorootsHero onStart={scrollToBuilder} />

      {/* Destinations */}
      <RegionGallery onExplore={(id) => { builder.setActiveTab(id); scrollToBuilder("personal"); }} />

      {/* Signature Journeys */}
      <StartJourneys builder={builder} />

      {/* CTA Section */}
      <section className="py-24 bg-[#090A0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={IMAGES.atacama} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#090A0C]/75" />
            <div className="relative px-8 sm:px-16 py-16 sm:py-24 text-center">
              <span className="eyebrow mb-4 block">{t("Ready to go?", "Listo para partir?")}</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white max-w-2xl mx-auto">
                {t("Talk to our AI travel assistant", "Habla con nuestro asistente de viaje IA")}
              </h2>
              <p className="mt-4 text-sm text-white/60 max-w-lg mx-auto">
                {t(
                  "Get instant advice on destinations, seasons, routes and what to expect. No commitment — just good answers.",
                  "Obtene consejos sobre destinos, temporadas, rutas y que esperar. Sin compromiso, solo buenas respuestas."
                )}
              </p>
              <Link
                to="/chat"
                data-testid="cta-chat-link"
                className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#FF3B30] text-white text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-[#E02E24] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t("Start Chatting", "Empezar a Chatear")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Builder */}
      <div ref={builderRef}>
        <OutdoorootsBuilder builder={builder} />
      </div>

      {/* Footer */}
      <footer data-testid="main-footer" className="border-t border-[#262B35] bg-[#090A0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
            <div>
              <span className="text-lg font-extrabold tracking-tight uppercase text-white">Outdooroots</span>
              <p className="font-mono text-[10px] tracking-[.14em] uppercase text-[#9EA6B5] mt-1">
                Aventura · Vida · Naturaleza
              </p>
              <p className="text-xs text-[#9EA6B5]/60 mt-4 max-w-xs leading-relaxed">
                {t(
                  "Inquiry-based adventure travel in Chile. Proposals reviewed by our team — nothing is confirmed until we talk.",
                  "Viajes de aventura basados en consultas en Chile. Propuestas revisadas por nuestro equipo — nada se confirma hasta conversar."
                )}
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="space-y-3">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#FF3B30]">{t("Explore", "Explorar")}</p>
                <a href="#signature-journeys" className="block text-[#9EA6B5] hover:text-white transition-colors">{t("Journeys", "Viajes")}</a>
                <a href="#builder" className="block text-[#9EA6B5] hover:text-white transition-colors">{t("Trip Builder", "Creador de Viaje")}</a>
                <Link to="/chat" className="block text-[#9EA6B5] hover:text-white transition-colors">{t("AI Assistant", "Asistente IA")}</Link>
              </div>
              <div className="space-y-3">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#FF3B30]">{t("Regions", "Regiones")}</p>
                <span className="block text-[#9EA6B5]">Patagonia</span>
                <span className="block text-[#9EA6B5]">Atacama</span>
                <span className="block text-[#9EA6B5]">Santiago</span>
                <span className="block text-[#9EA6B5]">Easter Island</span>
                <span className="block text-[#9EA6B5]">Lake District</span>
              </div>
            </div>
          </div>
          <div className="border-t border-[#262B35] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#9EA6B5]/50">
              {t(
                "Prices are illustrative estimates in EUR. Not a reservation system.",
                "Precios son estimaciones ilustrativas en EUR. No es un sistema de reservas."
              )}
            </p>
            <p className="text-xs text-[#9EA6B5]/50">Outdooroots {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
