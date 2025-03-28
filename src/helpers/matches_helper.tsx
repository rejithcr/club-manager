export interface Match {
    id: number;
    name: string;
    date: string;
    time?: string;
    ground?: string;
    club: string;
}

export let matches : Match[] = [
    { "id": 1, "name": "Crick-IT Cup 2025", "date": "29-Mar-2025", "time": "10:00am", "ground": "St. Pauls", "club": "TCS Kochi Cricket Club"},
    { "id": 2, "name": "Crick-IT Cup 2025", "date": "29-Mar-2025", "time": "3:00pm", "ground": "St. Pauls","club": "TCS Kochi Cricket Club"},
    { "id": 3, "name": "Akme Cup 2025", "date": "12-Apr-2025", "time": "8am", "ground": "FISAT","club": "Crick-IT"},
]

export const getMatches = (memberId: number) => {
    return matches
}
