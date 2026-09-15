from io import BytesIO
from html import escape
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, KeepInFrame, Spacer

NAVY = HexColor("#0B192C")
COPPER = HexColor("#A7613D")
CREAM = HexColor("#FDFBF7")
MUTED = HexColor("#5C656E")


def render_itinerary_pdf(package, reviewed=None, language="en"):
    """Customer-safe one-page summary. Never render arbitrary record fields or internal notes."""
    es = language == "es"
    out = BytesIO()
    pdf = canvas.Canvas(out, pagesize=A4)
    width, height = A4
    pdf.setTitle(f"Outdooroots — {package.package_name}")
    pdf.setAuthor("Outdooroots")
    pdf.setFillColor(CREAM)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    pdf.setFillColor(NAVY)
    pdf.setFont("Times-Roman", 24)
    pdf.drawString(40, height - 48, "Outdooroots")
    pdf.setFont("Helvetica", 8)
    pdf.drawRightString(width - 40, height - 45, "AVENTURA · VIDA · NATURALEZA")
    pdf.setStrokeColor(COPPER)
    pdf.line(40, height - 65, width - 40, height - 65)
    pdf.setFillColor(COPPER)
    pdf.setFont("Helvetica", 8)
    pdf.drawString(40, height - 90, "PROPUESTA, NO RESERVA" if es else "PROPOSAL, NOT RESERVATION")

    def paragraph(text, size=9, font="Helvetica", color=MUTED):
        return Paragraph(text, ParagraphStyle("text", fontName=font, fontSize=size, leading=size * 1.35, textColor=color))

    title = KeepInFrame(width - 80, 64, [paragraph(escape(package.package_name), 30, "Times-Roman", NAVY)], mode="shrink")
    _, title_h = title.wrapOn(pdf, width - 80, 64)
    title.drawOn(pdf, 40, height - 108 - title_h)
    start = package.start_date[:10] if package.start_date else ("Fechas flexibles" if es else "Flexible dates")
    end = f" · {'Regreso preferido' if es else 'Preferred return'}: {package.end_date[:10]}" if package.end_date else ""
    info = paragraph(f"{package.travelers} {'viajeros' if es else 'travelers'} · {package.total_days} {'días' if es else 'days'} · {escape(start + end)}", 9)
    _, info_h = info.wrap(width - 80, 35)
    info.drawOn(pdf, 40, height - 185 - info_h)

    def short(text, limit):
        return text if len(text) <= limit else text[:limit].rsplit(" ", 1)[0] + "…"

    content = []
    offset = 0
    for destination in package.destinations:
        count = destination.days
        heading = f"{offset + 1:02d}–{offset + count:02d} / {escape(destination.name)}"
        content += [paragraph(heading, 15, "Times-Roman", NAVY), Spacer(1, 3)]
        nights = count - (1 if offset + count == package.total_days else 0)
        content.append(paragraph(f"{'Estadía propuesta' if es else 'Proposed stay'}: {escape(short(destination.accommodation, 80))} · {nights} {'noches' if es else 'nights'}", 8))
        highlights = destination.activities[:2] if reviewed or len(package.destinations) > 3 else destination.activities[:3]
        activities = escape(short(" · ".join(highlights), 140))
        more = len(destination.activities) - len(highlights)
        if more:
            activities += f" · +{more} {'experiencias; detalle en plataforma' if es else 'experiences; full detail on platform'}"
        content.append(paragraph(activities or ("Tiempo libre; experiencias por definir" if es else "Open time; experiences to be discussed"), 8.5))
        content.append(Spacer(1, 12))
        offset += count
    if not package.destinations:
        content.append(paragraph("Ruta y duración por definir con el equipo." if es else "Route and duration to be designed with the team.", 12, "Times-Roman"))
    items = []
    if len(package.destinations) > 1:
        items.append("Traslados entre regiones y noches de tránsito por revisar." if es else "Inter-region transport and any transit nights require review.")
    if any(d.id == "easter-island" for d in package.destinations):
        items.append("Rapa Nui: vuelos y requisitos de acceso por revisar." if es else "Rapa Nui: flights and access requirements need review.")
    if package.unscheduled_activities:
        items.append(f"{len(package.unscheduled_activities)} " + ("experiencias sin programar; detalle completo en la plataforma." if es else "unscheduled experiences; see full details on the platform."))
    if package.start_date and package.end_date and package.total_days:
        span = (datetime.fromisoformat(package.end_date.replace("Z", "+00:00")).date() - datetime.fromisoformat(package.start_date.replace("Z", "+00:00")).date()).days + 1
        if span != package.total_days:
            items.append("Las fechas preferidas no coinciden con la duración." if es else "Preferred dates do not match the composed duration.")
    items.append("Disponibilidad, temporada, dificultad, edad y accesibilidad: revisión del equipo requerida." if es else "Availability, season, difficulty, age suitability and accessibility: team review required.")
    if reviewed:
        content += [paragraph("DESGLOSE REVISADO · EUR" if es else "REVIEWED BREAKDOWN · EUR", 8, "Helvetica-Bold", COPPER), Spacer(1, 4)]
        lines = reviewed["lines"]
        if len(lines) > 5:
            groups = {}
            for line in lines:
                category = line.get("category", "other")
                groups[category] = groups.get(category, 0) + line["total_eur"]
            labels = {"accommodation": "Alojamientos", "experience": "Experiencias", "guide": "Guías", "transport": "Transporte", "other": "Otros servicios"}
            for category, total in groups.items():
                content.append(paragraph(f"{escape(labels[category] if es else category.title())}: €{total:,.2f}", 8))
        else:
            for line in lines:
                basis = {"person": "persona", "group": "grupo", "room_night": "habitación/noche", "person_night": "persona/noche", "day": "día", "item": "unidad"}.get(line["basis"], line["basis"]) if es else line["basis"].replace("_", " ")
                content.append(paragraph(f"{escape(short(line['description'], 80))} · {line['quantity']:g} × {escape(basis)} · €{line['total_eur']:,.2f}", 8))
        if reviewed["tax_eur"]:
            content.append(paragraph(f"{escape(reviewed['tax_label'])}: €{reviewed['tax_eur']:,.2f}", 8))
        if reviewed["service_eur"]:
            content.append(paragraph(f"{escape(reviewed['service_label'])}: €{reviewed['service_eur']:,.2f}", 8))
        content.append(paragraph(f"{'Cambio aprobado' if es else 'Approved conversion'}: 1 EUR = {reviewed['clp_per_eur']:g} CLP · {reviewed['exchange_rate_date']}", 7.5))
        if reviewed.get("outstanding_checks"):
            items.append(reviewed["outstanding_checks"])
        content.append(Spacer(1, 8))
    content += [paragraph("POR REVISAR" if es else "PLANNING NOTES", 8, "Helvetica-Bold", COPPER), Spacer(1, 4), paragraph(escape(" ".join(items)), 8)]
    body = KeepInFrame(width - 80, 390, content, mode="shrink")
    _, body_h = body.wrapOn(pdf, width - 80, 390)
    body.drawOn(pdf, 40, height - 228 - body_h)

    pdf.setFillColor(NAVY)
    pdf.rect(40, 112, width - 80, 94, fill=1, stroke=0)
    label = ("PROPUESTA REVISADA · EUR" if es else "REVIEWED PROPOSAL · EUR") if reviewed else ("ESTIMACIÓN ILUSTRATIVA · EUR" if es else "ILLUSTRATIVE ESTIMATE · EUR")
    pdf.setFillColor(CREAM)
    pdf.setFont("Helvetica", 8)
    pdf.drawString(55, 186, label)
    amount = reviewed["total_eur"] if reviewed else package.total_price
    quote_required = (getattr(package, "brief", None) and package.brief.trip_type == "group") or amount == 0
    pdf.setFont("Times-Roman", 26)
    pdf.drawString(55, 153, ("Cotización requerida" if es else "Quote required") if quote_required and not reviewed else (f"€{amount:,.2f}" if reviewed else f"€{amount:,.0f}"))
    pdf.setFont("Helvetica", 8)
    if not quote_required or reviewed:
        pdf.drawRightString(width - 55, 159, f"€{amount / package.travelers:,.0f} / {'persona' if es else 'person'}")
    note = (f"{'Válida hasta' if es else 'Valid until'} {reviewed['valid_until']}" if reviewed else ("Tarifas de ejemplo, no aprobadas. Los importes faltantes requieren cotización." if es else "Sample rates, not approved. Missing costs require a quote."))
    pdf.drawString(55, 129, note)
    footer_text = (reviewed.get("inclusions", "") + " | " + reviewed.get("exclusions", "")) if reviewed else ("Incluye solo experiencias y noches con precio de ejemplo. Excluye vuelos, traslados y conceptos sin precio. Sin impuestos ni cargos no configurados." if es else "Includes sample-priced experiences and stays only. Excludes flights, transfers and unpriced items. No unconfigured tax or fees applied.")
    foot = KeepInFrame(width - 80, 50, [paragraph(escape(footer_text), 7.5), paragraph("En un nuevo viaje · Outdooroots", 8, "Times-Italic", COPPER)], mode="shrink")
    _, foot_h = foot.wrapOn(pdf, width - 80, 50)
    foot.drawOn(pdf, 40, 94 - foot_h)
    pdf.showPage()
    pdf.save()
    return out.getvalue()
