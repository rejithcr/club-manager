from src import db
from src import helper
from src.club import queries_club


class ClubTransactionService():
    def get(self, conn, params):
        clubId = params.get("clubId")
        limit = params.get("limit")
        offset = params.get("offset")
        txnType = params.get("txnType")
        showFees = params.get("showFees")

        if showFees == 'true':
            txns = db.fetch(conn, queries_club.GET_TRANSACTIONS_ALL, (clubId, limit, offset))
        else:
            txns = db.fetch(conn, queries_club.GET_TRANSACTIONS, (clubId, txnType, txnType, limit, offset))

        return [helper.convert_to_camel_case(txn) for txn in txns]

    def post(self, conn, params):
        clubId = params.get("clubId")
        txnAmount = params.get("txnAmount")
        txnComment = params.get("txnComment")
        txnType = params.get("txnType")
        txnCategory = params.get("txnCategory")
        txnDate = params.get("txnDate")
        email = params.get("email")

        db.execute(conn, queries_club.ADD_TRANSACTION,
                   (clubId, txnAmount, txnType, txnCategory, txnComment, txnDate, email, email))
        conn.commit()
        return {"message": "txn added"}

    def put(self, conn, params):
        txnId = params.get("txnId")
        txnAmount = params.get("txnAmount")
        txnComment = params.get("txnComment")
        txnType = params.get("txnType")
        txnCategory = params.get("txnCategory")
        email = params.get("email")
        txnDate = params.get("txnDate")

        db.execute(conn, queries_club.UPDATE_TRANSACTION,
                   (txnAmount, txnType, txnCategory, txnComment, txnDate, email, txnId))
        conn.commit()
        return {"message": "txn updated"}

    def delete(self, conn, params):
        txnId = params.get("txnId")
        db.execute(conn, queries_club.DELETE_TRANSACTION, (txnId,))
        conn.commit()
        return {"message": f"Txn deleted"}