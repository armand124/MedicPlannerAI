from fastapi import FastAPI , Request
from app.core.db import Database
from contextlib import asynccontextmanager
from app.endpoints import auth
from app.endpoints import log

@asynccontextmanager
async def lifespan(app : FastAPI):
    await Database.connectToDatabase()
    yield 
    await Database.disconnectFromDatabase()

app = FastAPI(lifespan=lifespan)

@app.middleware("http")
async def function_func(request : Request , callable):
    result = await callable(request)
    return result

#Endpoints
app.include_router(auth.router)
app.include_router(log.router)