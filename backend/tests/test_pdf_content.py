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
        # 5 regions each 4 activities plus 30 unscheduled → stress KeepInFrame shrink
        regions = [("patagonia", "Patagonia"), ("atacama", "Atacama"), ("santiago", "Santiago"),
                   ("easter-island", "Rapa Nui"), ("lake-district", "Distrito de los Lagos")]
        destinations, itinerary = [], []
        offset = 0
        for rid, rname in regions:
            days = 2
            destinations.append({"id": rid, "name": rname, "days": days, "accommodation": f"Hotel {rname}",
                                 "activities": [f"Actividad {rname} {i}" for i in range(6)], "subtotal": 400})
            for j in range(days):
                itinerary.append({"day": offset + j + 1, "destination_id": rid, "destination": rname,
                                  "accommodation": f"Hotel {rname}",
                                  "overnight": (offset + j) < (len(regions) * days - 1),
                                  "activities": [{"name": f"Actividad {rname} {j}", "duration": 1}]})
            offset += days
        pkg = {"package_name": "QA_MaxLong", "travelers": 4, "language": "en",
               "brief": {"trip_type": "personal", "interests": ["trekking"]},
               "total_days": offset, "subtotal": 2000, "tax": 0, "total_price": 2000,
               "destinations": destinations, "itinerary": itinerary,
               "unscheduled_activities": [{"destination_id": "patagonia", "destination": "Patagonia", "name": f"Extra {i}"} for i in range(30)]}
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200, r.text
        reader, text = _extract(r.content)
        assert len(reader.pages) == 1
        # All region names present in one-page summary
        for _, rname in regions:
            assert rname in text, f"Region {rname} missing from PDF"

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
