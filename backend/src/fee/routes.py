from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db
from src.fee.ServiceFee import FeeService

fee_bp = Blueprint('fee', __name__, url_prefix='/fee')

@fee_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_fee():
    service = FeeService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def post_fee():
    service = FeeService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_bp.route('/', methods=['PUT'], strict_slashes=False)
@jwt_required()
def put_fee():
    service = FeeService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@fee_bp.route('/', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_fee():
    service = FeeService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)