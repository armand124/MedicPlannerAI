from app.models.prediction_models import PredictionModels
from fastapi import HTTPException

class PredictionService:
    @staticmethod
    async def get_prediction_result(model_id, features):
        model = PredictionModels.loaded_models.get(model_id)
        print(model_id)
        if model is None:
            raise HTTPException(404, "Model not found!")

        try:
            result = model.predict([features])
        except Exception as e:
            raise HTTPException(500, f"Prediction failed : {e}")
        
        numerical_prediction = result.tolist()[0]

        predicted_status = None

        if numerical_prediction <= 0.333:
            predicted_status = "Low"
        elif numerical_prediction > 0.666:
            predicted_status = "High"
        else:
            predicted_status = "Medium"
        return {"Status" : predicted_status}
       