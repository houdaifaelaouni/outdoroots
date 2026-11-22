import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — "How booking works": 3 steps that remove the fear of committing.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const C = { navy: "#0A1345", blue: "#1B2978", muted: "rgba(10,19,69,0.62)", line: "rgba(10,19,69,0.1)" }
const HEAD = "Inter, system-ui, sans-serif"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"

type Step = { title: string; text: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORHowItWorks(props: { label: string; title: string; steps: Step[]; ctaLabel: string; ctaLink: string; accent: string; background: string; style?: React.CSSProperties }) {
    const ref = useRef<HTMLElement>(null)
    const [w, setW] = useState(1200)
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
    const stack = w < 760
    return (
        <section ref={ref} style={{ ...props.style, width: "100%", background: props.background, fontFamily: BODY, color: C.navy }}>
            <style>{`.or-hiw-cta:hover{filter:brightness(.94)}`}</style>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: stack ? "56px 16px" : "80px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 13, letterSpacing: "0.09em", textTransform: "uppercase", color: C.muted }}>{props.label}</div>
                <h2 style={{ margin: "10px 0 0", fontFamily: HEAD, fontWeight: 500, fontSize: stack ? 34 : 48, letterSpacing: "-0.055em", lineHeight: 1.05 }}>{props.title}</h2>
                <ol style={{ listStyle: "none", padding: 0, margin: "40px 0 0", display: "grid", gridTemplateColumns: stack ? "1fr" : `repeat(${props.steps.length}, 1fr)`, gap: stack ? 14 : 20, textAlign: "left" }}>
                    {props.steps.map((s, i) => (
                        <li key={s.title} style={{ padding: 24, borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.line}` }}>
                            <span aria-hidden="true" style={{ display: "inline-flex", width: 36, height: 36, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: props.accent, color: "#FFFFFF", fontWeight: 600 }}>
                                {i + 1}
                            </span>
                            <div style={{ marginTop: 16, fontFamily: HEAD, fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em" }}>{s.title}</div>
                            <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.5, color: C.muted }}>{s.text}</div>
                        </li>
                    ))}
                </ol>
                {props.ctaLabel && (
                    <a href={props.ctaLink} className="or-hiw-cta" style={{ display: "inline-block", marginTop: 32, padding: "15px 28px", borderRadius: 999, background: props.accent, color: "#FFFFFF", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
                        {props.ctaLabel}
                    </a>
                )}
            </div>
        </section>
    )
}

addPropertyControls(ORHowItWorks, {
    label: { type: ControlType.String, title: "Label", defaultValue: "How booking works" },
    title: { type: ControlType.String, title: "Title", defaultValue: "Simple, personal, no pressure" },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "Step" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: "" },
            },
        },
        defaultValue: [
            { title: "Send your request", text: "Pick a date and group size. It takes 2 minutes and costs nothing." },
            { title: "Get your personal quote", text: "We check availability with your guide and reply with dates and a full price." },
            { title: "Confirm only if it's right", text: "Ask anything, adjust the plan, and book only when you're happy." },
        ],
    },
    ctaLabel: { type: ControlType.String, title: "Button", defaultValue: "Request this trip" },
    ctaLink: { type: ControlType.Link, title: "Button link", defaultValue: "#reservar" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
    background: { type: ControlType.Color, title: "Background", defaultValue: "#F0F7FC" },
})
