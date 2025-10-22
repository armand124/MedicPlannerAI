from fastapi import APIRouter,Depends
from app.modules.auth.model import UserRegistrationRequest, UserLoginRequest
from app.modules.auth.service import AuthService

router = APIRouter()

@router.post(
    "/register",
    summary = "User registration"
)
async def register_user(user : UserRegistrationRequest):
    return await AuthService.register_user(user.email, user.password, user.first_name, user.last_name)

@router.post(
    "/login",
    summary="User login"
)
async def login_user(user : UserLoginRequest):
    return await AuthService.login_user(user.email, user.password)

@router.get(
    "/profile"
)
async def profile(current_user : dict = Depends(AuthService.get_current_user)):
    return {"email" : current_user["email"]}