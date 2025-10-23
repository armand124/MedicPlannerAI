from app.core.db import Database
from app.core.config import settings
class UserRepository:
    @staticmethod
    async def search_user_by_email(email : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        usr = await col.find_one({"email" : email})
        return usr
    
    @staticmethod
    async def get_user_id_by_email(email: str):
        col = Database.db[settings.DB_USER_COLLECTION]
        user = await col.find_one({"email": email})
        if not user:
            return None 
        return str(user["_id"])
    
    @staticmethod
    async def get_users_list_by_role(role : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        cursor = col.find({"role": role})
        users = await cursor.to_list(length = None)
        for doc in users:
            doc["_id"] = str(doc["_id"])
            doc.pop("password", None)
        return users

    @staticmethod
    async def get_users_list_by_specialization(specialization : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        cursor = col.find({"specialization": specialization})
        users = await cursor.to_list(length = None)
        for doc in users:
            doc["_id"] = str(doc["_id"])
            doc.pop("password", None)
        return users