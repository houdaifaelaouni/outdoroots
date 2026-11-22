import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — reassurance bar: 4 short promises under the hero.
// Only list promises that are true for every trip.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"

const ICONS: Record<string, string> = {
    guide: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7",
    group: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm8 0a3 3 0 1 0 0-6M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6m2-6c2.5.3 4 2.4 4 5",
    calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2",
    shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z",
    leaf: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7",
}

type Item = { icon: string; text: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORTrustBar(props: { items: Item[]; accent: string; textColor: string; background: string; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null)
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
    const cols = w < 700 ? 2 : Math.max(props.items.length, 1)
    return (
        <div ref={ref} style={{ ...props.style, width: "100%", background: props.background, borderTop: "1px solid rgba(10,19,69,0.07)", borderBottom: "1px solid rgba(10,19,69,0.07)", fontFamily: BODY }}>
            <ul style={{ listStyle: "none", margin: "0 auto", maxWidth: 1200, padding: "20px 24px", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: w < 700 ? 16 : 24 }}>
                {props.items.map((it) => (
                    <li key={it.text} style={{ display: "flex", alignItems: "center", justifyContent: w < 700 ? "flex-start" : "center", gap: 10, fontSize: 15, fontWeight: 500, color: props.textColor }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={props.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d={ICONS[it.icon] || ICONS.shield} />
                        </svg>
                        {it.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}

addPropertyControls(ORTrustBar, {
    items: {
        type: ControlType.Array,
        title: "Items",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.Enum, title: "Icon", options: Object.keys(ICONS), defaultValue: "shield" },
                text: { type: ControlType.String, title: "Text", defaultValue: "Local guides" },
            },
        },
        defaultValue: [
            { icon: "guide", text: "Local guides" },
            { icon: "group", text: "Groups of max 12" },
            { icon: "calendar", text: "Flexible dates" },
            { icon: "clock", text: "Reply within 24h" },
        ],
    },
    accent: { type: ControlType.Color, title: "Icons", defaultValue: "#F46D2B" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#0A1345" },
    background: { type: ControlType.Color, title: "Background", defaultValue: "#FFFFFF" },
})
