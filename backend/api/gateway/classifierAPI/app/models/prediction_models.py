from core.db import Database
from core.config import settings
import joblib
import asyncio

class PredictionModels:
    loaded_models = {}

    @staticmethod
    async def load_prediction_models():
        col = Database.db[settings.DB_MODEL_PATH_COLLECTION]

        cursor = col.find()
        async for model in cursor:
            try:
                model_path = model.get("path")
                model_id = model.get("model_id")
                if not model_path or not model_id:
                    continue

                loop = asyncio.get_running_loop()
                loaded_model = await loop.run_in_executor(None, joblib.load, model_path)

                PredictionModels.loaded_models[model_id] = loaded_model
            except Exception as e:
                print(f"Failed to load model {model.get('model_id')}: {e}")