# Lab: NLP-Based Severity & Category Classification for Ticketing System

A guided, step-by-step lab for integrating a fine-tuned NLP model into your ticketing system to automatically classify ticket **severity** (critical, high, medium, low) and **category** based on user input.

---

## Learning Objectives

By the end of this lab, you will understand:

1. **Why NLP matters for ticketing** — Distinguishing "I can't find my favorite font" from "The payroll server is down and 500 people won't get paid"
2. **The full pipeline** — From raw text → labeled data → model training → API integration
3. **Where to plug the model** into your existing Flask backend
4. **How to evaluate** whether your model is making good decisions

---

## Part 1: Understanding the Problem

### The Challenge

Users often use emotional or urgent-sounding language that doesn't match actual business impact:

| User Says | Naive Interpretation | Correct Severity |
|-----------|----------------------|------------------|
| "This is an EMERGENCY!!!" | Critical? | **Low** — "I can't find my favorite font" |
| "Please help when you can" | Low? | **Critical** — "Payroll server down, 500 people won't get paid" |

Your model must learn **business impact**, not just emotional intensity.

### Severity Definitions (for your system)

Define these clearly before labeling data:

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | System-wide outage, data loss, security breach, revenue-blocking | Payroll down, database corrupted, ransomware |
| **High** | Major feature broken, many users affected | Login broken for 50% of users, core API failing |
| **Medium** | Feature degraded or limited impact | Slow performance, minor bug in non-critical feature |
| **Low** | Cosmetic, preference, or minimal impact | Font preference, typo, minor UI tweak |

### Category Definitions (your existing options)

- **Hardware** — Physical devices, printers, monitors, laptops
- **Software** — Applications, bugs, installations
- **Network** — Connectivity, VPN, DNS, latency
- **Access Request** — Permissions, accounts, SSO
- **Email** — Mail client, delivery, spam
- **Security** — Breaches, suspicious activity, compliance
- **Other** — Anything that doesn't fit above

---

## Part 2: Data — The Foundation

### Step 2.1: Collect or Create Training Data

You need **labeled examples**: `(title + description, severity, category)`.

**Option A — Use existing tickets**

1. Export tickets from your database (title, description, category).
2. Manually assign severity to each (critical/high/medium/low).
3. Use category as-is if it was user-selected, or re-label if you want the model to predict it.

**Option B — Create synthetic data**

Write 20–50 examples per severity and per category. Mix realistic and edge cases:

```
# Critical examples
"The payroll server is down. 500 employees won't receive their salaries tomorrow."
"Database corruption detected. Customer data may be lost."
"Ransomware detected on file server. Files encrypted."

# Low examples  
"I can't find my favorite font in the new design."
"Can we change the header color to blue?"
"Minor typo on the login page."
```

**Minimum recommended:** 200–500 labeled tickets for severity; 100+ per category for category classification.

**Ready-to-use dataset:** A pre-made dataset of 300+ labeled tickets is available at `docs/tickets_dataset.json`. It includes balanced examples across all severities and categories, including edge cases like "EMERGENCY!!! I can't find my font" (low) vs "Payroll server down, 500 people won't get paid" (critical).

### Step 2.2: Format for Training

Store as CSV or JSON:

```csv
title,description,severity,category
"Payroll server down","500 employees won't get paid...",critical,Software
"Favorite font missing","I can't find Comic Sans...",low,Software
```

Or JSON:

```json
[
  {"text": "Payroll server down. 500 employees won't get paid.", "severity": "critical", "category": "Software"},
  {"text": "I can't find my favorite font.", "severity": "low", "category": "Software"}
]
```

**Tip:** Concatenate `title + " " + description` as the model input. This gives full context.

---

## Part 3: Model Options

**Learning path:** Complete **Option 3 first**, then **Option 1**. Each option has an "Expected Output" section so you can verify success.

---

### Step 1 — Option 3: Simple ML (TF-IDF + Classifier)

**What:** TF-IDF vectorization + Logistic Regression or Random Forest.

**Why first:** Teaches core ML concepts (feature extraction, train/test split, metrics), is interpretable, runs on CPU, and trains in seconds. You'll understand the full pipeline before moving to more complex models.

**Pros:** Fast, interpretable, works on CPU, no GPU needed.  
**Cons:** Weaker at nuance; may struggle with "emergency" + "font" vs "server down".

**Tools:**
- `scikit-learn`: `TfidfVectorizer`, `LogisticRegression` or `RandomForestClassifier`
- Save with `joblib` or `pickle`

**Expected output — Option 3 success checklist:**

| Check | What you should see |
|-------|---------------------|
| **Saved model file** | A file `severity_model.joblib` (or similar) exists on disk. |
| **Evaluation metrics** | Printed output showing accuracy, precision, recall (e.g., accuracy ~0.75–0.85 on test set). |
| **Prediction on test input** | Running inference on `"Payroll server down. 500 employees won't get paid."` returns `severity: "critical"`. |
| **Prediction on edge case** | Running inference on `"This is an EMERGENCY!!! I can't find my favorite font."` returns `severity: "low"` (or "medium" — acceptable if model is still learning). |
| **Confusion matrix** | A 4×4 matrix printed (rows = true, cols = predicted) for critical, high, medium, low. |

**Example success output:**
```
Test accuracy: 0.82
Classification report:
              precision    recall  f1-score
critical       0.88        0.85      0.86
high           0.79        0.82      0.80
medium         0.81        0.78      0.79
low            0.80        0.84      0.82

Prediction: "Payroll server down. 500 employees won't get paid." → critical (0.92)
Prediction: "I can't find my favorite font." → low (0.78)
```

---

### Step 2 — Option 1: Fine-tuned Transformer (Industry Standard)

**What:** Fine-tune a pre-trained model (e.g., DistilBERT, RoBERTa) on your labeled data.

**Why second:** Once you understand the basics from Option 3, this is the industry-standard approach for production NLP. Better at understanding nuance ("500 people won't get paid" vs "my font").

**Pros:** Best at understanding nuance, state-of-the-art for text classification.  
**Cons:** Needs GPU for training, more complex setup.

**Tools:**
- **Hugging Face Transformers** + **datasets** + **trainer**
- **Google Colab** (free GPU) for training

**High-level steps:**
1. Load a pre-trained tokenizer and model (e.g., `distilbert-base-uncased`).
2. Tokenize your `(text, severity)` and `(text, category)` datasets.
3. Add a classification head (e.g., 4 classes for severity, 7 for category).
4. Fine-tune with `Trainer` for a few epochs.
5. Save the model (e.g., to `./models/severity_classifier`).

**Expected output — Option 1 success checklist:**

| Check | What you should see |
|-------|---------------------|
| **Saved model directory** | A folder `./models/severity` (or similar) containing `config.json`, `pytorch_model.bin`, `tokenizer_config.json`, etc. |
| **Training logs** | Epoch-by-epoch loss decreasing; final eval accuracy reported (e.g., `eval_accuracy: 0.88`). |
| **Prediction on test input** | Running inference on `"Payroll server down. 500 employees won't get paid."` returns `severity: "critical"` with high confidence. |
| **Prediction on edge case** | Running inference on `"This is an EMERGENCY!!! I can't find my favorite font."` returns `severity: "low"` with reasonable confidence. |
| **Better than Option 3** | Test accuracy and/or edge-case performance should be equal or better than your Option 3 model. |

**Example success output:**
```
Epoch 1/3: loss=0.82
Epoch 2/3: loss=0.41
Epoch 3/3: loss=0.28
eval_accuracy: 0.89
eval_loss: 0.31

Prediction: "Payroll server down. 500 employees won't get paid." → critical (0.96)
Prediction: "This is an EMERGENCY!!! I can't find my favorite font." → low (0.91)
```

---

### Option 2 — Zero-Shot Classification (Optional / Quick Try)

**What:** Use a model that can classify into arbitrary labels without training.

**Pros:** No labeled data needed, quick to try.  
**Cons:** Less accurate, may not capture your domain (e.g., "payroll" = critical). Doesn't teach ML (you don't train anything).

**Tools:**
- Hugging Face `pipeline("zero-shot-classification", model="facebook/bart-large-mnli")`

**Example labels:** `["critical", "high", "medium", "low"]`

---

## Part 4: Training a Severity Classifier (Guided)

Follow the same order as Part 3: **4.1 first** (Option 3 — scikit-learn), then **4.2** (Option 1 — Hugging Face). Use the expected output checklists in Part 3 to verify success.

---

### 4.1 — Using scikit-learn (Option 3)

**Environment:**
```bash
pip install scikit-learn pandas joblib
```

**Conceptual flow:**
1. Load CSV/JSON into pandas.
2. `X = df["title"] + " " + df["description"]`
3. `y_severity = df["severity"]` (encode with `LabelEncoder`).
4. Split: `train_test_split(X, y, test_size=0.2)`.
5. `TfidfVectorizer(max_features=5000)` → fit on X_train.
6. `LogisticRegression()` or `RandomForestClassifier()` → fit on vectorized X_train.
7. Evaluate on X_test (accuracy, precision, recall, confusion matrix).
8. Save: `joblib.dump((vectorizer, model), "severity_model.joblib")`.

**Key idea:** You learn feature extraction (TF-IDF), training, and evaluation. Interpret results with `model.coef_` or feature importance to see which words drive predictions.

**Verify success:** Check against the "Expected output — Option 3 success checklist" in Part 3.

---

### 4.2 — Using Hugging Face (Option 1)

**Environment:**
```bash
pip install transformers datasets torch
```

**Conceptual flow:**
1. Load your CSV/JSON into a `datasets.Dataset`.
2. Map labels to IDs: `{"critical": 0, "high": 1, "medium": 2, "low": 3}`.
3. Use `AutoTokenizer` and `AutoModelForSequenceClassification` (e.g., `distilbert-base-uncased`, num_labels=4).
4. Use `Trainer` with `TrainingArguments` (epochs=3–5, batch_size=8 or 16).
5. Evaluate on a held-out 10–20% of data.
6. Save: `model.save_pretrained("./models/severity")` and `tokenizer.save_pretrained("./models/severity")`.

**Key idea:** The model learns from your labeled examples. More diverse, high-quality labels = better distinction between "font emergency" and "payroll down". Use **Google Colab** if you don't have a GPU.

**Verify success:** Check against the "Expected output — Option 1 success checklist" in Part 3.

---

## Part 5: Integrating into Your Backend

### 5.1 — Where Your Code Lives

Your ticket flow today:

```
Dashboard (React) → POST /api/issues/create_ticket → routes.py → service.create_ticket() → repository.create_ticket() → DB
```

**Integration point:** Call the NLP model **inside** `service.create_ticket()` (or in a new helper) **before** writing to the DB. Use the model's predictions to set `severity` and optionally override `category`.

### 5.2 — Backend Changes (Conceptual)

1. **Database:** Add a `severity` column to `tickets` (VARCHAR or ENUM: critical, high, medium, low). Add if not present.

2. **Repository:** Extend `create_ticket` to accept `severity` (and optionally `category` if you want the model to suggest it):
   ```text
   INSERT INTO tickets (..., severity) VALUES (..., %s)
   ```

3. **NLP module:** Create a new module, e.g. `backend/modules/nlp/` or `backend/services/classifier.py`:
   - Load the model once at startup (lazy load on first request is fine).
   - Expose a function: `predict_severity_and_category(title: str, description: str) -> dict`
   - Return `{"severity": "critical", "category": "Software", "confidence": 0.92}`.

4. **Service layer:** In `create_ticket`:
   ```text
   predictions = nlp_service.predict(title, description)
   severity = predictions["severity"]
   category = predictions.get("category") or data["category"]  # optional: user choice vs model
   self.issue_repo.create_ticket(..., severity=severity, category=category, ...)
   ```

5. **Fallback:** If the model fails (e.g., timeout, error), default to `severity="medium"` or `"low"` so tickets still get created.

### 5.3 — Model Loading Best Practices

- Load the model **once** (e.g., in a Flask `before_first_request` or a singleton) to avoid loading on every request.
- Use a config flag (e.g., `ENABLE_NLP_CLASSIFICATION=true`) to turn the feature on/off.
- Log predictions for auditing and improving the model later.

---

## Part 6: Category Classification

Same pipeline as severity:

1. **Labels:** Your 7 categories: Hardware, Software, Network, Access Request, Email, Security, Other.
2. **Training:** Either a separate model or a multi-task model (one model, two heads: severity + category).
3. **Integration:** Same `predict_severity_and_category` function can return both.

**Multi-task option:** One transformer with two classification heads. More efficient, shares representation.

---

## Part 7: Evaluation & Iteration

### Metrics to Track

| Metric | What it tells you |
|--------|-------------------|
| **Accuracy** | Overall correctness |
| **Precision (per class)** | When we say "critical", how often are we right? |
| **Recall (per class)** | Of all true critical tickets, how many did we catch? |
| **Confusion matrix** | Are we mixing up "high" and "critical"? |

### Red Flags

- **Over-predicting critical:** Too many false alarms → admins stop trusting it.
- **Under-predicting critical:** Missing real emergencies → defeats the purpose.
- **Confusing low vs medium:** Less critical, but still worth improving.

### Improving the Model

1. **Add more examples** for underperforming classes.
2. **Review misclassified tickets** — Do they need clearer labeling rules?
3. **Add domain keywords** — If "payroll", "ransomware", "outage" are strong signals, ensure they appear in training data.
4. **Allow human override** — Admins can change severity/category; use those overrides as new training data (active learning).

---

## Part 8: Lab Checklist

Use this as your progress tracker:

- [ ] **Part 1:** Define severity and category in writing
- [ ] **Part 2:** Collect or create 200+ labeled examples
- [ ] **Part 2:** Format data as CSV/JSON
- [ ] **Part 3 & 4:** Option 3 — Train with scikit-learn (4.1), verify expected output
- [ ] **Part 3 & 4:** Option 1 — Train with Hugging Face (4.2), verify expected output
- [ ] **Part 4:** (Optional) Train category classifier
- [ ] **Part 5:** Add `severity` column to DB
- [ ] **Part 5:** Create NLP module and `predict` function
- [ ] **Part 5:** Integrate into `create_ticket` flow
- [ ] **Part 6:** Wire category prediction (if desired)
- [ ] **Part 7:** Set up logging and monitor performance

---

## Quick Reference: Your System Context

| Component | Your Setup |
|-----------|------------|
| Backend | Flask (`backend/modules/issues/`) |
| DB | MySQL, `tickets` table |
| Ticket fields | title, category, description, submitted_by, submitted_at |
| Categories | Hardware, Software, Network, Access Request, Email, Security, Other |
| Severities | critical, high, medium, low |
| Create endpoint | `POST /api/issues/create_ticket` |
| Admin UI | `AdminTickets.jsx` (already has `severityStyles` for display) |

---

## Next Steps

1. Start with **Part 2** — use `docs/tickets_dataset.json` or create your own labeled examples.
2. **Part 3 & 4:** Train with **scikit-learn first** (Option 3) to learn ML fundamentals, then **Hugging Face** (Option 1) for industry-standard NLP.
3. Integrate into the backend one step at a time: DB → repository → service → NLP module.

Good luck with the lab. Focus on high-quality labels — they matter more than model complexity.
