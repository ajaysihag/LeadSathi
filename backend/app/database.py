from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client: AsyncIOMotorClient | None = None


async def get_database():
    global client
    if client is None:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
    return client[settings.DATABASE_NAME]


async def close_database():
    global client
    if client:
        client.close()
        client = None
