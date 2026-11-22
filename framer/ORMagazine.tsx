import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { ARTICLES, PLACES, EXPERIENCES } from "./ORData.tsx"
import { Page, Container, Eyebrow, H2, ArticleCard, ExperienceCard, Photo, Pill, SampleTag, C, FONT, ROUTES, useWidth, useParam } from "./ORKit.tsx"

/**
 * Magazine list, or an article when ?id= is present.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ORMagazine(props: { title: string }) {
    const w = useWidth()
    const m = w < 810
    const id = useParam("id")
    const a = ARTICLES.find((x) => x.id === id)

    if (a) {
        const related = EXPERIENCES.filter((e) => a.placeIds.includes(e.placeId))
        return (
            <Page active="magazine">
                <article>
                    <Container style={{ maxWidth: 780, paddingTop: 32 }}>
                        <a href={ROUTES.magazine} style={{ fontSize: 14, color: C.muted }}>
                            ← Revista
                        </a>
                        <div style={{ marginTop: 22 }}>
                            <Eyebrow>{a.category}</Eyebrow>
                        </div>
                        <h1 style={{ fontFamily: FONT.serif, fontWeight: 400, fontSize: m ? 34 : 52, lineHeight: 1.1, margin: "12px 0" }}>{a.title}</h1>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", color: C.muted, fontSize: 14 }}>
                            {a.author} <SampleTag text="ARTÍCULO DE MUESTRA" />
                        </div>
                    </Container>
                    <Container style={{ maxWidth: 1000, marginTop: 26 }}>
                        <Photo src={a.image} alt={`Imagen referencial: ${a.title}`} height={m ? 260 : 460} eager />
                    </Container>
                    <Container style={{ maxWidth: 720, paddingTop: 30, paddingBottom: 40 }}>
                        <p style={{ fontFamily: FONT.serif, fontSize: 22, lineHeight: 1.5 }}>{a.excerpt}</p>
                        {a.body.map((p, i) => (
                            <p key={i} style={{ fontSize: 18, lineHeight: 1.75 }}>
                                {p}
                            </p>
                        ))}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
                            {a.topics.map((t) => (
                                <Pill key={t}>{t}</Pill>
                            ))}
                            {a.placeIds.map((pid) => (
                                <Pill key={pid}>{PLACES.find((p) => p.id === pid)?.destination}</Pill>
                            ))}
                        </div>
                    </Container>
                </article>
                {related.length > 0 && (
                    <section style={{ padding: "20px 0 90px" }}>
                        <Container>
                            <h2 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 26 }}>Vívelo</h2>
                            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                                {related.map((e) => (
                                    <ExperienceCard key={e.id} e={e} />
                                ))}
                            </div>
                        </Container>
                    </section>
                )}
            </Page>
        )
    }

    return (
        <Page active="magazine">
            <section style={{ padding: m ? "40px 0 90px" : "72px 0 110px" }}>
                <Container>
                    <Eyebrow>Revista</Eyebrow>
                    <H2 mobile={m}>{props.title}</H2>
                    <p style={{ color: C.muted, maxWidth: 640 }}>Viajes, historia, atletas, guías, naturaleza, cultura, expediciones y conservación.</p>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 26, marginTop: 30 }}>
                        {ARTICLES.map((x) => (
                            <ArticleCard key={x.id} a={x} />
                        ))}
                    </div>
                </Container>
            </section>
        </Page>
    )
}

addPropertyControls(ORMagazine, {
    title: { type: ControlType.String, title: "Título", defaultValue: "Historias que mantienen los recuerdos vivos" },
})
