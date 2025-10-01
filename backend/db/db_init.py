from pymongo import AsyncMongoClient
from config import settings

async def get_database():
    client = AsyncMongoClient(settings.MONGODB_URI)
    try:
        db = client[settings.MONGO_DB_NAME]
        yield db
    finally:
        try:
            await client.close()
        except TypeError:
            await client.close()