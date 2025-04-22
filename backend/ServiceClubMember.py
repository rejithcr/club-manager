import db
import queries_club
import queries_member
import helper 

class ClubMemberService():

    def get(self, conn, params):
        club_id = params.get('clubId')    
        clubs = db.fetch(conn, queries_club.GET_CLUB_MEMBERS, (club_id,))
        return [helper.convert_to_camel_case(club) for club in clubs]
        
    def post(self, conn, params):
        return "club member post"
    
    def put(self, conn, params):
        return "club member put"
    