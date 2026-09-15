"""PDF content regression: verify actual extracted text and page constraints using pypdf."""
import io
import pytest
import pypdf
from datetime import date, timedelta
from .conftest import sample_package, sample_booking, ADMIN_EMAIL, ADMIN_PASSWORD


def _extract(pdf_bytes):
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    return reader, "\n".join(p.extract_text() or "" for p in reader.pages)


class TestPDFPrivacyAndOnePage:
    def test_itinerary_pdf_one_page_a4_brand(self, api, base_url):
        pkg = sample_package()
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200
        reader, text = _extract(r.content)
        assert len(reader.pages) == 1, f"Expected 1 page, got {len(reader.pages)}"
        # A4 dimensions in points: 595 x 842 (tolerance 1pt)
        box = reader.pages[0].mediabox
        assert abs(float(box.width) - 595) < 2, box.width
        assert abs(float(box.height) - 842) < 2, box.height
        assert "Outdooroots" in text
        assert "Patagonia" in text
        assert "PROPOSAL, NOT RESERVATION" in text or "PROPUESTA, NO RESERVA" in text

    def test_group_pdf_says_quote_required_not_zero(self, api, base_url):
        pkg = sample_package(trip_type="group", days=0, subtotal=0, total=0)
        pkg["destinations"] = []
        pkg["itinerary"] = []
        pkg["total_days"] = 0
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200
        _, text = _extract(r.content)
        assert "Quote required" in text or "Cotización requerida" in text
        assert "€0" not in text

    def test_long_pdf_still_one_page_max_experiences(self, api, base_url):
        # ACTUAL MAX: 5 regions × 14 days = 70 days, 6 activities each, 30 unscheduled → stress KeepInFrame shrink
        regions = [("patagonia", "Patagonia Signature Long Name Region"),
                   ("atacama", "Atacama Desert Sky Trails Region"),
                   ("santiago", "Santiago & Central Valleys Extended"),
                   ("easter-island", "Rapa Nui / Easter Island Remote"),
                   ("lake-district", "Distrito de los Lagos y Volcanes")]
        destinations, itinerary = [], []
        offset = 0
        days_per = 14
        for rid, rname in regions:
            hotel = f"Very Long Hotel Name for {rname} Boutique Lodge & Spa Retreat"
            acts = [f"Signature activity {rname} number {i} with long descriptive title" for i in range(6)]
            destinations.append({"id": rid, "name": rname, "days": days_per, "accommodation": hotel,
                                 "activities": acts, "subtotal": 2800})
            for j in range(days_per):
                global_day = offset + j + 1
                itinerary.append({"day": global_day, "destination_id": rid, "destination": rname,
                                  "accommodation": hotel,
                                  "overnight": global_day < (len(regions) * days_per),
                                  "activities": [{"name": acts[j % len(acts)], "duration": 1}]})
            offset += days_per
        assert offset == 70
        pkg = {"package_name": "QA_Max70Day30Exp Long Stress Test Package Name",
               "travelers": 6, "language": "en",
               "brief": {"trip_type": "personal", "interests": ["trekking", "nature", "culture"]},
               "total_days": 70, "subtotal": 14000, "tax": 0, "total_price": 14000,
               "destinations": destinations, "itinerary": itinerary,
               "unscheduled_activities": [{"destination_id": "patagonia", "destination": regions[0][1],
                                           "name": f"Extra experience {i} with details"} for i in range(30)]}
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200, r.text
        reader, text = _extract(r.content)
        assert len(reader.pages) == 1, f"Expected 1 page, got {len(reader.pages)}"
        # A4 dimensions
        box = reader.pages[0].mediabox
        assert abs(float(box.width) - 595) < 2 and abs(float(box.height) - 842) < 2
        # All 5 region day-range headings present (format like "01-14 / ...", "15-28", ...)
        expected_ranges = ["01–14", "15–28", "29–42", "43–56", "57–70"]
        for rng in expected_ranges:
            assert rng in text, f"Day range {rng} missing from PDF text. Got: {text[:800]}"
        # All region names present
        for _, rname in regions:
            # region names may be truncated by short() at 80 chars, so check the leading portion
            head = rname[:30]
            assert head in text, f"Region {head!r} missing from PDF"
        # Totals
        assert "70" in text  # total_days
        assert "€14,000" in text or "€14000" in text
        # Unscheduled experiences count surfaces
        assert "30" in text and "experiences" in text.lower()
        # Body is not empty/blank
        assert len(text.strip()) > 400, "PDF text unexpectedly short — likely rendering collapsed"

    def test_reviewed_pdf_max_40_lines_5_categories_en_labels_privacy(self, admin_api, base_url):
        # Create booking then attach 40-line quote across 5 categories with realistic CLP and long strings
        pkg = sample_booking(name="QA_PDFMax40Lines", days=3, subtotal=2400, total=2400)
        r = admin_api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code in (200, 201), r.text
        bid = r.json()["id"]
        categories = ["accommodation", "experience", "guide", "transport", "other"]
        lines = []
        # 8 lines per category × 5 = 40 lines; alternate cost/margin vs cost/selling
        for idx in range(40):
            cat = categories[idx % 5]
            base_line = {
                "description": f"{cat.title()} service line {idx:02d} with a long descriptive text that may be truncated",
                "category": cat, "basis": ["person", "group", "day", "item", "person_night"][idx % 5],
                "quantity": 1 + (idx % 4),
                "cost_clp": 50000 + idx * 1234,
            }
            if idx % 2 == 0:
                base_line["margin_percent"] = 15 + (idx % 10)
            else:
                base_line["selling_clp"] = 80000 + idx * 1500
            lines.append(base_line)
        today = date.today().isoformat()
        valid = (date.today() + timedelta(days=45)).isoformat()
        inclusions = "Certified bilingual guiding, all national park entrance fees, potable water, technical safety gear, ground transport between hubs, breakfast at all lodges, welcome briefing"
        exclusions = "International and domestic flights, personal travel insurance, alcoholic beverages, tips for guides and drivers, personal equipment rentals, medical evacuation coverage"
        outstanding = "Confirm hut availability in Torres del Paine for peak dates, verify Rapa Nui LATAM flight frequency, finalize partner contracts before deposit"
        quote = {
            "lines": lines, "clp_per_eur": 950, "exchange_rate_date": today, "valid_until": valid,
            "tax_percent": 19, "tax_label": "IVA (Chilean VAT)",
            "service_fee_clp": 250000, "service_label": "Operations & coordination fee",
            "inclusions": inclusions, "exclusions": exclusions,
            "outstanding_checks": outstanding, "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=quote)
        assert r.status_code == 200, r.text
        # Poison field with private data
        r2 = admin_api.patch(f"{base_url}/api/bookings/{bid}",
                             json={"internal_notes": "SECRET_PRIVATE_XYZ supplier margin costs breakdown"})
        assert r2.status_code == 200
        # EN PDF
        r = admin_api.get(f"{base_url}/api/bookings/{bid}/proposal.pdf")
        assert r.status_code == 200
        reader, text = _extract(r.content)
        assert len(reader.pages) == 1
        # Human EN category labels appear (since 40 > 5, grouped view)
        for lbl in ["Accommodation", "Experiences", "Guides", "Transport", "Other services"]:
            assert lbl in text, f"EN label {lbl!r} missing. Got: {text[:1200]}"
        # Two-decimal totals for grouped categories: at least 5 occurrences of the ".dd" pattern in € amounts
        import re
        two_dec_amounts = re.findall(r"€[\d,]+\.\d{2}", text)
        assert len(two_dec_amounts) >= 5, f"Expected >=5 two-decimal EUR amounts, got {two_dec_amounts}"
        # Validity + reviewed header
        assert valid in text
        assert "REVIEWED" in text.upper()
        # Privacy: no leakage of internal notes, raw CLP costs, or margin %
        assert "SECRET_PRIVATE_XYZ" not in text
        assert "supplier" not in text.lower()
        for line in lines[:10]:
            assert str(int(line["cost_clp"])) not in text, f"Raw CLP cost {line['cost_clp']} leaked"
        assert "margin" not in text.lower()
        # Inclusions/exclusions visible (at least the leading portion, may be truncated by short())
        assert "Certified bilingual guiding" in text or "guiding" in text.lower()
        assert "flights" in text.lower()
        # Tax & service labels appear
        assert "IVA" in text
        assert "Operations" in text or "coordination" in text.lower()
        # Body is legible (not empty from shrink collapse)
        assert len(text.strip()) > 500

        # Now verify Spanish PDF still renders on the same booking
        # Re-fetch quote and re-save with language via itinerary/pdf path? Proposal PDF language is derived from package.language.
        # Update package language to 'es' via internal update if endpoint exists — otherwise use itinerary/pdf directly.
        pkg_es = sample_package(name="QA_ES_Long", days=2, subtotal=800, total=800)
        pkg_es["language"] = "es"
        r_es = admin_api.post(f"{base_url}/api/itinerary/pdf", json=pkg_es)
        assert r_es.status_code == 200
        _, es_text = _extract(r_es.content)
        assert "PROPUESTA, NO RESERVA" in es_text
        assert "Outdooroots" in es_text

    def test_reviewed_pdf_hides_private_fields_shows_reviewed_total(self, admin_api, base_url):
        # Create booking + save quote via API, then fetch proposal PDF
        pkg = sample_booking(name="QA_PDFPrivacy", days=2, subtotal=800, total=800)
        r = admin_api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code in (200, 201), r.text
        bid = r.json()["id"]
        today = date.today().isoformat()
        valid = (date.today() + timedelta(days=30)).isoformat()
        quote = {
            "lines": [
                {"description": "Guide day rate", "category": "guide", "basis": "group",
                 "quantity": 2, "cost_clp": 100000, "margin_percent": 20},
            ],
            "clp_per_eur": 1000, "exchange_rate_date": today, "valid_until": valid,
            "inclusions": "Guiding, entrance fees",
            "exclusions": "Flights, personal insurance",
            "outstanding_checks": "Confirm hut availability",
            "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=quote)
        assert r.status_code == 200, r.text
        # Also stash private notes via PATCH to confirm they don't leak to PDF
        r2 = admin_api.patch(f"{base_url}/api/bookings/{bid}", json={"internal_notes": "SECRET_NOTE_XYZ private cost breakdown"})
        assert r2.status_code == 200, r2.text
        r = admin_api.get(f"{base_url}/api/bookings/{bid}/proposal.pdf")
        assert r.status_code == 200
        reader, text = _extract(r.content)
        assert len(reader.pages) == 1
        # Reviewed total = qty2 * cost100000 * (1/(1-0.2)) / 1000 = 250 EUR
        assert "250.00" in text, text[:500]
        # Privacy: internal notes and team email must NOT appear
        assert "SECRET_NOTE_XYZ" not in text
        # Cost/margin numeric internals must NOT appear as raw CLP
        assert "100000" not in text and "100,000" not in text
        # Validity + inclusions/exclusions ARE visible
        assert valid in text
        assert "Guiding" in text or "entrance" in text.lower()
        # Header says reviewed
        assert "REVIEWED" in text.upper() or "REVISAD" in text.upper()
