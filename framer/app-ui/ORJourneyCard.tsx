import * as React from "react"
import { useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — journey / expedition card. Bind props to CMS fields.

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 380
 */
export default function ORJourneyCard(props: {
    image?: { src: string; alt?: string }
    tags: string[]
    days: string
    region: string
    title: string
    text: string
    actionLabel: string
    link: string
    accent: string
    style?: React.CSSProperties
}) {
    const { image = { src: "https://framerusercontent.com/images/1MGkuCqb2BZMEFZS8xYRNmiY.jpg", alt: "Patagonia" } } = props
    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-app-fonts")) {
            const l = document.createElement("link")
            l.id = "or-app-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
    }, [])
    return (
        <a href={props.link} className="or-journey" style={{ ...props.style, display: "flex", flexDirection: "column", width: "100%", borderRadius: 12, overflow: "hidden", background: "#181B22", border: "1px solid #262B35", textDecoration: "none", fontFamily: SANS, boxSizing: "border-box" }}>
            <style>{`
                .or-journey{transition:border-color .25s ease}
                .or-journey:hover{border-color:color-mix(in srgb, ${props.accent} 40%, transparent)!important}
                .or-journey .or-img{transition:transform .5s ease}
                .or-journey:hover .or-img{transform:scale(1.05)}
                .or-journey .or-arrow{transition:transform .2s ease}
                .or-journey:hover .or-arrow{transform:translateX(4px)}
                .or-journey:focus-visible{outline:2px solid ${props.accent};outline-offset:3px}
            `}</style>
            <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}>
                <img className="or-img" src={image.src} alt={image.alt || props.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(9,10,12,.8), transparent)" }} />
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {props.tags.map((t) => (
                        <span key={t} style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>
                            {t}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#9EA6B5", marginBottom: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        {props.days}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M3 20l6-10 4 6 3-4 5 8H3z" />
                        </svg>
                        {props.region}
                    </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#FFFFFF" }}>{props.title}</h3>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: "#9EA6B5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{props.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 20, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: props.accent }}>
                    {props.actionLabel}
                    <svg className="or-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </div>
            </div>
        </a>
    )
}

addPropertyControls(ORJourneyCard, {
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    tags: { type: ControlType.Array, title: "Etiquetas", control: { type: ControlType.String }, defaultValue: ["trekking", "naturaleza"], maxCount: 3 },
    days: { type: ControlType.String, title: "Duración", defaultValue: "6 días" },
    region: { type: ControlType.String, title: "Región", defaultValue: "Patagonia" },
    title: { type: ControlType.String, title: "Título", defaultValue: "Patagonia a pie" },
    text: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: "Cumbres de granito, aguas glaciares y tiempo para encontrar tu ritmo." },
    actionLabel: { type: ControlType.String, title: "Acción", defaultValue: "Personalizar" },
    link: { type: ControlType.Link, title: "Link" },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
})
