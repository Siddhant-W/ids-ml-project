import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib, os

# Load
df = pd.read_csv('../nsl_kdd_sample.csv')
print('Loaded:', df.shape)

# Drop difficulty
df.drop(columns=['difficulty'], inplace=True)

# Separate X and y
y_raw = df['label']
X = df.drop(columns=['label'])

# Encode y
y, label_index = pd.factorize(y_raw)
print('Classes:', dict(enumerate(label_index)))

# Encode categorical X columns
for col in X.select_dtypes(include=['object', 'string', 'str']).columns:
    X[col] = pd.factorize(X[col])[0]

# Save feature columns
os.makedirs('model', exist_ok=True)
joblib.dump(X.columns.tolist(), 'model/feature_cols.pkl')

# Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print('Accuracy:', round(accuracy_score(y_test, y_pred), 4))
print('Precision:', round(precision_score(y_test, y_pred, average='weighted', zero_division=0), 4))

joblib.dump(model, 'model/rf_model.pkl')
print('Model saved!')
