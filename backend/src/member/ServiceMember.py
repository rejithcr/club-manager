from src import db
from src.member import queries_member
from src import helper


class MemberService():

    def get(self, conn, params):
        member_id = params.get('memberId')
        email = params.get('email')
        phone = params.get('phone')
        requests = params.get('requests')
        limit = params.get("limit")
        offset = params.get("offset")

        member = None
        if email:
            member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))
        elif phone:
            member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_PHONE, (phone,))
        elif requests:
            requests = db.fetch(conn, queries_member.GET_REQUESTS, (member_id,))
            return [helper.convert_to_camel_case(request) for request in requests]
        elif offset and offset:
            users = db.fetch(conn, queries_member.GET_USERS, (limit, offset))
            return [helper.convert_to_camel_case(user) for user in users]
        else:
            member = db.fetch_one(conn, queries_member.GET_MEMBER, (member_id,))

        return helper.convert_to_camel_case(member) if member else {}

    def post(self, conn, params):
        email = params.get('email')
        phone = params.get('phone')
        photo = params.get('photo')
        first_name = params.get('firstName')
        last_name = params.get('lastName')
        dateOfBirth = params.get('dateOfBirth')
        createdBy = params.get('createdBy')
        isRegistered = params.get('isRegistered')

        db.execute(conn, queries_member.SAVE_MEMBER,
                   (first_name, last_name, email, phone, photo, dateOfBirth, isRegistered, createdBy, createdBy))
        conn.commit()
        member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))

        return helper.convert_to_camel_case(member)

    def put(self, conn, params):
        email = params.get('email')
        phone = params.get('phone')
        first_name = params.get('firstName')
        last_name = params.get('lastName')
        memberId = params.get('memberId')
        dateOfBirth = params.get('dateOfBirth')
        updatedBy = params.get('updatedBy')
        photo = params.get('photo')
        isRegistered = params.get('isRegistered')
        verify = params.get('verify')

        if verify:
            db.execute(conn, queries_member.VERIFY_MEMBER,
                       (first_name, last_name, email, phone, photo, dateOfBirth, isRegistered, updatedBy, memberId))
            conn.commit()
        else:
            db.execute(conn, queries_member.UPDATE_MEMBER,
                       (first_name, last_name, email, phone, dateOfBirth, updatedBy, memberId))
            conn.commit()

        return {"message": "Member updated successfully"}
