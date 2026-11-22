import * as React from "react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { ELEMENTS, EXPERIENCES, HOSTS, ARTICLES, COUNTRIES, SAMPLE_PROFILE, QUEST_TYPES, IMG, experienceById } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, Button, Photo, ExperienceCard, HostCard, ArticleCard, Radar, RadarLegend, CapabilityTable, InterestForm, SampleTag, C, FONT, ROUTES, useWidth, expUrl } from "./ORKit.tsx"

/**
 * Outdooroots homepage.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORHome(props: { apiUrl: string; heroImage?: { src: string; alt?: string } }) {
    const w = useWidth()
    const m = w < 810
    const hero = props.heroImage?.src || IMG.torres
    const missions = ["ojos-del-salado-expedicion", "volcan-san-jose-ascenso", "colico-mtb"]
    const [mission, setMission] = useState(missions[0])
    const target = experienceById(mission)!
    const sectionPad = m ? "64px 0" : "110px 0"

    return (
        <Page active="home">
            {/* Hero */}
            <section style={{ position: "relative", minHeight: m ? 620 : 760, color: C.ivory, display: "flex", alignItems: "flex-end" }}>
                <img src={hero} alt="Montañista frente a las Torres del Paine (imagen referencial)" loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,28,24,0.25) 0%, rgba(20,28,24,0.55) 55%, rgba(20,28,24,0.95) 100%)" }} />
                <Container style={{ position: "relative", paddingBottom: m ? 48 : 90, width: "100%" }}>
                    <Eyebrow color={C.sand}>Ritual · Naturaleza · Desafío</Eyebrow>
                    <h1 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: m ? 42 : 84, lineHeight: 0.98, letterSpacing: "-0.04em", margin: "16px 0 18px", maxWidth: 900 }}>
                        Pon a prueba tus capacidades. <span style={{ fontFamily: FONT.serif, fontWeight: 400, fontStyle: "italic", color: C.sand }}>Sube de nivel.</span>
                    </h1>
                    <p style={{ fontSize: m ? 17 : 20, maxWidth: 560, lineHeight: 1.5, margin: "0 0 28px", color: "rgba(245,244,238,0.88)" }}>
                        Experiencias curadas de aventura, cultura, naturaleza y aprendizaje en Chile y el mundo.
                    </p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <Button href={ROUTES.explore} variant="sand">
                            Explorar experiencias
                        </Button>
                        <Button href={ROUTES.progress} variant="ghost">
                            Descubrir mi próxima misión
                        </Button>
                    </div>
                </Container>
            </section>

            {/* Elements */}
            <section style={{ padding: sectionPad }}>
                <Container>
                    <Eyebrow>Cuatro elementos</Eyebrow>
                    <H2 mobile={m}>Descubre tu elemento</H2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(4, 1fr)", gap: 16, marginTop: 36 }}>
                        {ELEMENTS.map((el) => (
                            <a key={el.id} href={`${ROUTES.explore}?el=${el.id}`} className="or-card" style={{ textDecoration: "none", borderRadius: 20, overflow: "hidden" }}>
                                <Photo src={el.image} alt={`Imagen referencial del elemento ${el.name}`} height={m ? 240 : 380} overlay>
                                    <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: C.ivory }}>
                                        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30 }}>{el.name}</div>
                                        <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6, lineHeight: 1.4 }}>{el.text}</div>
                                    </div>
                                </Photo>
                            </a>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Chile Campeón */}
            <section style={{ padding: sectionPad, background: C.night, color: C.ivory }}>
                <Container>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
                        <div>
                            <Eyebrow color={C.sand}>El primer mundo</Eyebrow>
                            <H2 mobile={m}>CHILE CAMPEÓN</H2>
                            <p style={{ maxWidth: 560, color: "rgba(245,244,238,0.8)", lineHeight: 1.5 }}>Del desierto más seco del planeta a los volcanes del sur y las islas del Pacífico. Una selección para empezar.</p>
                        </div>
                        <Button href={ROUTES.destinations} variant="sand">
                            Explorar Chile
                        </Button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 18, marginTop: 36 }}>
                        {["ojos-del-salado-expedicion", "rapa-nui-cultura-oceano", "araucania-volcanes-lagos"].map((id) => (
                            <ExperienceCard key={id} e={experienceById(id)!} dark />
                        ))}
                    </div>
                </Container>
            </section>

            {/* Featured */}
            <section style={{ padding: sectionPad }}>
                <Container>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <Eyebrow>Experiencias destacadas</Eyebrow>
                            <H2 mobile={m}>Moverse, aprender, entender el territorio</H2>
                        </div>
                        <SampleTag text="EXPERIENCIAS DE MUESTRA · XP ILUSTRATIVO" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 18, marginTop: 36 }}>
                        {["colico-mtb", "matanzas-viento-y-olas", "nahuelbuta-araucarias"].map((id) => (
                            <ExperienceCard key={id} e={experienceById(id)!} />
                        ))}
                    </div>
                    <div style={{ marginTop: 28 }}>
                        <Button href={ROUTES.explore} variant="ghost">
                            Ver todas las experiencias
                        </Button>
                    </div>
                </Container>
            </section>

            {/* Rockstars */}
            <section style={{ padding: sectionPad, background: C.forest, color: C.ivory }}>
                <Container>
                    <Eyebrow color={C.sand}>Nuestra gente</Eyebrow>
                    <H2 mobile={m}>LOS VERDADEROS ROCKSTARS</H2>
                    <p style={{ fontFamily: FONT.serif, fontSize: m ? 22 : 30, maxWidth: 760, lineHeight: 1.3, margin: "18px 0 0" }}>“El destino te atrae. El guía hace que quieras volver.”</p>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(4, 1fr)", gap: 16, marginTop: 36 }}>
                        {HOSTS.map((h) => (
                            <HostCard key={h.id} h={h} dark />
                        ))}
                    </div>
                    <p style={{ fontSize: 13, opacity: 0.75, marginTop: 18 }}>Perfiles de muestra. Los retratos, nombres y credenciales reales se publicarán cuando estén autorizados y verificados.</p>
                </Container>
            </section>

            {/* Next mission */}
            <section style={{ padding: sectionPad }}>
                <Container>
                    <Eyebrow>Quests</Eyebrow>
                    <H2 mobile={m}>¿CUÁL ES TU PRÓXIMA MISIÓN?</H2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 18, marginTop: 36 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {QUEST_TYPES.filter((q) => q.id !== "side").map((q) => (
                                <a key={q.id} href={`${ROUTES.explore}?tipo=${q.id}`} className="or-card" style={{ textDecoration: "none", padding: 20, borderRadius: 18, border: `1px solid ${C.border}`, background: q.id === "fire" ? C.ink : C.white, color: q.id === "fire" ? C.ivory : C.ink }}>
                                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 18 }}>{q.name}</div>
                                    <div style={{ fontSize: 14, marginTop: 6, opacity: 0.8 }}>{q.text}</div>
                                </a>
                            ))}
                        </div>
                        <a href={expUrl("ojos-del-salado-expedicion")} className="or-card" style={{ textDecoration: "none", borderRadius: 20, overflow: "hidden" }}>
                            <Photo src={IMG.atacama} alt="Puna de Atacama (imagen referencial)" height={m ? 300 : "100%"} overlay>
                                <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, color: C.ivory }}>
                                    <Eyebrow color={C.sand}>Fire Quest · Expedición aspiracional</Eyebrow>
                                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, marginTop: 8 }}>Ojos del Salado · 6.893 m</div>
                                    <div style={{ fontSize: 15, opacity: 0.85, marginTop: 6 }}>El volcán más alto del mundo. Meses de preparación, no un fin de semana.</div>
                                </div>
                            </Photo>
                        </a>
                    </div>
                </Container>
            </section>

            {/* Progression preview */}
            <section style={{ padding: sectionPad, background: C.night, color: C.ivory }}>
                <Container style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 40, alignItems: "center" }}>
                    <div>
                        <Eyebrow color={C.sand}>Outdooroots Capability Web</Eyebrow>
                        <H2 mobile={m}>TU EXPERIENCIA CAMBIA TU PERFIL</H2>
                        <p style={{ color: "rgba(245,244,238,0.8)", lineHeight: 1.55, maxWidth: 520 }}>
                            Compara un perfil con los requisitos de una misión. Es una guía para prepararte, no una certificación: la decisión de participar siempre la toma un profesional.
                        </p>
                        <div role="group" aria-label="Elegir misión" style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" }}>
                            {missions.map((id) => (
                                <button key={id} onClick={() => setMission(id)} aria-pressed={mission === id} style={{ padding: "9px 14px", borderRadius: 999, border: `1px solid ${C.sand}`, background: mission === id ? C.sand : "transparent", color: mission === id ? C.ink : C.ivory, fontFamily: FONT.sans, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                                    {experienceById(id)!.title}
                                </button>
                            ))}
                        </div>
                        <RadarLegend dark targetLabel={target.title} />
                        <p style={{ fontSize: 13, opacity: 0.7, marginTop: 12 }}>Datos de ejemplo en escala 0–100. No es una evaluación real.</p>
                        <Button href={ROUTES.progress} variant="sand">
                            Ver progreso completo
                        </Button>
                    </div>
                    <div>
                        <Radar current={SAMPLE_PROFILE.capabilities} target={target.requirementsProfile} targetLabel={target.title} dark size={m ? 320 : 440} />
                        <details style={{ marginTop: 12 }}>
                            <summary style={{ cursor: "pointer", fontSize: 14 }}>Ver comparación en tabla</summary>
                            <CapabilityTable current={SAMPLE_PROFILE.capabilities} target={target.requirementsProfile} dark />
                        </details>
                    </div>
                </Container>
            </section>

            {/* World */}
            <section style={{ padding: sectionPad }}>
                <Container>
                    <Eyebrow>Experience the world. Learn from it. Level up.</Eyebrow>
                    <H2 mobile={m}>CHILE ES EL COMIENZO</H2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 14, marginTop: 32 }}>
                        {COUNTRIES.map((c) => (
                            <div key={c.name} style={{ padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, background: c.name === "Chile" ? C.forest : C.white, color: c.name === "Chile" ? C.ivory : C.ink }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 22 }}>{c.name}</div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: c.name === "Chile" ? C.sand : C.muted }}>{c.status}</span>
                                </div>
                                <div style={{ fontSize: 14, marginTop: 8, opacity: 0.85 }}>{c.text}</div>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, marginTop: 14 }}>La expansión internacional es una hoja de ruta: esos destinos todavía no están operando.</p>
                </Container>
            </section>

            {/* Club Roots */}
            <section style={{ padding: sectionPad, background: C.sand, color: C.ink }}>
                <Container style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.1fr 1fr", gap: 40 }}>
                    <div>
                        <Eyebrow color={C.forest}>Comunidad</Eyebrow>
                        <H2 mobile={m}>CLUB ROOTS</H2>
                        <ul style={{ lineHeight: 1.9, paddingLeft: 18, fontSize: 16 }}>
                            <li>Acceso anticipado a nuevas misiones</li>
                            <li>Beneficios con partners</li>
                            <li>Reserva prioritaria</li>
                            <li>Misiones exclusivas, eventos y clínicas</li>
                            <li>Oportunidades de comunidad</li>
                        </ul>
                        <p style={{ fontSize: 13 }}>Beneficios planificados: aún no están disponibles y el modelo de membresía no está definido.</p>
                    </div>
                    <div style={{ background: C.ivory, borderRadius: 20, padding: 24 }}>
                        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Quiero saber más</div>
                        <InterestForm apiUrl={props.apiUrl} subject="Club Roots — interés" kind="club_roots" />
                    </div>
                </Container>
            </section>

            {/* Magazine */}
            <section style={{ padding: sectionPad }}>
                <Container>
                    <Eyebrow>Revista</Eyebrow>
                    <H2 mobile={m}>HISTORIAS QUE MANTIENEN LOS RECUERDOS VIVOS</H2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 24, marginTop: 36 }}>
                        {ARTICLES.map((a) => (
                            <ArticleCard key={a.id} a={a} />
                        ))}
                    </div>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORHome, {
    apiUrl: { type: ControlType.String, title: "API URL", defaultValue: "", placeholder: "https://tu-backend.vercel.app" },
    heroImage: { type: ControlType.ResponsiveImage, title: "Hero" },
})
