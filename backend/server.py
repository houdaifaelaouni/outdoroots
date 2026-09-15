from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, Response
from itinerary_pdf import render_itinerary_pdf
from inquiry_models import AdventureBrief, InquiryUpdate, ReviewedQuote
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt
import bcrypt
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator
from typing import List, Optional, Literal, Annotated
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

app = FastAPI()
api_router = APIRouter(prefix="/api")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorized")
    return user


class LoginRequest(BaseModel):
    email: str
    password: str


class ContactInfo(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=200)
    notes: Optional[str] = Field(default="", max_length=2000)

    @field_validator("name")
    @classmethod
    def name_required(cls, value):
        if not value.strip():
            raise ValueError("Please provide your name")
        return value.strip()


DestinationId = Literal["patagonia", "atacama", "santiago", "easter-island", "lake-district"]
ShortText = Annotated[str, Field(min_length=1, max_length=180)]


class BookingDestination(BaseModel):
    id: DestinationId
    name: ShortText
    days: int = Field(ge=1, le=14)
    accommodation: ShortText
    activities: List[ShortText] = Field(default_factory=list, max_length=6)
    subtotal: float = Field(default=0, ge=0, allow_inf_nan=False)


class ItineraryActivity(BaseModel):
    name: ShortText
    duration: Literal[0.5, 1]


class ItineraryDay(BaseModel):
    day: int = Field(ge=1, le=70)
    date: Optional[str] = Field(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    destination_id: DestinationId
    destination: ShortText
    accommodation: ShortText
    overnight: bool
    activities: List[ItineraryActivity] = Field(default_factory=list, max_length=2)

    @model_validator(mode="after")
    def validate_day(self):
        if self.date:
            datetime.strptime(self.date, "%Y-%m-%d")
        if sum(a.duration for a in self.activities) > 1:
            raise ValueError("An itinerary day cannot exceed one day of experiences")
        return self


class UnscheduledActivity(BaseModel):
    destination_id: DestinationId
    destination: ShortText
    name: ShortText


class PackageSnapshot(BaseModel):
    package_name: str = Field(min_length=1, max_length=120)
    travelers: int = Field(ge=1, le=10000)
    language: Literal["en", "es"] = "en"
    brief: AdventureBrief = Field(default_factory=AdventureBrief)
    start_date: Optional[str] = Field(default=None, max_length=40)
    end_date: Optional[str] = Field(default=None, max_length=40)
    total_days: int = Field(ge=0, le=70)
    subtotal: float = Field(default=0, ge=0, allow_inf_nan=False)
    tax: float = Field(default=0, ge=0, allow_inf_nan=False)
    total_price: float = Field(default=0, ge=0, allow_inf_nan=False)
    destinations: List[BookingDestination] = Field(default_factory=list, max_length=5)
    itinerary: List[ItineraryDay] = Field(default_factory=list, max_length=70)
    unscheduled_activities: List[UnscheduledActivity] = Field(default_factory=list, max_length=30)

    @field_validator("start_date", "end_date")
    @classmethod
    def validate_date(cls, value):
        if value:
            datetime.fromisoformat(value.replace("Z", "+00:00"))
        return value

    @model_validator(mode="after")
    def validate_schedule(self):
        ids = [d.id for d in self.destinations]
        if len(set(ids)) != len(ids) or sum(d.days for d in self.destinations) != self.total_days:
            raise ValueError("Destination days must match the package duration without duplicate chapters")
        if self.itinerary:
            expected = [d.id for d in self.destinations for _ in range(d.days)]
            if [day.destination_id for day in self.itinerary] != expected or [day.day for day in self.itinerary] != list(range(1, self.total_days + 1)):
                raise ValueError("The itinerary must cover every selected day in chapter order")
        return self


class BookingCreate(PackageSnapshot):
    contact: ContactInfo


@api_router.get("/")
async def root():
    return {"message": "Outdooroots inquiry API"}


@api_router.post("/auth/login")
async def login(body: LoginRequest):
    email = body.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"access_token": create_token(email), "token_type": "bearer", "email": email}


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


@api_router.post("/itinerary/pdf")
def export_itinerary_pdf(body: PackageSnapshot):
    return Response(render_itinerary_pdf(body, language=body.language), media_type="application/pdf", headers={"Content-Disposition": 'attachment; filename="outdooroots-itinerary.pdf"', "Cache-Control": "no-store"})


@api_router.post("/bookings")
async def create_booking(body: BookingCreate):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "new"
    doc["reference"] = f"OR-{datetime.now(timezone.utc):%Y%m%d}-{doc['id'][:8].upper()}"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/bookings")
async def list_bookings(admin=Depends(get_current_admin)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(None)
    return bookings


@api_router.patch("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, body: InquiryUpdate, admin=Depends(get_current_admin)):
    current = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not current:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    changes = body.model_dump(mode="json", exclude_unset=True)
    now = datetime.now(timezone.utc).isoformat()
    if body.status == "lost" and not (changes.get("lost_reason") or current.get("lost_reason", "")).strip():
        raise HTTPException(status_code=422, detail="Record a reason before marking an inquiry lost")
    if body.status == "contacted" and not current.get("first_contact_at"):
        changes["first_contact_at"] = now
    if body.status == "proposal_sent" and not current.get("proposal_sent_at"):
        changes["proposal_sent_at"] = now
    if body.status == "confirmed":
        changes["confirmed_at"] = now
    changes["updated_at"] = now
    await db.bookings.update_one({"id": booking_id}, {"$set": changes})
    return {"id": booking_id, **changes}


@api_router.put("/bookings/{booking_id}/quote")
async def save_reviewed_quote(booking_id: str, body: ReviewedQuote, admin=Depends(get_current_admin)):
    quote = body.model_dump(mode="json")
    quote["approved_by"] = admin["email"]
    quote["reviewed_at"] = datetime.now(timezone.utc).isoformat()
    summary = body.customer_summary()
    result = await db.bookings.update_one({"id": booking_id}, {"$set": {"quote": quote, "quote_summary": summary}})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"quote": quote, "quote_summary": summary}


@api_router.get("/bookings/{booking_id}/proposal.pdf")
async def reviewed_proposal_pdf(booking_id: str, admin=Depends(get_current_admin)):
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if not doc.get("quote_summary"):
        raise HTTPException(status_code=409, detail="Save a reviewed quote first")
    body = PackageSnapshot.model_validate(doc)
    from starlette.concurrency import run_in_threadpool
    pdf = await run_in_threadpool(render_itinerary_pdf, body, doc["quote_summary"], body.language)
    return Response(pdf, media_type="application/pdf", headers={"Content-Disposition": 'attachment; filename="outdooroots-proposal.pdf"', "Cache-Control": "no-store"})


async def seed_admin():
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await seed_admin()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
