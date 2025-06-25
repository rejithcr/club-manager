from flask import Blueprint, request

from src import util
from src.auth.auth_util import role_required
from src.db import get_connection
from src.fee.collection.ServiceFeeCollection import FeeCollectionService

fee_collection_bp = Blueprint('fee_collection', __name__, url_prefix='/fee/collection')


@role_required(["admin","user"])
@fee_collection_bp.route('/', methods=['GET'], strict_slashes=False)
def get_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200

@role_required(["admin"])
@fee_collection_bp.route('/', methods=['POST'], strict_slashes=False)
def post_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    return service.post(get_connection(), params), 200


@fee_collection_bp.route('/', methods=['PUT'], strict_slashes=False)
def put_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    return service.put(get_connection(), params), 200

@fee_collection_bp.route('/', methods=['DELETE'], strict_slashes=False)
def delete_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    return service.delete(get_connection(), params), 200