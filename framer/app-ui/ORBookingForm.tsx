import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots booking request flow — dark app-UI style, self-contained Framer code component.
// Paste into Framer: Assets → Code → New file → "ORBookingForm".
//
// It records a booking REQUEST (no payment, no confirmed availability). When an
// API URL is set it POSTs to the Outdooroots backend (/api/bookings) and only
// shows success after the server stores it. Without an API URL it downloads a
// local draft and says so. Experiences below are labeled sample records.

type Exp = {
    id: string
    title: string
    place: string
    quest: string
    level: string
    days: number
    season: string
    minAge: number
    maxGroup: number
    requirements: string[]
    image: string
}

const IMG = {
    patagonia: "https://framerusercontent.com/images/1MGkuCqb2BZMEFZS8xYRNmiY.jpg",
    atacama: "https://framerusercontent.com/images/PkPXO6HgiDKi4SX9i4cRSGumXo.jpg",
    andes: "https://framerusercontent.com/images/Rss4WDkTQe3TiGwApkyrwU8X1Q.jpg",
    ocean: "https://framerusercontent.com/images/LZwL2oIcfKHBjWNj19DgZPRUExQ.jpg",
    lakes: "https://framerusercontent.com/images/bkufoUHjtgnj3huyPg2w13Il8E.jpg",
}

const EXPERIENCES: Exp[] = [
    { id: "colico-mtb", title: "MTB Colico Park", place: "Lago Colico, La Araucanía", quest: "Main Quest", level: "L3 Intermediate", days: 2, season: "Octubre a abril", minAge: 14, maxGroup: 8, requirements: ["Manejo básico de bicicleta en sendero"], image: IMG.lakes },
    { id: "matanzas-viento-y-olas", title: "Viento y olas en Matanzas", place: "Matanzas, O'Higgins", quest: "Discovery Quest", level: "L1 Discovery", days: 2, season: "Todo el año", minAge: 12, maxGroup: 10, requirements: ["Saber nadar"], image: IMG.ocean },
    { id: "rapa-nui-cultura-oceano", title: "Rapa Nui: cultura y océano", place: "Rapa Nui", quest: "Learning Quest", level: "L2 Explorer", days: 5, season: "Todo el año", minAge: 10, maxGroup: 12, requirements: ["Saber nadar para el snorkel"], image: IMG.ocean },
    { id: "araucania-volcanes-lagos", title: "Volcanes y lagos de la Araucanía", place: "Licanray · Pucón · Villarrica", quest: "Main Quest", level: "L2 Explorer", days: 4, season: "Noviembre a abril", minAge: 12, maxGroup: 12, requirements: ["Caminar 4–6 horas"], image: IMG.lakes },
    { id: "nahuelbuta-araucarias", title: "Araucarias de Nahuelbuta", place: "Antulafken · Nahuelbuta", quest: "Learning Quest", level: "L1 Discovery", days: 3, season: "Noviembre a abril", minAge: 8, maxGroup: 12, requirements: ["Caminar 3–5 horas"], image: IMG.patagonia },
    { id: "volcan-san-jose-ascenso", title: "Ascenso al Volcán San José", place: "Cajón del Maipo, Metropolitana", quest: "Main Quest", level: "L4 Advanced", days: 4, season: "Diciembre a marzo", minAge: 18, maxGroup: 6, requirements: ["Experiencia previa en altura", "Evaluación previa del guía"], image: IMG.andes },
    { id: "ojos-del-salado-expedicion", title: "Expedición Ojos del Salado", place: "Atacama", quest: "Fire Quest", level: "L5 Expert", days: 14, season: "Diciembre a febrero", minAge: 18, maxGroup: 6, requirements: ["Experiencia previa sobre 5.000 m", "Evaluación del guía", "Certificado médico"], image: IMG.atacama },
]

const STEPS = ["Experiencia", "Fecha y grupo", "Tus datos", "Revisar"]

const C = { ink: "#FFFFFF", forest: "#20252E", ivory: "#FFFFFF", sand: "#D48C46", muted: "#9EA6B5", border: "#262B35", white: "#121418", error: "#FF6B61" }
const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const MONO = "'JetBrains Mono', ui-monospace, monospace"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"

function addDays(iso: string, n: number) {
    const d = new Date(iso + "T00:00:00")
    d.setDate(d.getDate() + Math.max(n - 1, 0))
    return d.toISOString().slice(0, 10)
}
function fmtDate(iso: string) {
    if (!iso) return "—"
    return new Date(iso + "T00:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
}

/**
 * Outdooroots booking request.
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORBookingForm(props: {
    apiUrl: string
    defaultExperience: string
    title: string
    accent: string
    background: string
    style?: React.CSSProperties
}) {
    const { apiUrl, accent, background } = props
    const [step, setStep] = useState(0)
    const [expId, setExpId] = useState(props.defaultExperience)
    const [form, setForm] = useState({
        date: "",
        flexible: false,
        adults: 2,
        minors: 0,
        experience: "primera vez",
        name: "",
        email: "",
        phone: "",
        country: "",
        notes: "",
        consent: false,
        ack: false,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const [serverError, setServerError] = useState("")
    const [reference, setReference] = useState("")
    const [narrow, setNarrow] = useState(false)

    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-app-fonts")) {
            const l = document.createElement("link")
            l.id = "or-app-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
        if (typeof window === "undefined") return
        const id = new URLSearchParams(window.location.search).get("id")
        if (id && EXPERIENCES.some((e) => e.id === id)) setExpId(id)
        const on = () => setNarrow(window.innerWidth < 640)
        on()
        window.addEventListener("resize", on)
        return () => window.removeEventListener("resize", on)
    }, [])

    const exp = useMemo(() => EXPERIENCES.find((e) => e.id === expId) || EXPERIENCES[0], [expId])
    const travelers = form.adults + form.minors
    const today = new Date().toISOString().slice(0, 10)
    const set = (k: string, v: any) => {
        setForm((f) => ({ ...f, [k]: v }))
        // Clear a field's error as soon as the visitor changes it.
        setErrors((e) => {
            if (!e[k] && !(k === "minors" && e.adults)) return e
            const { [k]: _drop, ...rest } = e
            if (k === "minors") delete rest.adults
            return rest
        })
    }

    function validate(s: number): boolean {
        const e: Record<string, string> = {}
        if (s === 1) {
            if (!form.date) e.date = "Elige una fecha de inicio aproximada."
            else if (form.date < today) e.date = "La fecha debe ser futura."
            if (form.adults < 1) e.adults = "Se necesita al menos una persona adulta."
            if (travelers > exp.maxGroup) e.adults = `Esta experiencia admite hasta ${exp.maxGroup} personas por grupo.`
            if (form.minors > 0 && exp.minAge >= 18) e.minors = "Esta experiencia es sólo para mayores de edad."
        }
        if (s === 2) {
            if (!form.name.trim()) e.name = "Escribe tu nombre."
            if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Escribe un email válido."
        }
        if (s === 3) {
            if (!form.ack) e.ack = "Confirma que entiendes que es una solicitud."
            if (!form.consent) e.consent = "Necesitamos tu consentimiento para responderte."
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const next = () => validate(step) && setStep((s) => Math.min(s + 1, 3))
    const back = () => {
        setErrors({})
        setStep((s) => Math.max(s - 1, 0))
    }

    const payload = () => ({
        package_name: exp.title,
        travelers,
        language: "es",
        start_date: form.date,
        end_date: addDays(form.date, exp.days),
        total_days: exp.days,
        subtotal: 0,
        tax: 0,
        total_price: 0,
        brief: {
            kind: "booking_request",
            source: "framer",
            experience_id: exp.id,
            quest: exp.quest,
            level: exp.level,
            adults: form.adults,
            minors: form.minors,
            flexible_dates: form.flexible,
            prior_experience: form.experience,
            consent: true,
            consent_at: new Date().toISOString(),
        },
        destinations: [{ id: exp.id, name: exp.place, days: exp.days, activities: [], subtotal: 0 }],
        itinerary: [],
        contact: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            notes: [form.country && `País: ${form.country}`, form.notes.trim()].filter(Boolean).join("\n"),
        },
    })

    function downloadDraft() {
        const p = payload()
        const text = [
            "Outdooroots — Solicitud de reserva (BORRADOR, no enviado)",
            `Experiencia: ${exp.title} (${exp.place})`,
            `Fecha de inicio: ${fmtDate(form.date)}${form.flexible ? " (flexible)" : ""}`,
            `Duración indicativa: ${exp.days} días`,
            `Personas: ${form.adults} adultos, ${form.minors} menores`,
            `Experiencia previa: ${form.experience}`,
            `Nombre: ${p.contact.name}`,
            `Email: ${p.contact.email}`,
            `Teléfono: ${p.contact.phone || "—"}`,
            `Notas: ${p.contact.notes || "—"}`,
            "",
            "Este borrador se generó en tu dispositivo. No se envió a nadie.",
        ].join("\n")
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = `outdooroots-solicitud-${exp.id}.txt`
        a.click()
        URL.revokeObjectURL(a.href)
    }

    async function submit() {
        if (!validate(3)) return
        if (!apiUrl) {
            downloadDraft()
            return
        }
        setStatus("sending")
        setServerError("")
        try {
            const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload()),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.detail || "No pudimos guardar tu solicitud.")
            setReference(data.reference || "")
            setStatus("done")
        } catch (err: any) {
            setStatus("error")
            setServerError(err instanceof TypeError ? "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo." : err.message || "No pudimos enviar tu solicitud. Inténtalo de nuevo.")
        }
    }

    // ---------- styles ----------
    const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, color: C.ink, fontSize: 15, fontFamily: "inherit", colorScheme: "dark" }
    const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }
    const errText = (k: string) =>
        errors[k] ? (
            <div role="alert" style={{ color: C.error, fontSize: 13, marginTop: 6 }}>
                {errors[k]}
            </div>
        ) : null
    const btn = (primary: boolean): React.CSSProperties => ({
        padding: "13px 22px",
        borderRadius: 8,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        border: primary ? "none" : `1px solid ${C.ink}`,
        background: primary ? accent : "transparent",
        color: primary ? C.ivory : C.ink,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
    })
    const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: 14 }

    // ---------- success ----------
    if (status === "done") {
        return (
            <div style={{ ...props.style, background, color: C.ink, borderRadius: 24, padding: narrow ? 22 : 36, fontFamily: SANS, boxSizing: "border-box" }}>
                <div role="status">
                    <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.18em", color: accent }}>SOLICITUD RECIBIDA</div>
                    <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, textTransform: "uppercase", margin: "10px 0" }}>Gracias, {form.name.split(" ")[0]}.</h2>
                    <p style={{ lineHeight: 1.6 }}>
                        Guardamos tu solicitud para <strong>{exp.title}</strong>
                        {reference && (
                            <>
                                {" "}
                                con la referencia <strong>{reference}</strong>
                            </>
                        )}
                        .
                    </p>
                    <p style={{ lineHeight: 1.6, color: C.muted }}>El equipo revisará disponibilidad, anfitrión y requisitos, y te escribirá a {form.email}. Esto no es una reserva confirmada ni un cobro.</p>
                </div>
            </div>
        )
    }

    // ---------- main ----------
    return (
        <div style={{ ...props.style, background, color: C.ink, borderRadius: 24, padding: narrow ? 20 : 34, fontFamily: SANS, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: narrow ? 24 : 30, letterSpacing: "-0.02em", textTransform: "uppercase", margin: 0 }}>{props.title}</h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, border: `1px dashed ${C.muted}`, padding: "3px 8px", borderRadius: 6 }}>EXPERIENCIAS DE MUESTRA</span>
            </div>

            {/* progress */}
            <ol aria-label="Pasos" style={{ listStyle: "none", padding: 0, margin: "22px 0 26px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {STEPS.map((s, i) => (
                    <li key={s} aria-current={i === step ? "step" : undefined}>
                        <div style={{ height: 4, borderRadius: 4, background: i <= step ? accent : C.border }} />
                        <div style={{ fontSize: 12, marginTop: 6, fontWeight: i === step ? 800 : 500, color: i <= step ? C.ink : C.muted }}>
                            {narrow ? (i === step ? `${i + 1}/4 · ${s}` : "") : `${i + 1}. ${s}`}
                        </div>
                    </li>
                ))}
            </ol>

            {/* step 1: experience */}
            {step === 0 && (
                <div role="radiogroup" aria-label="Elige una experiencia" style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: 12 }}>
                    {EXPERIENCES.map((e) => {
                        const on = e.id === expId
                        return (
                            <button
                                key={e.id}
                                role="radio"
                                aria-checked={on}
                                onClick={() => setExpId(e.id)}
                                style={{ display: "flex", gap: 12, alignItems: "center", textAlign: "left", padding: 10, borderRadius: 16, border: `2px solid ${on ? accent : C.border}`, background: C.white, cursor: "pointer", color: C.ink, fontFamily: "inherit" }}
                            >
                                <img src={e.image} alt="" loading="lazy" style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0, background: C.forest }} />
                                <span>
                                    <strong style={{ fontFamily: SANS, display: "block" }}>{e.title}</strong>
                                    <span style={{ fontSize: 13, color: C.muted }}>
                                        {e.place} · {e.days} días · {e.quest}
                                    </span>
                                </span>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* step 2: date & group */}
            {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={grid2}>
                        <div>
                            <label style={label} htmlFor="ob-date">
                                Fecha de inicio
                            </label>
                            <input id="ob-date" type="date" min={today} value={form.date} onChange={(e) => set("date", e.target.value)} style={field} />
                            {errText("date")}
                            <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Temporada recomendada: {exp.season}</div>
                        </div>
                        <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, paddingTop: narrow ? 0 : 26 }}>
                            <input type="checkbox" style={{ accentColor: accent }} checked={form.flexible} onChange={(e) => set("flexible", e.target.checked)} />
                            Mis fechas son flexibles (± 1 semana)
                        </label>
                    </div>
                    <div style={grid2}>
                        <div>
                            <label style={label} htmlFor="ob-adults">
                                Adultos
                            </label>
                            <input id="ob-adults" type="number" min={1} max={exp.maxGroup} value={form.adults} onChange={(e) => set("adults", Math.max(0, Number(e.target.value) || 0))} style={field} />
                            {errText("adults")}
                        </div>
                        <div>
                            <label style={label} htmlFor="ob-minors">
                                Menores de edad
                            </label>
                            <input id="ob-minors" type="number" min={0} value={form.minors} onChange={(e) => set("minors", Math.max(0, Number(e.target.value) || 0))} style={field} disabled={exp.minAge >= 18} />
                            {errText("minors")}
                            <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Edad mínima indicativa: {exp.minAge} años</div>
                        </div>
                    </div>
                    <div>
                        <label style={label} htmlFor="ob-exp">
                            Experiencia previa en esta actividad
                        </label>
                        <select id="ob-exp" value={form.experience} onChange={(e) => set("experience", e.target.value)} style={field}>
                            <option value="primera vez">Es mi primera vez</option>
                            <option value="algo de experiencia">Algo de experiencia</option>
                            <option value="experiencia regular">Práctico con regularidad</option>
                            <option value="avanzada">Experiencia avanzada</option>
                        </select>
                    </div>
                    <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, fontSize: 14 }}>
                        <strong>Requisitos de {exp.title}:</strong> {exp.requirements.join(" · ")}. La participación final la decide el guía responsable.
                    </div>
                </div>
            )}

            {/* step 3: contact */}
            {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={grid2}>
                        <div>
                            <label style={label} htmlFor="ob-name">
                                Nombre completo
                            </label>
                            <input id="ob-name" value={form.name} onChange={(e) => set("name", e.target.value)} style={field} autoComplete="name" />
                            {errText("name")}
                        </div>
                        <div>
                            <label style={label} htmlFor="ob-email">
                                Email
                            </label>
                            <input id="ob-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={field} autoComplete="email" />
                            {errText("email")}
                        </div>
                    </div>
                    <div style={grid2}>
                        <div>
                            <label style={label} htmlFor="ob-phone">
                                Teléfono / WhatsApp (opcional)
                            </label>
                            <input id="ob-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={field} autoComplete="tel" placeholder="+56 9 …" />
                        </div>
                        <div>
                            <label style={label} htmlFor="ob-country">
                                País de residencia (opcional)
                            </label>
                            <input id="ob-country" value={form.country} onChange={(e) => set("country", e.target.value)} style={field} autoComplete="country-name" />
                        </div>
                    </div>
                    <div>
                        <label style={label} htmlFor="ob-notes">
                            ¿Algo que debamos saber? (opcional)
                        </label>
                        <textarea id="ob-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} style={{ ...field, resize: "vertical" }} placeholder="Alimentación, condición física, ocasión especial…" />
                    </div>
                </div>
            )}

            {/* step 4: review */}
            {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, borderRadius: 16, background: C.white, border: `1px solid ${C.border}` }}>
                        <img src={exp.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", background: C.forest }} />
                        <div>
                            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 18 }}>{exp.title}</div>
                            <div style={{ fontSize: 13, color: C.muted }}>
                                {exp.place} · {exp.quest} · {exp.level}
                            </div>
                        </div>
                    </div>
                    <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", margin: 0, fontSize: 15 }}>
                        <dt style={{ color: C.muted }}>Fechas</dt>
                        <dd style={{ margin: 0 }}>
                            {fmtDate(form.date)} → {fmtDate(form.date && addDays(form.date, exp.days))}
                            {form.flexible ? " (flexible)" : ""}
                        </dd>
                        <dt style={{ color: C.muted }}>Grupo</dt>
                        <dd style={{ margin: 0 }}>
                            {form.adults} adulto{form.adults !== 1 ? "s" : ""}
                            {form.minors ? `, ${form.minors} menor${form.minors !== 1 ? "es" : ""}` : ""}
                        </dd>
                        <dt style={{ color: C.muted }}>Contacto</dt>
                        <dd style={{ margin: 0 }}>
                            {form.name} · {form.email}
                        </dd>
                        <dt style={{ color: C.muted }}>Precio</dt>
                        <dd style={{ margin: 0 }}>Por confirmar en tu propuesta personalizada</dd>
                    </dl>
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
                        <input type="checkbox" checked={form.ack} onChange={(e) => set("ack", e.target.checked)} style={{ marginTop: 3, accentColor: accent }} />
                        <span>Entiendo que es una solicitud: no hay cobro ahora y la disponibilidad se confirma después.</span>
                    </label>
                    {errText("ack")}
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
                        <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} style={{ marginTop: 3, accentColor: accent }} />
                        <span>Acepto que Outdooroots use estos datos para responder a mi solicitud. (Texto legal de privacidad pendiente.)</span>
                    </label>
                    {errText("consent")}
                    {status === "error" && (
                        <div role="alert" style={{ padding: 12, borderRadius: 12, background: "rgba(255,59,48,0.1)", color: C.error, fontSize: 14 }}>
                            {serverError} Tu solicitud no se guardó.
                        </div>
                    )}
                </div>
            )}

            {/* navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
                {step > 0 ? (
                    <button onClick={back} style={btn(false)}>
                        ← Atrás
                    </button>
                ) : (
                    <span />
                )}
                {step < 3 ? (
                    <button onClick={next} style={btn(true)}>
                        Continuar →
                    </button>
                ) : (
                    <button onClick={submit} disabled={status === "sending"} style={{ ...btn(true), opacity: status === "sending" ? 0.7 : 1 }}>
                        {status === "sending" ? "Enviando…" : apiUrl ? "Enviar solicitud" : "Descargar borrador"}
                    </button>
                )}
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: "16px 0 0" }}>
                {apiUrl
                    ? "Tu solicitud sólo se confirma cuando queda guardada en nuestro sistema. No es una reserva ni un pago."
                    : "Formulario aún no conectado: se descargará un borrador en tu dispositivo y no se enviará a nadie."}
            </p>
        </div>
    )
}

addPropertyControls(ORBookingForm, {
    apiUrl: { type: ControlType.String, title: "API URL", defaultValue: "", placeholder: "https://tu-backend.vercel.app" },
    defaultExperience: {
        type: ControlType.Enum,
        title: "Experiencia",
        options: EXPERIENCES.map((e) => e.id),
        optionTitles: EXPERIENCES.map((e) => e.title),
        defaultValue: "colico-mtb",
    },
    title: { type: ControlType.String, title: "Título", defaultValue: "Solicita tu experiencia" },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
    background: { type: ControlType.Color, title: "Fondo", defaultValue: "#181B22" },
})
