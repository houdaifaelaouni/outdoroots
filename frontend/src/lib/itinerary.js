import { addDays, format } from "date-fns";

// One full-day or two half-day experiences per day. Transfer times are not assumed.
export function composeItinerary(breakdown, startDate, language = "en") {
  let offset = 0;
  const unscheduled = [];
  const days = breakdown.flatMap((chapter) => {
    const slots = Array.from({ length: chapter.days }, (_, index) => ({
      day: offset + index + 1,
      date: startDate ? format(addDays(startDate, offset + index), "yyyy-MM-dd") : null,
      destination_id: chapter.id,
      destination: chapter.name,
      accommodation: chapter.accommodation?.name || chapter.customAccommodation || (language === "es" ? "Estadía por definir · cotización requerida" : "Stay to be arranged · quote required"),
      overnight: offset + index < breakdown.reduce((sum, d) => sum + d.days, 0) - 1,
      activities: [],
    }));
    [...chapter.activities].sort((a, b) => b.duration - a.duration).forEach((activity, index) => {
      const preferred = Math.floor(index * chapter.days / chapter.activities.length);
      const ordered = [...slots.slice(preferred), ...slots.slice(0, preferred)];
      const slot = ordered.find((s) => s.activities.reduce((sum, a) => sum + a.duration, 0) + activity.duration <= 1);
      if (slot) slot.activities.push({ name: activity.name, duration: activity.duration });
      else unscheduled.push({ destination_id: chapter.id, destination: chapter.name, name: activity.name });
    });
    offset += chapter.days;
    return slots;
  });
  return { days, unscheduled };
}
