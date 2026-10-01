import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { PLACES, EXPERIENCES, COUNTRIES } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, ExperienceCard, Pill, C, FONT, ROUTES, useWidth } from "./ORKit.tsx"

// Chile destination vocabulary from the brief (not all have experiences yet).
const VOCAB = [
    "Atacama", "San Pedro de Atacama", "Ojos del Salado", "Nevado Tres Cruces", "Copiapó", "Valle del Elqui", "Paihuano", "Cajón del Maipo", "Volcán San José", "Matanzas", "Puertecillo", "Topocalma", "Nahuelbuta", "Arauco", "Antulafken", "Licanray", "Villarrica", "Pucón", "Colico", "Conguillío", "Corralco", "Chiloé", "Cochamó", "Futaleufú", "Patagonia", "Carretera Austral", "Torres del Paine", "Rapa Nui", "Isla Navarino", "Dientes de Navarino", "Robinson Crusoe", "Isla Mocha",
]

/**
 * Destinations: country → region → destination.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORDestinations(props: { intro: string }) {
    const w = useWidth()
    const m = w < 810
    const regions = Array.from(new Set(PLACES.map((p) => p.region)))
    return (
        <Page active="destinations">
            <section style={{ padding: m ? "40px 0" : "72px 0 40px" }}>
                <Container>
                    <Eyebrow>Destinos y mundo</Eyebrow>
                    <H2 mobile={m}>Chile, el primer ecosistema</H2>
                    <p style={{ maxWidth: 640, lineHeight: 1.6, color: C.muted }}>{props.intro}</p>
                </Container>
            </section>
            {regions.map((r) => {
                const places = PLACES.filter((p) => p.region === r)
                return (
                    <section key={r} style={{ padding: "28px 0" }}>
                        <Container>
                            <div style={{ fontSize: 13, color: C.muted }}>Chile → {r}</div>
                            {places.map((p) => {
                                const exps = EXPERIENCES.filter((e) => e.placeId === p.id)
                                return (
                                    <div key={p.id} style={{ marginTop: 10, paddingBottom: 26, borderBottom: `1px solid ${C.border}` }}>
                                        <h3 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: m ? 26 : 32, margin: "6px 0", letterSpacing: "-0.02em" }}>{p.destination}</h3>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                                            <Pill>{p.ecosystem}</Pill>
                                        </div>
                                        <p style={{ maxWidth: 720, lineHeight: 1.6, marginTop: 6 }}>{p.description}</p>
                                        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 16, marginTop: 14 }}>
                                            {exps.map((e) => (
                                                <ExperienceCard key={e.id} e={e} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </Container>
                    </section>
                )
            })}
            <section style={{ padding: "56px 0", background: C.white }}>
                <Container>
                    <Eyebrow>Vocabulario de destinos en Chile</Eyebrow>
                    <p style={{ color: C.muted, fontSize: 14 }}>Destinos que el catálogo irá incorporando. Aún sin experiencias publicadas.</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        {VOCAB.map((v) => (
                            <a key={v} href={`${ROUTES.explore}?q=${encodeURIComponent(v)}`} style={{ textDecoration: "none" }}>
                                <Pill>{v}</Pill>
                            </a>
                        ))}
                    </div>
                </Container>
            </section>
            <section style={{ padding: "56px 0 90px" }}>
                <Container>
                    <Eyebrow>Expansión internacional</Eyebrow>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 14, marginTop: 16 }}>
                        {COUNTRIES.filter((c) => c.name !== "Chile").map((c) => (
                            <div key={c.name} style={{ padding: 18, borderRadius: 16, border: `1px solid ${C.border}`, background: C.white }}>
                                <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20 }}>{c.name}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginTop: 2 }}>Hoja de ruta · no operativo</div>
                                <div style={{ fontSize: 14, marginTop: 8 }}>{c.text}</div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORDestinations, {
    intro: {
        type: ControlType.String,
        title: "Intro",
        displayTextArea: true,
        defaultValue: "País → región → destino. Cada lugar conecta experiencias, ecosistemas, conocimiento y personas. Las fotografías son referenciales de cada región.",
    },
})
