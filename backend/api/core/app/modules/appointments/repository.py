from app.core.db import Database
from app.core.config import settings

class AppointmentRepository:
    @staticmethod
    async def search_appointments_by_pacient_id(pacient_id : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        usr = await col.find_one({"$oid" : pacient_id})
        return usr
    