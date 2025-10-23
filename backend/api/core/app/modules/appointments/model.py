from pydantic import BaseModel
from bson import ObjectId

class PacientAppointment(BaseModel):
    medic_id : str
    date : str