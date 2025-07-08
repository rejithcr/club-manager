import { del, get, post, put } from "../utils/http/api";


export const getFeeStructure = async (clubId: number) => {
    return get('/fee', { clubId })
}

export const getNextPeriodFeeMemberList = async (feeTypeId: string | null, listNextPaymentCollectionList: string) => {
    return get("/fee/collection", { feeTypeId, listNextPaymentCollectionList })
}


export const addRegularFee = (clubId: string | null, feeType: any, feeTypeInterval: any, feeAmount: any, email: string) => {
    return post("/fee", null, { clubId, feeType, feeTypeInterval, feeAmount, email })
}

export const editFee = (feeTypeId: string | null, feeType: any, feeTypeInterval: any, feeAmount: any, email: string) => {
    return put("/fee", null, { feeTypeId, feeType, feeTypeInterval, feeAmount, email })
}

export const deleteFee = (feeTypeId: string | null, email: string) => {
    return del("/fee", { feeTypeId, email }, null)
}

export const addExceptionType = (feeTypeId: string | null, exceptionType: string | undefined, exceptionAmount: string | undefined, exceptionMembers: any, email: string) => {
    return post("/fee/exception", null, { feeTypeId, exceptionType, exceptionAmount, exceptionMembers, email })
}

export const getExceptionTypes = (feeTypeId: string | null) => {
    return get("/fee/exception", { feeTypeId })
}

export const getNextPeriods = (feeTypeId: string | null, listNextPeriods: string) => {
    return get("/fee/collection", { feeTypeId, listNextPeriods })
}

export const saveNextPeriodFeeCollection = (feeTypeId: string | null, nextPeriodFees: any | undefined,
    nextPeriodDate: string | undefined, nextPeriodLabel: string | undefined, email: string) => {
    return post("/fee/collection", null, { feeTypeId, nextPeriodFees, nextPeriodDate, nextPeriodLabel, email })
}

export const deleteFeeCollection = (clubFeeCollectionId: string | null, email: string) => {
    return del("/fee/collection", { clubFeeCollectionId, email }, null)
}

export const getCollectionsOfFeeType = (feeTypeId: string | null, listCollectionsOfFeetType: string) => {
    return get("/fee/collection", { feeTypeId, listCollectionsOfFeetType })
}


export const getFeePayments = async (feeCollectionId: string | null, listPayments: string) => {
    return get("/fee/collection", { feeCollectionId, listPayments })
}

export const saveFeePayments = (paymentStatusUpadtes: any | undefined, clubId: string | null, updatePaymentStatus: string | undefined, email: string) => {
    return post("/fee/collection", null, { paymentStatusUpadtes, clubId, updatePaymentStatus, email })
}

export const getExceptionDetails = (clubFeeTypeExceptionId: string | null) => {
    return get("/fee/exception", { clubFeeTypeExceptionId })
}

export const updateExceptionType = (feeTypeExceptionId: string | null, exceptionType: string | undefined, exceptionAmount: string | undefined, exceptionMembers: any, email: string) => {
    return put("/fee/exception", null, { feeTypeExceptionId, exceptionType, exceptionAmount, exceptionMembers, email })
}

export const addAdhocFee = (clubId: string | null, adhocFeeName: any, adhocFeeDesc: any, adhocFeeAmount: any, adhocFeeDate: Date, addedMembers: any, email: string) => {
    return post("/fee/adhoc", null, { clubId, adhocFeeName, adhocFeeDesc, adhocFeeAmount, adhocFeeDate, addedMembers, email })
}

export const getAdhocFee = (clubId: number, limit: number, offset: number) => {
    return get("/fee/adhoc", { clubId, limit, offset})
}

export const getAdhocFeePayments = async (adhocFeeId: string | null) => {
    return get("/fee/adhoc", { adhocFeeId })
}

export const saveAdhocFeePayments = (paymentStatusUpadtes: any | undefined, clubId: string | null, updatePaymentStatus: string | undefined, email: string) => {
    return put("/fee/adhoc", null, { paymentStatusUpadtes, clubId, updatePaymentStatus, email })
}

export const deleteAdhocFeeCollection = (clubAdhocFeeId: string | null, email: string) => {
    return del("/fee/adhoc", { clubAdhocFeeId, email }, null)
}