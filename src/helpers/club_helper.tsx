import { del, get, post, put } from "../utils/api";

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
    return post("/club/member", null, {memberId, clubId,  addToClub: "true", email})
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

export const searchClubsByName = (clubName: string | null) => {
    return get("/club", {clubName, search: "true"})
}

export const requestMembership = async ( clubId: number, memberId: number, email: string) => {
    return post("/club/member", null, {memberId, clubId, membershipRequest: true, email})
}

export const membershipRequestPut = (params: {clubId: Number, memberId: Number, status: string, comments: string, email: any}) => {
    return put("/club", null, params)
}

export const getClubCounts = (clubId: string | null) => {
    return get("/club", {clubId, counts: "true"})
}

export const removeMember = (clubId: number, memberId: number, email: string) => {
    return del("/club/member", { clubId, memberId, email }, null)
}