# To run this locally, you can install the dependencies:
# !pip install fastapi uvicorn pydantic joblib pandas

import os
import joblib # type: ignore
import pandas as pd # type: ignore
from typing import List, Optional
from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field # type: ignore

# 1. Define the Pydantic schemas for request validation
class EmployeeRecord(BaseModel):
    Education: str = Field(..., description="Education level (e.g., Bachelors, Masters, PHD)")
    JoiningYear: int = Field(..., ge=2000, le=2030, description="The year the employee joined")
    City: str = Field(..., description="City of employment")
    PaymentTier: int = Field(..., ge=1, le=3, description="Payment Tier (1, 2, or 3)")
    Gender: str = Field(..., description="Gender of the employee (Male or Female)")
    Age: int = Field(..., ge=18, le=100, description="Age of the employee")
    EverBenched: str = Field(..., description="Whether the employee was ever benched (Yes or No)")
    ExperienceInCurrentDomain: int = Field(..., ge=0, description="Experience in current domain in years")

    class Config:
        json_schema_extra = {
            "example": {
                "Education": "Bachelors",
                "JoiningYear": 2018,
                "City": "Bangalore",
                "PaymentTier": 3,
                "Gender": "Male",
                "Age": 26,
                "EverBenched": "No",
                "ExperienceInCurrentDomain": 4
            }
        }

# Schema that keeps ALL original input fields and appends prediction outputs
class PredictionResponse(EmployeeRecord):
    Predicted_Leave: int
    Predicted_Status: str
    Churn_Probability: Optional[float] = None

# 2. Initialize the FastAPI App
app = FastAPI(
    title="Employee Churn Prediction API",
    description="FastAPI backend service serving an optimized SVM pipeline to predict employee churn.",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the pre-trained model on startup
MODEL_PATH = "optimized_svm_churn_pipeline.pkl"
if os.path.exists(MODEL_PATH):
    pipeline = joblib.load(MODEL_PATH)
else:
    # Fallback to in-memory variable if running in this Colab session
    try:
        pipeline = best_tuned_pipeline # type: ignore
    except NameError:
        pipeline = None

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Employee Churn Prediction API!",
        "status": "Model Loaded successfully" if pipeline is not None else "Model missing"
    }

# 4. Define the prediction endpoint
@app.post("/predict", response_model=List[PredictionResponse])
def predict_churn(records: List[EmployeeRecord]):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline is not loaded on the server.")

    try:
        # Convert list of Pydantic models to pandas DataFrame
        input_data = [rec.model_dump() for rec in records]
        df_input = pd.DataFrame(input_data)

        # Clean whitespaces as expected by preprocessing
        cat_cols = df_input.select_dtypes(include=['object']).columns
        for col in cat_cols:
            df_input[col] = df_input[col].astype(str).str.strip()

        # Get model predictions
        predictions = pipeline.predict(df_input)

        # Check if probability output is supported by model
        has_proba = hasattr(pipeline.named_steps['classifier'], 'predict_proba')
        probabilities = pipeline.predict_proba(df_input)[:, 1] if has_proba else None

        # Build responses combining original inputs and prediction details
        results = []
        for i, pred in enumerate(predictions):
            prob_val = float(probabilities[i]) if probabilities is not None else None
            results.append(PredictionResponse(
                Education=df_input.iloc[i]['Education'],
                JoiningYear=int(df_input.iloc[i]['JoiningYear']),
                City=df_input.iloc[i]['City'],
                PaymentTier=int(df_input.iloc[i]['PaymentTier']),
                Gender=df_input.iloc[i]['Gender'],
                Age=int(df_input.iloc[i]['Age']),
                EverBenched=df_input.iloc[i]['EverBenched'],
                ExperienceInCurrentDomain=int(df_input.iloc[i]['ExperienceInCurrentDomain']),
                Predicted_Leave=int(pred),
                Predicted_Status="Will Leave" if pred == 1 else "Will Stay",
                Churn_Probability=prob_val
            ))

        return results

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# To run this FastAPI app, save this script as `main.py` and run:
# uvicorn main:app --host 0.0.0.0 --port 8000