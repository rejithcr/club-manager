# Hypothetical user roles
from functools import wraps

import requests
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from src import constants

USER_ROLES = {
    "john_doe": ["user"],
    "jane_admin": ["user", "admin"]
}


def token_required(func):
    @wraps(func) # This preserves the original function's metadata
    def wrapper(*args, **kwargs):
        print(f"Executing before {func.__name__}")
        result = func(*args, **kwargs) # Call the original function
        print(f"Executing after {func.__name__}")
        return result
    return wrapper


def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()  # Ensures token is present and valid
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user_roles = USER_ROLES.get(current_user_id, [])

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

#token_v = "ya29.a0AS3H6Nwt7_cpM2rpb3jRDfnwjTZUxE8CUsUNzuTWubMjvQzxi83yszT28z3XbBP5IQOQREhqaDc_mCuVAVEuEZt3Qov3qT_G-GDzeDdcrNhhfvUorgMNI2Rq1ub5baMQCP47bUt3siowhG1BgjDKoGpE3N3W7unHnufZOj3aqMYaCgYKAZ0SARYSFQHGX2MicRpBPboHK9RJC25ibrd9jA0178"
#print(verify_google_access_token(token_v, "rejithramakrishnan@1gmail.com"))