from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from src.auth.auth_util import verify_google_access_token

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route("/token", methods=["POST"], strict_slashes=False)
def get_token():
    email = request.json.get('email')
    google_access_token = request.json.get("google_access_token", None)
    # check if user registered
    if verify_google_access_token(google_access_token, email):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token)

    return jsonify({"message": "bad user"}), 401