from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class FollowUpCreate(BaseModel):
    lead_id: str
    follow_up_at: datetime
    notes: Optional[str] = None


class FollowUpUpdate(BaseModel):
    follow_up_at: Optional[datetime] = None
    notes: Optional[str] = None
    completed: Optional[bool] = None


class FollowUpResponse(BaseModel):
    id: str
    lead_id: str
    lead_name: str
    lead_phone: str
    follow_up_at: datetime
    notes: Optional[str] = None
    completed: bool = False
    organization_id: str
    created_at: datetime
