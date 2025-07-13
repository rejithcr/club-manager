import datetime
import os

import serverless_wsgi

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_compress import Compress

from src import constants
from src.auth.routes import auth_bp
from src.club.member.routes import club_member_bp
from src.club.report.routes import club_report_bp
from src.club.routes import club_bp
from src.club.transaction.routes import club_transaction_bp
from src.error_handlers import generic_error_handler
from src.fee.adhoc.routes import fee_adhoc_bp
from src.fee.collection.routes import fee_collection_bp
from src.fee.exception.routes import fee_exception_bp
from src.fee.routes import fee_bp
from src.root import root_bp
from src.member.routes import member_bp


def create_app():
    cm_app = Flask(__name__)
    # Auth
    cm_app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
    cm_app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=15)
    cm_app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(days=365)
    JWTManager(cm_app)
    #CORS(cm_app, origins=constants.CORS_ORIGINS)
    Compress(cm_app)
    # Register the blueprint with an optional URL prefix
    cm_app.register_blueprint(member_bp)
    cm_app.register_blueprint(root_bp)
    cm_app.register_blueprint(auth_bp)
    cm_app.register_blueprint(club_bp)
    cm_app.register_blueprint(club_member_bp)
    cm_app.register_blueprint(club_report_bp)
    cm_app.register_blueprint(club_transaction_bp)
    cm_app.register_blueprint(fee_bp)
    cm_app.register_blueprint(fee_adhoc_bp)
    cm_app.register_blueprint(fee_exception_bp)
    cm_app.register_blueprint(fee_collection_bp)

    #Error handlers
    cm_app.register_error_handler(500, generic_error_handler)
    return cm_app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=False)


def lambda_handler(event, context):
    lambda_app = create_app()
    return serverless_wsgi.handle_request(lambda_app, event, context)