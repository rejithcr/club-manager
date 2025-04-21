import db
import queries_member


class MemberService():

    def get(self, conn, params):
        member_id = params.get('memberId')
        try:
            return db.fetch(conn, queries_member.GET_MEMBER, (member_id,))
        except Exception as e:
            return str(e)
        
    def post(self, conn, params):
        email=params.get('email')
        phone=params.get('phone')
        first_name=params.get('firstName')
        last_name=params.get('lastName')
        
        try:
            db.execute(conn, queries_member.SAVE_MEMBER, (first_name, last_name, email, phone, email, email))
            conn.commit()
        except Exception as e:
            return str(e)
        
        return f"{email} created."
    
    def put(self, conn, params):
        return "member put"
    