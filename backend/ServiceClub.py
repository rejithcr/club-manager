import db
import queries_club
import queries_member

class ClubService():

    def get(self, conn, params):
        club_id = params.get('clubId')
        member_id = params.get('memberId')        

        if member_id: 
            return db.fetch(conn, queries_club.GET_CLUBS_BY_MEMBER, (member_id,))
        else:        
            return db.fetch(conn, queries_club.GET_CLUB, (club_id,))

        
    def post(self, conn, params):
        club_name=params.get('clubName')
        email=params.get('email')
        memberId=params.get('memberId')

        club_id = db.fetch(conn, queries_club.GET_CLUB_SEQ_NEXT_VAL, None)[0]['nextval']
        db.execute(conn, queries_club.SAVE_CLUB, (club_id, club_name, email, email))
        db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, memberId, '1', email, email))
        conn.commit()
        
        return f"{club_name} created."
    
    def put(self, conn, params):
        return "club put"
    