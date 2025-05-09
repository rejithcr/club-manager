import db
import queries_club
import queries_member
import helper 
import constants

from ServiceMember import MemberService

class ClubMemberService():

    def get(self, conn, params):
        club_id = params.get('clubId')    
        clubs = db.fetch(conn, queries_club.GET_CLUB_MEMBERS, (club_id,))
        return [helper.convert_to_camel_case(club) for club in clubs]
        
    def post(self, conn, params):
        club_id = params.get('clubId')   
        email = params.get('email')  
        member_id = params.get('memberId')  
        if not member_id: 
            first_name = params.get('firstName')
            last_name = params.get('lastName')
            phone = params.get('phone')
            db.execute(conn, queries_member.SAVE_MEMBER, (first_name, last_name, email, phone, email, email))        
            member_id = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))["member_id"]
            
        db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, member_id, 
                    constants.ROLE_MEMBER, email, email))
        conn.commit()
        return {"message": f"Member with id {member_id} mapped to the club {club_id}"}
    
    def put(self, conn, params):
        return "club member put"
    