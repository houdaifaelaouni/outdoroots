import * as React from "react"
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Outdooroots — FAQ accordion with the questions that block bookings.
// Answers in [brackets] are placeholders: replace them with your real policies.

const FONTS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Spectral&display=swap"
const C = { navy: "#0A1345", muted: "rgba(10,19,69,0.62)", line: "rgba(10,19,69,0.1)" }
const HEAD = "Inter, system-ui, sans-serif"
const BODY = "'Golos Text', Inter, system-ui, sans-serif"

type QA = { question: string; answer: string }

/**
 * @framerSupportedLayoutWidth stretch
 * @framerSupportedLayoutHeight auto
 */
export default function ORFAQ(props: { title: string; items: QA[]; firstOpen: boolean; accent: string; style?: React.CSSProperties }) {
    const [open, setOpen] = useState<number>(props.firstOpen ? 0 : -1)
    useEffect(() => {
        if (typeof document !== "undefined" && !document.getElementById("or-site-fonts")) {
            const l = document.createElement("link")
            l.id = "or-site-fonts"
            l.rel = "stylesheet"
            l.href = FONTS
            document.head.appendChild(l)
        }
    }, [])
    const placeholder = props.items.some((i) => i.answer.includes("["))
    return (
        <section style={{ ...props.style, width: "100%", fontFamily: BODY, color: C.navy }}>
            {placeholder && RenderTarget.current() === RenderTarget.canvas && (
                <div style={{ marginBottom: 10, padding: "6px 10px", borderRadius: 8, background: "#FFF4E5", color: "#8A4B00", fontSize: 12 }}>Editor only: replace the [bracketed] answers with your real policies before publishing.</div>
            )}
            <h2 style={{ margin: "0 0 14px", fontFamily: HEAD, fontWeight: 500, fontSize: 30, letterSpacing: "-0.045em" }}>{props.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {props.items.map((it, i) => {
                    const on = open === i
                    const id = `or-faq-${i}`
                    return (
                        <div key={it.question} style={{ borderRadius: 14, background: "#FFFFFF", border: `1px solid ${on ? "rgba(10,19,69,0.18)" : C.line}` }}>
                            <h3 style={{ margin: 0 }}>
                                <button
                                    onClick={() => setOpen(on ? -1 : i)}
                                    aria-expanded={on}
                                    aria-controls={id}
                                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: BODY, fontSize: 16, fontWeight: 500, color: C.navy }}
                                >
                                    {it.question}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={props.accent} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0, transition: "transform .2s ease", transform: on ? "rotate(45deg)" : "none" }}>
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </button>
                            </h3>
                            <div id={id} role="region" hidden={!on} style={{ padding: "0 18px 16px", fontSize: 15, lineHeight: 1.55, color: C.muted }}>
                                {it.answer}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

addPropertyControls(ORFAQ, {
    title: { type: ControlType.String, title: "Title", defaultValue: "Questions before you go" },
    firstOpen: { type: ControlType.Boolean, title: "First open", defaultValue: true },
    items: {
        type: ControlType.Array,
        title: "Questions",
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, title: "Question", defaultValue: "Question" },
                answer: { type: ControlType.String, title: "Answer", displayTextArea: true, defaultValue: "[Answer]" },
            },
        },
        defaultValue: [
            { question: "What's included in the price?", answer: "Everything listed under “What's included” above. International flights, insurance and personal expenses are not included. Your quote lists every item." },
            { question: "When do I pay?", answer: "Nothing is charged when you send a request. [Add your payment terms, e.g. deposit and when the balance is due.]" },
            { question: "Can I change dates or cancel?", answer: "[Add your change and cancellation policy.]" },
            { question: "How big are the groups?", answer: "[Add your maximum group size and whether private trips are possible.]" },
            { question: "Do I need my own gear?", answer: "[List what travelers bring and what you can rent or provide.]" },
            { question: "What happens if the weather is bad?", answer: "Mountain weather changes fast. Your guide adapts the route for safety, and [add what happens to activities that can't run]." },
        ],
    },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F46D2B" },
})
