from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db
from src.member.ServiceMember import MemberService

member_bp = Blueprint('member', __name__, url_prefix='/member')

@member_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_members():
    service = MemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@member_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def post_members():
    service = MemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)


@member_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_members():
    service = MemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)
