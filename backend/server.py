from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt
import bcrypt
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
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
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    notes: Optional[str] = ""


class BookingDestination(BaseModel):
    id: str
    name: str
    days: int
    accommodation: str
    activities: List[str] = []
    subtotal: float = 0


class BookingCreate(BaseModel):
    package_name: str
    travelers: int = Field(ge=1, le=30)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    total_days: int = Field(ge=1)
    subtotal: float = 0
    tax: float = 0
    total_price: float = 0
    destinations: List[BookingDestination]
    contact: ContactInfo


class StatusUpdate(BaseModel):
    status: str


ALLOWED_STATUSES = {"pending", "contacted", "confirmed", "archived"}


@api_router.get("/")
async def root():
    return {"message": "Chile Travel Builder API"}


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


@api_router.post("/bookings")
async def create_booking(body: BookingCreate):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/bookings")
async def list_bookings(admin=Depends(get_current_admin)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return bookings


@api_router.patch("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, body: StatusUpdate, admin=Depends(get_current_admin)):
    if body.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": body.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"id": booking_id, "status": body.status}


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
