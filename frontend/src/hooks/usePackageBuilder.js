import { useState, useMemo, useCallback } from "react";
import {
  destinations,
  getDestinationById,
  getActivityById,
  getAccommodationById,
  TAX_RATE,
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
        .map((dest) => {
          const destination = getDestinationById(dest.id);
          const nights = Math.max(0, dest.days - 1);
          const accommodation =
            dest.accommodation && dest.accommodation !== "custom"
              ? getAccommodationById(dest.id, dest.accommodation)
              : null;
          const activities = dest.activities
            .map((aid) => getActivityById(dest.id, aid))
            .filter(Boolean);
          const baseCost = destination.basePrice * dest.days * travelers;
          const activitiesCost = activities.reduce((s, a) => s + a.price * travelers, 0);
          const accommodationCost = accommodation
            ? accommodation.price * nights * travelers
            : 0;
          return {
            id: dest.id,
            name: destination.name,
            days: dest.days,
            nights,
            activities,
            accommodation,
            customAccommodation: dest.customAccommodation,
            baseCost,
            activitiesCost,
            accommodationCost,
            subtotal: baseCost + activitiesCost + accommodationCost,
          };
        }),
    [selectedDestinations, travelers]
  );

  const subtotal = breakdown.reduce((s, b) => s + b.subtotal, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + tax;
  const totalDays = selectedDestinations.reduce((s, d) => s + d.days, 0);
  const totalActivities = selectedDestinations.reduce((s, d) => s + d.activities.length, 0);

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

  const getNights = useCallback(
    (destId) => {
      const dest = selectedDestinations.find((d) => d.id === destId);
      return dest ? Math.max(0, dest.days - 1) : 0;
    },
    [selectedDestinations]
  );

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
    setPackageName("Premium Chile Experience");
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
    ]);
  }, []);

  const buildPayload = useCallback(
    () => ({
      package_name: packageName || `Custom Chile Package — ${totalDays} Days`,
      travelers,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
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
          (b.customAccommodation ? `Custom: ${b.customAccommodation}` : "Not selected"),
        activities: b.activities.map((a) => a.name),
        subtotal: b.subtotal,
      })),
      contact: contactInfo,
    }),
    [packageName, travelers, startDate, endDate, totalDays, subtotal, tax, grandTotal, breakdown, contactInfo]
  );

  return {
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
