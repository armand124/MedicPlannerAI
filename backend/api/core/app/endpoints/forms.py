from fastapi import APIRouter, Depends
from app.modules.auth.service import AuthService
from app.modules.forms.service import FormsService

router = APIRouter()

@router.get(
    "/forms",
    summary="Get the list of all the forms"
)
async def get_forms_list(current_user : dict = Depends(AuthService.get_current_user)):
    return await FormsService.get_all_forms()