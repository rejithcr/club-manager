from flask import Blueprint, request

from src import util
from src.auth.auth_util import role_required
from src.db import get_connection
from src.fee.exception.ServiceFeeException import FeeExceptionService

fee_exception_bp = Blueprint('fee_exception', __name__, url_prefix='/fee/exception')

@role_required(["admin","user"])
@fee_exception_bp.route('/', methods=['GET'], strict_slashes=False)
def get_fee_exception():
    service = FeeExceptionService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@role_required(["admin"])
@fee_exception_bp.route('/', methods=['POST'], strict_slashes=False)
def post_fee_exception():
    service = FeeExceptionService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@fee_exception_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_fee_exception():
    service = FeeExceptionService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200
