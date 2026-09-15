import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { destinations, formatCurrency } from "@/data/destinations";
import { signatureJourneys, regionName } from "@/data/outdooroots";
import { Button } from "@/components/ui/button";

export const StartJourneys = ({ builder: b }) => {
  const { t, language } = useLocale();
  const choose = (journey) => { b.loadSignature(journey); document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" }); };
  return <section id="signature-journeys" data-testid="signature-journeys" className="max-w-7xl mx-auto px-5 sm:px-8 py-24 scroll-mt-20"><p className="eyebrow mb-4">{t("A place to begin", "Un punto de partida")}</p><div className="sm:flex items-end justify-between gap-12 mb-12"><h2 className="font-serif text-lg">{t("Three starting points. None set in stone.", "Tres puntos de partida. Nada escrito en piedra.")}</h2><p className="max-w-lg text-sm text-[#5C656E] mt-4">{t("Editable journey concepts, not scheduled departures or guaranteed prices. Local stays, day adventures and custom routes are always open for discussion.", "Conceptos editables, no salidas programadas ni precios garantizados. Alojamientos locales, excursiones de un día y rutas a medida están abiertos a conversación.")}</p></div><div className="grid md:grid-cols-3 gap-8">{signatureJourneys.map((s, i) => <motion.article key={s.id} data-testid={`signature-card-${s.id}`} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={i === 1 ? "md:pt-12" : ""}><img loading="lazy" src={destinations.find((d) => d.id === s.id).image} alt={regionName(s.id, language)} className="aspect-[4/5] w-full object-cover rounded-t-[8rem] rounded-b-lg" /><p className="eyebrow mt-6">0{i + 1} / {s.days} {t("days to personalize", "días para personalizar")}</p><h3 className="font-serif text-3xl mt-3">{s.title[language === "es" ? 1 : 0]}</h3><p className="text-sm text-[#5C656E] mt-3 leading-relaxed">{s.copy[language === "es" ? 1 : 0]}</p><Button variant="link" data-testid={`choose-signature-${s.id}`} onClick={() => choose(s)} className="px-0 mt-3">{t("Make it your own", "Hazlo tuyo")}<ArrowUpRight className="w-4 h-4 ml-2" /></Button></motion.article>)}</div></section>;
};

export const Recommendations = ({ builder: b }) => {
  const { t, language } = useLocale();
  if (!b.brief.interests.length && !b.brief.desired_duration) return null;
  const sorted = [...signatureJourneys].sort((a, z) => {
    const score = (s) => s.tags.filter((tag) => b.brief.interests.includes(tag)).length * 10 - (b.brief.desired_duration ? Math.abs(s.days - b.brief.desired_duration) : 0) + (b.brief.pace === "active" && s.id === "patagonia" ? 1 : 0);
    return score(z) - score(a);
  });
  const s = sorted[0];
  const matches = s.tags.filter((tag) => b.brief.interests.includes(tag));
  return <div data-testid="recommendation" className="mt-5 p-6 bg-[#F6F2EB] border border-[#E6DFD5] rounded-xl"><p className="eyebrow mb-3">{t("A considered starting point", "Un punto de partida para ti")}</p><h3 className="font-serif text-2xl">{s.title[language === "es" ? 1 : 0]}</h3><p data-testid="recommendation-reason" className="text-xs leading-relaxed text-[#5C656E] mt-3">{matches.length ? t("Shares your selected interests in ", "Coincide con tus intereses en ") + matches.map((m) => ({ trekking: t("trekking", "senderismo"), nature: t("nature", "naturaleza"), culture: t("local culture", "cultura local"), astronomy: t("astronomy", "astronomía"), family: t("family time", "viajar en familia") }[m])).join(", ") + ". " : t("The closest starting duration among our three concepts. ", "La duración inicial más cercana entre nuestros tres conceptos. ")}{s.days} {t("suggested days", "días sugeridos")}{b.brief.desired_duration ? ` / ${b.brief.desired_duration} ${t("requested", "solicitados")}` : ""}. {t("Pace and outdoor suitability will be tailored after team review.", "El ritmo y la idoneidad se ajustarán con el equipo.")}{b.brief.budget != null && ` ${t("Your", "Tu")} ${formatCurrency(b.brief.budget)} ${b.brief.budget_basis === "total" ? t("total budget", "presupuesto total") : t("per-person budget", "presupuesto por persona")}: ${t("stays and transport still require pricing.", "alojamiento y transporte aún requieren cotización.")}`}</p><Button data-testid="apply-recommendation" size="sm" variant="outline" className="mt-4" onClick={() => b.loadSignature(s)}>{t("Use this starting point", "Usar este punto de partida")}</Button></div>;
};

export const RegionGallery = ({ onExplore }) => {
  const { t, language } = useLocale();
  return <section data-testid="chapters-section" className="bg-[#F6F2EB] py-14"><div className="max-w-7xl mx-auto px-5 sm:px-8"><p className="eyebrow mb-6">{t("Five landscapes. Countless ways to belong.", "Cinco paisajes. Infinitas formas de conectar.")}</p><div className="grid grid-cols-2 md:grid-cols-5 gap-4">{destinations.map((d) => <button key={d.id} data-testid={`chapter-explore-${d.id}`} onClick={() => onExplore(d.id)} className="group text-left"><img loading="lazy" src={d.image} alt={regionName(d.id, language)} className="w-full aspect-[4/3] object-cover rounded-lg transition-transform duration-300 group-hover:-translate-y-1" /><span className="block text-sm mt-3">{regionName(d.id, language)}</span><span className="text-xs text-[#5C656E]">{t("Explore this chapter", "Explorar este capítulo")} →</span></button>)}</div></div></section>;
};
