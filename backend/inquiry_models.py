from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field, model_validator


class AdventureBrief(BaseModel):
    trip_type: Literal["personal", "group"] = "personal"
    organization: str = Field(default="", max_length=200)
    flexible_window: str = Field(default="", max_length=200)
    desired_duration: Optional[int] = Field(default=None, ge=1, le=365)
    party_composition: str = Field(default="", max_length=500)
    budget: Optional[float] = Field(default=None, ge=0, allow_inf_nan=False)
    budget_basis: Literal["per_person", "total"] = "per_person"
    interests: list[str] = Field(default_factory=list, max_length=12)
    pace: str = Field(default="balanced", max_length=60)
    experience: str = Field(default="", max_length=100)
    comfort: str = Field(default="", max_length=100)
    accessibility: str = Field(default="", max_length=1000)
    goals: str = Field(default="", max_length=1000)
    requirements: str = Field(default="", max_length=1000)
    source: str = Field(default="direct", max_length=200)


class InquiryUpdate(BaseModel):
    status: Optional[Literal["new", "contacted", "proposal_sent", "confirmed", "lost", "archived"]] = None
    internal_notes: Optional[str] = Field(default=None, max_length=10000)
    next_action: Optional[str] = Field(default=None, max_length=1000)
    follow_up_date: Optional[date] = None
    review_reason: Optional[str] = Field(default=None, max_length=2000)
    lost_reason: Optional[str] = Field(default=None, max_length=2000)


class QuoteLine(BaseModel):
    description: str = Field(min_length=1, max_length=180)
    category: Literal["accommodation", "experience", "guide", "transport", "other"]
    basis: Literal["person", "group", "room_night", "person_night", "day", "item"]
    quantity: float = Field(gt=0, le=100000, allow_inf_nan=False)
    cost_clp: float = Field(ge=0, allow_inf_nan=False)
    selling_clp: Optional[float] = Field(default=None, ge=0, allow_inf_nan=False)
    margin_percent: Optional[float] = Field(default=None, ge=0, lt=100, allow_inf_nan=False)

    @model_validator(mode="after")
    def price_required(self):
        if (self.selling_clp is None) == (self.margin_percent is None):
            raise ValueError("Set a selling price OR a gross margin, not both")
        return self

    def unit_sell(self):
        return self.selling_clp if self.selling_clp is not None else self.cost_clp / (1 - self.margin_percent / 100)


class ReviewedQuote(BaseModel):
    lines: list[QuoteLine] = Field(min_length=1, max_length=40)
    clp_per_eur: float = Field(gt=0, allow_inf_nan=False)
    exchange_rate_date: date
    valid_until: date
    tax_percent: Optional[float] = Field(default=None, ge=0, le=100, allow_inf_nan=False)
    tax_label: str = Field(default="", max_length=100)
    service_fee_clp: float = Field(default=0, ge=0, allow_inf_nan=False)
    service_label: str = Field(default="", max_length=100)
    inclusions: str = Field(min_length=1, max_length=1000)
    exclusions: str = Field(min_length=1, max_length=1000)
    outstanding_checks: str = Field(default="", max_length=1000)
    approved: Literal[True]

    @model_validator(mode="after")
    def labels_and_dates(self):
        if self.tax_percent and not self.tax_label.strip():
            raise ValueError("Identify the configured tax treatment")
        if self.service_fee_clp and not self.service_label.strip():
            raise ValueError("Identify the service fee")
        if self.exchange_rate_date > date.today():
            raise ValueError("Exchange-rate approval date cannot be in the future")
        if self.valid_until < date.today():
            raise ValueError("Quote validity must be today or later")
        return self

    def customer_summary(self):
        subtotal = sum(line.unit_sell() * line.quantity for line in self.lines)
        tax = (subtotal + self.service_fee_clp) * (self.tax_percent or 0) / 100
        return {
            "total_eur": round((subtotal + self.service_fee_clp + tax) / self.clp_per_eur, 2),
            "subtotal_eur": round(subtotal / self.clp_per_eur, 2),
            "tax_eur": round(tax / self.clp_per_eur, 2),
            "tax_label": self.tax_label,
            "service_eur": round(self.service_fee_clp / self.clp_per_eur, 2),
            "service_label": self.service_label,
            "valid_until": self.valid_until.isoformat(),
            "exchange_rate_date": self.exchange_rate_date.isoformat(),
            "clp_per_eur": self.clp_per_eur,
            "inclusions": self.inclusions,
            "exclusions": self.exclusions,
            "outstanding_checks": self.outstanding_checks,
            "lines": [{"description": line.description, "basis": line.basis, "quantity": line.quantity,
                       "total_eur": round(line.unit_sell() * line.quantity / self.clp_per_eur, 2)} for line in self.lines],
        }
