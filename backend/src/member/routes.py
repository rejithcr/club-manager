from flask import Blueprint, request

from src import util
from src.db import get_connection
from src.member.ServiceMember import MemberService

member_bp = Blueprint('member', __name__, url_prefix='/member')

@member_bp.route('/', methods=['GET'], strict_slashes=False)
def get_members():
    service = MemberService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@member_bp.route('/', methods=['POST'], strict_slashes=False)
def post_members():
    service = MemberService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@member_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_members():
    service = MemberService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200
