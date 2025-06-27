# Hypothetical user roles
import requests

from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.auth.service import get_user_role


def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()  # Ensures token is present and valid
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user_roles = get_user_role(current_user_id, request)
            if not any(role in user_roles for role in allowed_roles):
                return jsonify({"msg": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


# (Receive token by HTTPS POST)
# ...
def verify_google_access_token(token: str, email: str):
    response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={token}')
    if response.status_code == 200:
        payload = response.json()
        if payload['email_verified'] == "true" and email == payload['email']:
            return True

    return False

