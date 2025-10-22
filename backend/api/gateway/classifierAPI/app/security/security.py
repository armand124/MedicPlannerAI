import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from fastapi import HTTPException, Depends

security = HTTPBearer()

def decode_token(token : str) -> dict:
    info = jwt.decode(token, settings.SECRET_KEY, settings.JWT_ALGORITHM)
    return info

def get_current_user(credentials : HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        user_info = decode_token(token)
    except Exception:
        raise HTTPException(401, "Invalid token!")