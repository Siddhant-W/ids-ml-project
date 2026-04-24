# Intrusion Detection System Using Machine Learning: CyberSentinel

CyberSentinel is a college SEPM project that detects and classifies network intrusions using a machine-learning pipeline.
It provides dataset upload, model training, traffic classification, and real-time alert streaming via a web dashboard.

## Tech Stack

- **Backend**: FastAPI
- **Frontend**: React + Vite
- **ML**: scikit-learn (Random Forest), pandas, numpy, joblib

## How to Run

### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

## ✅ ML Pipeline (Real — Not Mocked)

Dataset: NSL-KDD (25,192 records)
Model: Random Forest (n_estimators=100)

| Metric    | Score  |
|-----------|--------|
| Accuracy  | 0.9734 |
| Precision | 0.9721 |
| Recall    | 0.9734 |
| F1 Score  | 0.9726 |

### Attack Types Detected
| Label        | Category |
|--------------|----------|
| normal       | Benign   |
| neptune      | DoS      |
| ipsweep      | Probe    |
| portsweep    | Probe    |
| teardrop     | DoS      |
| warezclient  | R2L      |

## User Story Alignment
| US# | Title | Status | Evidence |
|---|---|---|---|
| US-1 | Traffic Monitor | Partial | WebSocket UI exists |
| US-2 | Upload Dataset | Done | `/ml/upload-and-train` endpoint |
| US-3 | Preprocess Data | Done | Null drop + label encoding in pipeline |
| US-4 | Train ML Model | Done | RandomForest via scikit-learn |
| US-5 | View Metrics | Done | Accuracy/precision/recall/f1 returned |
| US-6 | Classify Traffic | Done | `/ml/classify` endpoint |
| US-7 | Attack Categories | Done | DoS/Probe/R2L/U2R labels |
| US-8 | Real-time Alerts | Partial | Alert UI + WebSocket stream |
| US-9 | Severity Levels | Partial | Severity in alert objects |
| US-10 | Intrusion Logs | Partial | UI exists, in-memory |
| US-11 | Attack Trends | Partial | Charts exist, demo data |
| US-12 | Export Report | Partial | CSV stub exists |
| US-13 | RBAC | Future Scope | Role field exists in JWT |
| US-14 | Continuous Monitoring | Partial | WebSocket running |
| US-15 | Secure Login | Done | JWT + lockout + hashed passwords |

## Known Limitations / Future Scope

- **Model reproducibility**: Label encoding is fit at runtime per upload; persist encoders and align training/classification schemas.
- **Data validation**: Add stricter CSV schema checks (expected columns, target label constraints, feature ordering).
- **Storage**: Replace in-memory stores with a database for alerts/logs/users and add audit trails.
- **RBAC enforcement**: Enforce permissions server-side across endpoints and add admin user management.
- **Monitoring & reporting**: Add long-running training jobs, background workers, and real export (PDF/CSV) generation.
