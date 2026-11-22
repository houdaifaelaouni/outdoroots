import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Outdooroots — trip page hero: title, key facts, price, CTA and photo mosaic.
// Bind the texts and images to the Destinations CMS fields.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const C = { navy: "#0A1345", blue: "#1B2978", orange: "#F46D2B", muted: "rgba(10,19,69,0.62)", line: "rgba(10,19,69,0.1)", bg: "#F7FCFF" }
const HEAD = "Inter, system-ui, sans-serif"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"

type Img = { src: string; alt?: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORTripHero(props: {
    category: string
    title: string
    location: string
    chips: string[]
    price: string
    ctaLabel: string
    ctaLink: string
    secondaryLabel: string
    secondaryLink: string
    reassurance: string[]
    image1?: Img
    image2?: Img
    image3?: Img
    galleryLabel: string
    galleryLink: string
    accent: string
    style?: React.CSSProperties
}) {
    const ref = useRef<HTMLElement>(null)
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
    const stack = w < 900
    const small = w < 600
    const ph = { src: "https://framerusercontent.com/images/HjXahjunP7W3osO050Nu6mSdTOo.jpg", alt: "" }
    const i1 = props.image1?.src ? props.image1 : ph
    const i2 = props.image2?.src ? props.image2 : { src: "https://framerusercontent.com/images/1MGkuCqb2BZMEFZS8xYRNmiY.jpg", alt: "" }
    const i3 = props.image3?.src ? props.image3 : { src: "https://framerusercontent.com/images/bkufoUHjtgnj3huyPg2w13Il8E.jpg", alt: "" }
    const photo = (img: Img, style: React.CSSProperties) => <img src={img.src} alt={img.alt || ""} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 16, ...style }} />

    return (
        <section ref={ref} style={{ ...props.style, width: "100%", background: C.bg, fontFamily: BODY, color: C.navy }}>
            <style>{`.or-th-cta:hover{filter:brightness(.94)}.or-th a:focus-visible{outline:2px solid ${props.accent};outline-offset:3px}`}</style>
            <div className="or-th" style={{ maxWidth: 1200, margin: "0 auto", padding: small ? "32px 16px 40px" : "56px 24px 64px", display: "flex", flexDirection: stack ? "column" : "row", gap: stack ? 32 : 56, alignItems: stack ? "stretch" : "center" }}>
                <div style={{ flex: stack ? "none" : "0 0 440px" }}>
                    <div style={{ fontSize: 13, letterSpacing: "0.09em", textTransform: "uppercase", color: C.muted }}>{props.category}</div>
                    <h1 style={{ margin: "12px 0 8px", fontFamily: HEAD, fontWeight: 500, fontSize: small ? 40 : 60, lineHeight: 1, letterSpacing: "-0.055em", color: C.navy }}>{props.title}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: C.muted }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
                            <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        {props.location}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {props.chips.filter(Boolean).map((c) => (
                            <li key={c} style={{ padding: "7px 14px", borderRadius: 999, background: "#FFFFFF", border: `1px solid ${C.line}`, fontSize: 14 }}>
                                {c}
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: 24, fontFamily: HEAD, fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em" }}>{props.price}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 20 }}>
                        <a href={props.ctaLink} className="or-th-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 26px", borderRadius: 999, background: props.accent, color: "#FFFFFF", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
                            {props.ctaLabel}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </a>
                        {props.secondaryLabel && (
                            <a href={props.secondaryLink} style={{ fontSize: 15, fontWeight: 500, color: C.blue, textDecoration: "underline", textUnderlineOffset: 4 }}>
                                {props.secondaryLabel}
                            </a>
                        )}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
                        {props.reassurance.filter(Boolean).map((r) => (
                            <li key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={props.accent} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                                </svg>
                                {r}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ flex: 1, display: "grid", gridTemplateColumns: small ? "1fr 1fr" : "2fr 1fr", gridTemplateRows: small ? "220px 120px" : "240px 240px", gap: 12, position: "relative" }}>
                    <div style={{ gridRow: small ? "auto" : "1 / 3", gridColumn: small ? "1 / 3" : "auto" }}>{photo(i1, {})}</div>
                    <div>{photo(i2, {})}</div>
                    <div style={{ position: "relative" }}>
                        {photo(i3, {})}
                        {props.galleryLabel && (
                            <a href={props.galleryLink} style={{ position: "absolute", right: 10, bottom: 10, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: C.navy, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                                {props.galleryLabel}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ORTripHero, {
    category: { type: ControlType.String, title: "Category", defaultValue: "Trekking & Nature" },
    title: { type: ControlType.String, title: "Title", defaultValue: "Patagonia on Foot" },
    location: { type: ControlType.String, title: "Location", defaultValue: "Torres del Paine, Chile" },
    chips: { type: ControlType.Array, title: "Key facts", control: { type: ControlType.String }, maxCount: 4, defaultValue: ["6 days / 5 nights", "October – April", "Max 12 people"] },
    price: { type: ControlType.String, title: "Price", defaultValue: "Price on request" },
    ctaLabel: { type: ControlType.String, title: "Button", defaultValue: "Check dates & request" },
    ctaLink: { type: ControlType.Link, title: "Button link", defaultValue: "#reservar" },
    secondaryLabel: { type: ControlType.String, title: "Link text", defaultValue: "See the itinerary" },
    secondaryLink: { type: ControlType.Link, title: "Link", defaultValue: "#itinerary" },
    reassurance: { type: ControlType.Array, title: "Reassurance", control: { type: ControlType.String }, maxCount: 3, defaultValue: ["No payment now", "Personal reply within 24h"] },
    image1: { type: ControlType.ResponsiveImage, title: "Photo 1" },
    image2: { type: ControlType.ResponsiveImage, title: "Photo 2" },
    image3: { type: ControlType.ResponsiveImage, title: "Photo 3" },
    galleryLabel: { type: ControlType.String, title: "Gallery btn", defaultValue: "View all photos" },
    galleryLink: { type: ControlType.Link, title: "Gallery link", defaultValue: "#gallery" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
})
