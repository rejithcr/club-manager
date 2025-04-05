export interface Event {
    id: number;
    type: string;
    date: string;
    name: string;
    location?: string;
    time?: string
}

let events : Event[] = [
    { "id": 1, "type": "Birthday", "date": "29-Mar-2025", "name": "Rejith"},
    { "id": 4, "type": "Meeting", "date": "01-Mar-2025", "name": "Core committee", "location": "online", "time": "10pm"},
    { "id": 2, "type": "Anniversary", "date": "01-Feb-2025", "name": "Ajai"},
    { "id": 3, "type": "Birthday", "date": "01-Mar-2025", "name": "Navi"},
]

export const getEvents = async (memberEmail: string) => {
    return events
}