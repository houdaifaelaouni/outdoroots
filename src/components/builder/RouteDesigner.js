import { useLocale } from "@/hooks/useLocale";
import { destinations, formatCurrency } from "@/data/destinations";
import { activityName, regionName } from "@/data/outdooroots";
import { ArrowUp, ArrowDown, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefSelect } from "@/components/builder/AdventureBrief";

export const RouteDesigner = ({ builder: b }) => {
  const { t, language } = useLocale();
  const dest = destinations.find((d) => d.id === b.activeTab);
  const selected = b.selectedDestinations.find((d) => d.id === b.activeTab);
  const group = b.brief.trip_type === "group";

  return (
    <section id="route-designer" data-testid="route-designer" className="scroll-mt-24 mt-10">
      <p className="eyebrow mb-2">02 / {t("Choose Your Chapters", "Elige Tus Capitulos")}</p>
      <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-4">
        {t("One Country. Your Route.", "Un Pais. Tu Ruta.")}
      </h2>
      <p className="text-xs text-[#9EA6B5] mb-6">
        {t(
          "Reorder regions with the arrows. Transport between regions needs team review.",
          "Ordena las regiones con las flechas. Los traslados requieren revision."
        )}
      </p>

      {/* Region tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {b.selectedDestinations.map((selection, i) => (
          <div
            data-testid={`route-region-${selection.id}`}
            key={selection.id}
            className="flex items-center border border-[#262B35] rounded-lg overflow-hidden bg-[#181B22]"
          >
            <button
              data-testid={`destination-tab-${selection.id}`}
              aria-pressed={b.activeTab === selection.id}
              onClick={() => b.setActiveTab(selection.id)}
              className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                b.activeTab === selection.id ? "bg-[#FF3B30] text-white" : "text-[#9EA6B5] hover:bg-[#20252E] hover:text-white"
              }`}
            >
              {regionName(selection.id, language)}
              {selection.days > 0 ? ` · ${selection.days}d` : ""}
            </button>
            <button
              aria-label={t("Move earlier", "Mover antes")}
              data-testid={`move-up-${selection.id}`}
              disabled={i === 0}
              onClick={() => b.moveDestination(selection.id, -1)}
              className="p-2 text-[#9EA6B5] disabled:opacity-25 hover:bg-[#20252E] transition-colors"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              aria-label={t("Move later", "Mover despues")}
              data-testid={`move-down-${selection.id}`}
              disabled={i === 4}
              onClick={() => b.moveDestination(selection.id, 1)}
              className="p-2 text-[#9EA6B5] disabled:opacity-25 hover:bg-[#20252E] transition-colors"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Active destination panel */}
      <div data-testid={`destination-panel-${dest.id}`} className="border border-[#262B35] rounded-xl overflow-hidden bg-[#181B22]">
        {/* Header with image */}
        <div className="relative px-6 py-8 text-white">
          <img src={dest.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A0C]/80 to-[#090A0C]/40" />
          <div className="relative flex flex-wrap justify-between gap-5 items-center">
            <div>
              <span className="font-mono text-[10px] text-[#FF3B30] tracking-widest">{dest.chapter}</span>
              <h3 className="text-2xl font-bold uppercase tracking-tight mt-1">{regionName(dest.id, language)}</h3>
            </div>
            <div className="flex gap-2 items-center">
              <button
                data-testid={`days-minus-${dest.id}`}
                aria-label={t("Remove a day", "Quitar un dia")}
                disabled={!selected.days}
                onClick={() => b.handleDaysChange(dest.id, selected.days - 1)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#262B35] text-white disabled:opacity-25 hover:bg-[#20252E] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span data-testid={`days-count-${dest.id}`} className="font-mono text-sm min-w-[50px] text-center">
                {selected.days} {t("days", "dias")}
              </span>
              <button
                data-testid={`days-plus-${dest.id}`}
                aria-label={t("Add a day", "Anadir un dia")}
                disabled={selected.days === 14}
                onClick={() => b.handleDaysChange(dest.id, selected.days + 1)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#262B35] text-white disabled:opacity-25 hover:bg-[#20252E] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!selected.days ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#9EA6B5] mb-5">
              {t("Begin with a day outside, or stay a little longer.", "Empieza con un dia al aire libre.")}
            </p>
            <button
              data-testid={`quick-add-${dest.id}`}
              onClick={() => b.handleDaysChange(dest.id, 3)}
              className="px-5 py-2.5 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider"
            >
              {t("Start with 3 days", "Empezar con 3 dias")}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Activities */}
            <div>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                {t("Experiences", "Experiencias")}
              </p>
              <div className="space-y-2">
                {dest.activities.map((a) => (
                  <label
                    key={a.id}
                    htmlFor={`experience-${dest.id}-${a.id}`}
                    data-testid={`activity-${dest.id}-${a.id}`}
                    className="flex gap-3 items-start rounded-lg border border-[#262B35] p-3 cursor-pointer hover:bg-[#20252E] transition-colors"
                  >
                    <Checkbox
                      data-testid={`checkbox-${dest.id}-${a.id}`}
                      id={`experience-${dest.id}-${a.id}`}
                      className="mt-1"
                      checked={selected.activities.includes(a.id)}
                      onCheckedChange={() => b.handleActivityToggle(dest.id, a.id)}
                    />
                    <span className="flex-1 text-sm text-white">
                      {activityName(dest.id, a, language)}
                      <span className="block text-xs text-[#9EA6B5] mt-1">
                        {a.duration === 1 ? t("Full day", "Dia completo") : t("Half day", "Medio dia")} ·{" "}
                        {group || a.price == null
                          ? t("Quote required", "Cotizacion requerida")
                          : `${formatCurrency(a.price)} / ${a.id === "private-guide" ? t("group", "grupo") : t("person", "persona")}`}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            <div>
              <label className="text-sm font-semibold text-white uppercase tracking-wider block mb-2" htmlFor={`accommodation-select-${dest.id}`}>
                {t("Proposed Stay", "Estadia Propuesta")} ·{" "}
                <span data-testid={`nights-${dest.id}`} className="text-[#FF3B30]">
                  {b.getNights(dest.id)} {t("nights", "noches")}
                </span>
              </label>
              <BriefSelect
                id={`accommodation-select-${dest.id}`}
                value={selected.accommodation || ""}
                onChange={(v) => b.handleAccommodationSelect(dest.id, v)}
                options={[
                  ["", t("Team recommendation · quote required", "Recomendacion del equipo · cotizacion requerida")],
                  ["custom", t("Local / simple / other", "Local / sencillo / otro")],
                  ...dest.accommodations.map((a) => [
                    a.id,
                    `${a.name} · ${group ? t("quote required", "cotizacion requerida") : `${formatCurrency(a.price)} / ${t("person/night", "persona/noche")}`}`,
                  ]),
                ]}
              />
              {selected.accommodation === "custom" && (
                <Input
                  data-testid={`custom-accommodation-${dest.id}`}
                  className="mt-3 bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50"
                  maxLength={160}
                  value={selected.customAccommodation}
                  placeholder={t("Your preference", "Tu preferencia")}
                  onChange={(e) => b.handleCustomAccommodation(dest.id, e.target.value)}
                />
              )}
              <p className="text-xs text-[#9EA6B5]/60 mt-3 leading-relaxed">
                {t(
                  "Named lodges are preferences, not reserved inventory. Team review required for inclusions.",
                  "Los alojamientos son preferencias, no reservas. Revision del equipo requerida."
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
