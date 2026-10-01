import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BriefField, BriefSelect } from "@/components/builder/AdventureBrief";
import { formatCurrency } from "@/data/destinations";
import { QuoteEditor } from "@/components/QuoteEditor";

export const STAGES = ["new", "contacted", "proposal_sent", "confirmed", "lost", "archived"];
export const stageOf = (b) => (b.status === "pending" ? "new" : b.status);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STAGE_COLORS = {
  new: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  contacted: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  proposal_sent: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  lost: "bg-red-500/15 text-red-400 border-red-500/30",
  archived: "bg-[#20252E] text-[#9EA6B5] border-[#262B35]",
};

export const InquiryCard = ({ inquiry: b, token, onSaved }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [workflow, setWorkflow] = useState({
    status: stageOf(b),
    internal_notes: b.internal_notes || "",
    next_action: b.next_action || "",
    follow_up_date: b.follow_up_date || "",
    review_reason: b.review_reason || "",
    lost_reason: b.lost_reason || "",
  });
  const update = (key, value) => setWorkflow((p) => ({ ...p, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await axios.patch(`${API}/bookings/${b.id}`, { ...workflow, follow_up_date: workflow.follow_up_date || null }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Inquiry updated");
      onSaved();
    } catch (e) {
      toast.error(typeof e.response?.data?.detail === "string" ? e.response.data.detail : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article data-testid={`booking-card-${b.id}`} className="bg-[#181B22] border border-[#262B35] rounded-xl p-5 sm:p-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="eyebrow">{b.reference || b.id} · {b.brief?.trip_type || "personal"}</p>
          <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-2">{b.package_name}</h3>
          <p className="text-xs text-[#9EA6B5] mt-2">
            {b.contact.name} · {b.contact.email} · {b.travelers} travelers · {b.total_days} days
          </p>
        </div>
        <div className="text-sm">
          <span data-testid={`inquiry-stage-${b.id}`} className={`rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${STAGE_COLORS[stageOf(b)] || STAGE_COLORS.new}`}>
            {stageOf(b).replaceAll("_", " ")}
          </span>
          <p data-testid={`inquiry-estimate-${b.id}`} className="mt-3 font-mono text-white">
            {b.brief?.trip_type === "group" ? "Quote required" : `${formatCurrency(b.total_price)} example`}
          </p>
          <p className="text-xs text-[#9EA6B5] mt-1">{b.created_at?.slice(0, 10)}</p>
        </div>
      </div>

      <button
        data-testid={`booking-expand-${b.id}`}
        className="mt-4 text-sm text-[#FF3B30] hover:text-[#E02E24] font-semibold uppercase tracking-wider transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close workspace" : "Review inquiry"}
      </button>

      {open && (
        <div className="mt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-3">Traveler Brief</h4>
              <dl data-testid={`inquiry-brief-${b.id}`} className="text-xs space-y-2 text-[#9EA6B5]">
                {Object.entries(b.brief || {}).map(([key, value]) => (
                  <div key={key}>
                    <dt className="inline font-semibold text-white">{key.replaceAll("_", " ")}: </dt>
                    <dd className="inline break-words">
                      {Array.isArray(value) ? value.join(", ") || "Not specified" : value ?? "Not specified"}
                      {key === "budget" && value != null ? " EUR" : ""}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-[#9EA6B5] mt-3">Dates: {b.start_date?.slice(0, 10) || "Flexible"} → {b.end_date?.slice(0, 10) || "Flexible"}</p>
              {b.contact.phone && <p className="text-xs text-[#9EA6B5] mt-2">Phone: {b.contact.phone}</p>}
              <p className="text-xs text-[#9EA6B5] mt-3">Notes: {b.contact.notes || "None"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-3">Route & Estimate</h4>
              {b.destinations.map((d) => (
                <div key={d.id} className="mb-4 text-xs">
                  <p className="font-semibold text-white">{d.name} · {d.days} days</p>
                  <p className="text-[#9EA6B5] mt-1">{d.accommodation}</p>
                  <p className="text-[#9EA6B5] mt-1">{d.activities.join(" · ") || "Experiences to discuss"}</p>
                  <p className="font-mono text-white mt-1">{formatCurrency(d.subtotal)}</p>
                </div>
              ))}
              <p className="text-xs text-[#9EA6B5]">Subtotal {formatCurrency(b.subtotal)} · Tax {formatCurrency(b.tax)}</p>
              <p className="planning-note mt-3">All availability and transfers require review.</p>
              <details data-testid={`inquiry-timeline-${b.id}`}>
                <summary data-testid={`inquiry-timeline-toggle-${b.id}`} className="text-sm cursor-pointer text-[#FF3B30] mt-3">
                  Daily composition ({b.itinerary?.length || 0} days)
                </summary>
                <ol className="mt-3 text-xs space-y-2 text-[#9EA6B5]">
                  {b.itinerary?.map((day) => (
                    <li key={day.day}>
                      Day {day.day} {day.date || ""} · {day.destination}: {day.activities.map((a) => a.name).join(" / ") || "Open"}{day.overnight ? ` · Night: ${day.accommodation}` : ""}
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          </div>

          {/* Workflow form */}
          <form data-testid={`workflow-form-${b.id}`} onSubmit={save} className="border-t border-[#262B35] pt-5 space-y-4">
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider">Team Follow-up · Private</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <BriefField id={`booking-status-select-${b.id}`} label="Pipeline stage">
                <BriefSelect id={`booking-status-select-${b.id}`} value={workflow.status} onChange={(v) => update("status", v)} options={STAGES.map((s) => [s, s.replaceAll("_", " ")])} />
              </BriefField>
              <BriefField id={`follow-up-${b.id}`} label="Follow-up date">
                <Input data-testid={`follow-up-${b.id}`} id={`follow-up-${b.id}`} type="date" value={workflow.follow_up_date} onChange={(e) => update("follow_up_date", e.target.value)} className="bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50" />
              </BriefField>
            </div>
            {[
              ["next_action", "Next action"],
              ["internal_notes", "Internal notes (private)"],
              ["review_reason", "Review reason"],
              ["lost_reason", "Lost reason"],
            ].map(([key, label]) => (
              <BriefField key={key} id={`${key}-${b.id}`} label={label}>
                <Textarea
                  data-testid={`${key}-${b.id}`}
                  id={`${key}-${b.id}`}
                  required={key === "lost_reason" && workflow.status === "lost"}
                  value={workflow[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50"
                />
              </BriefField>
            ))}
            <button
              data-testid={`workflow-save-${b.id}`}
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E02E24] transition-colors uppercase tracking-wider disabled:opacity-40"
            >
              {busy ? "Saving..." : "Save Follow-up"}
            </button>
          </form>

          <QuoteEditor inquiry={b} token={token} onSaved={onSaved} />
        </div>
      )}
    </article>
  );
};
