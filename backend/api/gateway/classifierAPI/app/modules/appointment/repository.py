
class AppointmentRepository:

    @staticmethod 
    async def insert(date : str , id_med):
        col = Database.db[settings.DB_MEDS_COLLECTION]
        await col.update_one(
            {"id_med" : id_med} , 
            {"$push" :  {"appointments" : date}}
        )

    @staticmethod
    async def get_calendar(id_med):
        col = Database.db[settings.DB_MEDS_COLLECTION]
        return await col.find_one({"id_med" : id_med})["appointments"]
        