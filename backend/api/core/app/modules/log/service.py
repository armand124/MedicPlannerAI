from app.core.config import settings
from fastapi import HTTPException, Depends
#from app.modules.log.repository import LogRepository
from app.modules.log.model import LogEntry
from app.modules.log.repository import LogRepository

class LogService:
    @staticmethod
    async def fetch_logs(current_user : dict):
        if current_user["role"] != "admin":
             raise HTTPException(403, "Forbidden access!")
        
        return await LogRepository.get_logs()

    
    @staticmethod
    async def insert_log(entry : LogEntry , current_user : dict):
        try:
            result = await LogRepository.insert_log(entry , current_user)
            return {"success" : 1}
        except Exception:
             raise HTTPException(500, "There was a problem at the registration process")
