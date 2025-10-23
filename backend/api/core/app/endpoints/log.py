from fastapi import APIRouter,Depends
from app.modules.auth.service import AuthService
from app.modules.log.service import LogService
from app.modules.log.model import LogEntry

router = APIRouter()

@router.get (
    "/logs/"
)
async def logs(current_user : dict = Depends(AuthService.get_current_user)):
    result = await LogService.fetch_logs(current_user) 
    return result

@router.post (
    "/logs/register"
)
async def register_log(entry : LogEntry , current_user : dict = Depends(AuthService.get_current_user)):
    return await LogService.insert_log(entry , current_user)