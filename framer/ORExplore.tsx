import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { EXPERIENCES, ELEMENTS, QUEST_TYPES, LEVELS, Element, QuestType, placeOf, SAMPLE_NOTE, Level } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, ExperienceCard, Button, SampleTag, C, FONT, useWidth } from "./ORKit.tsx"

function norm(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
}

/**
 * Experience discovery with search and combined filters.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORExplore(props: { title: string }) {
    const w = useWidth()
    const m = w < 810
    const [q, setQ] = useState("")
    const [els, setEls] = useState<Element[]>([])
    const [tipo, setTipo] = useState<QuestType | "">("")
    const [nivel, setNivel] = useState<string>("")
    const [ready, setReady] = useState(false)

    // Restore filters from the URL so returning from a detail page keeps context.
    useEffect(() => {
        const p = new URLSearchParams(window.location.search)
        setQ(p.get("q") || "")
        setEls(((p.get("el") || "").split(",").filter(Boolean) as Element[]))
        setTipo((p.get("tipo") as QuestType) || "")
        setNivel(p.get("nivel") || "")
        setReady(true)
    }, [])

    useEffect(() => {
        if (!ready) return
        const p = new URLSearchParams()
        if (q) p.set("q", q)
        if (els.length) p.set("el", els.join(","))
        if (tipo) p.set("tipo", tipo)
        if (nivel) p.set("nivel", nivel)
        const qs = p.toString()
        window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""))
    }, [q, els, tipo, nivel, ready])

    const results = useMemo(() => {
        const nq = norm(q.trim())
        return EXPERIENCES.filter((e) => {
            if (els.length && !els.every((el) => e.elements.includes(el))) return false
            if (tipo && e.questType !== tipo && !e.nearby.some((n) => n.type === tipo)) return false
            if (nivel && String(e.level) !== nivel) return false
            if (!nq) return true
            const p = placeOf(e)
            const hay = norm([e.title, e.summary, p.destination, p.region, p.country, ...e.disciplines, ...e.knowledge, ...e.flora, ...e.fauna, ...e.learning].join(" "))
            return nq.split(/\s+/).every((t) => hay.includes(t))
        })
    }, [q, els, tipo, nivel])

    const reset = () => {
        setQ("")
        setEls([])
        setTipo("")
        setNivel("")
    }
    const toggleEl = (el: Element) => setEls((cur) => (cur.includes(el) ? cur.filter((x) => x !== el) : [...cur, el]))

    const chip = (on: boolean): React.CSSProperties => ({
        padding: "9px 14px",
        borderRadius: 999,
        border: `1px solid ${on ? C.forest : C.border}`,
        background: on ? C.forest : C.white,
        color: on ? C.ivory : C.ink,
        fontFamily: FONT.sans,
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
    })
    const select: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, fontSize: 14, fontFamily: FONT.body, color: C.ink }

    return (
        <Page active="explore">
            <section style={{ padding: m ? "40px 0 24px" : "72px 0 32px" }}>
                <Container>
                    <Eyebrow>Explorar y Quests</Eyebrow>
                    <H2 mobile={m}>{props.title}</H2>
                    <div style={{ marginTop: 24 }}>
                        <label htmlFor="or-search" className="or-sr">
                            Buscar experiencias
                        </label>
                        <input id="or-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca por destino, actividad o tema (ej. araucaria, MTB, Atacama)" style={{ width: "100%", padding: "16px 18px", borderRadius: 14, border: `1px solid ${C.border}`, fontSize: 16, background: C.white, fontFamily: FONT.body, color: C.ink }} />
                    </div>
                    <div role="group" aria-label="Filtrar por elemento" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                        {ELEMENTS.map((el) => (
                            <button key={el.id} onClick={() => toggleEl(el.id)} aria-pressed={els.includes(el.id)} style={chip(els.includes(el.id))}>
                                {el.name}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
                        <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                            Tipo de quest
                            <select value={tipo} onChange={(e) => setTipo(e.target.value as QuestType | "")} style={select}>
                                <option value="">Todos</option>
                                {QUEST_TYPES.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                            Nivel recomendado
                            <select value={nivel} onChange={(e) => setNivel(e.target.value)} style={select}>
                                <option value="">Todos</option>
                                {(Object.keys(LEVELS) as unknown as Level[]).map((l) => (
                                    <option key={l} value={String(l)}>
                                        {LEVELS[l]}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {(q || els.length || tipo || nivel) && (
                            <button onClick={reset} style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer", color: C.forest, fontSize: 14 }}>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                    <div aria-live="polite" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 22, fontSize: 14, color: C.muted }}>
                        <span>
                            {results.length} {results.length === 1 ? "experiencia" : "experiencias"}
                        </span>
                        <SampleTag text="CATÁLOGO DE MUESTRA" />
                    </div>
                </Container>
            </section>
            <section style={{ paddingBottom: 90 }}>
                <Container>
                    {results.length ? (
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : w < 1100 ? "1fr 1fr" : "repeat(3, 1fr)", gap: 18 }}>
                            {results.map((e) => (
                                <ExperienceCard key={e.id} e={e} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "60px 20px", border: `1px dashed ${C.border}`, borderRadius: 20 }}>
                            <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 22 }}>No hay experiencias con estos filtros</div>
                            <p style={{ color: C.muted }}>Prueba con menos filtros u otra palabra.</p>
                            <Button onClick={reset}>Restablecer filtros</Button>
                        </div>
                    )}
                    <p style={{ fontSize: 12, color: C.muted, marginTop: 24 }}>* {SAMPLE_NOTE}</p>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORExplore, {
    title: { type: ControlType.String, title: "Título", defaultValue: "Encuentra tu próxima experiencia" },
})
