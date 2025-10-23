from fastapi import APIRouter, Depends
from modules.auth.service import AuthService
from modules.appointments.model import PacientAppointment
router = APIRouter()

@router.get(
    "/appointments-pacient"
)
async def getApointmentForPacient(appointment_details : PacientAppointment, current_user : dict = Depends(AuthService.get_current_user)):
    #TODO
    return 1