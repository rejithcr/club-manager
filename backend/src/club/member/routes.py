from flask import Blueprint, request

from src import util, db
from src.club.member.ServiceClubMember import ClubMemberService

club_member_bp = Blueprint('club_member', __name__, url_prefix='/club/member')

@club_member_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)


@club_member_bp.route('/', methods=['POST'], strict_slashes=False)
def post_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_club_member():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['GET'], strict_slashes=False)
def get_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['POST'], strict_slashes=False)
def post_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['PUT'], strict_slashes=False)
def put_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@club_member_bp.route('/attribute', methods=['DELETE'], strict_slashes=False)
def delete_club_member_attribute():
    service = ClubMemberService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)