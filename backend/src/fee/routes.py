from flask import Blueprint, request

from src import util
from src.db import get_connection
from src.fee.ServiceFee import FeeService

fee_bp = Blueprint('fee', __name__, url_prefix='/fee')

@fee_bp.route('/', methods=['GET'], strict_slashes=False)
def get_fee():
    service = FeeService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@fee_bp.route('/', methods=['POST'], strict_slashes=False)
def post_fee():
    service = FeeService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200

@fee_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_fee():
    service = FeeService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200

@fee_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_fee():
    service = FeeService()
    params = util.get_params(request)
    return service.delete(get_connection(), params), 200