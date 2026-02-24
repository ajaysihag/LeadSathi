from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# Lead source/status are validated as strings in API; allowed values in routers


class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    source: str = "other"  # whatsapp, call, website, instagram, other
    status: str = "new"
    notes: Optional[str] = None


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class LeadResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    source: str
    status: str
    notes: Optional[str] = None
    assigned_to_id: Optional[str] = None
    organization_id: str
    created_at: datetime
    updated_at: datetime
