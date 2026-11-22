import * as React from "react"
import { useEffect, useState } from "react"
import {
    CAPABILITIES,
    Capability,
    CapabilityScores,
    Experience,
    Host,
    Article,
    LEVELS,
    QUEST_LABEL,
    ELEMENTS,
    SAMPLE_NOTE,
    placeOf,
} from "./ORData.tsx"

// ---------- Tokens ----------
export const C = {
    ink: "#1D2924",
    forest: "#263D32",
    ivory: "#F5F4EE",
    sand: "#DFC391",
    muted: "#68736C",
    border: "#D8DCD5",
    night: "#141C18",
    white: "#FFFFFF",
}
export const FONT = {
    sans: "'Manrope', 'DM Sans', system-ui, sans-serif",
    body: "'DM Sans', 'Manrope', system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
}

export const ROUTES = {
    home: "/",
    explore: "/explorar",
    experience: "/experiencia",
    destinations: "/destinos",
    hosts: "/anfitriones",
    map: "/mapa",
    progress: "/progreso",
    magazine: "/revista",
    club: "/club-roots",
}

export const expUrl = (id: string) => `${ROUTES.experience}?id=${encodeURIComponent(id)}`
export const hostUrl = (id: string) => `${ROUTES.hosts}?id=${encodeURIComponent(id)}`
export const articleUrl = (id: string) => `${ROUTES.magazine}?id=${encodeURIComponent(id)}`

// ---------- Hooks ----------
export function useFonts() {
    useEffect(() => {
        if (typeof document === "undefined" || document.getElementById("or-fonts")) return
        const link = document.createElement("link")
        link.id = "or-fonts"
        link.rel = "stylesheet"
        link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap"
        document.head.appendChild(link)
    }, [])
}

export function useWidth(): number {
    const [w, setW] = useState(1200)
    useEffect(() => {
        if (typeof window === "undefined") return
        const on = () => setW(window.innerWidth)
        on()
        window.addEventListener("resize", on)
        return () => window.removeEventListener("resize", on)
    }, [])
    return w
}

export function useParam(name: string): string {
    const [v, setV] = useState("")
    useEffect(() => {
        if (typeof window === "undefined") return
        setV(new URLSearchParams(window.location.search).get(name) || "")
    }, [name])
    return v
}

// ---------- Layout ----------
const GLOBAL_CSS = `
.or-root *{box-sizing:border-box}
.or-root a{color:inherit}
.or-root a:focus-visible,.or-root button:focus-visible,.or-root input:focus-visible,.or-root select:focus-visible,.or-root textarea:focus-visible{outline:2px solid ${C.sand};outline-offset:2px}
.or-root img{display:block;max-width:100%}
@media (prefers-reduced-motion: reduce){.or-root *{transition:none!important;animation:none!important}}
.or-card{transition:transform .25s ease, box-shadow .25s ease}
.or-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(20,28,24,.12)}
.or-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`

export function Page(props: { children: React.ReactNode; dark?: boolean; active?: string; style?: React.CSSProperties }) {
    useFonts()
    const w = useWidth()
    const mobile = w < 810
    return (
        <div
            className="or-root"
            style={{
                ...props.style,
                width: "100%",
                minHeight: "100vh",
                background: props.dark ? C.night : C.ivory,
                color: props.dark ? C.ivory : C.ink,
                fontFamily: FONT.body,
                paddingBottom: mobile ? 72 : 0,
            }}
        >
            <style>{GLOBAL_CSS}</style>
            <Header active={props.active} mobile={mobile} />
            <main>{props.children}</main>
            <Footer mobile={mobile} />
            {mobile && <MobileTabs active={props.active} />}
        </div>
    )
}

export function Container(props: { children: React.ReactNode; style?: React.CSSProperties }) {
    return <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", ...props.style }}>{props.children}</div>
}

const NAV = [
    { id: "explore", label: "Experiencias", href: ROUTES.explore },
    { id: "destinations", label: "Destinos", href: ROUTES.destinations },
    { id: "hosts", label: "Nuestra gente", href: ROUTES.hosts },
    { id: "magazine", label: "Revista", href: ROUTES.magazine },
]

function Header(props: { active?: string; mobile: boolean }) {
    return (
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(20,28,24,0.92)", backdropFilter: "blur(8px)", color: C.ivory, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
                <a href={ROUTES.home} style={{ textDecoration: "none", fontFamily: FONT.sans, fontWeight: 800, letterSpacing: "0.14em", fontSize: 15 }}>
                    OUTDOOROOTS
                </a>
                {!props.mobile && (
                    <nav aria-label="Principal" style={{ display: "flex", gap: 28, alignItems: "center", fontFamily: FONT.sans, fontSize: 14, fontWeight: 600 }}>
                        {NAV.map((n) => (
                            <a key={n.id} href={n.href} aria-current={props.active === n.id ? "page" : undefined} style={{ textDecoration: "none", opacity: props.active === n.id ? 1 : 0.75, borderBottom: props.active === n.id ? `2px solid ${C.sand}` : "2px solid transparent", paddingBottom: 2 }}>
                                {n.label}
                            </a>
                        ))}
                    </nav>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: FONT.sans, fontSize: 13, fontWeight: 600 }}>
                    {!props.mobile && (
                        <a href={ROUTES.club} style={{ textDecoration: "none", opacity: 0.85 }}>
                            Club Roots
                        </a>
                    )}
                    <a href={ROUTES.progress} style={{ textDecoration: "none", background: C.sand, color: C.ink, padding: "8px 14px", borderRadius: 999 }}>
                        Mi perfil
                    </a>
                </div>
            </Container>
        </header>
    )
}

const TABS = [
    { id: "explore", label: "Explorar", href: ROUTES.explore, icon: "M11 4a7 7 0 1 0 4.4 12.4l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" },
    { id: "map", label: "Mapa", href: ROUTES.map, icon: "M9 3 3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5 9 3zm0 2.2 6 2.5v10.1l-6-2.5V5.2z" },
    { id: "quests", label: "Quests", href: `${ROUTES.explore}?tipo=main`, icon: "M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4z" },
    { id: "progress", label: "Progreso", href: ROUTES.progress, icon: "M4 20h4V10H4v10zm6 0h4V4h-4v16zm6 0h4v-7h-4v7z" },
    { id: "profile", label: "Perfil", href: `${ROUTES.progress}#perfil`, icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" },
]

function MobileTabs(props: { active?: string }) {
    return (
        <nav aria-label="Navegación móvil" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60, background: C.night, borderTop: "1px solid rgba(255,255,255,0.1)", display: "grid", gridTemplateColumns: "repeat(5,1fr)", height: 64, paddingBottom: "env(safe-area-inset-bottom)" }}>
            {TABS.map((t) => {
                const on = props.active === t.id
                return (
                    <a key={t.id} href={t.href} aria-current={on ? "page" : undefined} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, color: on ? C.sand : "rgba(245,244,238,0.7)", fontFamily: FONT.sans, fontSize: 11, fontWeight: 600 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                            <path d={t.icon} />
                        </svg>
                        {t.label}
                    </a>
                )
            })}
        </nav>
    )
}

function Footer(props: { mobile: boolean }) {
    return (
        <footer style={{ background: C.night, color: "rgba(245,244,238,0.75)", padding: "56px 0 40px" }}>
            <Container style={{ display: "grid", gridTemplateColumns: props.mobile ? "1fr" : "2fr 1fr 1fr", gap: 32 }}>
                <div>
                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, letterSpacing: "0.14em", color: C.ivory }}>OUTDOOROOTS</div>
                    <p style={{ fontFamily: FONT.serif, fontSize: 20, color: C.ivory, margin: "14px 0 6px" }}>Viaja. Aprende. Explora. Progresa.</p>
                    <p style={{ margin: 0, fontSize: 14 }}>Experience the world. Learn from it. Level up.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                    <a href={ROUTES.explore}>Experiencias</a>
                    <a href={ROUTES.destinations}>Destinos</a>
                    <a href={ROUTES.hosts}>Nuestra gente</a>
                    <a href={ROUTES.map}>Mapa</a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                    <a href={ROUTES.magazine}>Revista</a>
                    <a href={ROUTES.club}>Club Roots</a>
                    <a href={ROUTES.progress}>Progreso</a>
                </div>
            </Container>
            <Container>
                <p style={{ fontSize: 12, marginTop: 36, opacity: 0.7 }}>{SAMPLE_NOTE} Fotografías: imágenes referenciales de regiones de Chile.</p>
            </Container>
        </footer>
    )
}

// ---------- Small UI ----------
export function Eyebrow(props: { children: React.ReactNode; color?: string }) {
    return <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: props.color || C.muted }}>{props.children}</div>
}

export function H2(props: { children: React.ReactNode; color?: string; mobile?: boolean }) {
    return <h2 style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: props.mobile ? 30 : 44, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "10px 0 0", color: props.color }}>{props.children}</h2>
}

export function Pill(props: { children: React.ReactNode; tone?: "light" | "dark" | "sand" }) {
    const tone = props.tone || "light"
    const styles = {
        light: { background: "rgba(38,61,50,0.08)", color: C.forest },
        dark: { background: "rgba(245,244,238,0.14)", color: C.ivory },
        sand: { background: C.sand, color: C.ink },
    }[tone]
    return <span style={{ ...styles, display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: FONT.sans, whiteSpace: "nowrap" }}>{props.children}</span>
}

export function SampleTag(props: { text?: string }) {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 6, border: `1px dashed ${C.muted}`, color: C.muted, fontSize: 11, fontWeight: 600, fontFamily: FONT.sans, letterSpacing: "0.04em" }}>
            ◇ {props.text || "MUESTRA"}
        </span>
    )
}

export function VerificationBadge(props: { status: "pendiente" | "verificado" }) {
    const ok = props.status === "verificado"
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: FONT.sans, background: ok ? C.forest : "transparent", color: ok ? C.ivory : C.muted, border: ok ? "none" : `1px solid ${C.border}` }}>
            {ok ? "✓ Verificado" : "○ Verificación pendiente"}
        </span>
    )
}

export function Button(props: { href?: string; onClick?: () => void; children: React.ReactNode; variant?: "primary" | "ghost" | "sand"; type?: "button" | "submit"; disabled?: boolean }) {
    const v = props.variant || "primary"
    const style: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "13px 22px",
        borderRadius: 999,
        fontFamily: FONT.sans,
        fontWeight: 700,
        fontSize: 15,
        textDecoration: "none",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
        border: v === "ghost" ? "1px solid currentColor" : "none",
        background: v === "primary" ? C.forest : v === "sand" ? C.sand : "transparent",
        color: v === "primary" ? C.ivory : v === "sand" ? C.ink : "inherit",
    }
    if (props.href)
        return (
            <a href={props.href} style={style}>
                {props.children}
            </a>
        )
    return (
        <button type={props.type || "button"} onClick={props.onClick} disabled={props.disabled} style={style}>
            {props.children}
        </button>
    )
}

export function Photo(props: { src: string; alt: string; height: number | string; radius?: number; overlay?: boolean; children?: React.ReactNode; eager?: boolean }) {
    return (
        <div style={{ position: "relative", height: props.height, borderRadius: props.radius ?? 18, overflow: "hidden", background: C.forest }}>
            <img src={props.src} alt={props.alt} loading={props.eager ? "eager" : "lazy"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {props.overlay && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,28,24,0.05) 30%, rgba(20,28,24,0.82) 100%)" }} />}
            {props.children && <div style={{ position: "absolute", inset: 0 }}>{props.children}</div>}
        </div>
    )
}

// ---------- Cards ----------
export function ExperienceCard(props: { e: Experience; dark?: boolean }) {
    const e = props.e
    const p = placeOf(e)
    return (
        <a href={expUrl(e.id)} className="or-card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: props.dark ? "rgba(245,244,238,0.05)" : C.white, borderRadius: 20, overflow: "hidden", border: `1px solid ${props.dark ? "rgba(255,255,255,0.08)" : C.border}` }}>
            <Photo src={e.image} alt={`Imagen referencial de ${p.destination}`} height={210} radius={0}>
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Pill tone="sand">{QUEST_LABEL[e.questType]}</Pill>
                </div>
            </Photo>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <div style={{ fontSize: 13, color: props.dark ? "rgba(245,244,238,0.7)" : C.muted }}>
                    {p.destination} · {p.region}
                </div>
                <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{e.title}</div>
                <div style={{ fontSize: 14, color: props.dark ? "rgba(245,244,238,0.75)" : C.muted, lineHeight: 1.45 }}>{e.learning.slice(0, 2).join(" · ")}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto", paddingTop: 8 }}>
                    {e.elements.map((el) => (
                        <Pill key={el} tone={props.dark ? "dark" : "light"}>
                            {ELEMENTS.find((x) => x.id === el)?.name}
                        </Pill>
                    ))}
                    <Pill tone={props.dark ? "dark" : "light"}>{e.duration.replace(" (indicativo)", "")}</Pill>
                    <Pill tone={props.dark ? "dark" : "light"}>{LEVELS[e.level]}</Pill>
                    <Pill tone={props.dark ? "dark" : "light"}>+{e.xp} XP*</Pill>
                </div>
            </div>
        </a>
    )
}

export function HostCard(props: { h: Host; dark?: boolean }) {
    const h = props.h
    return (
        <a href={hostUrl(h.id)} className="or-card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", borderRadius: 20, overflow: "hidden", background: props.dark ? "rgba(245,244,238,0.05)" : C.white, border: `1px solid ${props.dark ? "rgba(255,255,255,0.08)" : C.border}` }}>
            <Photo src={h.image} alt="Paisaje referencial: retrato real pendiente de autorización" height={260} radius={0} overlay>
                <div style={{ position: "absolute", left: 16, bottom: 14, right: 16, color: C.ivory }}>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>Retrato pendiente</div>
                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 22 }}>{h.name}</div>
                </div>
            </Photo>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, color: props.dark ? "rgba(245,244,238,0.7)" : C.muted }}>
                    {h.role} · {h.location}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {h.specialties.map((s) => (
                        <Pill key={s} tone={props.dark ? "dark" : "light"}>
                            {s}
                        </Pill>
                    ))}
                </div>
                <div>
                    <VerificationBadge status={h.verification} />
                </div>
            </div>
        </a>
    )
}

export function ArticleCard(props: { a: Article; dark?: boolean }) {
    const a = props.a
    return (
        <a href={articleUrl(a.id)} className="or-card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            <Photo src={a.image} alt={`Imagen referencial: ${a.title}`} height={220} />
            <Eyebrow color={props.dark ? C.sand : C.muted}>{a.category}</Eyebrow>
            <div style={{ fontFamily: FONT.serif, fontSize: 24, lineHeight: 1.2 }}>{a.title}</div>
            <div style={{ fontSize: 14, color: props.dark ? "rgba(245,244,238,0.75)" : C.muted }}>{a.excerpt}</div>
        </a>
    )
}

// ---------- Radar ----------
export function Radar(props: { current: CapabilityScores; target?: CapabilityScores; size?: number; dark?: boolean; targetLabel?: string }) {
    const size = props.size || 340
    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 40
    const n = CAPABILITIES.length
    const pt = (i: number, v: number) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2
        return [cx + Math.cos(a) * r * (v / 100), cy + Math.sin(a) * r * (v / 100)]
    }
    const poly = (s: CapabilityScores) => CAPABILITIES.map((c, i) => pt(i, s[c.id]).join(",")).join(" ")
    const line = props.dark ? "rgba(245,244,238,0.18)" : C.border
    const text = props.dark ? C.ivory : C.ink
    return (
        <svg viewBox={`-44 -6 ${size + 88} ${size + 12}`} width="100%" style={{ maxWidth: size + 88 }} role="img" aria-label={`Gráfico radar de capacidades${props.target ? ` comparado con ${props.targetLabel || "la misión"}` : ""}. Ver tabla para valores.`}>
            {[25, 50, 75, 100].map((g) => (
                <polygon key={g} points={CAPABILITIES.map((_, i) => pt(i, g).join(",")).join(" ")} fill="none" stroke={line} strokeWidth={1} />
            ))}
            {CAPABILITIES.map((c, i) => {
                const [x, y] = pt(i, 100)
                const [lx, ly] = pt(i, 122)
                return (
                    <g key={c.id}>
                        <line x1={cx} y1={cy} x2={x} y2={y} stroke={line} />
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={700} letterSpacing="0.06em" fill={text} fontFamily={FONT.sans}>
                            {c.name}
                        </text>
                    </g>
                )
            })}
            {props.target && <polygon points={poly(props.target)} fill="rgba(223,195,145,0.18)" stroke={C.sand} strokeWidth={2} strokeDasharray="6 4" />}
            <polygon points={poly(props.current)} fill={props.dark ? "rgba(245,244,238,0.22)" : "rgba(38,61,50,0.22)"} stroke={props.dark ? C.ivory : C.forest} strokeWidth={2} />
        </svg>
    )
}

export function RadarLegend(props: { dark?: boolean; targetLabel?: string }) {
    return (
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 0, borderTop: `3px solid ${props.dark ? C.ivory : C.forest}` }} /> Perfil actual (ejemplo)
            </span>
            {props.targetLabel && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 22, height: 0, borderTop: `3px dashed ${C.sand}` }} /> Requisitos: {props.targetLabel}
                </span>
            )}
        </div>
    )
}

export function CapabilityTable(props: { current: CapabilityScores; target?: CapabilityScores; dark?: boolean }) {
    const border = props.dark ? "rgba(255,255,255,0.12)" : C.border
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <caption className="or-sr">Comparación de capacidades: perfil de ejemplo y requisitos de la misión</caption>
            <thead>
                <tr style={{ textAlign: "left" }}>
                    <th style={{ padding: "8px 4px", borderBottom: `1px solid ${border}` }}>Capacidad</th>
                    <th style={{ padding: "8px 4px", borderBottom: `1px solid ${border}` }}>Actual</th>
                    {props.target && <th style={{ padding: "8px 4px", borderBottom: `1px solid ${border}` }}>Requerido</th>}
                    {props.target && <th style={{ padding: "8px 4px", borderBottom: `1px solid ${border}` }}>Diferencia</th>}
                </tr>
            </thead>
            <tbody>
                {CAPABILITIES.map((c) => {
                    const cur = props.current[c.id]
                    const tgt = props.target ? props.target[c.id] : 0
                    const gap = cur - tgt
                    return (
                        <tr key={c.id}>
                            <td style={{ padding: "7px 4px", borderBottom: `1px solid ${border}` }}>
                                <strong style={{ fontFamily: FONT.sans, fontSize: 12, letterSpacing: "0.06em" }}>{c.name}</strong>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>{c.meaning}</div>
                            </td>
                            <td style={{ padding: "7px 4px", borderBottom: `1px solid ${border}` }}>{cur}</td>
                            {props.target && <td style={{ padding: "7px 4px", borderBottom: `1px solid ${border}` }}>{tgt}</td>}
                            {props.target && (
                                <td style={{ padding: "7px 4px", borderBottom: `1px solid ${border}`, fontWeight: 700 }}>
                                    {gap >= 0 ? "✓ cubierto" : `▲ faltan ${-gap}`}
                                </td>
                            )}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export function gapsFor(current: CapabilityScores, target: CapabilityScores): { id: Capability; name: string; gap: number }[] {
    return CAPABILITIES.map((c) => ({ id: c.id, name: c.name, gap: target[c.id] - current[c.id] }))
        .filter((g) => g.gap > 0)
        .sort((a, b) => b.gap - a.gap)
}

export const PREP_TIPS: Record<Capability, string> = {
    fuerza: "Trabajo de fuerza 2 veces por semana, con foco en piernas y core.",
    resistencia: "Salidas largas progresivas y trekking con desnivel acumulado.",
    control: "Ejercicios de equilibrio, movilidad y práctica técnica guiada.",
    destreza: "Una Learning Quest o clínica con un instructor de la disciplina.",
    percepcion: "Salidas con guía para aprender a leer terreno, clima y riesgo.",
    decision: "Experiencias progresivas donde practicar decisiones conservadoras.",
    adaptacion: "Exposición gradual a altura, frío y fatiga; prioriza sueño y recuperación.",
    liderazgo: "Asumir roles en grupo: comunicación, logística y cuidado del equipo.",
}

// ---------- Enquiry / interest form ----------
// Sends to the Outdooroots backend only when an API URL is configured. Never
// claims success unless the server stored the request.
export function InterestForm(props: { apiUrl?: string; subject: string; kind: "consulta" | "club_roots"; dark?: boolean; onDone?: () => void }) {
    const [f, setF] = useState({ name: "", email: "", message: "", consent: false })
    const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle")
    const [err, setErr] = useState("")
    const [ref, setRef] = useState("")
    const connected = !!props.apiUrl
    const fieldStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${props.dark ? "rgba(255,255,255,0.2)" : C.border}`, background: props.dark ? "rgba(255,255,255,0.06)" : C.white, color: "inherit", fontSize: 15, fontFamily: FONT.body }
    const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }

    const draftText = () =>
        `Outdooroots — ${props.kind === "club_roots" ? "Interés en Club Roots" : "Consulta"}\nAsunto: ${props.subject}\nNombre: ${f.name}\nEmail: ${f.email}\nMensaje: ${f.message}\nConsentimiento: ${f.consent ? "sí" : "no"}\nFecha: ${new Date().toISOString()}\n\nBorrador generado en este dispositivo. No se ha enviado a nadie.`

    const download = () => {
        const blob = new Blob([draftText()], { type: "text/plain;charset=utf-8" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = `outdooroots-${props.kind}.txt`
        a.click()
        URL.revokeObjectURL(a.href)
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || !f.consent) {
            setErr("Completa nombre, un email válido y acepta el uso de tus datos.")
            return
        }
        setErr("")
        if (!connected) {
            download()
            return
        }
        setState("sending")
        try {
            const res = await fetch(`${props.apiUrl!.replace(/\/$/, "")}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    package_name: props.subject,
                    travelers: 1,
                    total_days: 0,
                    subtotal: 0,
                    tax: 0,
                    total_price: 0,
                    language: "es",
                    destinations: [],
                    itinerary: [],
                    brief: { kind: props.kind, consent: true, consent_at: new Date().toISOString(), source: "framer" },
                    contact: { name: f.name.trim(), email: f.email.trim(), notes: f.message.trim() },
                }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.detail || "No se pudo guardar tu solicitud.")
            setRef(data.reference || "")
            setState("ok")
            props.onDone?.()
        } catch (x: any) {
            setState("error")
            setErr(x.message || "No se pudo enviar. Inténtalo de nuevo.")
        }
    }

    if (state === "ok")
        return (
            <div role="status" style={{ padding: 18, borderRadius: 14, background: props.dark ? "rgba(255,255,255,0.06)" : "rgba(38,61,50,0.06)" }}>
                <strong>Recibimos tu {props.kind === "club_roots" ? "interés" : "consulta"}.</strong>
                <div style={{ fontSize: 14, marginTop: 6 }}>Quedó guardada{ref ? ` con la referencia ${ref}` : ""}. El equipo te escribirá. Esto no es una reserva ni un pago.</div>
            </div>
        )

    return (
        <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
                <label style={label} htmlFor={`n-${props.kind}`}>Nombre</label>
                <input id={`n-${props.kind}`} style={fieldStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
            </div>
            <div>
                <label style={label} htmlFor={`e-${props.kind}`}>Email</label>
                <input id={`e-${props.kind}`} type="email" style={fieldStyle} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
            </div>
            <div>
                <label style={label} htmlFor={`m-${props.kind}`}>{props.kind === "club_roots" ? "¿Qué te interesa? (opcional)" : "Tu consulta (fechas, grupo, experiencia previa)"}</label>
                <textarea id={`m-${props.kind}`} rows={3} style={{ ...fieldStyle, resize: "vertical" }} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13 }}>
                <input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} style={{ marginTop: 3 }} />
                <span>Acepto que Outdooroots use estos datos para responder a esta solicitud. (Texto legal de privacidad pendiente.)</span>
            </label>
            {err && (
                <div role="alert" style={{ color: "#B3412E", fontSize: 14 }}>
                    {err}
                </div>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Button type="submit" variant={props.dark ? "sand" : "primary"} disabled={state === "sending"}>
                    {state === "sending" ? "Enviando…" : connected ? "Enviar solicitud" : "Descargar borrador"}
                </Button>
            </div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>
                {connected
                    ? "Se guarda en nuestro sistema sólo si el envío funciona. No es una reserva ni un pago."
                    : "Este formulario todavía no está conectado: se genera un borrador en tu dispositivo y no se envía a nadie."}
            </div>
        </form>
    )
}

export function Modal(props: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    useEffect(() => {
        if (!props.open) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && props.onClose()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [props.open])
    if (!props.open) return null
    return (
        <div role="dialog" aria-modal="true" aria-label={props.title} onClick={props.onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(20,28,24,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: C.ivory, color: C.ink, borderRadius: 20, padding: 24, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 20 }}>{props.title}</div>
                    <button onClick={props.onClose} aria-label="Cerrar" autoFocus style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: C.ink }}>
                        ×
                    </button>
                </div>
                {props.children}
            </div>
        </div>
    )
}
