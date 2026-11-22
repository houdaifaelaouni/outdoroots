// Outdooroots sample content (Phase one prototype).
// Every record here is ILLUSTRATIVE: durations, XP, capability scores, hosts and
// map points are examples, not confirmed products, credentials or bookings.
// Replace with real, verified records before production.

export type Element = "agua" | "tierra" | "aire" | "fuego"
export type QuestType = "main" | "side" | "discovery" | "learning" | "fire"
export type Level = 1 | 2 | 3 | 4 | 5
export type Capability =
    | "fuerza"
    | "resistencia"
    | "control"
    | "destreza"
    | "percepcion"
    | "decision"
    | "adaptacion"
    | "liderazgo"

export type CapabilityScores = Record<Capability, number>

export interface Place {
    id: string
    country: string
    region: string
    destination: string
    lat: number
    lng: number
    ecosystem: string
    description: string
}

export interface Experience {
    id: string
    title: string
    placeId: string
    elements: Element[]
    questType: QuestType
    level: Level
    duration: string
    season: string
    difficulty: string
    xp: number
    disciplines: string[]
    summary: string
    learning: string[]
    capabilityImpact: Capability[]
    knowledge: string[]
    flora: string[]
    fauna: string[]
    habitat: string
    culture: string
    history: string
    itinerary: { title: string; text: string }[]
    inclusions: string[]
    exclusions: string[]
    requirements: string[]
    equipment: string[]
    safety: string
    conditions: string
    hostIds: string[]
    nearby: { title: string; type: QuestType; xp: number }[]
    achievements: string[]
    next: string[]
    requirementsProfile: CapabilityScores
    image: string
}

export interface Host {
    id: string
    name: string
    role: string
    location: string
    specialties: string[]
    languages: string[]
    bio: string
    credentials: { label: string; status: "pendiente" | "verificado" }[]
    verification: "pendiente" | "verificado"
    experienceIds: string[]
    image: string
}

export interface Article {
    id: string
    title: string
    category: string
    author: string
    excerpt: string
    body: string[]
    placeIds: string[]
    topics: string[]
    image: string
}

export interface MapPoint {
    id: string
    name: string
    category: string
    lat: number
    lng: number
    note: string
}

// Regional reference photography already hosted in the Framer project.
// None of these show the exact route or activity of an experience.
export const IMG = {
    patagonia: "https://framerusercontent.com/images/1MGkuCqb2BZMEFZS8xYRNmiY.jpg",
    torres: "https://framerusercontent.com/images/HjXahjunP7W3osO050Nu6mSdTOo.jpg",
    atacama: "https://framerusercontent.com/images/PkPXO6HgiDKi4SX9i4cRSGumXo.jpg",
    andes: "https://framerusercontent.com/images/Rss4WDkTQe3TiGwApkyrwU8X1Q.jpg",
    ocean: "https://framerusercontent.com/images/LZwL2oIcfKHBjWNj19DgZPRUExQ.jpg",
    lakes: "https://framerusercontent.com/images/bkufoUHjtgnj3huyPg2w13Il8E.jpg",
}

export const SAMPLE_NOTE =
    "Contenido de muestra: duraciones, XP, perfiles y puntuaciones son ilustrativos. No son productos, credenciales ni reservas confirmadas."

export const PRICE_PENDING = "Precio por confirmar"

export const ELEMENTS: { id: Element; name: string; text: string; image: string }[] = [
    { id: "agua", name: "Agua", text: "Surf, buceo, kayak, ríos, océano, navegación, islas y ecosistemas marinos.", image: IMG.ocean },
    { id: "tierra", name: "Tierra", text: "Trekking, MTB, escalada, bosques, desiertos, geología, senderos y fauna.", image: IMG.patagonia },
    { id: "aire", name: "Aire", text: "Altitud, viento, cumbres, parapente, nieve y alta montaña.", image: IMG.torres },
    { id: "fuego", name: "Fuego", text: "Compromiso excepcional: expediciones largas y grandes desafíos personales.", image: IMG.atacama },
]

export const QUEST_TYPES: { id: QuestType; name: string; text: string }[] = [
    { id: "main", name: "Main Quest", text: "La razón principal del viaje." },
    { id: "side", name: "Side Quest", text: "Una actividad complementaria cercana." },
    { id: "discovery", name: "Discovery Quest", text: "Descubre una nueva pasión." },
    { id: "learning", name: "Learning Quest", text: "Mejora tu técnica o tu conocimiento." },
    { id: "fire", name: "Fire Quest", text: "Una gran misión que exige preparación seria." },
]

export const LEVELS: Record<Level, string> = {
    1: "L1 Discovery",
    2: "L2 Explorer",
    3: "L3 Intermediate",
    4: "L4 Advanced",
    5: "L5 Expert",
}

export const CAPABILITIES: { id: Capability; name: string; meaning: string }[] = [
    { id: "fuerza", name: "FUERZA", meaning: "Fuerza y potencia" },
    { id: "resistencia", name: "RESISTENCIA", meaning: "Esfuerzo sostenido" },
    { id: "control", name: "CONTROL", meaning: "Equilibrio y coordinación" },
    { id: "destreza", name: "DESTREZA", meaning: "Precisión técnica" },
    { id: "percepcion", name: "PERCEPCIÓN", meaning: "Lectura del terreno y del riesgo" },
    { id: "decision", name: "DECISIÓN", meaning: "Juicio bajo incertidumbre" },
    { id: "adaptacion", name: "ADAPTACIÓN", meaning: "Respuesta al cambio y la fatiga" },
    { id: "liderazgo", name: "LIDERAZGO", meaning: "Comunicación, responsabilidad y equipo" },
]

const req = (v: number[]): CapabilityScores => ({
    fuerza: v[0],
    resistencia: v[1],
    control: v[2],
    destreza: v[3],
    percepcion: v[4],
    decision: v[5],
    adaptacion: v[6],
    liderazgo: v[7],
})

export const PLACES: Place[] = [
    { id: "matanzas", country: "Chile", region: "O'Higgins", destination: "Matanzas", lat: -33.96, lng: -71.87, ecosystem: "Costa del Pacífico central", description: "Caleta de la costa de Navidad, conocida por su viento constante y sus olas. Paisaje de acantilados, dunas y pesca artesanal." },
    { id: "rapa-nui", country: "Chile", region: "Valparaíso (territorio insular)", destination: "Rapa Nui", lat: -27.12, lng: -109.35, ecosystem: "Isla volcánica oceánica", description: "Isla polinésica en medio del Pacífico, con una cultura viva, volcanes extintos y aguas de gran transparencia." },
    { id: "volcan-san-jose", country: "Chile", region: "Metropolitana", destination: "Volcán San José · Cajón del Maipo", lat: -33.79, lng: -69.9, ecosystem: "Alta cordillera de los Andes", description: "Volcán de más de 5.800 m en la frontera con Argentina, al fondo del Cajón del Maipo." },
    { id: "araucania-lagos", country: "Chile", region: "La Araucanía", destination: "Licanray · Pucón · Villarrica", lat: -39.28, lng: -72.1, ecosystem: "Lagos, volcanes y bosque templado", description: "Territorio de lagos y volcanes activos, con bosque nativo, termas y comunidades mapuche." },
    { id: "colico", country: "Chile", region: "La Araucanía", destination: "Lago Colico", lat: -39.07, lng: -72.05, ecosystem: "Lago andino y bosque nativo", description: "Lago rodeado de bosque nativo, ideal para MTB, senderismo y atardeceres tranquilos." },
    { id: "nahuelbuta", country: "Chile", region: "Biobío · La Araucanía", destination: "Antulafken · Nahuelbuta", lat: -37.8, lng: -73.0, ecosystem: "Cordillera de la costa y bosque de araucarias", description: "Entre la cordillera de Nahuelbuta y la costa de Arauco: araucarias milenarias y territorio lafkenche." },
    { id: "ojos-del-salado", country: "Chile", region: "Atacama", destination: "Ojos del Salado", lat: -27.11, lng: -68.54, ecosystem: "Puna y alta montaña desértica", description: "El volcán más alto del mundo (6.893 m), en la puna de Atacama. Frío extremo, viento y gran altitud." },
]

export const EXPERIENCES: Experience[] = [
    {
        id: "matanzas-viento-y-olas",
        title: "Viento y olas en Matanzas",
        placeId: "matanzas",
        elements: ["agua", "aire"],
        questType: "discovery",
        level: 1,
        duration: "2 días (indicativo)",
        season: "Todo el año · más viento de septiembre a abril",
        difficulty: "Baja a moderada",
        xp: 120,
        disciplines: ["Surf", "Windsurf / kitesurf (introducción)"],
        summary: "Una primera inmersión en el océano: lectura del viento y del mar, sesiones de iniciación y la vida de una caleta de pescadores.",
        learning: ["Leer viento, marea y corrientes", "Posición básica sobre la tabla", "Seguridad en el mar"],
        capabilityImpact: ["control", "percepcion", "adaptacion"],
        knowledge: ["Corriente de Humboldt", "Pesca artesanal", "Dunas costeras"],
        flora: ["Matorral costero", "Plantas de duna"],
        fauna: ["Pelícanos", "Lobos marinos", "Aves marinas"],
        habitat: "Costa expuesta al Pacífico con aguas frías por la corriente de Humboldt.",
        culture: "Caletas de pesca artesanal y cocina de mar de la costa central.",
        history: "Zona rural costera que se ha convertido en un punto de referencia del windsurf en Chile.",
        itinerary: [
            { title: "Día 1 · El mar", text: "Bienvenida, charla de seguridad, lectura de condiciones y primera sesión en el agua." },
            { title: "Día 2 · El viento", text: "Sesión de técnica, caminata por la costa y almuerzo en la caleta." },
        ],
        inclusions: ["Instructor (por confirmar)", "Equipo de iniciación (por confirmar)"],
        exclusions: ["Transporte", "Alojamiento", "Seguro de viaje"],
        requirements: ["Saber nadar", "Sin experiencia previa necesaria"],
        equipment: ["Traje de neopreno (agua fría)", "Protector solar", "Ropa de abrigo"],
        safety: "Sesiones sólo con condiciones adecuadas y bajo supervisión de un instructor.",
        conditions: "El viento y el oleaje pueden cambiar el programa del día.",
        hostIds: ["host-agua"],
        nearby: [
            { title: "Caminata costera", type: "side", xp: 40 },
            { title: "Cocina de mar en la caleta", type: "side", xp: 30 },
        ],
        achievements: ["Marine Life I"],
        next: ["rapa-nui-cultura-oceano"],
        requirementsProfile: req([35, 40, 45, 35, 45, 35, 45, 20]),
        image: IMG.ocean,
    },
    {
        id: "rapa-nui-cultura-oceano",
        title: "Rapa Nui: cultura y océano",
        placeId: "rapa-nui",
        elements: ["agua", "tierra"],
        questType: "learning",
        level: 2,
        duration: "5 días (indicativo)",
        season: "Todo el año",
        difficulty: "Moderada",
        xp: 300,
        disciplines: ["Buceo / snorkel", "Trekking"],
        summary: "Aprender de la isla con quienes la habitan: patrimonio moai, volcanes, océano y cultura rapanui como conocimiento vivo.",
        learning: ["Historia y patrimonio rapanui", "Snorkel en aguas abiertas", "Geología volcánica de la isla"],
        capabilityImpact: ["percepcion", "adaptacion", "resistencia"],
        knowledge: ["Cultura rapanui", "Moai y ahu", "Volcanes Rano Kau y Rano Raraku", "Ecosistema marino del Pacífico"],
        flora: ["Toromiro (especie endémica en recuperación)", "Pastizales volcánicos"],
        fauna: ["Tortugas marinas", "Peces de arrecife", "Aves marinas"],
        habitat: "Isla volcánica oceánica, aislada, con aguas muy transparentes.",
        culture: "La cultura rapanui está viva: se comparte con contexto, respeto y participación adecuada.",
        history: "Sitio del Parque Nacional Rapa Nui, Patrimonio de la Humanidad.",
        itinerary: [
            { title: "Día 1 · Llegada", text: "Bienvenida y contexto cultural de la isla." },
            { title: "Día 2 · Moai", text: "Rano Raraku y Ahu Tongariki con guía local." },
            { title: "Día 3 · Volcán", text: "Rano Kau y la aldea ceremonial de Orongo." },
            { title: "Día 4 · Océano", text: "Snorkel y observación de vida marina." },
            { title: "Día 5 · Regreso", text: "Mañana libre y salida." },
        ],
        inclusions: ["Guía local (por confirmar)"],
        exclusions: ["Vuelos", "Ingreso al parque nacional", "Alojamiento"],
        requirements: ["Saber nadar para la jornada de snorkel"],
        equipment: ["Calzado de trekking", "Protección solar", "Traje de baño"],
        safety: "Actividades de mar sujetas a las condiciones del océano.",
        conditions: "El acceso a sitios patrimoniales sigue las normas del parque nacional.",
        hostIds: ["host-cultura"],
        nearby: [{ title: "Playa Anakena", type: "side", xp: 40 }],
        achievements: ["Rapa Nui Culture", "Pacific Naturalist"],
        next: ["matanzas-viento-y-olas"],
        requirementsProfile: req([30, 45, 40, 35, 50, 40, 50, 30]),
        image: IMG.ocean,
    },
    {
        id: "volcan-san-jose-ascenso",
        title: "Ascenso al Volcán San José",
        placeId: "volcan-san-jose",
        elements: ["aire", "tierra"],
        questType: "main",
        level: 4,
        duration: "4 días (indicativo)",
        season: "Diciembre a marzo",
        difficulty: "Alta",
        xp: 600,
        disciplines: ["Montañismo", "Navegación", "Camping"],
        summary: "Una ascensión de alta montaña a más de 5.800 m en el corazón del Cajón del Maipo, con aclimatación progresiva.",
        learning: ["Aclimatación a la altura", "Progresión en terreno de alta montaña", "Gestión del frío y del viento"],
        capabilityImpact: ["resistencia", "decision", "adaptacion", "percepcion"],
        knowledge: ["Volcanismo andino", "Glaciares de los Andes centrales", "Historia del Cajón del Maipo"],
        flora: ["Llareta", "Vegetación altoandina"],
        fauna: ["Cóndor andino", "Guanaco"],
        habitat: "Alta cordillera con fuertes contrastes térmicos y gran exposición al viento.",
        culture: "Tradición arriera del Cajón del Maipo.",
        history: "Uno de los volcanes más visibles desde la zona central de Chile.",
        itinerary: [
            { title: "Día 1 · Aproximación", text: "Traslado al Cajón del Maipo y caminata al primer campamento." },
            { title: "Día 2 · Aclimatación", text: "Porteo y descanso activo." },
            { title: "Día 3 · Cumbre", text: "Intento de cumbre según condiciones y estado del grupo." },
            { title: "Día 4 · Descenso", text: "Regreso al valle." },
        ],
        inclusions: ["Guía de alta montaña (por confirmar)"],
        exclusions: ["Equipo personal técnico", "Permisos (por confirmar)", "Seguro de rescate"],
        requirements: ["Experiencia previa en trekking de altura", "Buena condición física", "Evaluación previa del guía"],
        equipment: ["Botas de alta montaña", "Crampones y piolet", "Saco de dormir de invierno"],
        safety: "La decisión de cumbre la toma el guía. El grupo puede regresar en cualquier momento.",
        conditions: "El clima y el estado de la ruta pueden alterar o cancelar el ascenso.",
        hostIds: ["host-montana"],
        nearby: [
            { title: "Termas del Cajón del Maipo", type: "side", xp: 30 },
            { title: "Trekking de aclimatación", type: "learning", xp: 120 },
        ],
        achievements: ["Andes Explorer", "Volcanic Territory"],
        next: ["ojos-del-salado-expedicion"],
        requirementsProfile: req([65, 75, 60, 55, 70, 70, 70, 45]),
        image: IMG.andes,
    },
    {
        id: "araucania-volcanes-lagos",
        title: "Volcanes y lagos de la Araucanía",
        placeId: "araucania-lagos",
        elements: ["tierra", "agua"],
        questType: "main",
        level: 2,
        duration: "4 días (indicativo)",
        season: "Noviembre a abril",
        difficulty: "Moderada",
        xp: 350,
        disciplines: ["Trekking", "Kayak"],
        summary: "Entre Licanray, Villarrica y Pucón: senderos de bosque, kayak en lagos y el paisaje del volcán Villarrica.",
        learning: ["Navegación por senderos", "Técnica básica de kayak", "Lectura de bosque templado"],
        capabilityImpact: ["resistencia", "control", "percepcion"],
        knowledge: ["Bosque templado lluvioso", "Cultura mapuche", "Volcanismo activo"],
        flora: ["Araucaria", "Coigüe", "Raulí"],
        fauna: ["Carpintero negro", "Pudú", "Martín pescador"],
        habitat: "Lagos de origen glaciar rodeados de bosque y volcanes.",
        culture: "Territorio mapuche con tradiciones y gastronomía propias.",
        history: "Zona de colonización y de resistencia mapuche, hoy destino de naturaleza.",
        itinerary: [
            { title: "Día 1 · Licanray", text: "Llegada y caminata junto al lago Calafquén." },
            { title: "Día 2 · Bosque", text: "Trekking en bosque nativo con vistas al volcán." },
            { title: "Día 3 · Lago", text: "Jornada de kayak y termas." },
            { title: "Día 4 · Pucón", text: "Mañana en Pucón y regreso." },
        ],
        inclusions: ["Guía (por confirmar)"],
        exclusions: ["Transporte", "Alojamiento", "Ingreso a parques"],
        requirements: ["Caminar 4–6 horas"],
        equipment: ["Calzado de trekking", "Chaqueta impermeable"],
        safety: "El acceso al volcán depende de su nivel de actividad y de la autoridad.",
        conditions: "La lluvia y la alerta volcánica pueden cambiar el recorrido.",
        hostIds: ["host-montana"],
        nearby: [{ title: "Termas en el bosque", type: "side", xp: 30 }],
        achievements: ["Volcanic Territory"],
        next: ["colico-mtb", "volcan-san-jose-ascenso"],
        requirementsProfile: req([45, 55, 50, 40, 50, 45, 50, 30]),
        image: IMG.lakes,
    },
    {
        id: "colico-mtb",
        title: "MTB Colico Park",
        placeId: "colico",
        elements: ["tierra"],
        questType: "main",
        level: 3,
        duration: "2 días (indicativo)",
        season: "Octubre a abril",
        difficulty: "Moderada a alta",
        xp: 350,
        disciplines: ["MTB"],
        summary: "Senderos de MTB entre bosque nativo y lago. Incluye una clínica de técnica y side quests alrededor del lago Colico.",
        learning: ["Posición corporal", "Frenado", "Curvas y elección de línea"],
        capabilityImpact: ["control", "destreza", "decision"],
        knowledge: ["Bosque nativo", "Ecosistema del lago"],
        flora: ["Coigüe", "Arrayán", "Helechos"],
        fauna: ["Chucao", "Aves de bosque"],
        habitat: "Lago andino rodeado de bosque templado.",
        culture: "Comunidades rurales de la zona lacustre.",
        history: "Zona de tradición forestal y agrícola.",
        itinerary: [
            { title: "Día 1 · Clínica", text: "MTB Cornering Clinic: posición, frenado, curvas y líneas." },
            { title: "Día 2 · Senderos", text: "Ruta guiada en Colico Park y atardecer en el lago." },
        ],
        inclusions: ["Instructor de MTB (por confirmar)"],
        exclusions: ["Bicicleta (arriendo por confirmar)", "Alojamiento"],
        requirements: ["Manejo básico de bicicleta en sendero"],
        equipment: ["Casco", "Guantes", "Protecciones recomendadas"],
        safety: "Rutas elegidas según el nivel del grupo.",
        conditions: "La lluvia puede cerrar senderos.",
        hostIds: ["host-mtb"],
        nearby: [
            { title: "Sunset Lago Colico", type: "side", xp: 50 },
            { title: "Forest Trek", type: "side", xp: 80 },
            { title: "MTB Cornering Clinic", type: "learning", xp: 150 },
            { title: "First MTB Session", type: "discovery", xp: 100 },
        ],
        achievements: ["Técnica MTB I"],
        next: ["araucania-volcanes-lagos"],
        requirementsProfile: req([50, 50, 65, 60, 55, 55, 45, 25]),
        image: IMG.lakes,
    },
    {
        id: "nahuelbuta-araucarias",
        title: "Araucarias de Nahuelbuta y territorio lafkenche",
        placeId: "nahuelbuta",
        elements: ["tierra"],
        questType: "learning",
        level: 1,
        duration: "3 días (indicativo)",
        season: "Noviembre a abril",
        difficulty: "Baja a moderada",
        xp: 220,
        disciplines: ["Trekking", "Observación de fauna", "Fotografía"],
        summary: "De la cordillera de Nahuelbuta a la costa de Arauco: bosques de araucarias, miradores y la cultura lafkenche junto al mar.",
        learning: ["Identificación de flora nativa", "Fotografía de paisaje", "Historia del territorio"],
        capabilityImpact: ["percepcion", "adaptacion"],
        knowledge: ["Araucaria araucana", "Cordillera de la costa", "Cultura lafkenche"],
        flora: ["Araucaria", "Coigüe", "Ñirre"],
        fauna: ["Zorro chilote (en zonas boscosas)", "Carpintero negro", "Rapaces"],
        habitat: "Bosque de montaña costera con araucarias de cientos de años.",
        culture: "Los lafkenche, \"gente del mar\", comparten su territorio y su forma de vida.",
        history: "Uno de los refugios de araucaria de la cordillera de la costa.",
        itinerary: [
            { title: "Día 1 · Nahuelbuta", text: "Llegada y sendero entre araucarias." },
            { title: "Día 2 · Mirador", text: "Caminata a un mirador con vista a la costa y la cordillera." },
            { title: "Día 3 · Costa", text: "Encuentro con la costa de Arauco y regreso." },
        ],
        inclusions: ["Guía naturalista (por confirmar)"],
        exclusions: ["Transporte", "Alojamiento", "Ingreso a parques"],
        requirements: ["Caminar 3–5 horas"],
        equipment: ["Calzado de trekking", "Capas de abrigo"],
        safety: "Senderos señalizados y ritmo adaptado al grupo.",
        conditions: "La niebla y la lluvia son frecuentes en la cordillera costera.",
        hostIds: ["host-cultura"],
        nearby: [{ title: "Fotografía al amanecer", type: "side", xp: 40 }],
        achievements: ["Andean History I"],
        next: ["araucania-volcanes-lagos"],
        requirementsProfile: req([30, 40, 35, 30, 45, 35, 40, 25]),
        image: IMG.patagonia,
    },
    {
        id: "ojos-del-salado-expedicion",
        title: "Expedición Ojos del Salado",
        placeId: "ojos-del-salado",
        elements: ["fuego", "aire"],
        questType: "fire",
        level: 5,
        duration: "12–15 días (indicativo)",
        season: "Diciembre a febrero",
        difficulty: "Muy alta",
        xp: 1500,
        disciplines: ["Montañismo", "Navegación", "Camping", "Primeros auxilios"],
        summary: "Una expedición al volcán más alto del mundo. Exige meses de preparación, aclimatación y experiencia previa en altura.",
        learning: ["Expedición de gran altitud", "Autonomía en campamentos de altura", "Toma de decisiones en condiciones extremas"],
        capabilityImpact: ["resistencia", "adaptacion", "decision", "liderazgo"],
        knowledge: ["Puna de Atacama", "Lagunas altiplánicas", "Fisiología de la altura"],
        flora: ["Vegetación de puna muy escasa"],
        fauna: ["Vicuña", "Flamenco andino"],
        habitat: "Desierto de altura con frío extremo, viento y radiación intensa.",
        culture: "Rutas históricas de arrieros y mineros de Atacama.",
        history: "Escenario de expediciones de montaña desde mediados del siglo XX.",
        itinerary: [
            { title: "Días 1–4 · Aclimatación", text: "Copiapó, Laguna Verde y cumbres de aclimatación." },
            { title: "Días 5–10 · Campamentos de altura", text: "Ascenso progresivo por campamentos." },
            { title: "Días 11–13 · Cumbre", text: "Ventana de cumbre según meteorología." },
            { title: "Días 14–15 · Regreso", text: "Descenso y vuelta a Copiapó." },
        ],
        inclusions: ["Guías de expedición (por confirmar)"],
        exclusions: ["Permisos de ascenso", "Equipo personal", "Seguro de rescate"],
        requirements: ["Experiencia previa sobre 5.000 m", "Evaluación del guía", "Certificado médico"],
        equipment: ["Equipo de expedición de gran altitud", "Saco de -20 °C o inferior"],
        safety: "Plan de evacuación y decisión de cumbre a cargo del guía responsable.",
        conditions: "La meteorología de altura puede suspender la expedición.",
        hostIds: ["host-montana"],
        nearby: [{ title: "Laguna Verde", type: "side", xp: 60 }],
        achievements: ["Atacama Skies", "Andes Explorer"],
        next: [],
        requirementsProfile: req([75, 82, 65, 60, 80, 85, 85, 60]),
        image: IMG.atacama,
    },
]

// Sample hosts: no real person is represented. Portraits pending authorization.
export const HOSTS: Host[] = [
    {
        id: "host-montana",
        name: "Guía de alta montaña",
        role: "Perfil de muestra · Montaña",
        location: "Santiago, Chile",
        specialties: ["Alta montaña", "Expediciones", "Aclimatación"],
        languages: ["Español", "Inglés"],
        bio: "Perfil de ejemplo que muestra cómo se presentará a un guía de montaña: trayectoria documentada, especialidades y rutas que lidera.",
        credentials: [{ label: "Certificación de guía de montaña", status: "pendiente" }, { label: "Primeros auxilios en zonas remotas", status: "pendiente" }],
        verification: "pendiente",
        experienceIds: ["volcan-san-jose-ascenso", "ojos-del-salado-expedicion", "araucania-volcanes-lagos"],
        image: IMG.andes,
    },
    {
        id: "host-mtb",
        name: "Instructor/a de MTB",
        role: "Perfil de muestra · Ride with a Pro",
        location: "La Araucanía, Chile",
        specialties: ["MTB", "Técnica de curvas", "Clínicas"],
        languages: ["Español"],
        bio: "Perfil de ejemplo para atletas que enseñan: clínicas de técnica, salidas comunitarias y camps.",
        credentials: [{ label: "Instructor/a de MTB", status: "pendiente" }],
        verification: "pendiente",
        experienceIds: ["colico-mtb"],
        image: IMG.lakes,
    },
    {
        id: "host-cultura",
        name: "Anfitrión/a cultural",
        role: "Perfil de muestra · Cultura y naturaleza",
        location: "Chile",
        specialties: ["Historia local", "Cultura viva", "Naturaleza"],
        languages: ["Español", "Inglés"],
        bio: "Perfil de ejemplo para anfitriones que comparten conocimiento del territorio, su historia y sus tradiciones.",
        credentials: [{ label: "Guía local acreditado", status: "pendiente" }],
        verification: "pendiente",
        experienceIds: ["rapa-nui-cultura-oceano", "nahuelbuta-araucarias"],
        image: IMG.ocean,
    },
    {
        id: "host-agua",
        name: "Instructor/a de surf y viento",
        role: "Perfil de muestra · Agua",
        location: "Costa central, Chile",
        specialties: ["Surf", "Windsurf", "Seguridad en el mar"],
        languages: ["Español"],
        bio: "Perfil de ejemplo para instructores del océano y del viento.",
        credentials: [{ label: "Instructor/a certificado/a", status: "pendiente" }],
        verification: "pendiente",
        experienceIds: ["matanzas-viento-y-olas"],
        image: IMG.ocean,
    },
]

export const ARTICLES: Article[] = [
    {
        id: "araucarias",
        title: "Araucarias: los árboles que vieron pasar siglos",
        category: "Naturaleza",
        author: "Redacción Outdooroots (muestra)",
        excerpt: "Caminar entre araucarias es entrar en un bosque que crece despacio y vive mucho.",
        body: [
            "La araucaria (Araucaria araucana) crece en la cordillera de los Andes y en la cordillera de Nahuelbuta. Es una especie de crecimiento lento y puede vivir cientos de años.",
            "Para el pueblo mapuche-pewenche, su semilla, el piñón, ha sido un alimento fundamental. Por eso, conocer la araucaria es también conocer una cultura.",
            "Cuando visites un bosque de araucarias, camina por los senderos señalados y no recolectes semillas en áreas protegidas.",
        ],
        placeIds: ["nahuelbuta", "araucania-lagos"],
        topics: ["Flora nativa", "Cultura mapuche"],
        image: IMG.patagonia,
    },
    {
        id: "prepararse-altura",
        title: "Qué significa prepararse para la gran altitud",
        category: "Habilidades",
        author: "Redacción Outdooroots (muestra)",
        excerpt: "Una gran montaña no empieza en el campamento base: empieza meses antes.",
        body: [
            "A mayor altitud, hay menos oxígeno disponible. El cuerpo necesita tiempo para adaptarse, y ese tiempo no se puede saltar.",
            "La preparación combina resistencia, fuerza, experiencia progresiva en montañas más bajas y aprender a tomar decisiones conservadoras.",
            "Ningún perfil en línea sustituye la evaluación de un guía profesional ni la consulta médica antes de una expedición.",
        ],
        placeIds: ["ojos-del-salado", "volcan-san-jose"],
        topics: ["Montañismo", "Bienestar"],
        image: IMG.atacama,
    },
    {
        id: "rapa-nui-viva",
        title: "Rapa Nui como conocimiento vivo",
        category: "Cultura",
        author: "Redacción Outdooroots (muestra)",
        excerpt: "La isla no es un museo al aire libre: es el hogar de un pueblo con su propia lengua y tradiciones.",
        body: [
            "El pueblo rapanui mantiene su lengua, su música y sus ceremonias. Visitar la isla es una oportunidad de aprender con respeto.",
            "Los moai y los ahu son parte de un patrimonio protegido: se observan sin tocarlos y siguiendo las indicaciones de los guías.",
        ],
        placeIds: ["rapa-nui"],
        topics: ["Cultura", "Patrimonio"],
        image: IMG.ocean,
    },
]

export const COUNTRIES = [
    { name: "Chile", status: "Primer ecosistema", text: "Ecosistema de lanzamiento: de Atacama a Patagonia y las islas del Pacífico." },
    { name: "Bolivia", status: "Hoja de ruta", text: "Rurrenabaque y la Amazonía, Uyuni, La Paz y el Altiplano." },
    { name: "Perú", status: "Hoja de ruta", text: "Machu Picchu, Cusco, Titicaca, Arequipa y el Valle Sagrado." },
    { name: "Brasil", status: "Hoja de ruta", text: "Fernando de Noronha, Fortaleza y la costa del nordeste." },
    { name: "Argentina", status: "Hoja de ruta", text: "Mendoza, los Andes, San Luis y Patagonia." },
    { name: "México", status: "Hoja de ruta", text: "Cozumel, Yucatán y el Caribe." },
]

// Illustrative profile used by the progression preview. Not an assessment.
export const SAMPLE_PROFILE = {
    name: "Perfil de ejemplo",
    xp: 1240,
    capabilities: req([58, 68, 55, 50, 62, 57, 60, 45]),
    disciplines: [
        { name: "Trekking", level: 3 as Level, status: "SELF ASSESSED" },
        { name: "MTB", level: 2 as Level, status: "SELF ASSESSED" },
        { name: "Montañismo", level: 2 as Level, status: "SELF ASSESSED" },
        { name: "Kayak", level: 1 as Level, status: "SELF ASSESSED" },
    ],
    knowledge: ["Volcanic Territory"],
    path: ["Discovery Trek", "Mountain Trek", "Volcano Ascent", "High Andes Expedition", "Bolivia Altiplano", "Peru Andes"],
    pathIndex: 2,
}

// Demonstration map points around each center. Coordinates are approximate and
// categories are generic: these are not operating businesses or navigable routes.
export const MAP_POINTS: MapPoint[] = [
    { id: "p1", name: "Sendero de bosque (muestra)", category: "Trail", lat: -39.1, lng: -72.0, note: "Side Quest · Forest Trek" },
    { id: "p2", name: "Mirador del lago (muestra)", category: "Natural Landmark", lat: -39.05, lng: -72.1, note: "Side Quest · Sunset" },
    { id: "p3", name: "Termas (muestra)", category: "Hot Spring", lat: -39.3, lng: -71.85, note: "Recuperación" },
    { id: "p4", name: "Pucón", category: "Cultural Site", lat: -39.27, lng: -71.98, note: "Pueblo base" },
    { id: "p5", name: "Parque Nacional Conguillío", category: "Natural Landmark", lat: -38.65, lng: -71.65, note: "Araucarias y lava" },
    { id: "p6", name: "Licanray", category: "Cultural Site", lat: -39.49, lng: -72.15, note: "Lago Calafquén" },
    { id: "p7", name: "Instructor de MTB (muestra)", category: "Instructor", lat: -39.08, lng: -72.03, note: "Clínicas" },
    { id: "p8", name: "Lodge (muestra)", category: "Lodge", lat: -39.15, lng: -72.2, note: "Alojamiento" },
    { id: "p9", name: "Cajón del Maipo", category: "Cultural Site", lat: -33.64, lng: -70.35, note: "Valle de acceso" },
    { id: "p10", name: "Termas del Cajón (muestra)", category: "Hot Spring", lat: -33.82, lng: -70.1, note: "Side Quest" },
    { id: "p11", name: "Guía de montaña (muestra)", category: "Guide", lat: -33.6, lng: -70.5, note: "Montaña" },
    { id: "p12", name: "Laguna Verde", category: "Natural Landmark", lat: -26.9, lng: -68.45, note: "Aclimatación" },
    { id: "p13", name: "Copiapó", category: "Cultural Site", lat: -27.37, lng: -70.33, note: "Ciudad base" },
    { id: "p14", name: "Caleta de pescadores (muestra)", category: "Restaurant", lat: -33.97, lng: -71.86, note: "Cocina de mar" },
    { id: "p15", name: "Escuela de surf (muestra)", category: "Surf School", lat: -34.0, lng: -71.88, note: "Iniciación" },
    { id: "p16", name: "Pichilemu", category: "Cultural Site", lat: -34.39, lng: -72.0, note: "Costa surf" },
]

export const QUEST_LABEL: Record<QuestType, string> = {
    main: "Main Quest",
    side: "Side Quest",
    discovery: "Discovery Quest",
    learning: "Learning Quest",
    fire: "Fire Quest",
}

export function placeOf(e: Experience): Place {
    return PLACES.find((p) => p.id === e.placeId) as Place
}

export function experienceById(id: string): Experience | undefined {
    return EXPERIENCES.find((e) => e.id === id)
}

export function hostById(id: string): Host | undefined {
    return HOSTS.find((h) => h.id === id)
}

// Straight-line distance in km (haversine).
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
    const R = 6371
    const toRad = (d: number) => (d * Math.PI) / 180
    const dLat = toRad(bLat - aLat)
    const dLng = toRad(bLng - aLng)
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(h))
}

// Saved missions: stored in this browser only.
const SAVED_KEY = "outdooroots_saved_missions"
export function getSaved(): string[] {
    try {
        return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")
    } catch {
        return []
    }
}
export function toggleSaved(id: string): string[] {
    const cur = getSaved()
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next))
    } catch {}
    return next
}
