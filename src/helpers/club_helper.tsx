import { get } from "../utils/api";

export interface Club {
    id: number;
    name: string;
    admin?: string;
    captian?: string;
    viceCaptian?: string;
    createdDate?: string;
}

export let clubs : Club[] = [
    { "id": 8, "name": "TCS Kochi Cricket Club", "createdDate": "01-Jan-2024", "admin": "Rejith", "captian": "Rejith"},
    { "id": 2, "name": "Crick-IT", "createdDate": "01-Jan-2024", "admin": "Navaneeth", "captian": "Navaneeth"},
    { "id": 3, "name": "Guts n Glory", "createdDate": "01-Jan-2024", "admin": "Jaish","captian": "Vimal"},
    
]

export const getClubs = (memberId: number) => {
    return get("/club", {memberId: memberId})
}

export const createClub = (club: {name: string; admin: string}) => {
    clubs.push({id: clubs.length + 1, "name": club.name, admin: club.admin})
    return clubs
}

export const getClubDetails = (id: number) => {
    return clubs.find(clubs => clubs.id == id)
}


export const getClubMembers = (clubId: string | null) => {
    return get("/club/member", {clubId: clubId})
}