from app.modules.appointments.repository import AppointmentRepository
from app.modules.user.repository import UserRepository
from fastapi import HTTPException

class AppointmentService:
    @staticmethod
    async def create_appointment(doctor_id: str, patient_email: str, date: str):
        try:
            patient_id = await UserRepository.get_user_id_by_email(patient_email)

            response = await AppointmentRepository.insert_appointment(
                doctor_id=doctor_id,
                patient_id=patient_id,
                date=date
            )

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating appointment: {str(e)}")

        if not response:
            raise HTTPException(status_code=500, detail="Failed to create appointment")

        return {
            "message": "Successfully created appointment",
            "date": date
        }

    @staticmethod
    async def get_appointments_for_doctor(doctor_email: str, role : str):
        if role != "doctor":
            raise HTTPException(400, "Access denied")
        
        doctor_id = await UserRepository.get_user_id_by_email(doctor_email)
        appointments = await AppointmentRepository.get_appointments_for_doctor(doctor_id)

        if len(appointments) > 0:
            return {"appointments" : appointments}
        
        raise HTTPException(400, "Couldn't get appointments!")
    
    @staticmethod
    async def get_appointments_for_patient(patient_email : str, role : str):
        if role != 'patient':
            raise HTTPException(400, "Acess denied!")
        
        patient_id = await UserRepository.get_user_id_by_email(patient_email)
        appointments = await AppointmentRepository.retrieve_patient_appointments(patient_id)

        if len(appointments) > 0:
            return {"appointments" : appointments}
            
    @staticmethod
    async def cancel_appointment(appointment_id : str, user_email : str):
        app = await AppointmentRepository.get_appointment_by_id(appointment_id)

        if app["status"] != "upcoming":
            raise HTTPException(400, "Cannot cancel this appointment")

        user_id = await UserRepository.get_user_id_by_email(user_email)
        result = await AppointmentRepository.cancel_appointment_by_id(appointment_id, user_id)

        if result.modified_count == 1:
            return {"message" : "Succesfully canceled appointment"}
        else:
            raise HTTPException(400, "Couldn't cancel appointment")
    
    @staticmethod
    async def get_all_appointments_for_patient(patient_email : str, role : str):
        if role != 'patient':
            raise HTTPException(400, "Acess denied!")
        
        patient_id = await UserRepository.get_user_id_by_email(patient_email)
        appointments = await AppointmentRepository.retrieve_all_patient_appointments(patient_id)

        if len(appointments) > 0:
            return {"appointments" : appointments}