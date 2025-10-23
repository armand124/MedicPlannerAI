from app.modules.appointment.model import AppointmentRequest
from app.modules.appointment.repository import AppointmentRepository

from fastapi import HTTPException, Depends
class AppointmentService:
    @staticmethod
    async def make_appointment(req : AppointmentRequest , user):
        try:
            appointments = AppointmentRepository.get_calendar(req.id_med)
        except Exception:
            raise HTTPException(500, "There was a problem at the registration process")

        date = ""
        
        await AppointmentRepository.insert(date , req.id_med)
        return {"date" : 300}