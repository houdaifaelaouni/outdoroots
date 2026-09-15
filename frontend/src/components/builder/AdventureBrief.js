import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useLocale } from "@/hooks/useLocale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const BriefField = ({ id, label, children }) => <label className="block space-y-2 text-xs text-[#5C656E]" htmlFor={id}><span>{label}</span>{children}</label>;
export const BriefSelect = ({ id, value, onChange, options }) => <select data-testid={id} id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#E6DFD5] bg-white rounded-md p-2.5 text-sm text-[#0B192C]">{options.map(([v, label]) => <option key={v} value={v} data-testid={`${id}-option-${v || 'empty'}`}>{label}</option>)}</select>;
export const AdventureBrief = ({ builder: b }) => {
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const update = (key, value) => {
    if (key === "trip_type" && value === "personal") b.setTravelers(Math.min(30, b.travelers));
    b.setBrief((prev) => ({ ...prev, [key]: value }));
  };
  const input = (key, label, type = "text") => <BriefField id={`brief-${key}`} label={label}><Input data-testid={`brief-${key}`} id={`brief-${key}`} type={type} min={type === "number" ? 1 : undefined} maxLength={200} value={b.brief[key] ?? ""} onChange={(e) => update(key, type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value)} /></BriefField>;
  const select = (key, label, options) => <BriefField id={`brief-${key}`} label={label}><BriefSelect id={`brief-${key}`} value={b.brief[key]} onChange={(v) => update(key, v)} options={options} /></BriefField>;
  const group = b.brief.trip_type === "group";
  return <section data-testid="adventure-brief" className="p-6 sm:p-8 bg-white border border-[#E6DFD5] rounded-xl">
    <p className="eyebrow mb-2">01 / {t("A little about your adventure", "Tu próxima aventura")}</p>
    <h2 className="font-serif text-lg mb-5">{t("Begin with what matters to you.", "Empieza con lo que te importa.")}</h2>
    <div className="flex gap-2 mb-7">{[t("The essentials", "Lo esencial"), t("Your rhythm", "Tu ritmo"), t("Practical details", "Detalles prácticos")].map((label, i) => <Button key={i} data-testid={`brief-step-${i}`} size="sm" variant={step === i ? "default" : "outline"} onClick={() => setStep(i)} className="flex-1 text-xs px-2 whitespace-normal h-auto py-2">{label}</Button>)}</div>
    <div className="grid sm:grid-cols-2 gap-5">
      {step === 0 && <>
        {select("trip_type", t("I'm planning", "Quiero planificar"), [["personal", t("A personal adventure", "Una aventura personal")], ["group", t("A corporate or private group", "Un grupo privado o corporativo")]])}
        <BriefField id="travelers-input" label={t("Number of travelers", "Número de viajeros")}><Input data-testid="travelers-input" id="travelers-input" type="number" min="1" max={group ? 10000 : 30} value={b.travelers} onChange={(e) => b.setTravelers(Math.max(1, Math.min(group ? 10000 : 30, Number(e.target.value) || 1)))} /></BriefField>
        {group && input("organization", t("Organization / group name", "Organización / nombre del grupo"))}
        {input("party_composition", t("Party composition (adults, children, family…)", "Composición (adultos, niños, familia…)"))}
        {[["start", b.startDate, b.setStartDate], ["end", b.endDate, b.setEndDate]].map(([key, value, setter]) => <BriefField key={key} id={`${key}-date-input`} label={key === "start" ? t("Preferred start", "Inicio preferido") : t("Preferred return", "Regreso preferido")}><Input data-testid={`${key}-date-input`} id={`${key}-date-input`} type="date" value={value ? format(value, "yyyy-MM-dd") : ""} onChange={(e) => setter(e.target.value ? parseISO(e.target.value) : null)} /></BriefField>)}
        {input("flexible_window", t("Or a flexible window", "O un período flexible"))}{input("desired_duration", t("Desired duration (days)", "Duración deseada (días)"), "number")}
        {input("budget", t("Budget in EUR (optional)", "Presupuesto en EUR (opcional)"), "number")}
        {select("budget_basis", t("This budget is", "Este presupuesto es"), [["per_person", t("Per person · EUR", "Por persona · EUR")], ["total", t("Total for the group · EUR", "Total del grupo · EUR")]])}
      </>}
      {step === 1 && <>
        <div className="sm:col-span-2"><p className="text-xs mb-3">{t("What draws you outside?", "¿Qué te invita a salir?")}</p><div className="flex flex-wrap gap-2">{[["trekking", "Trekking", "Senderismo"], ["nature", "Nature", "Naturaleza"], ["culture", "Local culture", "Cultura local"], ["astronomy", "Stargazing", "Astronomía"], ["family", "Family time", "En familia"], ["photography", "Photography", "Fotografía"], ["workation", "Workation", "Trabajo y viaje"]].map(([id, en, es]) => <Button key={id} data-testid={`interest-${id}`} aria-pressed={b.brief.interests.includes(id)} variant={b.brief.interests.includes(id) ? "default" : "outline"} className="rounded-full" size="sm" onClick={() => update("interests", b.brief.interests.includes(id) ? b.brief.interests.filter((x) => x !== id) : [...b.brief.interests, id])}>{t(en, es)}</Button>)}</div></div>
        {select("pace", t("Preferred pace", "Ritmo preferido"), [["relaxed", t("Relaxed", "Tranquilo")], ["balanced", t("Balanced", "Equilibrado")], ["active", t("Active", "Activo")]])}
        {select("experience", t("Outdoor experience", "Experiencia al aire libre"), [["", t("Discuss with the team", "Consultar con el equipo")], ["beginner", t("New to adventure", "Principiante")], ["occasional", t("Occasional explorer", "Ocasional")], ["experienced", t("Experienced", "Con experiencia")]])}
        {select("comfort", t("Accommodation comfort", "Comodidad del alojamiento"), [["", t("Open to suggestions", "Acepto sugerencias")], ["local", t("Locally hosted / simple", "Local / sencillo")], ["comfortable", t("Comfortable", "Cómodo")], ["premium", t("Premium", "Premium")]])}
      </>}
      {step === 2 && <>
        {[["accessibility", t("Mobility or access needs (optional)", "Movilidad o accesibilidad (opcional)")], ["requirements", t("Practical preferences / planning requirements", "Preferencias prácticas / requisitos")], ...(group ? [["goals", t("Group goals and objectives", "Objetivos del grupo")]] : [])].map(([key, label]) => <div className="sm:col-span-2" key={key}><BriefField id={`brief-${key}`} label={label}><Textarea data-testid={`brief-${key}`} id={`brief-${key}`} maxLength={1000} value={b.brief[key]} onChange={(e) => update(key, e.target.value)} /></BriefField></div>)}
        {input("source", t("How did you find us? (optional)", "¿Cómo nos encontraste? (opcional)"))}
        <p className="text-xs leading-relaxed text-[#5C656E] sm:col-span-2">{t("No medical history needed. Share only practical needs you want our team to consider. Contact details come when you're ready to request a proposal.", "No necesitamos tu historial médico. Comparte solo necesidades prácticas para el equipo. Los datos de contacto se solicitan cuando quieras pedir una propuesta.")}</p>
      </>}
    </div>
    <div className="flex justify-between mt-7"><Button data-testid="brief-back" variant="ghost" disabled={!step} onClick={() => setStep(step - 1)}>{t("Back", "Atrás")}</Button><Button data-testid="brief-next" onClick={() => step < 2 ? setStep(step + 1) : document.getElementById("route-designer")?.scrollIntoView({ behavior: "smooth" })}>{step < 2 ? t("Continue", "Continuar") : t("Shape the journey", "Diseñar el viaje")}</Button></div>
  </section>;
};
