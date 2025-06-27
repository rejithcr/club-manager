from src import db, constants
from src.auth import queries
from src.db import get_connection
from src.util import get_params


def get_user_role(email, request):
    params = get_params(request)
    club_id = params.get('club_id', params.get('clubId'))
    member_role = db.fetch_one(get_connection(), queries.GET_ROLE_BY_CLUB, (club_id, club_id, email))
    roles = [constants.ROLE_MEMBER]
    if member_role['role_id'] == constants.ROLE_ADMIN:
        roles.append(constants.ROLE_MAINTAINER)
        roles.append(constants.ROLE_ADMIN)
    elif member_role['role_id'] == constants.ROLE_MAINTAINER:
        roles.append(constants.ROLE_MAINTAINER)

    return roles