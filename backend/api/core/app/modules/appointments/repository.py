from app.core.db import Database
from app.core.config import settings
from bson import ObjectId
class AppointmentRepository:
    @staticmethod
    async def search_appointments_by_pacient_id(pacient_id : str):
        col = Database.db[settings.DB_USER_COLLECTION]
        usr = await col.find_one({"$oid" : pacient_id})
        return usr
    
    @staticmethod
    async def insert_appointment(doctor_id : str, patient_id : str, date : str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        response = await col.insert_one({"doctor_id" : ObjectId(doctor_id), "patient_id" : ObjectId(patient_id), "date" : date})
        return response
    
    @staticmethod
    async def get_appointments_for_doctor(doctor_id: str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        pipeline = [
            {"$match": {"doctor_id": ObjectId(doctor_id)}},
            {
                "$lookup": {
                    "from": settings.DB_USER_COLLECTION,  
                    "localField": "patient_id",           
                    "foreignField": "_id",                 
                    "as": "patient_info"                    
                }
            },
            {
                "$unwind": {                           
                    "path": "$patient_info",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$project": {   
                    "_id" : 0,                         
                    "date": 1,
                    "patient_first_name": "$patient_info.first_name", 
                    "patient_last_name": "$patient_info.last_name"
                }
            }
        ]

        cursor = await col.aggregate(pipeline)
        appointments = await cursor.to_list(length=None)
        return appointments