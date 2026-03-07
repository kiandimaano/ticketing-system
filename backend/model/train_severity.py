import json
import joblib
from pathlib import Path
from typing import Tuple

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Load data
DATA_PATH = Path("dataset/tickets_dataset.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

df = pd.DataFrame(data)
df["text"] = df["title"] + " " + df["description"]
x = df["text"]
y = df["severity"]

# Encode severity labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)
label_map = dict(zip(le.classes_, le.transform(le.classes_)))
print("Label mapping:", label_map)

# Split data
x_train, x_test, y_train, y_test = train_test_split(x, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

# TF-IDF + train
vectorizer = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1, 2))
x_train_vec = vectorizer.fit_transform(x_train)
x_test_vec = vectorizer.transform(x_test)

model = LogisticRegression(max_iter=500, random_state=42)
model.fit(x_train_vec, y_train)

# Evaluate
y_pred = model.predict(x_test_vec)
print("Test accuracy:", round(accuracy_score(y_test, y_pred), 3))
print("Classification report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))
print("Confusion matrix:")
print(confusion_matrix(y_test, y_pred))

# Save
joblib.dump((vectorizer, model, le), "severity_model.joblib")
print("Saved: severity_model.joblib")

# Test predictions
test_input = [
    "Payroll server down. 500 employees won't get paid.",
    "This is an EMERGENCY!!! I can't find my favorite font.",
]
for text in test_input:
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    proba = model.predict_proba(vec)[0].max()
    severity = le.inverse_transform([pred])[0]
    print(f'\nPrediction: "{text[:50]}..." → {severity} ({proba:.2f})')


# Predict severity
vectorizer, model, le = joblib.load("severity_model.joblib")

def predict_severity(title: str, description: str) -> Tuple[str, float]:
    text = f"{title} {description}"
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    prob = model.predict_proba(vec)[0].max()
    return le.inverse_transform([pred])[0], float(prob)

severity, confidence = predict_severity(
    "Database corruption", "Financial data may be lost."
)
print(f"Severity: {severity}, Confidence: {confidence:.2f}")