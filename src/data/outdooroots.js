import { destinations } from "@/data/destinations";
export const REGION_ES = { patagonia: "Patagonia", atacama: "Desierto de Atacama", santiago: "Santiago y Chile Central", "easter-island": "Isla de Pascua", "lake-district": "Región de los Lagos" };
const experiences = [
  ["Trekking en Torres del Paine", "Navegación al glaciar Grey", "Cabalgata en estancia", "Guía privado (día completo)", "Taller de fotografía", "Tratamiento de spa"],
  ["Atardecer en el Valle de la Luna", "Géiseres del Tatio al amanecer", "Observación astronómica privada", "Laguna Cejar y flamencos", "Termas de Puritama", "Visita al observatorio ALMA"],
  ["Recorrido por Santiago", "Cena en Boragó", "Ruta del vino del Maipo", "Valparaíso y Viña del Mar", "Visita a Concha y Toro", "Mirador Sky Costanera"],
  ["Amanecer en Ahu Tongariki", "Rano Raraku y patrimonio moai", "Orongo y cráter Rano Kau", "Pícnic en playa Anakena", "Velada cultural rapanui", "Caminata costera privada"],
  ["Exploración del volcán Osorno", "Caminata en saltos del Petrohué", "Kayak en el lago Llanquihue", "Patrimonio de Chiloé", "Termas en el bosque", "Menú degustación junto al lago"],
];
export const activityName = (destId, activity, language) => language === "en" ? activity.name : experiences[destinations.findIndex((d) => d.id === destId)]?.[destinations.find((d) => d.id === destId)?.activities.findIndex((a) => a.id === activity.id)] || activity.name;
export const regionName = (id, language) => language === "es" ? REGION_ES[id] : destinations.find((d) => d.id === id)?.name;
export const signatureJourneys = [
  { id: "patagonia", title: ["Patagonia on Foot", "Patagonia a Pie"], days: 6, activities: ["torres-del-paine", "grey-glacier", "horseback-riding"], tags: ["trekking", "nature"], copy: ["Granite peaks, glacier water, and time to find your own stride.", "Cumbres de granito, aguas glaciares y tiempo para encontrar tu ritmo."] },
  { id: "atacama", title: ["Atacama Under the Stars", "Atacama Bajo las Estrellas"], days: 4, activities: ["valle-de-la-luna", "stargazing", "cejar-lagoon"], tags: ["astronomy", "culture"], copy: ["Desert trails, local stories, and a sky worth staying up for.", "Senderos del desierto, historias locales y un cielo para recordar."] },
  { id: "lake-district", title: ["Lakes, Forests & Local Life", "Lagos, Bosques y Vida Local"], days: 5, activities: ["petrohue-falls", "llanquihue-kayak", "chiloe-heritage"], tags: ["nature", "culture", "family"], copy: ["Quiet shores, forest paths, and a taste of southern Chile.", "Orillas tranquilas, senderos de bosque y sabores del sur de Chile."] },
];
