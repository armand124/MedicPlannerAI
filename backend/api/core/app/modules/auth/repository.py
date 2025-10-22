from app.core.db import Database
from app.core.config import settings
class AuthRepository:
    @staticmethod
    async def search_user_by_email(email : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        usr = await col.find_one({"email" : email})
        return usr
    
    @staticmethod
    async def insert_user(email : str, password : str, first_name : str, last_name : str , role : str , specialization : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        await col.insert_one({
            "email" : email,
            "password" : password,
            "first_name" : first_name,
            "last_name" : last_name , 
            "role" : role , 
            "specialization" : specialization
        })
        