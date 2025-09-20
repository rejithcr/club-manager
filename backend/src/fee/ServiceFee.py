from datetime import date

from src.fee import queries_fee
from src import db, constants
from src import helper


class FeeService():
    def get(self, conn, params):
        clubId = params.get("clubId")
        fees = db.fetch(conn, queries_fee.GET_FEES, (clubId,))
        return [helper.convert_to_camel_case(fee) for fee in fees]

    def post(self, conn, params):
        feeType = params.get("feeType")
        feeTypeInterval = params.get("feeTypeInterval")
        feeAmount = params.get("feeAmount")
        clubId = params.get("clubId")
        email = params.get("email")
        db.execute(conn, queries_fee.ADD_FEE_TYPE,
                   (clubId, feeType, feeTypeInterval, feeAmount, email, email))
        conn.commit()
        return {"message": f"Fee type added"}

    def put(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        feeType = params.get("feeType")
        feeTypeInterval = params.get("feeTypeInterval")
        feeAmount = params.get("feeAmount")
        email = params.get("email")
        db.execute(conn, queries_fee.EDIT_FEE_TYPE,
                   (feeType, feeTypeInterval, feeAmount, email, feeTypeId))
        conn.commit()
        return {"message": f"Fee type updated"}

    def delete(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        db.execute(conn, queries_fee.DELETE_FEE_TYPE,
                   (feeTypeId, feeTypeId, feeTypeId))
        conn.commit()
        return {"message": f"Fee type deleted"}


    def mark_paid(self, conn, params):
        payments = params.get("payments")
        email = params.get("email")
        clubId = params.get("clubId")
        for payment in payments:
            if payment['feeType'] == constants.FEE_TYPE_ADHOC_FEE:
                db.execute(conn, queries_fee.MARK_ADHOC_FEE_AS_PAID,(email, payment['paymentId']))
                db.execute(conn, queries_fee.ADD_ADHOC_FEE_TRANSACTION,
                           (clubId, payment['amount'], "CREDIT", constants.FEE_TYPE_ADHOC_FEE,
                            f"Fee collection for adhoc paymentId {payment['paymentId']}",
                            payment['paymentId'], date.today(), email, email))
            elif payment['feeType'] == constants.FEE_TYPE_FEE:
                db.execute(conn, queries_fee.MARK_FEE_AS_PAID,(email, payment['paymentId']))
                db.execute(conn, queries_fee.ADD_FEE_TRANSACTION,
                           (clubId, payment['amount'], "CREDIT", constants.FEE_TYPE_FEE,
                            f"Fee collection for paymentId {payment['paymentId']}",
                            payment['paymentId'], date.today(), email, email))
        conn.commit()
        return {"message": f"{len(payments)} Payments updated"}