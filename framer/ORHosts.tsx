import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { HOSTS, hostById, experienceById } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, HostCard, ExperienceCard, Pill, VerificationBadge, Photo, SampleTag, C, FONT, ROUTES, useWidth, useParam } from "./ORKit.tsx"

/**
 * Hosts list, or a single host profile when ?id= is present.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORHosts(props: { title: string }) {
    const w = useWidth()
    const m = w < 810
    const id = useParam("id")
    const h = id ? hostById(id) : undefined

    if (h) {
        const exps = h.experienceIds.map(experienceById).filter(Boolean)
        return (
            <Page active="hosts">
                <Container style={{ paddingTop: 32, paddingBottom: 90 }}>
                    <a href={ROUTES.hosts} style={{ fontSize: 14, color: C.muted }}>
                        ← Nuestra gente
                    </a>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "380px 1fr", gap: 36, marginTop: 20 }}>
                        <Photo src={h.image} alt="Paisaje referencial: retrato real pendiente de autorización" height={m ? 320 : 460} />
                        <div>
                            <SampleTag text="PERFIL DE MUESTRA" />
                            <h1 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: m ? 34 : 50, letterSpacing: "-0.03em", margin: "12px 0 6px" }}>{h.name}</h1>
                            <div style={{ color: C.muted }}>
                                {h.role} · {h.location}
                            </div>
                            <div style={{ margin: "14px 0" }}>
                                <VerificationBadge status={h.verification} />
                            </div>
                            <p style={{ fontFamily: FONT.serif, fontSize: 20, lineHeight: 1.45 }}>{h.bio}</p>
                            <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px", fontSize: 15 }}>
                                <dt style={{ color: C.muted }}>Especialidades</dt>
                                <dd style={{ margin: 0, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {h.specialties.map((s) => (
                                        <Pill key={s}>{s}</Pill>
                                    ))}
                                </dd>
                                <dt style={{ color: C.muted }}>Idiomas</dt>
                                <dd style={{ margin: 0 }}>{h.languages.join(", ")}</dd>
                                <dt style={{ color: C.muted }}>Credenciales</dt>
                                <dd style={{ margin: 0 }}>
                                    {h.credentials.map((c) => (
                                        <div key={c.label}>
                                            {c.label} — <em>{c.status === "verificado" ? "verificada" : "pendiente de verificación"}</em>
                                        </div>
                                    ))}
                                </dd>
                                <dt style={{ color: C.muted }}>Reseñas</dt>
                                <dd style={{ margin: 0 }}>Aún no hay reseñas auténticas.</dd>
                                <dt style={{ color: C.muted }}>Misiones completadas</dt>
                                <dd style={{ margin: 0 }}>Sin datos verificados.</dd>
                            </dl>
                        </div>
                    </div>
                    <h2 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 26, marginTop: 48 }}>Experiencias</h2>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                        {exps.map((e) => (
                            <ExperienceCard key={e!.id} e={e!} />
                        ))}
                    </div>
                </Container>
            </Page>
        )
    }

    return (
        <Page active="hosts">
            <section style={{ padding: m ? "40px 0 90px" : "72px 0 110px" }}>
                <Container>
                    <Eyebrow>Nuestra gente</Eyebrow>
                    <H2 mobile={m}>{props.title}</H2>
                    <p style={{ fontFamily: FONT.serif, fontSize: 22, maxWidth: 700, lineHeight: 1.35 }}>“El destino te atrae. El guía hace que quieras volver.”</p>
                    <p style={{ color: C.muted, maxWidth: 700 }}>Guías, instructores, atletas y expertos locales. “Outdooroots Verified” sólo se mostrará tras un proceso de verificación definido.</p>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : w < 1100 ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16, marginTop: 30 }}>
                        {HOSTS.map((x) => (
                            <HostCard key={x.id} h={x} />
                        ))}
                    </div>
                    <div style={{ marginTop: 50, padding: 26, borderRadius: 20, background: C.forest, color: C.ivory }}>
                        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 24 }}>Ride with a Pro</div>
                        <p style={{ lineHeight: 1.6, maxWidth: 700 }}>Clínicas, camps y expediciones con atletas e instructores. Ejemplo: clínica de curvas de MTB en Colico — posición corporal, frenado, curvas y elección de línea.</p>
                        <a href={`${ROUTES.experience}?id=colico-mtb`} style={{ color: C.sand, fontWeight: 700 }}>
                            Ver MTB Colico Park →
                        </a>
                    </div>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORHosts, {
    title: { type: ControlType.String, title: "Título", defaultValue: "Los verdaderos rockstars" },
})
