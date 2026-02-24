import secrets
from datetime import datetime
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse

from app.config import settings
from app.database import get_database
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/config")
async def auth_config():
    """Public endpoint: which login methods are enabled (e.g. for showing/hiding Google button)."""
    return {"google_enabled": bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)}


# In-memory OAuth state (use Redis in production for multi-instance)
_oauth_states: dict[str, float] = {}
STATE_TTL_SEC = 600


def _google_oauth_url(state: str) -> str:
    redirect_uri = f"{settings.BACKEND_URL.rstrip('/')}/auth/google/callback"
    return (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        + urlencode({
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "select_account",
        })
    )


@router.post("/register", response_model=Token)
async def register(data: UserCreate):
    db = await get_database()
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    role = data.role if data.role in ("owner", "sales_executive") else "sales_executive"
    doc = {
        "email": data.email,
        "hashed_password": hash_password(data.password),
        "full_name": data.full_name,
        "role": role,
        "organization_id": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    r = await db.users.insert_one(doc)
    user_id = str(r.inserted_id)
    if role == "owner":
        await db.users.update_one(
            {"_id": r.inserted_id},
            {"$set": {"organization_id": user_id, "updated_at": datetime.utcnow()}},
        )
        doc["organization_id"] = user_id
    token = create_access_token(data={"sub": user_id})
    return Token(access_token=token)


@router.post("/login", response_model=Token)
async def login(data: UserLogin):
    db = await get_database()
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("hashed_password"):
        raise HTTPException(status_code=401, detail="This account uses Google sign-in. Please use Sign in with Google.")
    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(data={"sub": str(user["_id"])})
    return Token(access_token=token)


@router.get("/google")
async def google_login():
    """Redirect to Google OAuth. Frontend should link to this URL."""
    if not settings.GOOGLE_CLIENT_ID:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=config")
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = datetime.utcnow().timestamp()
    url = _google_oauth_url(state)
    return RedirectResponse(url=url)


@router.get("/google/callback")
async def google_callback(code: str | None = None, state: str | None = None):
    """Handle Google OAuth callback: exchange code for user, create/find user, redirect to frontend with token."""
    if not code or not state:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=missing_code"
        )
    now = datetime.utcnow().timestamp()
    if state not in _oauth_states or now - _oauth_states.pop(state, 0) > STATE_TTL_SEC:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=invalid_state"
        )
    if not settings.GOOGLE_CLIENT_SECRET:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=config"
        )
    redirect_uri = f"{settings.BACKEND_URL.rstrip('/')}/auth/google/callback"
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    if token_res.status_code != 200:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=token_exchange"
        )
    token_data = token_res.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=token_exchange"
        )
    async with httpx.AsyncClient() as client:
        user_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
    if user_res.status_code != 200:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=userinfo"
        )
    info = user_res.json()
    email = info.get("email")
    if not email:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=no_email"
        )
    name = info.get("name") or info.get("email", "").split("@")[0]
    db = await get_database()
    user = await db.users.find_one({"email": email})
    if user:
        user_id = str(user["_id"])
    else:
        doc = {
            "email": email,
            "hashed_password": None,
            "full_name": name,
            "role": "owner",
            "organization_id": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        r = await db.users.insert_one(doc)
        user_id = str(r.inserted_id)
        await db.users.update_one(
            {"_id": r.inserted_id},
            {"$set": {"organization_id": user_id, "updated_at": datetime.utcnow()}},
        )
    token = create_access_token(data={"sub": user_id})
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/login?token={token}"
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        organization_id=current_user.get("organization_id"),
    )
