import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";
import { createBookingStore, BookingStore } from "./store";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretoutdoorootsjwtsecretkey";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// In-memory data store
interface User {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
  created_at: string;
}

const users: User[] = [
  {
    email: ADMIN_EMAIL,
    name: "Admin",
    role: "admin",
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    created_at: new Date().toISOString(),
  },
];

interface Booking {
  id: string;
  reference: string;
  status: string;
  created_at: string;
  updated_at?: string;
  first_contact_at?: string;
  proposal_sent_at?: string;
  confirmed_at?: string;
  package_name: string;
  travelers: number;
  language?: "en" | "es";
  brief?: any;
  start_date?: string;
  end_date?: string;
  total_days: number;
  subtotal: number;
  tax: number;
  total_price: number;
  destinations: any[];
  itinerary: any[];
  unscheduled_activities?: any[];
  contact: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  internal_notes?: string;
  next_action?: string;
  follow_up_date?: string | null;
  review_reason?: string;
  lost_reason?: string;
  quote?: any;
  quote_summary?: any;
}

// Sample inquiry, only used when running without a database
const seedBookings: Booking[] = [
  {
    id: "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    reference: "OR-20261001-B1A2C3D4",
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    package_name: "Patagonia & Atacama Contrasts",
    travelers: 2,
    language: "en",
    total_days: 9,
    subtotal: 3950,
    tax: 750.5,
    total_price: 4700.5,
    contact: {
      name: "Sofia Rodriguez",
      email: "sofia.rodriguez@example.com",
      phone: "+56 9 8765 4321",
      notes: "Vegetarian options preferred. Interested in sunrise photography at Torres del Paine.",
    },
    brief: {
      trip_type: "personal",
      budget_basis: "per_person",
      pace: "active",
      experience: "moderate",
      comfort: "luxury",
      interests: ["hiking", "photography", "stargazing"],
    },
    destinations: [
      {
        id: "patagonia",
        name: "Patagonia",
        days: 5,
        accommodation: "Tierra Patagonia",
        activities: ["Torres del Paine Trek", "Grey Glacier Boat Tour"],
        subtotal: 2450,
      },
      {
        id: "atacama",
        name: "Atacama Desert",
        days: 4,
        accommodation: "Tierra Atacama",
        activities: ["Valle de la Luna Sunset Tour", "Private Astronomy Tour"],
        subtotal: 1500,
      },
    ],
    itinerary: [],
  },
];

let store: BookingStore;

// Helper: auth verification
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Not authenticated" });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
    const user = users.find((u) => u.email === payload.sub.toLowerCase());
    if (!user || user.role !== "admin") {
      return res.status(401).json({ detail: "Not authorized" });
    }
    (req as any).user = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ detail: "Token expired" });
    }
    return res.status(401).json({ detail: "Invalid token" });
  }
}

// Forward errors from async route handlers to Express (Express 4 doesn't)
const wrap =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

// ---------------- API Routes ----------------
const api = express.Router();

api.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Outdooroots inquiry API" });
});

// Auth
api.post("/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password required" });
  }
  const normalized = String(email).trim().toLowerCase();
  const user = users.find((u) => u.email === normalized);
  if (!user || !bcrypt.compareSync(String(password), user.passwordHash)) {
    return res.status(401).json({ detail: "Invalid email or password" });
  }
  const token = jwt.sign({ sub: user.email, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ access_token: token, token_type: "bearer", email: user.email });
});

api.get("/auth/me", authenticateAdmin, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ email: user.email, name: user.name, role: user.role });
});

// Bookings
api.post("/bookings", wrap(async (req: Request, res: Response) => {
  const body = req.body || {};
  if (!body.contact || !body.contact.name || !body.contact.email) {
    return res.status(422).json({ detail: "Please provide valid contact information" });
  }
  const id = crypto.randomUUID();
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const reference = `OR-${ymd}-${id.slice(0, 8).toUpperCase()}`;

  const doc: Booking = {
    ...body,
    id,
    reference,
    status: "new",
    created_at: now.toISOString(),
  };

  await store.insert(doc);
  res.status(200).json(doc);
}));

api.get("/bookings", authenticateAdmin, wrap(async (_req: Request, res: Response) => {
  res.json(await store.list());
}));

api.patch("/bookings/:id", authenticateAdmin, wrap(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await store.get(id);
  if (!booking) {
    return res.status(404).json({ detail: "Inquiry not found" });
  }

  const changes = req.body || {};
  const now = new Date().toISOString();

  if (changes.status === "lost") {
    const reason = (changes.lost_reason || booking.lost_reason || "").trim();
    if (!reason) {
      return res.status(422).json({ detail: "Record a reason before marking an inquiry lost" });
    }
  }

  if (changes.status === "contacted" && !booking.first_contact_at) {
    changes.first_contact_at = now;
  }
  if (changes.status === "proposal_sent" && !booking.proposal_sent_at) {
    changes.proposal_sent_at = now;
  }
  if (changes.status === "confirmed" && !booking.confirmed_at) {
    changes.confirmed_at = now;
  }
  changes.updated_at = now;

  await store.update(id, changes);
  res.json({ id, ...changes });
}));

api.put("/bookings/:id/quote", authenticateAdmin, wrap(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await store.get(id);
  if (!booking) {
    return res.status(404).json({ detail: "Inquiry not found" });
  }

  const user = (req as any).user;
  const body = req.body || {};
  const lines = Array.isArray(body.lines) ? body.lines : [];
  const clp_per_eur = Number(body.clp_per_eur) || 1;
  const tax_percent = body.tax_percent != null ? Number(body.tax_percent) : 0;
  const service_fee_clp = Number(body.service_fee_clp) || 0;

  // Calculate customer summary
  let subtotal = 0;
  const processedLines = lines.map((l: any) => {
    const qty = Number(l.quantity) || 1;
    const cost = Number(l.cost_clp) || 0;
    const margin = l.margin_percent != null ? Number(l.margin_percent) : null;
    const sell = l.selling_clp != null ? Number(l.selling_clp) : (margin != null && margin < 100 ? cost / (1 - margin / 100) : cost);
    const lineTotalClp = sell * qty;
    subtotal += lineTotalClp;
    return {
      description: l.description,
      category: l.category || "other",
      basis: l.basis || "item",
      quantity: qty,
      total_eur: Math.round((lineTotalClp / clp_per_eur) * 100) / 100,
    };
  });

  const taxClp = (subtotal + service_fee_clp) * (tax_percent / 100);
  const totalClp = subtotal + service_fee_clp + taxClp;

  const quote_summary = {
    total_eur: Math.round((totalClp / clp_per_eur) * 100) / 100,
    subtotal_eur: Math.round((subtotal / clp_per_eur) * 100) / 100,
    tax_eur: Math.round((taxClp / clp_per_eur) * 100) / 100,
    tax_label: body.tax_label || "",
    service_eur: Math.round((service_fee_clp / clp_per_eur) * 100) / 100,
    service_label: body.service_label || "",
    valid_until: body.valid_until || "",
    exchange_rate_date: body.exchange_rate_date || "",
    clp_per_eur,
    inclusions: body.inclusions || "",
    exclusions: body.exclusions || "",
    outstanding_checks: body.outstanding_checks || "",
    lines: processedLines,
  };

  const quote = {
    ...body,
    approved_by: user.email,
    reviewed_at: new Date().toISOString(),
  };

  await store.update(id, { quote, quote_summary });

  res.json({ quote, quote_summary });
}));

// PDF Rendering function with PDFKit
function generateItineraryPDF(pkg: any, reviewed?: any, language = "en"): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const es = language === "es";
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      info: {
        Title: `Outdooroots — ${pkg.package_name || "Custom Journey"}`,
        Author: "Outdooroots",
      },
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const width = 595.28;
    const height = 841.89;

    // Background color: Cream (#FDFBF7)
    doc.rect(0, 0, width, height).fill("#FDFBF7");

    // Header: NAVY text
    doc.fillColor("#0B192C").fontSize(22).font("Helvetica-Bold").text("Outdooroots", 40, 42);
    doc.fillColor("#5C656E").fontSize(8).font("Helvetica").text(
      "AVENTURA · VIDA · NATURALEZA",
      width - 240,
      48,
      { width: 200, align: "right" }
    );

    // Copper separator line
    doc.strokeColor("#A7613D").lineWidth(1).moveTo(40, 72).lineTo(width - 40, 72).stroke();

    // Eyebrow
    doc.fillColor("#A7613D").fontSize(8).font("Helvetica-Bold").text(
      reviewed
        ? (es ? "PROPUESTA REVISADA" : "REVIEWED PROPOSAL")
        : (es ? "PROPUESTA, NO RESERVA" : "PROPOSAL, NOT RESERVATION"),
      40,
      82
    );

    // Title
    doc.fillColor("#0B192C").fontSize(20).font("Helvetica-Bold").text(pkg.package_name || "Custom Chile Journey", 40, 100, {
      width: width - 80,
    });

    // Subtitle info
    const start = pkg.start_date ? pkg.start_date.slice(0, 10) : (es ? "Fechas flexibles" : "Flexible dates");
    const end = pkg.end_date ? ` · ${es ? "Regreso" : "Return"}: ${pkg.end_date.slice(0, 10)}` : "";
    doc.fillColor("#5C656E").fontSize(9).font("Helvetica").text(
      `${pkg.travelers || 1} ${es ? "viajeros" : "travelers"} · ${pkg.total_days || 0} ${es ? "días" : "days"} · ${start}${end}`,
      40,
      130
    );

    // Chapters
    let currentY = 155;
    const destinations = Array.isArray(pkg.destinations) ? pkg.destinations : [];
    let dayOffset = 0;

    destinations.slice(0, 5).forEach((dest: any) => {
      const days = dest.days || 1;
      const heading = `${String(dayOffset + 1).padStart(2, "0")}–${String(dayOffset + days).padStart(2, "0")} / ${dest.name}`;
      doc.fillColor("#0B192C").fontSize(12).font("Helvetica-Bold").text(heading, 40, currentY);
      currentY += 16;

      const stay = dest.accommodation ? `${es ? "Estadía" : "Proposed stay"}: ${dest.accommodation}` : "";
      if (stay) {
        doc.fillColor("#5C656E").fontSize(8.5).font("Helvetica").text(stay, 40, currentY);
        currentY += 13;
      }

      const activities = Array.isArray(dest.activities) ? dest.activities.join(" · ") : "";
      if (activities) {
        doc.fillColor("#3A424E").fontSize(8.5).font("Helvetica-Oblique").text(activities, 40, currentY, { width: width - 80 });
        currentY += 16;
      }

      dayOffset += days;
      currentY += 6;
    });

    // Planning Notes Box
    doc.rect(40, currentY, width - 80, 80).fillAndStroke("#F3EFEA", "#E5DEC9");
    doc.fillColor("#A7613D").fontSize(8).font("Helvetica-Bold").text(es ? "NOTAS DE PLANIFICACIÓN" : "PLANNING NOTES", 50, currentY + 10);
    const notesText = es
      ? "Disponibilidad, temporada y accesibilidad sujetas a confirmación del equipo. Tarifas ilustrativas y orientativas. No constituye reserva."
      : "Availability, seasonality, and accessibility require team review. Illustrative estimates; not an official booking.";
    doc.fillColor("#5C656E").fontSize(8).font("Helvetica").text(notesText, 50, currentY + 24, { width: width - 100 });

    if (reviewed && reviewed.lines && reviewed.lines.length > 0) {
      currentY += 92;
      doc.fillColor("#A7613D").fontSize(8).font("Helvetica-Bold").text(es ? "DESGLOSE REVISADO (EUR)" : "REVIEWED BREAKDOWN (EUR)", 40, currentY);
      currentY += 14;
      reviewed.lines.slice(0, 4).forEach((line: any) => {
        doc.fillColor("#3A424E").fontSize(8).font("Helvetica").text(
          `${line.description} (${line.quantity}x) — €${Number(line.total_eur).toFixed(2)}`,
          40,
          currentY
        );
        currentY += 12;
      });
    }

    // Bottom Summary Banner
    const bannerY = height - 140;
    doc.rect(40, bannerY, width - 80, 75).fill("#0B192C");

    const amount = reviewed ? reviewed.total_eur : pkg.total_price || 0;
    const bannerLabel = reviewed
      ? (es ? "PROPUESTA REVISADA · EUR" : "REVIEWED PROPOSAL · EUR")
      : (es ? "ESTIMACIÓN ILUSTRATIVA · EUR" : "ILLUSTRATIVE ESTIMATE · EUR");

    doc.fillColor("#A7613D").fontSize(8).font("Helvetica-Bold").text(bannerLabel, 55, bannerY + 12);
    doc.fillColor("#FDFBF7").fontSize(22).font("Helvetica-Bold").text(`€${Number(amount).toLocaleString()}`, 55, bannerY + 28);

    const perPerson = Math.round(amount / (pkg.travelers || 1));
    doc.fillColor("#9EA6B5").fontSize(9).font("Helvetica").text(
      `€${perPerson.toLocaleString()} / ${es ? "persona" : "person"}`,
      width - 200,
      bannerY + 34,
      { width: 145, align: "right" }
    );

    const footerValidity = reviewed
      ? `${es ? "Válida hasta" : "Valid until"} ${reviewed.valid_until}`
      : (es ? "Tarifas estimadas sin cargos adicionales no confirmados." : "Estimated rates; missing line items require a custom quote.");
    doc.fillColor("#9EA6B5").fontSize(7.5).font("Helvetica").text(footerValidity, 55, bannerY + 54);

    // Footer copyright
    doc.fillColor("#A7613D").fontSize(7.5).font("Helvetica-Oblique").text(
      es ? "Resumen de una página · Outdooroots Chile" : "One-page summary · Outdooroots Chile",
      40,
      height - 35,
      { width: width - 80, align: "center" }
    );

    doc.end();
  });
}

api.post("/itinerary/pdf", async (req: Request, res: Response) => {
  try {
    const pkg = req.body || {};
    const pdfBuffer = await generateItineraryPDF(pkg, null, pkg.language || "en");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="outdooroots-itinerary.pdf"');
    res.setHeader("Cache-Control", "no-store");
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error("PDF generation error:", err);
    res.status(500).json({ detail: "Failed to generate PDF" });
  }
});

api.get("/bookings/:id/proposal.pdf", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await store.get(id);
    if (!booking) {
      return res.status(404).json({ detail: "Inquiry not found" });
    }
    if (!booking.quote_summary) {
      return res.status(409).json({ detail: "Save a reviewed quote first" });
    }
    const pdfBuffer = await generateItineraryPDF(booking, booking.quote_summary, booking.language || "en");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="outdooroots-proposal.pdf"');
    res.setHeader("Cache-Control", "no-store");
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error("Proposal PDF generation error:", err);
    res.status(500).json({ detail: "Failed to generate proposal PDF" });
  }
});

// Chat system prompt & streaming
const SYSTEM_PROMPT = `You are the Outdooroots Travel Assistant — a warm, knowledgeable guide helping travelers plan adventures in Chile. You speak with genuine enthusiasm about Chile's landscapes, culture, and people.

Your personality:
- Friendly and approachable, like a well-traveled friend who happens to know Chile deeply
- You give honest, practical advice — not sales pitches
- You naturally weave in local culture, food, and hidden gems
- You keep responses focused and helpful, not overwhelming

Your knowledge covers five regions:
1. PATAGONIA — Torres del Paine, glaciers, estancia horseback riding, photography, luxury lodges (Tierra Patagonia, Explora, The Singular). Best: Oct-Mar. Illustrative from EUR 250/night.
2. ATACAMA DESERT — Valle de la Luna, Tatio Geysers, stargazing, Cejar Lagoon, Puritama Hot Springs, ALMA Observatory. Lodges: Tierra Atacama, Awasi, Nayara. Best: year-round. Illustrative from EUR 200/night.
3. SANTIAGO & CENTRAL CHILE — City culture, Borago, Maipo Valley wine, Valparaiso street art. Lodges: The Singular, Hotel Magnolia. Best: Sep-May. Illustrative from EUR 150/night.
4. EASTER ISLAND (RAPA NUI) — Ahu Tongariki sunrise, Rano Raraku moai, Orongo crater, Anakena beach. Lodges: Explora Rapa Nui, Nayara Hangaroa. Flight from Santiago ~5hrs. Best: Oct-Apr. Illustrative from EUR 280/night.
5. LAKE DISTRICT — Osorno Volcano, Petrohue Falls, Llanquihue kayaking, Chiloe Island heritage. Lodges: Hotel AWA, andBeyond Vira Vira, Tierra Chiloe. Best: Nov-Mar. Illustrative from EUR 190/night.

Important guidelines:
- All prices are ILLUSTRATIVE estimates in EUR.
- You do NOT make reservations or confirm bookings.
- If someone wants to move forward, suggest they use the trip builder on the Outdooroots website to submit a proposal request.
- Be honest about altitude in Atacama (2,400m+), fitness for Patagonia treks, remote location of Easter Island, weather windows.
- Respond in the same language the user writes in (English or Spanish).
- Keep responses concise but rich (2-4 paragraphs). Use markdown formatting.`;

api.post("/chat", async (req: Request, res: Response) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";

  // Attempt using Gemini API if available
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI();
      const conversationContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents: conversationContents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      return res.end();
    } catch (err: any) {
      console.warn("Gemini stream error, falling back to local assistant response:", err.message);
    }
  }

  // Knowledgeable fallback generator
  const isSpanish = /[¿áéíóúñ]/i.test(lastUserMsg) || /hola|viaje|chile|patagonia|itinerario|cuanto/i.test(lastUserMsg);
  let reply = "";

  const query = lastUserMsg.toLowerCase();
  if (query.includes("patagonia") || query.includes("torres")) {
    reply = isSpanish
      ? "¡**Patagonia** es una tierra indómita de una belleza conmovedora! El Parque Nacional Torres del Paine ofrece caminatas épicas frente a torres de granito y lagos turquesas.\n\n" +
        "• **Mejor época**: De octubre a marzo, con días largos y clima más templado.\n" +
        "• **Experiencias clave**: Navegación al Glaciar Grey, cabalgatas en estancias tradicionales y avistamiento de cóndores.\n" +
        "• **Estadía recomendada**: 4 a 6 días en lodges como Tierra Patagonia o The Singular.\n\n" +
        "¿Te gustaría combinar la Patagonia con otra región, como los contrastes del Desierto de Atacama? Puedes configurar tu ruta personalizada directamente en nuestro creador de viajes."
      : "**Patagonia** is a land that recalibrates you. Granite peaks rise above turquoise glacial waters, and condors trace slow circles above the southern steppe.\n\n" +
        "• **Best time to visit**: October through March for longer daylight and optimal trekking conditions.\n" +
        "• **Key experiences**: The iconic Torres del Paine treks, navigating Grey Glacier, and horseback riding through private estancias.\n" +
        "• **Recommended stay**: 4–6 days in exceptional lodges like Tierra Patagonia or Explora.\n\n" +
        "Would you like to combine Patagonia with the lunar scenery of Atacama? You can test different combinations in our interactive Trip Builder!";
  } else if (query.includes("atacama") || query.includes("desert") || query.includes("desierto") || query.includes("geyser") || query.includes("stargazing")) {
    reply = isSpanish
      ? "El **Desierto de Atacama** es un paisaje casi extraterrestre. Al ser el desierto no polar más árido del planeta, cuenta con los cielos nocturnos más limpios de la Tierra.\n\n" +
        "• **Atractivos imperdibles**: Atardecer en el Valle de la Luna, Geysers del Tatio al amanecer (a más de 4.300 msnm) y observación astronómica privada.\n" +
        "• **Relajación**: Baños en las termas naturales de Puritama y lagunas de salmuera como Cejar.\n" +
        "• **Consejo de viaje**: Dedica el primer día a aclimatarte a la altura (San Pedro está a 2.400 msnm).\n\n" +
        "¡Puedes agregar Atacama como un capítulo de tu aventura en nuestro diseñador de itinerarios!"
      : "The **Atacama Desert** is an otherworldly wonder. As the driest non-polar desert on Earth, it offers crystal-clear skies for stargazing that few places on our planet can rival.\n\n" +
        "• **Highlights**: Valle de la Luna sunset, Tatio Geysers at dawn (at 4,300m altitude), and private astronomer-guided telescope sessions.\n" +
        "• **Relaxation**: Soak in Puritama hot springs and float in Cejar salt lagoon.\n" +
        "• **Practical note**: Take your first afternoon easy to acclimatize to the 2,400m+ elevation in San Pedro.\n\n" +
        "Would you like recommendations on how to structure a stay here?";
  } else if (query.includes("lake") || query.includes("lago") || query.includes("volcan") || query.includes("puerto varas")) {
    reply = isSpanish
      ? "La **Región de los Lagos** chilena es el corazón verde del sur, dominada por conos volcánicos perfectos como el Volcán Osorno y antiguos bosques siempreverdes.\n\n" +
        "• **Imperdibles**: Navegación en kayak en el Lago Llanquihue, Saltos del Petrohué y la mística cultura de Chiloé con sus iglesias de madera de alerce.\n" +
        "• **Mejor época**: Noviembre a marzo para clima cálido y deportes al aire libre.\n" +
        "• **Alojamiento**: Hoteles de diseño junto al lago como Hotel AWA y estancias ribereñas.\n\n" +
        "Es el complemento perfecto para un ritmo más pausado de naturaleza y gastronomía local."
      : "Chile's **Lake District** is a lush sanctuary of snow-capped volcanoes, ancient temperate rainforests, and tranquil glacial lakes.\n\n" +
        "• **Top Highlights**: Kayaking Lake Llanquihue beneath Osorno Volcano, visiting Petrohué Falls, and exploring the wooden UNESCO heritage churches of Chiloé.\n" +
        "• **Best Season**: November to March for pleasant temperatures and open trails.\n" +
        "• **Lodges**: Lakeside retreats like Hotel AWA and organic riverfront lodges.\n\n" +
        "It provides a wonderfully balanced, relaxed pace between trekking in Patagonia and desert adventures.";
  } else if (query.includes("easter") || query.includes("rapa nui") || query.includes("moai")) {
    reply = isSpanish
      ? "**Rapa Nui (Isla de Pascua)** es uno de los lugares más remotos y fascinantes de la Tierra.\n\n" +
        "• **Lo esencial**: El amanecer en Ahu Tongariki con los 15 moai alineados, la cantera de Rano Raraku y el cráter de Orongo.\n" +
        "• **Logística**: Se llega en vuelo desde Santiago (~5 horas). Se recomienda una estadía mínima de 3 a 4 días.\n" +
        "• **Cultura viva**: Noches culturales, playa Anakena con palmeras y arqueología única en el Pacífico.\n\n" +
        "Puedes incluir Rapa Nui en tu solicitud de propuesta en la plataforma para coordinar vuelos y guías locales."
      : "**Rapa Nui (Easter Island)** sits in splendid isolation in the South Pacific, about a 5-hour flight from Santiago.\n\n" +
        "• **Unforgettable moments**: Sunrise at Ahu Tongariki with 15 monumental moai silhouetted against the Pacific, exploring Rano Raraku quarry, and standing on the rim of Orongo crater.\n" +
        "• **Time needed**: 3 to 4 days provides a balanced pace without rushing.\n" +
        "• **Lodges**: Explora Rapa Nui and Nayara Hangaroa provide sublime hospitality and private naturalist guides.\n\n" +
        "Would you like to build an itinerary connecting Santiago and Rapa Nui?";
  } else {
    reply = isSpanish
      ? "¡Hola! Soy tu asistente de viajes en **Outdooroots**. Conozco Chile a fondo: desde las torres de hielo de la **Patagonia** y las dunas de sal de **Atacama**, hasta la cultura de **Santiago**, los lagos del sur y los misterios de **Rapa Nui**.\n\n" +
        "¿Qué tipo de viaje sueñas realizar? ¿Buscas senderismo activo, astroturismo, cultura local o una escapada de lujo relajada? Cuéntame y te ayudaré a diseñar la ruta ideal."
      : "Welcome to **Outdooroots**! I'm here to help you navigate and dream up your ideal Chilean adventure.\n\n" +
        "Whether you're drawn to the granite spires of **Patagonia**, stargazing in the **Atacama Desert**, vibrant culture and wine in **Santiago**, tranquil waters in the **Lake District**, or the ancient moai of **Easter Island**, I can provide firsthand insights on seasons, stays, and route composition.\n\n" +
        "What style of journey are you envisioning?";
  }

  // Stream reply in natural chunks
  const words = reply.split(" ");
  for (let i = 0; i < words.length; i += 3) {
    const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, 35));
  }
  res.write("data: [DONE]\n\n");
  res.end();
});

app.use("/api", api);

app.use("/api", (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API error:", err);
  res.status(500).json({ detail: "Something went wrong. Please try again." });
});

// ---------------- Frontend & Vite Setup ----------------
async function startServer() {
  store = await createBookingStore(seedBookings);
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Outdooroots server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
