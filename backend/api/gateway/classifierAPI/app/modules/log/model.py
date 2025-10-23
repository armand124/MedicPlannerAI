from pydantic import BaseModel 
from typing import Optional 

class LogEntry(BaseModel):
    type : str 
    timestamp : str
    activity : str 
    user : str
    