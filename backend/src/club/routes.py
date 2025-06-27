from flask import Blueprint, request

from src import util, db
from src.club.ServiceClub import ClubService

club_bp = Blueprint('club', __name__, url_prefix='/club')


@club_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club():
    service = ClubService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@club_bp.route('/', methods=['POST'], strict_slashes=False)
def post_club():
    service = ClubService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)


@club_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_club():
    service = ClubService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)
