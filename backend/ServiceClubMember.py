import db
import queries_club
import queries_member
import helper 
import constants

from ServiceMember import MemberService

class ClubMemberService():

    def get(self, conn, params):
        club_id = params.get('clubId')    
        duesByClub = params.get('duesByClub') 
        duesByMember = params.get('duesByMember')
        memberId = params.get('memberId')
        
        if duesByClub:
            club_dues = db.fetch(conn, queries_club.GET_DUES, (club_id,club_id))
            return [helper.convert_to_camel_case(member) for member in club_dues]
        if duesByMember:
            member_dues = db.fetch(conn, queries_member.GET_DUES_BY_MEMBER, (memberId,memberId))
            return [helper.convert_to_camel_case(fee_due) for fee_due in member_dues]
        
        clubs = db.fetch(conn, queries_club.GET_CLUB_MEMBERS, (club_id,))
        return [helper.convert_to_camel_case(club) for club in clubs]
        
    def post(self, conn, params):
        club_id = params.get('clubId')   
        email = params.get('email')  
        member_id = params.get('memberId')  
        addToClub = params.get('addToClub')  
        membershipRequest = params.get('membershipRequest') 
        
        if addToClub and club_id and member_id:
            db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, member_id, 
                    constants.ROLE_MEMBER, email, email))
            conn.commit()
            return {"message": f"Member with id {member_id} added to the club {club_id}"}

        if membershipRequest and club_id and member_id:
            membership = db.fetch_one(conn, queries_member.GET_MEMBERSHIP_ID, (club_id,member_id))
            if membership:
                return {"message": f"You are already a member of the club"}
            db.execute(conn, queries_member.REQUEST_MEMBERSHIP, (club_id, member_id, email, email))
            conn.commit()
            return {"message": f"Member with id {member_id} request to join club {club_id}"}

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
        
        return "Did not met any conditions"

    def put(self, conn, params):
        return "club member put"
    