"""
Public endpoint for website form lead capture.
Use: POST /api/lead-capture with ?org=<organization_id> or body.organization_id.
Organization ID = owner's user ID (from dashboard/settings).
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException

from app.database import get_database

router = APIRouter(prefix="/api", tags=["lead-capture"])


@router.post("/lead-capture")
async def capture_lead(data: dict):
    name = data.get("name") or data.get("full_name")
    phone = data.get("phone")
    org_id = data.get("organization_id") or data.get("org_id")
    if not name or not phone:
        raise HTTPException(status_code=400, detail="name and phone are required")
    if not org_id:
        raise HTTPException(status_code=400, detail="organization_id is required (get it from your LeadSathi dashboard)")
    db = await get_database()
    from bson import ObjectId
    # Resolve organization (owner's id or organization_id)
    user = None
    try:
        user = await db.users.find_one({"_id": ObjectId(org_id), "role": "owner"})
    except Exception:
        pass
    if not user:
        user = await db.users.find_one({"organization_id": org_id, "role": "owner"})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid organization_id")
    org_id = str(user["_id"])
    doc = {
        "name": name.strip(),
        "phone": str(phone).strip(),
        "email": (data.get("email") or "").strip() or None,
        "source": "website",
        "status": "new",
        "notes": (data.get("notes") or "").strip() or None,
        "assigned_to_id": str(user["_id"]),
        "organization_id": org_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    r = await db.leads.insert_one(doc)
    return {"ok": True, "lead_id": str(r.inserted_id)}
