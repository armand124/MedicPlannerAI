from pydantic import BaseModel

class AppointmentRequest(BaseModel):
    doctor_id : str 
    prior : str 
