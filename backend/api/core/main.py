from fastapi import FastAPI , Request
from app.core.db import Database
from contextlib import asynccontextmanager
from app.endpoints import auth
from app.endpoints import log
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app : FastAPI):
    await Database.connectToDatabase()
    yield 
    await Database.disconnectFromDatabase()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",  # React default
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:8080"
]

@app.middleware("http")
async def function_func(request : Request , callable):
    result = await callable(request)
    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],             # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],             # allow all headers
)

#Endpoints
app.include_router(auth.router)
app.include_router(log.router)