from fastapi import APIRouter, Depends
from app.security.security import get_current_user
from app.modules.appointment.model import AppointmentRequest
from app.modules.appointment.service import AppointmentService

router = APIRouter()

@router.post(
    "/planner"
)
async def plan_the_thing(req : AppointmentRequest , user : dict = Depends(get_current_user)):
    return await AppointmentService.make_appointment(req , user)