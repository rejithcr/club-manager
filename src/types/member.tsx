export type ClubMemberAttribute = {
  clubMemberAttributeId: number;
  attribute: string;
  attributeValue: string;
  required: number;
  selected?: boolean;
};

export interface Member {
    memberId: number | string | undefined;
    firstName: string;
    lastName?: string;
    phone?: number;
    email?: string;
    photo?: string;
    updatedBy?: string | undefined;
    dateOfBirth?: Date;
    role?: string;
    isRegistered?: number,
    createdTs?: string,
    updatedTs?: string,
    lastAccessedOn?: string,
    roleName?: string;
}