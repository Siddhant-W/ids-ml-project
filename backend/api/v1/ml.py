from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import io
import os

router = APIRouter(prefix="/ml", tags=["ML"])

MODEL_PATH = "model/rf_model.pkl"
FEATURE_COLS_PATH = "model/feature_cols.pkl"
LABEL_INDEX_PATH = "model/label_index.pkl"

@router.post("/upload-and-train")
async def upload_and_train(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    if 'difficulty' in df.columns:
        df = df.drop(columns=['difficulty'])

    if 'label' not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must contain a 'label' column")

    y, label_index = pd.factorize(df['label'])
    X = df.drop(columns=['label'])

    for col in X.select_dtypes(include=['object', 'string', 'str']).columns:
        X[col] = pd.factorize(X[col])[0]

    os.makedirs('model', exist_ok=True)
    joblib.dump(label_index, LABEL_INDEX_PATH)
    joblib.dump(X.columns.tolist(), FEATURE_COLS_PATH)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "accuracy":  round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, average="weighted", zero_division=0), 4),
        "recall":    round(recall_score(y_test, y_pred, average="weighted", zero_division=0), 4),
        "f1_score":  round(f1_score(y_test, y_pred, average="weighted", zero_division=0), 4),
    }

    joblib.dump(model, MODEL_PATH)

    return {"status": "trained", "metrics": metrics, "rows_used": len(df)}


@router.post("/classify")
async def classify(file: UploadFile = File(...)):
    if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURE_COLS_PATH) or not os.path.exists(LABEL_INDEX_PATH):
        raise HTTPException(status_code=400, detail="No trained model found. Train first.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    if 'difficulty' in df.columns:
        df = df.drop(columns=['difficulty'])
    if 'label' in df.columns:
        df = df.drop(columns=['label'])

    feature_cols = joblib.load(FEATURE_COLS_PATH)
    
    # Keep only expected columns in order; add missing with 0s
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0
    df = df[feature_cols]

    for col in df.select_dtypes(include=['object', 'string', 'str']).columns:
        df[col] = pd.factorize(df[col])[0]

    label_index = joblib.load(LABEL_INDEX_PATH)
    model = joblib.load(MODEL_PATH)
    
    predictions = model.predict(df)

    results = []
    for i, p in enumerate(predictions):
        pred_label = str(label_index[p])
        is_malicious = (pred_label.lower() != 'normal')
        results.append({
            "row": i,
            "prediction": pred_label,
            "is_malicious": is_malicious
        })

    malicious_count = sum(1 for r in results if r["is_malicious"])

    return {
        "total": len(results),
        "malicious": malicious_count,
        "normal": len(results) - malicious_count,
        "results": results[:50]
    }


@router.get("/status")
def model_status():
    return {
        "model_trained": os.path.exists(MODEL_PATH),
        "model_path": MODEL_PATH
    }
