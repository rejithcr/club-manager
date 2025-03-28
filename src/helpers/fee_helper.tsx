export interface Fee {
    id: number;
    type: string;
    period: string;
    amount: number;
}

let fees : Fee[] = [
    { "id": 1, "type": "Joining", "period": "29-Mar-2025", "amount": 1500},
    { "id": 2, "type": "Monthly", "period": "01-Feb-2025", "amount": 300},
    { "id": 3, "type": "Monthly", "period": "01-Mar-2025", "amount": 300},
]

const dues = [
    {
        "club": "TCS Kochi Cricket Club",
        "total": 2100,
        "dues": [
            {"id": 1, "type": "Joining", "period": "01-Jan-2021", "amount": 1500},
            {"id": 2, "type": "Monthly", "period": "01-Feb-2025", "amount": 300},
            {"id": 3, "type": "Monthly", "period": "01-Mar-2025", "amount": 300}
        ]
    },{
        "club": "Crick-IT Cricket Club",
        "total": 300,
        "dues": [
            {"id": 4, "type": "Monthly", "period": "01-Mar-2025", "amount": 300}
        ]
    }
]

export const getDues = (memberId: number) => {
    return dues
}
