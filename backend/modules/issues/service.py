from flask import Flask

class IssueService:
    def __init__(self, issue_repo):
        self.issue_repo = issue_repo
    
    def create_ticket(self, title, category, department, description, submitted_by):
        return self.issue_repo.create_ticket(title, category, department, description, submitted_by)
