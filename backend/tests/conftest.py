import os
import pytest
import requests
from dotenv import load_dotenv, dotenv_values
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

BASE_URL = dotenv_values(Path(__file__).resolve().parents[2] / "frontend" / ".env")["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_api(admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


def sample_package(name="QA_Personal_Sample", trip_type="personal", travelers=2, days=3, subtotal=1200, total=1200):
    """Builds valid PackageSnapshot payload with matching itinerary."""
    destinations = [
        {"id": "patagonia", "name": "Patagonia", "days": days, "accommodation": "Explora Patagonia",
         "activities": ["Torres del Paine trek"], "subtotal": subtotal},
    ]
    itinerary = []
    for i in range(days):
        itinerary.append({
            "day": i + 1,
            "destination_id": "patagonia",
            "destination": "Patagonia",
            "accommodation": "Explora Patagonia",
            "overnight": i < days - 1,
            "activities": [{"name": "Torres del Paine trek", "duration": 1}],
        })
    return {
        "package_name": name,
        "travelers": travelers,
        "language": "en",
        "brief": {"trip_type": trip_type, "budget": 5000, "budget_basis": "per_person",
                   "interests": ["trekking"], "pace": "balanced"},
        "total_days": days,
        "subtotal": subtotal,
        "tax": 0,
        "total_price": total,
        "destinations": destinations,
        "itinerary": itinerary,
        "unscheduled_activities": [],
    }


def sample_booking(**kwargs):
    pkg = sample_package(**kwargs)
    pkg["contact"] = {"name": "QA Tester", "email": "qa.test@outdooroots.example.com", "phone": "+56 9 1234 5678", "notes": ""}
    return pkg
