from flask import Blueprint, request, jsonify
from .repository import IssueRepository
from .service import IssueService
from database.database import db_pool
from modules.auth.routes import get_current_user_id

issues_bp = Blueprint('issues', __name__)

repo = IssueRepository(db_pool)
service = IssueService(repo)

@issues_bp.route('/create_ticket', methods=['POST'])
def create_ticket():
    if request.method == 'POST':
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'message': 'Authentication required'}), 401
        
        data = request.get_json()
        if not data or 'title' not in data or 'category' not in data or 'description' not in data:
            return jsonify({'message': 'Title, category, and description are required'}), 400

        try:
            service.create_ticket(title = data['title'], category = data['category'], description = data['description'], submitted_by = user_id)
            return jsonify({'message': 'Ticket created successfully'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500

@issues_bp.route('/get_all_user_tickets', methods=['GET'])
def get_all_user_tickets():
    if request.method == 'GET':
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'message': 'Authentication required'}), 401

        try:
            tickets = service.get_all_user_tickets(user_id, user_id)
            return jsonify({'message': 'Tickets fetched successfully', 'tickets': tickets}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    return jsonify({'message': 'Invalid request method'}), 405

