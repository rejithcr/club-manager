import db
import queries_member
import helper

class MemberService():

    def get(self, conn, params):
        member_id = params.get('memberId')
        email = params.get('email')
        phone = params.get('phone')
        requests = params.get('requests')

        member = None
        if email:
            member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))
        elif phone:
            member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_PHONE, (phone, ))
        elif requests:
            requests = db.fetch(conn, queries_member.GET_REQUESTS, (member_id, ))
            return [helper.convert_to_camel_case(request) for request in requests]
        else:                    
            member = db.fetch_one(conn, queries_member.GET_MEMBER, (member_id,))

        return helper.convert_to_camel_case(member) if member else {}
        
    def post(self, conn, params):
        email=params.get('email')
        phone=params.get('phone')
        first_name=params.get('firstName')
        last_name=params.get('lastName')        

        db.execute(conn, queries_member.SAVE_MEMBER, (first_name, last_name, email, phone, email, email))
        conn.commit()
        member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))
        
        return dict(member)
    
    def put(self, conn, params):
        return "member put"
    