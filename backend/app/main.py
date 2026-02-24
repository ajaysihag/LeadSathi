from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import get_database, close_database
from app.routers import auth, leads, follow_ups, dashboard, lead_capture


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_database()
    yield
    await close_database()


app = FastAPI(
    title="LeadSathi API",
    description="CRM & Follow-Up System for Indian Businesses",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(follow_ups.router)
app.include_router(dashboard.router)
app.include_router(lead_capture.router)


@app.get("/")
def root():
    return {"message": "LeadSathi API", "docs": "/docs"}
