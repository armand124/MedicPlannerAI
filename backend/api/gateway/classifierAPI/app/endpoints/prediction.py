from fastapi import APIRouter, Depends
from modules.prediction.model import FormResponse
from security.security import get_current_user
from modules.prediction.service import PredictionService

router = APIRouter()

@router.get(
    "/get-results/{model_id}"
)
async def get_prediction_results(form : FormResponse, usr : dict = Depends(get_current_user)):
    return PredictionService.get_prediction_result(form.model_id, form.questions)
