from src import db, constants
from src.auth import queries
from src.db import get_connection
from src.util import get_params


def get_user_role(email, request):
    params = get_params(request)
    club_id = params.get('club_id', params.get('clubId'))
    conn = get_connection()
    try:
        member_role = db.fetch_one(conn, queries.GET_ROLE_BY_CLUB, (club_id, club_id, email))
    finally:
        conn.close()
    roles = [constants.ROLE_MEMBER]

    if not member_role:
        return  roles

    if member_role.get('role_id') == constants.ROLE_ADMIN:
        roles.append(constants.ROLE_MAINTAINER)
        roles.append(constants.ROLE_ADMIN)
    elif member_role.get('role_id') == constants.ROLE_MAINTAINER:
        roles.append(constants.ROLE_MAINTAINER)

    return roles

def update_last_access(email):
    conn = get_connection()
    try:
        db.execute(conn, queries.UPDATE_LAST_ACCESS, (email,))
        conn.commit()
    finally:
        conn.close()