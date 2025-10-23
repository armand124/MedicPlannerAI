from fastapi import APIRouter,Depends
from app.modules.auth.model import PacientRegistrationRequest, MedicRegistrationRequest, UserLoginRequest
from app.modules.auth.service import AuthService

router = APIRouter()

@router.post(
    "/register-medic",
    summary = "Doctor registration"
)
async def register_medic(user : MedicRegistrationRequest):
    return await AuthService.register_medic(user.email, user.password, user.first_name, user.last_name , "medic", user.specialization)

@router.post(
    "/register-pacient",
    summary = "Pacient registration"
)
async def register_pacient(user : PacientRegistrationRequest):
    return await AuthService.register_pacient(user.email, user.password, user.first_name, user.last_name, "pacient")

@router.post(
    "/login",
    summary="User login"
)
async def login_user(user : UserLoginRequest):
    return await AuthService.login_user(user.email, user.password)

@router.get(
    "/profile",
    summary="Get user information from token"
)
async def profile(current_user : dict = Depends(AuthService.get_current_user)):
    return current_user