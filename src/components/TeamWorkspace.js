import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, destinations } from "@/data/destinations";
import { Input } from "@/components/ui/input";
import { BriefField, BriefSelect } from "@/components/builder/AdventureBrief";
import { InquiryCard, STAGES, stageOf } from "@/components/InquiryCard";

const countBy = (values) => values.reduce((all, value) => { all[value] = (all[value] || 0) + 1; return all; }, {});

const Distribution = ({ title, values, id }) => (
  <div data-testid={id} className="bg-[#181B22] border border-[#262B35] rounded-lg p-4">
    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{title}</h3>
    <div className="text-xs text-[#9EA6B5] space-y-2">
      {Object.entries(values).map(([label, count]) => (
        <p key={label} className="flex justify-between gap-3">
          <span className="break-words min-w-0">{label.replaceAll("_", " ")}</span>
          <span className="font-mono shrink-0 text-white">{count}</span>
        </p>
      ))}
      {!Object.keys(values).length && <p>No records yet</p>}
    </div>
  </div>
);

export const TeamWorkspace = ({ bookings, token, onReload, onLogout }) => {
  const [filters, setFilters] = useState({ search: "", stage: "all", destination: "all", type: "all", from: "", to: "" });
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const all = bookings || [];
  const today = new Date().toISOString().slice(0, 10);
  const filtered = all.filter((b) =>
    `${b.package_name} ${b.reference || b.id} ${b.contact.name} ${b.contact.email} ${b.brief?.organization || ""}`.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.stage === "all" || stageOf(b) === filters.stage) &&
    (filters.destination === "all" || b.destinations.some((d) => d.id === filters.destination)) &&
    (filters.type === "all" || (b.brief?.trip_type || "personal") === filters.type) &&
    (!filters.from || b.created_at.slice(0, 10) >= filters.from) &&
    (!filters.to || b.created_at.slice(0, 10) <= filters.to)
  );

  const overdue = all.filter((b) => b.follow_up_date && b.follow_up_date < today && !["confirmed", "lost", "archived"].includes(stageOf(b))).length;
  const contactTimes = all.filter((b) => b.first_contact_at).map((b) => (new Date(b.first_contact_at) - new Date(b.created_at)) / 3600000);
  const proposals = all.filter((b) => b.proposal_sent_at);
  const conversion = proposals.length ? `${Math.round(proposals.filter((b) => b.confirmed_at).length / proposals.length * 100)}%` : "--";
  const quoteValue = all.filter((b) => stageOf(b) === "confirmed" && b.quote_summary).reduce((sum, b) => sum + b.quote_summary.total_eur, 0);
  const season = (b) => {
    if (!b.start_date) return "Not specified";
    const month = Number(b.start_date.slice(5, 7));
    return [12, 1, 2].includes(month) ? "Summer (Dec-Feb)" : [3, 4, 5].includes(month) ? "Autumn (Mar-May)" : [6, 7, 8].includes(month) ? "Winter (Jun-Aug)" : "Spring (Sep-Nov)";
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#090A0C]">
      <header className="bg-[#121418] border-b border-[#262B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 flex flex-wrap gap-6 justify-between items-center">
          <div>
            <p className="text-lg font-extrabold uppercase tracking-tight text-white">Outdooroots</p>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-white mt-2">Inquiry Workspace</h1>
            <p className="text-xs text-[#9EA6B5] mt-3">Reviewed proposals. No automatic reservations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button data-testid="admin-refresh-button" onClick={onReload} className="px-4 py-2 text-sm border border-[#262B35] text-white rounded-lg hover:bg-[#20252E] transition-colors">
              Refresh
            </button>
            <button data-testid="admin-logout-button" onClick={onLogout} className="px-4 py-2 text-sm border border-[#262B35] text-white rounded-lg hover:bg-[#20252E] transition-colors">
              Sign out
            </button>
            <Link data-testid="admin-home-link" to="/" className="px-4 py-2 text-sm border border-[#262B35] text-white rounded-lg hover:bg-[#20252E] transition-colors">
              Visitor site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
          {[
            ["Inquiries", all.length, "admin-stat-total"],
            ["Overdue", overdue, "admin-stat-overdue"],
            ["Mean contact", contactTimes.length ? `${(contactTimes.reduce((a, c) => a + c, 0) / contactTimes.length).toFixed(1)}h` : "--", "admin-stat-contact-time"],
            ["Conversion", conversion, "admin-stat-conversion"],
            ["Confirmed value", formatCurrency(quoteValue), "admin-stat-confirmed-value"],
          ].map(([label, value, id]) => (
            <div key={id} className="bg-[#181B22] border border-[#262B35] rounded-lg p-5">
              <p data-testid={id} className="text-2xl font-extrabold text-white break-words">{bookings === null ? "--" : value}</p>
              <p className="text-xs text-[#9EA6B5] mt-2">{label}</p>
            </div>
          ))}
        </div>
        <p data-testid="analytics-disclaimer" className="text-xs text-[#9EA6B5]/60 mb-8">
          All-time records. Confirmed quote value is not collected revenue.
        </p>

        {/* Insights */}
        <details className="mb-10" data-testid="business-insights">
          <summary data-testid="business-insights-toggle" className="cursor-pointer text-lg font-bold uppercase tracking-tight text-white">
            Demand & Pipeline Insights
          </summary>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <Distribution title="Stage distribution" id="stage-distribution" values={Object.fromEntries(STAGES.map((s) => [s, all.filter((b) => stageOf(b) === s).length]))} />
            <Distribution title="Requested destinations" id="destination-distribution" values={countBy(all.flatMap((b) => b.destinations.map((d) => d.name)))} />
            <Distribution title="Seasons (Chile)" id="season-distribution" values={countBy(all.map(season))} />
            <Distribution title="Trip types" id="type-distribution" values={countBy(all.map((b) => b.brief?.trip_type || "personal"))} />
            <Distribution title="Inquiry sources" id="source-distribution" values={countBy(all.map((b) => b.brief?.source || "Not recorded"))} />
            <Distribution title="Budgets · EUR" id="budget-distribution" values={countBy(all.map((b) => b.brief?.budget != null ? `${formatCurrency(b.brief.budget)} ${b.brief.budget_basis === "total" ? "total" : "pp"}` : "Not specified"))} />
          </div>
        </details>

        {/* Filters */}
        <div data-testid="inquiry-filters" className="bg-[#121418] border border-[#262B35] rounded-xl p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
          <BriefField id="inquiry-search" label="Search">
            <Input data-testid="inquiry-search" id="inquiry-search" value={filters.search} onChange={(e) => update("search", e.target.value)} className="bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50" />
          </BriefField>
          {[
            ["stage", "Stage", STAGES.map((s) => [s, s.replaceAll("_", " ")])],
            ["destination", "Destination", destinations.map((d) => [d.id, d.name])],
            ["type", "Type", [["personal", "Personal"], ["group", "Group"]]],
          ].map(([key, label, options]) => (
            <BriefField key={key} id={`filter-${key}`} label={label}>
              <BriefSelect id={`filter-${key}`} value={filters[key]} onChange={(v) => update(key, v)} options={[["all", "All"], ...options]} />
            </BriefField>
          ))}
          {["from", "to"].map((key) => (
            <BriefField key={key} id={`filter-${key}`} label={`Received ${key}`}>
              <Input data-testid={`filter-${key}`} id={`filter-${key}`} type="date" value={filters[key]} onChange={(e) => update(key, e.target.value)} className="bg-[#20252E] border-[#262B35] text-white focus:border-[#FF3B30]/50" />
            </BriefField>
          ))}
          <button
            data-testid="clear-inquiry-filters"
            onClick={() => setFilters({ search: "", stage: "all", destination: "all", type: "all", from: "", to: "" })}
            className="text-sm text-[#9EA6B5] border border-[#262B35] rounded-lg px-4 py-2 hover:bg-[#20252E] transition-colors self-end"
          >
            Clear filters
          </button>
        </div>

        <p data-testid="filtered-inquiry-count" className="text-xs text-[#9EA6B5] mb-5">{filtered.length} matching inquiries</p>

        <div data-testid="admin-bookings-list" className="space-y-5">
          {bookings === null && <p className="text-[#9EA6B5]">Loading inquiries...</p>}
          {bookings !== null && !filtered.length && <p data-testid="inquiries-empty" className="text-sm text-[#9EA6B5] py-8">No inquiries match these filters.</p>}
          {filtered.map((b) => <InquiryCard key={b.id} inquiry={b} token={token} onSaved={onReload} />)}
        </div>
      </main>
    </div>
  );
};
