import { Mountain, Sun, Building2, Wine, Camera, Star, Users, Globe, Waves, Trees } from "lucide-react";

export const TAX_RATE = 0.19;

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1558517286-6b7b81953cb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxwYXRhZ29uaWElMjB0cmVra2luZyUyMHRvcnJlcyUyMGRlbCUyMHBhaW5lJTIwZHJhbWF0aWMlMjBtb3VudGFpbnxlbnwwfHx8fDE3OTA4NDg4NjV8MA&ixlib=rb-4.1.0&q=85",
  patagonia: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwxfHxwYXRhZ29uaWElMjB0cmVra2luZyUyMHRvcnJlcyUyMGRlbCUyMHBhaW5lJTIwZHJhbWF0aWMlMjBtb3VudGFpbnxlbnwwfHx8fDE3OTA4NDg4NjV8MA&ixlib=rb-4.1.0&q=85",
  atacama: "https://images.unsplash.com/photo-1666668005104-6181e6723d19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxhdGFjYW1hJTIwZGVzZXJ0JTIwc3RhcmdhemluZyUyMG5pZ2h0JTIwc2t5JTIwY2hpbGV8ZW58MHx8fHwxNzkwODQ4ODczfDA&ixlib=rb-4.1.0&q=85",
  santiago: "https://images.unsplash.com/photo-1776855492307-617c4c91baef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxzYW50aWFnbyUyMGNoaWxlJTIwY2l0eSUyMGFuZGVzJTIwbW91bnRhaW4lMjB2aWV3fGVufDB8fHx8MTc5MDg0ODg3M3ww&ixlib=rb-4.1.0&q=85",
  "easter-island": "https://images.unsplash.com/photo-1782848796343-4b5472b802f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxlYXN0ZXIlMjBpc2xhbmQlMjBtb2FpJTIwZHJhbWF0aWMlMjBzdW5yaXNlfGVufDB8fHx8MTc5MDg0ODg3M3ww&ixlib=rb-4.1.0&q=85",
  "lake-district": "https://images.unsplash.com/photo-1787525500105-e71a438ab8c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxjaGlsZSUyMGxha2UlMjBkaXN0cmljdCUyMHZvbGNhbm8lMjBvc29ybm8lMjBrYXlha3xlbnwwfHx8fDE3OTA4NDg4NzN8MA&ixlib=rb-4.1.0&q=85",
};

export const destinations = [
  {
    id: "patagonia",
    chapter: "01",
    name: "Patagonia",
    icon: Mountain,
    tagline: "The edge of the world",
    description: "Granite towers, glaciers, and expedition treks",
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
    description: "Stargazing, geysers, and vast desert landscapes",
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
    description: "Andes views, world-class wine, and urban culture",
    longDescription:
      "A capital cradled by the Andes, ringed by some of the oldest vines in the New World. Dine at a World's 50 Best table, wander Valparaiso's painted hills, and taste Maipo Valley cabernet at the estates that made it famous.",
    basePrice: 150,
    image: IMAGES.santiago,
    activities: [
      { id: "city-tour", name: "Santiago City Tour", price: 80, duration: 0.5, category: "Culture", icon: Building2 },
      { id: "borago-dinner", name: "Dinner at Borago (World's 50 Best)", price: 250, duration: 0.5, category: "Luxury", icon: Wine },
      { id: "maipo-wine", name: "Maipo Valley Wine Tour", price: 180, duration: 1, category: "Experience", icon: Wine },
      { id: "valparaiso", name: "Valparaiso & Vina del Mar Tour", price: 150, duration: 1, category: "Culture", icon: Globe },
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
  {
    id: "easter-island",
    chapter: "04",
    name: "Easter Island",
    icon: Waves,
    tagline: "An ocean apart",
    description: "Ancient moai, volcanic shores, and Polynesian culture",
    longDescription:
      "Far out in the Pacific, Rapa Nui keeps its own time. Meet the moai at first light, trace the rim of a volcanic crater with a local guide, and sink into the white sands of Anakena. Intimate island lodges offer a front-row seat to an ocean without an edge.",
    basePrice: 280,
    image: IMAGES["easter-island"],
    activities: [
      { id: "tongariki-sunrise", name: "Ahu Tongariki Sunrise", price: 140, duration: 0.5, category: "Culture", icon: Sun },
      { id: "rano-raraku", name: "Rano Raraku & Moai Heritage", price: 190, duration: 1, category: "Culture", icon: Globe },
      { id: "orongo-crater", name: "Orongo & Rano Kau Crater", price: 130, duration: 0.5, category: "Nature", icon: Mountain },
      { id: "anakena-beach", name: "Anakena Beach Picnic", price: 110, duration: 0.5, category: "Relaxation", icon: Waves },
      { id: "rapa-nui-culture", name: "Rapa Nui Cultural Evening", price: 120, duration: 0.5, category: "Experience", icon: Star },
      { id: "coastal-hike", name: "Private Coastal Hike", price: 180, duration: 1, category: "Adventure", icon: Users },
    ],
    accommodations: [
      { id: "explora-rapa-nui", name: "Explora Rapa Nui", price: 580, rating: 5, type: "Island Lodge" },
      { id: "nayara-hangaroa", name: "Nayara Hangaroa", price: 460, rating: 5, type: "Oceanfront Retreat" },
      { id: "altiplanico-rapa-nui", name: "Altiplanico Rapa Nui", price: 290, rating: 4, type: "Boutique Lodge" },
    ],
  },
  {
    id: "lake-district",
    chapter: "05",
    name: "Lake District",
    icon: Trees,
    tagline: "A slower kind of wild",
    description: "Volcanoes, ancient forests, and mirror-still lakes",
    longDescription:
      "South of the vineyards, Chile softens into ancient forest and deep, clear lakes. Paddle beneath Osorno's snowy cone, follow emerald waterfalls, and cross to Chiloe for timber churches and island kitchens. Settle into a lakeside retreat where the only agenda is the view.",
    basePrice: 190,
    image: IMAGES["lake-district"],
    activities: [
      { id: "osorno-volcano", name: "Osorno Volcano Exploration", price: 160, duration: 1, category: "Adventure", icon: Mountain },
      { id: "petrohue-falls", name: "Petrohue Waterfalls Walk", price: 90, duration: 0.5, category: "Nature", icon: Trees },
      { id: "llanquihue-kayak", name: "Lake Llanquihue Kayaking", price: 120, duration: 0.5, category: "Adventure", icon: Waves },
      { id: "chiloe-heritage", name: "Chiloe Island Heritage Tour", price: 210, duration: 1, category: "Culture", icon: Globe },
      { id: "forest-hot-springs", name: "Forest Hot Springs Retreat", price: 140, duration: 0.5, category: "Relaxation", icon: Sun },
      { id: "lakeside-tasting", name: "Lakeside Tasting Menu", price: 160, duration: 0.5, category: "Luxury", icon: Wine },
    ],
    accommodations: [
      { id: "hotel-awa", name: "Hotel AWA", price: 380, rating: 5, type: "Lakeside Retreat" },
      { id: "andbeyond-vira-vira", name: "andBeyond Vira Vira", price: 520, rating: 5, type: "Hacienda Lodge" },
      { id: "futangue", name: "Futangue Hotel & Spa", price: 310, rating: 5, type: "Forest Lodge" },
      { id: "tierra-chiloe", name: "Tierra Chiloe", price: 440, rating: 5, type: "Island Lodge" },
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
