import os
import jwt
from flask import Blueprint, request, redirect, session, url_for, jsonify
from functools import wraps
from .repository import AuthRepository
from .service import AuthService
from database.database import db_pool

auth_bp = Blueprint('auth', __name__)

repo = AuthRepository(db_pool)
service = AuthService(repo)

@auth_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        try:
            service.register(request.json['username'], request.json['email'], request.json['password'])
            return jsonify({'message': 'User registered successfully'}), 201
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Email and password required'}), 400
        try:
            user = service.login(data['email'], data['password'])
            token = user['token']
            return jsonify({'message': 'Login successful', 'token': token}), 200
        except ValueError as e:
            return jsonify({'message': str(e)}), 400
    return jsonify({'message': 'Invalid request method'}), 405

def get_current_user_id():
    """Get user_id from JWT in Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        user_id = payload.get('user_id') or payload.get('id')
        return user_id
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None