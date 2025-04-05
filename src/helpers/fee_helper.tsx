import { sleep } from "../utils/common";

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


let fees: Fee[] = [
    { "id": 1, "name": "Rejith", paid: true,  "type": "Joining", "period": "29-Mar-2025", "amount": 1500 },
    { "id": 2, "name": "Some", paid: false,  "type": "Monthly", "period": "01-Feb-2025", "amount": 300 },
    { "id": 3, "name": "Else", paid: true,  "type": "Monthly", "period": "01-Mar-2025", "amount": 300 },
]

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

export const getFeeSummary = async (clubId: number| undefined) => {
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
},{
    name: "Someone",
    total: 1800,
    memberId: 4,
    dues: [
        { id: 1, type: "Joining", period: "JAN", amount: 1500 },
        { id: 2, type: "Quaterly", period: "2025 Q4", amount: 300 },
    ]
},{
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

export const getFeeByMember = async (clubId: number) => {
    await sleep(3000)
    return fees
}
