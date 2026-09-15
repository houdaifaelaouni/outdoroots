import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefField, BriefSelect } from "@/components/builder/AdventureBrief";
import { formatCurrency } from "@/data/destinations";
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const blankLine = () => ({ description: "", category: "experience", basis: "person", quantity: 1, cost_clp: "", selling_clp: "", margin_percent: "" });
export const QuoteEditor = ({ inquiry, token, onSaved }) => {
  const [quote, setQuote] = useState(inquiry.quote || { lines: [blankLine()], clp_per_eur: "", exchange_rate_date: "", valid_until: "", tax_percent: "", tax_label: "", service_fee_clp: "", service_label: "", inclusions: "", exclusions: "", outstanding_checks: "" });
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const update = (key, value) => setQuote((prev) => ({ ...prev, [key]: value }));
  const lineUpdate = (i, key, value) => update("lines", quote.lines.map((line, n) => n === i ? { ...line, [key]: value } : line));
  const id = inquiry.id;
  const save = async (event) => {
    event.preventDefault(); setBusy(true);
    const numberOrNull = (value) => value === "" || value == null ? null : Number(value);
    const payload = { ...quote, approved, clp_per_eur: Number(quote.clp_per_eur), tax_percent: numberOrNull(quote.tax_percent), service_fee_clp: Number(quote.service_fee_clp || 0), lines: quote.lines.map((l) => ({ ...l, quantity: Number(l.quantity), cost_clp: Number(l.cost_clp), selling_clp: numberOrNull(l.selling_clp), margin_percent: numberOrNull(l.margin_percent) })) };
    try { await axios.put(`${API}/bookings/${id}/quote`, payload, { headers: { Authorization: `Bearer ${token}` } }); toast.success("Reviewed quote saved"); onSaved(); }
    catch (e) { const d = e.response?.data?.detail; toast.error(typeof d === "string" ? d : d?.[0]?.msg || "Check prices, rate, validity and required fields"); }
    finally { setBusy(false); }
  };
  const download = async () => {
    try { const { data } = await axios.get(`${API}/bookings/${id}/proposal.pdf`, { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }); const url = URL.createObjectURL(data); const a = document.createElement("a"); a.href = url; a.download = "outdooroots-reviewed-proposal.pdf"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    catch { toast.error("Could not download the reviewed proposal"); }
  };
  return <form data-testid={`quote-editor-${id}`} onSubmit={save} className="border-t border-[#E6DFD5] mt-6 pt-6 space-y-5"><div><h3 className="font-serif text-2xl">Commercial review</h3><p className="text-xs text-[#5C656E] mt-2">Private: supplier costs and gross margins stay in this console. Quantities are explicit billing units, not automatically multiplied by party size. Enter approved CLP costs and a selling price OR a gross margin. Check package inclusions to avoid double charging.</p></div>
    {quote.lines.map((line, i) => <div key={i} className="p-4 bg-[#F6F2EB] rounded-lg space-y-3"><BriefField id={`quote-description-${id}-${i}`} label={`Line ${i + 1} · customer-facing description`}><Input data-testid={`quote-description-${id}-${i}`} id={`quote-description-${id}-${i}`} required maxLength={180} value={line.description} onChange={(e) => lineUpdate(i, "description", e.target.value)} /></BriefField><div className="grid sm:grid-cols-3 gap-3">{[["category", ["accommodation", "experience", "guide", "transport", "other"]], ["basis", ["person", "group", "room_night", "person_night", "day", "item"]]].map(([key, options]) => <BriefField key={key} id={`quote-${key}-${id}-${i}`} label={key === "basis" ? "Charging basis" : "Category"}><BriefSelect id={`quote-${key}-${id}-${i}`} value={line[key]} options={options.map((v) => [v, v.replaceAll("_", " ")])} onChange={(v) => lineUpdate(i, key, v)} /></BriefField>)}<BriefField id={`quote-quantity-${id}-${i}`} label="Billable quantity"><Input data-testid={`quote-quantity-${id}-${i}`} id={`quote-quantity-${id}-${i}`} type="number" min="0.01" step="any" required value={line.quantity} onChange={(e) => lineUpdate(i, "quantity", e.target.value)} /></BriefField></div><div className="grid sm:grid-cols-3 gap-3">{[["cost_clp", "Unit cost · CLP (private)"], ["selling_clp", "Unit selling price · CLP"], ["margin_percent", "OR gross margin % (private)"]].map(([key, label]) => <BriefField key={key} id={`quote-${key}-${id}-${i}`} label={label}><Input data-testid={`quote-${key}-${id}-${i}`} id={`quote-${key}-${id}-${i}`} type="number" min="0" max={key === "margin_percent" ? 99.99 : undefined} step="any" required={key === "cost_clp"} value={line[key] ?? ""} onChange={(e) => lineUpdate(i, key, e.target.value)} /></BriefField>)}</div><Button data-testid={`quote-remove-line-${id}-${i}`} type="button" variant="ghost" size="sm" disabled={quote.lines.length === 1} onClick={() => update("lines", quote.lines.filter((_, n) => n !== i))}>Remove line</Button></div>)}
    <Button data-testid={`quote-add-line-${id}`} type="button" variant="outline" disabled={quote.lines.length >= 40} onClick={() => update("lines", [...quote.lines, blankLine()])}>Add commercial line</Button>
    <div className="grid sm:grid-cols-3 gap-4">{[["clp_per_eur", "Approved CLP per 1 EUR", "number"], ["exchange_rate_date", "Exchange-rate approval date", "date"], ["valid_until", "Quote valid until", "date"], ["tax_percent", "Tax % (only if applicable)", "number"], ["tax_label", "Tax treatment label", "text"], ["service_fee_clp", "Service fee · CLP (optional)", "number"], ["service_label", "Service fee label", "text"]].map(([key, label, type]) => <BriefField key={key} id={`quote-${key}-${id}`} label={label}><Input data-testid={`quote-${key}-${id}`} id={`quote-${key}-${id}`} type={type} step="any" min={type === "number" ? "0" : undefined} required={["clp_per_eur", "exchange_rate_date", "valid_until"].includes(key)} value={quote[key] ?? ""} onChange={(e) => update(key, e.target.value)} /></BriefField>)}</div>
    <p className="text-xs text-[#5C656E]">No live exchange feed or default rate. Configured tax is calculated on selling subtotal plus service fee; use only when this treatment is appropriate.</p>
    {[["inclusions", "Customer-facing inclusions"], ["exclusions", "Customer-facing exclusions"], ["outstanding_checks", "Customer-facing outstanding availability / cost checks"]].map(([key, label]) => <BriefField key={key} id={`quote-${key}-${id}`} label={label}><Textarea data-testid={`quote-${key}-${id}`} id={`quote-${key}-${id}`} required={key !== "outstanding_checks"} maxLength={1000} value={quote[key]} onChange={(e) => update(key, e.target.value)} /></BriefField>)}
    <label className="flex gap-3 items-start text-xs"><Checkbox data-testid={`quote-approved-${id}`} checked={approved} onCheckedChange={setApproved} /><span>I have reviewed the costs, quantities, inclusions, exchange rate, tax treatment and quote validity.</span></label>
    <div className="flex flex-wrap gap-3 items-center"><Button data-testid={`quote-save-${id}`} disabled={!approved || busy} type="submit">{busy ? "Saving…" : "Save reviewed quote"}</Button>{inquiry.quote_summary && <><span data-testid={`quote-total-${id}`} className="font-mono text-sm">{formatCurrency(inquiry.quote_summary.total_eur)} · valid to {inquiry.quote_summary.valid_until}</span><Button data-testid={`quote-pdf-${id}`} variant="outline" type="button" onClick={download}>Download saved proposal PDF</Button></>}</div>
  </form>;
};
