import { ClubMemberAttribute } from "../types/member";
import { del, get, post, put } from "../utils/http/api";

export const getClubs = (memberId: number) => {
    return get("/club", {memberId: memberId})
}

export const createClub = (clubName: string | null, clubDescription: string | null, location: string | null, clubmemberId: string, email: string) => {
    return post("/club", null, {clubName, clubDescription, location, memberId: clubmemberId, email})
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
    return post("/club/member/request", null, {memberId, clubId, membershipRequest: true, email})
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

export const getClubMember = async ( clubId: number, memberId: number) => {
    return get("/club/member", {memberId, clubId})
}

export const saveClubMember = (clubId: string, memberId: number, firstName: string | undefined, lastName: string | undefined, phone: number | undefined, email: string | undefined, role: string | undefined, dateOfBirth: Date | undefined, updatedBy: string | undefined) => {
    return put("/club/member", null, {clubId, memberId, firstName, lastName, phone, email, updatedBy, role, dateOfBirth})
}

export const addClubMemberAttribute = async (clubId: string, attributeName: string, required: boolean, email: string) => {
    return post("/club/member/attribute", null, {clubId, attributeName, required, email, addClubMemberAttribute: true})
}


export const saveClubMemberAttribute = async (clubMemberAttributeId: number | null, attributeName: string, required: boolean, email: string) => {
    return put("/club/member/attribute", null, {clubMemberAttributeId, attributeName, required, email, editClubMemberAttribute: true})
}

export const deleteClubMemberAttribute = async (clubMemberAttributeId: number | null) => {
    return del("/club/member/attribute", {clubMemberAttributeId, deleteClubMemberAttribute: true}, null)
}

export const saveClubMemberAttributeValues = (clubId: any, memberId: number, updatedCMAList: ClubMemberAttribute[], email:string) => {
    return put("/club/member/attribute", null, { clubId, memberId, updatedCMAList, saveClubMemberAttributeValues: true, email})
}

export const getClubMemberAttributesReport = (clubId: number, clubMemberAttributeIds: number[]) => {
    return get("/club/report/memberattribute", { clubId, clubMemberAttributeIds:  clubMemberAttributeIds.join(',') })
}