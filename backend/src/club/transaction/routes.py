from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, constants
from src.auth.auth_util import role_required
from src.club.transaction.ServiceClubTransaction import ClubTransactionService
from src.db import get_connection

club_transaction_bp = Blueprint('club_transaction', __name__, url_prefix='/club/transaction')

@club_transaction_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@club_transaction_bp.route('/', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@club_transaction_bp.route('/', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def put_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200

@club_transaction_bp.route('/', methods=['DELETE'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def delete_club_transaction():
    service = ClubTransactionService()
    params = util.get_params(request)
    return service.delete(get_connection(), params), 200