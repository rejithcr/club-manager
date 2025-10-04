from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from src import util, db, constants
from src.auth.auth_util import role_required
from src.club.event.ClubEventService import ClubEventService

club_event_bp = Blueprint('club_event', __name__, url_prefix='/club/event')


@club_event_bp.route('/types', methods=['GET'], strict_slashes=False)
@role_required([constants.ROLE_MEMBER])
def get_event_types():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get_event_types(conn, params), 200
    finally:
        db.close_connection(conn)


@club_event_bp.route('/types', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_event_type():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.add_event_type(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/', methods=['GET'], strict_slashes=False)
@role_required([constants.ROLE_MEMBER])
def get_club_event():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)


@club_event_bp.route('/', methods=['POST'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def post_club_event():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post(conn, params), 200
    finally:
        db.close_connection(conn)


@club_event_bp.route('/', methods=['PUT'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def put_club_event():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/', methods=['DELETE'], strict_slashes=False)
@role_required([constants.ROLE_MAINTAINER])
def delete_club_event():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/filter', methods=['GET'])
@role_required([constants.ROLE_MEMBER])
def get_filtered_events():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.filtered_events(conn, params), 200
    finally:
        db.close_connection(conn)


@club_event_bp.route('/rsvp', methods=['PUT'])
@role_required([constants.ROLE_MAINTAINER])
def create_or_update_rsvp():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.create_or_update_rsvp(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/rsvp', methods=['GET'])
@role_required([constants.ROLE_MEMBER])
def get_rsvp():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get_rsvp(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/attendance', methods=['PUT'])
@role_required([constants.ROLE_MAINTAINER])
def mark_attendance():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.mark_attendance(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/attendance', methods=['GET'])
@role_required([constants.ROLE_MEMBER])
def get_attendance():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get_attendance(conn, params), 200
    finally:
        db.close_connection(conn)



@club_event_bp.route('/transaction', methods=['GET'])
@role_required([constants.ROLE_MEMBER])
def get_club_event_transaction():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get_transaction(conn, params), 200
    finally:
        db.close_connection(conn)


@club_event_bp.route('/transaction', methods=['POST'])
@role_required([constants.ROLE_MAINTAINER])
def post_club_event_transaction():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.post_transaction(conn, params), 200
    finally:
        db.close_connection(conn)


@club_event_bp.route('/transaction', methods=['PUT'])
@role_required([constants.ROLE_MAINTAINER])
def put_club_event_transaction():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.put_transaction(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/transaction', methods=['DELETE'])
@role_required([constants.ROLE_MAINTAINER])
def delete_club_event_transaction():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.delete_transaction(conn, params), 200
    finally:
        db.close_connection(conn)

@club_event_bp.route('/transaction/category', methods=['GET'])
@role_required([constants.ROLE_MEMBER])
def get_club_transaction_category():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    return service.get_categories(conn, params), 200


@club_event_bp.route('/transaction/category', methods=['POST'])
@role_required([constants.ROLE_MAINTAINER])
def add_category():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    return service.add_category(conn, params), 200

@club_event_bp.route('/transaction/category', methods=['PUT'])
@role_required([constants.ROLE_MAINTAINER])
def update_category():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    return service.update_category(conn, params), 200

@club_event_bp.route('/transaction/category', methods=['DELETE'])
@role_required([constants.ROLE_MAINTAINER])
def delete_category():
    service = ClubEventService()
    params = util.get_params(request)
    conn = db.get_connection()
    return service.delete_category(conn, params)