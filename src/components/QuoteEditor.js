import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefField, BriefSelect } from "@/components/builder/AdventureBrief";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const blankLine = () => ({ description: "", category: "experience", basis: "person", quantity: 1, cost_clp: "", selling_clp: "", margin_percent: "" });

export const QuoteEditor = ({ inquiry, token, onSaved }) => {
  const [quote, setQuote] = useState(inquiry.quote || {
    lines: [blankLine()],
    clp_per_eur: "", exchange_rate_date: "", valid_until: "", tax_percent: "", tax_label: "",
    service_fee_clp: "", service_label: "", inclusions: "", exclusions: "", outstanding_checks: "",
  });
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const update = (key, value) => setQuote((prev) => ({ ...prev, [key]: value }));
  const lineUpdate = (i, key, value) => update("lines", quote.lines.map((line, n) => (n === i ? { ...line, [key]: value } : line)));
  const id = inquiry.id;

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    const numberOrNull = (v) => (v === "" || v == null ? null : Number(v));
    const payload = {
      ...quote, approved, clp_per_eur: Number(quote.clp_per_eur), tax_percent: numberOrNull(quote.tax_percent),
      service_fee_clp: Number(quote.service_fee_clp || 0),
      lines: quote.lines.map((l) => ({ ...l, quantity: Number(l.quantity), cost_clp: Number(l.cost_clp), selling_clp: numberOrNull(l.selling_clp), margin_percent: numberOrNull(l.margin_percent) })),
    };
    try {
      await axios.put(`${API}/bookings/${id}/quote`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Quote saved");
      onSaved();
    } catch (e) {
      const d = e.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Check required fields");
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    try {
      const { data } = await axios.get(`${API}/bookings/${id}/proposal.pdf`, { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url; a.download = "outdooroots-reviewed-proposal.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Could not download proposal");
    }
  };

  const inputCls = "bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50";
  const textareaCls = "bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50";

  return (
    <form data-testid={`quote-editor-${id}`} onSubmit={save} className="border-t border-[#262B35] mt-6 pt-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white">Commercial Review</h3>
        <p className="text-xs text-[#9EA6B5] mt-2">
          Private: supplier costs and margins stay in this console. Enter CLP costs and a selling price OR gross margin.
        </p>
      </div>

      {quote.lines.map((line, i) => (
        <div key={i} className="p-4 bg-[#121418] border border-[#262B35] rounded-lg space-y-3">
          <BriefField id={`quote-description-${id}-${i}`} label={`Line ${i + 1} · description`}>
            <Input data-testid={`quote-description-${id}-${i}`} id={`quote-description-${id}-${i}`} required maxLength={180} value={line.description} onChange={(e) => lineUpdate(i, "description", e.target.value)} className={inputCls} />
          </BriefField>
          <div className="grid sm:grid-cols-3 gap-3">
            {[["category", ["accommodation", "experience", "guide", "transport", "other"]], ["basis", ["person", "group", "room_night", "person_night", "day", "item"]]].map(([key, options]) => (
              <BriefField key={key} id={`quote-${key}-${id}-${i}`} label={key === "basis" ? "Basis" : "Category"}>
                <BriefSelect id={`quote-${key}-${id}-${i}`} value={line[key]} options={options.map((v) => [v, v.replaceAll("_", " ")])} onChange={(v) => lineUpdate(i, key, v)} />
              </BriefField>
            ))}
            <BriefField id={`quote-quantity-${id}-${i}`} label="Quantity">
              <Input data-testid={`quote-quantity-${id}-${i}`} id={`quote-quantity-${id}-${i}`} type="number" min="0.01" step="any" required value={line.quantity} onChange={(e) => lineUpdate(i, "quantity", e.target.value)} className={inputCls} />
            </BriefField>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[["cost_clp", "Cost CLP (private)"], ["selling_clp", "Selling CLP"], ["margin_percent", "OR margin % (private)"]].map(([key, label]) => (
              <BriefField key={key} id={`quote-${key}-${id}-${i}`} label={label}>
                <Input data-testid={`quote-${key}-${id}-${i}`} id={`quote-${key}-${id}-${i}`} type="number" min="0" max={key === "margin_percent" ? 99.99 : undefined} step="any" required={key === "cost_clp"} value={line[key] ?? ""} onChange={(e) => lineUpdate(i, key, e.target.value)} className={inputCls} />
              </BriefField>
            ))}
          </div>
          <button
            data-testid={`quote-remove-line-${id}-${i}`}
            type="button"
            disabled={quote.lines.length === 1}
            onClick={() => update("lines", quote.lines.filter((_, n) => n !== i))}
            className="text-xs text-[#9EA6B5] hover:text-white disabled:opacity-30 transition-colors"
          >
            Remove line
          </button>
        </div>
      ))}

      <button
        data-testid={`quote-add-line-${id}`}
        type="button"
        disabled={quote.lines.length >= 40}
        onClick={() => update("lines", [...quote.lines, blankLine()])}
        className="text-sm text-[#FF3B30] font-semibold uppercase tracking-wider hover:text-[#E02E24] transition-colors disabled:opacity-30"
      >
        + Add Line
      </button>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["clp_per_eur", "CLP per 1 EUR", "number"],
          ["exchange_rate_date", "Rate date", "date"],
          ["valid_until", "Valid until", "date"],
          ["tax_percent", "Tax %", "number"],
          ["tax_label", "Tax label", "text"],
          ["service_fee_clp", "Service fee CLP", "number"],
          ["service_label", "Fee label", "text"],
        ].map(([key, label, type]) => (
          <BriefField key={key} id={`quote-${key}-${id}`} label={label}>
            <Input
              data-testid={`quote-${key}-${id}`}
              id={`quote-${key}-${id}`}
              type={type}
              step="any"
              min={type === "number" ? "0" : undefined}
              required={["clp_per_eur", "exchange_rate_date", "valid_until"].includes(key)}
              value={quote[key] ?? ""}
              onChange={(e) => update(key, e.target.value)}
              className={inputCls}
            />
          </BriefField>
        ))}
      </div>

      {[["inclusions", "Inclusions"], ["exclusions", "Exclusions"], ["outstanding_checks", "Outstanding checks"]].map(([key, label]) => (
        <BriefField key={key} id={`quote-${key}-${id}`} label={label}>
          <Textarea data-testid={`quote-${key}-${id}`} id={`quote-${key}-${id}`} required={key !== "outstanding_checks"} maxLength={1000} value={quote[key]} onChange={(e) => update(key, e.target.value)} className={textareaCls} />
        </BriefField>
      ))}

      <label className="flex gap-3 items-start text-xs text-[#9EA6B5]">
        <Checkbox data-testid={`quote-approved-${id}`} checked={approved} onCheckedChange={setApproved} />
        <span>I have reviewed costs, quantities, inclusions, rate, tax and validity.</span>
      </label>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          data-testid={`quote-save-${id}`}
          disabled={!approved || busy}
          type="submit"
          className="px-5 py-2.5 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider disabled:opacity-40"
        >
          {busy ? "Saving..." : "Save Quote"}
        </button>
        {inquiry.quote_summary && (
          <>
            <span data-testid={`quote-total-${id}`} className="font-mono text-sm text-white">
              {new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(inquiry.quote_summary.total_eur)} · valid to {inquiry.quote_summary.valid_until}
            </span>
            <button
              data-testid={`quote-pdf-${id}`}
              type="button"
              onClick={download}
              className="text-sm text-[#FF3B30] font-semibold uppercase tracking-wider hover:text-[#E02E24] transition-colors"
            >
              Download Proposal PDF
            </button>
          </>
        )}
      </div>
    </form>
  );
};
