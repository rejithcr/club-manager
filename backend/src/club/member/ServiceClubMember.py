from src import db
from src.club import queries_club
from src.member import queries_member
from src import helper
from src import constants


class ClubMemberService():

    def get(self, conn, params):
        club_id = params.get('clubId')
        duesByClub = params.get('duesByClub')
        duesByMember = params.get('duesByMember')
        memberId = params.get('memberId')
        getClubMemberAttribute = params.get('getClubMemberAttribute')
        getClubMemberAttributeValues = params.get('getClubMemberAttributeValues')
        limit = params.get("limit")
        offset = params.get("offset")

        if getClubMemberAttribute:
            member_attributes = db.fetch(conn, queries_member.GET_MEMBER_ATTRIBUTES, (club_id,))
            return [helper.convert_to_camel_case(attribute) for attribute in member_attributes]
        if getClubMemberAttributeValues:
            member_attribute_values = db.fetch(conn, queries_member.GET_MEMBER_ATTRIBUTE_VALUES,
                                               (club_id, memberId, club_id))
            return [helper.convert_to_camel_case(attribute) for attribute in member_attribute_values]

        if duesByClub:
            club_dues = db.fetch(conn, queries_club.GET_DUES, (club_id, club_id))
            return [helper.convert_to_camel_case(member) for member in club_dues]
        if duesByMember:
            member_dues = db.fetch(conn, queries_member.GET_DUES_BY_MEMBER, (memberId, memberId))
            return [helper.convert_to_camel_case(fee_due) for fee_due in member_dues]
        if club_id and memberId:
            member = db.fetch_one(conn, queries_club.GET_CLUB_MEMBER, (memberId, club_id))
            return helper.convert_to_camel_case(member)

        clubs = db.fetch(conn, queries_club.GET_CLUB_MEMBERS, (club_id,limit, offset))
        return [helper.convert_to_camel_case(club) for club in clubs]

    def post(self, conn, params):
        club_id = params.get('clubId')
        email = params.get('email')
        member_id = params.get('memberId')
        addToClub = params.get('addToClub')
        addClubMemberAttribute = params.get('addClubMemberAttribute')
        attributeName = params.get('attributeName')
        required = params.get('required')

        if addClubMemberAttribute:
            db.execute(conn, queries_member.ADD_MEMBER_ATTRIBUTE,
                       (club_id, attributeName, 1 if required else 0, email, email))
            conn.commit()
            return {"message": f"Attribute added."}

        if addToClub and club_id and member_id:
            db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, member_id,
                                                              constants.ROLE_MEMBER, email, email))
            conn.commit()
            return {"message": f"Member with id {member_id} added to the club {club_id}"}

        if not member_id:
            first_name = params.get('firstName')
            last_name = params.get('lastName')
            createdBy = params.get('createdBy')
            phone = params.get('phone')
            db.execute(conn, queries_member.SAVE_MEMBER,
                       (first_name, last_name, email, phone, None, None, 0, createdBy, createdBy))
            member_id = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))["member_id"]
            db.execute(conn, queries_member.SAVE_MEMBERSHIP, (club_id, member_id,
                                                              constants.ROLE_MEMBER, email, email))
            conn.commit()
            return {"message": f"Member with id {member_id} mapped to the club {club_id}"}

        return "Did not met any conditions"

    def request(self, conn, params):
        club_id = params.get('clubId')
        email = params.get('email')
        member_id = params.get('memberId')

        membership = db.fetch_one(conn, queries_member.GET_MEMBERSHIP_ID, (club_id, member_id))
        if membership:
            return {"message": f"You are already a member of the club"}
        db.execute(conn, queries_member.REQUEST_MEMBERSHIP, (club_id, member_id, email, email))
        conn.commit()
        return {"message": f"Member with id {member_id} request to join club {club_id}"}


    def put(self, conn, params):
        email = params.get('email')
        phone = params.get('phone')
        first_name = params.get('firstName')
        last_name = params.get('lastName')
        dateOfBirth = params.get('dateOfBirth')
        memberId = params.get('memberId')
        role = params.get('role')
        clubId = params.get('clubId')
        updatedBy = params.get('updatedBy')
        editClubMemberAttribute = params.get('editClubMemberAttribute')
        attributeName = params.get('attributeName')
        clubMemberAttributeId = params.get('clubMemberAttributeId')
        required = params.get('required')
        saveClubMemberAttributeValues = params.get('saveClubMemberAttributeValues')
        updatedCMAList = params.get('updatedCMAList')

        if editClubMemberAttribute:
            db.execute(conn, queries_member.UPDATE_MEMBER_ATTRIBUTE,
                       (attributeName, 1 if required else 0, email, clubMemberAttributeId))
            conn.commit()
            return {"message": f"Member attribute updated successfully"}
        if saveClubMemberAttributeValues:
            db.execute(conn, queries_member.DELETE_MEMBER_ATTRIBUTE_VALUES, (clubId, memberId))
            for change in updatedCMAList:
                if change["attributeValue"] and change["attributeValue"].strip() != "":
                    db.execute(conn, queries_member.ADD_MEMBER_ATTRIBUTE_VALUE,
                               (change["clubMemberAttributeId"], clubId, memberId, change["attributeValue"], email,
                                email))
            conn.commit()
            return {"message": f"Member attribute values updated successfully"}

        db.execute(conn, queries_club.UPDATE_CLUB_MEMBER_ROLE, (role, clubId, memberId))
        db.execute(conn, queries_member.UPDATE_MEMBER,
                   (first_name, last_name, email, phone, dateOfBirth, updatedBy, memberId))
        conn.commit()

        return {"message": "Member updated successfully"}

    def delete(self, conn, params):
        member_id = params.get('memberId')
        club_id = params.get('clubId')
        email = params.get('email')
        deleteClubMemberAttribute = params.get('deleteClubMemberAttribute')
        clubMemberAttributeId = params.get('clubMemberAttributeId')

        if deleteClubMemberAttribute:
            print("deleteing cma")
            db.execute(conn, queries_member.DELETE_MEMBER_ATTRIBUTE, (clubMemberAttributeId, clubMemberAttributeId))
            conn.commit()
            return {"message": f"Member attribute deleted successfully"}
        # TBD: delete member if not part onf any other club
        db.execute(conn, queries_club.REMOVE_MEMBERSHIP, (email, club_id, member_id))
        conn.commit()

        return {"message": f"Membership revoked"}