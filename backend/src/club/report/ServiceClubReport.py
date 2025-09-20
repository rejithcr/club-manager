from src import db
from src.member import queries_member
from src.club.report import queries_report
from src import helper
from src import constants


class ClubReportService():
    def get(self, conn, params):
        club_id = params.get('clubId')
        getClubMemberAttribute = params.get('getClubMemberAttribute')
        clubMemberAttributeIds = params.get('clubMemberAttributeIds')

        if getClubMemberAttribute:
            member_attributes = db.fetch(conn, queries_member.GET_MEMBER_ATTRIBUTES, (club_id,))
            member_attributes.extend(constants.PII_ATTRIBUTES)
            return [helper.convert_to_camel_case(attribute) for attribute in member_attributes]

        if clubMemberAttributeIds:
            int_list = list(map(int, clubMemberAttributeIds.split(',')))
            member_attributes_values = db.fetch(conn, queries_report.GET_CLUB_MEMBER_ATTRIBUTES_VALUES,
                                                (club_id,))
            pivoted = helper.pivot_data(member_attributes_values)
            list_report = [attribute for attribute in pivoted]
            return helper.remove_pii(int_list, list_report)

        return {"message": "No matching conditions for get found"}

    def post(self, conn, params):
        return "default post"

    def put(self, conn, params):
        return "default put"
