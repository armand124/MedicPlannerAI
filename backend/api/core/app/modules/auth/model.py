from pydantic import BaseModel
class MedicRegistrationRequest(BaseModel):
    email : str
    password : str
    first_name : str
    last_name : str
    specialization : str

class PacientRegistrationRequest(BaseModel):
    email : str
    password : str
    first_name : str
    last_name : str

class UserLoginRequest(BaseModel):
    email : str
    password : str
class Token(BaseModel):
    access_token: str