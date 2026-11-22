import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { IMG } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, InterestForm, Photo, C, FONT, useWidth } from "./ORKit.tsx"

const BENEFITS = [
    ["Acceso anticipado", "Conoce las nuevas misiones antes que nadie."],
    ["Beneficios con partners", "Lodges, escuelas y marcas aliadas."],
    ["Reserva prioritaria", "Cupos preferentes cuando existan salidas reales."],
    ["Misiones exclusivas", "Experiencias diseñadas para la comunidad."],
    ["Eventos y clínicas", "Aprende con atletas, guías e instructores."],
    ["Comunidad", "Conecta con personas que viajan para aprender."],
]

/**
 * Club Roots: planned benefits and an interest form.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORClubRoots(props: { apiUrl: string }) {
    const w = useWidth()
    const m = w < 900
    return (
        <Page active="club" dark>
            <section style={{ position: "relative" }}>
                <Photo src={IMG.patagonia} alt="Patagonia (imagen referencial)" height={m ? 360 : 480} radius={0} overlay eager>
                    <Container style={{ position: "absolute", left: 0, right: 0, bottom: 40, color: C.ivory }}>
                        <Eyebrow color={C.sand}>Comunidad</Eyebrow>
                        <h1 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: m ? 44 : 76, letterSpacing: "-0.04em", margin: "10px 0 0" }}>CLUB ROOTS</h1>
                        <p style={{ fontFamily: FONT.serif, fontSize: 22, margin: "10px 0 0" }}>Viaja. Aprende. Explora. Progresa.</p>
                    </Container>
                </Photo>
            </section>
            <Container style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.2fr 1fr", gap: 40, padding: m ? "40px 20px 90px" : "70px 20px 110px" }}>
                <div>
                    <H2 mobile={m} color={C.ivory}>
                        Beneficios planificados
                    </H2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14, marginTop: 24 }}>
                        {BENEFITS.map(([t, d]) => (
                            <div key={t} style={{ padding: 18, borderRadius: 16, background: "rgba(245,244,238,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div style={{ fontFamily: FONT.sans, fontWeight: 800, color: C.sand }}>{t}</div>
                                <div style={{ fontSize: 14, marginTop: 6, opacity: 0.85 }}>{d}</div>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: 13, opacity: 0.7, marginTop: 18 }}>Estos beneficios aún no existen. El precio y el modelo de membresía no están definidos.</p>
                </div>
                <div style={{ background: "rgba(245,244,238,0.06)", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 22, marginBottom: 14 }}>Quiero saber más</div>
                    <InterestForm apiUrl={props.apiUrl} subject="Club Roots — interés" kind="club_roots" dark />
                </div>
            </Container>
        </Page>
    )
}

addPropertyControls(ORClubRoots, {
    apiUrl: { type: ControlType.String, title: "API URL", defaultValue: "", placeholder: "https://tu-backend.vercel.app" },
})
