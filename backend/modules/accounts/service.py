from flask import Flask

class AccountsService:
    def __init__(self, accounts_repo):
        self.accounts_repo = accounts_repo

    def get_all_users(self):
        return self.accounts_repo.get_all_users()
    
    def edit_user(self, user_id, username=None, email=None, role=None):
        return self.accounts_repo.edit_user(user_id, username=username, email=email, role=role)
