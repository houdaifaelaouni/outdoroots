import { useLocale } from "@/hooks/useLocale";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { BedDouble, Compass } from "lucide-react";

export const JourneyTimeline = ({ builder: b }) => {
  const { t, language } = useLocale();
  const displayDate = (value) => format(parseISO(value), "d MMM yyyy", { locale: language === "es" ? es : undefined });
  return <section data-testid="itinerary-timeline-container" id="itinerary" className="mt-10 scroll-mt-24">
    <p className="eyebrow mb-2">03 / {t("Your journey, unfolding", "Tu viaje, día a día")}</p><h2 className="font-serif text-lg mb-3">{t("Leave a little room for wonder.", "Deja espacio para sorprenderte.")}</h2>
    <p data-testid="timeline-disclaimer" className="text-xs leading-relaxed text-[#5C656E] mb-6">{t("A suggested rhythm, not a confirmed schedule. Travel days may need to replace experiences. Your team will review onward transport, access, timing and availability.", "Un ritmo sugerido, no un programa confirmado. Los traslados pueden requerir reemplazar experiencias. El equipo revisará transporte, acceso, horarios y disponibilidad.")}</p>
    {b.dateMismatch && <p role="status" data-testid="timeline-date-warning" className="planning-note">{t("Preferred dates don't match this itinerary. Composed end:", "Las fechas preferidas no coinciden con el itinerario. Fin previsto:")} {displayDate(b.itinerary.days.at(-1).date)}. {t("Your dates have not been changed.", "Tus fechas no se han cambiado.")}</p>}
    {b.itinerary.unscheduled.length > 0 && <div role="status" data-testid="timeline-capacity-warning" className="planning-note"><strong>{t("More time needed", "Se necesita más tiempo")}</strong><p>{t("Included in the sample estimate but not scheduled. Add days, remove experiences, or send for review.", "Incluidas en la estimación, pero sin programar. Añade días, quita experiencias o solicita revisión.")}</p><ul>{b.itinerary.unscheduled.map((a, i) => <li data-testid={`timeline-unscheduled-${i}`} key={`${a.destination_id}-${a.name}`}>{a.destination}: {a.name}</li>)}</ul></div>}
    {!b.totalDays && <div data-testid="timeline-empty" className="p-8 border border-dashed border-[#E6DFD5] rounded-xl text-center text-sm text-[#5C656E]"><Compass className="w-6 h-6 mx-auto mb-3" />{t("Add a region to see your daily rhythm, or send your brief for us to design.", "Añade una región para ver el plan diario o envíanos tus ideas para diseñarlo.")}</div>}
    <div className="space-y-7">{b.breakdown.map((chapter, index) => {
      const days = b.itinerary.days.filter((d) => d.destination_id === chapter.id);
      return <article key={chapter.id} data-testid={`timeline-chapter-${chapter.id}`} className="border border-[#E6DFD5] rounded-xl p-6 bg-white">
        {index > 0 && <p data-testid={`transfer-review-${chapter.id}`} className="planning-note">{t("Onward travel from", "Traslado desde")} {b.breakdown[index - 1].name} → {chapter.name}: {t("transport, time and overnight location need review; no flight or transfer included.", "transporte, tiempo y lugar de pernocta por revisar; no incluye vuelos ni traslados.")}</p>}
        {chapter.id === "easter-island" && <p data-testid="easter-island-review" className="planning-note">{t("Rapa Nui requires flight and access review. No same-day connection is assumed.", "Rapa Nui requiere revisar vuelos y acceso. No se asumen conexiones el mismo día.")}</p>}
        <p className="eyebrow">{t("Days", "Días")} {days[0].day}–{days.at(-1).day}</p><h3 className="font-serif text-3xl mt-2">{chapter.name}</h3><p data-testid={`timeline-lodge-${chapter.id}`} className="text-xs text-[#5C656E] mt-2 mb-6">{chapter.accommodation?.name || chapter.customAccommodation || t("Stay to be arranged · quote required", "Alojamiento por definir · cotización requerida")} · {chapter.nights} {t("proposed nights", "noches propuestas")}</p>
        <ol className="border-l border-[#E6DFD5] ml-1">{days.map((day) => {
          const used = day.activities.reduce((sum, a) => sum + a.duration, 0);
          return <li key={day.day} data-testid={`timeline-day-card-${day.day}`} className="relative pl-5 pb-6 last:pb-0"><span className="absolute top-2 -left-1 w-2 h-2 rounded-full bg-[#C87D55]" /><p className="font-mono text-[10px] uppercase text-[#5C656E]">{t("Day", "Día")} {day.day}{day.date && ` · ${displayDate(day.date)}`}</p><div className="mt-2 text-sm space-y-2">{day.activities.map((a, i) => <p data-testid={`timeline-activity-${day.day}-${i}`} key={a.name}>{a.name} <span className="text-xs text-[#5C656E]">/ {a.duration === 1 ? t("full day", "día completo") : t("half day", "medio día")}</span></p>)}{used < 1 && <p className="text-[#5C656E] italic">{used ? t("Half a day to wander or plan your onward travel.", "Medio día para explorar o planificar el traslado.") : t("A day at your own pace — open for rest or travel planning.", "Un día a tu ritmo: descanso o planificación de traslados.")}</p>}</div>{day.overnight && <p className="text-xs text-[#5C656E] mt-3 flex gap-2"><BedDouble className="w-3.5 h-3.5 shrink-0" />{day.accommodation === "Stay to be arranged" ? t("Stay to be arranged", "Estadía por definir") : day.accommodation}{day.day === days.at(-1).day && index < b.breakdown.length - 1 ? t(" · provisional; transit night review", " · provisional; revisar noche de tránsito") : ""}</p>}</li>;
        })}</ol>
      </article>;
    })}</div>
  </section>;
};
