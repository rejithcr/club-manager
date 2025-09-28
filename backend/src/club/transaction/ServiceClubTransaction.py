from src import db
from src import helper
from src.club import queries_club


class ClubTransactionService():
    def get(self, conn, params):
        clubId = params.get("clubId")
        limit = params.get("limit")
        offset = params.get("offset")
        txnType = params.get("txnType")
        txnCategoryId = params.get("txnCategoryId")
        showFees = params.get("showFees")

        if showFees == 'true':
            txns = db.fetch(conn, queries_club.GET_TRANSACTIONS_ALL, (clubId, limit, offset))
        else:
            txns = db.fetch(conn, queries_club.GET_TRANSACTIONS, (clubId, txnType, txnType, txnCategoryId, txnCategoryId, limit, offset))

        return [helper.convert_to_camel_case(txn) for txn in txns]

    def post(self, conn, params):
        clubId = params.get("clubId")
        txnAmount = params.get("txnAmount")
        txnComment = params.get("txnComment")
        txnType = params.get("txnType")
        txnCategory = params.get("txnCategory")
        txnCategoryId = params.get("txnCategoryId")
        txnDate = params.get("txnDate")
        email = params.get("email")

        db.execute(conn, queries_club.ADD_TRANSACTION,
                   (clubId, txnAmount, txnType, txnCategoryId, txnCategory, txnComment, txnDate, email, email))
        conn.commit()
        return {"message": "txn added"}

    def put(self, conn, params):
        txnId = params.get("txnId")
        txnAmount = params.get("txnAmount")
        txnComment = params.get("txnComment")
        txnType = params.get("txnType")
        txnCategory = params.get("txnCategory")
        txnCategoryId = params.get("txnCategoryId")
        email = params.get("email")
        txnDate = params.get("txnDate")

        db.execute(conn, queries_club.UPDATE_TRANSACTION,
                   (txnAmount, txnType, txnCategory, txnComment, txnCategoryId, txnDate, email, txnId))
        conn.commit()
        return {"message": "txn updated"}

    def delete(self, conn, params):
        txnId = params.get("txnId")
        db.execute(conn, queries_club.DELETE_TRANSACTION, (txnId,))
        conn.commit()
        return {"message": f"Txn deleted"}

    def get_categories(self, conn, params):
        club_id = params.get("clubId")
        cats = db.fetch(conn, queries_club.GET_TRANSACTIONS_CATEGORIES, (club_id,))
        return [helper.convert_to_camel_case(cat) for cat in cats]

    def add_category(self, conn, params):
        clubId = params.get("clubId")
        categoryName  = params.get("categoryName")
        email = params.get("email")
        categoryId = db.fetch_one(conn, queries_club.GET_TRANSACTIONS_CATEGORIES_SEQ_NEXT_VAL, None)['nextval']
        db.execute(conn, queries_club.ADD_TRANSACTIONS_CATEGORY_WITH_ID,(categoryId, clubId, categoryName, email))
        conn.commit()
        return {"categoryId": categoryId, "categoryName": categoryName}