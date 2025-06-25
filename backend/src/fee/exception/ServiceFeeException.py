from src.fee import queries_fee
from src import db
from src import helper


class FeeExceptionService():
    def get(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        clubFeeTypeExceptionId = params.get("clubFeeTypeExceptionId")

        if clubFeeTypeExceptionId:
            # collections = db.fetch(conn, queries_fee.GET_COLLECTIONS_OF_EXCEPTION, (clubFeeTypeExceptionId,))
            # periods = [p['club_fee_type_period'] for p in collections]

            exception = db.fetch_one(conn, queries_fee.GET_FEE_TYPE_EXCEPTION, (clubFeeTypeExceptionId,))
            x_members = [member for member in exception['members'] if member["member_id"]]
            exception['members'] = x_members

            # TBD: the edits need to be logged for audit. We were restricting the edit instead.
            # if periods:
            #     exception['isAmountEditable'] = False
            # else:
            #     exception['isAmountEditable'] = True

            return helper.convert_to_camel_case(exception) if exception else None
        else:
            exceptions = db.fetch(conn, queries_fee.GET_FEE_TYPE_EXCEPTIONS, (feeTypeId,))
            return [helper.convert_to_camel_case(exception) for exception in exceptions]

    def post(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        exceptionType = params.get("exceptionType")
        exceptionAmount = params.get("exceptionAmount")
        exceptionMembers = params.get("exceptionMembers", [])
        email = params.get("email")

        club_fee_type_exception_id_seq = db.fetch_one(conn, queries_fee.GET_FEE_TYPE_EXCEPTION_SEQ_NEXT_VAL, None)[
            'nextval']

        db.execute(conn, queries_fee.ADD_FEE_TYPE_EXCEPTION,
                   (club_fee_type_exception_id_seq, feeTypeId, exceptionType, exceptionAmount, email, email))

        for member in exceptionMembers:
            db.execute(conn, queries_fee.ADD_FEE_TYPE_EXCEPTION_MEMBER,
                       (club_fee_type_exception_id_seq, member['membershipId'], email, email))

        conn.commit()

        return {"message": f"Fee type exception added"}

    def put(self, conn, params):
        feeTypeExceptionId = params.get("feeTypeExceptionId")
        exceptionType = params.get("exceptionType")
        exceptionAmount = params.get("exceptionAmount")
        exceptionMembers = params.get("exceptionMembers", [])
        email = params.get("email")

        db.execute(conn, queries_fee.UPDATE_FEE_TYPE_EXCEPTION,
                   (exceptionType, exceptionAmount, email, feeTypeExceptionId))

        for member in exceptionMembers:
            if member.get("endDateAdded"):
                # any open fee payments?
                open_fee_payments = db.fetch(conn, queries_fee.GET_OPEN_FEE_EXCEPTION_PAYMENTS,
                                             (member['clubFeeTypeExceptionMemberId'],))

                # TBD: need to validate the end date based on the open collection
                # if open_fee_payments:
                #     periods = [p['club_fee_type_period'] for p in open_fee_payments]
                #     raise Exception(f"Cannot update fee type exception for {member['firstName']}. There are open fee payments for {periods}")

                db.execute(conn, queries_fee.UPDATE_FEE_TYPE_EXCEPTION_MEMBER_END_DATE,
                           (member['endDateAdded'], email, member['clubFeeTypeExceptionMemberId']))
            else:
                db.execute(conn, queries_fee.ADD_FEE_TYPE_EXCEPTION_MEMBER,
                           (feeTypeExceptionId, member['membershipId'], email, email))

        conn.commit()

        return {"message": f"Fee type exception updated"}
