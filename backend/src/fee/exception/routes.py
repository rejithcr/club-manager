from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db, constants
from src.auth.auth_util import role_required
from src.fee.exception.ServiceFeeException import FeeExceptionService

fee_exception_bp = Blueprint('fee_exception', __name__, url_prefix='/fee/exception')

@fee_exception_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_fee_exception():
    service = FeeExceptionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_exception_bp.route('/', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_fee_exception():
    service = FeeExceptionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_exception_bp.route('/', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def put_fee_exception():
    service = FeeExceptionService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)
