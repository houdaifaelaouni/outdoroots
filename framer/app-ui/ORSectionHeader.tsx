import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — section heading (eyebrow + uppercase title + optional side text).

const FONTS = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORSectionHeader(props: { eyebrow: string; title: string; text: string; accent: string; textColor: string; style?: React.CSSProperties }) {
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
    const stack = w < 720
    return (
        <div ref={ref} style={{ ...props.style, width: "100%", display: "flex", flexDirection: stack ? "column" : "row", alignItems: stack ? "flex-start" : "flex-end", justifyContent: "space-between", gap: 24, fontFamily: SANS }}>
            <div>
                <span style={{ display: "block", marginBottom: 12, fontFamily: MONO, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: props.accent }}>{props.eyebrow}</span>
                <h2 style={{ margin: 0, fontSize: w < 640 ? 26 : 38, fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1.15, color: props.textColor }}>{props.title}</h2>
            </div>
            {props.text && <p style={{ margin: 0, maxWidth: 440, fontSize: 14, lineHeight: 1.65, color: "#9EA6B5" }}>{props.text}</p>}
        </div>
    )
}

addPropertyControls(ORSectionHeader, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: "Puntos de partida" },
    title: { type: ControlType.String, title: "Título", defaultValue: "Expediciones de autor" },
    text: {
        type: ControlType.String,
        title: "Texto",
        displayTextArea: true,
        defaultValue: "Conceptos de viaje editables, no salidas fijas. Cada ruta, alojamiento y precio se revisa antes de confirmar.",
    },
    accent: { type: ControlType.Color, title: "Acento", defaultValue: "#FF3B30" },
    textColor: { type: ControlType.Color, title: "Título color", defaultValue: "#FFFFFF" },
})
