from flask import Blueprint, request

from src import util
from src.auth.auth_util import role_required
from src.db import get_connection
from src.fee.adhoc.ServiceFeeAdhoc import FeeAdhocService

fee_adhoc_bp = Blueprint('fee_adhoc', __name__, url_prefix='/fee/adhoc')

@role_required(["admin","user"])
@fee_adhoc_bp.route('/', methods=['GET'], strict_slashes=False)
def get_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@role_required(["admin"])
@fee_adhoc_bp.route('/', methods=['POST'], strict_slashes=False)
def post_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@fee_adhoc_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200


@fee_adhoc_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    return service.delete(get_connection(), params), 200