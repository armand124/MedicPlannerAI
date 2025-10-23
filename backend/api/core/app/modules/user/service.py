from fastapi import HTTPException
from app.modules.user.repository import UserRepository

class UserService:
    @staticmethod
    async def get_user_information_using_email(email : str):
        usr = await UserRepository.search_user_by_email(email)
        if usr is None:
            raise HTTPException(404, "There's no user with this email")
        
        _id = str(usr["_id"])

        if usr["role"] == "doctor":
            return {"message" : "Succesfully retrieved user information",
                    "user_id" : _id, 
                    "email" : usr['email'],
                    "first_name" : usr['first_name'],
                    "last_name" : usr['last_name'],
                    "role" : usr["role"],
                    "specialization" : usr["specialization"]}
        elif usr["role"] == "patient":
             return {"message" : "Succesfully retrieved user information",
                    "user_id" : _id, 
                    "email" : usr['email'],
                    "first_name" : usr['first_name'],
                    "last_name" : usr['last_name'],
                    "role" : usr["role"],
                    }
    
    @staticmethod
    async def get_doctor_list():
        all_doctors = await UserRepository.get_users_list_by_role("doctor")
        if len(all_doctors) > 0: 
            return {"message" : "Succesfully retrieved doctor list", "doctors" : all_doctors}
        raise HTTPException(400, "Error retrieving doctor list")
    
    @staticmethod
    async def get_doctor_list_by_specialization(specialization : str):
        all_doctors = await UserRepository.get_users_list_by_specialization(specialization)
        if len(all_doctors) > 0: 
            return {"message" : "Succesfully retrieved doctor list", "doctors" : all_doctors}
        raise HTTPException(400, "Error retrieving doctor list")