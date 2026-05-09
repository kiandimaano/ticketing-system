from flask import Flask

from modules.nlp import predict_severity_and_category


class IssueService:
    def __init__(self, issue_repo):
        self.issue_repo = issue_repo
    
    def create_ticket(self, title, category, description, submitted_by):
        predictions = predict_severity_and_category(title, description)
        severity = predictions["severity"]
        return self.issue_repo.create_ticket(title, category, description, submitted_by, severity=severity)

    def update_ticket_status(self, ticket_id, status):
        return self.issue_repo.update_ticket_status(ticket_id, status)

    def get_all_user_tickets(self, user_id, submitted_by):
        if user_id != submitted_by:
            raise ValueError('Unauthorized access')
        return self.issue_repo.get_all_user_tickets(submitted_by)

    def get_all_tickets(self):
        return self.issue_repo.get_all_tickets()
