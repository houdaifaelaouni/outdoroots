import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { composeItinerary } from "@/lib/itinerary";
import { useLocale } from "@/hooks/useLocale";
import { activityName, regionName } from "@/data/outdooroots";
import {
  destinations,
  getDestinationById,
  getActivityById,
  getAccommodationById,
} from "@/data/destinations";

const emptySelection = () =>
  destinations.map((d) => ({
    id: d.id,
    days: 0,
    activities: [],
    accommodation: null,
    customAccommodation: "",
  }));

const emptyContact = { name: "", email: "", phone: "", notes: "" };

export function usePackageBuilder() {
  const { language } = useLocale();
  const initialBrief = { trip_type: "personal", organization: "", flexible_window: "", desired_duration: null, party_composition: "", budget: null, budget_basis: "per_person", interests: [], pace: "balanced", experience: "", comfort: "", accessibility: "", goals: "", requirements: "", source: new URLSearchParams(window.location.search).get("ref")?.slice(0, 200) || "direct" };
  const [brief, setBrief] = useState(initialBrief);
  const [activeTab, setActiveTab] = useState("patagonia");
  const [packageName, setPackageName] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDestinations, setSelectedDestinations] = useState(emptySelection());
  const [contactInfo, setContactInfo] = useState(emptyContact);
  const [submitting, setSubmitting] = useState(false);

  const breakdown = useMemo(
    () =>
      selectedDestinations
        .filter((d) => d.days > 0)
        .map((dest, index, active) => {
          const destination = getDestinationById(dest.id);
          const nights = Math.max(0, dest.days - (index === active.length - 1 ? 1 : 0));
          const accommodation =
            dest.accommodation && dest.accommodation !== "custom"
              ? getAccommodationById(dest.id, dest.accommodation)
              : null;
          const activities = dest.activities
            .map((aid) => getActivityById(dest.id, aid))
            .filter(Boolean)
            .map((a) => ({ ...a, name: activityName(dest.id, a, language), basis: a.id === "private-guide" ? "group" : "person" }));
          const activitiesCost = brief.trip_type === "group" ? 0 : activities.reduce((s, a) => s + (a.price ?? 0) * (a.basis === "group" ? 1 : travelers), 0);
          const accommodationCost = accommodation && brief.trip_type !== "group"
            ? accommodation.price * nights * travelers
            : 0;
          return {
            id: dest.id,
            name: regionName(destination.id, language),
            days: dest.days,
            nights,
            activities,
            accommodation,
            customAccommodation: dest.customAccommodation,
            activitiesCost,
            accommodationCost,
            subtotal: activitiesCost + accommodationCost,
          };
        }),
    [selectedDestinations, travelers, language, brief.trip_type]
  );

  const subtotal = breakdown.reduce((s, b) => s + b.subtotal, 0);
  const tax = 0;
  const grandTotal = subtotal + tax;
  const totalDays = selectedDestinations.reduce((s, d) => s + d.days, 0);
  const totalActivities = breakdown.reduce((s, d) => s + d.activities.length, 0);
  const itinerary = useMemo(() => composeItinerary(breakdown, startDate, language), [breakdown, startDate, language]);
  const dateMismatch = Boolean(endDate && itinerary.days.length && startDate &&
    format(endDate, "yyyy-MM-dd") !== itinerary.days[itinerary.days.length - 1].date);

  const handleDaysChange = useCallback((destId, days) => {
    setSelectedDestinations((prev) =>
      prev.map((dest) =>
        dest.id === destId ? { ...dest, days: Math.min(14, Math.max(0, days)) } : dest
      )
    );
  }, []);

  const handleActivityToggle = useCallback((destId, activityId) => {
    setSelectedDestinations((prev) =>
      prev.map((dest) => {
        if (dest.id !== destId) return dest;
        const next = dest.activities.includes(activityId)
          ? dest.activities.filter((id) => id !== activityId)
          : [...dest.activities, activityId];
        return { ...dest, activities: next };
      })
    );
  }, []);

  const handleAccommodationSelect = useCallback((destId, accId) => {
    setSelectedDestinations((prev) =>
      prev.map((dest) =>
        dest.id === destId
          ? { ...dest, accommodation: accId, ...(accId !== "custom" ? { customAccommodation: "" } : {}) }
          : dest
      )
    );
  }, []);

  const handleCustomAccommodation = useCallback((destId, value) => {
    setSelectedDestinations((prev) =>
      prev.map((dest) => (dest.id === destId ? { ...dest, customAccommodation: value } : dest))
    );
  }, []);

  const getNights = useCallback((destId) => breakdown.find((d) => d.id === destId)?.nights || 0, [breakdown]);
  const moveDestination = (id, direction) => setSelectedDestinations((prev) => {
    const next = [...prev];
    const index = next.findIndex((d) => d.id === id);
    const target = index + direction;
    if (target < 0 || target >= next.length) return prev;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  const loadSignature = (signature) => {
    setPackageName(signature.title[language === "es" ? 1 : 0]);
    setBrief((prev) => ({ ...prev, trip_type: "personal" }));
    setTravelers((prev) => Math.min(30, prev));
    setSelectedDestinations(emptySelection().map((d) => d.id === signature.id ? { ...d, days: signature.days, activities: signature.activities } : d));
    setActiveTab(signature.id);
  };

  const reset = useCallback(() => {
    setPackageName("");
    setTravelers(2);
    setStartDate(null);
    setEndDate(null);
    setSelectedDestinations(emptySelection());
    setContactInfo(emptyContact);
    setActiveTab("patagonia");
  }, []);

  const loadSample = useCallback(() => {
    setPackageName("Outdooroots · Five chapters");
    setBrief((prev) => ({ ...prev, trip_type: "personal" }));
    setTravelers(2);
    setSelectedDestinations([
      {
        id: "patagonia",
        days: 7,
        activities: ["torres-del-paine", "grey-glacier", "private-guide"],
        accommodation: "tierra-patagonia",
        customAccommodation: "",
      },
      {
        id: "atacama",
        days: 5,
        activities: ["valle-de-la-luna", "stargazing", "alma-observatory"],
        accommodation: "tierra-atacama",
        customAccommodation: "",
      },
      {
        id: "santiago",
        days: 3,
        activities: ["city-tour", "borago-dinner", "maipo-wine"],
        accommodation: "singular-santiago",
        customAccommodation: "",
      },
      {
        id: "easter-island",
        days: 4,
        activities: ["tongariki-sunrise", "rano-raraku", "anakena-beach"],
        accommodation: "explora-rapa-nui",
        customAccommodation: "",
      },
      {
        id: "lake-district",
        days: 3,
        activities: ["osorno-volcano", "petrohue-falls", "llanquihue-kayak"],
        accommodation: "hotel-awa",
        customAccommodation: "",
      },
    ]);
  }, []);

  const buildPayload = useCallback(
    () => ({
      package_name: packageName || (language === "es" ? "Mi aventura Outdooroots" : "My Outdooroots adventure"),
      language,
      brief,
      travelers,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
      itinerary: itinerary.days,
      unscheduled_activities: itinerary.unscheduled,
      total_days: totalDays,
      subtotal,
      tax,
      total_price: grandTotal,
      destinations: breakdown.map((b) => ({
        id: b.id,
        name: b.name,
        days: b.days,
        accommodation:
          b.accommodation?.name ||
          (b.customAccommodation ? b.customAccommodation : (language === "es" ? "Estadía por definir · cotización requerida" : "Stay to be arranged · quote required")),
        activities: b.activities.map((a) => a.name),
        subtotal: b.subtotal,
      })),
      contact: contactInfo,
    }),
    [packageName, travelers, startDate, endDate, totalDays, subtotal, tax, grandTotal, breakdown, contactInfo, itinerary, brief, language]
  );

  return {
    brief, setBrief, moveDestination, loadSignature,
    activeTab,
    setActiveTab,
    packageName,
    setPackageName,
    travelers,
    setTravelers,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedDestinations,
    contactInfo,
    setContactInfo,
    submitting,
    setSubmitting,
    breakdown,
    subtotal,
    tax,
    grandTotal,
    totalDays,
    itinerary,
    dateMismatch,
    totalActivities,
    handleDaysChange,
    handleActivityToggle,
    handleAccommodationSelect,
    handleCustomAccommodation,
    getNights,
    reset,
    loadSample,
    buildPayload,
  };
}
