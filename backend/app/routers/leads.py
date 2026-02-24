from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query

from app.database import get_database
from app.auth import get_current_user, require_role
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse

router = APIRouter(prefix="/leads", tags=["leads"])

ALLOWED_SOURCES = {"whatsapp", "call", "website", "instagram", "other"}
ALLOWED_STATUSES = {"new", "follow_up", "converted", "lost"}


def _org_id(user: dict) -> str:
    return user.get("organization_id") or str(user["_id"])


def _can_see_lead(user: dict, lead: dict) -> bool:
    org = _org_id(user)
    if lead.get("organization_id") != org:
        return False
    if user.get("role") == "owner":
        return True
    return lead.get("assigned_to_id") == str(user["_id"]) or lead.get("assigned_to_id") is None


@router.post("", response_model=LeadResponse)
async def create_lead(
    data: LeadCreate,
    current_user: dict = Depends(get_current_user),
):
    if data.source not in ALLOWED_SOURCES or data.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid source or status")
    db = await get_database()
    org_id = _org_id(current_user)
    doc = {
        "name": data.name,
        "phone": data.phone,
        "email": data.email,
        "source": data.source,
        "status": data.status,
        "notes": data.notes,
        "assigned_to_id": str(current_user["_id"]),
        "organization_id": org_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    r = await db.leads.insert_one(doc)
    doc["_id"] = r.inserted_id
    return LeadResponse(
        id=str(r.inserted_id),
        name=doc["name"],
        phone=doc["phone"],
        email=doc.get("email"),
        source=doc["source"],
        status=doc["status"],
        notes=doc.get("notes"),
        assigned_to_id=doc.get("assigned_to_id"),
        organization_id=doc["organization_id"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


@router.get("", response_model=list[LeadResponse])
async def list_leads(
    current_user: dict = Depends(get_current_user),
    status: str | None = Query(None),
    source: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    db = await get_database()
    org_id = _org_id(current_user)
    q = {"organization_id": org_id}
    if current_user.get("role") == "sales_executive":
        q["$or"] = [{"assigned_to_id": str(current_user["_id"])}, {"assigned_to_id": None}]
    if status and status in ALLOWED_STATUSES:
        q["status"] = status
    if source and source in ALLOWED_SOURCES:
        q["source"] = source
    cursor = db.leads.find(q).sort("created_at", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        items.append(LeadResponse(
            id=str(doc["_id"]),
            name=doc["name"],
            phone=doc["phone"],
            email=doc.get("email"),
            source=doc["source"],
            status=doc["status"],
            notes=doc.get("notes"),
            assigned_to_id=doc.get("assigned_to_id"),
            organization_id=doc["organization_id"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
        ))
    return items


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    from bson import ObjectId
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead = await db.leads.find_one({"_id": oid})
    if not lead or not _can_see_lead(current_user, lead):
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadResponse(
        id=str(lead["_id"]),
        name=lead["name"],
        phone=lead["phone"],
        email=lead.get("email"),
        source=lead["source"],
        status=lead["status"],
        notes=lead.get("notes"),
        assigned_to_id=lead.get("assigned_to_id"),
        organization_id=lead["organization_id"],
        created_at=lead["created_at"],
        updated_at=lead["updated_at"],
    )


@router.patch("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: str,
    data: LeadUpdate,
    current_user: dict = Depends(get_current_user),
):
    db = await get_database()
    from bson import ObjectId
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead = await db.leads.find_one({"_id": oid})
    if not lead or not _can_see_lead(current_user, lead):
        raise HTTPException(status_code=404, detail="Lead not found")
    if data.source and data.source not in ALLOWED_SOURCES:
        raise HTTPException(status_code=400, detail="Invalid source")
    if data.status and data.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    upd = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if upd:
        upd["updated_at"] = datetime.utcnow()
        await db.leads.update_one({"_id": oid}, {"$set": upd})
        lead = await db.leads.find_one({"_id": oid})
    return LeadResponse(
        id=str(lead["_id"]),
        name=lead["name"],
        phone=lead["phone"],
        email=lead.get("email"),
        source=lead["source"],
        status=lead["status"],
        notes=lead.get("notes"),
        assigned_to_id=lead.get("assigned_to_id"),
        organization_id=lead["organization_id"],
        created_at=lead["created_at"],
        updated_at=lead["updated_at"],
    )


@router.delete("/{lead_id}", status_code=204)
async def delete_lead(lead_id: str, current_user: dict = Depends(get_current_user)):
    db = await get_database()
    from bson import ObjectId
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead = await db.leads.find_one({"_id": oid})
    if not lead or not _can_see_lead(current_user, lead):
        raise HTTPException(status_code=404, detail="Lead not found")
    await db.leads.delete_one({"_id": oid})
    await db.follow_ups.delete_many({"lead_id": lead_id})
