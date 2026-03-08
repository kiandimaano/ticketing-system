"""
Fine-tuned Transformer for Severity Classification
"""

import json
import numpy as np 
import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
    EarlyStoppingCallback,
)
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

import config

# Load data
with open(config.DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

texts = [d[config.TITLE_COL] + " " + d[config.DESC_COL] for d in data]
labels_raw = [d[config.SEVERITY_COL] for d in data]

# Label mapping (alphabetical for consistency)
label_names = sorted(set(labels_raw))
label2id = {name: i for i, name in enumerate(label_names)}
id2label = {i: name for name, i in label2id.items()} # Create reverse mapping
labels = [label2id[l] for l in labels_raw] # Convert severity labels to integers

print("Label mapping:", label2id)

# Tokenize
dataset = Dataset.from_dict({"text": texts, "labels": labels})

tokenizer = AutoTokenizer.from_pretrained(config.MODEL_NAME)

def tokenize_fn(examples):
    return tokenizer(
        examples["text"],
        truncation=True,
        padding="max_length",
        max_length=config.MAX_LENGTH,
        return_tensors=None,
    )

tokenized = dataset.map(tokenize_fn, batched=True, remove_columns=["text"])
tokenized = tokenized.train_test_split(
    test_size = config.TEST_SIZE,
    seed = config.RANDOM_STATE,
)

# Load distilbert model with classification head
model = AutoModelForSequenceClassification.from_pretrained(
    config.MODEL_NAME,
    num_labels = len(label_names),
    id2label = id2label,
    label2id = label2id,
)

# Training arguments
training_args = TrainingArguments(
    output_dir = config.OUTPUT_DIR,
    num_train_epochs = config.NUM_EPOCHS,
    per_device_train_batch_size = config.BATCH_SIZE,
    per_device_eval_batch_size = 16,
    warmup_ratio = 0.1,
    weight_decay = 0.01,
    logging_steps = 20,
    eval_strategy = "epoch",
    save_strategy = "epoch",
    load_best_model_at_end = True,
    metric_for_best_model = "accuracy",
    greater_is_better = True,
)

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return {"accuracy": accuracy_score(labels, preds)}

trainer = Trainer(
    model = model,
    args = training_args,
    train_dataset = tokenized["train"],
    eval_dataset = tokenized["test"],
    compute_metrics = compute_metrics,
    callbacks = [EarlyStoppingCallback(early_stopping_patience=1)],
)

trainer.train()
print("\nEval:", trainer.evaluate())

# Save
model.save_pretrained(config.OUTPUT_DIR)
tokenizer.save_pretrained(config.OUTPUT_DIR)
print(f"Saved to {config.OUTPUT_DIR}")

# Test predictions
def predict(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=config.MAX_LENGTH)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = torch.softmax(logits, dim=-1)
    pred_id = logits.argmax().item()
    return id2label[pred_id], probs[0][pred_id].item()

print("\nTest predictions:")
for text in config.TEST_INPUTS:
    severity, conf = predict(text)
    print(f'"{text[:50]}..." -> {severity} (confidence: {conf:.2f})')

preds = trainer.predict(tokenized["test"])
y_pred = np.argmax(preds.predictions, axis=-1)
y_true = tokenized["test"]["labels"]
print("\nClassification report:")
print(classification_report(y_true, y_pred, target_names=label_names))
print("Confusion matrix:")
print(confusion_matrix(y_true, y_pred))