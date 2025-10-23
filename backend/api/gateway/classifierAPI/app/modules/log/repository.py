from app.core.db import Database
from app.core.config import settings
from app.modules.log.model import LogEntry

class LogRepository: 
    @staticmethod
    async def insert_log(entry : LogEntry , current_user : dict):
        col = Database.db[settings.DB_LOGS_COLLECTION]
        result = await col.insert_one({
            "type" : entry.type ,
            "timestamp" : entry.timestamp ,
            "activity" : entry.activity , 
            "user" : entry.user
        })
    
        return result.inserted_id

    async def get_logs():
        col = Database.db[settings.DB_LOGS_COLLECTION]
        res = []

        async for log in col.find():
            modified_log = log 
            modified_log.pop("_id")
            res.append(modified_log)

        return res