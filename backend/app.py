import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS
from modules.auth.routes import auth_bp
from modules.issues.routes import issues_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(issues_bp, url_prefix='/api/issues')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)