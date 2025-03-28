export interface Club {
    id: number;
    name: string;
    admin?: string;
    createdDate?: string;
    fundBalance: number;
}

export let clubs : Club[] = [
    { "id": 1, "name": "TCS Kochi Cricket Club", "createdDate": "01-Jan-2024", "admin": "Rejith", "fundBalance": 30000},
    { "id": 2, "name": "Crick-IT Cricket Club", "createdDate": "01-Jan-2024", "admin": "Rejith", "fundBalance": 23324},
]

export const getClubs = () => {
    return clubs
}

export const getClubDetails = (id: number) => {
    return clubs.find(clubs => clubs.id == id)
}