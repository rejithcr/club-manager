from src.club import queries_club

from src import db
from src.club.event import queries_events
from src.member import queries_member
from src import  helper
from src import  constants


class ClubService():

    def get(self, conn, params):
        clubId = params.get('clubId')
        memberId = params.get('memberId')
        fundBalance = params.get('fundBalance')
        totalDue = params.get('totalDue')
        search = params.get('search')
        clubName = params.get('clubName')
        membershipRequests = params.get('membershipRequests')
        counts = params.get('counts')

        if memberId:
            clubs = db.fetch(conn, queries_club.GET_CLUBS_BY_MEMBER, (memberId,))
            return [helper.convert_to_camel_case(club) for club in clubs]
        elif fundBalance:
            fb = db.fetch_one(conn, queries_club.GET_FUND_BALANCE, (clubId, clubId))
            return helper.convert_to_camel_case(fb)
        elif totalDue:
            td = db.fetch_one(conn, queries_club.TOTAL_DUE, (clubId, clubId))
            return helper.convert_to_camel_case(td)
        elif search:
            clubs = db.fetch(conn, queries_club.SEARCH_CLUB, (f"%{clubName.upper()}%",))
            return [helper.convert_to_camel_case(club) for club in clubs]
        elif membershipRequests:
            requests = db.fetch(conn, queries_club.GET_MEMBERSHIP_REQUESTS, (clubId,))
            return [helper.convert_to_camel_case(request) for request in requests]
        elif counts:
            counts = db.fetch(conn, queries_club.GET_CLUB_COUNTS, (clubId,))
            return [helper.convert_to_camel_case(count) for count in counts]
        else:
            club = db.fetch_one(conn, queries_club.GET_CLUB, (clubId,))
            return helper.convert_to_camel_case(club) if club else {}

    def post(self, conn, params):
        club_name = params.get('clubName')
        club_description = params.get('clubDescription')
        location = params.get('location')
        email = params.get('email')
        member_id = params.get('memberId')

        club_id = db.fetch_one(conn, queries_club.GET_CLUB_SEQ_NEXT_VAL, None)['nextval']
        db.execute(conn, queries_club.SAVE_CLUB, (club_id, club_name, club_description, location, email, email))
        db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, member_id, '1', email, email))
        db.execute(conn, queries_events.INSERT_EVET_TYPES, (club_id, club_id, club_id, club_id))
        conn.commit()

        return {"clubId": club_id}

    def put(self, conn, params):
        clubId = params.get('clubId')
        email = params.get('email')
        memberId = params.get('memberId')
        comments = params.get('comments')
        status = params.get('status')

        club_name = params.get('clubName')
        club_description = params.get('clubDescription')
        location = params.get('location')
        if club_name:
            db.execute(conn, queries_club.UPDATE_CLUB, (club_name, club_description, location, email,clubId))
            conn.commit()
            return {"message": "Club details updated"}

        if status == "APPROVED":
            db.execute(conn, queries_club.UPDATE_MEMBERSHIP_REQUEST_STATUS, (status, comments, email, clubId, memberId))
            db.execute(conn, queries_member.SAVE_MEMBERSHIP, (clubId, memberId, constants.ROLE_MEMBER, email, email))
            conn.commit()
            return {"message": "Membership " + status}
        elif status == "REJECTED":
            db.execute(conn, queries_club.DELETE_MEMBERSHIP, (clubId, memberId))
            db.execute(conn, queries_club.UPDATE_MEMBERSHIP_REQUEST_STATUS, (status, comments, email, clubId, memberId))
            conn.commit()
            return {"message": "Membership " + status}

        return {"message": "Nothing done"}


    def delete(self, conn, params):
        clubId = params.get('clubId')
        email = params.get('email')

        db.execute(conn, queries_club.MARK_CLUB_FOR_DELETION, (email, clubId))
        conn.commit()

        return {"message": "Club marked for deletion. Please contact support to restore within 7 days."}