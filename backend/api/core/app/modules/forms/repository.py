from app.core.db import Database
from app.core.config import settings
from bson import ObjectId
class FormsRepository:
    @staticmethod
    async def get_all_forms():
        col = Database.db[settings.DB_FORMS_COLLECTION]
        cursor = col.find({})
        forms = await cursor.to_list(length=None)
        for form in forms:
            form["_id"] = str(form["_id"])
        return forms
    
    @staticmethod
    async def get_form_by_id(id : str):
        col = Database.db[settings.DB_FORMS_COLLECTION]
        form = await col.find({"_id" : ObjectId(id)})
        form["_id"] = str(form["_id"])
        return form