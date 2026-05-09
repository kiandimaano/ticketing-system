"""
Shared config for severity classification
"""
from pathlib import Path

# Data
DATA_PATH = Path("dataset/tickets_dataset.json")
SEVERITY_COL = "severity"
CATEGORY_COL = "category"
TITLE_COL = "title"
DESC_COL = "description"

# Split
TEST_SIZE = 0.2
RANDOM_STATE = 42

# TF-IDF specifics
TFIDF_MAX_FEATURES = 5000
TFIDF_NGRAM_RANGE = (1, 2)
LOGISTIC_MAX_ITER = 500

# Transformer specifics
MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 256
NUM_EPOCHS = 3
BATCH_SIZE = 8
OUTPUT_DIR = "./models/severity"

# Validation inputs (same for both)
TEST_INPUTS = [
    "Payroll server down. 500 employees won't get paid.",
    "This is an EMERGENCY!!! I can't find my favorite font.",
]