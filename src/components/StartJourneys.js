import { motion } from "framer-motion";
import { ArrowRight, Clock, Mountain } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { destinations, IMAGES } from "@/data/destinations";
import { signatureJourneys, regionName } from "@/data/outdooroots";

export const StartJourneys = ({ builder: b }) => {
  const { t, language } = useLocale();
  const choose = (journey) => {
    b.loadSignature(journey);
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="signature-journeys" data-testid="signature-journeys" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-24 scroll-mt-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
        <div>
          <span className="eyebrow mb-3 block">{t("Starting Points", "Puntos de Partida")}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight uppercase text-white">
            {t("Signature Expeditions", "Expediciones de Autor")}
          </h2>
        </div>
        <p className="max-w-md text-sm text-[#9EA6B5] leading-relaxed">
          {t(
            "Editable journey concepts — not fixed departures. Every route, stay and price is reviewed before we confirm anything.",
            "Conceptos de viaje editables, no salidas fijas. Cada ruta, alojamiento y precio se revisa antes de confirmar."
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {signatureJourneys.map((s, i) => {
          const dest = destinations.find((d) => d.id === s.id);
          return (
            <motion.article
              key={s.id}
              data-testid={`signature-card-${s.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-[#181B22] border border-[#262B35] hover:border-[#FF3B30]/40 transition-colors cursor-pointer"
              onClick={() => choose(s)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  loading="lazy"
                  src={dest?.image}
                  alt={regionName(s.id, language)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C]/80 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono uppercase tracking-wider text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-[#9EA6B5] mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {s.days} {t("days", "dias")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5" />
                    {regionName(s.id, language)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  {s.title[language === "es" ? 1 : 0]}
                </h3>
                <p className="text-sm text-[#9EA6B5] mt-2 leading-relaxed line-clamp-2">
                  {s.copy[language === "es" ? 1 : 0]}
                </p>

                <div className="flex items-center gap-2 mt-5 text-[#FF3B30] text-sm font-semibold uppercase tracking-wider">
                  {t("Customize", "Personalizar")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export const Recommendations = ({ builder: b }) => {
  const { t, language } = useLocale();
  const { formatCurrency } = require("@/data/destinations");
  if (!b.brief.interests.length && !b.brief.desired_duration) return null;
  const sorted = [...signatureJourneys].sort((a, z) => {
    const score = (s) =>
      s.tags.filter((tag) => b.brief.interests.includes(tag)).length * 10 -
      (b.brief.desired_duration ? Math.abs(s.days - b.brief.desired_duration) : 0) +
      (b.brief.pace === "active" && s.id === "patagonia" ? 1 : 0);
    return score(z) - score(a);
  });
  const s = sorted[0];
  const matches = s.tags.filter((tag) => b.brief.interests.includes(tag));
  return (
    <div data-testid="recommendation" className="mt-5 p-6 bg-[#181B22] border border-[#262B35] rounded-xl">
      <p className="eyebrow mb-3">{t("Recommended for you", "Recomendado para ti")}</p>
      <h3 className="text-xl font-bold text-white uppercase">{s.title[language === "es" ? 1 : 0]}</h3>
      <p data-testid="recommendation-reason" className="text-xs leading-relaxed text-[#9EA6B5] mt-3">
        {matches.length
          ? t("Matches your interests in ", "Coincide con tus intereses en ") +
            matches.map((m) => ({ trekking: t("trekking", "senderismo"), nature: t("nature", "naturaleza"), culture: t("local culture", "cultura local"), astronomy: t("astronomy", "astronomia"), family: t("family time", "familia") }[m])).join(", ") + ". "
          : t("Closest duration match. ", "Duracion mas cercana. ")}
        {s.days} {t("suggested days", "dias sugeridos")}
        {b.brief.desired_duration ? ` / ${b.brief.desired_duration} ${t("requested", "solicitados")}` : ""}.{" "}
        {t("Pace reviewed by team.", "Ritmo revisado por el equipo.")}
        {b.brief.budget != null && ` ${t("Your", "Tu")} ${formatCurrency(b.brief.budget)} ${b.brief.budget_basis === "total" ? t("total budget", "presupuesto total") : t("per-person budget", "por persona")}: ${t("stays require pricing.", "alojamiento requiere cotizacion.")}`}
      </p>
      <button
        data-testid="apply-recommendation"
        onClick={() => b.loadSignature(s)}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#FF3B30] border border-[#FF3B30]/30 rounded-lg hover:bg-[#FF3B30]/10 transition-colors uppercase tracking-wider"
      >
        {t("Use this route", "Usar esta ruta")}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const RegionGallery = ({ onExplore }) => {
  const { t, language } = useLocale();
  return (
    <section data-testid="chapters-section" className="py-24 bg-[#121418]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <span className="eyebrow mb-3 block">{t("Destinations", "Destinos")}</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight uppercase text-white mb-12">
          {t("Five Chapters of Chile", "Cinco Capitulos de Chile")}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {destinations.map((d, i) => (
            <motion.button
              key={d.id}
              data-testid={`chapter-explore-${d.id}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onExplore(d.id)}
              className="group text-left relative rounded-xl overflow-hidden aspect-[3/4] border border-[#262B35] hover:border-[#FF3B30]/40 transition-colors"
            >
              <img
                loading="lazy"
                src={d.image}
                alt={regionName(d.id, language)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C]/90 via-[#090A0C]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="font-mono text-[10px] text-[#FF3B30] tracking-widest">{d.chapter}</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight mt-1">
                  {regionName(d.id, language)}
                </h3>
                <p className="text-[11px] text-white/50 mt-1 leading-snug">{d.tagline}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
