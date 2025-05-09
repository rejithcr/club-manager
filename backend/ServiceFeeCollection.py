import queries_fee
import queries_member
import db
import helper


class FeeCollectionService():
    def get(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        listNextPeriods = params.get("listNextPeriods")
        listCollectionsOfFeetType = params.get("listCollectionsOfFeetType")
        listPayments = params.get("listPayments")

        if listNextPeriods and listNextPeriods == "true": 
            latestPeriod = db.fetch_one(conn, queries_fee.GET_LATEST_COLLECTION_PERIOD, (feeTypeId,feeTypeId))   
            feeType = db.fetch_one(conn, queries_fee.GET_FEES_BY_ID, (feeTypeId,))  
            dates =  helper.get_dates_of_period(feeType['club_fee_type_interval'], 
                latestPeriod.get('club_fee_type_date') if latestPeriod else None)
            return dates

        listNextPaymentCollectionList = params.get("listNextPaymentCollectionList")
        if listNextPaymentCollectionList and listNextPaymentCollectionList == "true":
            nextList = db.fetch(conn, queries_fee.GET_NEXT_PAYTMENT_COLLECTION_LIST, (feeTypeId,)) 
            for item in nextList:
                min_fee = min(item['exceptions'], key=lambda obj: obj['club_fee_amount'])
                item['club_fee_amount'] = min_fee['club_fee_amount']
                item['club_fee_type_exception_member_id'] = min_fee['club_fee_type_exception_member_id']                
                del item['exceptions']

            return [helper.convert_to_camel_case(item) for item in nextList]

        if listCollectionsOfFeetType and listCollectionsOfFeetType == "true":
            collectionList = db.fetch(conn, queries_fee.GET_FEE_COLLECTION_BY_FEE_TYPE_ID, (feeTypeId,))
            return [helper.convert_to_camel_case(item) for item in collectionList]
            
        if listPayments and listPayments == "true":
            feeCollectionId = params.get("feeCollectionId")
            paymentList = db.fetch(conn, queries_fee.GET_FEE_PAYMENT_BY_FEE_COLLECTION_ID, (feeCollectionId,))
            return [helper.convert_to_camel_case(item) for item in paymentList]
        
        return {"message": "!!"}


    def post(self,conn, params):
        feeTypeId = params.get("feeTypeId")
        clubId = params.get("clubId")
        nextPeriodFees = params.get("nextPeriodFees")
        nextPeriodDate = params.get("nextPeriodDate")
        nextPeriodLabel = params.get("nextPeriodLabel")
        email = params.get("email")

        updatePaymentStatus = params.get("updatePaymentStatus")
        if updatePaymentStatus and updatePaymentStatus == "true":
            paymentStatusUpadtes = params.get("paymentStatusUpadtes")
            club_transaction_id = None
            for item in paymentStatusUpadtes:
                if item["paid"]:
                    club_transaction_id = db.fetch_one(conn, queries_fee.GET_TRANSACTION_ID_SEQ_NEXT_VAL, None)['nextval']
                    db.execute(conn, queries_fee.ADD_TRANSACTION, 
                        (club_transaction_id, clubId, item["amount"], "CREDIT", "FEE", f"Fee collection for paymentId {item['clubFeePaymentId']}", email, email))
                    db.execute(conn, queries_fee.UPDATE_FEE_PAYMENT_STATUS, (1, club_transaction_id, email, item["clubFeePaymentId"]))
                else:
                    club_transaction_id = db.fetch_one(conn, queries_fee.GET_TRANSACTION_ID_FROM_PAYMENT, (item["clubFeePaymentId"],))['club_transaction_id']
                    db.execute(conn, queries_fee.UPDATE_FEE_PAYMENT_STATUS, (0, None, email, item["clubFeePaymentId"]))
                    db.execute(conn, queries_fee.DELETE_TRANSACTION, (club_transaction_id,))
            conn.commit()
            return {"message": f"Updated payment status for {str(paymentStatusUpadtes)}"}

        else:
            club_fee_collection_id = db.fetch_one(conn, queries_fee.GET_FEE_TYPE_COLLECTION_SEQ_NEXT_VAL, None)['nextval']
            print("club_fee_collection_id " + str(club_fee_collection_id))
            db.execute(conn, queries_fee.ADD_FEE_TYPE_COLLECTION_START, 
                    (club_fee_collection_id, feeTypeId,nextPeriodLabel,nextPeriodDate,email,email))  

            for nxtFee in nextPeriodFees:
                db.execute(conn, queries_fee.ADD_FEE_TYPE_PAYMENT, 
                    (club_fee_collection_id, nxtFee["membershipId"], nxtFee["clubFeeTypeExceptionMemberId"],email,email))

            conn.commit()

            return {"message": f"Added fee payment for period {nextPeriodLabel}"}

    def put(self,conn, params):
        return "default put"
    

    
    def delete(self, conn, params):
        clubFeeCollectionId = params.get("clubFeeCollectionId")
        txn_ids = db.fetch(conn, queries_fee.GET_TRANSACTION_IDS_TO_BE_DELETED, (clubFeeCollectionId, )) 
        db.execute(conn, queries_fee.DELETE_FEE_COLLECTION, 
                (clubFeeCollectionId,clubFeeCollectionId))  
        for txn_id in txn_ids:
            db.execute(conn, queries_fee.DELETE_TRANSACTION, (txn_id['club_transaction_id'], ))

        conn.commit()
        return {"message": f"Fee type collections deleted"}