from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query

from app.database import get_database
from app.auth import get_current_user
from app.schemas.follow_up import FollowUpCreate, FollowUpUpdate, FollowUpResponse

router = APIRouter(prefix="/follow-ups", tags=["follow-ups"])


def _org_id(user: dict) -> str:
    return user.get("organization_id") or str(user["_id"])


async def _get_lead(db, lead_id: str, org_id: str):
    from bson import ObjectId
    try:
        oid = ObjectId(lead_id)
    except Exception:
        return None
    return await db.leads.find_one({"_id": oid, "organization_id": org_id})


@router.post("", response_model=FollowUpResponse)
async def create_follow_up(
    data: FollowUpCreate,
    current_user: dict = Depends(get_current_user),
):
    db = await get_database()
    org_id = _org_id(current_user)
    lead = await _get_lead(db, data.lead_id, org_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc = {
        "lead_id": data.lead_id,
        "follow_up_at": data.follow_up_at,
        "notes": data.notes or "",
        "completed": False,
        "organization_id": org_id,
        "created_at": datetime.utcnow(),
    }
    r = await db.follow_ups.insert_one(doc)
    return FollowUpResponse(
        id=str(r.inserted_id),
        lead_id=data.lead_id,
        lead_name=lead["name"],
        lead_phone=lead["phone"],
        follow_up_at=data.follow_up_at,
        notes=doc["notes"],
        completed=False,
        organization_id=org_id,
        created_at=doc["created_at"],
    )


@router.get("", response_model=list[FollowUpResponse])
async def list_follow_ups(
    current_user: dict = Depends(get_current_user),
    due_today: bool = Query(False),
    completed: bool | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    from bson import ObjectId
    from datetime import date, timedelta
    db = await get_database()
    org_id = _org_id(current_user)
    q = {"organization_id": org_id}
    if current_user.get("role") == "sales_executive":
        lead_ids = await db.leads.distinct(
            "_id",
            {"organization_id": org_id, "assigned_to_id": str(current_user["_id"])},
        )
        q["lead_id"] = {"$in": [str(i) for i in lead_ids]}
    if completed is not None:
        q["completed"] = completed
    if due_today:
        today_start = datetime.combine(date.today(), datetime.min.time())
        today_end = today_start + timedelta(days=1)
        q["follow_up_at"] = {"$gte": today_start, "$lt": today_end}
    cursor = db.follow_ups.find(q).sort("follow_up_at", 1).skip(skip).limit(limit)
    out = []
    async for doc in cursor:
        try:
            lead = await db.leads.find_one({"_id": ObjectId(doc["lead_id"])})
        except Exception:
            lead = None
        lead_name = lead["name"] if lead else "?"
        lead_phone = lead["phone"] if lead else "?"
        out.append(FollowUpResponse(
            id=str(doc["_id"]),
            lead_id=doc["lead_id"],
            lead_name=lead_name,
            lead_phone=lead_phone,
            follow_up_at=doc["follow_up_at"],
            notes=doc.get("notes"),
            completed=doc.get("completed", False),
            organization_id=doc["organization_id"],
            created_at=doc["created_at"],
        ))
    return out


@router.get("/due-today", response_model=list[FollowUpResponse])
async def follow_ups_due_today(current_user: dict = Depends(get_current_user)):
    from datetime import date, timedelta
    db = await get_database()
    org_id = _org_id(current_user)
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = today_start + timedelta(days=1)
    q = {
        "organization_id": org_id,
        "completed": False,
        "follow_up_at": {"$gte": today_start, "$lt": today_end},
    }
    if current_user.get("role") == "sales_executive":
        lead_ids = await db.leads.distinct(
            "_id",
            {"organization_id": org_id, "assigned_to_id": str(current_user["_id"])},
        )
        q["lead_id"] = {"$in": [str(i) for i in lead_ids]}
    cursor = db.follow_ups.find(q).sort("follow_up_at", 1)
    out = []
    async for doc in cursor:
        from bson import ObjectId
        lead = await db.leads.find_one({"_id": ObjectId(doc["lead_id"])})
        lead_name = lead["name"] if lead else "?"
        lead_phone = lead["phone"] if lead else "?"
        out.append(FollowUpResponse(
            id=str(doc["_id"]),
            lead_id=doc["lead_id"],
            lead_name=lead_name,
            lead_phone=lead_phone,
            follow_up_at=doc["follow_up_at"],
            notes=doc.get("notes"),
            completed=doc.get("completed", False),
            organization_id=doc["organization_id"],
            created_at=doc["created_at"],
        ))
    return out


@router.patch("/{follow_up_id}", response_model=FollowUpResponse)
async def update_follow_up(
    follow_up_id: str,
    data: FollowUpUpdate,
    current_user: dict = Depends(get_current_user),
):
    db = await get_database()
    from bson import ObjectId
    try:
        oid = ObjectId(follow_up_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    doc = await db.follow_ups.find_one({"_id": oid, "organization_id": _org_id(current_user)})
    if not doc:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    upd = data.model_dump(exclude_unset=True)
    if upd:
        await db.follow_ups.update_one({"_id": oid}, {"$set": upd})
        doc = await db.follow_ups.find_one({"_id": oid})
    lead = await db.leads.find_one({"_id": ObjectId(doc["lead_id"])})
    return FollowUpResponse(
        id=str(doc["_id"]),
        lead_id=doc["lead_id"],
        lead_name=lead["name"] if lead else "?",
        lead_phone=lead["phone"] if lead else "?",
        follow_up_at=doc["follow_up_at"],
        notes=doc.get("notes"),
        completed=doc.get("completed", False),
        organization_id=doc["organization_id"],
        created_at=doc["created_at"],
    )


@router.delete("/{follow_up_id}", status_code=204)
async def delete_follow_up(
    follow_up_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = await get_database()
    from bson import ObjectId
    try:
        oid = ObjectId(follow_up_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    r = await db.follow_ups.delete_one({"_id": oid, "organization_id": _org_id(current_user)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Follow-up not found")
