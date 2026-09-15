import os
import pytest
import requests
from datetime import date, timedelta
from .conftest import sample_package, sample_booking, ADMIN_EMAIL, ADMIN_PASSWORD


# ---------------- Health ----------------
class TestHealth:
    def test_root_ok(self, api, base_url):
        r = api.get(f"{base_url}/api/")
        assert r.status_code == 200
        assert "Outdooroots" in r.json()["message"]


# ---------------- Auth ----------------
class TestAuth:
    def test_login_ok(self, api, base_url):
        r = api.post(f"{base_url}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["token_type"] == "bearer"
        assert data["email"] == ADMIN_EMAIL
        assert isinstance(data["access_token"], str) and len(data["access_token"]) > 30

    def test_login_bad_password(self, api, base_url):
        r = api.post(f"{base_url}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_bookings_requires_auth(self, api, base_url):
        assert api.get(f"{base_url}/api/bookings").status_code == 401


# ---------------- Public itinerary PDF ----------------
class TestItineraryPDF:
    def test_pdf_basic(self, api, base_url):
        r = api.post(f"{base_url}/api/itinerary/pdf", json=sample_package())
        assert r.status_code == 200, r.text
        assert r.headers["content-type"].startswith("application/pdf")
        assert r.content[:4] == b"%PDF"

    def test_pdf_zero_days(self, api, base_url):
        pkg = sample_package(days=0) if False else {
            "package_name": "QA_Empty", "travelers": 2, "language": "en",
            "brief": {"trip_type": "personal"}, "total_days": 0, "subtotal": 0, "tax": 0,
            "total_price": 0, "destinations": [], "itinerary": [], "unscheduled_activities": []
        }
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200, r.text
        assert r.content[:4] == b"%PDF"

    def test_pdf_max_payload_30_experiences(self, api, base_url):
        # 5 regions × 6 activities = 30 experiences; long names + accents
        regions = [
            ("patagonia", "Patagonia"),
            ("atacama", "Atacama"),
            ("santiago", "Santiago"),
            ("easter-island", "Rapa Nui"),
            ("lake-district", "Distrito de los Lagos"),
        ]
        destinations = []
        itinerary = []
        day = 1
        for rid, rname in regions:
            acts = [f"Experiencia {rname} número {i+1} — travesía ñ ü á" for i in range(6)]
            destinations.append({"id": rid, "name": rname, "days": 4, "accommodation": f"Lodge {rname}",
                                 "activities": acts[:6], "subtotal": 100})
            for j in range(4):
                # only 1 activity per day at max
                itinerary.append({
                    "day": day, "destination_id": rid, "destination": rname,
                    "accommodation": f"Lodge {rname}",
                    "overnight": not (rid == "lake-district" and j == 3),
                    "activities": [{"name": acts[j], "duration": 1}],
                })
                day += 1
        pkg = {
            "package_name": "QA_Maximal_Pañorámica",
            "travelers": 4, "language": "es",
            "brief": {"trip_type": "personal"},
            "total_days": 20, "subtotal": 500, "tax": 0, "total_price": 500,
            "destinations": destinations, "itinerary": itinerary,
            "unscheduled_activities": [{"destination_id": "patagonia", "destination": "Patagonia", "name": acts[5]} for acts in [[f"Exp {i}" for i in range(6)]]],
        }
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200, r.text[:400]
        assert r.content[:4] == b"%PDF"

    def test_pdf_language_es(self, api, base_url):
        pkg = sample_package()
        pkg["language"] = "es"
        r = api.post(f"{base_url}/api/itinerary/pdf", json=pkg)
        assert r.status_code == 200
        assert r.content[:4] == b"%PDF"


# ---------------- Booking creation / persistence ----------------
class TestBookingLifecycle:
    created_id = None
    created_ref = None

    def test_create_personal_booking(self, api, admin_api, base_url):
        payload = sample_booking(name="QA_Personal_Booking")
        r = api.post(f"{base_url}/api/bookings", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["id"] and data["reference"].startswith("OR-")
        assert data["status"] == "new"
        assert data["contact"]["email"] == "qa.test@outdooroots.example.com"
        TestBookingLifecycle.created_id = data["id"]
        TestBookingLifecycle.created_ref = data["reference"]

        # verify persistence via admin GET
        r2 = admin_api.get(f"{base_url}/api/bookings")
        assert r2.status_code == 200
        assert any(b["id"] == data["id"] for b in r2.json())

    def test_create_group_booking_quote_required(self, api, base_url):
        pkg = sample_booking(name="QA_Group_Booking", trip_type="group", travelers=100, total=0)
        pkg["brief"].update({"organization": "QA Corp", "goals": "Team offsite"})
        r = api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code == 200, r.text
        assert r.json()["brief"]["trip_type"] == "group"

    def test_create_incomplete_zero_days_allowed(self, api, base_url):
        payload = {
            "package_name": "QA_Zero", "travelers": 2, "language": "en",
            "brief": {"trip_type": "personal"},
            "total_days": 0, "subtotal": 0, "tax": 0, "total_price": 0,
            "destinations": [], "itinerary": [], "unscheduled_activities": [],
            "contact": {"name": "QA Zero", "email": "qa.zero@outdooroots.example.com"},
        }
        r = api.post(f"{base_url}/api/bookings", json=payload)
        assert r.status_code == 200, r.text

    def test_invalid_contact_rejected(self, api, base_url):
        pkg = sample_booking(name="QA_BadContact")
        pkg["contact"]["email"] = "not-an-email"
        r = api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code == 422

    def test_duplicate_destinations_rejected(self, api, base_url):
        pkg = sample_booking(name="QA_Dupe")
        pkg["destinations"].append(dict(pkg["destinations"][0]))
        pkg["total_days"] = pkg["destinations"][0]["days"] * 2
        # rebuild itinerary matching new total_days but duplicate ids -> should 422
        r = api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code == 422

    def test_overcapacity_travelers_rejected(self, api, base_url):
        pkg = sample_booking(name="QA_BigParty")
        pkg["travelers"] = 999999
        r = api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code == 422

    def test_itinerary_order_mismatch_rejected(self, api, base_url):
        pkg = sample_booking(name="QA_OrderMismatch", days=3)
        # reorder itinerary
        pkg["itinerary"][0], pkg["itinerary"][2] = pkg["itinerary"][2], pkg["itinerary"][0]
        # days become out of order → validator should reject
        r = api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code == 422


# ---------------- Admin workflow, quote, PDF ----------------
class TestAdminWorkflow:
    booking_id = None

    def test_seed_booking(self, api, base_url):
        pkg = sample_booking(name="QA_AdminFlow", days=3)
        r = api.post(f"{base_url}/api/bookings", json=pkg)
        assert r.status_code == 200
        TestAdminWorkflow.booking_id = r.json()["id"]

    def test_patch_workflow_contact_timestamps(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        r = admin_api.patch(f"{base_url}/api/bookings/{bid}", json={"status": "contacted", "internal_notes": "Reached out", "next_action": "Send proposal"})
        assert r.status_code == 200, r.text
        assert r.json().get("first_contact_at")

    def test_patch_lost_requires_reason(self, admin_api, base_url):
        # create new booking to test lost
        r0 = admin_api.post(f"{base_url}/api/bookings", json=sample_booking(name="QA_Lost"))
        bid = r0.json()["id"]
        r = admin_api.patch(f"{base_url}/api/bookings/{bid}", json={"status": "lost"})
        assert r.status_code == 422
        r2 = admin_api.patch(f"{base_url}/api/bookings/{bid}", json={"status": "lost", "lost_reason": "Budget"})
        assert r2.status_code == 200

    def test_save_quote_and_math(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        today = date.today().isoformat()
        valid = (date.today() + timedelta(days=30)).isoformat()
        # 100000 CLP cost, margin 20 -> selling 125000; qty 2, fx 1000 -> 250 EUR
        payload = {
            "lines": [
                {"description": "Guided trek", "category": "guide", "basis": "group",
                 "quantity": 2, "cost_clp": 100000, "margin_percent": 20},
            ],
            "clp_per_eur": 1000, "exchange_rate_date": today, "valid_until": valid,
            "inclusions": "Guide, permits", "exclusions": "Flights", "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=payload)
        assert r.status_code == 200, r.text
        summary = r.json()["quote_summary"]
        assert summary["total_eur"] == 250.0
        assert summary["subtotal_eur"] == 250.0

    def test_reject_margin_100(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        today = date.today().isoformat()
        valid = (date.today() + timedelta(days=30)).isoformat()
        payload = {
            "lines": [{"description": "X", "category": "guide", "basis": "group",
                       "quantity": 1, "cost_clp": 100, "margin_percent": 100}],
            "clp_per_eur": 1000, "exchange_rate_date": today, "valid_until": valid,
            "inclusions": "a", "exclusions": "b", "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=payload)
        assert r.status_code == 422

    def test_reject_future_fx_date(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        future = (date.today() + timedelta(days=5)).isoformat()
        valid = (date.today() + timedelta(days=30)).isoformat()
        payload = {
            "lines": [{"description": "X", "category": "guide", "basis": "group",
                       "quantity": 1, "cost_clp": 100, "selling_clp": 150}],
            "clp_per_eur": 1000, "exchange_rate_date": future, "valid_until": valid,
            "inclusions": "a", "exclusions": "b", "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=payload)
        assert r.status_code == 422

    def test_reject_expired_validity(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        today = date.today().isoformat()
        expired = (date.today() - timedelta(days=1)).isoformat()
        payload = {
            "lines": [{"description": "X", "category": "guide", "basis": "group",
                       "quantity": 1, "cost_clp": 100, "selling_clp": 150}],
            "clp_per_eur": 1000, "exchange_rate_date": today, "valid_until": expired,
            "inclusions": "a", "exclusions": "b", "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=payload)
        assert r.status_code == 422

    def test_reject_unapproved(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        today = date.today().isoformat()
        valid = (date.today() + timedelta(days=30)).isoformat()
        payload = {
            "lines": [{"description": "X", "category": "guide", "basis": "group",
                       "quantity": 1, "cost_clp": 100, "selling_clp": 150}],
            "clp_per_eur": 1000, "exchange_rate_date": today, "valid_until": valid,
            "inclusions": "a", "exclusions": "b", "approved": False,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=payload)
        assert r.status_code == 422

    def test_reject_zero_fx(self, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        today = date.today().isoformat()
        valid = (date.today() + timedelta(days=30)).isoformat()
        payload = {
            "lines": [{"description": "X", "category": "guide", "basis": "group",
                       "quantity": 1, "cost_clp": 100, "selling_clp": 150}],
            "clp_per_eur": 0, "exchange_rate_date": today, "valid_until": valid,
            "inclusions": "a", "exclusions": "b", "approved": True,
        }
        r = admin_api.put(f"{base_url}/api/bookings/{bid}/quote", json=payload)
        assert r.status_code == 422

    def test_proposal_pdf_admin_only(self, api, admin_api, base_url):
        bid = TestAdminWorkflow.booking_id
        # unauthenticated blocked
        assert api.get(f"{base_url}/api/bookings/{bid}/proposal.pdf").status_code == 401
        # admin ok
        r = admin_api.get(f"{base_url}/api/bookings/{bid}/proposal.pdf")
        assert r.status_code == 200, r.text[:300]
        assert r.headers["content-type"].startswith("application/pdf")
        assert r.content[:4] == b"%PDF"

    def test_proposal_pdf_requires_saved_quote(self, admin_api, base_url):
        # new booking without quote
        r0 = admin_api.post(f"{base_url}/api/bookings", json=sample_booking(name="QA_NoQuote"))
        bid = r0.json()["id"]
        r = admin_api.get(f"{base_url}/api/bookings/{bid}/proposal.pdf")
        assert r.status_code == 409

    def test_patch_unknown_booking_404(self, admin_api, base_url):
        r = admin_api.patch(f"{base_url}/api/bookings/does-not-exist", json={"status": "contacted"})
        assert r.status_code == 404
