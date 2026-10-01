import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useLocale } from "@/hooks/useLocale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const BriefField = ({ id, label, children }) => (
  <label className="block space-y-2 text-xs text-[#9EA6B5]" htmlFor={id}>
    <span>{label}</span>
    {children}
  </label>
);

export const BriefSelect = ({ id, value, onChange, options }) => (
  <select
    data-testid={id}
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-[#262B35] bg-[#20252E] rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-[#FF3B30]/50 transition-colors"
  >
    {options.map(([v, label]) => (
      <option key={v} value={v} data-testid={`${id}-option-${v || "empty"}`}>
        {label}
      </option>
    ))}
  </select>
);

export const AdventureBrief = ({ builder: b }) => {
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const update = (key, value) => {
    if (key === "trip_type" && value === "personal") b.setTravelers(Math.min(30, b.travelers));
    b.setBrief((prev) => ({ ...prev, [key]: value }));
  };
  const input = (key, label, type = "text") => (
    <BriefField id={`brief-${key}`} label={label}>
      <Input
        data-testid={`brief-${key}`}
        id={`brief-${key}`}
        type={type}
        min={type === "number" ? 1 : undefined}
        maxLength={200}
        value={b.brief[key] ?? ""}
        onChange={(e) => update(key, type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value)}
        className="bg-[#20252E] border-[#262B35] text-white placeholder:text-[#9EA6B5]/40 focus:border-[#FF3B30]/50"
      />
    </BriefField>
  );
  const select = (key, label, options) => (
    <BriefField id={`brief-${key}`} label={label}>
      <BriefSelect id={`brief-${key}`} value={b.brief[key]} onChange={(v) => update(key, v)} options={options} />
    </BriefField>
  );
  const group = b.brief.trip_type === "group";

  const stepLabels = [t("Essentials", "Esencial"), t("Your Rhythm", "Tu Ritmo"), t("Details", "Detalles")];

  return (
    <section data-testid="adventure-brief" className="p-6 sm:p-8 bg-[#181B22] border border-[#262B35] rounded-xl">
      <p className="eyebrow mb-2">01 / {t("About Your Adventure", "Tu Aventura")}</p>
      <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-5">
        {t("Begin with what matters.", "Empieza con lo que importa.")}
      </h2>

      <div className="flex gap-2 mb-7">
        {stepLabels.map((label, i) => (
          <button
            key={i}
            data-testid={`brief-step-${i}`}
            onClick={() => setStep(i)}
            className={`flex-1 text-xs px-2 py-2 rounded-lg font-semibold uppercase tracking-wider transition-colors ${
              step === i
                ? "bg-[#FF3B30] text-white"
                : "border border-[#262B35] text-[#9EA6B5] hover:bg-[#20252E]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {step === 0 && (
          <>
            {select("trip_type", t("I'm planning", "Quiero planificar"), [
              ["personal", t("A personal adventure", "Una aventura personal")],
              ["group", t("A group expedition", "Una expedicion grupal")],
            ])}
            <BriefField id="travelers-input" label={t("Travelers", "Viajeros")}>
              <Input
                data-testid="travelers-input"
                id="travelers-input"
                type="number"
                min="1"
                max={group ? 10000 : 30}
                value={b.travelers}
                onChange={(e) => b.setTravelers(Math.max(1, Math.min(group ? 10000 : 30, Number(e.target.value) || 1)))}
                className="bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50"
              />
            </BriefField>
            {group && input("organization", t("Organization name", "Nombre de organizacion"))}
            {input("party_composition", t("Party composition", "Composicion del grupo"))}
            {[
              ["start", b.startDate, b.setStartDate],
              ["end", b.endDate, b.setEndDate],
            ].map(([key, value, setter]) => (
              <BriefField key={key} id={`${key}-date-input`} label={key === "start" ? t("Start date", "Fecha inicio") : t("Return date", "Fecha regreso")}>
                <Input
                  data-testid={`${key}-date-input`}
                  id={`${key}-date-input`}
                  type="date"
                  value={value ? format(value, "yyyy-MM-dd") : ""}
                  onChange={(e) => setter(e.target.value ? parseISO(e.target.value) : null)}
                  className="bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50"
                />
              </BriefField>
            ))}
            {input("flexible_window", t("Or a flexible window", "O un periodo flexible"))}
            {input("desired_duration", t("Duration (days)", "Duracion (dias)"), "number")}
            {input("budget", t("Budget in EUR (optional)", "Presupuesto EUR (opcional)"), "number")}
            {select("budget_basis", t("This budget is", "Este presupuesto es"), [
              ["per_person", t("Per person", "Por persona")],
              ["total", t("Total for the group", "Total del grupo")],
            ])}
          </>
        )}
        {step === 1 && (
          <>
            <div className="sm:col-span-2">
              <p className="text-xs text-[#9EA6B5] mb-3">{t("What draws you outside?", "Que te invita a salir?")}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["trekking", "Trekking", "Senderismo"],
                  ["nature", "Nature", "Naturaleza"],
                  ["culture", "Culture", "Cultura"],
                  ["astronomy", "Stargazing", "Astronomia"],
                  ["family", "Family", "Familia"],
                  ["photography", "Photography", "Fotografia"],
                  ["workation", "Workation", "Trabajo y viaje"],
                ].map(([id, en, es]) => (
                  <button
                    key={id}
                    data-testid={`interest-${id}`}
                    aria-pressed={b.brief.interests.includes(id)}
                    onClick={() =>
                      update(
                        "interests",
                        b.brief.interests.includes(id) ? b.brief.interests.filter((x) => x !== id) : [...b.brief.interests, id]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                      b.brief.interests.includes(id)
                        ? "bg-[#FF3B30] text-white"
                        : "border border-[#262B35] text-[#9EA6B5] hover:bg-[#20252E] hover:text-white"
                    }`}
                  >
                    {t(en, es)}
                  </button>
                ))}
              </div>
            </div>
            {select("pace", t("Pace", "Ritmo"), [
              ["relaxed", t("Relaxed", "Tranquilo")],
              ["balanced", t("Balanced", "Equilibrado")],
              ["active", t("Active", "Activo")],
            ])}
            {select("experience", t("Experience level", "Nivel de experiencia"), [
              ["", t("Discuss with team", "Consultar")],
              ["beginner", t("Beginner", "Principiante")],
              ["occasional", t("Occasional", "Ocasional")],
              ["experienced", t("Experienced", "Experimentado")],
            ])}
            {select("comfort", t("Comfort level", "Nivel de comodidad"), [
              ["", t("Open to suggestions", "Acepto sugerencias")],
              ["local", t("Local / simple", "Local / sencillo")],
              ["comfortable", t("Comfortable", "Comodo")],
              ["premium", t("Premium", "Premium")],
            ])}
          </>
        )}
        {step === 2 && (
          <>
            {[
              ["accessibility", t("Mobility needs (optional)", "Movilidad (opcional)")],
              ["requirements", t("Planning requirements", "Requisitos de planificacion")],
              ...(group ? [["goals", t("Group objectives", "Objetivos del grupo")]] : []),
            ].map(([key, label]) => (
              <div className="sm:col-span-2" key={key}>
                <BriefField id={`brief-${key}`} label={label}>
                  <Textarea
                    data-testid={`brief-${key}`}
                    id={`brief-${key}`}
                    maxLength={1000}
                    value={b.brief[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="bg-[#20252E] border-[#262B35] text-white placeholder:text-[#9EA6B5]/40 focus:border-[#FF3B30]/50"
                  />
                </BriefField>
              </div>
            ))}
            {input("source", t("How did you find us?", "Como nos encontraste?"))}
            <p className="text-xs leading-relaxed text-[#9EA6B5]/60 sm:col-span-2">
              {t("No medical history needed. Contact details come when you request a proposal.", "No necesitamos historial medico. Los datos de contacto se solicitan al pedir la propuesta.")}
            </p>
          </>
        )}
      </div>

      <div className="flex justify-between mt-7">
        <button
          data-testid="brief-back"
          disabled={!step}
          onClick={() => setStep(step - 1)}
          className="text-sm text-[#9EA6B5] hover:text-white disabled:opacity-30 transition-colors"
        >
          {t("Back", "Atras")}
        </button>
        <button
          data-testid="brief-next"
          onClick={() => (step < 2 ? setStep(step + 1) : document.getElementById("route-designer")?.scrollIntoView({ behavior: "smooth" }))}
          className="px-5 py-2 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider"
        >
          {step < 2 ? t("Continue", "Continuar") : t("Shape the Route", "Disenar la Ruta")}
        </button>
      </div>
    </section>
  );
};
