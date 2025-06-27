from flask import Blueprint, request

from src import util, db
from src.club.report.ServiceClubReport import ClubReportService

club_report_bp = Blueprint('club_report', __name__, url_prefix='/club/report')


@club_report_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club_report():
    service = ClubReportService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)


@club_report_bp.route('/memberattribute', methods=['GET'], strict_slashes=False)
def get_club_member_attribute():
    service = ClubReportService()
    params = util.get_params(request)
    conn = db.get_connection()
    try:
        return service.get(conn, params), 200
    finally:
        db.close_connection(conn)