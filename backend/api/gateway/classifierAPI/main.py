from fastapi import FastAPI , Request
from app.core.db import Database
from app.models.prediction_models import PredictionModels
from contextlib import asynccontextmanager
from app.endpoints import prediction
from app.endpoints import appointment
from app.endpoints import log 
from fastapi.middleware.cors import CORSMiddleware
from app.modules.log.model import LogEntry
import datetime 
from app.modules.log.service import LogService
import jwt 
from app.core.config import settings

def decode_token(token : str) -> dict:
    info = jwt.decode(token, settings.SECRET_KEY, settings.JWT_ALGORITHM)
    return info

@asynccontextmanager
async def lifespan(app : FastAPI):
    await Database.connectToDatabase()
    await PredictionModels.load_prediction_models()
    yield 
    await Database.disconnectFromDatabase()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080"
]

@app.middleware("http")
async def function_func(request : Request , callable):

    result = await callable(request)
          
    try:
         authorization_header = request.headers.get("Authorization")[len("Bearer ") : ]
         user_info = decode_token(authorization_header)
    except:
        user_info = {}
    
    entry = LogEntry
    
    status_code = result.status_code 

    if status_code < 300: 
        entry.type = "OK"
    elif status_code < 400:
        entry.type = "Redirect"
    elif status_code < 500:
        entry.type = "Bad Request"
    else:
        entry.type = "Server Error"

    if "email" in user_info.keys():
        entry.user = user_info["email"]
    else:
        entry.user = ""

    entry.timestamp = datetime.datetime.now()
    print(type(request.base_url))
    base_url = '%s' % (request.base_url)
    url = '%s' % (request.url)

    entry.activity = url[ len(base_url) : ]

    await LogService.insert_log(entry , user_info)

    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],             
)

#Endpoints
app.include_router(prediction.router)
app.include_router(appointment.router)
app.include_router(log.router)