from flask import Blueprint, request

from src import util
from src.auth.auth_util import role_required
from src.club.report.ServiceClubReport import ClubReportService
from src.db import get_connection

club_report_bp = Blueprint('club_report', __name__, url_prefix='/club/report')


@role_required(["admin","user"])
@club_report_bp.route('/', methods=['GET'], strict_slashes=False)
def get_club_report():
    service = ClubReportService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200


@club_report_bp.route('/memberattribute', methods=['GET'], strict_slashes=False)
def get_club_member_attribute():
    service = ClubReportService()
    params = util.get_params(request)
    return service.get(get_connection(), params), 200