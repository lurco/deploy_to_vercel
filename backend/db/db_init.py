from pymongo import AsyncMongoClient

from config import settings

client: AsyncMongoClient[dict] = AsyncMongoClient(settings.MONGODB_URI)

db = client.my_database