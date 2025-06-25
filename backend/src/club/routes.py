from flask import Blueprint, request

from src import util
from src.auth.auth_util import role_required
from src.club.ServiceClub import ClubService
from src.db import get_connection

club_bp = Blueprint('club', __name__, url_prefix='/club')


@role_required(["admin","user"])
@club_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club():
    service = ClubService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@role_required(["admin"])
@club_bp.route('/', methods=['POST'], strict_slashes=False)
def post_club():
    service = ClubService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@club_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_club():
    service = ClubService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200

@club_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_club():
    service = ClubService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200