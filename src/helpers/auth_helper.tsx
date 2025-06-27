import { post } from "../utils/http/api"

export const authenticateMember = (email: string, gToken: string | undefined) => {
    return post("/auth", null, { email: email, gToken: gToken })
}