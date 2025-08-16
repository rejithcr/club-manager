from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

from src import db
from src.auth.auth_util import verify_google_access_token
from src.auth.service import update_last_access
from src.member.ServiceMember import MemberService

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route("/", methods=["POST"], strict_slashes=False)
def get_token():
    email = request.json.get('email')
    google_access_token = request.json.get("gToken", None)
    # check if user registered
    if verify_google_access_token(google_access_token, email):
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        m_service = MemberService()
        conn = db.get_connection()
        try:
            member_info = m_service.get(conn, {'email': email})
            member_info['accessToken'] = access_token
            member_info['refreshToken'] = refresh_token
            name = member_info.get("firstName") if member_info.get("firstName") else ""
            member_info['message'] = f'Welcome {name}!'
            update_last_access(email)
            return member_info, 200
        finally:
            db.close_connection(conn)

    return jsonify({"message": "bad user"}), 401


# If we are refreshing a token here we have not verified the users password in
# a while, so mark the newly created access token as not fresh
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    update_last_access(identity)
    return jsonify(accessToken=access_token)