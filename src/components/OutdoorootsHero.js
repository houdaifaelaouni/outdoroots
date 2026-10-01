import { motion } from "framer-motion";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import { IMAGES } from "@/data/destinations";
import { useLocale } from "@/hooks/useLocale";

export const OutdoorootsHero = ({ onStart }) => {
  const { t } = useLocale();
  return (
    <section data-testid="hero-section" className="relative min-h-screen flex items-end overflow-hidden">
      <img
        src={IMAGES.hero}
        alt={t("Torres del Paine expedition", "Expedicion Torres del Paine")}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/50 to-[#090A0C]/20" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF3B30]/30 bg-[#FF3B30]/10 backdrop-blur-sm mb-8"
        >
          <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#FF3B30]">
            {t("Chile Expedition Designers", "Disenadores de Expediciones en Chile")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[0.95] text-white max-w-4xl"
        >
          {t("Explore Chile's", "Descubre la")}
          <br />
          <span className="text-[#FF3B30]">{t("Wild Nature", "Naturaleza Salvaje")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
        >
          {t(
            "Custom expedition itineraries through Patagonia, Atacama, Easter Island & beyond. Designed by locals, built for adventurers.",
            "Itinerarios de expedicion a medida por Patagonia, Atacama, Isla de Pascua y mas. Disenados por locales, creados para aventureros."
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 mt-10"
        >
          <button
            data-testid="hero-cta-primary"
            onClick={() => onStart("personal")}
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF3B30] text-white text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-[#E02E24] transition-colors"
          >
            {t("Design My Trip", "Disenar Mi Viaje")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            data-testid="hero-cta-secondary"
            onClick={() => onStart("signature")}
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-white/10 backdrop-blur-sm transition-colors"
          >
            <Compass className="w-4 h-4" />
            {t("Explore Journeys", "Explorar Viajes")}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/15 max-w-lg"
        >
          {[
            [t("5 Regions", "5 Regiones"), t("Coast to peaks", "Costa a cumbres")],
            [t("Custom Routes", "Rutas a Medida"), t("Your pace, your way", "Tu ritmo, tu estilo")],
            [t("Local Experts", "Expertos Locales"), t("On-ground knowledge", "Conocimiento real")],
          ].map(([title, sub]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-white/50 mt-1">{sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
