from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    #Database
    DB_URI: str
    DB_NAME: str
    DB_MODEL_PATH_COLLECTION : str
    DB_MEDS_COLLECTION : str 
    
    #Security
    JWT_ALGORITHM: str
    SECRET_KEY: str
    class Config:
        env_file = ".env"

settings = Settings()
