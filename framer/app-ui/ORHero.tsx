import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — full-bleed hero (from the app UI). Self-contained Framer code component.

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

type Stat = { title: string; text: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight any
 */
export default function ORHero(props: {
    image?: { src: string; alt?: string }
    badge: string
    titleLine1: string
    titleLine2: string
    subtitle: string
    primaryLabel: string
    primaryLink: string
    secondaryLabel: string
    secondaryLink: string
    stats: Stat[]
    accent: string
    minHeight: number
    style?: React.CSSProperties
}) {
    const { image = { src: "https://framerusercontent.com/images/HjXahjunP7W3osO050Nu6mSdTOo.jpg", alt: "Expedición en Torres del Paine" } } = props
    const ref = useRef<HTMLElement>(null)
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
    const big = w >= 1024
    const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 8, textDecoration: "none", color: "#FFFFFF" }

    return (
        <section ref={ref} style={{ ...props.style, position: "relative", width: "100%", height: "100%", minHeight: props.minHeight, display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#090A0C", fontFamily: SANS }}>
            <style>{`
                .or-hero-p:hover{filter:brightness(.9)}
                .or-hero-p:hover svg{transform:translateX(4px)}
                .or-hero-p svg{transition:transform .2s ease}
                .or-hero-s:hover{background:rgba(255,255,255,.1)}
                .or-hero a:focus-visible{outline:2px solid ${props.accent};outline-offset:3px}
            `}</style>
            <img src={image.src} alt={image.alt || ""} loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #090A0C 0%, rgba(9,10,12,.5) 50%, rgba(9,10,12,.2) 100%)" }} />

            <div className="or-hero" style={{ position: "relative", width: "100%", maxWidth: 1280, margin: "0 auto", padding: `160px ${small ? 16 : 48}px ${small ? 64 : 96}px`, boxSizing: "border-box" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, border: `1px solid color-mix(in srgb, ${props.accent} 30%, transparent)`, background: `color-mix(in srgb, ${props.accent} 10%, transparent)`, marginBottom: 32 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={props.accent} strokeWidth="2" aria-hidden="true">
                        <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
                        <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: props.accent }}>{props.badge}</span>
                </div>

                <h1 style={{ margin: 0, fontSize: big ? 72 : small ? 38 : 52, fontWeight: 800, letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 0.95, color: "#FFFFFF", maxWidth: 900 }}>
                    {props.titleLine1}
                    <br />
                    <span style={{ color: props.accent }}>{props.titleLine2}</span>
                </h1>

                <p style={{ margin: "24px 0 0", fontSize: small ? 16 : 18, lineHeight: 1.6, color: "rgba(255,255,255,.7)", maxWidth: 560 }}>{props.subtitle}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 40 }}>
                    <a href={props.primaryLink} className="or-hero-p" style={{ ...btn, background: props.accent }}>
                        {props.primaryLabel}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </a>
                    {props.secondaryLabel && (
                        <a href={props.secondaryLink} className="or-hero-s" style={{ ...btn, border: "1px solid rgba(255,255,255,.25)", backdropFilter: "blur(4px)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M16 8l-2 6-6 2 2-6 6-2z" />
                            </svg>
                            {props.secondaryLabel}
                        </a>
                    )}
                </div>

                {props.stats.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${props.stats.length}, 1fr)`, gap: 24, marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.15)", maxWidth: 520 }}>
                        {props.stats.map((s) => (
                            <div key={s.title}>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{s.title}</p>
                                <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,.5)" }}>{s.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(ORHero, {
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    badge: { type: ControlType.String, title: "Etiqueta", defaultValue: "Diseñadores de expediciones en Chile" },
    titleLine1: { type: ControlType.String, title: "Título 1", defaultValue: "Descubre la" },
    titleLine2: { type: ControlType.String, title: "Título 2", defaultValue: "Naturaleza salvaje" },
    subtitle: {
        type: ControlType.String,
        title: "Subtítulo",
        displayTextArea: true,
        defaultValue: "Itinerarios de expedición a medida por Patagonia, Atacama, Isla de Pascua y más. Diseñados por locales, creados para aventureros.",
    },
    primaryLabel: { type: ControlType.String, title: "Botón 1", defaultValue: "Diseñar mi viaje" },
    primaryLink: { type: ControlType.Link, title: "Link 1" },
    secondaryLabel: { type: ControlType.String, title: "Botón 2", defaultValue: "Explorar viajes" },
    secondaryLink: { type: ControlType.Link, title: "Link 2" },
    stats: {
        type: ControlType.Array,
        title: "Datos",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Título", defaultValue: "5 regiones" },
                text: { type: ControlType.String, title: "Texto", defaultValue: "Costa a cumbres" },
            },
        },
        defaultValue: [
            { title: "5 regiones", text: "Costa a cumbres" },
            { title: "Rutas a medida", text: "Tu ritmo, tu estilo" },
            { title: "Expertos locales", text: "Conocimiento real" },
        ],
    },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
    minHeight: { type: ControlType.Number, title: "Alto mín.", min: 400, max: 1200, step: 10, defaultValue: 760, unit: "px" },
})
