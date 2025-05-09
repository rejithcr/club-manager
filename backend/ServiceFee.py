import queries_fee
import helper
import db


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
                (clubId,feeType,feeTypeInterval,feeAmount,email,email))  
        conn.commit()
        return {"message": f"Fee type added"}


    def put(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        feeType = params.get("feeType")
        feeTypeInterval = params.get("feeTypeInterval")
        feeAmount = params.get("feeAmount")
        email = params.get("email")
        db.execute(conn, queries_fee.EDIT_FEE_TYPE, 
                (feeType,feeTypeInterval,feeAmount,email,feeTypeId))  
        conn.commit()
        return {"message": f"Fee type updated"}


    def delete(self, conn, params):
        feeTypeId = params.get("feeTypeId")
        db.execute(conn, queries_fee.DELETE_FEE_TYPE, 
                (feeTypeId, feeTypeId, feeTypeId))  
        conn.commit()
        return {"message": f"Fee type deleted"}
    