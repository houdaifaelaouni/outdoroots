import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — photo call-to-action banner (from the app UI).

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORCtaBanner(props: { image?: { src: string; alt?: string }; eyebrow: string; title: string; text: string; buttonLabel: string; link: string; accent: string; style?: React.CSSProperties }) {
    const { image = { src: "https://framerusercontent.com/images/PkPXO6HgiDKi4SX9i4cRSGumXo.jpg", alt: "" } } = props
    const ref = useRef<HTMLDivElement>(null)
    const [w, setW] = useState(1200)
    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-app-fonts")) {
            const l = document.createElement("link")
            l.id = "or-app-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
        if (!ref.current || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((e) => setW(e[0].contentRect.width))
        ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])
    const small = w < 640
    return (
        <div ref={ref} style={{ ...props.style, position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", fontFamily: SANS, background: "#090A0C" }}>
            <style>{`.or-cta-btn:hover{filter:brightness(.9)}.or-cta-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}`}</style>
            <img src={image.src} alt={image.alt || ""} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(9,10,12,.75)" }} />
            <div style={{ position: "relative", padding: small ? "64px 24px" : "96px 64px", textAlign: "center" }}>
                <span style={{ display: "block", marginBottom: 16, fontFamily: MONO, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: props.accent }}>{props.eyebrow}</span>
                <h2 style={{ margin: "0 auto", maxWidth: 680, fontSize: small ? 26 : 38, fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1.15, color: "#FFFFFF" }}>{props.title}</h2>
                <p style={{ margin: "16px auto 0", maxWidth: 520, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,.6)" }}>{props.text}</p>
                <a href={props.link} className="or-cta-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, padding: "14px 32px", background: props.accent, color: "#FFFFFF", fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 8, textDecoration: "none" }}>
                    {props.buttonLabel}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

addPropertyControls(ORCtaBanner, {
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: "¿Listo para partir?" },
    title: { type: ControlType.String, title: "Título", defaultValue: "Diseñemos tu próxima expedición" },
    text: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: "Cuéntanos qué te gustaría vivir. Nuestro equipo revisa cada propuesta antes de confirmar nada." },
    buttonLabel: { type: ControlType.String, title: "Botón", defaultValue: "Empezar" },
    link: { type: ControlType.Link, title: "Link" },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
})
