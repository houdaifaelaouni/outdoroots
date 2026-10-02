import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — footer (from the app UI).

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

type Item = { label: string; link: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORFooter(props: {
    brand: string
    tagline: string
    about: string
    col1Title: string
    col1: Item[]
    col2Title: string
    col2: Item[]
    legal: string
    accent: string
    style?: React.CSSProperties
}) {
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
    const col = (title: string, items: Item[]) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: props.accent }}>{title}</p>
            {items.map((i) =>
                i.link ? (
                    <a key={i.label} href={i.link} className="or-foot-link" style={{ fontSize: 14, color: "#9EA6B5", textDecoration: "none" }}>
                        {i.label}
                    </a>
                ) : (
                    <span key={i.label} style={{ fontSize: 14, color: "#9EA6B5" }}>
                        {i.label}
                    </span>
                )
            )}
        </div>
    )
    return (
        <footer ref={ref} style={{ ...props.style, width: "100%", background: "#090A0C", borderTop: "1px solid #262B35", fontFamily: SANS }}>
            <style>{`.or-foot-link{transition:color .2s ease}.or-foot-link:hover{color:#fff!important}.or-foot-link:focus-visible{outline:2px solid ${props.accent};outline-offset:3px}`}</style>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: `64px ${small ? 16 : 48}px` }}>
                <div style={{ display: "flex", flexDirection: small ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
                    <div>
                        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#FFFFFF" }}>{props.brand}</span>
                        <p style={{ margin: "4px 0 0", fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9EA6B5" }}>{props.tagline}</p>
                        <p style={{ margin: "16px 0 0", maxWidth: 300, fontSize: 12, lineHeight: 1.6, color: "rgba(158,166,181,.6)" }}>{props.about}</p>
                    </div>
                    <div style={{ display: "flex", gap: 48 }}>
                        {col(props.col1Title, props.col1)}
                        {col(props.col2Title, props.col2)}
                    </div>
                </div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #262B35", display: "flex", flexDirection: small ? "column" : "row", justifyContent: "space-between", gap: 12 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(158,166,181,.5)" }}>{props.legal}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(158,166,181,.5)" }}>
                        {props.brand} {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    )
}

const itemControl = {
    type: ControlType.Object,
    controls: {
        label: { type: ControlType.String, title: "Texto", defaultValue: "Enlace" },
        link: { type: ControlType.Link, title: "Link" },
    },
} as const

addPropertyControls(ORFooter, {
    brand: { type: ControlType.String, title: "Marca", defaultValue: "Outdooroots" },
    tagline: { type: ControlType.String, title: "Lema", defaultValue: "Aventura · Vida · Naturaleza" },
    about: {
        type: ControlType.String,
        title: "Descripción",
        displayTextArea: true,
        defaultValue: "Viajes de aventura basados en consultas en Chile. Propuestas revisadas por nuestro equipo: nada se confirma hasta conversar.",
    },
    col1Title: { type: ControlType.String, title: "Columna 1", defaultValue: "Explorar" },
    col1: {
        type: ControlType.Array,
        title: "Enlaces 1",
        control: itemControl,
        defaultValue: [
            { label: "Viajes", link: "#viajes" },
            { label: "Creador de viaje", link: "#creador" },
            { label: "Contacto", link: "/contact" },
        ],
    },
    col2Title: { type: ControlType.String, title: "Columna 2", defaultValue: "Regiones" },
    col2: {
        type: ControlType.Array,
        title: "Enlaces 2",
        control: itemControl,
        defaultValue: [
            { label: "Patagonia", link: "" },
            { label: "Atacama", link: "" },
            { label: "Santiago", link: "" },
            { label: "Isla de Pascua", link: "" },
            { label: "Región de los Lagos", link: "" },
        ],
    },
    legal: { type: ControlType.String, title: "Legal", defaultValue: "Los precios son estimaciones. No es un sistema de reservas." },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
})
