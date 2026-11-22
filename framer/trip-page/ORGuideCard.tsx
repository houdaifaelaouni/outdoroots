import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Outdooroots — "Your guide" card. Use a real, authorised photo and real facts.
// The "Verified" badge only shows when you switch it on.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const C = { navy: "#0A1345", blue: "#1B2978", muted: "rgba(10,19,69,0.62)", line: "rgba(10,19,69,0.1)" }
const HEAD = "Inter, system-ui, sans-serif"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"
const SERIF = "Spectral, Georgia, serif"

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORGuideCard(props: {
    sectionTitle: string
    photo?: { src: string; alt?: string }
    name: string
    role: string
    languages: string
    experience: string
    quote: string
    verified: boolean
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
    const stack = w < 520
    const placeholder = props.name.includes("[") || !props.photo?.src
    return (
        <section ref={ref} style={{ ...props.style, width: "100%", fontFamily: BODY, color: C.navy }}>
            {placeholder && RenderTarget.current() === RenderTarget.canvas && (
                <div style={{ marginBottom: 10, padding: "6px 10px", borderRadius: 8, background: "#FFF4E5", color: "#8A4B00", fontSize: 12 }}>Editor only: add the guide's real name, photo (with permission) and facts.</div>
            )}
            <h2 style={{ margin: "0 0 18px", fontFamily: HEAD, fontWeight: 500, fontSize: 30, letterSpacing: "-0.045em" }}>{props.sectionTitle}</h2>
            <div style={{ display: "flex", flexDirection: stack ? "column" : "row", gap: 20, padding: 20, borderRadius: 18, background: "#FFFFFF", border: `1px solid ${C.line}` }}>
                {props.photo?.src ? (
                    <img src={props.photo.src} alt={props.photo.alt || props.name} loading="lazy" style={{ width: stack ? "100%" : 140, height: stack ? 220 : 160, objectFit: "cover", borderRadius: 14, flexShrink: 0 }} />
                ) : (
                    <div aria-hidden="true" style={{ width: stack ? "100%" : 140, height: stack ? 160 : 160, borderRadius: 14, background: "#EDF4FA", display: "flex", alignItems: "center", justifyContent: "center", color: C.blue, fontFamily: HEAD, fontSize: 40, flexShrink: 0 }}>
                        {props.name.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "").trim().charAt(0) || "?"}
                    </div>
                )}
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                        <div style={{ fontFamily: HEAD, fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em" }}>{props.name}</div>
                        {props.verified && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, background: "#EDF4FA", color: C.blue, fontSize: 12, fontWeight: 600 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                                </svg>
                                Verified guide
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>{props.role}</div>
                    <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", margin: "14px 0 0", fontSize: 14 }}>
                        <dt style={{ color: C.muted }}>Languages</dt>
                        <dd style={{ margin: 0 }}>{props.languages}</dd>
                        <dt style={{ color: C.muted }}>Experience</dt>
                        <dd style={{ margin: 0 }}>{props.experience}</dd>
                    </dl>
                    {props.quote && <p style={{ margin: "14px 0 0", fontFamily: SERIF, fontSize: 19, lineHeight: 1.35, letterSpacing: "-0.02em" }}>“{props.quote}”</p>}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ORGuideCard, {
    sectionTitle: { type: ControlType.String, title: "Title", defaultValue: "Who you'll travel with" },
    photo: { type: ControlType.ResponsiveImage, title: "Photo" },
    name: { type: ControlType.String, title: "Name", defaultValue: "[Guide name]" },
    role: { type: ControlType.String, title: "Role", defaultValue: "Lead mountain guide" },
    languages: { type: ControlType.String, title: "Languages", defaultValue: "[e.g. Spanish, English]" },
    experience: { type: ControlType.String, title: "Experience", defaultValue: "[e.g. 10 years guiding in Patagonia]" },
    quote: { type: ControlType.String, title: "Quote", displayTextArea: true, defaultValue: "" },
    verified: { type: ControlType.Boolean, title: "Verified", defaultValue: false, enabledTitle: "Yes", disabledTitle: "No" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
})
