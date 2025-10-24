from fastapi import APIRouter,Depends
from app.modules.auth.model import PacientRegistrationRequest, MedicRegistrationRequest, UserLoginRequest
from app.modules.auth.service import AuthService

router = APIRouter()

@router.post(
    "/register-medic",
    summary = "Doctor registration"
)
async def register_medic(user : MedicRegistrationRequest):
    return await AuthService.register_medic(user.email, user.password, user.first_name, user.last_name , "doctor", user.specialization)

@router.post(
    "/register-pacient",
    summary = "Pacient registration"
)
async def register_pacient(user : PacientRegistrationRequest):
    return await AuthService.register_pacient(user.email, user.password, user.first_name, user.last_name, "patient")

@router.post(
    "/login",
    summary="User login"
)
async def login_user(user : UserLoginRequest):
    return await AuthService.login_user(user.email, user.password)
