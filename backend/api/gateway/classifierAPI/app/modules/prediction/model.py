from pydantic import BaseModel
from typing import List, Union

class FormResponse(BaseModel):
    questions : List[float]