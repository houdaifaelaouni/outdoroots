import * as React from "react"
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — booking card for the trip page (4 fields + "what happens next").
// In Framer, set this layer's Position to "Sticky" (top 100) so it follows the scroll.
// Bind "Trip" to the CMS Title. Requests go to the Outdooroots backend when an
// API URL is set; success is only shown after the server stores the request.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const C = { navy: "#0A1345", blue: "#1B2978", muted: "rgba(10,19,69,0.62)", line: "rgba(10,19,69,0.12)", field: "#F0F7FC", error: "#C0392B" }
const HEAD = "Inter, system-ui, sans-serif"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 400
 */
export default function ORBookingCard(props: {
    trip: string
    price: string
    meta: string
    buttonLabel: string
    note: string
    steps: string[]
    whatsapp: string
    apiUrl: string
    anchorId: string
    accent: string
    style?: React.CSSProperties
}) {
    const [f, setF] = useState({ date: "", travelers: 2, name: "", email: "", phone: "", message: "", consent: false })
    const [more, setMore] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
    const [serverErr, setServerErr] = useState("")
    const [reference, setReference] = useState("")
    const today = new Date().toISOString().slice(0, 10)

    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-site-fonts")) {
            const l = document.createElement("link")
            l.id = "or-site-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
    }, [])

    const set = (k: string, v: any) => {
        setF((x) => ({ ...x, [k]: v }))
        setErrors((e) => {
            if (!e[k]) return e
            const { [k]: _d, ...rest } = e
            return rest
        })
    }

    function validate() {
        const e: Record<string, string> = {}
        if (!f.date) e.date = "Choose a start date."
        else if (f.date < today) e.date = "Choose a future date."
        if (f.travelers < 1) e.travelers = "At least 1 traveler."
        if (!f.name.trim()) e.name = "Add your name."
        if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Add a valid email."
        if (!f.consent) e.consent = "We need your consent to reply."
        setErrors(e)
        return Object.keys(e).length === 0
    }

    function draft() {
        const text = [
            `Outdooroots — trip request (DRAFT, not sent)`,
            `Trip: ${props.trip}`,
            `Start date: ${f.date}`,
            `Travelers: ${f.travelers}`,
            `Name: ${f.name}`,
            `Email: ${f.email}`,
            `Phone: ${f.phone || "—"}`,
            `Message: ${f.message || "—"}`,
            "",
            "This draft was created on your device. It was not sent to anyone.",
        ].join("\n")
        const a = document.createElement("a")
        a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }))
        a.download = "outdooroots-trip-request.txt"
        a.click()
        URL.revokeObjectURL(a.href)
    }

    async function submit(ev: React.FormEvent) {
        ev.preventDefault()
        if (!validate()) return
        if (!props.apiUrl) return draft()
        setState("sending")
        setServerErr("")
        try {
            const res = await fetch(`${props.apiUrl.replace(/\/$/, "")}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    package_name: props.trip,
                    travelers: f.travelers,
                    language: "en",
                    start_date: f.date,
                    total_days: 0,
                    subtotal: 0,
                    tax: 0,
                    total_price: 0,
                    destinations: [],
                    itinerary: [],
                    brief: { kind: "booking_request", source: "framer-trip-page", consent: true, consent_at: new Date().toISOString() },
                    contact: { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), notes: f.message.trim() },
                }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.detail || "We couldn't save your request.")
            setReference(data.reference || "")
            setState("done")
        } catch (err: any) {
            setState("error")
            setServerErr(err instanceof TypeError ? "We couldn't reach the server. Check your connection and try again." : err.message)
        }
    }

    const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.field, color: C.navy, fontSize: 15, fontFamily: BODY }
    const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: C.navy }
    const err = (k: string) =>
        errors[k] ? (
            <div role="alert" style={{ color: C.error, fontSize: 13, marginTop: 5 }}>
                {errors[k]}
            </div>
        ) : null
    const card: React.CSSProperties = { ...props.style, width: "100%", boxSizing: "border-box", background: "#FFFFFF", borderRadius: 18, border: `1px solid ${C.line}`, boxShadow: "0 18px 40px rgba(10,19,69,0.08)", padding: 24, fontFamily: BODY, color: C.navy }

    if (state === "done")
        return (
            <div id={props.anchorId} role="status" style={card}>
                <div style={{ fontSize: 13, letterSpacing: "0.09em", textTransform: "uppercase", color: props.accent }}>Request received</div>
                <div style={{ fontFamily: HEAD, fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em", margin: "8px 0" }}>Thanks, {f.name.split(" ")[0]}!</div>
                <p style={{ margin: 0, lineHeight: 1.55, fontSize: 15 }}>
                    We saved your request for <strong>{props.trip}</strong>
                    {reference ? (
                        <>
                            {" "}
                            (ref. <strong>{reference}</strong>)
                        </>
                    ) : null}
                    . We'll email {f.email} with dates and a personal quote. Nothing is booked or charged yet.
                </p>
            </div>
        )

    return (
        <div id={props.anchorId} style={card}>
            <style>{`.or-bc-btn:hover{filter:brightness(.94)}.or-bc input:focus,.or-bc textarea:focus{outline:2px solid ${props.accent};outline-offset:1px}`}</style>
            <div style={{ fontFamily: HEAD, fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em" }}>{props.price}</div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{props.meta}</div>
            <div style={{ height: 1, background: C.line, margin: "18px 0" }} />

            <form className="or-bc" onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                    <div>
                        <label style={label} htmlFor="bc-date">
                            Start date
                        </label>
                        <input id="bc-date" type="date" min={today} value={f.date} onChange={(e) => set("date", e.target.value)} style={field} />
                        {err("date")}
                    </div>
                    <div>
                        <label style={label} htmlFor="bc-trav">
                            Travelers
                        </label>
                        <div style={{ ...field, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px" }}>
                            <button type="button" aria-label="Fewer travelers" onClick={() => set("travelers", Math.max(1, f.travelers - 1))} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`, background: "#FFF", cursor: "pointer", color: C.navy, fontSize: 18, lineHeight: 1 }}>
                                −
                            </button>
                            <output id="bc-trav" aria-live="polite" style={{ fontWeight: 600 }}>
                                {f.travelers}
                            </output>
                            <button type="button" aria-label="More travelers" onClick={() => set("travelers", Math.min(20, f.travelers + 1))} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`, background: "#FFF", cursor: "pointer", color: C.navy, fontSize: 18, lineHeight: 1 }}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label style={label} htmlFor="bc-name">
                        Full name
                    </label>
                    <input id="bc-name" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" style={field} />
                    {err("name")}
                </div>
                <div>
                    <label style={label} htmlFor="bc-email">
                        Email
                    </label>
                    <input id="bc-email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" style={field} />
                    {err("email")}
                </div>
                {more ? (
                    <>
                        <div>
                            <label style={label} htmlFor="bc-phone">
                                Phone / WhatsApp (optional)
                            </label>
                            <input id="bc-phone" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" style={field} />
                        </div>
                        <div>
                            <label style={label} htmlFor="bc-msg">
                                Message (optional)
                            </label>
                            <textarea id="bc-msg" rows={3} value={f.message} onChange={(e) => set("message", e.target.value)} style={{ ...field, resize: "vertical" }} />
                        </div>
                    </>
                ) : (
                    <button type="button" onClick={() => setMore(true)} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 0, color: C.blue, fontSize: 14, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: BODY }}>
                        + Add phone or message
                    </button>
                )}
                <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: C.muted, lineHeight: 1.4 }}>
                    <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} style={{ marginTop: 2, accentColor: props.accent }} />
                    <span>I agree that Outdooroots uses these details to reply to my request.</span>
                </label>
                {err("consent")}
                {state === "error" && (
                    <div role="alert" style={{ padding: 10, borderRadius: 10, background: "rgba(192,57,43,0.08)", color: C.error, fontSize: 14 }}>
                        {serverErr} Your request was not saved.
                    </div>
                )}
                <button type="submit" className="or-bc-btn" disabled={state === "sending"} style={{ width: "100%", padding: "15px 20px", borderRadius: 999, border: "none", background: props.accent, color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: BODY, opacity: state === "sending" ? 0.7 : 1 }}>
                    {state === "sending" ? "Sending…" : props.apiUrl ? props.buttonLabel : "Download request draft"}
                </button>
                <div style={{ textAlign: "center", fontSize: 13, color: C.muted }}>{props.apiUrl ? props.note : "Form not connected yet: a draft is saved on your device and nothing is sent."}</div>
            </form>

            {props.steps.length > 0 && (
                <>
                    <div style={{ height: 1, background: C.line, margin: "18px 0" }} />
                    <div style={{ fontSize: 13, letterSpacing: "0.09em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>What happens next</div>
                    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        {props.steps.map((s, i) => (
                            <li key={s} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
                                <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: "#F0F7FC", color: C.blue, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {i + 1}
                                </span>
                                {s}
                            </li>
                        ))}
                    </ol>
                </>
            )}
            {props.whatsapp && (
                <a href={`https://wa.me/${props.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in ${props.trip}`)}`} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 16, textAlign: "center", fontSize: 14, color: C.blue, fontWeight: 500 }}>
                    Prefer WhatsApp? Chat with us
                </a>
            )}
        </div>
    )
}

addPropertyControls(ORBookingCard, {
    trip: { type: ControlType.String, title: "Trip", defaultValue: "Patagonia on Foot" },
    price: { type: ControlType.String, title: "Price", defaultValue: "Price on request" },
    meta: { type: ControlType.String, title: "Meta", defaultValue: "6 days · October – April" },
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: "Request this trip" },
    note: { type: ControlType.String, title: "Note", defaultValue: "No payment now · Personal reply within 24h" },
    steps: { type: ControlType.Array, title: "Next steps", control: { type: ControlType.String }, maxCount: 4, defaultValue: ["We check your dates", "You get a personal quote", "You decide — no obligation"] },
    whatsapp: { type: ControlType.String, title: "WhatsApp", defaultValue: "", placeholder: "+56 9 1234 5678" },
    apiUrl: { type: ControlType.String, title: "API URL", defaultValue: "", placeholder: "https://your-backend.vercel.app" },
    anchorId: { type: ControlType.String, title: "Anchor id", defaultValue: "reservar" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
})
