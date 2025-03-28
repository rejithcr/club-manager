export interface Club {
    id: number;
    name: string;
    admin?: string;
    captian?: string;
    viceCaptian?: string;
    createdDate?: string;
    fundBalance: number;
}

export let clubs : Club[] = [
    { "id": 1, "name": "TCS Kochi", "createdDate": "01-Jan-2024", "admin": "Rejith", "captian": "Rejith", "fundBalance": 30000},
    { "id": 2, "name": "Crick-IT", "createdDate": "01-Jan-2024", "admin": "Navaneeth", "captian": "Navaneeth", "fundBalance": 23324},
    { "id": 3, "name": "Guts n Glory", "createdDate": "01-Jan-2024", "admin": "Jaish","captian": "Vimal", "fundBalance": 23324},
    
]

export const getClubs = () => {
    return clubs
}

export const getClubDetails = (id: number) => {
    return clubs.find(clubs => clubs.id == id)
}