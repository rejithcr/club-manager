import { get, post } from '@/src/utils/api'

export interface Member {
    memberId: number;
    firstName: string;
    lastName?: string;
    phone?: number;
    email?: string;
}


export const getMemberDetails = (memberId: number) => {
    return get("/member", {memberId})
}


export const getMemberByPhone = (phone: string|undefined) => {
    return get("/member", {phone: phone})
}

export const getMemberByEmail = (email: string) => {
    return get("/member", {email: email})
}

export const regirsterMember = (member: any) => {
    return post("/member", null, member)
}

export const getMyRequests = (memberId: number) => {
    return get("/member", {memberId, requests:"true"})
}