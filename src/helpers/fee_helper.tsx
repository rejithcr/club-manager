import { get, post, put } from "../utils/api";
import { getMonth, getQuarter, getYear } from "../utils/common";
import { PERIOD_MONTHLY, PERIOD_QUATERLY } from "../utils/constants";

export interface Fee {
    id: number;
    type: string;
    name: string;
    paid: boolean;
    period: string;
    amount: number;
}

export interface FeeSummary {
    totalDue: number,
    currentPeriodRecieved: number,
    currentPeriodExpected: number,
    currentPeriodType: string,
    fundBalance: number
}

const feeSummary: FeeSummary = {
    totalDue: 2000,
    currentPeriodRecieved: 12000,
    currentPeriodExpected: 15000,
    currentPeriodType: "MONTHLY",
    fundBalance: 30000
}


const duesByMember = [
    {
        "club": "TCS Kochi Cricket Club",
        clubId: 1,
        "total": 2100,
        "dues": [
            { "id": 1, "type": "Joining", "period": "01-Jan-2021", "amount": 1500 },
            { "id": 2, "type": "Monthly", "period": "01-Feb-2025", "amount": 300 },
            { "id": 3, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 }
        ]
    }, {
        "club": "Crick-IT Cricket Club",
        clubId: 2,
        "total": 300,
        "dues": [
            { "id": 4, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 }
        ]
    }
]

export const getDues = async (memberEmail: string) => {
    return duesByMember
}

export const getFeeSummary = async (clubId: number | undefined) => {
    return feeSummary
}

export interface Dues {
    name: string,
    memberId: number,
    total: number,
    dues: { id: number, type: string, period: string, amount: number }[]
}

const duesGroupByMembers: Dues[] = [{
    name: "Rejith",
    total: 2100,
    memberId: 1,
    dues: [
        { id: 1, type: "Joining", period: "NA", amount: 1500 },
        { id: 2, type: "Monlty", period: "2025 FEB", amount: 300 },
        { id: 3, type: "Joining", period: "2025 MAR", amount: 300 }
    ]
}, {
    name: "Someone",
    total: 1800,
    memberId: 2,
    dues: [
        { id: 1, type: "Joining", period: "JAN", amount: 1500 },
        { id: 2, type: "Quaterly", period: "2025 Q4", amount: 300 },
    ]
}, {
    name: "Someone",
    total: 1800,
    memberId: 4,
    dues: [
        { id: 1, type: "Joining", period: "JAN", amount: 1500 },
        { id: 2, type: "Quaterly", period: "2025 Q4", amount: 300 },
    ]
}, {
    name: "Someone",
    total: 1800,
    memberId: 3,
    dues: [
        { id: 1, type: "Joining", period: "JAN", amount: 1500 },
        { id: 2, type: "Quaterly", period: "2025 Q4", amount: 300 },
    ]
}]
export const getDuesGroupByMember = async (clubId: number) => {
    return duesGroupByMembers
}



let feesFeb: Fee[] = [
    { "id": 1, "name": "Rejith Ramakrishnan", paid: true, "type": "Joining", "period": "29-Mar-2025", "amount": 300 },
    { "id": 2, "name": "Kanaran", paid: false, "type": "Monthly", "period": "01-Feb-2025", "amount": 300 },
    { "id": 3, "name": "Paappan", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 250 },
    { "id": 4, "name": "Thankachan", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 5, "name": "Akka", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 250 },
    { "id": 6, "name": "Akachi", paid: false, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 7, "name": "Test", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 8, "name": "Akachi", paid: false, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 9, "name": "Why M", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 11, "name": "Akachi", paid: false, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 12, "name": "Mohavalli", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 13, "name": "Diya", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 14, "name": "Sobha", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 15, "name": "George", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 16, "name": "Another Person", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 17, "name": "Cycle", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 18, "name": "Amma", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 19, "name": "Eva", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
    { "id": 20, "name": "YP", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
]



let feesMar: Fee[] = [
    { "id": 1, "name": "Rejith Ramakrishnan", paid: false, "type": "Joining", "period": "29-Mar-2025", "amount": 300 },
    { "id": 2, "name": "Kanaran", paid: false, "type": "Monthly", "period": "01-Feb-2025", "amount": 300 },
    { "id": 3, "name": "Paappan", paid: true, "type": "Monthly", "period": "01-Mar-2025", "amount": 250 },
]

export const getFeeStructure = async (clubId: number) => {
    return get('/fee', { clubId })
}


export const getFeeExemptions = async (clubId: number) => {
    return {
        "Injury": "250",
        "Leave": "0",
    }
}


export const getAdhocFees = async (clubId: number) => {
    return {
        "Joining": "1500",
        "Re - Joining": "1000",
    }
}

export const getNextPeriodFeeMemberList = async (feeTypeId: string | null, listNextPaymentCollectionList: string) => {
    return get("/fee/collection", { feeTypeId, listNextPaymentCollectionList })
}


export const addRegularFee = (clubId: string | null, feeType: any, feeTypeInterval: any, feeAmount: any, email: string) => {
    console.log(clubId, feeType, feeTypeInterval, feeAmount, email)
    return post("/fee", { clubId, feeType, feeTypeInterval, feeAmount, email }, null)
}

export const addExceptionType = (feeTypeId: string | null, exceptionType: string | undefined, exceptionAmount: string | undefined, exceptionMembers: any, email: string) => {
    return post("/fee/exception", null , { feeTypeId, exceptionType, exceptionAmount, exceptionMembers, email })
}

export const getExceptionTypes = (feeTypeId: string | null) => {
    return get("/fee/exception", { feeTypeId })
}

export const getNextPeriods = (feeTypeId: string | null, listNextPeriods: string) => {
    return get("/fee/collection", { feeTypeId, listNextPeriods})
}

export const saveNextPeriodFeeCollection = (feeTypeId: string | null, nextPeriodFees: any | undefined, 
                                    nextPeriodDate: string | undefined, nextPeriodLabel: string | undefined, email: string) => {
    console.log(feeTypeId, nextPeriodFees, nextPeriodDate, nextPeriodLabel, email)
    return post("/fee/collection", null, { feeTypeId, nextPeriodFees, nextPeriodDate, nextPeriodLabel, email })
}

export const getCollectionsOfFeeType = (feeTypeId: string | null, listCollectionsOfFeetType: string) => {
    return get("/fee/collection", { feeTypeId, listCollectionsOfFeetType})
}


export const getFeePayments = async (feeCollectionId: string | null, listPayments: string) => {
    return get("/fee/collection", {feeCollectionId, listPayments})
}

export const saveFeePayments = (paymentStatusUpadtes: any | undefined, updatePaymentStatus: string | undefined, email: string) => {
    return post("/fee/collection", null, { paymentStatusUpadtes, updatePaymentStatus, email })
}

export const getExceptionDetails = (clubFeeTypeExceptionId: string | null) => {
    return get("/fee/exception", { clubFeeTypeExceptionId })
}

export const updateExceptionType = (feeTypeExceptionId: string | null, exceptionType: string | undefined, exceptionAmount: string | undefined, exceptionMembers: any, email: string) => {
    return put("/fee/exception", null , { feeTypeExceptionId, exceptionType, exceptionAmount, exceptionMembers, email })
}