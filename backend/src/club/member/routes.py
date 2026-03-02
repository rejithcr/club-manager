from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db, constants
from src.auth.auth_util import role_required
from src.club.member.ServiceClubMember import ClubMemberService

club_member_bp = Blueprint('club_member', __name__, url_prefix='/club/member')

@club_member_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)


@club_member_bp.route('/', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/request', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MEMBER])
def request_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.request(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def put_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/', methods=['DELETE'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def delete_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MEMBER])
def put_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['DELETE'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def delete_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)