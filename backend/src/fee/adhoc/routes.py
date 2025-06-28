from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db, constants
from src.auth.auth_util import role_required
from src.db import get_connection
from src.fee.adhoc.ServiceFeeAdhoc import FeeAdhocService

fee_adhoc_bp = Blueprint('fee_adhoc', __name__, url_prefix='/fee/adhoc')

@fee_adhoc_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_adhoc_bp.route('/', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_adhoc_bp.route('/', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def put_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_adhoc_bp.route('/', methods=['DELETE'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def delete_fee_adhoc():
    service = FeeAdhocService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)