<!-- 

Employee intelligence and churn prediction frontend (React + Vite) for your existing FastAPI + SVM backend. Every prediction comes from `POST /predict`; nothing is mocked.

## 1. Install and configure
```bash
npm install
cp .env.example .env        # VITE_API_URL=http://127.0.0.1:5001
```

## 2. Enable CORS in your FastAPI app (one small addition)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Add it right after `app = FastAPI(...)`. The model and pipeline are untouched.

## 3. Run both servers (two terminals)
```bash
# Terminal 1: backend (from your backend folder)
uvicorn main:app --host 127.0.0.1 --port 5001 --reload   # replace main:app with your module

# Terminal 2: frontend
npm run dev     # opens http://localhost:5173
```

## Backend contract
Request: JSON array of records with `Education, JoiningYear, City, PaymentTier, Gender, Age, EverBenched, ExperienceInCurrentDomain`.
Response: array with `Predicted_Leave, Predicted_Status, Churn_Probability` plus the input fields. A `null` probability is displayed as "not provided".

## Allowed values
Education: Bachelors, Masters, PHD. City: Bangalore, Pune, New Delhi. Edit `OPTIONS` in `src/services/api.js` if your training data differs.

## Structure
`src/services/api.js` holds all validation and fetch logic; components never call `fetch` directly. History (last 10) is stored in `localStorage`.

## Production
`npm run build` outputs `dist/`. Set `VITE_API_URL` before building and add the deployed origin to `allow_origins`.
# EmployeeChurn --> -->
