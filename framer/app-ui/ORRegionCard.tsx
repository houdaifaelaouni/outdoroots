import * as React from "react"
import { useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — region / chapter card (tall photo card). Bind props to CMS fields.

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 240
 * @framerIntrinsicHeight 320
 */
export default function ORRegionCard(props: { image?: { src: string; alt?: string }; chapter: string; name: string; tagline: string; link: string; accent: string; style?: React.CSSProperties }) {
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
        <a href={props.link} className="or-region" style={{ ...props.style, position: "relative", display: "block", width: "100%", height: "100%", minHeight: 240, borderRadius: 12, overflow: "hidden", border: "1px solid #262B35", textDecoration: "none", fontFamily: SANS, boxSizing: "border-box" }}>
            <style>{`
                .or-region{transition:border-color .25s ease}
                .or-region:hover{border-color:color-mix(in srgb, ${props.accent} 40%, transparent)!important}
                .or-region img{transition:transform .5s ease}
                .or-region:hover img{transform:scale(1.05)}
                .or-region:focus-visible{outline:2px solid ${props.accent};outline-offset:3px}
            `}</style>
            <img src={image.src} alt={image.alt || props.name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(9,10,12,.9) 0%, rgba(9,10,12,.3) 50%, transparent 100%)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: props.accent }}>{props.chapter}</span>
                <h3 style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#FFFFFF" }}>{props.name}</h3>
                <p style={{ margin: "4px 0 0", fontSize: 11, lineHeight: 1.35, color: "rgba(255,255,255,.5)" }}>{props.tagline}</p>
            </div>
        </a>
    )
}

addPropertyControls(ORRegionCard, {
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    chapter: { type: ControlType.String, title: "Capítulo", defaultValue: "01" },
    name: { type: ControlType.String, title: "Nombre", defaultValue: "Patagonia" },
    tagline: { type: ControlType.String, title: "Lema", defaultValue: "El fin del mundo" },
    link: { type: ControlType.Link, title: "Link" },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
})
