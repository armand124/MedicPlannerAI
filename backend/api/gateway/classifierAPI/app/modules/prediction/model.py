from pydantic import BaseModel
from typing import List, Union

class FormResponse(BaseModel):
    model_id : str
    questions : List[Union[float,int,str]]