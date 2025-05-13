import { get, post } from "../utils/api";

export const getClubs = (memberId: number) => {
    return get("/club", {memberId: memberId})
}

export const createClub = (clubName: string | null, memberId: string, email: string) => {
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

export const getFundBalance = async (clubId: string | null) => {
    return get("/club", {clubId, fundBalance: "true"})
}

export const getTotalDue = async (clubId: string | null) => {
    return get("/club", {clubId, totalDue: "true"})
}

export const getDuesByMember = (memberId: number | null) => {
    return get("/club/member", {memberId, duesByMember: "true"})
}

export const getClubDues = (clubId: number | null) => {
    return get("/club/member", {clubId, duesByClub: "true"})
}
