from flask import Flask
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, auth_repo):
        self.auth_repo = auth_repo

    def register(self, username, email, password):
        hashed_pw = generate_password_hash(password)
        return self.auth_repo.create_user(username, email, hashed_pw)
    
    def login(self, email, password):
        user = self.auth_repo.check_email(email)
        if user:
            result = check_password_hash(user['password'], password)
            if result:
                role = user.get('role', 'user')
                payload = {
                    'user_id': user.get('user_id') or user.get('id'),
                    'email': user['email'],
                    'role': role,
                    'exp': datetime.utcnow() + timedelta(days=1)
                }
                SECRET_KEY = os.getenv('JWT_SECRET_KEY')
                if not SECRET_KEY:
                    raise ValueError('JWT_SECRET_KEY is not set')
                token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
                token_str = token.decode('utf-8') if isinstance(token, bytes) else token
                return {'message': 'Login successful', 'token': token_str, 'role': role}
            else:
                raise ValueError('Invalid password')
        else:
            raise ValueError('Invalid email address')

