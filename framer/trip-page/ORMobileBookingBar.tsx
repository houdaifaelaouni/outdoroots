import * as React from "react"
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — bottom booking bar for phones.
// In Framer: put it on the Phone breakpoint, set Position "Fixed", pinned to the
// bottom, width 100%. It hides itself while the booking card is on screen.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORMobileBookingBar(props: { price: string; meta: string; buttonLabel: string; targetId: string; accent: string; style?: React.CSSProperties }) {
    const [hidden, setHidden] = useState(false)
    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-site-fonts")) {
            const l = document.createElement("link")
            l.id = "or-site-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
        if (typeof IntersectionObserver === "undefined") return
        // The booking card may render after this bar, so look for it for a few seconds.
        let io: IntersectionObserver | undefined
        let tries = 0
        const find = () => {
            const el = document.getElementById(props.targetId)
            if (el) {
                io = new IntersectionObserver((e) => setHidden(e[0].isIntersecting), { threshold: 0.15 })
                io.observe(el)
            } else if (tries++ < 20) setTimeout(find, 250)
        }
        find()
        return () => io?.disconnect()
    }, [props.targetId])

    const go = (e: React.MouseEvent) => {
        const el = document.getElementById(props.targetId)
        if (!el) return
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setTimeout(() => (el.querySelector("input") as HTMLInputElement | null)?.focus({ preventScroll: true }), 500)
    }

    return (
        <div
            style={{
                ...props.style,
                width: "100%",
                boxSizing: "border-box",
                background: "#FFFFFF",
                borderTop: "1px solid rgba(10,19,69,0.1)",
                boxShadow: "0 -8px 24px rgba(10,19,69,0.08)",
                padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontFamily: BODY,
                color: "#0A1345",
                transform: hidden ? "translateY(110%)" : "translateY(0)",
                transition: "transform .25s ease",
            }}
            aria-hidden={hidden}
        >
            <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{props.price}</div>
                {props.meta && <div style={{ fontSize: 12, color: "rgba(10,19,69,0.62)" }}>{props.meta}</div>}
            </div>
            <a href={`#${props.targetId}`} onClick={go} tabIndex={hidden ? -1 : 0} style={{ flexShrink: 0, padding: "12px 20px", borderRadius: 999, background: props.accent, color: "#FFFFFF", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                {props.buttonLabel}
            </a>
        </div>
    )
}

addPropertyControls(ORMobileBookingBar, {
    price: { type: ControlType.String, title: "Price", defaultValue: "Price on request" },
    meta: { type: ControlType.String, title: "Meta", defaultValue: "No payment now" },
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: "Request trip" },
    targetId: { type: ControlType.String, title: "Card id", defaultValue: "reservar" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
})
