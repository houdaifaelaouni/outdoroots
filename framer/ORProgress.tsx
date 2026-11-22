import * as React from "react"
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { EXPERIENCES, SAMPLE_PROFILE, LEVELS, experienceById, getSaved, toggleSaved } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, Radar, RadarLegend, CapabilityTable, gapsFor, PREP_TIPS, ExperienceCard, Pill, SampleTag, Button, C, FONT, ROUTES, useWidth } from "./ORKit.tsx"

const STATUS_TEXT: Record<string, string> = {
    "SELF ASSESSED": "Autoevaluado",
    VERIFIED: "Verificado por un profesional",
    CERTIFIED: "Certificado",
}

/**
 * Progression and profile: capability web, disciplines, knowledge, path, saved missions.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORProgress(props: { defaultMission: string }) {
    const w = useWidth()
    const m = w < 900
    const [mission, setMission] = useState(props.defaultMission)
    const [saved, setSaved] = useState<string[]>([])
    useEffect(() => setSaved(getSaved()), [])
    const target = experienceById(mission) || EXPERIENCES[0]
    const gaps = gapsFor(SAMPLE_PROFILE.capabilities, target.requirementsProfile)
    const prep = EXPERIENCES.filter((e) => e.id !== target.id && e.level <= target.level && e.capabilityImpact.some((c) => gaps.slice(0, 3).some((g) => g.id === c))).slice(0, 3)
    const P = SAMPLE_PROFILE

    return (
        <Page active="progress">
            <section style={{ padding: m ? "40px 0" : "72px 0 40px", background: C.night, color: C.ivory }}>
                <Container>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                        <Eyebrow color={C.sand}>Progreso</Eyebrow>
                        <span style={{ fontSize: 12, padding: "4px 10px", border: "1px dashed rgba(245,244,238,0.5)", borderRadius: 6 }}>PERFIL DE EJEMPLO · NO ES UNA EVALUACIÓN REAL</span>
                    </div>
                    <H2 mobile={m}>Dónde estás y qué puedes aprender después</H2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 36, marginTop: 30, alignItems: "start" }}>
                        <div>
                            <label style={{ display: "block", fontSize: 14, marginBottom: 8 }} htmlFor="or-mission">
                                Comparar con la misión
                            </label>
                            <select id="or-mission" value={mission} onChange={(e) => setMission(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 15, background: "rgba(255,255,255,0.08)", color: C.ivory, border: "1px solid rgba(255,255,255,0.2)" }}>
                                {EXPERIENCES.map((e) => (
                                    <option key={e.id} value={e.id} style={{ color: C.ink }}>
                                        {e.title}
                                    </option>
                                ))}
                            </select>
                            <div style={{ marginTop: 18 }}>
                                <Radar current={P.capabilities} target={target.requirementsProfile} targetLabel={target.title} dark size={m ? 320 : 440} />
                            </div>
                            <RadarLegend dark targetLabel={target.title} />
                        </div>
                        <div>
                            <CapabilityTable current={P.capabilities} target={target.requirementsProfile} dark />
                            <div style={{ marginTop: 22, padding: 18, borderRadius: 16, background: "rgba(245,244,238,0.06)" }}>
                                <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 18 }}>Recomendaciones de preparación</div>
                                {gaps.length === 0 ? (
                                    <p>Este perfil de ejemplo cubre los requisitos indicativos. La decisión final la toma el guía.</p>
                                ) : (
                                    <ul style={{ lineHeight: 1.7, paddingLeft: 18 }}>
                                        {gaps.slice(0, 3).map((g) => (
                                            <li key={g.id}>
                                                <strong>{g.name}</strong> (faltan {g.gap}): {PREP_TIPS[g.id]}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 0 }}>Escala 0–100 de demostración. No certifica que alguien sea apto ni seguro para una misión.</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {prep.length > 0 && (
                <section style={{ padding: "56px 0 20px" }}>
                    <Container>
                        <Eyebrow>Para prepararte</Eyebrow>
                        <h2 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, margin: "8px 0 20px" }}>Experiencias que trabajan lo que te falta</h2>
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                            {prep.map((e) => (
                                <ExperienceCard key={e.id} e={e} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            <section id="perfil" style={{ padding: "56px 0 90px" }}>
                <Container style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 36 }}>
                    <div>
                        <Eyebrow>Perfil</Eyebrow>
                        <h2 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28, margin: "8px 0 4px" }}>{P.name}</h2>
                        <SampleTag />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
                            <div style={{ padding: 16, borderRadius: 14, background: C.white, border: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>XP</div>
                                <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 28 }}>{P.xp}</div>
                                <div style={{ fontSize: 12, color: C.muted }}>Sólo por experiencias reales completadas</div>
                            </div>
                            <div style={{ padding: 16, borderRadius: 14, background: C.white, border: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Reputación</div>
                                <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginTop: 6 }}>Sin reseñas</div>
                                <div style={{ fontSize: 12, color: C.muted }}>Basada en reseñas auténticas</div>
                            </div>
                        </div>

                        <h3 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginTop: 28 }}>Disciplinas (skill)</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {P.disciplines.map((d) => (
                                <li key={d.name} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                                        <strong>{d.name}</strong>
                                        <span style={{ fontSize: 13 }}>
                                            {LEVELS[d.level]} · <em>{STATUS_TEXT[d.status]}</em>
                                        </span>
                                    </div>
                                    <div role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={d.level} aria-label={`${d.name}: nivel ${d.level} de 5`} style={{ height: 6, background: C.border, borderRadius: 4, marginTop: 8 }}>
                                        <div style={{ width: `${d.level * 20}%`, height: "100%", background: C.forest, borderRadius: 4 }} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontSize: 12, color: C.muted }}>Autoevaluado ≠ verificado. Verificar requiere la observación de un profesional; certificar, una credencial real.</p>
                    </div>
                    <div>
                        <h3 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginTop: 34 }}>Conocimiento del territorio</h3>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["Pacific Naturalist", "Andes Explorer", "Volcanic Territory", "Patagonia Ecology", "Rapa Nui Culture", "Atacama Skies", "Marine Life I", "Andean History I"].map((a) => {
                                const has = P.knowledge.includes(a)
                                return (
                                    <span key={a} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: `1px ${has ? "solid" : "dashed"} ${has ? C.forest : C.border}`, background: has ? C.forest : "transparent", color: has ? C.ivory : C.muted }}>
                                        {has ? "✓ " : "🔒 "}
                                        {a}
                                    </span>
                                )
                            })}
                        </div>

                        <h3 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginTop: 28 }}>Tu camino</h3>
                        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {P.path.map((s, i) => (
                                <li key={s} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0" }}>
                                    <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: i < P.pathIndex ? C.forest : i === P.pathIndex ? C.sand : C.border, color: i < P.pathIndex ? C.ivory : C.ink }}>
                                        {i + 1}
                                    </span>
                                    <span style={{ fontWeight: i === P.pathIndex ? 800 : 500 }}>
                                        {s}
                                        <span className="or-sr">{i < P.pathIndex ? " (completado)" : i === P.pathIndex ? " (siguiente)" : " (por desbloquear)"}</span>
                                    </span>
                                    {i === P.pathIndex && <Pill tone="sand">Siguiente</Pill>}
                                </li>
                            ))}
                        </ol>
                        <p style={{ fontSize: 12, color: C.muted }}>Desbloquear es una ruta de progresión, no un permiso automático para participar.</p>

                        <h3 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginTop: 28 }}>Misiones guardadas</h3>
                        {saved.length === 0 ? (
                            <p style={{ color: C.muted }}>
                                Aún no guardas misiones. <a href={ROUTES.explore}>Explorar experiencias</a>
                            </p>
                        ) : (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {saved.map((id) => {
                                    const e = experienceById(id)
                                    if (!e) return null
                                    return (
                                        <li key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                                            <a href={`${ROUTES.experience}?id=${id}`}>{e.title}</a>
                                            <button onClick={() => setSaved(toggleSaved(id))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", textDecoration: "underline" }}>
                                                Quitar
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                        <p style={{ fontSize: 12, color: C.muted }}>Las misiones guardadas quedan sólo en este dispositivo.</p>
                    </div>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORProgress, {
    defaultMission: {
        type: ControlType.Enum,
        title: "Misión",
        options: EXPERIENCES.map((e) => e.id),
        optionTitles: EXPERIENCES.map((e) => e.title),
        defaultValue: "ojos-del-salado-expedicion",
    },
})
