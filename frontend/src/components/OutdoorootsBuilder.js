import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Download, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { formatCurrency } from "@/data/destinations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdventureBrief, BriefField } from "@/components/builder/AdventureBrief";
import { RouteDesigner } from "@/components/builder/RouteDesigner";
import { JourneyTimeline } from "@/components/builder/JourneyTimeline";
import { Recommendations } from "@/components/StartJourneys";
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const OutdoorootsBuilder = ({ builder: b }) => {
  const { t } = useLocale();
  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState(false);
  const [reference, setReference] = useState(null);
  const group = b.brief.trip_type === "group";
  const amount = b.brief.budget_basis === "total" ? b.grandTotal : b.grandTotal / b.travelers;
  const exportPdf = async () => {
    setDownloading(true);
    try {
      const payload = b.buildPayload(); delete payload.contact;
      const { data } = await axios.post(`${API}/itinerary/pdf`, payload, { responseType: "blob" });
      const url = URL.createObjectURL(data); const a = document.createElement("a"); a.href = url; a.download = "outdooroots-itinerary.pdf"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(t("Your one-page journey is ready", "Tu resumen de viaje está listo"));
    } catch { toast.error(t("PDF couldn't be created. Your ideas are safe; please try again.", "No se pudo crear el PDF. Tus ideas están guardadas en esta página; inténtalo de nuevo.")); }
    finally { setDownloading(false); }
  };
  const submit = async (event) => {
    event.preventDefault(); b.setSubmitting(true); setReference(null);
    try { const { data } = await axios.post(`${API}/bookings`, b.buildPayload()); setReference(data.reference || data.id); }
    catch (e) { toast.error(t("We couldn't save your inquiry. Please check the details and try again.", "No pudimos guardar tu consulta. Revisa los datos e inténtalo de nuevo.")); }
    finally { b.setSubmitting(false); }
  };
  return <section id="builder" data-testid="builder-section" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 scroll-mt-20">
    <div className="mb-12 max-w-2xl"><p className="eyebrow mb-4">{t("The trip-design workspace", "Tu espacio para diseñar viajes")}</p><h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl">{t("An adventure with your name on it.", "Una aventura que lleva tu nombre.")}</h1><p className="mt-5 text-sm text-[#5C656E] leading-relaxed">{t("A starting idea is enough. Tell us what moves you; together we'll turn it into a considered proposal.", "Una idea es suficiente. Cuéntanos qué te inspira y juntos la convertiremos en una propuesta a tu medida.")}</p></div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-9 items-start"><div className="min-w-0"><AdventureBrief builder={b} /><Recommendations builder={b} /><RouteDesigner builder={b} /><JourneyTimeline builder={b} /></div>
      <aside className={`${ready ? "" : "lg:sticky lg:top-24"} space-y-5`}>
        <div className="rounded-xl border border-[#E6DFD5] bg-white p-6" data-testid="package-summary-card"><p className="eyebrow mb-4">{t("Your field notes", "Tu cuaderno de viaje")}</p><BriefField id="package-name-input" label={t("Name your journey", "Nombra tu viaje")}><Input data-testid="package-name-input" id="package-name-input" value={b.packageName} maxLength={120} placeholder={t("My Outdooroots adventure", "Mi aventura Outdooroots")} onChange={(e) => b.setPackageName(e.target.value)} /></BriefField>
          <div className="grid grid-cols-3 gap-2 my-6 text-center">{[[b.totalDays, t("days", "días"), "summary-total-days"], [Math.max(0, b.totalDays - 1), t("nights", "noches"), "summary-total-nights"], [b.travelers, t("travelers", "viajeros"), "summary-travelers"]].map(([value, label, id]) => <div key={id}><p data-testid={id} className="font-serif text-3xl">{value}</p><p className="text-[10px] uppercase text-[#5C656E]">{label}</p></div>)}</div>
          <div className="space-y-4 mb-6">{b.breakdown.map((d) => <div key={d.id} data-testid={`summary-destination-${d.id}`} className="border-t border-[#E6DFD5] pt-3"><p className="text-sm font-medium">{d.name}</p><p className="text-xs text-[#5C656E] mt-1">{d.days} {t("days", "días")} · {d.nights} {t("nights", "noches")} · {d.activities.length} {t("experiences", "experiencias")}</p><p className="text-xs mt-2">{t("Experiences / guides", "Experiencias / guías")}: {group ? t("quote required", "cotización requerida") : formatCurrency(d.activitiesCost)}</p><p className="text-xs mt-1">{t("Stays", "Alojamientos")}: {group || (!d.accommodation && d.nights > 0) ? t("quote required", "cotización requerida") : formatCurrency(d.accommodationCost)}</p></div>)}</div>
          <div className="bg-[#0B192C] text-white rounded-lg p-5"><p data-testid="estimate-label" className="font-mono uppercase text-[9px] tracking-widest">{t("Illustrative estimate · EUR", "Estimación ilustrativa · EUR")}</p><p data-testid="grand-total-display" className="font-serif text-3xl mt-2">{group || !b.grandTotal ? t("Quote required", "Cotización requerida") : formatCurrency(b.grandTotal)}</p>{!group && b.grandTotal > 0 && <p data-testid="per-person-estimate" className="text-xs mt-2 opacity-80">{formatCurrency(b.grandTotal / b.travelers)} / {t("person", "persona")} · {b.travelers} {t("travelers", "viajeros")}</p>}</div>
          <p data-testid="estimate-disclaimer" className="text-xs text-[#5C656E] mt-4 leading-relaxed">{t("Example rates, not approved commercial prices. Only priced experiences and proposed nights are counted. Flights, transport and missing prices need a quote. No automatic tax or service charge. Lodge inclusions must be reviewed before pricing.", "Tarifas de ejemplo, no precios comerciales aprobados. Solo se suman experiencias y noches con precio. Vuelos, transporte e importes faltantes requieren cotización. Sin impuestos ni cargos automáticos. Se revisarán las inclusiones del alojamiento.")}</p>
          {!group && b.brief.budget != null && <p data-testid="budget-comparison" className="planning-note mt-4">{amount > b.brief.budget ? t("The priced portion already exceeds your stated budget.", "La parte con precio ya supera tu presupuesto.") : t("The priced portion is within your stated budget, but unpriced items may increase the total.", "La parte con precio está dentro del presupuesto, pero faltan conceptos por cotizar.")}</p>}
          <Button data-testid="export-pdf-button" variant="outline" disabled={downloading} onClick={exportPdf} className="w-full mt-5"><Download className="w-4 h-4 mr-2" />{downloading ? t("Typesetting…", "Preparando…") : t("Download one-page PDF", "Descargar resumen PDF")}</Button>
          <Button data-testid="request-proposal-button" onClick={() => { setReady(true); setTimeout(() => { document.getElementById("proposal-contact")?.scrollIntoView({ behavior: "smooth", block: "start" }); document.getElementById("contact-name-input")?.focus({ preventScroll: true }); }, 100); }} className="w-full mt-3 h-auto py-3 whitespace-normal">{t("Request my adventure proposal", "Solicitar mi propuesta de aventura")}<ArrowUpRight className="w-4 h-4 ml-2 shrink-0" /></Button>
          <div className="flex justify-between gap-2 mt-4"><button data-testid="load-sample-button" className="text-xs underline text-[#5C656E]" onClick={b.loadSample}>{t("Try all five chapters", "Probar los cinco capítulos")}</button><button data-testid="reset-button" className="text-xs underline text-[#5C656E]" onClick={() => { b.reset(); setReference(null); }}>{t("Reset route", "Reiniciar ruta")}</button></div>
        </div>
        {ready && <form id="proposal-contact" data-testid="proposal-contact-form" onSubmit={submit} className="bg-[#F6F2EB] p-6 rounded-xl border border-[#E6DFD5] space-y-4"><h2 className="font-serif text-lg">{t("Let's make it yours.", "Hagámoslo a tu medida.")}</h2>{[["name", t("Full name", "Nombre completo"), "text"], ["email", t("Email", "Correo electrónico"), "email"], ["phone", t("Phone (optional)", "Teléfono (opcional)"), "tel"]].map(([key, label, type]) => <BriefField key={key} id={`contact-${key}-input`} label={label}><Input data-testid={`contact-${key}-input`} id={`contact-${key}-input`} type={type} required={key !== "phone"} maxLength={200} value={b.contactInfo[key]} onChange={(e) => b.setContactInfo({ ...b.contactInfo, [key]: e.target.value })} /></BriefField>)}<BriefField id="contact-notes-input" label={t("Anything else? (optional)", "¿Algo más? (opcional)")}><Textarea data-testid="contact-notes-input" id="contact-notes-input" value={b.contactInfo.notes} maxLength={2000} onChange={(e) => b.setContactInfo({ ...b.contactInfo, notes: e.target.value })} /></BriefField><p className="text-xs leading-relaxed text-[#5C656E]">{t("This is an inquiry, not a reservation. Your details are used to review and respond to your request. No marketing enrollment or automated email.", "Esto es una consulta, no una reserva. Usamos tus datos para revisar y responder a tu solicitud. Sin inscripción comercial ni correos automáticos.")}</p><Button data-testid="submit-booking-button" type="submit" disabled={b.submitting} className="w-full h-auto py-3 whitespace-normal">{b.submitting ? t("Saving inquiry…", "Guardando consulta…") : t("Send for team review", "Enviar para revisión del equipo")}</Button></form>}
        {reference && <div data-testid="inquiry-confirmation" role="status" className="rounded-xl p-6 bg-[#EEFAF4] text-[#0F5132]"><h2 className="font-serif text-lg">{t("Your adventure starts here.", "Tu aventura empieza aquí.")}</h2><p data-testid="inquiry-reference" className="font-mono text-xs my-3 break-all">{reference}</p><p className="text-sm">{t("Your request is saved. The Outdooroots team will review your ideas and outstanding planning items. Keep this reference; nothing has been reserved.", "Tu solicitud está guardada. El equipo Outdooroots revisará tus ideas y los detalles pendientes. Conserva esta referencia; no se ha reservado ningún servicio.")}</p></div>}
      </aside>
    </div>
  </section>;
};
