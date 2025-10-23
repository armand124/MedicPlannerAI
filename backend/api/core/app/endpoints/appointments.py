from fastapi import APIRouter, Depends
from app.modules.appointments.service import AppointmentService
from app.modules.auth.service import AuthService
from app.modules.appointments.model import PacientAppointment
router = APIRouter()

@router.post(
    "/appointments-patient",
    summary="Create's new appointment"
)
async def create_appointment_for_pacient(appointment_details : PacientAppointment, current_user : dict = Depends(AuthService.get_current_user)):
    return await AppointmentService.create_appointment(doctor_id=appointment_details.medic_id, patient_email=current_user["email"], date= appointment_details.date)

@router.get(
    "/appointments-doctor",
    summary="Get's all the appointments associated with the doctor based on token"
)
async def get_appointments_for_doctors(current_user : dict = Depends(AuthService.get_current_user)):
    return await AppointmentService.get_appointments_for_doctor(current_user["email"], current_user["role"])