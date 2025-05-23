import { del, get, post, put } from "../utils/api"

export const getTransactions = async (clubId: string | null, txnType: string, showFees: boolean, limit: number, offset: number) => {
    return get("/club/transaction", { clubId, txnType, showFees, limit, offset })
}

export const saveTransaction = async (clubId: string | null, txnDate: Date, txnType: string,  txnCategory:string, txnComment: string, txnAmount: number, email: string) => {
    return post("/club/transaction", null, {clubId, txnDate, txnType, txnCategory, txnComment, txnAmount, email })
}

export const updateTransaction = async (txnId: number, txnType: string, txnDate: Date, txnCategory:string, txnComment: string, txnAmount: number, email: string) => {
    return put("/club/transaction", null, { txnId, txnType, txnCategory, txnDate, txnComment, txnAmount, email })
}

export const deleteTransaction = async (txnId: number) => {
    return del("/club/transaction", { txnId }, null )
}
