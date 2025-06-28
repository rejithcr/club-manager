from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db, constants
from src.auth.auth_util import role_required
from src.fee.collection.ServiceFeeCollection import FeeCollectionService

fee_collection_bp = Blueprint('fee_collection', __name__, url_prefix='/fee/collection')

@fee_collection_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_collection_bp.route('/', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_collection_bp.route('/', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def put_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_collection_bp.route('/', methods=['DELETE'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def delete_fee_collection():
    service = FeeCollectionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)