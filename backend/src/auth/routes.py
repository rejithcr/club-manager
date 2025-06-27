from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from src import db
from src.auth.auth_util import verify_google_access_token
from src.member.ServiceMember import MemberService

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route("/", methods=["POST"], strict_slashes=False)
def get_token():
    email = request.json.get('email')
    google_access_token = request.json.get("gToken", None)
    # check if user registered
    if verify_google_access_token(google_access_token, email):
        access_token = create_access_token(identity=email)
        m_service = MemberService()
        conn = db.get_connection()
        try:
            member_info = m_service.get(conn, {'email': email})
            member_info['authToken'] = access_token
            return member_info, 200
        finally:
            db.close_connection(conn)

    return jsonify({"message": "bad user"}), 401