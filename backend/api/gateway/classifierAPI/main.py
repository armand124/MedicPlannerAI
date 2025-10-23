from fastapi import FastAPI
from app.core.db import Database
from app.models.prediction_models import PredictionModels
from contextlib import asynccontextmanager
from app.endpoints import prediction
from app.endpoints import appointment

@asynccontextmanager
async def lifespan(app : FastAPI):
    await Database.connectToDatabase()
    await PredictionModels.load_prediction_models()
    yield 
    await Database.disconnectFromDatabase()

app = FastAPI(lifespan=lifespan)

#Endpoints
app.include_router(prediction.router)
app.include_router(appointment.router)