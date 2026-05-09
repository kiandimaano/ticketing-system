import json
import joblib
from pathlib import Path

import pandas as pd 
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

import config

# Load data
with open(config.DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

df = pd.DataFrame(data)
df["text"] = df[config.TITLE_COL] + " " + df[config.DESC_COL]
x = df["text"]
y = df[config.CATEGORY_COL]

# Encode Labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)
label_map = dict(zip(le.classes_, le.transform(le.classes_)))
print("Label mapping:", label_map)

# Split
x_train, x_test, y_train, y_test = train_test_split(
    x, y_encoded,
    test_size = config.TEST_SIZE,
    random_state = config.RANDOM_STATE,
    stratify = y_encoded,
)

# TF-IDF + train
vectorizer = TfidfVectorizer(
    max_features = config.TFIDF_MAX_FEATURES,
    stop_words = "english",
    ngram_range = config.TFIDF_NGRAM_RANGE,
)
x_train_vec = vectorizer.fit_transform(x_train)
x_test_vec = vectorizer.transform(x_test)

model = LogisticRegression(max_iter=config.LOGISTIC_MAX_ITER, random_state=config.RANDOM_STATE)
model.fit(x_train_vec, y_train)

# Evaluate
y_pred = model.predict(x_test_vec)
print("Test accuracy:", round(accuracy_score(y_test, y_pred), 3))
print("Classification report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))
print("Confusion matrix:")
print(confusion_matrix(y_test, y_pred))

# Save
joblib.dump((vectorizer, model, le), "category_model.joblib")
print("Saved: category_model.joblib")