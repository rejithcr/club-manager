import { createContext } from "react";

export const MemberRoleContext = createContext<{
    memberRoles: Record<number, string>;
    setMemberRoles: (roles: Record<number, string>) => void;
}>({ memberRoles: {}, setMemberRoles: () => { } });
