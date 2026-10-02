import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Outdooroots — "Is this trip for you?" block: difficulty, effort and requirements.
// Fill these in per trip (or bind to CMS fields). Defaults are placeholders.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const C = { navy: "#0A1345", blue: "#1B2978", muted: "rgba(10,19,69,0.62)", line: "rgba(10,19,69,0.1)" }
const HEAD = "Inter, system-ui, sans-serif"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"
const LEVELS = ["Easy", "Moderate", "Active", "Challenging", "Demanding"]

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORFitCheck(props: {
    title: string
    difficulty: number
    hoursPerDay: string
    elevation: string
    fitness: string
    requirements: string[]
    note: string
    accent: string
    style?: React.CSSProperties
}) {
    const ref = useRef<HTMLElement>(null)
    const [w, setW] = useState(800)
    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-site-fonts")) {
            const l = document.createElement("link")
            l.id = "or-site-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
        if (!ref.current || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((e) => setW(e[0].contentRect.width))
        ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])
    const d = Math.min(5, Math.max(1, Math.round(props.difficulty)))
    const placeholder = [props.hoursPerDay, props.elevation, props.fitness].some((t) => t.includes("["))
    const fact = (label: string, value: string) => (
        <div style={{ padding: 16, borderRadius: 14, background: "#FFFFFF", border: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 13, letterSpacing: "0.09em", textTransform: "uppercase", color: C.muted }}>{label}</div>
            <div style={{ marginTop: 6, fontSize: 16, fontWeight: 500 }}>{value}</div>
        </div>
    )
    return (
        <section ref={ref} style={{ ...props.style, width: "100%", fontFamily: BODY, color: C.navy }}>
            {placeholder && RenderTarget.current() === RenderTarget.canvas && (
                <div style={{ marginBottom: 10, padding: "6px 10px", borderRadius: 8, background: "#FFF4E5", color: "#8A4B00", fontSize: 12 }}>Editor only: replace the [bracketed] placeholders with this trip's real details.</div>
            )}
            <h2 style={{ margin: "0 0 18px", fontFamily: HEAD, fontWeight: 500, fontSize: 30, letterSpacing: "-0.045em" }}>{props.title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: w < 560 ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div style={{ padding: 16, borderRadius: 14, background: "#FFFFFF", border: `1px solid ${C.line}` }}>
                    <div style={{ fontSize: 13, letterSpacing: "0.09em", textTransform: "uppercase", color: C.muted }}>Difficulty</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                        <div role="img" aria-label={`Difficulty ${d} of 5: ${LEVELS[d - 1]}`} style={{ display: "flex", gap: 5 }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span key={i} style={{ width: 22, height: 8, borderRadius: 4, background: i <= d ? props.accent : "rgba(10,19,69,0.12)" }} />
                            ))}
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 500 }}>{LEVELS[d - 1]}</span>
                    </div>
                </div>
                {fact("Walking per day", props.hoursPerDay)}
                {fact("Elevation", props.elevation)}
                {fact("Fitness", props.fitness)}
            </div>
            {props.requirements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
                    {props.requirements.map((r) => (
                        <li key={r} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15, lineHeight: 1.45 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={props.accent} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                            {r}
                        </li>
                    ))}
                </ul>
            )}
            {props.note && <p style={{ margin: "16px 0 0", fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{props.note}</p>}
        </section>
    )
}

addPropertyControls(ORFitCheck, {
    title: { type: ControlType.String, title: "Title", defaultValue: "Is this trip for you?" },
    difficulty: { type: ControlType.Number, title: "Difficulty", min: 1, max: 5, step: 1, defaultValue: 3, displayStepper: true },
    hoursPerDay: { type: ControlType.String, title: "Hours/day", defaultValue: "[e.g. 5–8 hours]" },
    elevation: { type: ControlType.String, title: "Elevation", defaultValue: "[e.g. up to 900 m gain]" },
    fitness: { type: ControlType.String, title: "Fitness", defaultValue: "[e.g. Good — regular hiker]" },
    requirements: { type: ControlType.Array, title: "Requirements", control: { type: ControlType.String }, defaultValue: ["No technical climbing experience needed", "Comfortable hiking several hours with a day pack"] },
    note: { type: ControlType.String, title: "Note", displayTextArea: true, defaultValue: "Not sure? Tell us about your experience in the request — your guide confirms the right fit before anything is booked." },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
})
