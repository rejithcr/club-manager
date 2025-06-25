from flask import Blueprint, request

from src import util
from src.auth.auth_util import role_required
from src.club.transaction.ServiceClubTransaction import ClubTransactionService
from src.db import get_connection

club_transaction_bp = Blueprint('club_transaction', __name__, url_prefix='/club/transaction')


@role_required(["admin","user"])
@club_transaction_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@role_required(["admin"])
@club_transaction_bp.route('/', methods=['POST'], strict_slashes=False)
def post_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@club_transaction_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200

@club_transaction_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.delete(get_connection(), params), 200