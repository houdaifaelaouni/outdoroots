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
      const payload = b.buildPayload();
      delete payload.contact;
      const { data } = await axios.post(`${API}/itinerary/pdf`, payload, { responseType: "blob" });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "outdooroots-itinerary.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(t("Your one-page journey is ready", "Tu resumen de viaje esta listo"));
    } catch {
      toast.error(t("PDF couldn't be created. Please try again.", "No se pudo crear el PDF. Intentalo de nuevo."));
    } finally {
      setDownloading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    b.setSubmitting(true);
    setReference(null);
    try {
      const { data } = await axios.post(`${API}/bookings`, b.buildPayload());
      setReference(data.reference || data.id);
    } catch {
      toast.error(t("Couldn't save your inquiry. Please try again.", "No pudimos guardar tu consulta. Intentalo de nuevo."));
    } finally {
      b.setSubmitting(false);
    }
  };

  return (
    <section id="builder" data-testid="builder-section" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-24 scroll-mt-20">
      <div className="mb-14 max-w-2xl">
        <span className="eyebrow mb-3 block">{t("Trip Builder", "Creador de Viaje")}</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase text-white leading-[0.95]">
          {t("Design Your Expedition", "Disena Tu Expedicion")}
        </h1>
        <p className="mt-5 text-sm text-[#9EA6B5] leading-relaxed">
          {t(
            "A starting idea is enough. Tell us what moves you; together we'll turn it into a considered proposal.",
            "Una idea es suficiente. Cuentanos que te inspira y juntos la convertiremos en una propuesta a tu medida."
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <div className="min-w-0">
          <AdventureBrief builder={b} />
          <Recommendations builder={b} />
          <RouteDesigner builder={b} />
          <JourneyTimeline builder={b} />
        </div>

        <aside className="space-y-5">
          {/* Package summary card */}
          <div className="rounded-xl border border-[#262B35] bg-[#181B22] p-6" data-testid="package-summary-card">
            <p className="eyebrow mb-4">{t("Your Field Notes", "Tu Cuaderno de Viaje")}</p>

            <BriefField id="package-name-input" label={t("Name your journey", "Nombra tu viaje")}>
              <Input
                data-testid="package-name-input"
                id="package-name-input"
                value={b.packageName}
                maxLength={120}
                placeholder={t("My Outdooroots expedition", "Mi expedicion Outdooroots")}
                onChange={(e) => b.setPackageName(e.target.value)}
                className="bg-[#20252E] border-[#262B35] text-white placeholder:text-[#9EA6B5]/40 focus:border-[#FF3B30]/50"
              />
            </BriefField>

            <div className="grid grid-cols-3 gap-2 my-6 text-center">
              {[
                [b.totalDays, t("days", "dias"), "summary-total-days"],
                [Math.max(0, b.totalDays - 1), t("nights", "noches"), "summary-total-nights"],
                [b.travelers, t("travelers", "viajeros"), "summary-travelers"],
              ].map(([value, label, id]) => (
                <div key={id}>
                  <p data-testid={id} className="text-3xl font-extrabold text-white">{value}</p>
                  <p className="font-mono text-[10px] uppercase text-[#9EA6B5] tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              {b.breakdown.map((d) => (
                <div key={d.id} data-testid={`summary-destination-${d.id}`} className="border-t border-[#262B35] pt-3">
                  <p className="text-sm font-semibold text-white uppercase">{d.name}</p>
                  <p className="text-xs text-[#9EA6B5] mt-1">
                    {d.days} {t("days", "dias")} · {d.nights} {t("nights", "noches")} · {d.activities.length} {t("experiences", "experiencias")}
                  </p>
                  <p className="text-xs text-[#9EA6B5] mt-2">
                    {t("Experiences", "Experiencias")}: {group ? t("quote required", "cotizacion requerida") : formatCurrency(d.activitiesCost)}
                  </p>
                  <p className="text-xs text-[#9EA6B5] mt-1">
                    {t("Stays", "Alojamientos")}: {group || (!d.accommodation && d.nights > 0) ? t("quote required", "cotizacion requerida") : formatCurrency(d.accommodationCost)}
                  </p>
                </div>
              ))}
            </div>

            {/* Estimate */}
            <div className="bg-[#FF3B30] text-white rounded-lg p-5">
              <p data-testid="estimate-label" className="font-mono uppercase text-[9px] tracking-widest opacity-80">
                {t("Illustrative Estimate · EUR", "Estimacion Ilustrativa · EUR")}
              </p>
              <p data-testid="grand-total-display" className="text-3xl font-extrabold mt-2">
                {group || !b.grandTotal ? t("Quote required", "Cotizacion requerida") : formatCurrency(b.grandTotal)}
              </p>
              {!group && b.grandTotal > 0 && (
                <p data-testid="per-person-estimate" className="text-xs mt-2 opacity-80">
                  {formatCurrency(b.grandTotal / b.travelers)} / {t("person", "persona")} · {b.travelers} {t("travelers", "viajeros")}
                </p>
              )}
            </div>

            <p data-testid="estimate-disclaimer" className="text-xs text-[#9EA6B5]/60 mt-4 leading-relaxed">
              {t(
                "Example rates, not approved commercial prices. Flights, transport and missing prices need a quote.",
                "Tarifas de ejemplo, no precios comerciales aprobados. Vuelos, transporte e importes faltantes requieren cotizacion."
              )}
            </p>

            {!group && b.brief.budget != null && (
              <p data-testid="budget-comparison" className="planning-note mt-4">
                {amount > b.brief.budget
                  ? t("The priced portion already exceeds your stated budget.", "La parte con precio ya supera tu presupuesto.")
                  : t("Within budget, but unpriced items may increase the total.", "Dentro del presupuesto, pero faltan conceptos por cotizar.")}
              </p>
            )}

            <button
              data-testid="export-pdf-button"
              disabled={downloading}
              onClick={exportPdf}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-[#262B35] text-white rounded-lg hover:bg-[#20252E] transition-colors disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              {downloading ? t("Preparing...", "Preparando...") : t("Download PDF", "Descargar PDF")}
            </button>

            <button
              data-testid="request-proposal-button"
              onClick={() => {
                setReady(true);
                setTimeout(() => {
                  document.getElementById("proposal-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  document.getElementById("contact-name-input")?.focus({ preventScroll: true });
                }, 100);
              }}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider"
            >
              {t("Request Proposal", "Solicitar Propuesta")}
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </button>

            <div className="flex justify-between gap-2 mt-4">
              <button data-testid="load-sample-button" className="text-xs text-[#9EA6B5] hover:text-white transition-colors underline" onClick={b.loadSample}>
                {t("Try all five", "Probar los cinco")}
              </button>
              <button data-testid="reset-button" className="text-xs text-[#9EA6B5] hover:text-white transition-colors underline" onClick={() => { b.reset(); setReference(null); }}>
                {t("Reset route", "Reiniciar ruta")}
              </button>
            </div>
          </div>

          {/* Contact form */}
          {ready && (
            <form id="proposal-contact" data-testid="proposal-contact-form" onSubmit={submit} className="bg-[#121418] p-6 rounded-xl border border-[#262B35] space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold uppercase tracking-tight text-white">{t("Let's Make It Yours", "Hagamoslo a Tu Medida")}</h2>
              {[
                ["name", t("Full name", "Nombre completo"), "text"],
                ["email", t("Email", "Correo electronico"), "email"],
                ["phone", t("Phone (optional)", "Telefono (opcional)"), "tel"],
              ].map(([key, label, type]) => (
                <BriefField key={key} id={`contact-${key}-input`} label={label}>
                  <Input
                    data-testid={`contact-${key}-input`}
                    id={`contact-${key}-input`}
                    type={type}
                    required={key !== "phone"}
                    maxLength={200}
                    value={b.contactInfo[key]}
                    onChange={(e) => b.setContactInfo({ ...b.contactInfo, [key]: e.target.value })}
                    className="bg-[#20252E] border-[#262B35] text-white placeholder:text-[#9EA6B5]/40 focus:border-[#FF3B30]/50"
                  />
                </BriefField>
              ))}
              <BriefField id="contact-notes-input" label={t("Anything else?", "Algo mas?")}>
                <Textarea
                  data-testid="contact-notes-input"
                  id="contact-notes-input"
                  value={b.contactInfo.notes}
                  maxLength={2000}
                  onChange={(e) => b.setContactInfo({ ...b.contactInfo, notes: e.target.value })}
                  className="bg-[#20252E] border-[#262B35] text-white placeholder:text-[#9EA6B5]/40 focus:border-[#FF3B30]/50"
                />
              </BriefField>
              <p className="text-xs leading-relaxed text-[#9EA6B5]/60">
                {t("This is an inquiry, not a reservation. No marketing enrollment.", "Esto es una consulta, no una reserva. Sin inscripcion comercial.")}
              </p>
              <button
                data-testid="submit-booking-button"
                type="submit"
                disabled={b.submitting}
                className="w-full py-3 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider disabled:opacity-40"
              >
                {b.submitting ? t("Saving...", "Guardando...") : t("Send for Review", "Enviar para Revision")}
              </button>
            </form>
          )}

          {/* Confirmation */}
          {reference && (
            <div data-testid="inquiry-confirmation" role="status" className="rounded-xl p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <h2 className="text-lg font-bold uppercase tracking-tight">{t("Inquiry Saved", "Consulta Guardada")}</h2>
              <p data-testid="inquiry-reference" className="font-mono text-xs my-3 break-all text-emerald-300">{reference}</p>
              <p className="text-sm text-emerald-400/80">
                {t(
                  "Your request is saved. The team will review your ideas. Keep this reference; nothing has been reserved.",
                  "Tu solicitud esta guardada. El equipo revisara tus ideas. Conserva esta referencia; no se ha reservado nada."
                )}
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
