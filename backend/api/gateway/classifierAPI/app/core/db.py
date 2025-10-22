from pymongo import AsyncMongoClient
from app.core.config import settings

class Database:
    db = None
    client = None
    @staticmethod
    async def connectToDatabase() -> None:
        Database.client = AsyncMongoClient(settings.DB_URI)
        Database.db = Database.client[settings.DB_NAME] 

    @staticmethod
    async def disconnectFromDatabase() -> None:
        if Database.client:
            await Database.client.close()
    