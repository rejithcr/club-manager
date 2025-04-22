import db
import queries_member


class MemberService():

    def get(self, conn, params):
        member_id = params.get('memberId')
        email = params.get('email')

        if email:
            return db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))
        else:                    
            return db.fetch_one(conn, queries_member.GET_MEMBER, (member_id,))

        
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
    