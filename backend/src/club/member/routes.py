from flask import Blueprint, request

from src import util
from src.auth.auth_util import token_required
from src.club.member.ServiceClubMember import ClubMemberService
from src.club.report.ServiceClubReport import ClubReportService
from src.db import get_connection

club_member_bp = Blueprint('club_member', __name__, url_prefix='/club/member')

@token_required
@club_member_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200


@club_member_bp.route('/', methods=['POST'], strict_slashes=False)
def post_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@club_member_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200


@club_member_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200


@club_member_bp.route('/attribute', methods=['GET'], strict_slashes=False)
def get_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@club_member_bp.route('/attribute', methods=['POST'], strict_slashes=False)
def post_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200

@club_member_bp.route('/attribute', methods=['PUT'], strict_slashes=False)
def put_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200

@club_member_bp.route('/attribute', methods=['DELETE'], strict_slashes=False)
def delete_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    return service.delete(get_connection(), params), 200