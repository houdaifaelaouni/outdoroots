import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { EXPERIENCES, MAP_POINTS, PLACES, QUEST_LABEL, distanceKm, placeOf } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, Pill, SampleTag, C, FONT, useWidth, expUrl } from "./ORKit.tsx"

interface Item {
    id: string
    name: string
    category: string
    lat: number
    lng: number
    note: string
    href?: string
    km: number
}

const CENTERS = ["colico", "volcan-san-jose", "matanzas", "ojos-del-salado", "araucania-lagos"]

/**
 * Demonstration map: missions and partners around a center, within a radius.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORMap(props: { defaultCenter: string }) {
    const w = useWidth()
    const m = w < 900
    const [center, setCenter] = useState(props.defaultCenter)
    const [radius, setRadius] = useState(100)
    const [cat, setCat] = useState("")
    const [sel, setSel] = useState("")

    useEffect(() => {
        const c = new URLSearchParams(window.location.search).get("centro")
        if (c && CENTERS.includes(c)) setCenter(c)
    }, [])

    const c = PLACES.find((p) => p.id === center)!

    const all: Item[] = useMemo(() => {
        const exps: Item[] = EXPERIENCES.map((e) => {
            const p = placeOf(e)
            return { id: e.id, name: e.title, category: QUEST_LABEL[e.questType], lat: p.lat, lng: p.lng, note: p.destination, href: expUrl(e.id), km: 0 }
        })
        return [...exps, ...MAP_POINTS.map((p) => ({ ...p, km: 0 }))].map((it) => ({ ...it, km: Math.round(distanceKm(c.lat, c.lng, it.lat, it.lng)) }))
    }, [center])

    const inRadius = all.filter((it) => it.km <= radius).sort((a, b) => a.km - b.km)
    const categories = Array.from(new Set(inRadius.map((i) => i.category))).sort()
    const shown = cat ? inRadius.filter((i) => i.category === cat) : inRadius
    const selected = shown.find((i) => i.id === sel)

    // Schematic projection: km offsets from the center, scaled to 150 km.
    const size = 420
    const scale = (size / 2 - 20) / 150
    const proj = (it: Item) => {
        const x = (it.lng - c.lng) * 111 * Math.cos((c.lat * Math.PI) / 180)
        const y = (it.lat - c.lat) * 111
        return [size / 2 + x * scale, size / 2 - y * scale]
    }

    const chip = (on: boolean): React.CSSProperties => ({ padding: "8px 13px", borderRadius: 999, border: `1px solid ${on ? C.forest : C.border}`, background: on ? C.forest : C.white, color: on ? C.ivory : C.ink, fontFamily: FONT.sans, fontWeight: 700, fontSize: 13, cursor: "pointer" })

    return (
        <Page active="map">
            <section style={{ padding: m ? "40px 0 90px" : "72px 0 110px" }}>
                <Container>
                    <Eyebrow>Explorar localmente</Eyebrow>
                    <H2 mobile={m}>Side quests, personas y lugares cerca de tu misión</H2>
                    <div style={{ margin: "14px 0" }}>
                        <SampleTag text="MAPA ESQUEMÁTICO DE DEMOSTRACIÓN · NO APTO PARA NAVEGAR" />
                    </div>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
                        <label style={{ fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
                            Centro
                            <select value={center} onChange={(e) => { setCenter(e.target.value); setSel(""); setCat("") }} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, background: C.white, color: C.ink }}>
                                {CENTERS.map((id) => (
                                    <option key={id} value={id}>
                                        {PLACES.find((p) => p.id === id)!.destination}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div role="group" aria-label="Radio" style={{ display: "flex", gap: 6 }}>
                            {[50, 100, 150].map((r) => (
                                <button key={r} onClick={() => setRadius(r)} aria-pressed={radius === r} style={chip(radius === r)}>
                                    {r} km
                                </button>
                            ))}
                        </div>
                    </div>
                    <div role="group" aria-label="Categoría" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                        <button onClick={() => setCat("")} aria-pressed={!cat} style={chip(!cat)}>
                            Todas
                        </button>
                        {categories.map((k) => (
                            <button key={k} onClick={() => setCat(k)} aria-pressed={cat === k} style={chip(cat === k)}>
                                {k}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "460px 1fr", gap: 26, marginTop: 24 }}>
                        <div style={{ background: C.night, borderRadius: 20, padding: 20 }}>
                            <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label={`Mapa esquemático alrededor de ${c.destination}, radio ${radius} km. La lista muestra los mismos resultados.`}>
                                {[150, 100, 50].map((r) => (
                                    <circle key={r} cx={size / 2} cy={size / 2} r={r * scale} fill={r === radius ? "rgba(223,195,145,0.10)" : "none"} stroke={r === radius ? C.sand : "rgba(245,244,238,0.18)"} strokeDasharray={r === radius ? "0" : "4 4"} />
                                ))}
                                {[50, 100, 150].map((r) => (
                                    <text key={r} x={size / 2 + 4} y={size / 2 - r * scale - 4} fontSize={10} fill="rgba(245,244,238,0.6)">
                                        {r} km
                                    </text>
                                ))}
                                {shown.map((it) => {
                                    const [x, y] = proj(it)
                                    const isExp = !!it.href
                                    const on = sel === it.id
                                    return (
                                        <g key={it.id} onClick={() => setSel(it.id)} style={{ cursor: "pointer" }} role="button" tabIndex={0} aria-label={`${it.name}, ${it.km} km`} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(it.id)}>
                                            <circle cx={x} cy={y} r={on ? 10 : isExp ? 8 : 6} fill={isExp ? C.sand : C.ivory} stroke={on ? C.sand : C.night} strokeWidth={on ? 4 : 2} />
                                        </g>
                                    )
                                })}
                                <text x={size / 2} y={size / 2 + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ivory} fontFamily={FONT.sans}>
                                    {c.destination}
                                </text>
                            </svg>
                            <div style={{ display: "flex", gap: 14, color: "rgba(245,244,238,0.75)", fontSize: 12, marginTop: 8 }}>
                                <span>● dorado: experiencia</span>
                                <span>○ claro: lugar o servicio</span>
                            </div>
                        </div>

                        <div>
                            {selected && (
                                <div role="status" style={{ padding: 16, borderRadius: 16, background: C.forest, color: C.ivory, marginBottom: 14 }}>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                                        {selected.category} · {selected.km} km en línea recta
                                    </div>
                                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginTop: 4 }}>{selected.name}</div>
                                    <div style={{ fontSize: 14, opacity: 0.85 }}>{selected.note}</div>
                                    {selected.href && (
                                        <a href={selected.href} style={{ color: C.sand, fontWeight: 700, display: "inline-block", marginTop: 8 }}>
                                            Ver experiencia →
                                        </a>
                                    )}
                                </div>
                            )}
                            <div aria-live="polite" style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>
                                {shown.length} resultados dentro de {radius} km de {c.destination}
                            </div>
                            {shown.length === 0 ? (
                                <div style={{ padding: 24, border: `1px dashed ${C.border}`, borderRadius: 16, textAlign: "center" }}>
                                    Nada en este radio. Prueba con 150 km o con otra categoría.
                                </div>
                            ) : (
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                                    {shown.map((it) => (
                                        <li key={it.id}>
                                            <button onClick={() => setSel(it.id)} aria-pressed={sel === it.id} style={{ width: "100%", textAlign: "left", padding: 14, borderRadius: 14, border: `1px solid ${sel === it.id ? C.forest : C.border}`, background: C.white, cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 12, color: C.ink }}>
                                                <span>
                                                    <strong style={{ fontFamily: FONT.sans }}>{it.name}</strong>
                                                    <span style={{ display: "block", fontSize: 13, color: C.muted }}>{it.category}</span>
                                                </span>
                                                <Pill>{it.km} km</Pill>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <p style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>Distancias en línea recta desde coordenadas aproximadas. Los puntos “(muestra)” no son negocios en operación ni rutas verificadas.</p>
                        </div>
                    </div>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORMap, {
    defaultCenter: {
        type: ControlType.Enum,
        title: "Centro",
        options: CENTERS,
        optionTitles: CENTERS.map((id) => PLACES.find((p) => p.id === id)!.destination),
        defaultValue: "colico",
    },
})
