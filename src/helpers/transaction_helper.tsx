import { get, post } from "../utils/api"

export const getTransactions = async (clubId: string | null, txnType: string, showFees: boolean, limit: number, offset: number) => {
    return get("/club/transaction", { clubId, txnType, showFees, limit, offset })
}

export const saveTransaction = async (clubId: string | null, txnType: string,  txnCategory:string, txnComment: string, txnAmount: number, email: string) => {
    return post("/club/transaction", null, { clubId, txnType, txnCategory, txnComment, txnAmount, email })
}