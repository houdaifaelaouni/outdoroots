import * as React from "react"
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { EXPERIENCES, ELEMENTS, LEVELS, QUEST_LABEL, CAPABILITIES, PRICE_PENDING, SAMPLE_NOTE, SAMPLE_PROFILE, placeOf, hostById, experienceById, getSaved, toggleSaved } from "./ORData.tsx"
import { Page, Container, Eyebrow, Pill, Button, Photo, SampleTag, VerificationBadge, ExperienceCard, Modal, InterestForm, Radar, RadarLegend, CapabilityTable, C, FONT, ROUTES, useWidth, useParam, hostUrl } from "./ORKit.tsx"

function Block(props: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ padding: "26px 0", borderTop: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 22, margin: "0 0 14px", letterSpacing: "-0.02em" }}>{props.title}</h2>
            {props.children}
        </section>
    )
}

function List(props: { items: string[] }) {
    return (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75 }}>
            {props.items.map((i) => (
                <li key={i}>{i}</li>
            ))}
        </ul>
    )
}

/**
 * Experience detail. Reads ?id= from the URL.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORExperience(props: { apiUrl: string; fallbackId: string }) {
    const w = useWidth()
    const m = w < 900
    const param = useParam("id")
    const e = experienceById(param) || experienceById(props.fallbackId) || EXPERIENCES[0]
    const p = placeOf(e)
    const [saved, setSaved] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    useEffect(() => setSaved(getSaved()), [])
    const isSaved = saved.includes(e.id)
    const hosts = e.hostIds.map(hostById).filter(Boolean)

    const facts: [string, string][] = [
        ["Destino", `${p.destination}, ${p.region}`],
        ["Quest", QUEST_LABEL[e.questType]],
        ["Elementos", e.elements.map((x) => ELEMENTS.find((el) => el.id === x)?.name).join(" · ")],
        ["Duración", e.duration],
        ["Temporada", e.season],
        ["Dificultad", e.difficulty],
        ["Nivel recomendado", LEVELS[e.level]],
        ["Precio", PRICE_PENDING],
    ]

    return (
        <Page active="explore">
            <section style={{ position: "relative", color: C.ivory }}>
                <Photo src={e.image} alt={`Imagen referencial de ${p.destination}: no muestra la ruta exacta`} height={m ? 420 : 560} radius={0} overlay eager>
                    <Container style={{ position: "absolute", left: 0, right: 0, bottom: m ? 28 : 48 }}>
                        <a href={ROUTES.explore} onClick={(ev) => { if (document.referrer.includes(ROUTES.explore)) { ev.preventDefault(); history.back() } }} style={{ fontSize: 14, opacity: 0.85 }}>
                            ← Volver a explorar
                        </a>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 12px" }}>
                            <Pill tone="sand">{QUEST_LABEL[e.questType]}</Pill>
                            {e.elements.map((el) => (
                                <Pill key={el} tone="dark">
                                    {ELEMENTS.find((x) => x.id === el)?.name}
                                </Pill>
                            ))}
                            <Pill tone="dark">{LEVELS[e.level]}</Pill>
                        </div>
                        <h1 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: m ? 36 : 62, lineHeight: 1, letterSpacing: "-0.035em", margin: 0, maxWidth: 900 }}>{e.title}</h1>
                        <div style={{ marginTop: 10, fontSize: 16, opacity: 0.85 }}>
                            {p.destination} · {p.region} · {p.country}
                        </div>
                    </Container>
                </Photo>
            </section>

            <Container style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 360px", gap: m ? 10 : 48, paddingTop: 36, paddingBottom: 90 }}>
                <div>
                    <div style={{ marginBottom: 10 }}>
                        <SampleTag text="EXPERIENCIA DE MUESTRA · NO ES UN PRODUCTO CONFIRMADO" />
                    </div>
                    <p style={{ fontFamily: FONT.serif, fontSize: m ? 21 : 26, lineHeight: 1.4, margin: "10px 0 26px" }}>{e.summary}</p>

                    <Block title="Lo que aprenderás">
                        <List items={e.learning} />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                            <Pill>+{e.xp} XP (ilustrativo)</Pill>
                            {e.disciplines.map((d) => (
                                <Pill key={d}>{d}</Pill>
                            ))}
                        </div>
                        <div style={{ marginTop: 14, fontSize: 14, color: C.muted }}>
                            Capacidades que desarrolla: {e.capabilityImpact.map((c) => CAPABILITIES.find((x) => x.id === c)?.name).join(" · ")}
                        </div>
                    </Block>

                    <Block title="Territorio y conocimiento">
                        <p style={{ marginTop: 0, lineHeight: 1.6 }}>{p.description}</p>
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 18 }}>
                            <div>
                                <strong>Temas</strong>
                                <List items={e.knowledge} />
                            </div>
                            <div>
                                <strong>Hábitat</strong>
                                <p style={{ margin: "4px 0 0", lineHeight: 1.6 }}>{e.habitat}</p>
                            </div>
                            <div>
                                <strong>Flora</strong>
                                <List items={e.flora} />
                            </div>
                            <div>
                                <strong>Fauna</strong>
                                <List items={e.fauna} />
                            </div>
                            <div>
                                <strong>Cultura local</strong>
                                <p style={{ margin: "4px 0 0", lineHeight: 1.6 }}>{e.culture}</p>
                            </div>
                            <div>
                                <strong>Historia</strong>
                                <p style={{ margin: "4px 0 0", lineHeight: 1.6 }}>{e.history}</p>
                            </div>
                        </div>
                    </Block>

                    <Block title="Itinerario">
                        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {e.itinerary.map((d) => (
                                <li key={d.title} style={{ padding: "12px 0", borderBottom: `1px dashed ${C.border}` }}>
                                    <strong style={{ fontFamily: FONT.sans }}>{d.title}</strong>
                                    <div style={{ color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{d.text}</div>
                                </li>
                            ))}
                        </ol>
                    </Block>

                    <Block title="Detalles prácticos">
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 18 }}>
                            <div>
                                <strong>Incluye</strong>
                                <List items={e.inclusions} />
                            </div>
                            <div>
                                <strong>No incluye</strong>
                                <List items={e.exclusions} />
                            </div>
                            <div>
                                <strong>Requisitos</strong>
                                <List items={e.requirements} />
                            </div>
                            <div>
                                <strong>Equipo</strong>
                                <List items={e.equipment} />
                            </div>
                        </div>
                        <p style={{ lineHeight: 1.6 }}>
                            <strong>Seguridad:</strong> {e.safety}
                        </p>
                        <p style={{ lineHeight: 1.6, marginBottom: 0 }}>
                            <strong>Condiciones:</strong> {e.conditions}
                        </p>
                    </Block>

                    <Block title="Preparación: tu perfil frente a esta misión">
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 20, alignItems: "center" }}>
                            <Radar current={SAMPLE_PROFILE.capabilities} target={e.requirementsProfile} targetLabel={e.title} size={320} />
                            <div>
                                <RadarLegend targetLabel="esta experiencia" />
                                <details style={{ marginTop: 12 }}>
                                    <summary style={{ cursor: "pointer" }}>Ver tabla</summary>
                                    <CapabilityTable current={SAMPLE_PROFILE.capabilities} target={e.requirementsProfile} />
                                </details>
                                <p style={{ fontSize: 13, color: C.muted }}>Perfil y requisitos de ejemplo. La elegibilidad real la decide el guía responsable.</p>
                            </div>
                        </div>
                    </Block>

                    <Block title="Anfitriones">
                        {hosts.map((h) => (
                            <a key={h!.id} href={hostUrl(h!.id)} style={{ display: "flex", gap: 14, alignItems: "center", textDecoration: "none", padding: 14, borderRadius: 16, border: `1px solid ${C.border}`, background: C.white, marginBottom: 10 }}>
                                <div aria-hidden="true" style={{ width: 54, height: 54, borderRadius: "50%", background: C.forest, color: C.sand, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.sans, fontWeight: 800 }}>
                                    {h!.name.slice(0, 1)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: FONT.sans, fontWeight: 800 }}>{h!.name}</div>
                                    <div style={{ fontSize: 13, color: C.muted }}>
                                        {h!.role} · {h!.languages.join(", ")}
                                    </div>
                                </div>
                                <VerificationBadge status={h!.verification} />
                            </a>
                        ))}
                    </Block>

                    <Block title="Side quests cercanas">
                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 10 }}>
                            {e.nearby.map((n) => (
                                <div key={n.title} style={{ padding: 14, borderRadius: 14, border: `1px solid ${C.border}`, background: C.white }}>
                                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>{QUEST_LABEL[n.type]}</div>
                                    <div style={{ fontFamily: FONT.sans, fontWeight: 700, marginTop: 4 }}>{n.title}</div>
                                    <div style={{ fontSize: 13, color: C.muted }}>+{n.xp} XP (ilustrativo)</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <Button href={`${ROUTES.map}?centro=${e.placeId}`} variant="ghost">
                                Ver en el mapa
                            </Button>
                        </div>
                    </Block>

                    <Block title="Logros y reseñas">
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {e.achievements.map((a) => (
                                <Pill key={a}>🏅 {a}</Pill>
                            ))}
                        </div>
                        <p style={{ color: C.muted }}>Aún no hay reseñas. Sólo se publicarán reseñas auténticas de participantes reales.</p>
                    </Block>

                    {e.next.length > 0 && (
                        <Block title="Próximas experiencias">
                            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16 }}>
                                {e.next.map((id) => experienceById(id)).filter(Boolean).map((x) => (
                                    <ExperienceCard key={x!.id} e={x!} />
                                ))}
                            </div>
                        </Block>
                    )}
                </div>

                <aside style={{ order: m ? -1 : 0 }}>
                    <div style={{ position: m ? "static" : "sticky", top: 88, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 22 }}>
                        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", fontSize: 14 }}>
                            {facts.map(([k, v]) => (
                                <React.Fragment key={k}>
                                    <dt style={{ color: C.muted }}>{k}</dt>
                                    <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                            <Button onClick={() => setOpen(true)}>Preparar consulta</Button>
                            <Button variant="ghost" onClick={() => setSaved(toggleSaved(e.id))}>
                                {isSaved ? "✓ Misión guardada" : "Guardar misión"}
                            </Button>
                        </div>
                        <p style={{ fontSize: 12, color: C.muted, marginBottom: 0 }}>Las misiones guardadas quedan sólo en este dispositivo. No hay reservas ni pagos en línea.</p>
                    </div>
                </aside>
            </Container>
            <Container>
                <p style={{ fontSize: 12, color: C.muted, paddingBottom: 30 }}>{SAMPLE_NOTE}</p>
            </Container>

            <Modal open={open} onClose={() => setOpen(false)} title={`Consulta: ${e.title}`}>
                <InterestForm apiUrl={props.apiUrl} subject={`Consulta — ${e.title}`} kind="consulta" />
            </Modal>
        </Page>
    )
}

addPropertyControls(ORExperience, {
    apiUrl: { type: ControlType.String, title: "API URL", defaultValue: "", placeholder: "https://tu-backend.vercel.app" },
    fallbackId: {
        type: ControlType.Enum,
        title: "Por defecto",
        options: EXPERIENCES.map((e) => e.id),
        optionTitles: EXPERIENCES.map((e) => e.title),
        defaultValue: "colico-mtb",
    },
})
