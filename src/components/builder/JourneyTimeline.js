import { useLocale } from "@/hooks/useLocale";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { BedDouble, Compass } from "lucide-react";

export const JourneyTimeline = ({ builder: b }) => {
  const { t, language } = useLocale();
  const displayDate = (value) => format(parseISO(value), "d MMM yyyy", { locale: language === "es" ? es : undefined });

  return (
    <section data-testid="itinerary-timeline-container" id="itinerary" className="mt-10 scroll-mt-24">
      <p className="eyebrow mb-2">03 / {t("Your Journey Unfolding", "Tu Viaje Dia a Dia")}</p>
      <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-3">
        {t("Leave Room for Wonder", "Deja Espacio para Sorprenderte")}
      </h2>
      <p data-testid="timeline-disclaimer" className="text-xs leading-relaxed text-[#9EA6B5] mb-6">
        {t(
          "A suggested rhythm, not a confirmed schedule. Team will review transport, access and availability.",
          "Un ritmo sugerido, no un programa confirmado. El equipo revisara transporte, acceso y disponibilidad."
        )}
      </p>

      {b.dateMismatch && (
        <p role="status" data-testid="timeline-date-warning" className="planning-note">
          {t("Dates don't match. Composed end:", "Las fechas no coinciden. Fin previsto:")}{" "}
          {displayDate(b.itinerary.days.at(-1).date)}.
        </p>
      )}

      {b.itinerary.unscheduled.length > 0 && (
        <div role="status" data-testid="timeline-capacity-warning" className="planning-note">
          <strong className="text-white">{t("More time needed", "Se necesita mas tiempo")}</strong>
          <p>{t("Included in estimate but not scheduled.", "Incluidas en la estimacion, pero sin programar.")}</p>
          <ul className="mt-1">
            {b.itinerary.unscheduled.map((a, i) => (
              <li data-testid={`timeline-unscheduled-${i}`} key={`${a.destination_id}-${a.name}`}>
                {a.destination}: {a.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!b.totalDays && (
        <div data-testid="timeline-empty" className="p-8 border border-dashed border-[#262B35] rounded-xl text-center text-sm text-[#9EA6B5]">
          <Compass className="w-6 h-6 mx-auto mb-3 text-[#FF3B30]" />
          {t("Add a region to see your daily rhythm.", "Anade una region para ver el plan diario.")}
        </div>
      )}

      <div className="space-y-7">
        {b.breakdown.map((chapter, index) => {
          const days = b.itinerary.days.filter((d) => d.destination_id === chapter.id);
          return (
            <article key={chapter.id} data-testid={`timeline-chapter-${chapter.id}`} className="border border-[#262B35] rounded-xl p-6 bg-[#181B22]">
              {index > 0 && (
                <p data-testid={`transfer-review-${chapter.id}`} className="planning-note">
                  {t("Transfer from", "Traslado desde")} {b.breakdown[index - 1].name} → {chapter.name}:{" "}
                  {t("transport review needed.", "transporte por revisar.")}
                </p>
              )}
              {chapter.id === "easter-island" && (
                <p data-testid="easter-island-review" className="planning-note">
                  {t("Rapa Nui requires flight and access review.", "Rapa Nui requiere revisar vuelos y acceso.")}
                </p>
              )}

              <p className="eyebrow">
                {t("Days", "Dias")} {days[0].day}–{days.at(-1).day}
              </p>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white mt-2">{chapter.name}</h3>
              <p data-testid={`timeline-lodge-${chapter.id}`} className="text-xs text-[#9EA6B5] mt-2 mb-6">
                {chapter.accommodation?.name || chapter.customAccommodation || t("Stay to be arranged", "Alojamiento por definir")} ·{" "}
                {chapter.nights} {t("proposed nights", "noches propuestas")}
              </p>

              <ol className="border-l border-[#262B35] ml-1">
                {days.map((day) => {
                  const used = day.activities.reduce((sum, a) => sum + a.duration, 0);
                  return (
                    <li key={day.day} data-testid={`timeline-day-card-${day.day}`} className="relative pl-5 pb-6 last:pb-0">
                      <span className="absolute top-2 -left-1 w-2 h-2 rounded-full bg-[#FF3B30]" />
                      <p className="font-mono text-[10px] uppercase text-[#9EA6B5]">
                        {t("Day", "Dia")} {day.day}
                        {day.date && ` · ${displayDate(day.date)}`}
                      </p>
                      <div className="mt-2 text-sm space-y-2 text-white">
                        {day.activities.map((a, i) => (
                          <p data-testid={`timeline-activity-${day.day}-${i}`} key={a.name}>
                            {a.name}{" "}
                            <span className="text-xs text-[#9EA6B5]">
                              / {a.duration === 1 ? t("full day", "dia completo") : t("half day", "medio dia")}
                            </span>
                          </p>
                        ))}
                        {used < 1 && (
                          <p className="text-[#9EA6B5] italic text-xs">
                            {used
                              ? t("Half day free to explore.", "Medio dia libre para explorar.")
                              : t("Open day — rest or travel planning.", "Dia abierto: descanso o planificacion.")}
                          </p>
                        )}
                      </div>
                      {day.overnight && (
                        <p className="text-xs text-[#9EA6B5]/60 mt-3 flex gap-2 items-center">
                          <BedDouble className="w-3.5 h-3.5 shrink-0" />
                          {day.accommodation === "Stay to be arranged" ? t("Stay to be arranged", "Estadia por definir") : day.accommodation}
                          {day.day === days.at(-1).day && index < b.breakdown.length - 1
                            ? t(" · transit night review", " · revisar noche de transito")
                            : ""}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
      </div>
    </section>
  );
};
