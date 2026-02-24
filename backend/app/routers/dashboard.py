from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends

from app.database import get_database
from app.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _org_id(user: dict) -> str:
    return user.get("organization_id") or str(user["_id"])


@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    org_id = _org_id(current_user)
    lead_filter = {"organization_id": org_id}
    if current_user.get("role") == "sales_executive":
        lead_filter["$or"] = [
            {"assigned_to_id": str(current_user["_id"])},
            {"assigned_to_id": None},
        ]
    total_leads = await db.leads.count_documents(lead_filter)
    converted = await db.leads.count_documents({**lead_filter, "status": "converted"})
    new_leads = await db.leads.count_documents({**lead_filter, "status": "new"})
    follow_up_status = await db.leads.count_documents({**lead_filter, "status": "follow_up"})
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = today_start + timedelta(days=1)
    follow_ups_filter = {
        "organization_id": org_id,
        "completed": False,
        "follow_up_at": {"$gte": today_start, "$lt": today_end},
    }
    if current_user.get("role") == "sales_executive":
        lead_ids = await db.leads.distinct(
            "_id",
            {"organization_id": org_id, "assigned_to_id": str(current_user["_id"])},
        )
        follow_ups_filter["lead_id"] = {"$in": [str(i) for i in lead_ids]}
    follow_ups_due_today = await db.follow_ups.count_documents(follow_ups_filter)
    return {
        "total_leads": total_leads,
        "converted": converted,
        "new_leads": new_leads,
        "follow_up_status": follow_up_status,
        "follow_ups_due_today": follow_ups_due_today,
    }
