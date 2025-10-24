from app.modules.forms.repository import FormsRepository
from fastapi import HTTPException
class FormsService:
    @staticmethod
    async def get_all_forms():
        forms = await FormsRepository.get_all_forms()

        if len(forms) > 0:
            return {"message" : "Succesfully retrieved forms list", "forms" : forms}
        
        raise HTTPException(400, "Error retrieving forms!")
    