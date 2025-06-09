import { del, get, post, put } from '@/src/utils/api'

export interface Member {
    memberId: number | string | undefined;
    firstName: string;
    lastName?: string;
    phone?: number;
    email?: string;
    photo?: string;
    updatedBy?: string | undefined;
    role?: string;
    isRegistered?: number,
    createdTs?: string,
    updatedTs?: string
}


export const getMemberDetails = (memberId: number) => {
    return get("/member", { memberId })
}


export const getMemberByPhone = (phone: string | undefined) => {
    return get("/member", { phone: phone })
}

export const getMemberByEmail = (email: string) => {
    return get("/member", { email: email })
}

export const regirsterMember = (member: any) => {
    return post("/member", null, member)
}

export const getMyRequests = (memberId: number) => {
    return get("/member", { memberId, requests: "true" })
}

export const saveMemberDetails = (memberId: number, firstName: string | undefined, 
    lastName: string | undefined, phone: number | undefined, 
    email: string | undefined, updatedBy: string | undefined) => {
    return put("/member", null, { memberId, firstName, lastName, phone, email, updatedBy })
}

export const verifyMemberAndUpdate = (memberInfo: Member | null) => {
    return put("/member", null, {...memberInfo, isRegistered: 1, updatedBy: memberInfo?.email, verify:true})
}

export const getUsers = (limit: number, offset: number) => {
    return get("/member", {limit, offset})
}
