import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ArrowDown, BedDouble, ChevronDown, Compass, AlertTriangle } from "lucide-react";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/ui/button";

const TimelineDay = ({ day }) => {
  const [open, setOpen] = useState(false);
  const free = 1 - day.activities.reduce((sum, a) => sum + a.duration, 0);
  return (
    <li data-testid={`timeline-day-card-${day.day}`} className="relative pl-7 pb-5 last:pb-0">
      <span className="absolute -left-[4px] top-5 h-2 w-2 rounded-full bg-[#C87D55] ring-4 ring-[#FDFBF7]" />
      <button data-testid={`timeline-day-toggle-${day.day}`} aria-expanded={open} aria-controls={`day-detail-${day.day}`} onClick={() => setOpen(!open)} className="w-full text-left rounded-lg p-3 -ml-3 hover:bg-[#F6F2EB] focus-visible:outline focus-visible:outline-[#1E3E62] transition-colors">
        <span className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#5C656E]">Day {String(day.day).padStart(2, "0")}{day.date && ` · ${format(parseISO(day.date), "EEE, d MMM")}`}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-[#5C656E] transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="block mt-2 text-sm text-[#0B192C] leading-relaxed">{day.activities.map((a) => a.name).join(" · ") || "A day at your own pace"}</span>
        {free === 0.5 && <span className="block text-xs text-[#5C656E] mt-1">With a half-day to wander</span>}
      </button>
      {open && <div id={`day-detail-${day.day}`} data-testid={`timeline-day-detail-${day.day}`} className="mt-2 text-xs text-[#5C656E] leading-relaxed space-y-2">
        {day.activities.map((a, i) => <p key={a.name} data-testid={`timeline-activity-${day.day}-${i}`}>{a.duration === 1 ? "Full day" : "Half day"} · {a.name}</p>)}
        {free > 0 && <p>Unscheduled time for exploring, resting, or arranging transfers with your travel designer.</p>}
        <p className="flex items-start gap-2"><BedDouble className="h-3.5 w-3.5 shrink-0 mt-0.5" />{day.overnight ? day.accommodation : "Final day in this chapter · onward travel to be arranged"}</p>
      </div>}
    </li>
  );
};

export const ItineraryTimeline = ({ builder }) => {
  const { itinerary, totalDays, dateMismatch, endDate } = builder;
  return (
    <section data-testid="itinerary-timeline-container" id="itinerary" className="mt-12 pt-10 border-t border-[#E6DFD5] scroll-mt-24">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C87D55] mb-3">Your journey, unfolding</p><h2 className="font-serif text-lg text-[#0B192C]">One day. A thousand possibilities.</h2></div>
        <span data-testid="timeline-day-count" className="font-mono text-xs rounded-full border border-[#E6DFD5] px-3 py-2 whitespace-nowrap">{totalDays} days</span>
      </div>
      <p data-testid="timeline-disclaimer" className="text-xs text-[#5C656E] leading-relaxed max-w-xl mb-8">A suggested rhythm, not a confirmed schedule. Your travel designer will refine the order, transfers, lodging nights, and availability. Flights and inter-region transfers are not included in this estimate.</p>
      {dateMismatch && <p data-testid="timeline-date-warning" role="status" className="mb-6 p-4 rounded-lg border border-[#C87D55]/30 bg-[#F6F2EB] text-xs leading-relaxed">Your {totalDays}-day schedule ends {format(parseISO(itinerary.days[itinerary.days.length - 1].date), "d MMM yyyy")}; your preferred return is {format(endDate, "d MMM yyyy")}. Adjust your days or dates, or ask our team to reconcile them.</p>}
      {itinerary.unscheduled.length > 0 && <div data-testid="timeline-capacity-warning" role="status" className="mb-6 p-4 border border-[#C87D55]/40 rounded-lg bg-[#F6F2EB] text-xs leading-relaxed">
        <p className="font-medium flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-[#C87D55]" />A little more room to explore</p>
        <p>These experiences are included in your estimate but need more days. Add time or remove an experience before finalizing with our team.</p>
        <ul className="mt-2 space-y-1">{itinerary.unscheduled.map((a, i) => <li data-testid={`timeline-unscheduled-${i}`} key={`${a.destination_id}-${a.name}`}>{a.destination} · {a.name}</li>)}</ul>
      </div>}
      {!totalDays && <div data-testid="timeline-empty" className="border border-dashed border-[#E6DFD5] rounded-xl p-8 text-center"><Compass className="h-6 w-6 text-[#C87D55] mx-auto mb-3" /><p className="text-sm text-[#5C656E]">Add days to a chapter and your journey will unfold here.</p></div>}
      {destinations.filter((d) => itinerary.days.some((day) => day.destination_id === d.id)).map((dest) => {
        const days = itinerary.days.filter((day) => day.destination_id === dest.id);
        return <motion.div key={dest.id} data-testid={`timeline-chapter-${dest.id}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 rounded-xl border border-[#E6DFD5] overflow-hidden bg-white">
          <div className="relative px-6 py-8 bg-[#0B192C] text-[#FDFBF7] overflow-hidden">
            <img src={dest.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="relative"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FDFBF7]/80 mb-2">Chapter {dest.chapter} · Days {days[0].day}–{days[days.length - 1].day}</p><h3 className="font-serif text-3xl">{dest.name}</h3><p data-testid={`timeline-lodge-${dest.id}`} className="text-xs mt-3 text-[#FDFBF7]/80">{days[0].accommodation} · {Math.max(0, days.length - 1)} nights estimated</p></div>
          </div>
          <ol className="border-l border-[#E6DFD5] ml-7 my-6 mr-5">{days.map((day) => <TimelineDay key={`${dest.id}-${day.day}`} day={day} />)}</ol>
        </motion.div>;
      })}
      {totalDays > 0 && <Button data-testid="timeline-booking-link" variant="outline" className="rounded-full gap-2" onClick={() => document.getElementById("booking-contact")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Love this direction? Send it to our team <ArrowDown className="h-4 w-4" /></Button>}
    </section>
  );
};
