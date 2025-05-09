import db
import queries_club
import queries_fee
import queries_member
import helper


class ClubService():

    def get(self, conn, params):
        clubId = params.get('clubId')
        memberId = params.get('memberId')    
        fundBalance = params.get('fundBalance')      

        if memberId: 
            clubs = db.fetch(conn, queries_club.GET_CLUBS_BY_MEMBER, (memberId,))   
            return [helper.convert_to_camel_case(club) for club in clubs]         
        elif fundBalance:            
            fb = db.fetch_one(conn, queries_fee.GET_FUND_BALANCE, (clubId,clubId))   
            return helper.convert_to_camel_case(fb)
        else:        
            club = db.fetch_one(conn, queries_club.GET_CLUB, (clubId,))
            return helper.convert_to_camel_case(club) if club else {}
        

        
    def post(self, conn, params):
        club_name=params.get('clubName')
        email=params.get('email')
        memberId=params.get('memberId')

        club_id = db.fetch_one(conn, queries_club.GET_CLUB_SEQ_NEXT_VAL, None)['nextval']
        db.execute(conn, queries_club.SAVE_CLUB, (club_id, club_name, email, email))
        db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, memberId, '1', email, email))
        conn.commit()
        
        return {"clubId": club_id}
    
    def put(self, conn, params):
        return "club put"
    