import os
import logging
from pathlib import Path

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Resolve model path: backend/modules/nlp/ -> backend/model/models/severity/
BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BACKEND_ROOT / "model" / "models" / "severity"
MAX_LENGTH = 256

# Lazy-Load Singleton
_model = None
_tokenizer = None

def _load_model():
    global _model, _tokenizer
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model path not found at {MODEL_PATH}")
        _tokenizer = AutoTokenizer.from_pretrained(str(MODEL_PATH))
        _model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_PATH))
        _model.eval()
    return _model, _tokenizer

def predict_severity_and_category(title: str, description: str) -> dict:
    """
    Predict severity (and optionally category) from ticket title + description.
    Returns: {"severity": "critical", "category": None, "confidence": 0.92}
    """

    if os.getenv("ENABLE_NLP_CLASSIFICATION", "true").lower() in ("false", "0", "no"):
        return {"severity": "medium", "category": None, "confidence": 0.0}

    try:
        model, tokenizer = _load_model()
        text = f"{title} {description}".strip()
        if not text:
            return {"severity": "medium", "category": None, "confidence": 0.0}
        
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LENGTH,
            padding="max_length",
        )

        with torch.no_grad():
            logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)
        pred_id = logits.argmax().item()
        confidence = probs[0][pred_id].item()

        # id2label from config.json
        id2label = model.config.id2label
        severity = id2label.get(pred_id) or id2label.get(str(pred_id))

        result = {"severity": severity, "category": None, "confidence": round(confidence, 2)}
        logging.info(f"NLP prediction: {result}")
        return result

    except Exception as e:
        logging.warning(f"NLP prediction failed, defaulting to medium severity: {e}")
        return {"severity": "medium", "category": None, "confidence": 0.0}