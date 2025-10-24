from app.core.config import settings
from app.core.db import Database
from bson import SON
from bson import ObjectId

class AppointmentRepository:
    @staticmethod
    async def get_calendar(doctor_id : str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        cursor =  col.find({"doctor_id" : ObjectId(doctor_id)})
        calendar = []

        async for obj in cursor: 
            if obj["status"] == "upcoming":
                calendar.append(obj["date"])

        return calendar
        