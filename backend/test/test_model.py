import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from modules.nlp import predict_severity_and_category

# Critical
print(predict_severity_and_category(
    "Payroll server down",
    "500 employees won't get paid tomorrow."
))

# Low
print(predict_severity_and_category(
    "This is an EMERGENCY!!!",
    "I can't find my favorite font."
))