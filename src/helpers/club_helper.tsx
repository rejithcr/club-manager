import { get, post } from "../utils/api";

export interface Club {
    id: number;
    name: string;
    admin?: string;
    captian?: string;
    viceCaptian?: string;
    createdDate?: string;
}

export let clubs : Club[] = [
    { "id": 0, "name": "TCS Kochi Cricket Club", "createdDate": "01-Jan-2024", "admin": "Rejith", "captian": "Rejith"},
    { "id": 2, "name": "Crick-IT", "createdDate": "01-Jan-2024", "admin": "Navaneeth", "captian": "Navaneeth"},
    { "id": 3, "name": "Guts n Glory", "createdDate": "01-Jan-2024", "admin": "Jaish","captian": "Vimal"},
    
]

export const getClubs = (memberId: number) => {
    return get("/club", {memberId: memberId})
}

export const createClub = (clubName: string, memberId: string, email: string) => {
    return post("/club", null, {clubName, memberId, email})
}

export const getClubDetails = (clubId: number) => {
    return get("/club", {clubId: clubId})
}


export const getClubMembers = (clubId: string | null) => {
    return get("/club/member", {clubId: clubId})
}


export const addMemberAndAssignClub = async (member: any) => {
    return post("/club/member", null, member)
}

export const addToClub = async (memberId: number, clubId: number, email: string) => {
    return post("/club/member", null, {memberId, clubId, email})
}