from fastapi import APIRouter, Depends
from app.modules.user.service import UserService
from app.modules.auth.service import AuthService

router = APIRouter()

@router.get(
    "/users/me",
    summary="Get user information from token"
)
async def profile(current_user : dict = Depends(AuthService.get_current_user)):
    return await UserService.get_user_information_using_email(current_user["email"])

@router.get(
    "/doctors",
    summary = "Get the list of all the doctors"
)
async def get_doctor_list(current_user : dict = Depends(AuthService.get_current_user)):
    return await UserService.get_doctor_list()

@router.get(
    "/doctors/{specialization}",
    summary = "Get the list of all the doctors by specialization"
)
async def get_doctor_list(specialization, current_user : dict = Depends(AuthService.get_current_user)):
    return await UserService.get_doctor_list_by_specialization(specialization)