import db
import helper
import queries_club


class ClubTransactionService():
    def get(self, conn, params):
        clubId = params.get("clubId")
        limit = params.get("limit")
        offset = params.get("offset")
        txns = db.fetch(conn, queries_club.GET_TRANSACTIONS, (clubId,limit,offset))   
        return [helper.convert_to_camel_case(txn) for txn in txns]  

    def post(self,conn, params):
        clubId = params.get("clubId")
        txnAmount = params.get("txnAmount")
        txnComment = params.get("txnComment")
        txnType = params.get("txnType")
        txnCategory = params.get("txnCategory")
        email = params.get("email")

        db.execute(conn, queries_club.ADD_TRANSACTION, 
                    (clubId, txnAmount, txnType, txnCategory, txnComment, email, email))
        conn.commit()
        return "default post"

    def put(self,conn, params):
        return "default put"
    