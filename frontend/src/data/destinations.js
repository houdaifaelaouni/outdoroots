import { Mountain, Sun, Building2, Wine, Camera, Star, Users, Globe } from "lucide-react";

export const TAX_RATE = 0.19;

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1546569397-ab326af881f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxwYXRhZ29uaWElMjBnbGFjaWVyJTIwbHV4dXJ5JTIwdHJhdmVsJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4OTQxMzgxN3ww&ixlib=rb-4.1.0&q=85",
  patagonia: "https://images.unsplash.com/photo-1493724798364-c4ca5e3f5fd3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHw0fHxwYXRhZ29uaWElMjBnbGFjaWVyJTIwbHV4dXJ5JTIwdHJhdmVsJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4OTQxMzgxN3ww&ixlib=rb-4.1.0&q=85",
  atacama: "https://images.unsplash.com/photo-1580413193140-8af6ffa819e1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHw0fHxhdGFjYW1hJTIwZGVzZXJ0JTIwY2hpbGUlMjBzdGFyZ2F6aW5nJTIwcmVzb3J0fGVufDB8fHx8MTc4OTQxMzgxN3ww&ixlib=rb-4.1.0&q=85",
  santiago: "https://images.unsplash.com/photo-1598202290788-28cabb2da6a7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxzYW50aWFnbyUyMGNoaWxlJTIwd2luZXJ5JTIwbHV4dXJ5JTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4OTQxMzgxN3ww&ixlib=rb-4.1.0&q=85",
};

export const destinations = [
  {
    id: "patagonia",
    chapter: "01",
    name: "Patagonia",
    icon: Mountain,
    tagline: "The edge of the world",
    description: "Iconic landscapes, glaciers, and luxury lodges",
    longDescription:
      "Granite towers rise over turquoise lakes while condors trace slow circles above the steppe. Patagonia is not a place you visit — it is a place that recalibrates you. Private estancias, glacier navigations, and evenings by the fire at lodges that define quiet luxury.",
    basePrice: 250,
    image: IMAGES.patagonia,
    activities: [
      { id: "torres-del-paine", name: "Torres del Paine Trek", price: 180, duration: 1, category: "Adventure", icon: Mountain },
      { id: "grey-glacier", name: "Grey Glacier Boat Tour", price: 150, duration: 0.5, category: "Nature", icon: Sun },
      { id: "horseback-riding", name: "Estancia Horseback Riding", price: 120, duration: 0.5, category: "Culture", icon: Building2 },
      { id: "private-guide", name: "Private Guide (Full Day)", price: 200, duration: 1, category: "Luxury", icon: Users },
      { id: "photography", name: "Photography Workshop", price: 100, duration: 0.5, category: "Experience", icon: Camera },
      { id: "spa-treatment", name: "Luxury Spa Treatment", price: 150, duration: 0.5, category: "Relaxation", icon: Star },
    ],
    accommodations: [
      { id: "tierra-patagonia", name: "Tierra Patagonia", price: 450, rating: 5, type: "Luxury Lodge" },
      { id: "explora", name: "Explora Patagonia", price: 500, rating: 5, type: "Adventure Lodge" },
      { id: "singular", name: "The Singular Patagonia", price: 400, rating: 5, type: "Historic Hotel" },
      { id: "cabo-de-hornos", name: "Hotel Cabo de Hornos", price: 250, rating: 4, type: "Boutique Hotel" },
    ],
  },
  {
    id: "atacama",
    chapter: "02",
    name: "Atacama Desert",
    icon: Sun,
    tagline: "Earth, unearthly",
    description: "Otherworldly landscapes, stargazing, and geysers",
    longDescription:
      "The driest desert on Earth holds salt lagoons the colour of glass, geysers that breathe at dawn, and the clearest night sky humanity has ever measured. Days end in ochre light; nights begin with a private astronomer and a telescope of your own.",
    basePrice: 200,
    image: IMAGES.atacama,
    activities: [
      { id: "valle-de-la-luna", name: "Valle de la Luna Sunset Tour", price: 120, duration: 0.5, category: "Nature", icon: Mountain },
      { id: "tatio-geysers", name: "Tatio Geysers at Sunrise", price: 150, duration: 1, category: "Adventure", icon: Sun },
      { id: "stargazing", name: "Private Astronomy Tour", price: 200, duration: 1, category: "Luxury", icon: Star },
      { id: "cejar-lagoon", name: "Cejar Lagoon & Flamingos", price: 100, duration: 0.5, category: "Nature", icon: Building2 },
      { id: "puritama", name: "Puritama Hot Springs", price: 130, duration: 0.5, category: "Relaxation", icon: Users },
      { id: "alma-observatory", name: "ALMA Observatory Private Tour", price: 250, duration: 1, category: "Experience", icon: Camera },
    ],
    accommodations: [
      { id: "tierra-atacama", name: "Tierra Atacama", price: 400, rating: 5, type: "Luxury Lodge" },
      { id: "awasi", name: "Awasi Atacama", price: 550, rating: 5, type: "Boutique Lodge" },
      { id: "nayara", name: "Nayara Tolar Grande", price: 350, rating: 4, type: "Desert Resort" },
    ],
  },
  {
    id: "santiago",
    chapter: "03",
    name: "Santiago & Central Chile",
    icon: Building2,
    tagline: "Wine, culture, altitude",
    description: "Culture, wine, and urban luxury",
    longDescription:
      "A capital cradled by the Andes, ringed by some of the oldest vines in the New World. Dine at a World's 50 Best table, wander Valparaíso's painted hills, and taste Maipo Valley cabernet at the estates that made it famous.",
    basePrice: 150,
    image: IMAGES.santiago,
    activities: [
      { id: "city-tour", name: "Santiago City Tour", price: 80, duration: 0.5, category: "Culture", icon: Building2 },
      { id: "borago-dinner", name: "Dinner at Boragó (World's 50 Best)", price: 250, duration: 0.5, category: "Luxury", icon: Wine },
      { id: "maipo-wine", name: "Maipo Valley Wine Tour", price: 180, duration: 1, category: "Experience", icon: Wine },
      { id: "valparaiso", name: "Valparaíso & Viña del Mar Tour", price: 150, duration: 1, category: "Culture", icon: Globe },
      { id: "concha-y-toro", name: "Concha y Toro Winery Visit", price: 120, duration: 0.5, category: "Experience", icon: Wine },
      { id: "sky-costanera", name: "Sky Costanera Observation Deck", price: 50, duration: 0.5, category: "Sightseeing", icon: Mountain },
    ],
    accommodations: [
      { id: "singular-santiago", name: "The Singular Santiago", price: 300, rating: 5, type: "Luxury Hotel" },
      { id: "lastarria", name: "Hotel Magnolia", price: 250, rating: 5, type: "Boutique Hotel" },
      { id: "w", name: "W Santiago", price: 220, rating: 4, type: "Modern Hotel" },
      { id: "cumbres", name: "Hotel Cumbres", price: 180, rating: 4, type: "Business Hotel" },
    ],
  },
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const getDestinationById = (id) => destinations.find((d) => d.id === id);

export const getActivityById = (destId, activityId) =>
  getDestinationById(destId)?.activities.find((a) => a.id === activityId);

export const getAccommodationById = (destId, accId) =>
  getDestinationById(destId)?.accommodations.find((a) => a.id === accId);
