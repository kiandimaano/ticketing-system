from flask import Flask

class IssueService:
    def __init__(self, issue_repo):
        self.issue_repo = issue_repo
    
    def create_ticket(self, title, category, description, submitted_by):
        return self.issue_repo.create_ticket(title, category, description, submitted_by)

    def get_all_user_tickets(self, user_id, submitted_by):
        if user_id != submitted_by:
            raise ValueError('Unauthorized access')
        return self.issue_repo.get_all_user_tickets(submitted_by)
