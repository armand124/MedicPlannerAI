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
        response = await col.insert_one({"doctor_id" : ObjectId(doctor_id), "patient_id" : ObjectId(patient_id), "date" : date, "status" : "upcoming"})
        return response
    
    @staticmethod
    async def get_appointments_for_doctor(doctor_id: str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        pipeline = [
            {"$match": {"doctor_id": ObjectId(doctor_id), "status" : "upcoming"}},
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
                    "_id" : 1,                         
                    "date": 1,
                    "patient_first_name": "$patient_info.first_name", 
                    "patient_last_name": "$patient_info.last_name"
                }
            }
        ]

        cursor = await col.aggregate(pipeline)
        appointments = await cursor.to_list(length=None)
        for app in appointments:
            app["_id"] = str(app["_id"])
        return appointments
    
    @staticmethod
    async def retrieve_patient_appointments(patient_id : str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        pipeline = [
            {"$match": {"patient_id": ObjectId(patient_id), "status" : "upcoming"}},
            {
                "$lookup": {
                    "from": settings.DB_USER_COLLECTION,  
                    "localField": "doctor_id",           
                    "foreignField": "_id",                 
                    "as": "doctor_info"                    
                }
            },
            {
                "$unwind": {                           
                    "path": "$doctor_info",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$project": {   
                    "_id" : 1,                         
                    "date": 1,
                    "doctor_first_name": "$doctor_info.first_name", 
                    "doctor_last_name": "$doctor_info.last_name",
                    "doctor_specialization" : "$doctor_info.specialization"
                }
            }
        ]

        cursor = await col.aggregate(pipeline)
        appointments = await cursor.to_list(length=None)
        for app in appointments:
            app["_id"] = str(app["_id"])
        return appointments
    
    @staticmethod
    async def cancel_appointment_by_id(appointment_id : str, user_id : str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]

        result = await col.update_one(
            {
                "_id": ObjectId(appointment_id),
                "$or": [
                    {"patient_id": ObjectId(user_id)},
                    {"doctor_id": ObjectId(user_id)}
                ]
            },
            {"$set": {"status": "cancelled"}}
        )

        return result
    
    @staticmethod
    async def get_appointment_by_id(appointment_id : str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        result = await col.find_one({"_id" : ObjectId(appointment_id)})
        return result
    
    @staticmethod
    async def retrieve_all_patient_appointments(patient_id : str):
        col = Database.db[settings.DB_APPOINTMENTS_COLLECTION]
        pipeline = [
            {"$match": {"patient_id": ObjectId(patient_id)}},
            {
                "$lookup": {
                    "from": settings.DB_USER_COLLECTION,  
                    "localField": "doctor_id",           
                    "foreignField": "_id",                 
                    "as": "doctor_info"                    
                }
            },
            {
                "$unwind": {                           
                    "path": "$doctor_info",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$project": {   
                    "_id" : 1,                         
                    "date": 1,
                    "status" : 1,
                    "doctor_first_name": "$doctor_info.first_name", 
                    "doctor_last_name": "$doctor_info.last_name",
                    "doctor_specialization" : "$doctor_info.specialization"
                }
            }
        ]

        cursor = await col.aggregate(pipeline)
        appointments = await cursor.to_list(length=None)
        for app in appointments:
            app["_id"] = str(app["_id"])
        return appointments