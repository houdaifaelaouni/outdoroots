import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — navbar (from the app UI). Self-contained Framer code component.

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

type NavLink = { label: string; link: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORNavbar(props: {
    brand: string
    tagline: string
    links: NavLink[]
    ctaLabel: string
    ctaLink: string
    accent: string
    background: string
    style?: React.CSSProperties
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [narrow, setNarrow] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-app-fonts")) {
            const l = document.createElement("link")
            l.id = "or-app-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
        if (!ref.current || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((e) => setNarrow(e[0].contentRect.width < 768))
        ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])

    return (
        <header ref={ref} style={{ ...props.style, width: "100%", background: props.background, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #262B35", fontFamily: SANS, boxSizing: "border-box" }}>
            <style>{`
                .or-nav a{transition:color .2s ease}
                .or-nav a.or-link:hover{color:#FFFFFF}
                .or-nav a.or-cta:hover{filter:brightness(.9)}
                .or-nav a:focus-visible,.or-nav button:focus-visible{outline:2px solid ${props.accent};outline-offset:3px}
            `}</style>
            <div className="or-nav" style={{ maxWidth: 1280, margin: "0 auto", padding: narrow ? "0 16px" : "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FFFFFF" }}>{props.brand}</span>
                    {!narrow && <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9EA6B5" }}>{props.tagline}</span>}
                </div>
                {narrow ? (
                    <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} style={{ background: "none", border: "none", color: "#FFFFFF", cursor: "pointer", padding: 6 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                ) : (
                    <nav aria-label="Principal" style={{ display: "flex", alignItems: "center", gap: 32 }}>
                        {props.links.map((l) => (
                            <a key={l.label} href={l.link} className="or-link" style={{ fontSize: 14, color: "#9EA6B5", textDecoration: "none" }}>
                                {l.label}
                            </a>
                        ))}
                        <a href={props.ctaLink} className="or-cta" style={{ padding: "8px 20px", background: props.accent, color: "#FFFFFF", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 8, textDecoration: "none" }}>
                            {props.ctaLabel}
                        </a>
                    </nav>
                )}
            </div>
            {narrow && open && (
                <nav aria-label="Menú móvil" className="or-nav" style={{ borderTop: "1px solid #262B35", padding: "12px 16px 16px", display: "flex", flexDirection: "column" }}>
                    {props.links.map((l) => (
                        <a key={l.label} href={l.link} className="or-link" onClick={() => setOpen(false)} style={{ padding: "12px 0", fontSize: 14, color: "#9EA6B5", textDecoration: "none" }}>
                            {l.label}
                        </a>
                    ))}
                    <a href={props.ctaLink} className="or-cta" style={{ marginTop: 8, padding: "12px 20px", background: props.accent, color: "#FFFFFF", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 8, textDecoration: "none", textAlign: "center" }}>
                        {props.ctaLabel}
                    </a>
                </nav>
            )}
        </header>
    )
}

addPropertyControls(ORNavbar, {
    brand: { type: ControlType.String, title: "Marca", defaultValue: "Outdooroots" },
    tagline: { type: ControlType.String, title: "Lema", defaultValue: "Aventura · Vida · Naturaleza" },
    links: {
        type: ControlType.Array,
        title: "Enlaces",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Texto", defaultValue: "Viajes" },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
        defaultValue: [
            { label: "Viajes", link: "#viajes" },
            { label: "Destinos", link: "#destinos" },
            { label: "Creador de viaje", link: "#creador" },
        ],
    },
    ctaLabel: { type: ControlType.String, title: "Botón", defaultValue: "Planear viaje" },
    ctaLink: { type: ControlType.Link, title: "Link botón" },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
    background: { type: ControlType.Color, title: "Fondo", defaultValue: "rgba(9,10,12,0.85)" },
})
