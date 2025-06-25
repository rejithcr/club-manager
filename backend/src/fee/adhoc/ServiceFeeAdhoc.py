from src.fee import queries_fee
from src import db
from src import helper


class FeeAdhocService():
    def get(self, conn, params):
        clubId = params.get("clubId")
        adhocFeeId = params.get("adhocFeeId")

        if adhocFeeId:
            adhocFeeDetails = db.fetch_one(conn, queries_fee.GET_FEE_ADHOC_COLLECTION_BY_ID, (adhocFeeId,))
            return helper.convert_to_camel_case(adhocFeeDetails) if adhocFeeDetails else None
        else:
            collectionList = db.fetch(conn, queries_fee.GET_FEE_ADHOC_COLLECTIONS, (clubId,))
            return [helper.convert_to_camel_case(item) for item in collectionList]

    def post(self, conn, params):
        clubId = params["clubId"]
        adhocFeeName = params.get("adhocFeeName")
        adhocFeeAmount = params.get("adhocFeeAmount")
        adhocFeeDesc = params.get("adhocFeeDesc")
        addedMembers = params.get("addedMembers")
        email = params.get("email")

        clubAdhocFeeId = db.fetch_one(conn, queries_fee.GET_FEE_ADHOC_ID_SEQ_NEXT_VAL, None)['nextval']
        db.execute(conn, queries_fee.ADD_FEE_ADHOC,
                   (clubAdhocFeeId, clubId, adhocFeeName, adhocFeeDesc, 1, email, email))

        for member in addedMembers:
            db.execute(conn, queries_fee.ADD_FEE_ADHOC_PAYMENT,
                       (clubAdhocFeeId, member["membershipId"], member['clubAdocFeePaymentAmount'], email, email))

        conn.commit()

        return {"message": f"Added adhoc fee payment for id {clubAdhocFeeId}"}

    def put(self, conn, params):
        clubId = params.get("clubId")
        email = params.get("email")
        paymentStatusUpadtes = params.get("paymentStatusUpadtes")
        club_transaction_id = None
        for item in paymentStatusUpadtes:
            if item["paid"]:
                # club_transaction_id = db.fetch_one(conn, queries_fee.GET_TRANSACTION_ID_SEQ_NEXT_VAL, None)['nextval']
                db.execute(conn, queries_fee.ADD_ADHOC_FEE_TRANSACTION,
                           (clubId, item["clubAdhocFeePaymentAmount"], "CREDIT", "ADHOC-FEE",
                            f"Fee collection for adhoc paymentId {item['clubAdhocFeePaymentId']}",
                            item["clubAdhocFeePaymentId"], item["paymentDate"], email, email))
                db.execute(conn, queries_fee.UPDATE_ADHOC_FEE_PAYMENT_STATUS, (1, email, item["clubAdhocFeePaymentId"]))
            else:
                # club_transaction_id = db.fetch_one(conn, queries_fee.GET_TRANSACTION_ID_FROM_ADHOC_PAYMENT, 
                #                                     (item["clubAdhocFeePaymentId"],))['club_transaction_id']
                db.execute(conn, queries_fee.UPDATE_ADHOC_FEE_PAYMENT_STATUS, (0, email, item["clubAdhocFeePaymentId"]))
                db.execute(conn, queries_fee.DELETE_ADHOC_FEE_TRANSACTION, (item["clubAdhocFeePaymentId"],))
        conn.commit()
        return {"message": f"Updated payment status for {str(paymentStatusUpadtes)}"}

    def delete(self, conn, params):
        clubAdhocFeeId = params.get("clubAdhocFeeId")

        adhoc_payment_ids = db.fetch(conn, queries_fee.GET_ADHOC_TRANSACTION_IDS_TO_BE_DELETED, (clubAdhocFeeId,))
        for payment_id in adhoc_payment_ids:
            db.execute(conn, queries_fee.DELETE_ADHOC_FEE_TRANSACTION, (payment_id['club_adhoc_fee_payment_id'],))

        db.execute(conn, queries_fee.DELETE_ADHOC_FEE_COLLECTION,
                   (clubAdhocFeeId, clubAdhocFeeId))

        conn.commit()
        return {"message": f"Fee type collections deleted"}