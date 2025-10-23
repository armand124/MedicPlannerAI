from pydantic import BaseModel

class AppointmentRequest(BaseModel):
    id_med : str 
    prior : str 
