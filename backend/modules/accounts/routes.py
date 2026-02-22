from flask import Blueprint, request, jsonify
from .repository import AccountsRepository
from .service import AccountsService
from modules.auth.routes import get_current_user_id, get_current_user_role
from database.database import db_pool

accounts_bp = Blueprint('accounts', __name__)

repo = AccountsRepository(db_pool)
service = AccountsService(repo)

@accounts_bp.route('/get_all_users', methods=['GET'])
def get_all_users():
    if request.method == 'GET':
        user_id = get_current_user_id()
        role = get_current_user_role()
        if not user_id:
            return jsonify({'message': 'Authentication required'}), 401
        if role != 'admin':
            return jsonify({'message': 'Unauthorized access'}), 403
        
        try:
            users = service.get_all_users()
            return jsonify({'message': 'Users fetched successfully', 'users': users}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    return jsonify({'message': 'Invalid request method'}), 405